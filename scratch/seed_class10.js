const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const Topic = require('../src/models/Topic');

const seedClass10 = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB...');

    const sampleTopics = [
      {
        class: 10,
        subject: 'physics',
        chapter: {
          number: 1,
          name: {
            bangla: 'স্থির তড়িৎ',
            english: 'Static Electricity'
          }
        },
        topic: {
          bangla: 'চার্জের ধারণা',
          english: 'Concept of Charge'
        },
        content: {
          bangla: 'স্থির তড়িৎ বিজ্ঞানের একটি শাখা যেখানে স্থির চার্জ নিয়ে আলোচনা করা হয়।',
          english: 'Static electricity is a branch of physics that deals with stationary charges.'
        },
        order: 1
      },
      {
        class: 10,
        subject: 'physics',
        chapter: {
          number: 2,
          name: {
            bangla: 'চল তড়িৎ',
            english: 'Current Electricity'
          }
        },
        topic: {
          bangla: 'ওহমের সূত্র',
          english: "Ohm's Law"
        },
        content: {
          bangla: 'ওহমের সূত্র অনুসারে, পরিবাহীর মধ্য দিয়ে প্রবাহিত তড়িৎ প্রবাহ বিভব পার্থক্যের সমানুপাতিক।',
          english: "Ohm's law states that the current through a conductor between two points is directly proportional to the voltage across the two points."
        },
        order: 1
      }
    ];

    await Topic.insertMany(sampleTopics);
    console.log('✅ Class 10 Data Seeded!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedClass10();
