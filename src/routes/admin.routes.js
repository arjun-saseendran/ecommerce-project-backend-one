import express from "express";
import { addProduct } from "../controllers/product.controllers.js";
import { authAdmin } from "../middlewares/auth.middlewares";
import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, image, cd) => {
    cd(null, "src/public/product_images");
  },
  filename: (req, image, cb) => {
    cb(null, Date.now() + image.originalname);
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

router.post("/add-product", authAdmin, upload.single("image"), addProduct);

export default router;
