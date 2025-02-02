import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";

const authUser = async (req, res, next) => {
  const token = req.cookies.accessToken || req.header("Authorization");

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.email) {
        req.user = await User.findOne({ email: decoded.email });
        next();
      } else {
        res.status(401).json({ message: "Invalid token" });
      }
    } catch (error) {
      res.status(401).json({ message: "Invalid token" });
    }
  } else {
    res.status(401).json({ message: "Unauthorized user" });
  }
};

const authAdmin = async (req, res, next) => {
  const token = req.cookies.accessToken || req.header("Authorization");
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.email) {
        const user = await User.findOne({ email: decoded.email });
        if (user.isAdmin) {
          console.log(user.isAdmin);
          
          next();
        }
      } else {
        res.status(401).json({ message: "Invalid token" });
      }
    } catch (error) {
      res.status(401).json({ message: "Invalid token" });
    }
  } else {
    res.status(401).json({ message: "Unauthorized admin" });
  }
};

export { authUser, authAdmin };
