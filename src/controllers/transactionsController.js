// controllers/transactionController.js

const Transaction = require("../models/transactionModel");
const catchAsyncError = require("../utils/catchAsyncError");
const { initiatePayment } = require("../utils/razorpay");
const Razorpay = require("razorpay");
const nodeCCAvenue = require('node-ccavenue')
const crypto = require('crypto');


function decrypt(data, workingKey) {
    const key = crypto.createHash('md5').update(workingKey).digest();
    const iv = Buffer.alloc(16, 0); // Initialization vector

    const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    let decrypted = decipher.update(data, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}
const ccav = new nodeCCAvenue.Configure({
    merchant_id: process.env.CCAVENUE_MERCHANT_ID,
    working_key: process.env.CCAVENUE_WORKING_KEY
})
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET,
});

exports.handleCCAvenueResponse = catchAsyncError(async (req, res) => {
    console.log(req.body)
    const { encResp } = req.body;
    const decryptedResponse = decrypt(encResp, process.env.CCAVENUE_WORKING_KEY);

    // Convert query string to JSON
    const output = {};
    decryptedResponse.split('&').forEach((pair) => {
        const [key, value] = pair.split('=');
        output[decodeURIComponent(key)] = decodeURIComponent(value);
    });

    console.log(output);

    res.status(200).json({
        success: true,
        message: 'Payment processed',
        data: output,
    });
});

exports.initiatePayment = catchAsyncError(async (req, res) => {
    const { name, email, tel, address, city, state, zip_code, country, currency_type, amount } = req.body;

    const options = {
        amount: amount * 100,
        currency: currency_type,
        receipt: 'receipt#1'
    };

    try {
        const order = await razorpay.orders.create(options);
        const transaction = await Transaction.create({
            name,
            email,
            tel,
            address,
            city,
            state,
            zip_code,
            country,
            currency_type,
            amount,
            order_id: order.id,
            status: 'created'
        });

        res.status(200).json({
            success: true,
            order,
            transaction,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

exports.paymentSuccess = catchAsyncError(async (req, res) => {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
    try {
        const transaction = await Transaction.findOne({ where: { order_id: razorpay_order_id } });
        if (!transaction) {
            return res.status(404).json({ success: false, message: 'Transaction not found' });
        }

        console.log("ttttttrrrrrrraaaa", req.body)

        transaction.payment_id = razorpay_payment_id;
        transaction.razorpay_signature = razorpay_signature;
        transaction.status = 'successful';
        await transaction.save();

        res.status(200).json({ success: true, transaction });
    } catch (error) {
        res.status(500).json({ success: false, message: `Error saving payment details: ${error.message}` });
    }
});

exports.getAllTransactions = catchAsyncError(async (req, res) => {
    try {
        const transactions = await Transaction.findAll();
        res.status(200).json({
            success: true,
            transactions,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Error fetching transactions: ${error.message}`,
        });
    }
});
