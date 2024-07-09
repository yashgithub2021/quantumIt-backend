// razorpay.js
const Razorpay = require("razorpay");

// Initialize Razorpay instance with your API key and secret
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET,
});

// Function to initiate a payment
const initiatePayment = async (amount, currency, receipt, notes) => {
    try {
        const options = {
            amount: amount * 100, // amount in smallest currency unit (e.g., paise for INR)
            currency,
            receipt,
            notes,
        };

        const response = await razorpay.orders.create(options);
        return response;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    initiatePayment,
};
