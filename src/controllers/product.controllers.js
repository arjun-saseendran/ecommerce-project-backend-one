import Product from "../models/product.models.js";

const renderProducts = async (req, res) => {
  const products = await Product.find();
  if (products) {
    res.status(200).send(products);
  } else {
    res.status(404).send("Not found");
  }
};

const addProduct = (req, res) => {
  const product = new Product(req.body);
  if (product) {
  }
};

export { renderProducts };
