const Joi = require("joi")
const jwt = require("jsonwebtoken")
const { User } = require("../models/user")
const bcrypt = require("bcrypt")
const router = require('express').Router(); 
// Joi to validate the input

router.post("/", async (req, res) =>{
    const schema = Joi.object({
        email: Joi.String().min(3).max(200).email().required(),
        password: Joi.String().min(6).max(200).required()
    })
   const { error } = schema.validate(req.body)
   if(error) return res.status(400).send(error.details[0].message)
   // check whether the user exists
   try{
       let user = await User.findOne({ email: req.body.email })
       if(!user) return res.status(400).send("Invalid Email or Password...")

    //    bcrypt to compare the password
    const validpassword = await bcrypt.compare(req.body.password, user.password)
    if(!validpassword)return res.status(400).send("Invalid Email or Password...")

    // generate a token => client
    const secretKey = process.env.SECRET_KEY
    const token = jwt.sign({ _id: user._id, name: user.name, email: user.email }, secretKey)
    res.send(token)


   } catch(error){
       res.status(500).send(error.message)
       console.log(error.message)
   }

})
module.exports = router