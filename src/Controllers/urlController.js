const mongoose = require('mongoose')
const urlModel = require('../Models/urlModel')
const shortid = require('shortid')
const validUrl = require('valid-url')

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



const createShortUrl = async function (req, res) {
    try {
        let longUrl = req.body.longUrl

        if (!isValidRequestBody(longUrl)) 
        return res.status(400).send({ status: false, message: "No input by user" })

        if (!isValid(longUrl))
        return res.status(400).send({ status: false, message: "longUrl is required." })

        if (!urlRegex.test(longUrl.trim())) 
        return res.status(400).send({ status: false, message: " Please provide valid Url." })

        let baseUrl = "http://localhost:3000"

        if (!validUrl.isUri(baseUrl))
        return res.status(400).send({ status: false, message: "base Url is invalid " })

        const alreadyExistUrl = await urlModel.findOne({longUrl:longUrl})

        if (alreadyExistUrl)
        return res.status(400).send({ status: false, message: `${longUrl} is already exist` })

        let shortUrlCode = shortid.generate()

        const alreadyExistCode = await urlModel.findOne({urlCode:shortUrlCode})

        if (alreadyExistCode)
        return res.status(400).send({ status: false, message: "Short Code is already exist" })

        let shortUrl = baseUrl+'/'+shortUrlCode

        const alreadyShortUrl = await urlModel.findOne({shortUrl:shortUrl})
        if (alreadyShortUrl)
        return res.status(400).send({ status: false, message: `${shortUrl} is already exist` })

        const generateUrl = {
            longUrl:longUrl,
            shortUrl:shortUrl,
            urlCode:shortUrlCode
        }

        const createUrl = await urlModel.create(generateUrl)
        return res.status(201).send({ status: false, message: "Successfully created", data:createUrl })



    }
    catch (err) {
        return res.status(500).send({ status: false, message: "Error", error: err.message })
    }
}

const getorignalUrl = async function(req,res){
    try{
    let urlCode = req.params.urlCode

    if (!isValidRequestBody(urlCode)) 
    return res.status(400).send({ status: false, message: "No input by user" })

    if (!isValid(urlCode))
    return res.status(400).send({ status: false, message: "url Code is required." })

    

    const findUrlCode = await urlModel.findOne({urlCode:urlCode})

    if(findUrlCode){

    // let newUrl = JSON.parse(JSON.stringify(findUrlCode.longUrl))
        
    return res.status(302).redirect(findUrlCode.longUrl)
    }

    }
    catch (err) {
        return res.status(500).send({ status: false, message: "Error", error: err.message })
    }
}


module.exports.createShortUrl = createShortUrl
module.exports.getorignalUrl = getorignalUrl