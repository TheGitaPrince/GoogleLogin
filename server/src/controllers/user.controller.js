import { UserModel } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendEmail }from "../utils/sendEmail.js";
import { generateAccessAndRefreshTokens } from "../utils/generateToken.js";
import { generateOtp } from "../utils/generateOtp.js";
import { OAuth2Client } from "google-auth-library";
import { emailTemplate } from "../utils/emailTemplate.js"


export const createUser = asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email ) {
    throw new ApiError(400, "Name and Email are required.")
  }

  const existedUser = await UserModel.findOne({ email });
  if ( existedUser ) {
    throw new ApiError(409, "User with this email already exists.");
  }

  const { otp, otpExpires } = generateOtp();

  const user = await UserModel.create({
      name,
      email,
      otpExpires,
      otp
  });
 
  await sendEmail({
        sendTo: email,
        subject: "Signup OTP - GoogleLogin",
        html: emailTemplate({
            name: user.name,
            otp
        })
  })

  return res
    .status(200)
    .json( new ApiResponse( 200, {}, "OTP sent to your email for signup.") )
});

export const verifyOtp = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp ) {
      throw new ApiError(400, "Email and OTP required")
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
       throw new ApiError(400, "Invalid email or OTP");
    }
    if(user.otp !== otp || user.otpExpires < new Date()){
        throw new ApiError(400, "OTP expired or invalid")
    }

    user.otp = null;
    user.otpExpires = null;
    await user.save();

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    const cookiesOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, cookiesOptions)
    .cookie("refreshToken", refreshToken, cookiesOptions)
    .json( new ApiResponse( 200, { user, accessToken, refreshToken }, "User logged In Successfully" ))
})

export const loginUser = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if( !email ){
        throw new ApiError(400, "Email is required")
    }

    const user = await UserModel.findOne({ email });
    if( !user ){
        throw new ApiError(400, "User not found. Please login first.")
    }

    const { otp, otpExpires } = generateOtp();
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    await sendEmail({
        sendTo: email,
        subject: "Login OTP - GoogleLogin",
        html: emailTemplate({
            name: user.name,
            otp
        })
    })

    return res
    .status(200)
    .json( new ApiResponse( 200, {}, "OTP sent to your email for Login." ))
})

export const googleLogin = asyncHandler(async (req, res) => {
    const { tokenId } = req.body;
    if (!tokenId) {
        throw new ApiError(400, "Google Token ID is required.");
    }

    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
         idToken: tokenId,
         audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;
    if (!email) {
        throw new ApiError(400, "Google account doesn't have an email associated.");
    }

    let user = await UserModel.findOne({ email });
    if( !user ){
       user = await UserModel.create({ name, email, googleId });
    }else{
        if( !user.googleId ){
            user.googleId = googleId;
            user.name = name;
            await user.save();
        }
    }    

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    const cookiesOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, cookiesOptions)
    .cookie("refreshToken", refreshToken, cookiesOptions)
    .json( new ApiResponse( 200, { user, accessToken, refreshToken }, "User logged In Successfully" ))
})   

export const logoutUser = asyncHandler(async (req, res) => {
     await UserModel.findByIdAndUpdate(
        req.user._id,
        {
             $unset: { refresh_token: "" }
        },
        {
            new: true
        }
    )

    const cookiesOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    }

    return res
    .status(200)
    .clearCookie("accessToken", cookiesOptions)
    .clearCookie("refreshToken", cookiesOptions)
    .json(new ApiResponse(200, null , "User logged Out Successfully"))
})
