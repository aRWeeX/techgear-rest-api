const { getDb } = require("../config/db");

const Analysis = {
  countProducts: () => {
    const db = getDb();
    return db.prepare("SELECT COUNT(*) AS count FROM products").get().count;
  },

  countReviews: () => {
    const db = getDb();
    return db.prepare("SELECT COUNT(*) AS count FROM reviews").get().count;
  },

  getProductStats: (limit, offset) => {
    const db = getDb();

    const query = `
      SELECT 
        c.name AS category_name,
        COUNT(p.product_id) AS product_count,
        AVG(p.price) AS average_price
      FROM products p
      LEFT JOIN product_categories pc ON p.product_id = pc.product_id
      LEFT JOIN categories c ON pc.category_id = c.category_id
      GROUP BY c.category_id
      LIMIT ? OFFSET ?
    `;

    return db.prepare(query).all(limit, offset);
  },

  getReviewStats: (limit, offset) => {
    const db = getDb();

    const query = `
      SELECT 
        p.name AS product_name,
        AVG(r.rating) AS average_rating
      FROM reviews r
      LEFT JOIN products p ON r.product_id = p.product_id
      GROUP BY p.product_id
      LIMIT ? OFFSET ?
    `;

    return db.prepare(query).all(limit, offset);
  },
};

module.exports = { Analysis };
