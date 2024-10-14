const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const path = require("path");
const crypto = require("crypto");
const nodeCCAvenue = require("node-ccavenue"); // Ensure this is installed

const app = express();

dotenv.config({ path: "./src/config/.env" });
// dotenv.config({ path: "./src/config/local.env" });
const { connectDatabase } = require("./src/config/dbConnect");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*", methods: ["GET", "POST", "DELETE", "PUT"] }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
connectDatabase();

const {
  handleCCAvenueResponse,
} = require("./src/controllers/transactionsController");
const blogs = require("./src/routes/blogs");
const contactus = require("./src/routes/contactus");
const realEstate = require("./src/routes/realEstate");
const projects = require("./src/routes/projects");
const reviews = require("./src/routes/reviews");
const team = require("./src/routes/team");
const contributor = require("./src/routes/contributor");
const faq = require("./src/routes/faq");
const user = require("./src/routes/user");
const feedback = require("./src/routes/feedback");
const transactions = require("./src/routes/transaction");
const category = require("./src/routes/category");
const catchAsyncError = require("./src/utils/catchAsyncError");
const appDevForm = require("./src/routes/appDev");
const logger = require("./src/utils/logger");
// Encryption function
function encrypt(data, workingKey) {
  const key = crypto.createHash("md5").update(workingKey).digest();
  const iv = Buffer.alloc(16, 0); // Initialization vector

  const cipher = crypto.createCipheriv("aes-128-cbc", key, iv);
  let encrypted = cipher.update(data, "utf8", "hex");
  encrypted += cipher.final("hex");

  return encrypted;
}

// Decryption function
function decrypt(data, workingKey) {
  const key = crypto.createHash("md5").update(workingKey).digest();
  const iv = Buffer.alloc(16, 0); // Initialization vector

  const decipher = crypto.createDecipheriv("aes-128-cbc", key, iv);
  let decrypted = decipher.update(data, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "public/index.html"));
// });

// app.post(
//   "/initiate-payment",
//   catchAsyncError(async (req, res) => {
//     const { amount, currency, order_id } = req.body;

//     console.log();
//     const paymentData = `merchant_id=${process.env.CCAVENUE_MERCHANT_ID}&order_id=${order_id}&amount=${amount}&currency=${currency}&redirect_url=${process.env.REDIRECT_URL}&cancel_url=${process.env.CANCEL_URL}&language=EN`;

//     const encryptedData = encrypt(
//       paymentData,
//       process.env.CCAVENUE_WORKING_KEY
//     );
//     console.log(encryptedData);

//     res.render("paymentPage", {
//       encRequest: encryptedData,
//       access_code: process.env.CCAVENUE_ACCESS_CODE,
//     });
//   })
// );

//gateways
app.use("/api/blogs", blogs);
app.use("/api/contactus", contactus);
app.use("/api/real-estates", realEstate);
app.use("/api/projects", projects);
app.use("/api/reviews", reviews);
app.use("/api/team", team);
app.use("/api/contributor", contributor);
app.use("/api/faq", faq);
app.use("/api/users", user);
app.use("/api/feedback", feedback);
app.use("/api/transactions", transactions);
app.use("/api/categories", category);
app.use("/api/appDev", appDevForm);
app.post("/api/transactions/handleCCAvenueResponse", handleCCAvenueResponse);

app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

app.listen(process.env.PORT, () => {
  console.log("App is listening on ", process.env.PORT);
});
