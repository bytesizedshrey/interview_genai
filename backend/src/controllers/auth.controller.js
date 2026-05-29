import { model } from "mongoose";
import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import tokenBlacklistModel from "../models/blacklist.model.js";

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */
async function registerUserController(req, res) {
    const {username,email,password} = req.body

    if(!username || !email || !password){
        return res.status(400).json({
            message : "please provide email,username or password"
        })
    }

    const isUserAlreadyExists = await userModel.findOne({
        $or : [{username},{email}]
    })

    if(isUserAlreadyExists){
        return res.status(400).json({
            message : "Account already exists with given credentials"
        })
    }

    //password hashed
    const hash = await bcrypt.hash(password,10)

    //user created
    const user = await userModel.create({
        username,
        email,
        password : hash
    })
    //creating token
    const token = jwt.sign(
        {id : user._id, username : user.username},
        process.env.JWT_SECRET,
        {expiresIn : "1d"}
    )
    //set token into cookie
    res.cookie("token",token) //cookie name , value stored inside the cookie

    //response you send back after successful registration.
    res.status(201).json({
        message : 'user registered successfully',
        user : {
            id : user._id,
            username : user.username,
            email:user.email
        }
    })
    
}
/**
 * @route POST /api/auth/login
 * @description login the user, expects email and password in req body
 * @access Public
 */
async function loginUserController(req,res) {
    const {email, password} = req.body

    const user = await userModel.findOne({email})

    if(!user){
        return res.status(400).json({
            message : 'Invalid email or password'
        })
    }

    const isPasswordValid = await bcrypt.compare(password,user.password) //password and password from db

    if(!isPasswordValid){
        return res.status(400).json({
            message : 'invalid email or password'
        })
    }

    const token = jwt.sign(
       {id : user._id, username : user.username},
       process.env.JWT_SECRET,
       {expiresIn : '1d'}
    )

    res.cookie('token',token)
    res.status(200).json({
        message : 'user logged successfully',
        user : {
            id : user._id,
            username : user.username,
            email : user.email
        }
    })
}

/**
 * @route GET /api/auth/logout
 * @description clear token from user cookie and add the token in the blacklist
 * @access Public
 */
async function logoutUserController(req,res) {
    const token = req.cookies.token

    if(token){
        await tokenBlacklistModel.create({token})
    }

    res.clearCookie("token")

    res.status(200).json({
        message : 'user logged out successfully.'
    })
}

/**
 * @route GET /api/auth/get-me
 * @description get the current logged in user details
 * @access Private
 */
async function getMeController(req,res) {
    const user = await userModel.findById(req,user.id)

    res.status(200).json({
        message : "user details fetched suncessfully.",
        user : {
            id : user._id,
            username : user.username,
            email : user.email
        }
    })
}

export default {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
}