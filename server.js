const express = require('express')
const mongoose = require('mongoose')

// Initiate the app
const app = express()

// dotenv
require("dotenv").config()

// Routes
const signUp = require("./routes/signUp")
const signIn = require("./routes/signIn")

// Defining ports
const connection_string = process.env.CONNECTION_STRING 
const PORT = process.env.PORT

app.use("api/signup", signUp)
app.use("api/signin", signIn)


app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}...`)
})
// mine

// Database connections
mongoose.Promise = global.Promise;
mongoose.connect(connection_string, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log(`Database connected successfully`))
  .catch(err => console.log(`Database Connection failed ${err.message}`));




  // initialize body parser to receive requests
// application.use(bodyParser.urlencoded({
//     extended: false
// }))

// Define our endpoints and routes
// application.get(`/`, (req, res, next) =>(
//     res.type(`txt`),
//     res.send(`One NACOSS!!! I love nacoss`)
// ))