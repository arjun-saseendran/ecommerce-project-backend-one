import { User } from "../models/user.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });
const salt = parseInt(process.env.SALT);

const signup = async (req, res) => {
  const { password } = req.body;
  console.log(password);

  bcrypt.hash(password, salt, (err, hash) => {
    if (hash) {
      console.log(hash);

      const newUser = new User(req.body);
      newUser.password = hash;
      newUser
        .save()
        .then((response) => {
          console.log(response);

          res.status(201).json({ message: "Signup succefull" });
        })
        .catch((error) => {
          console.log(error);

          res.status(400).json({ message: "Something went wrong" });
        });
    } else {
      res.status(400).json({ message: "Somethig went wrong" });
    }
  });
};

const login = (req, res) => {
  console.log("req.body ", req.body);

  const { email, password } = req.body;
  User.findOne({ email })
    .then((loginUser) => {
      if (loginUser) {
        bcrypt.compare(password, loginUser.password, (err, success) => {
          if (success) {
            const accessToken = jwt.sign({ email }, process.env.JWT_SECRET, {
              expiresIn: "15m",
            });

            const refreshToken = jwt.sign({ email }, process.env.JWT_SECRET, {
              expiresIn: "30d",
            });

            console.log(accessToken, refreshToken);

            res.status(200).json({ accessToken, refreshToken });
          } else {
            res.status(400).json({ message: "Invalid credentials" });
          }
        });
      } else {
        res.status(404).json({ message: "Invalid email id" });
      }
    })
    .catch((error) => res.status(400).json({ message: "Invalid credentials" }));
};

const getTokenFromRefreshToken = (req, res) => {
  const { refreshToken } = req.cookies;

  const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
  const accessToken = jwt.sign(
    { email: decoded.email },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  res.status(200).json({ accessToken });
};

export { signup, login, getTokenFromRefreshToken };
