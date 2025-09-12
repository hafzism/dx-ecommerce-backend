import User from "../models/users.js";
import bcrypt from "bcrypt";

export async function adminloginfn(req, res) {
try {
      const { uname, pword } = req.body;
      const user = await User.findOne({ username: uname });
      if (!user) {
        return res.status(400).json("user not found");
      }
      if (user.role != "admin") {
        return res.status(400).json("this page only for admins");
      }
      const hashed = await bcrypt.compare(pword, user.password);
      if (!hashed) {
        return res.status(400).json("wrong password");
      }
      req.session.userId = user._id;
      req.session.role = user.role;
      return res.status(200).json("admin loogged in succcessfully........");
} catch (error) {
    res.status(500).json({ error: 'serber errror' });
}
}
