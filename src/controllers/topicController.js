const Topic = require('../models/Topic');

// ── GET /api/topics ────────────────────────────────────
// Optional query: ?chapter=1&class=9
const getTopics = async (req, res) => {
  try {
    const filter = { subject: 'physics' };

    if (req.query.chapter) filter['chapter.number'] = Number(req.query.chapter);
    if (req.query.class) filter['class'] = Number(req.query.class);

    const topics = await Topic.find(filter)
      .sort({ 'chapter.number': 1, order: 1 })
      .select('-__v');

    res.json({ success: true, count: topics.length, topics });
  } catch (error) {
    console.error('Get topics error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch topics.' });
  }
};

// ── GET /api/topics/:id ────────────────────────────────
const getTopic = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id).select('-__v');

    if (!topic) {
      return res.status(404).json({ success: false, error: 'Topic not found.' });
    }

    res.json({ success: true, topic });
  } catch (error) {
    console.error('Get topic error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch topic.' });
  }
};

// ── GET /api/topics/chapters ───────────────────────────
// Returns a list of unique chapters with topic counts
const getChapters = async (req, res) => {
  try {
    const classFilter = req.query.class ? Number(req.query.class) : { $in: [9, 10] };

    const chapters = await Topic.aggregate([
      { $match: { subject: 'physics', class: classFilter } },
      {
        $group: {
          _id: '$chapter.number',
          chapterName: { $first: '$chapter.name' },
          topicCount: { $sum: 1 },
          class: { $first: '$class' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({ success: true, chapters });
  } catch (error) {
    console.error('Get chapters error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch chapters.' });
  }
};

module.exports = { getTopics, getTopic, getChapters };
