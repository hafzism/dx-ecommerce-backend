import User from "../models/users.js";
import bcrypt from "bcrypt";
import Product from "../models/products.js";
import Category from "../models/categories.js";
import Order from "../models/orders.js";

export async function adminloginfn(req, res) {
  try {
    const { uname, pword } = req.body;
    const user = await User.findOne({ username: uname });
    if (!user) {
      return res.status(400).json("user not found");
    }
    if (user.role != "admin") {
      return res.status(400).json({ error: "this page only for admins" });
    }
    const hashed = await bcrypt.compare(pword, user.password);
    if (!hashed) {
      return res.status(400).json({ error: "wrong password" });
    }
    req.session.userId = user._id;
    req.session.role = user.role;
    return res
      .status(200)
      .json({ message: "admin loogged in succcessfully........" });
  } catch (error) {
    res.status(500).json({ error: "serber errror" });
  }
}
///////////////////////////////////////////////////////////////////////////////////////////todo

export async function adminViewUsers(req, res) {
  try {
    const users = await User.find({ role: "user" });
    res.status(200).json({ users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "serber errror" });
  }
}

export async function adminViewProducts(req, res) {
  try {
    const products = await Product.find().populate("category");
    res.status(200).json({ products });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "serber errror" });
  }
}

export async function adminAddProducts(req, res) {
  try {
    const { name, price, description, category } = req.body;

    const result = await Product.create({
      name,
      price,
      description,
      category,
      image: req.file ? `/uploads/${req.file.filename}` : null,
    });

    res.status(200).json({ success: true, result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "server error" });
  }
}

export async function adminUpdateProducts(req, res) {
  try {
    const { name, category, price, description } = req.body;
    const updateData = { name, category, price, description };
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    res.status(200).json({ updated });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "serber errror" });
  }
}

export async function adminDeleteProducts(req, res) {
  try {
    const id = req.params.id;
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(400).json({ message: "no object found to delete." });
    }
    res.status(200).json({ deleted });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "serber errror" });
  }
}

/////////////////////////////////////////////////////categories crud//////////////

export async function adminViewCategories(req, res) {
  try {
    const result = await Category.find();
    res.status(200).json({ result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "serber errror" });
  }
}

export async function adminViewSpecificCategories(req, res) {
  try {
    const id = req.params.id;
    const result = await Category.findById(id);
    res.status(200).json({ result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "serber errror" });
  }
}

export async function adminAddCategories(req, res) {
  try {
    const { name, description } = req.body;
    const result = await Category.create({ name, description });
    res.status(200).json({ result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "serber errror" });
  }
}

export async function adminUpdateCategories(req, res) {
  try {
    const id = req.params.id;
    const toupdate = req.body;
    const updated = await Category.findByIdAndUpdate(id, toupdate, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ updated });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "serber errror" });
  }
}

export async function adminDeleteCategories(req, res) {
  try {
    const id = req.params.id;
    const products = await Product.find({ category: id });
    if (products.length > 0) {
      return res
        .status(400)
        .json({
          message: `there's ${products.length} product(s) in this category,so cant delete.`,
        });
    }
    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(400).json({ message: "no object found to delete." });
    }
    res.status(200).json({ deleted });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "serber errror" });
  }
}

//////////////////////////////////////////////////////////////////////////////orders

export async function adminViewOrders(req, res) {
  try {
    const orders = await Order.find()
      .populate("user_id")
      .populate("items.product_id", "name price");
    res.status(200).json({ orders });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "serber errror" });
  }
}

export async function adminUpdateOrders(req, res) {
  try {
    const id = req.params.id;
    const status = req.body.status;
    const updated = await Order.findByIdAndUpdate(
      id,
      { status },
      {
        new: true,
        runValidators: true,
      }
    );
    res.json({ updated });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "serber errror" });
  }
}

export async function adminDeleteOrders(req, res) {
  try {
    const id = req.params.id;
    const deleted = await Order.findByIdAndDelete(id);
    res.json({ deleted });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "serber errror" });
  }
}

/////////////////////////////////////////////////////

export async function adminEnableUsers(req, res) {
  try {
    const id = req.params.id;
    const updated = await User.findByIdAndUpdate(
      id,
      { isEnabled: true },
      {
        new: true,
        runValidators: true,
      }
    );
    res.json(updated);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "serber errror" });
  }
}

export async function adminDisableUsers(req, res) {
  try {
    const id = req.params.id;
    const updated = await User.findByIdAndUpdate(
      id,
      { isEnabled: false },
      {
        new: true,
        runValidators: true,
      }
    );
    res.json(updated);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "serber errror" });
  }
}

export async function loadhome(req, res) {
  try {
    const userCount = await User.countDocuments();
    const productCount = await Product.countDocuments();
    const orderCount = await Order.countDocuments();
    const categoryCount = await Category.countDocuments();
    res
      .status(200)
      .json({ userCount, productCount, orderCount, categoryCount });
  } catch (error) {
    res.status(400).json({ error: "from serverside error" });
  }
}
