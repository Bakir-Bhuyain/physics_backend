const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const matter = require('gray-matter');
const Topic = require('../models/Topic');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected: ' + mongoose.connection.host);

    await Topic.deleteMany({});
    console.log('Old topics deleted...');

    const dataDir = path.join(__dirname, '../data/chapters');
    if (!fs.existsSync(dataDir)) {
      console.log('No data directory found. Please run migrateToMd.js first.');
      process.exit(0);
    }

    const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.md'));
    const topics = [];

    for (const file of files) {
      const fileContent = fs.readFileSync(path.join(dataDir, file), 'utf-8');
      
      // Parse frontmatter (JSON/YAML) and body (Markdown)
      // Since we wrote json block, we tell gray-matter to parse json. But json is valid yaml anyway.
      const parsed = matter(fileContent); 
      let data = parsed.data;
      if (typeof data === 'string') {
          // If it parsed the json block as string
          data = JSON.parse(data);
      }

      topics.push({
        class: data.class,
        subject: data.subject || 'physics',
        chapter: {
          number: data.chapter_number,
          name: {
            bangla: data.chapter_name_bangla,
            english: data.chapter_name_english
          }
        },
        topic: {
          bangla: data.topic_bangla,
          english: data.topic_english
        },
        content: {
          bangla: data.content_bangla,
          english: parsed.content.trim() // The Markdown body goes into english content
        },
        formulas: data.formulas || [],
        order: data.order || 0
      });
    }

    if (topics.length > 0) {
      await Topic.insertMany(topics);
      console.log(`Successfully seeded ${topics.length} topics from Markdown files! 🚀`);
    } else {
      console.log('No topics found to seed.');
    }

    process.exit();
  } catch (err) {
    console.error('Error with seeding:', err.message);
    process.exit(1);
  }
};

seedDB();
