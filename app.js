const express = require('express');
const app = express();
const port = 5500;

// DB connection
const dbconnect = require('./db/dbconfig');

// Middleware to parse JSON requests
app.use(express.json());

// Middleware for users
const usersroutes = require('./routes/usersroutes');
app.use('/api/users', usersroutes);

// Middleware for questions
const questionroutes = require('./routes/questionroutes');
app.use('/api/questions', questionroutes);

// Middleware for answers
const answerroutes = require('./routes/answerroutes');
app.use('/api/answers', answerroutes);

async function Start() {
    try {
        // Test DB connection
        await dbconnect.execute("SELECT 'test'");

        // Start server
        await new Promise(resolve => app.listen(port, resolve));
        console.log("DB connected successfully");
        console.log(`Server is running on http://localhost:${port}`);
    } catch (error) {
        console.log("DB connection error", error);  
    }
}

Start();



