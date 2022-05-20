const mongoose = require ("mongoose")


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
        trim : true
        
    },
    shortUrl: {
        type: String,
        required: [true, "shortUrl is required"],
        unique: true,
        trim : true
    }
    

}, {timestamps: true})

module.exports = mongoose.model("Url",urlSchema)
