const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars from the correct path
dotenv.config({ path: path.join(__dirname, '../.env') });

const Topic = require('../src/models/Topic');

const seedClass10Full = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB for Class 10 Seeding...');

    // Clear existing Class 10 data if any
    await Topic.deleteMany({ class: 10 });

    const class10Data = [
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
          bangla: 'চার্জের ধারণা ও ঘর্ষণ',
          english: 'Concept of Charge and Friction'
        },
        content: {
          bangla: 'স্থির তড়িৎ বিজ্ঞানের একটি শাখা যেখানে স্থির চার্জ নিয়ে আলোচনা করা হয়। যখন দুটি বস্তুকে ঘর্ষণ করা হয়, তখন ইলেকট্রন আদান-প্রদানের মাধ্যমে তারা চার্জিত হয়।',
          english: 'Static electricity deals with stationary charges. When two objects are rubbed together, they become charged through the transfer of electrons.'
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
          bangla: 'তড়িৎ প্রবাহ ও ওহমের সূত্র',
          english: "Electric Current and Ohm's Law"
        },
        content: {
          bangla: 'ইলেকট্রনের প্রবাহই হলো তড়িৎ প্রবাহ। ওহমের সূত্র অনুসারে, পরিবাহীর মধ্য দিয়ে প্রবাহিত তড়িৎ প্রবাহ বিভব পার্থক্যের সমানুপাতিক।',
          english: "The flow of electrons is electric current. Ohm's law states that the current through a conductor is directly proportional to the voltage across it."
        },
        formulas: [
          {
            name: { bangla: 'ওহমের সূত্র', english: "Ohm's Law" },
            formula: 'V = IR',
            explanation: { 
               bangla: 'এখানে V হলো বিভব পার্থক্য, I হলো তড়িৎ প্রবাহ এবং R হলো রোধ।', 
               english: 'Where V is voltage, I is current, and R is resistance.' 
            }
          }
        ],
        order: 1
      },
      {
        class: 10,
        subject: 'physics',
        chapter: {
          number: 3,
          name: {
            bangla: 'তড়িৎ প্রবাহের চৌম্বক ক্রিয়া',
            english: 'Magnetic Effect of Current'
          }
        },
        topic: {
          bangla: 'সোলেনয়েড ও তড়িৎচৌম্বক',
          english: 'Solenoids and Electromagnets'
        },
        content: {
          bangla: 'যখন কোনো তারের মধ্য দিয়ে তড়িৎ প্রবাহিত হয়, তখন তার চারপাশে একটি চৌম্বক ক্ষেত্র তৈরি হয়। একেই তড়িৎ প্রবাহের চৌম্বক ক্রিয়া বলে।',
          english: 'When electric current flows through a wire, a magnetic field is created around it. This is called the magnetic effect of current.'
        },
        order: 1
      }
    ];

    await Topic.insertMany(class10Data);
    console.log('✅ Class 10 Curriculum Synchronized!');
    process.exit();
  } catch (err) {
    console.error('❌ Seeding Error:', err);
    process.exit(1);
  }
};

seedClass10Full();
