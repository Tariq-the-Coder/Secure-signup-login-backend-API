const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");





// MONGO SCHEMA 

const registerSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,

    },
    confirmpassword: {
        type: String,
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})



//   GENERATING TOKENS

registerSchema.methods.generateautotoken = async function () {
    try {
        console.log(this._id);
        const token = jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token: token })
        await this.save();
        return token;

    } catch (error) {
        res.send("the error part" + error);
    }
}





// Bcrypt password SECURE PASSWORD 

registerSchema.pre("save", async function (next) {

    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
        this.confirmpassword = await bcrypt.hash(this.password, 10);

    }

    next();
})


    // COLLECTION 
    
const Register = new mongoose.model('Register', registerSchema);

module.exports = Register;
