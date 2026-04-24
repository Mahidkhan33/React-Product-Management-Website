const Product = require("../models/product.model");

exports.getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", category = "" } = req.query;
    
    let query = {};
    
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }
    
    if (category) {
      query.category = category;
    }
    
    const skip = (page - 1) * limit;
    
    const products = await Product.find(query)
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Product.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: products
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ id: Number(req.params.id) });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }
    
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { title, price } = req.body;
    
    if (!title || !price) {
      return res.status(400).json({
        success: false,
        message: "Title and price are required fields"
      });
    }
    
    const product = await Product.create(req.body);
    
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { id: Number(req.params.id) },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ id: Number(req.params.id) });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};