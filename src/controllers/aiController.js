const { GoogleGenerativeAI } = require('@google/generative-ai');
const User = require('../models/User');
const Topic = require('../models/Topic');
const AiLog = require('../models/AiLog');
const crypto = require('crypto');

const AI_DAILY_LIMIT = 5;

// ── Initialise Gemini ──────────────────────────────────
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// ── Helper: Today's date string YYYY-MM-DD ─────────────
const getTodayString = () => new Date().toISOString().split('T')[0];

// ── Helper: Build cache key ────────────────────────────
const buildCacheKey = (topicId, question) => {
  return crypto.createHash('md5').update(`${topicId}|${question}`).digest('hex');
};

// ── POST /api/ai/ask ───────────────────────────────────
const askAI = async (req, res) => {
  try {
    let { topicId, question } = req.body;

    // Handle string "undefined" from frontend
    if (topicId === 'undefined') {
      topicId = null;
    }

    if (!question || question.trim().length < 3) {
      return res.status(400).json({ success: false, error: 'Please provide a valid question.' });
    }

    // ── 1. Check & Reset Daily Usage ─────────────────
    const today = getTodayString();
    const user = await User.findById(req.user.id);

    // Reset counter if it's a new day
    if (user.lastUsageDate !== today) {
      user.dailyAiUsage = 0;
      user.lastUsageDate = today;
    }

    // ── 2. Enforce daily limit ────────────────────────
    if (user.dailyAiUsage >= AI_DAILY_LIMIT) {
      return res.status(429).json({
        success: false,
        error: `Daily AI limit reached (${AI_DAILY_LIMIT} queries/day). Come back tomorrow!`,
        remainingQueries: 0,
      });
    }

    // ── 3. Check Cache to avoid repeat API calls ──────
    let topicContext = '';
    let chapterContext = '';

    if (topicId && topicId !== 'null') {
      try {
        const topic = await Topic.findById(topicId);
        if (topic) {
          topicContext = topic.topic.english;
          chapterContext = topic.chapter?.name?.english || '';
        }
      } catch (err) {
        console.log('Invalid topicId in AI request, proceeding without context');
      }
    }

    const cacheKey = buildCacheKey(topicId || 'general', question.trim().toLowerCase());
    const cached = await AiLog.findOne({ cacheKey }).sort({ createdAt: -1 });

    if (cached) {
      return res.json({
        success: true,
        answer: cached.answer,
        fromCache: true,
        remainingQueries: AI_DAILY_LIMIT - user.dailyAiUsage,
      });
    }

    // ── 4. Build structured Gemini prompt ────────────
    const prompt = `You are a helpful Physics tutor for SSC (Class 9-10) students in Bangladesh following the NCTB curriculum.

${chapterContext ? `Chapter: ${chapterContext}` : ''}
${topicContext ? `Topic: ${topicContext}` : ''}

Student's Question: ${question}

Instructions:
- Explain in BOTH simple Bangla AND English
- Use very simple language suitable for a 14-16 year old student
- Give 1-2 concrete real-life examples from Bangladesh context (e.g., rickshaw, pond, cricket ball)
- If applicable, mention the relevant formula
- Keep the answer structured: first Bangla explanation, then English explanation
- Format: 
  🇧🇩 বাংলায় ব্যাখ্যা:
  [Bangla explanation here]
  
  🇬🇧 English Explanation:
  [English explanation here]
  
  💡 Example / উদাহরণ:
  [Example here in both languages]`;

    // ── 5. Call Gemini API ─────────────────────────────
    const result = await model.generateContent(prompt);
    const answer = result.response.text();

    // ── 6. Save to AI logs (with cache key) ──────────
    await AiLog.create({
      userId: req.user.id,
      topicId: (topicId && topicId !== 'null') ? topicId : null,
      question,
      answer,
      cacheKey,
    });

    // ── 7. Increment user's daily usage ───────────────
    user.dailyAiUsage += 1;
    await user.save();

    res.json({
      success: true,
      answer,
      fromCache: false,
      remainingQueries: AI_DAILY_LIMIT - user.dailyAiUsage,
    });
  } catch (error) {
    console.error('AI ask error:', error);

    // Provide a meaningful error without exposing internals
    if (error.message && error.message.includes('API_KEY')) {
      return res.status(500).json({ success: false, error: 'AI service configuration error.' });
    }

    res.status(500).json({ success: false, error: 'AI tutor is temporarily unavailable. Try again.' });
  }
};

// ── GET /api/ai/usage ─────────────────────────────────
const getUsage = async (req, res) => {
  try {
    const today = getTodayString();
    const user = await User.findById(req.user.id);

    const usage = user.lastUsageDate !== today ? 0 : user.dailyAiUsage;

    res.json({
      success: true,
      dailyAiUsage: usage,
      remainingQueries: Math.max(0, AI_DAILY_LIMIT - usage),
      limit: AI_DAILY_LIMIT,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch AI usage.' });
  }
};

module.exports = { askAI, getUsage };
