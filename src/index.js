const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const route = require('./Routes/route')
const app = express()
const port = 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

mongoose.connect("mongodb+srv://Rubi_db:T2P9R5d5lWl7SRAF@cluster0.tvyoi.mongodb.net/group40Database",{
    useNewUrlParser : true
})

.then(()=>console.log("MongoDB is connected"))
.catch(err=>console.log(err))

app.listen(process.env.port || port, function() {
console.log("Express is running on port "+ (process.env.port || port))
})

app.use('/', route)
