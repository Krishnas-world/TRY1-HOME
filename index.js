const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect('ur db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;

db.on('error', () => console.log("Error in connecting to the database"));
db.once('open', () => console.log("Connected to the database"));

// Routes

// Home Route - Serve home.html from root
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html')); // Serve home.html from the root directory
});


// app.get("/income", (req, res) => {
//     res.sendFile(path.join(__dirname, 'income.html')); // Serve home.html from the root directory
// });


// Login Route - Serve login.html from root
app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html')); // Serve login.html from the root directory
});

app.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    // Validate user credentials (Example, replace with actual logic)
    db.collection('users').findOne({ email, password }, (err, user) => {
        if (err) {
            console.log("Error while logging in:", err);
            return res.status(500).send("Internal server error");
        }
        if (!user) {
            return res.status(401).send("Invalid credentials");
        }
        console.log("User logged in successfully");
        res.redirect("/register"); // Redirect to the registration page after login
    });
});

// Register Route - Serve reg.html from public
app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'reg.html')); // Serve reg.html from the public folder
});

app.post("/register", (req, res) => {
    const { name, age, email, phno, gender, password } = req.body;

    const data = {
        name,
        age,
        email,
        phno,
        gender,
        password
    };

    db.collection('users').insertOne(data, (err, collection) => {
        if (err) {
            console.log("Error in inserting data:", err);
            return res.status(500).send("Internal server error");
        }
        console.log("User registered successfully");
        res.redirect("/select"); // Redirect to the selection page after registration
    });
});

// Selection Route - Serve selection.html from public
app.get("/select", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'selection.html')); // Serve selection.html from the public folder
});

// Serve Static Files (style.css and script.js) from root directory
app.get("/style.css", (req, res) => {
    res.sendFile(path.join(__dirname, 'style.css')); // Serve style.css from the root directory
});

app.get("/script.js", (req, res) => {
    res.sendFile(path.join(__dirname, 'script.js')); // Serve script.js from the root directory
});

// Server
app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
