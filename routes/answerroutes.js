const express = require('express');
const router = express.Router();

// Submit an answer to a question
router.post('/answer', (req, res) => {
    res.send("Answer submitted successfully");
});

// Get allanswers for a question
router.get('/:allanswers', (req, res) => {
    res.send(`List of answers for question ID: ${req.params.questionId}`);
});

module.exports = router;
