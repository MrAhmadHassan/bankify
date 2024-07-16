const mongoose = require("mongoose");



connectdb = async ()=>{


        await mongoose.connect('mongodb://localhost:27017/bankify')
        .then(()=>{
            console.log("Connection successful");
        }).catch((error)=>{
            console.log("unable to connect to db", error);
        })

    }


    module.exports = connectdb;