import { Router } from "express";
import { createUser, verifyOtp, loginUser, googleLogin, logoutUser } from "../controllers/user.controller.js";
import { veriyfyJWT } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.route("/create-user").post( createUser );
userRouter.route("/verify-otp").post( verifyOtp );
userRouter.route("/login-user").post( loginUser );
userRouter.route("/google-login").post( googleLogin );
userRouter.route("/logout-user").post( veriyfyJWT, logoutUser );

export default userRouter