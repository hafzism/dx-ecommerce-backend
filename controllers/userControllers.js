import Cart from "../models/carts.js";
import Order from "../models/orders.js";

///////cart fns//////////////////////
export async function getCart(req, res) {
  try {
    const user_id = req.session.userId;
    const carts = await Cart.find({ user_id }).populate("product_id");
    res.status(200).json({ result: carts });
  } catch (error) {
    res.status(403).json({ error: "some error hapedned" });
  }
}

export async function postCart(req, res) {
  try {
    const { product_id, quantity } = req.body;
    const qty = Number(quantity);
    const userId = req.session.userId;
    console.log(userId);
    if (!userId) {
  return res.status(401).json({ error: "User not logged in" });
}

    if (!product_id || !qty) {
      return res.status(400).json({ error: "product or qty reqquired" });
    }
    const ifCartItem = await Cart.findOne({ product_id, user_id: userId });
    if (ifCartItem) {
      ifCartItem.quantity += qty;
      await ifCartItem.save();
      return res.status(200).json({ message: "cart item updated" });
    }
    const create = await Cart.create({
      product_id,
      user_id: userId,
      quantity: qty,
    });
    return res
      .status(200)
      .json({ message: "added to cart successfully", create });
  } catch (error) {
    res.status(403).json({ error: "some error hapedned" });
    console.log(error);
  }
}

export async function putCart(req, res) {
  try {
    const cart_id = req.params.id;
    const { action } = req.body;

    const cart = await Cart.findById(cart_id);
    if (!cart) return res.status(404).json({ error: "Cart item not found" });

    if (action === "increase") cart.quantity++;
    else if (action === "decrease" && cart.quantity > 1) cart.quantity--;

    await cart.save();
    return res.status(200).json({ message: "Cart item updated", quantity: cart.quantity });
  } catch (error) {
    res.status(403).json({ error: "some error happened" });
  }
}


export async function deleteCart(req, res) {
  try {
    const cart_id = req.params.id;
    const deleted = await Cart.findByIdAndDelete(cart_id);
    return res
      .status(200)
      .json({ message: "cart item deleted,item is", deleted });
  } catch (error) {
    res.status(403).json({ error: "some errorh hapedned" });
  }
}

/////////////////////////////////orders

export async function getOrders(req, res) {
  try {
    const user_id = req.session.userId;
    const orders = await Order.find({ user_id })
      .select("_id total_price status createdAt")
      .sort({ createdAt: -1 });
    res.status(200).json({ orders });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
}

export async function getOrdersById(req, res) {
  try {
    const id = req.params.id;
    const order = await Order.findById(id)
      .populate("items.product_id", "name price")
      .populate("user_id", "username email");
    
    if (!order) return res.status(404).json({ error: "Order not found" });

    if (order.user_id._id.toString() !== req.session.userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    res.status(200).json({ order });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
}





// export async function postOrders(req, res) {
//   try {
//     const user_id = req.session.userId;
//     const cart = await Cart.find({ user_id }).populate("product_id");
//     if (cart.length === 0) {
//       return res.status(400).json({ error: "cart is empty" });
//     }
//     let orderitems = [];
//     let total_price = 0;
//     cart.forEach((item) => {
//       const quantity = item.quantity;
//       const price = item.product_id.price;
//       const product_id = item.product_id._id;
//       const item_total = quantity * price;
//       orderitems.push({ product_id, quantity, price, item_total });
//       total_price = total_price + item_total;
//     });
//     const orderdata = await Order.create({
//       user_id,
//       items: orderitems,
//       total_price,
//     });
//     await Cart.deleteMany({ user_id });
//     return res.status(200).json({ message: "order initialized", orderdata });
//   } catch (error) {
//     console.log(error);
//     res.status(403).json({ error: "some errorh hapedned" });
//   }
// }



export async function postOrders(req, res) {
  try {
    const user_id = req.session.userId;
    if (!user_id) return res.status(401).json({ error: "Not authenticated" });

    const { address } = req.body;

    if (
      !address ||
      !address.line1 ||
      !address.city ||
      !address.state ||
      !address.postal_code ||
      !address.country
    ) {
      return res.status(400).json({
        error:
          "Address incomplete. Required: line, city, state, postal_code, country",
      });
    }

    const cart = await Cart.find({ user_id }).populate("product_id");
    if (!cart || cart.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    let orderitems = [];
    let total_price = 0;
    cart.forEach((item) => {
      const quantity = item.quantity;
      const price = item.product_id.price;
      const product_id = item.product_id._id;
      const item_total = quantity * price;
      orderitems.push({ product_id, quantity, price, item_total });
      total_price += item_total;
    });

    const orderdata = await Order.create({
      user_id,
      items: orderitems,
      total_price,
      address,
    });

    await Cart.deleteMany({ user_id });

    return res.status(201).json({ message: "Order placed", orderdata });
  } catch (error) {
    console.error("postOrders error:", error);
    return res.status(500).json({ error: "some error happened" });
  }
}