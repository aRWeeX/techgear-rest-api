const { getDb } = require("../config/db");

const Products = {
  countProducts: () => {
    const db = getDb();
    return db.prepare("SELECT COUNT(*) AS count FROM products").get().count;
  },

  /* getAll: (limit, offset) => {
    const db = getDb();
    return db.prepare("SELECT * FROM products LIMIT ? OFFSET ?").all(limit, offset);
  }, */

  getAll: (limit, offset) => {
    const db = getDb();

    return db
      .prepare(
        `SELECT 
          p.*,
          c.name AS category_name,
          m.name AS manufacturer_name
        FROM products p
        LEFT JOIN product_categories pc ON p.product_id = pc.product_id
        LEFT JOIN categories c ON pc.category_id = c.category_id
        LEFT JOIN manufacturers m ON p.manufacturer_id = m.manufacturer_id
        LIMIT ? OFFSET ?`
      )
      .all(limit, offset);
  },

  getById: (productId) => {
    const db = getDb();

    return db
      .prepare("SELECT * FROM products WHERE product_id = ?")
      .get(productId);
  },

  searchByName: (searchTerm, limit, offset) => {
    const db = getDb();

    return db
      .prepare("SELECT * FROM products WHERE name LIKE ? LIMIT ? OFFSET ?")
      .all(`%${searchTerm}%`, limit, offset);
  },

  getByCategory: (categoryId, limit, offset) => {
    const db = getDb();

    return db
      .prepare(
        `SELECT
          p.*,
          c.name AS category_name
        FROM products p
        JOIN product_categories pc ON p.product_id = pc.product_id
        JOIN categories c ON pc.category_id = c.category_id
        WHERE c.category_id = ?
        LIMIT ? OFFSET ?`
      )
      .all(categoryId, limit, offset);
  },

  create: (productData) => {
    const db = getDb();

    try {
      const query = db.prepare(
        "INSERT INTO products (manufacturer_id, name) VALUES (?, ?)"
      );

      return query.run(productData.manufacturerId, productData.name);
    } catch (error) {
      console.error("Database error in createProduct:", error);
      throw new Error("Failed to create product");
    }
  },

  update: (productId, productData) => {
    const db = getDb();

    try {
      const query = db.prepare(
        "UPDATE products SET manufacturer_id = ?, name = ? WHERE product_id = ?"
      );

      const result = query.run(
        productData.manufacturerId,
        productData.name,
        productId
      );

      return result.changes;
    } catch (error) {
      console.error("Database error in updateProduct:", error);
      throw new Error("Failed to update product");
    }
  },

  delete: (productId) => {
    const db = getDb();

    try {
      const query = db.prepare("DELETE FROM products WHERE product_id = ?");
      const result = query.run(productId);

      return result.changes;
    } catch (error) {
      console.error("Database error in deleteProduct:", error);
      throw new Error("Failed to delete product");
    }
  },
};

module.exports = { Products };
