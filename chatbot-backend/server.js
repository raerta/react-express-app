// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const Session = require('./models/session');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(session({
  secret: 'mysecret',
  resave: false,
  saveUninitialized: true
}));

app.use((req, res, next)=> {
   
    const allowedOrigins = [            
      "http://localhost:5173",
      "http://localhost:5173/",

    ];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    }
    res.header("Content-Type", "application/json;charset=UTF-8");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Referer, Content-Type, Accept, User-Agent, Authorization"
    );
    res.header("Access-Control-Allow-Credentials", true);
    next();
  });
  
  


mongoose.connect('mongodb://chatbotadmin:123456@185.255.94.141:27017/chatbot_db?authSource=chatbot_db&readPreference=primary&ssl=false').then(() => {
  console.log('MongoDB connected');
}).catch(err => console.log(err));

const questions = [
  "What is your favorite breed of cat, and why?",
  "How do you think cats communicate with their owners?",
  "Have you ever owned a cat? If so, what was their name and personality like?",
  "Why do you think cats love to sleep in small, cozy places?",
  "What’s the funniest or strangest behavior you’ve ever seen a cat do?",
  "Do you prefer cats or kittens, and what’s the reason for your preference?",
  "Why do you think cats are known for being independent animals?",
  "How do you think cats manage to land on their feet when they fall?",
  "What’s your favorite fact or myth about cats?",
  "How would you describe the relationship between humans and cats in three words?"
];

app.post('/api/session/start', async (req, res) => {

    const newSession = new Session({
      sessionId: req.sessionID,
      currentQuestionIndex: 0, 
      answers: [],
      startedAt: Date.now()
    });
    await newSession.save();
    res.json({ message: 'Session started', sessionId: req.sessionID });
  });


app.get('/api/session/question', async (req, res) => {
    const userSession = await Session.findOne({ sessionId: req.sessionID });

  if (userSession && userSession.currentQuestionIndex < questions.length) {
    const currentQuestion = questions[userSession.currentQuestionIndex];
    res.json({ question: currentQuestion });
  } else {
    res.json({ message: 'Session complete' });
  }                             
});


app.post('/api/session/answer', async (req, res) => {
  const { answer } = req.body;
  const userSession = await Session.findOne({ sessionId: req.sessionID });

  if (userSession && userSession.currentQuestionIndex < questions.length) {
    userSession.answers.push({
      question: questions[userSession.currentQuestionIndex],
      answer: answer
    });

    userSession.currentQuestionIndex++;
    if (userSession.currentQuestionIndex >= questions.length) {
      userSession.endedAt = Date.now();
    }
    await userSession.save();
    res.json({ message: 'Answer saved' });
  } else {
    res.json({ message: 'No more questions or session ended' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
