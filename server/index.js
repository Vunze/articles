const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config/db")
const cors = require("cors");
const dotenv = require("dotenv")


const articlesRouter = require("./routes/articles.routes");

dotenv.config();
connectDB();


const app = express();
app.use(bodyParser.json({ limit: '50mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(cors());

app.use("/api/articles", articlesRouter)

const PORT = process.env.PORT || 6000;



const server = app.listen(PORT, console.log(`Server started on port ${PORT}`));