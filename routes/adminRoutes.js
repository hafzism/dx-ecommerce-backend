import express from 'express'
import { adminloginfn } from '../controllers/adminControllers.js'
import { validateLogin } from '../middlewares/validate.js'
import { isAdmin } from '../middlewares/auth.js'
const router = express.Router()

router.post('/login',validateLogin,adminloginfn)

router.use(isAdmin)

export default router