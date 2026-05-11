import HttpError from "../middlewares/HttpError.js";

import Product from "../model/Product.js";
import Cart from "../model/Cart.js";

const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId) {
      return next(new HttpError("Product id is required", 400));
    }

    const product = await Product.findById(productId);

    if (!product) {
      return next(new HttpError("Product not found", 404));
    }

    if (product.stock <= 0) {
      return next(new HttpError("Product out of stock", 400));
    }

    let cartItem = new Cart.findOne({
      user: req.user._id,
      product: productId,
    });

    if (cartItem) {
      cartItem.quantity += quantity || 1;

      await cartItem.save();
    }
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

export default { addToCart };
