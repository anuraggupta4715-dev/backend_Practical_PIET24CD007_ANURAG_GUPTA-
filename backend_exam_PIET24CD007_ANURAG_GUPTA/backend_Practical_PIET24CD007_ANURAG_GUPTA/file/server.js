
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
    path: path.join(__dirname, ".env")
});

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

const bookRoutes = require("./routes/bookRoutes");
app.use("/books", bookRoutes);

app.get("/", (req, res) => {
    res.send("Library Book Management API is Running!");
});

app.use((err, req, res, next) => {
    console.error(err.message);

    res.status(500).json({
        message: "Internal Server Error"
    });
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully!");

        app.listen(3000, () => {
            console.log("Server running on port 3000");
        });
    })
    .catch((error) => {
        console.log("MongoDB Connection Failed:", error.message);
    });
