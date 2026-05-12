const Groq = require('groq-sdk');
const User = require('../models/User');
const Topic = require('../models/Topic');
const AiLog = require('../models/AiLog');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const AI_DAILY_LIMIT = 10;

// ── POST /api/ai/ask ───────────────────────────────────
const askAI = async (req, res) => {
  try {
    const { topicId, question } = req.body;
    
    // 🛡️ Safety check for user
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, error: 'Authorization failed. Please re-login.' });
    }

    const user = await User.findById(req.user.id);

    // ── 1. Daily Limit Check ────────────────────────────
    if (user && user.dailyAiUsage >= AI_DAILY_LIMIT) {
      return res.status(429).json({ 
        success: false, 
        error: 'Daily AI limit reached. Upgrade for more!' 
      });
    }

    // ── 2. Context Gathering ────────────────────────────
    let topicContext = '';
    if (topicId && topicId !== 'null' && topicId !== 'undefined') {
      try {
        const topic = await Topic.findById(topicId);
        if (topic) {
          topicContext = `Context Topic: ${topic.topic.english}\nContent: ${topic.content.english}\n`;
        }
      } catch (err) {
        console.warn('Topic context fetch failed:', err.message);
      }
    }

    // ── 3. Prompt Construction ──────────────────────────
    const prompt = `You are the "Physics Nexus" AI Tutor, an expert physicist and teacher for Grade 9-10 students in Bangladesh.
    
${topicContext}

User Question: ${question}

Instructions:
- Provide a dual-language response (Bangla and English).
- Keep explanations simple but scientifically accurate.
- Use metaphors and examples relevant to students.
- Format with clear emojis and structure.

Format:
🇧🇩 বাংলায় ব্যাখ্যা:
[Bangla here]

🇬🇧 English Explanation:
[English here]

💡 Example / উদাহরণ:
[Example here]`;

    // ── 4. Call Groq API (Using Llama-3.3) ────────────────────
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a helpful Physics tutor for SSC students.' },
        { role: 'user', content: prompt }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
    });

    const answer = completion.choices[0].message.content;

    // ── 5. Save & Response ──────────────────────────────
    try {
      await AiLog.create({
        userId: req.user.id,
        topicId: (topicId && topicId !== 'null') ? topicId : null,
        question,
        answer,
      });

      if (user) {
        user.dailyAiUsage += 1;
        await user.save();
      }
    } catch (logErr) {
      console.warn('Logging AI interaction failed:', logErr.message);
    }

    res.json({
      success: true,
      answer,
      remainingQueries: user ? (AI_DAILY_LIMIT - user.dailyAiUsage) : 5,
    });

  } catch (error) {
    console.error('Groq AI failure:', error);
    res.status(500).json({ 
      success: false, 
      error: `AI Service Error: ${error.message || 'The AI service is temporarily offline.'}` 
    });
  }
};

// ── GET /api/ai/usage ──────────────────────────────────
const getUsage = async (req, res) => {
  try {
    if (!req.user || !req.user.id) return res.status(401).json({ success: false });
    const user = await User.findById(req.user.id);
    res.json({
      remainingQueries: user ? (AI_DAILY_LIMIT - user.dailyAiUsage) : 5,
      limit: AI_DAILY_LIMIT
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch AI usage.' });
  }
};

module.exports = { askAI, getUsage };
