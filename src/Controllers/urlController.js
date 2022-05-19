const urlModel = require('../Models/urlModel')
const shortid = require('shortid')
const validUrl = require('valid-url')
const redis = require("redis");

const { promisify } = require("util");
const { url } = require('inspector');

//Connect to redis
const redisClient = redis.createClient(
    14257,
    "redis-14257.c212.ap-south-1-1.ec2.cloud.redislabs.com",
    { no_ready_check: true }
);
redisClient.auth("ZxMHtHLrs8g1pQYmlMjCHEuoYSsvmJOX", function (err) {
    if (err) throw err;
});

redisClient.on("connect", async function () {
    console.log("Connected to Redis..");
});



//1. connect to the server
//2. use the commands :

//Connection setup for redis



const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    if (typeof value === 'number' && value.toString().trim().length === 0) return false
    return true
}

const isValidRequestBody = function (request) {
    return (Object.keys(request).length > 0)
}


const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/                                      // /^(ftp|http|https):\/\/[^ "]+$/

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);



const createShortUrl = async function (req, res) {
    try {

        const longUrl = req.body.longUrl

        if (!isValidRequestBody(longUrl))
            return res.status(400).send({ status: false, message: "No input by user" })

        if (!isValid(longUrl))
            return res.status(400).send({ status: false, message: "longUrl is required." })

        if (!urlRegex.test(longUrl.trim()))
            return res.status(400).send({ status: false, message: " Please provide valid Url." })

        let baseUrl = "http://localhost:3000"

        if (!validUrl.isUri(baseUrl))
            return res.status(400).send({ status: false, message: "base Url is invalid " })

        const catchedData = await GET_ASYNC(`${longUrl}`)
        if (catchedData) {
            return res.status(200).send({ status: true, data: catchedData })
        }


        const alreadyExistUrl = await urlModel.findOne({ longUrl: longUrl })

        if (alreadyExistUrl) {

            await SET_ASYNC(`${longUrl}`, JSON.stringify(alreadyExistUrl))
            return res.status(400).send({ status: false, message: `${longUrl} is already exist` })
        }

        let shortUrlCode = shortid.generate()

        const alreadyExistCode = await urlModel.findOne({ urlCode: shortUrlCode })

        if (alreadyExistCode)
            return res.status(400).send({ status: false, message: "Short Code is already exist" })

        let shortUrl = baseUrl + '/' + shortUrlCode

        const alreadyShortUrl = await urlModel.findOne({ shortUrl: shortUrl })
        if (alreadyShortUrl)
            return res.status(400).send({ status: false, message: `${shortUrl} is already exist` })

        const generateUrl = {
            longUrl: longUrl,
            shortUrl: shortUrl,
            urlCode: shortUrlCode
        }

        const createUrl = await urlModel.create(generateUrl)


        return res.status(201).send({ status: false, message: "Successfully created", data: createUrl })



    }
    catch (err) {
        return res.status(500).send({ status: false, message: "Error", error: err.message })
    }
}

const getorignalUrl = async function (req, res) {
    try {
        let url = req.params.urlCode

        // if (!isValid(url))
        //     return res.status(400).send({ status: false, message: "Url is required." })


        let urlCode = await GET_ASYNC(`${req.params.urlCode}`)
        let newCode = JSON.parse(urlCode)

        if (newCode) {

            return res.status(302).redirect(newCode.longUrl)

        }

        let newUrl = await urlModel.findOne({ urlCode: url })

        if (newUrl) {
            await SET_ASYNC(`${req.params.urlCode}`, JSON.stringify(newUrl.longUrl))
            return res.status(302).redirect(newUrl.longUrl);
        }
        else {
            return res.status(400).send({ status: false, message: "URL not found" })
        }

        // else{
        //     return res.status(404).send({status:false, message: "Bad request"})
        // }



    }

    catch (err) {
        return res.status(500).send({ status: false, message: "Error", error: err.message })
    }
}


module.exports.createShortUrl = createShortUrl
module.exports.getorignalUrl = getorignalUrl