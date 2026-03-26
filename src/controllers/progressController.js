const Progress = require('../models/Progress');
const Topic = require('../models/Topic');
const User = require('../models/User');

// ── POST /api/progress/update ──────────────────────────
const updateProgress = async (req, res) => {
  try {
    const { topicId, status } = req.body;

    if (!topicId) {
      return res.status(400).json({ success: false, error: 'topicId is required.' });
    }

    const topic = await Topic.findById(topicId);
    if (!topic) {
      return res.status(404).json({ success: false, error: 'Topic not found.' });
    }

    // Find existing or create new progress
    let progress = await Progress.findOne({ userId: req.user.id, topicId });
    
    if (!progress) {
      progress = new Progress({ 
        userId: req.user.id, 
        topicId, 
        status: status || 'reading' 
      });
    } else {
      progress.status = status || progress.status;
      progress.lastVisited = new Date();
    }

    // XP Logic: Award 100 XP if mastered for the first time
    let xpGained = 0;
    let leveledUp = false;

    if (progress.status === 'mastered' && !progress.xpAwarded) {
      const user = await User.findById(req.user.id);
      user.xp += 100;
      xpGained = 100;
      progress.xpAwarded = true;

      // Check Level Up (Every 500 XP = 1 Level)
      const newLevel = Math.floor(user.xp / 500) + 1;
      if (newLevel > user.level) {
        user.level = newLevel;
        leveledUp = true;
        // Optional: Add achievement for level up
        user.achievements.push({
          id: `level_${newLevel}`,
          name: { 
            bangla: `লেভেল ${newLevel} অর্জন`, 
            english: `Reached Level ${newLevel}` 
          }
        });
      }
      await user.save();
    }

    await progress.save();

    res.json({ 
      success: true, 
      progress, 
      xpGained, 
      leveledUp 
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ success: false, error: 'Failed to update progress.' });
  }
};

// ── GET /api/progress/user ─────────────────────────────
const getUserProgress = async (req, res) => {
  try {
    const [progressRecords, user] = await Promise.all([
      Progress.find({ userId: req.user.id }).populate('topicId'),
      User.findById(req.user.id)
    ]);

    const chapterStats = {};
    for (const record of progressRecords) {
      if (!record.topicId) continue;
      const chapterNum = record.topicId.chapter?.number;
      if (!chapterNum) continue;

      if (!chapterStats[chapterNum]) {
        chapterStats[chapterNum] = { total: 0, completed: 0, mastered: 0 };
      }
      chapterStats[chapterNum].total++;
      if (record.status === 'completed' || record.status === 'mastered') {
        chapterStats[chapterNum].completed++;
      }
      if (record.status === 'mastered') {
        chapterStats[chapterNum].mastered++;
      }
    }

    res.json({
      success: true,
      progress: progressRecords,
      userStats: {
        xp: user.xp,
        level: user.level,
        achievements: user.achievements,
        nextLevelXp: (user.level) * 500
      },
      chapterStats,
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch progress.' });
  }
};

module.exports = { updateProgress, getUserProgress };
