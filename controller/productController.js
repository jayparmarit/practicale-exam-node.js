import HttpError from "../middlewares/HttpError.js";
import Product from "../model/Product.js";
import cloudinary from "../config/cloudinary.js";

const add = async (req, res, next) => {
  try {
    const { title, description, price, category, stock, status } = req.body;

    if (
      !title ||
      !description ||
      price === undefined ||
      !category ||
      stock === undefined ||
      !req.file
    ) {
      return next(new HttpError("All fields are required", 400));
    }

    const existingProduct = await Product.findOne({ title });

    if (existingProduct) {
      return next(new HttpError("Product already exist", 400));
    }

    const newProduct = new Product({
      title,
      description,
      price,
      category,
      stock,
      imageURL: req.file.path,
      cloudinaryId: req.file.path,
      status,
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      message: "New product added successfully",
      newProduct,
    });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

const getAll = async (req, res, next) => {
  try {
    const products = await Product.find();

    res.status(200).json({
      success: true,
      message: "All products receive successfully",
      products,
    });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

const getById = async (req, res, next) => {
  try {
    const id = req.params.id;

    const product = await Product.findById(id);

    if (!product) {
      return next(new HttpError("Product not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Product receive successfully",
      product,
    });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

const update = async (req, res, next) => {
  try {
    const id = req.params.id;

    const { title } = req.body;

    const product = await Product.findById(id);

    if (!product) {
      return next(new HttpError("Product not found", 404));
    }

    if (title && title !== product.title) {
      const existingProduct = await Product.findOne({ title });

      if (existingProduct) {
        return next(new HttpError("Product title already exist", 400));
      }
    }

    const update = Object.keys(req.body);

    let allowedFields = [
      "title",
      "description",
      "price",
      "category",
      "stock",
      "imageURL",
    ];

    const isValid = update.every((filed) => allowedFields.includes(filed));

    if (!isValid) {
      return next(new HttpError("Only allow field can be updated", 400));
    }

    update.forEach((field) => (product[field] = req.body[field]));

    if (req.file) {
      if (product.cloudinaryId) {
        await cloudinary.uploader.destroy(product.cloudinaryId);
      }

      product.imageURL = req.file.path;
      product.cloudinaryId = req.file.filename;
    }

    if (product.stock <= 0) {
      product.status = "Inactive";
    } else {
      product.status = "Active";
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

const remove = async (req, res, next) => {
  try {
    const id = req.params.id;

    const product = await Product.findById(id);

    if (!product) {
      return next(new HttpError("Product not found", 404));
    }

    if (product.cloudinaryId) {
      await cloudinary.uploader.destroy(product.cloudinaryId);
    }

    await Product.findByIdAndDelete(id);

    res
      .status(200)
      .json({ success: true, message: "Product delete successfully" });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

export default { add, getAll, getById, update, remove };
