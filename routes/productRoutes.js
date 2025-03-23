const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");

const validateId = require("../middlewares/validateId");
const validateProduct = require("../middlewares/validateProduct");

router.get("/", productController.getAllProducts);
router.get("/search", productController.searchProducts);
router.get("/:id", validateId("Product"), productController.getProductById);
router.get(
  "/category/:id",
  validateId("Category"),
  productController.getProductsByCategory
);
router.post("/", validateProduct, productController.createProduct);
router.put(
  "/:id",
  validateId("Product"),
  validateProduct,
  productController.updateProduct
);
router.delete("/:id", validateId("Product"), productController.deleteProduct);

module.exports = router;
