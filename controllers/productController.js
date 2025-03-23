const { Products } = require("../models/productModel");

const paginate = require("../utils/pagination");

const productController = {
  getAllProducts(req, res) {
    try {
      const { page, limit, offset } = paginate(req);

      const products = Products.getAll(limit, offset);

      const totalProducts = Products.countProducts();
      const totalPages = Math.ceil(totalProducts / limit);

      res.status(200).json({
        message: "Products retrieved successfully",
        products,
        pagination: {
          totalProducts,
          totalPages,
          currentPage: page,
          pageSize: limit,
        },
      });
    } catch (error) {
      console.error(error);

      res
        .status(500)
        .json({ message: "Error retrieving products", error: error.message });
    }
  },

  getProductById(req, res) {
    try {
      const { productId } = req;

      const product = Products.getById(productId);

      if (!product) {
        return res
          .status(404)
          .json({ message: `Product not found with ID ${productId}` });
      }

      res.status(200).json({
        message: "Product retrieved successfully",
        product,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Error retrieving product",
        error: error.message,
      });
    }
  },

  searchProducts(req, res) {
    try {
      const { page, limit, offset } = paginate(req);
      const { name } = req.query;

      if (!name) {
        return res.status(400).json({ message: "Search term is required" });
      }

      const products = Products.searchByName(name, limit, offset);

      if (products.length === 0) {
        return res
          .status(404)
          .json({ message: `No products found matching "${name}"` });
      }

      const totalProducts = products.length;
      const totalPages = Math.ceil(totalProducts / limit);

      res.status(200).json({
        message: "Products retrieved successfully",
        products,
        pagination: {
          totalProducts,
          totalPages,
          currentPage: page,
          pageSize: limit,
        },
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Error searching for products",
        error: error.message,
      });
    }
  },

  getProductsByCategory(req, res) {
    try {
      const { page, limit, offset } = paginate(req);
      const { categoryId } = req;

      const products = Products.getByCategory(categoryId, limit, offset);

      if (products.length === 0) {
        return res.status(404).json({
          message: `No products found in category with ID ${categoryId}`,
        });
      }

      const totalProducts = products.length;
      const totalPages = Math.ceil(totalProducts / limit);

      res.status(200).json({
        message: "Products retrieved successfully",
        products,
        pagination: {
          totalProducts,
          totalPages,
          currentPage: page,
          pageSize: limit,
        },
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Error retrieving products by category",
        error: error.message,
      });
    }
  },

  createProduct(req, res) {
    try {
      const { manufacturerId, name } = req.body;

      const result = Products.create({ manufacturerId, name });

      if (result.changes > 0) {
        const newProduct = {
          productId: result.lastInsertRowid,
          manufacturerId,
          name,
        };

        return res.status(201).json({
          message: "Product created successfully",
          product: newProduct,
        });
      }

      res.status(500).json({ message: "Failed to create product" });
    } catch (error) {
      console.error(error);

      res
        .status(500)
        .json({ message: "Error creating product", error: error.message });
    }
  },

  updateProduct(req, res) {
    try {
      const { productId } = req;
      const { manufacturerId, name } = req.body;

      const product = Products.getById(productId);

      if (!product) {
        return res
          .status(404)
          .json({ message: `Product not found with ID ${productId}` });
      }

      const result = Products.update(productId, {
        manufacturerId,
        name,
      });

      return res.status(200).json({
        message: "Product updated successfully",
        product: { productId, manufacturerId, name },
      });
    } catch (error) {
      console.error(error);

      res
        .status(500)
        .json({ message: "Error updating product", error: error.message });
    }
  },

  deleteProduct(req, res) {
    try {
      const { productId } = req;

      const result = Products.delete(productId);

      if (result > 0) {
        return res
          .status(200)
          .json({ message: "Product deleted successfully" });
      }

      res
        .status(404)
        .json({ message: `Product not found with ID ${productId}` });
    } catch (error) {
      console.error(error);

      res
        .status(500)
        .json({ message: "Error deleting product", error: error.message });
    }
  },
};

module.exports = productController;
