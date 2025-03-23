const express = require("express");
const router = express.Router();

const customerController = require("../controllers/customerController");

const validateId = require("../middlewares/validateId");
const validateCustomer = require("../middlewares/validateCustomer");

router.get("/", customerController.getAllCustomers);
router.get("/:id", validateId("Customer"), customerController.getCustomerById);
router.get(
  "/:id/orders",
  validateId("Customer"),
  customerController.getOrdersByCustomerId
);
router.post("/", validateCustomer, customerController.createCustomer);
router.put(
  "/:id",
  validateId("Customer"),
  validateCustomer,
  customerController.updateCustomer
);
router.delete(
  "/:id",
  validateId("Customer"),
  customerController.deleteCustomer
);

module.exports = router;
