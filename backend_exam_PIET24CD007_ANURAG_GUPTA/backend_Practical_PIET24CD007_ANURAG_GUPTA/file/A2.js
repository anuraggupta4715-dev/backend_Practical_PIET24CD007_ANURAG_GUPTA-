
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
    path: path.join(__dirname, ".env")
});

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors());

app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests. Please try again later."
}));

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["student", "admin"],
        default: "student"
    }
});

const Student = mongoose.model("Student", studentSchema);

const registerValidation = Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid("student", "admin").default("student")
});

const loginValidation = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

app.post("/register", async (req, res) => {
    try {
        const { error, value } = registerValidation.validate(req.body);

        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            });
        }

        const existingStudent = await Student.findOne({
            email: value.email
        });

        if (existingStudent) {
            return res.status(400).json({
                message: "Email already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(value.password, 10);

        const student = new Student({
            name: value.name,
            email: value.email,
            password: hashedPassword,
            role: value.role
        });

        await student.save();

        res.status(201).json({
            message: "Registration successful",
            student: {
                id: student._id,
                name: student.name,
                email: student.email,
                role: student.role
            }
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                message: "Email already registered"
            });
        }

        res.status(500).json({
            message: "Server Error"
        });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { error, value } = loginValidation.validate(req.body);

        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            });
        }

        const student = await Student.findOne({
            email: value.email
        });

        if (!student) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const isMatch = await bcrypt.compare(
            value.password,
            student.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                id: student._id,
                role: student.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        res.status(200).json({
            message: "Login successful",
            token
        });
    } catch (error) {
        res.status(500).json({
            message: "Server Error"
        });
    }
});

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Access denied. Token required."
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

const adminOnly = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({
            message: "Access denied. Admin only."
        });
    }

    next();
};

app.get("/profile", authenticateToken, async (req, res) => {
    try {
        const student = await Student.findById(req.user.id)
            .select("-password");

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({
            message: "Server Error"
        });
    }
});

app.get("/students", authenticateToken, adminOnly, async (req, res) => {
    try {
        const students = await Student.find().select("-password");

        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({
            message: "Server Error"
        });
    }
});

app.get("/", (req, res) => {
    res.send("Student Portal API is Running!");
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully!");

        app.listen(3000, () => {
            console.log("Student Portal Server running on port 3000");
        });
    })
    .catch((error) => {
        console.log("MongoDB Connection Failed:", error.message);
    });
