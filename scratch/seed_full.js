const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });
const Topic = require('../src/models/Topic');

const seedFull = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to Atlas Cloud...');

    // Wipe old data to start fresh
    await Topic.deleteMany({});

    const allData = [
      // 📚 CLASS 9
      {
        class: 9,
        subject: 'physics',
        chapter: { number: 1, name: { bangla: 'ভৌত রাশি ও পরিমাপ', english: 'Physical Quantities and Measurement' } },
        topic: { bangla: 'পদার্থবিজ্ঞানের পরিসর', english: 'Scope of Physics' },
        content: { bangla: 'পদার্থবিজ্ঞান বিজ্ঞানের একটি প্রাচীন শাখা...', english: 'Physics is an ancient branch of science...' },
        order: 1
      },
      {
        class: 9,
        subject: 'physics',
        chapter: { number: 2, name: { bangla: 'গতি', english: 'Motion' } },
        topic: { bangla: 'গতির সমীকরণ', english: 'Equations of Motion' },
        content: { bangla: 'সময়ের সাথে অবস্থানের পরিবর্তনই গতি...', english: 'Change of position with time is motion...' },
        order: 1
      },
      // 📚 CLASS 10
      {
        class: 10,
        subject: 'physics',
        chapter: { number: 1, name: { bangla: 'স্থির তড়িৎ', english: 'Static Electricity' } },
        topic: { bangla: 'চার্জ ও ঘর্ষণ', english: 'Charge and Friction' },
        content: { bangla: 'স্থির চার্জের বিজ্ঞান...', english: 'Science of stationary charges...' },
        order: 1
      },
      {
        class: 10,
        subject: 'physics',
        chapter: { number: 2, name: { bangla: 'চল তড়িৎ', english: 'Current Electricity' } },
        topic: { bangla: 'ওহমের সূত্র', english: "Ohm's Law" },
        content: { bangla: 'তড়িৎ প্রবাহ ও বিভব পার্থক্য...', english: 'Current and Voltage...' },
        order: 1
      },
      {
        class: 10,
        subject: 'physics',
        chapter: { number: 3, name: { bangla: 'তড়িৎ প্রবাহের চৌম্বক ক্রিয়া', english: 'Magnetic Effect of Current' } },
        topic: { bangla: 'চৌম্বক ক্ষেত্র', english: 'Magnetic Fields' },
        content: { bangla: 'তড়িৎ ও চৌম্বক ক্রিয়া...', english: 'Electric and Magnetic effects...' },
        order: 1
      }
    ];

    await Topic.insertMany(allData);
    console.log('✅ COMPLETE CURRICULUM SYNCED (Class 9 & 10)!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedFull();
