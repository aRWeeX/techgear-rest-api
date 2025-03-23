const { Customers } = require("../models/customerModel");

const paginate = require("../utils/pagination");

const customerController = {
  getAllCustomers(req, res) {
    try {
      const { page, limit, offset } = paginate(req);

      const customers = Customers.getAll(limit, offset);

      const totalCustomers = Customers.countCustomers();
      const totalPages = Math.ceil(totalCustomers / limit);

      res.status(200).json({
        message: "Customers retrieved successfully",
        customers,
        pagination: {
          totalCustomers,
          totalPages,
          currentPage: page,
          pageSize: limit,
        },
      });
    } catch (error) {
      console.error(error);

      res
        .status(500)
        .json({ message: "Error retrieving customers", error: error.message });
    }
  },

  getCustomerById(req, res) {
    try {
      const { customerId } = req;

      const customer = Customers.getById(customerId);

      if (!customer) {
        return res
          .status(404)
          .json({ message: `Customer not found with ID ${customerId}` });
      }

      res.status(200).json({
        message: "Customer retrieved successfully",
        customer,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Error retrieving customer",
        error: error.message,
      });
    }
  },

  getOrdersByCustomerId(req, res) {
    const { page, limit, offset } = paginate(req);
    const { customerId } = req;

    const orders = Customers.getById_AllOrders(customerId, limit, offset);

    if (!orders.length) {
      return res
        .status(404)
        .json({ message: "No orders found for this customer" });
    }

    const totalOrders = Customers.countOrders(customerId);
    const totalPages = Math.ceil(totalOrders / limit);

    res.status(200).json({
      message: "Orders retrieved successfully",
      orders,
      pagination: {
        totalOrders,
        totalPages,
        currentPage: page,
        pageSize: limit,
      },
    });
  },

  createCustomer(req, res) {
    try {
      const { name, email } = req.body;

      const result = Customers.create({ name, email });

      if (result.changes > 0) {
        const newCustomer = {
          customerId: result.lastInsertRowid,
          name,
          email,
        };

        return res.status(201).json({
          message: "Customer created successfully",
          customer: newCustomer,
        });
      }

      res.status(500).json({ message: "Failed to create customer" });
    } catch (error) {
      console.error(error);

      res
        .status(500)
        .json({ message: "Error creating customer", error: error.message });
    }
  },

  updateCustomer(req, res) {
    try {
      const { customerId } = req;
      const { name, email, phone } = req.body;

      const { customer } = Customers.getById(customerId);

      if (!customer) {
        return res
          .status(404)
          .json({ message: `Customer not found with ID ${customerId}` });
      }

      // Normalize phone to null if it's empty or undefined
      const normalizedPhone =
        phone === "" || phone === undefined ? null : phone;

      const isDataUnchanged =
        customer.name === name &&
        customer.email === email &&
        customer.phone === normalizedPhone;

      if (isDataUnchanged) {
        return res.status(200).json({
          message: "No changes were made, customer details remain unchanged",
          customer,
        });
      }

      const result = Customers.update(customerId, {
        name,
        email,
        phone: normalizedPhone,
      });

      return res.status(200).json({
        message: "Customer updated successfully",
        customer: { customerId, name, email, phone: normalizedPhone },
      });
    } catch (error) {
      console.error(error);

      res
        .status(500)
        .json({ message: "Error updating customer", error: error.message });
    }
  },

  deleteCustomer(req, res) {
    try {
      const { customerId } = req;

      const { customer } = Customers.getById(customerId);

      if (!customer) {
        return res.status(404).json({
          message: `Customer not found with ID ${customerId}`,
        });
      }

      const result = Customers.delete(customerId);

      if (result > 0) {
        return res
          .status(200)
          .json({ message: "Customer deleted successfully" });
      }

      res
        .status(404)
        .json({ message: `Customer not found with ID ${customerId}` });
    } catch (error) {
      console.error(error);

      res
        .status(500)
        .json({ message: "Error deleting customer", error: error.message });
    }
  },
};

module.exports = customerController;
