const mongoose = require("mongoose");


mongoose.connect('mongodb://localhost/register', { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
    
 }).then(() => {
     console.log(`Connection Succesful`);
 }).catch((e) => {
    console.log(`No DB Connection`)
 })
