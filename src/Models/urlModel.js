const mongoose = require ("mongoose")



let validateUrl = function(longUrl) {
    let longUrlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/ ;
    return longUrlRegex.test(longUrl)
}

const urlSchema = new mongoose.Schema({
       
     urlCode : {
        type :  String,
        lowercase:true,
        required: [true, "Url Code is required"],
        unique: true,
        trim : true
    },
    longUrl: {
        type: String,
        required: [true, " longUrl is required"], 
        trim : true,
        validate:[validateUrl, "Please enter a valid Url"]
    },
    shortUrl: {
        type: String,
        required: [true, "shortUrl is required"],
        unique: true,
        trim : true
    }
    

}, {timestamps: true})

module.exports = mongoose.model("Url",urlSchema)
