import express from 'express'
import { adminAddCategories, adminAddProducts, adminDeleteCategories, adminDeleteOrders, adminDeleteProducts, adminDisableUsers, adminEnableUsers, adminloginfn, adminUpdateCategories, adminUpdateOrders, adminUpdateProducts, adminViewCategories, adminViewOrders, adminViewProducts, adminViewUsers } from '../controllers/adminControllers.js'
import { validateLogin } from '../middlewares/validate.js'
import { isAdmin } from '../middlewares/auth.js'
const router = express.Router()

router.post('/login',validateLogin,adminloginfn)

router.use(isAdmin)
router.get('/users',adminViewUsers)


router.get('/products',adminViewProducts)
router.post('/products',adminAddProducts)
router.put('/products/:id',adminUpdateProducts)
router.delete('/products/:id',adminDeleteProducts)

router.get('/categories',adminViewCategories)
router.post('/categories',adminAddCategories)
router.put('/categories/:id',adminUpdateCategories)
router.delete('/categories/:id',adminDeleteCategories)

router.get('/orders',adminViewOrders)
router.put('/orders/:id',adminUpdateOrders)
router.delete('/orders/:id',adminDeleteOrders)

router.post('/users/:id/enable',adminEnableUsers)
router.post('/users/:id/disable',adminDisableUsers)

export default router