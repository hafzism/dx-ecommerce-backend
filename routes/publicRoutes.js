import express from 'express'
import { validateRegister,validateLogin } from '../middlewares/validate.js'
const router = express.Router()
import { registerfn,  loginfn } from '../controllers/publicControllers.js'

router.post('/register',validateRegister,registerfn)
router.post('/login',validateLogin,loginfn)
    

export default router