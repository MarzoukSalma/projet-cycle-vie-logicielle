const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const { ChatMessage } = require("../models"); // optional, remove if you don’t save

// POST /api/chat
exports.chatWithFoodAssistant = async (req, res) => {
  try {
    const userId = req.user.id;
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ message: "Message is required" });
    }

    // LLM call
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `
You are a friendly assistant like ChatGPT.
You talk normally and naturally.
When it feels appropriate, gently suggest food, meals, or recipes.
Do NOT force food suggestions.
Do NOT mention mood explicitly.
Keep responses friendly and conversational.
          `,
        },
        {
          role: "user",
          content: message,
        },
      ],
      max_tokens: 150,
    });

    const reply = completion.choices[0].message.content;

    // (Optional) Save conversation
    

    return res.json({
      reply,
    });
  } catch (error) {
    console.error("Groq chat error:", error);
    return res.status(500).json({
      message: "Error generating chat response",
      error: error.message,
    });
  }
};
