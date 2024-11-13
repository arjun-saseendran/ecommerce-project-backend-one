import Cart from "../models/cart.models.js";

const renderCartItems = (req, res) => {
  res.send("All cart items");
};

const addToCart = (req, res) => {
  const { user, product, quantity } = req.body;
  const cartItem = new Cart(user._id, product._id, quantity);
  cartItem
    .save()
    .then((cart) => res.json(cart))
    .catch((error) => {
      console.log(error);
      res.status(400).json(error);
    });
};

export { renderCartItems, addToCart };