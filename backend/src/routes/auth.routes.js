import {Router} from 'express'
import authController from '../controllers/auth.controller.js';

const authRouter = Router()

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */
authRouter.post('/register',authController.registerUserController)

/**
 * @route POST /api/auth/login
 * @description login a new user
 * @access Public
 */
authRouter.post('/login',authController.loginUserController)

/**
 * @route GET /api/auth/logout
 * @description clear token from user cookie and add the token in the blacklist
 * @access Public
 */
authRouter.get('/logout',authController.logoutUserController)

export default authRouter