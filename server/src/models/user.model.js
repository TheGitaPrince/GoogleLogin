import mongoose,{ Schema }  from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    googleId:{
        type: String,
    },
    otp:{
        type: String,
        default:""
    },
    otpExpires:{
        type: Date
    },
    refresh_token:{
        type: String,
        default:""
    },
},{ timestamps: true})

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id   
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const UserModel = mongoose.model("User",userSchema)