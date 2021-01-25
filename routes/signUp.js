// ========1
// validate the data using joi
const Joi = require("joi")
const jwt = require("jsonwebtoken")
const router = require('express').Router(); 
const { User } = require("../models/user")
const bcrypt = require("bcrypt")


router.post("/", async(req, res) => {
    // create a joi schema to validate the data
    const schema = Joi.object({
        name: Joi.String().min(3).max(30).required(),
        email: Joi.String().min(3).max(200).email().required(),
        password: Joi.String().min(6).max(200).required()
    })
   const { error } = schema.validate(req.body)
   if(error) return res.status(400).send(error.details[0].message)
   
   // ========2
   // check if the user exists
   try{
       let user = await User.findOne({ email: req.body.email })
       if(user) return res.status(400).send("User with that email already exist...")

    //    save it to the database
    const { name, email, password } = req.body
    user = new User({
        name, email, password
    })
    // generate salt
    const salt = await bcrypt.genSalt(10)
    // hash the passsword
    user.password = await bcrypt.hash(user.password, salt)
    await user.save()

    // generate a token => client
    const secretKey = process.env.SECRET_KEY
    const token = jwt.sign({ _id: user._id, name: user.name, email: user.email }, secretKey)
    res.send(token)

    res.send("User Created")

   } catch(error){
       res.status(500).send(error.message)
       console.log(error.message)
   }
})

module.exports = router