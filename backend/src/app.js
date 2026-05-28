import express from 'express'
import authRouter from './routes/auth.routes.js';

const app = express()

app.use(express.json())//middleware

/**
 * the prefix for apis
 */
app.use('/api/auth',authRouter)

export default app
