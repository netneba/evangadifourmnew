const dbconnect = require('../db/dbconfig');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.secret; 

// Register a new user
async function register(req, res) {
    try {
        const { first_name, last_name, username, email, password } = req.body;

        if (!first_name || !last_name || !username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
// Basic validation
        if(password.length < 8){
            return res.status(400).json({ message: "Password must be at least 8 characters long" });
        }
// Email format validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {    
            return res.status(400).json({ message: "Invalid email format" });
        }
// Username length validation
        if(username.length < 3){
            return res.status(400).json({ message: "Username must be at least 3 characters long" });
        }

        const [userCheck] = await dbconnect.execute(
            "SELECT * FROM users WHERE email = ? OR username = ?",
            [email, username]
        );
        if (userCheck.length > 0) {
            return res.status(409).json({ message: "User with this email or username already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await dbconnect.execute(
            "INSERT INTO users (first_name, last_name, username, email, password) VALUES (?, ?, ?, ?, ?)",
            [first_name, last_name, username, email, hashedPassword]
        );

        res.status(201).json({ message: "User registered successfully", userId: result.insertId });
    } 
    catch (error) {
        console.error("DB error:", error);
        res.status(500).json({ message: "Server error" });
    }
}

// Login user
async function login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required" });
        }

        const [rows] = await dbconnect.execute(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (rows.length === 0) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { userid: user.userid, username: user.username },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ message: "User logged in successfully", token });
    } catch (error) {
        console.error("DB error:", error);
        res.status(500).json({ message: "Server error" });
    }
}

// Check user authentication
async function check(req, res) {
    return res.json({
        message: "User is authenticated",
        username: req.user.username,
        userid: req.user.userid
    });
}

module.exports = { register, login, check };
