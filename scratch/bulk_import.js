const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const Topic = require('../src/models/Topic');

dotenv.config({ path: path.join(__dirname, '../.env') });

async function bulkImport() {
  try {
    console.log('🚀 Starting Neural Content Import...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to Cloud Database.');

    const contentDir = path.join(__dirname, '../content');
    if (!fs.existsSync(contentDir)) {
      console.error('❌ Content directory not found!');
      process.exit(1);
    }

    const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.json'));
    console.log(`📂 Found ${files.length} chapter files.`);

    for (const file of files) {
      const data = JSON.parse(fs.readFileSync(path.join(contentDir, file), 'utf8'));
      console.log(`📖 Importing Class ${data.classId} | Chapter ${data.chapter.number}: ${data.chapter.name.english}...`);

      for (const tData of data.topics) {
        await Topic.findOneAndUpdate(
          { 
            class: data.classId, 
            'chapter.number': data.chapter.number, 
            'topic.english': tData.topic.english 
          },
          {
            ...tData,
            class: data.classId,
            chapter: data.chapter
          },
          { upsert: true, new: true }
        );
      }
      console.log(`✅ Successfully synced: ${file}`);
    }

    console.log('\n✨ BULK IMPORT COMPLETE! All content is now live on your website.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Import failed:', err);
    process.exit(1);
  }
}

bulkImport();
