const { getDb } = require("../config/db");

const Customers = {
  countCustomers: () => {
    const db = getDb();
    return db.prepare("SELECT COUNT(*) AS count FROM customers").get().count;
  },

  countOrders: (customerId) => {
    const db = getDb();

    return db
      .prepare("SELECT COUNT(*) AS count FROM orders WHERE customer_id = ?")
      .get(customerId).count;
  },

  getAll: (limit, offset) => {
    const db = getDb();

    return db
      .prepare("SELECT * FROM customers LIMIT ? OFFSET ?")
      .all(limit, offset);
  },

  /* getById: (customerId) => {
    const db = getDb();
    return db.prepare("SELECT * FROM customers WHERE customer_id = ?").get(customerId);
  }, */

  /**
   * Retrieves a customer by their ID along with their most recent orders and order details.
   * If no orders are found, it returns an empty array for orders.
   * If orders are found, it also fetches the order details for those orders.
   *
   * @param {number} customerId - The ID of the customer to retrieve.
   * @returns {Object} An object containing the customer and their orders.
   * @returns {Object} return.customer - The customer data.
   * @returns {Array} return.orders - An array of the most recent orders associated with the customer.
   * @returns {string} return.message - A message indicating no orders were found if applicable.
   */
  getById: (customerId) => {
    const db = getDb();

    const customer = db
      .prepare("SELECT * FROM customers WHERE customer_id = ?")
      .get(customerId);

    if (!customer) return null;

    const orders = db
      .prepare(
        `SELECT order_id, shipment_id, order_date, status 
        FROM orders 
        WHERE customer_id = ?
        ORDER BY order_date DESC
        LIMIT 5`
      )
      .all(customerId);

    if (orders.length === 0) {
      return {
        customer,
        orders: [],
        message: "No orders found for this customer",
      };
    }

    const orderIds = orders.map((order) => order.order_id);
    const placeholders = orderIds.map(() => "?").join(",");

    if (orderIds.length > 0) {
      const orderDetails = db
        .prepare(
          `SELECT order_id, product_id, quantity, unit_price,
                  (quantity * unit_price) AS total_price
          FROM order_details
          WHERE order_id IN (${placeholders})`
        )
        .all(...orderIds);

      orders.forEach((order) => {
        order.details = orderDetails.filter(
          (detail) => detail.order_id === order.order_id
        );

        order.total_price = order.details.reduce(
          (sum, detail) => sum + detail.total_price,
          0
        );

        if (order.details.length === 0) {
          order.details = ["No details found for this order"];
        }
      });
    }

    return { customer, orders };
  },

  getById_AllOrders: (customerId, limit, offset) => {
    const db = getDb();

    return db
      .prepare("SELECT * FROM orders WHERE customer_id = ? LIMIT ? OFFSET ?")
      .all(customerId, limit, offset);
  },

  create: (customerData) => {
    const db = getDb();

    try {
      const query = db.prepare(
        "INSERT INTO customers (name, email, phone) VALUES (?, ?, ?)"
      );

      return query.run(
        customerData.name,
        customerData.email,
        customerData.phone ?? null // If phone is null or undefined, it will become null
      );
    } catch (error) {
      console.error("Database error in createCustomer:", error);
      throw new Error("Failed to create customer");
    }
  },

  update: (customerId, customerData) => {
    const db = getDb();

    try {
      const query = db.prepare(
        "UPDATE customers SET name = ?, email = ?, phone = ? WHERE customer_id = ?"
      );

      const result = query.run(
        customerData.name,
        customerData.email,
        customerData.phone ?? null, // If phone is null or undefined, it will become null
        customerId
      );

      return result.changes;
    } catch (error) {
      console.error("Database error in updateCustomer:", error);
      throw new Error("Failed to update customer");
    }
  },

  delete: (customerId) => {
    const db = getDb();

    try {
      const query = db.prepare("DELETE FROM customers WHERE customer_id = ?");
      const result = query.run(customerId);

      return result.changes;
    } catch (error) {
      console.error("Database error in deleteCustomer:", error);
      throw new Error("Failed to delete customer");
    }
  },
};

module.exports = { Customers };
