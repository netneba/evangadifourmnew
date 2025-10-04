const dbconnect = require("../db/dbconfig.js");

// Get all answers for a specific question
async function getAnswers(req, res) {
  try {
    const { question_id } = req.params;

    if (!question_id) {
      return res.status(400).json({ message: "Question ID is required" });
    }

    // Fetch answers for the given question_id
    const [rows] = await dbconnect.execute(
      "SELECT a.answerid, a.answer, a.created_at, u.username " +
        "FROM answers a JOIN users u ON a.userid = u.userid " +
        "WHERE a.questionid = ? ORDER BY a.created_at DESC",
      [question_id]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No answers found for this question" });
    }

    res.status(200).json({ answers: rows });
  } catch (error) {
    console.error("Error fetching answers:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// ========== Post a new answer for a specific question ==========
async function postAnswer(req, res) {
  try {
    const { questionid, answer } = req.body;
    const userid = req.user.userid; // comes from authMiddleware

    if (!questionid || !answer) {
      return res
        .status(400)
        .json({ message: "Question ID and answer are required" });
    }

    const [result] = await dbconnect.execute(
      "INSERT INTO answers (questionid, userid, answer) VALUES (?, ?, ?)",
      [questionid, userid, answer]
    );

    res.status(201).json({
      message: "Answer submitted successfully",
      answerId: result.insertId,
    });
  } catch (error) {
    console.error("Error posting answer:", error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = { getAnswers, postAnswer };
