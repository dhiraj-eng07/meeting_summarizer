require('dotenv').config();
const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const gemini = require('./gemini');
const email = require('./email');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload());
//app.use(express.static('public'));

// Routes
app.post('/api/summarize', async (req, res) => {
  try {
    const { text, instructions } = req.body;
    const summary = await gemini.generateSummary(text, instructions);
    res.json({ summary });
  } catch (error) {
    console.error('Summarization error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate summary' });
  }
});
// app.get('/', (req, res) => {
//   res.send('Server is running!');
// });
app.post('/api/share', async (req, res) => {
  try {
    const { summary, emails, message } = req.body; // 'emails' should be an array
    await email.sendSummary(emails, summary, message);
    res.json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ error: error.message || 'Failed to send email' });
  }
});
// Serve frontend static files
app.use(express.static(path.join(__dirname, '../Public')));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

