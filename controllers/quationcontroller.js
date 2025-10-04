const dbconnect = require("../db/dbconfig");

// Create a new question
async function createQuestion(req, res) {
  try {
    const { title, description, tag } = req.body;
    const userid = req.user.userid; // comes from authMiddleware

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }

    const [result] = await dbconnect.execute(
      "INSERT INTO questions (userid, title, description, tag) VALUES (?, ?, ?, ?)",
      [userid, title, description, tag || null]
    );

    res.status(201).json({
      message: "Question created successfully",
      questionId: result.insertId,
    });
  } catch (error) {
    console.error("Error creating question:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// Get all questions
async function getAllQuestions(req, res) {
  try {
    const [rows] = await dbconnect.execute(`
            SELECT q.questionid, q.title, q.description, q.tag, q.created_at,
                   u.username
            FROM questions q
            JOIN users u ON q.userid = u.userid
            ORDER BY q.created_at DESC
        `);

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// Get a single question by ID
async function getSingleQuestion(req, res) {
  try {
    const { id } = req.params;

    const [rows] = await dbconnect.execute(
      `
            SELECT q.questionid, q.title, q.description, q.tag, q.created_at,
                   u.username
            FROM questions q
            JOIN users u ON q.userid = u.userid
            WHERE q.questionid = ?
        `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Error fetching question:", error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  createQuestion,
  getAllQuestions,
  getSingleQuestion,
};
