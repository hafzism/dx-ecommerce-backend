import express from "express";
import { isAuth } from "../middlewares/auth.js";
import {
  getCart,
  postCart,
  putCart,
  deleteCart,
  getOrdersById,
  postOrders,
  getOrders,
} from "../controllers/userControllers.js";
const router = express.Router();

router.use("/cart", isAuth);

router.route("/cart").get(getCart).post(postCart);
router.route("/cart/:id").put(putCart).delete(deleteCart);

router.use("/orders", isAuth);

router.route("/orders").get(getOrders).post(postOrders);

router.route("/orders/:id").get(getOrdersById);
export default router;
