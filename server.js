const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const http = require('http')
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Load quiz questions from JSON file
const quizData = JSON.parse(fs.readFileSync('question.json', 'utf8'));

app.use(express.static(path.join(__dirname, 'public')));

// Quiz endpoint
app.get('/quiz', (req, res) => {
    res.json(quizData);
});

// Submit answers endpoint
app.post('/submit', (req, res) => {
    const answers = req.body;
    let score = 0;
    const feedback = [];
    console.log(answers);
    for (const question of quizData) {
        const userAnswer = answers[question.id];
        const correctAnswer = question.answer;
        
        if (userAnswer === correctAnswer) {
            score++;
            feedback.push({ id: question.id, correct: true });
        } else {
            feedback.push({ id: question.id, correct: false, correctAnswer });
        }
    }

    res.json({ score, feedback });
});


// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
