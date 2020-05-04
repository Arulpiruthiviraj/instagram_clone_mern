require("dotenv").config();
const express = require("express");
const connectDB = require("./config/databaseConnection");
const app = express();

//connecting to the database
connectDB();

app.use(express.json({ extended: false }));

const authRouter = require("./routes/authRoute");
const postRouter = require("./routes/postRoute");

app.use("/auth", authRouter);
app.use("/post", postRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server Running at ${PORT}`));
