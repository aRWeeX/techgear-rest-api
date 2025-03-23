function validateProduct(req, res, next) {
  const { manufacturerId, name } = req.body;

  const manufacturer_id = parseInt(manufacturerId, 10);

  if (isNaN(manufacturer_id) || manufacturer_id <= 0) {
    return res.status(400).json({
      message: "Manufacturer ID must be a positive number",
    });
  }

  if (!name || name.trim() === "") {
    return res.status(400).json({
      message: "Product name is required and cannot be empty",
    });
  }

  next();
}

module.exports = validateProduct;
