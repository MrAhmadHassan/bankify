const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:[true,"user name is required"],
            minLength:[3,"username must be greater  than 3 characters"],
            maxLength:[15,"user name must be less than 15 characters long"]
        } ,
        email: {
            type:String,
            required:[true,"user email is required."]
        }
            ,
        password: String,
        isAdmin:{
            type:Boolean
        }
    });
const User = mongoose.model('User', userSchema);

module.exports = User;