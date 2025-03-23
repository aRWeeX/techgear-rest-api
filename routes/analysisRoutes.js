const express = require("express");
const router = express.Router();

const analysisController = require("../controllers/analysisController");

router.get("/products/stats", analysisController.getProductStats);
router.get("/reviews/stats", analysisController.getReviewStats);

module.exports = router;
