const express = require("express");
const router = express.Router();
const {
    initiatePayment,
    paymentSuccess,
    getAllTransactions,
    handleCCAvenueResponse
} = require("../controllers/transactionsController");

router.post("/create-order", initiatePayment)
router.post("/payment-success", paymentSuccess)
router.get("/get-transactions", getAllTransactions)
router.post("/handleCCAvenueResponse", handleCCAvenueResponse)
module.exports = router;
