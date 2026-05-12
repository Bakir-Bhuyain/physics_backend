const fs = require('fs');
const path = require('path');

// We can just manually construct the frontmatter to avoid needing 'yaml' dependency.
const topics = [
  // ── CHAPTER 1: Physical Quantities and Measurements ──
  {
    topic: { bangla: 'ভৌত রাশি ও তাদের পরিমাপ', english: 'Physical Quantities and Their Measurement' },
    chapter: { 
      number: 1, 
      name: { bangla: 'ভৌত রাশি ও পরিমাপ', english: 'Physical Quantities and Measurement' } 
    },
    class: 9,
    subject: 'physics',
    content: {
      bangla: 'পদার্থবিজ্ঞানে যা কিছু পরিমাপ করা যায় তাকেই রাশি বলা হয়। যেমন- দৈর্ঘ্য, ভর, সময় ইত্যাদি। রাশি দুই প্রকার: মৌলিক রাশি ও লব্ধ রাশি।\n\n**Example Markdown Format:**\n$F = ma$',
      english: 'In physics, anything that can be measured is called a quantity. For example, length, mass, time, etc. Quantities are of two types: fundamental and derived.\n\n**Example Markdown Format:**\n$E = mc^2$'
    },
    formulas: [
      { 
        name: { bangla: 'স্লাইড ক্যালিপার্সের ভার্নিয়ার ধ্রুবক', english: 'Vernier Constant' }, 
        formula: 'VC = s - v = s/n', 
        explanation: { bangla: 's = প্রধান স্কেলের ১ ভাগের দৈর্ঘ্য, n = ভার্নিয়ার স্কেলের ভাগের সংখ্যা', english: 's = length of 1 division of main scale, n = total divisions of vernier scale' } 
      }
    ],
    order: 1
  },
  // ── CHAPTER 2: Motion ──
  {
    topic: { bangla: 'গতি ও এর প্রকারভেদ', english: 'Motion and its Types' },
    chapter: { 
      number: 2, 
      name: { bangla: 'গতি', english: 'Motion' } 
    },
    class: 9,
    subject: 'physics',
    content: {
      bangla: 'সময়ের সাথে কোনো বস্তুর অবস্থানের পরিবর্তনই হলো গতি। গতির প্রকারভেদ: রৈখিক গতি, ঘূর্ণন গতি, পর্যাবৃত্ত গতি ইত্যাদি।',
      english: 'Change of position of an object with time is called motion. Types of motion: Linear, Rotational, Periodic, etc.'
    },
    formulas: [
      { 
        name: { bangla: 'ত্বরণ', english: 'Acceleration' }, 
        formula: 'a = (v - u) / t', 
        explanation: { bangla: 'বেগের পরিবর্তনের হারই হলো ত্বরণ।', english: 'Acceleration is the rate of change of velocity.' } 
      },
      { 
        name: { bangla: 'দূরত্ব', english: 'Distance' }, 
        formula: 's = ut + \\frac{1}{2}at^2', 
        explanation: { bangla: 'u = আদি বেগ, a = ত্বরণ, t = সময়।', english: 'u = initial velocity, a = acceleration, t = time.' } 
      }
    ],
    order: 1
  }
];

const targetDir = path.join(__dirname, '../data/chapters');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

topics.forEach((topicData, index) => {
  const frontmatter = {
    class: topicData.class,
    subject: topicData.subject,
    chapter_number: topicData.chapter.number,
    chapter_name_bangla: topicData.chapter.name.bangla,
    chapter_name_english: topicData.chapter.name.english,
    topic_bangla: topicData.topic.bangla,
    topic_english: topicData.topic.english,
    order: topicData.order,
    formulas: topicData.formulas,
    content_bangla: topicData.content.bangla
  };

  const yamlString = JSON.stringify(frontmatter, null, 2);
  
  // Create markdown file
  const mdContent = `---json\n${yamlString}\n---\n\n${topicData.content.english}\n`;
  
  const fileName = `class_${topicData.class}_chapter_${topicData.chapter.number}_topic_${index + 1}.md`;
  fs.writeFileSync(path.join(targetDir, fileName), mdContent);
  console.log(`Generated ${fileName}`);
});

console.log('Migration Complete.');
