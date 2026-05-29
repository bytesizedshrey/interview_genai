import express from 'express'
import authRouter from './routes/auth.routes.js';
import cookieParser from 'cookie-parser'

const app = express()

//middleware
app.use(express.json())
app.use(cookieParser())

/**
 * the prefix for apis
 */
app.use('/api/auth',authRouter)

export default app
