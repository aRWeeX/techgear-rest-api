function validateCustomer(req, res, next) {
  const { name, email } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({
      message: "Customer name is required and cannot be empty",
    });
  }

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({
      message: "A valid email address is required and cannot be empty",
    });
  }

  next();
}

module.exports = validateCustomer;
