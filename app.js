require('dotenv').config();
const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const port = process.env.PORT || 80;

const cookieParser = require("cookie-parser");
const auth = require("./static/middleware/auth");


require("./static/db/conn");
const Register = require("./static/models/register");
const { METHODS } = require('http');







// EXPRESS SPECIFIC STUFF
app.use(express.json());
app.use(cookieParser());
app.use('/static', express.static('static')) 
app.use(express.urlencoded({ extended: false }));


// PUG SPECIFIC STUFF
app.set('view engine', 'pug') 
app.set('views', path.join(__dirname, 'views'))




    //  GET METHODS  
   

app.get('/Secure', auth, (req, res) => {
    res.render('Secure.pug');
})


app.get("/logout",auth, async(req, res ) =>{
    try {
       
        res.clearCookie("jwt");
        console.log("logout Succesfully")
        await res.render("login")
    } catch (error) {
        res.status(500).send(error);
        
    }
})




app.get('/', (req, res) => {
    const params = {}
    res.status(200).render('login.pug', params);
})



app.get('/signup', (req, res) => {
    const params = {}
    res.status(200).render('signup.pug', params);
})

app.get('/login', (req, res) => {
    const params = {}
    res.status(200).render('login.pug', params);
})




    //    POST METHODS 


    
app.post("/register", async (req, res) => {
    try {
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;

        if (password === cpassword) {
            const registerSchema = new Register({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                confirmpassword: req.body.confirmpassword
            })


            const token = await registerSchema.generateautotoken();


            const registerd = await registerSchema.save();
            res.status(201).render("login")

        } else {
            res.send("password not match")
        }

    } catch (error) {
        res.status(400).send("item was not saved to the databse")
    }
})




app.post("/Login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const useremail = await Register.findOne({ email: email })

        const isMatch = await bcrypt.compare(password, useremail.password);

        const token = await useremail.generateautotoken();

            // Send COOKIE() as a Response

        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 99000*5),
            httpOnly: true,
        })



        if (isMatch) {
            res.status(201).render("Secure")
        } else {
            res.send("invalid password details")
        }

    } catch (error) {
        res.status(400).send('enter valid details')

    }

})




// START THE SERVER
app.listen(port, () => {
    console.log(`The Server started Successfully on port ${port}`);
});


