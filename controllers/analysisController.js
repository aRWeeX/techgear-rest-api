const { Analysis } = require("../models/analysisModel");

const paginate = require("../utils/pagination");

const analysisController = {
  getProductStats(req, res) {
    try {
      const { page, limit, offset } = paginate(req);

      const stats = Analysis.getProductStats(limit, offset);

      const totalProducts = Analysis.countProducts();
      const totalPages = Math.ceil(totalProducts / limit);

      res.status(200).json({
        message: "Product statistics per category retrieved successfully",
        stats,
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
        message: "Error retrieving product statistics",
        error: error.message,
      });
    }
  },

  getReviewStats(req, res) {
    try {
      const { page, limit, offset } = paginate(req);

      const stats = Analysis.getReviewStats(limit, offset);

      const totalReviews = Analysis.countReviews();
      const totalPages = Math.ceil(totalReviews / limit);

      res.status(200).json({
        message: "Review statistics per product retrieved successfully",
        stats,
        pagination: {
          totalReviews,
          totalPages,
          currentPage: page,
          pageSize: limit,
        },
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Error retrieving review statistics",
        error: error.message,
      });
    }
  },
};

module.exports = analysisController;
