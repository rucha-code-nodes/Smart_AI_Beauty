import express from 'express';
import fetch from 'node-fetch'; // or axios
const router = express.Router();

router.post('/ask', async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch('https://api.gemini.com/v1/ai', { // replace with actual Gemini API URL
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`, // store your API key in .env
      },
      body: JSON.stringify({
        prompt: message,
        max_tokens: 200,
      }),
    });

    const data = await response.json();
    // Extract AI answer from Gemini's response structure
    res.json({ answer: data.choices[0].text || "Sorry, I couldn't generate a response." });

  } catch (err) {
    console.error(err);
    res.status(500).json({ answer: "Error processing request." });
  }
});

export default router;
