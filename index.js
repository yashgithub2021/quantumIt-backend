const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
const connectDB = require("./src/config/dbConnect");
dotenv.config({ path: "./src/config/.env" });
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*", methods: ["GET", "POST", "DELETE", "PUT"] }));
connectDB();
const blogs = require("./src/routes/blogs");
const contactus = require("./src/routes/contactus");
const projects = require("./src/routes/projects");
const reviews = require("./src/routes/reviews");
const team = require("./src/routes/team");
const contributor = require("./src/routes/contributor");
const faq = require("./src/routes/faq");
const user = require("./src/routes/user");
const feedback = require("./src/routes/feedback");

app.use("/api/blogs", blogs);
app.use("/api/contactus", contactus);
app.use("/api/projects", projects);
app.use("/api/reviews", reviews);
app.use("/api/team", team);
app.use("/api/contributor", contributor);
app.use("/api/faq", faq);
app.use("/api/users", user);
app.use("/api/feedback", feedback);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

app.listen(process.env.PORT, () => {
  console.log("App is listening on ", process.env.PORT);
});
