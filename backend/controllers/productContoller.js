import Product from "../model/Product.js";
import cloudinary from "../config/cloudinary.js";


export const getproducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Internal server Error" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Internal server Error" });
  }
};

export const createProduct = async (req, res) => {
  const { name, price, description, category, stock } = req.body;
  let imageURL = "";
  try {
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageURL = result.secure_url;
    }
    const product = new Product({
      name,
      price,
      description,
      category,
      stock,
      imageURL,
    });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, description, category, stock } = req.body;
  let imageURL = "";
  try {
    // Find the existing product first
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Upload new image if provided
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageURL = result.secure_url;
    }

    // Update only changed fields
    const product = await Product.findByIdAndUpdate(
      id,
      {
        name: name || existingProduct.name,
        price: price || existingProduct.price,
        description: description || existingProduct.description,
        category: category || existingProduct.category,
        stock: stock || existingProduct.stock,
        imageURL: imageURL || existingProduct.imageURL,
      },
      { new: true },
    );

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
