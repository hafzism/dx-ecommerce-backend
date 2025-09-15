import express from "express";
import { validateRegister, validateLogin } from "../middlewares/validate.js";

const router = express.Router();
import {
  registerfn,
  loginfn,
  getProductsById,
  getCategories,
  getProducts,
  logout
} from "../controllers/publicControllers.js";

router.post("/register", validateRegister, registerfn);
router.post("/login", validateLogin, loginfn);

router.get("/products", getProducts);
router.get("/products/:id", getProductsById);

router.get("/categories", getCategories);
router.post('/logout',logout)
 
export default router;
