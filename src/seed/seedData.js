const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Topic = require('../models/Topic');

dotenv.config({ path: path.join(__dirname, '../../.env') });

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
      bangla: 'পদার্থবিজ্ঞানে যা কিছু পরিমাপ করা যায় তাকেই রাশি বলা হয়। যেমন- দৈর্ঘ্য, ভর, সময় ইত্যাদি। রাশি দুই প্রকার: মৌলিক রাশি ও লব্ধ রাশি।',
      english: 'In physics, anything that can be measured is called a quantity. For example, length, mass, time, etc. Quantities are of two types: fundamental and derived.'
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
        formula: 's = ut + ½at²', 
        explanation: { bangla: 'u = আদি বেগ, a = ত্বরণ, t = সময়।', english: 'u = initial velocity, a = acceleration, t = time.' } 
      }
    ],
    order: 1
  },

  // ── CHAPTER 3: Force ──
  {
    topic: { bangla: 'নিউটনের গতির সূত্র', english: "Newton's Laws of Motion" },
    chapter: { 
      number: 3, 
      name: { bangla: 'বল', english: 'Force' } 
    },
    class: 9,
    subject: 'physics',
    content: {
      bangla: 'নিউটনের দ্বিতীয় সূত্র অনুসারে, বস্তুর ভরবেগের পরিবর্তনের হার তার উপর প্রযুক্ত বলের সমানুপাতিক।',
      english: "According to Newton's second law, the rate of change of momentum is proportional to the applied force."
    },
    formulas: [
      { 
        name: { bangla: 'বল', english: 'Force' }, 
        formula: 'F = ma', 
        explanation: { bangla: 'বল = ভর × ত্বরণ।', english: 'Force = mass × acceleration.' } 
      }
    ],
    order: 1
  },

  // ── CHAPTER 4: Work, Power and Energy ──
  {
    topic: { bangla: 'কাজ ও গতিশক্তি', english: 'Work and Kinetic Energy' },
    chapter: { 
      number: 4, 
      name: { bangla: 'কাজ, ক্ষমতা ও শক্তি', english: 'Work, Power and Energy' } 
    },
    class: 9,
    subject: 'physics',
    content: {
      bangla: 'কাজ হলো বল ও সরণের গুণফল। শক্তি হলো কাজ করার সামর্থ্য।',
      english: 'Work is the product of force and displacement. Energy is the capacity to do work.'
    },
    formulas: [
      { 
        name: { bangla: 'কাজ', english: 'Work' }, 
        formula: 'W = Fs cosθ', 
        explanation: { bangla: 'θ হলো বল ও সরণের মধ্যবর্তী কোণ।', english: 'θ is the angle between force and displacement.' } 
      },
      { 
        name: { bangla: 'গতিশক্তি', english: 'Kinetic Energy' }, 
        formula: 'Ek = ½mv²', 
        explanation: { bangla: 'm = ভর, v = বেগ।', english: 'm = mass, v = velocity.' } 
      }
    ],
    order: 1
  },

  // ── CHAPTER 5: State of Matter and Pressure ──
  {
    topic: { bangla: 'চাপ ও প্যাস্কেলের সূত্র', english: "Pressure and Pascal's Law" },
    chapter: { 
      number: 5, 
      name: { bangla: 'পদার্থের অবস্থা ও চাপ', english: 'State of Matter and Pressure' } 
    },
    class: 9,
    subject: 'physics',
    content: {
      bangla: 'একক ক্ষেত্রফলের ওপর প্রযুক্ত লম্ব বলকে চাপ বলে। প্যাস্কেলের সূত্রানুসারে, আবদ্ধ তরলে চাপ দিলে তা সবদিকে সমানভাবে সঞ্চালিত হয়।',
      english: 'Force applied per unit area is called pressure. According to Pascal\'s law, pressure applied to an enclosed fluid is transmitted equally in all directions.'
    },
    formulas: [
      { 
        name: { bangla: 'চাপ', english: 'Pressure' }, 
        formula: 'P = F / A', 
        explanation: { bangla: 'F = বল, A = ক্ষেত্রফল।', english: 'F = force, A = area.' } 
      },
      { 
        name: { bangla: 'তরলের অভ্যন্তরে চাপ', english: 'Pressure inside fluid' }, 
        formula: 'P = hρg', 
        explanation: { bangla: 'h = গভীরতা, ρ = ঘনত্ব, g = অভিকর্ষজ ত্বরণ।', english: 'h = depth, ρ = density, g = gravity.' } 
      }
    ],
    order: 1
  },

  // ── CHAPTER 6: Effect of Heat on Matter ──
  {
    topic: { bangla: 'তাপীয় প্রসারণ', english: 'Thermal Expansion' },
    chapter: { 
      number: 6, 
      name: { bangla: 'বস্তুর ওপর তাপের প্রভাব', english: 'Effect of Heat on Matter' } 
    },
    class: 9,
    subject: 'physics',
    content: {
      bangla: 'তাপমাত্রা বাড়লে পদার্থের আয়তন বৃদ্ধি পায়। কঠিন পদার্থের ক্ষেত্রে তিন ধরণের প্রসারণ সহগ থাকে: দৈর্ঘ্য, ক্ষেত্রফল ও আয়তন প্রসারণ সহগ।',
      english: 'Materials expand when temperature increases. For solids, there are three types of expansion coefficients: linear, area, and volume.'
    },
    formulas: [
      { 
        name: { bangla: 'দৈর্ঘ্য প্রসারণ সহগ', english: 'Linear Expansion Coeff' }, 
        formula: 'α = ΔL / (L1 × ΔT)', 
        explanation: { bangla: 'ΔL = দৈর্ঘ্যের পরিবর্তন, ΔT = তাপমাত্রার পরিবর্তন।', english: 'ΔL = change in length, ΔT = change in temperature.' } 
      }
    ],
    order: 1
  },

  // ── CHAPTER 7: Waves and Sound ──
  {
    topic: { bangla: 'তরঙ্গ ও প্রতিধ্বনি', english: 'Waves and Echo' },
    chapter: { 
      number: 7, 
      name: { bangla: 'তরঙ্গ ও শব্দ', english: 'Waves and Sound' } 
    },
    class: 9,
    subject: 'physics',
    content: {
      bangla: 'তরঙ্গ হলো একটি পর্যাবৃত্ত আন্দোলন যা মাধ্যমের কণাগুলোর স্থায়ী স্থানান্তর ছাড়াই শক্তি সঞ্চালন করে।',
      english: 'A wave is a periodic disturbance that transfers energy without a permanent transfer of particles of the medium.'
    },
    formulas: [
      { 
        name: { bangla: 'তরঙ্গ বেগ', english: 'Wave Velocity' }, 
        formula: 'v = fλ', 
        explanation: { bangla: 'f = কম্পাঙ্ক, λ = তরঙ্গদৈর্ঘ্য।', english: 'f = frequency, λ = wavelength.' } 
      }
    ],
    order: 1
  },

  // ── CHAPTER 8: Reflection of Light ──
  {
    topic: { bangla: 'দর্পণের সূত্র', english: 'Mirror Formula' },
    chapter: { 
      number: 8, 
      name: { bangla: 'আলোর প্রতিফলন', english: 'Reflection of Light' } 
    },
    class: 10,
    subject: 'physics',
    content: {
      bangla: 'গোলীয় দর্পণের ক্ষেত্রে ফোকাস দূরত্ব বক্রতার ব্যাসার্ধের অর্ধেক হয়।',
      english: 'For spherical mirrors, focal length is half of the radius of curvature.'
    },
    formulas: [
      { 
        name: { bangla: 'দর্পণের সমীকরণ', english: 'Mirror Equation' }, 
        formula: '1/f = 1/u + 1/v', 
        explanation: { bangla: 'f = ফোকাস দূরত্ব, u = লক্ষ্যবস্তুর দূরত্ব, v = প্রতিবিম্বের দূরত্ব।', english: 'f = focal length, u = object distance, v = image distance.' } 
      }
    ],
    order: 1
  },

  // ── CHAPTER 9: Refraction of Light ──
  {
    topic: { bangla: 'প্রতিসরাঙ্ক ও স্নেলের সূত্র', english: "Refractive Index and Snell's Law" },
    chapter: { 
      number: 9, 
      name: { bangla: 'আলোর প্রতিসরণ', english: 'Refraction of Light' } 
    },
    class: 10,
    subject: 'physics',
    content: {
      bangla: 'আলো যখন এক স্বচ্ছ মাধ্যম থেকে অন্য মাধ্যমে প্রবেশ করে তখন এর দিক পরিবর্তন হয়। একে প্রতিসরণ বলে।',
      english: 'When light enters from one transparent medium to another, its direction changes. This is called refraction.'
    },
    formulas: [
      { 
        name: { bangla: 'স্নেলের সূত্র', english: "Snell's Law" }, 
        formula: 'n1 sinθ1 = n2 sinθ2', 
        explanation: { bangla: 'n1, n2 হলো মাধ্যমদ্বয়ের প্রতিসরাঙ্ক।', english: 'n1, n2 are refractive indices of the two media.' } 
      }
    ],
    order: 1
  },

  // ── CHAPTER 10: Static Electricity ──
  {
    topic: { bangla: 'কুলম্বের সূত্র', english: "Coulomb's Law" },
    chapter: { 
      number: 10, 
      name: { bangla: 'স্থির তড়িৎ', english: 'Static Electricity' } 
    },
    class: 10,
    subject: 'physics',
    content: {
      bangla: 'দুটি স্থির বিন্দু আধানের মধ্যবর্তী আকর্ষণ বা বিকর্ষণ বল তাদের আধানের গুণফলের সমানুপাতিক এবং দূরত্বের বর্গের ব্যস্তানুপাতিক।',
      english: 'The force between two static point charges is proportional to the product of charges and inversely proportional to the square of the distance.'
    },
    formulas: [
      { 
        name: { bangla: 'স্থির বৈদ্যুতিক বল', english: 'Electrostatic Force' }, 
        formula: 'F = k(q1q2 / r²)', 
        explanation: { bangla: 'k = ধ্রুবক, q1, q2 = আধান, r = দূরত্ব।', english: 'k = constant, q1, q2 = charges, r = distance.' } 
      }
    ],
    order: 1
  },

  // ── CHAPTER 11: Current Electricity ──
  {
    topic: { bangla: 'ওহমের সূত্র ও ক্ষমতা', english: "Ohm's Law and Power" },
    chapter: { 
      number: 11, 
      name: { bangla: 'চল তড়িৎ', english: 'Current Electricity' } 
    },
    class: 10,
    subject: 'physics',
    content: {
      bangla: 'কোনো পরিবাহীর মধ্য দিয়ে প্রবাহিত তড়িৎ প্রবাহ এর দুই প্রান্তের বিভব পার্থক্যের সমানুপাতিক।',
      english: 'The current flowing through a conductor is proportional to the potential difference across its ends.'
    },
    formulas: [
      { 
        name: { bangla: 'ওহমের সূত্র', english: "Ohm's Law" }, 
        formula: 'V = IR', 
        explanation: { bangla: 'V = বিভব পার্থক্য, I = প্রবাহ, R = রোধ।', english: 'V = potential difference, I = current, R = resistance.' } 
      },
      { 
        name: { bangla: 'বৈদ্যুতিক ক্ষমতা', english: 'Electrical Power' }, 
        formula: 'P = VI = I²R', 
        explanation: { bangla: 'P = ক্ষমতা (ওয়াট)।', english: 'P = power (Watt).' } 
      }
    ],
    order: 1
  },

  // ── CHAPTER 12: Magnetic Effect of Current ──
  {
    topic: { bangla: 'তড়িচ্চুম্বকীয় আবেশ', english: 'Electromagnetic Induction' },
    chapter: { 
      number: 12, 
      name: { bangla: 'বিদ্যুতের চৌম্বক ক্রিয়া', english: 'Magnetic Effect of Current' } 
    },
    class: 10,
    subject: 'physics',
    content: {
      bangla: 'তড়িৎ প্রবাহের ফলে পরিবাহী তারের চারপাশে চৌম্বক ক্ষেত্র তৈরি হয়। ফ্যারাডের সূত্রানুসারে চৌম্বক ফ্লাক্সের পরিবর্তন হলে আবিষ্ট ভোল্টেজ তৈরি হয়।',
      english: 'Magnetic fields are created around wires carrying electric current. According to Faraday\'s law, changing magnetic flux induces voltage.'
    },
    formulas: [
      { 
        name: { bangla: 'ট্রান্সফর্মার সূত্র', english: 'Transformer Equation' }, 
        formula: 'Vp/Vs = Np/Ns', 
        explanation: { bangla: 'p = প্রাইমারি, s = সেকেন্ডারি।', english: 'p = primary, s = secondary.' } 
      }
    ],
    order: 1
  },

  // ── CHAPTER 13: Modern Physics and Electronics ──
  {
    topic: { bangla: 'তেজস্ক্রিয়তা ও অর্ধ-পরিবাহী', english: 'Radioactivity and Semiconductors' },
    chapter: { 
      number: 13, 
      name: { bangla: 'আধুনিক পদার্থবিজ্ঞান ও ইলেকট্রনিক্স', english: 'Modern Physics and Electronics' } 
    },
    class: 10,
    subject: 'physics',
    content: {
      bangla: 'তেজস্ক্রিয়তা হলো স্বতঃস্ফূর্তভাবে পরমাণুর নিউক্লিয়াস থেকে রশ্মি বিকিরণ। আধুনিক ইলেকট্রনিক্সে সেমি-কন্ডাক্টর যেমন সিলিকন ও জার্মানিয়াম গুরুত্বপূর্ণ।',
      english: 'Radioactivity is the spontaneous emission of radiation from atomic nuclei. Semiconductors like Silicon and Germanium are vital for modern electronics.'
    },
    formulas: [
      { 
        name: { bangla: 'আইনস্টাইনের শক্তি সমীকরণ', english: "Einstein's Energy Equation" }, 
        formula: 'E = mc²', 
        explanation: { bangla: 'E = শক্তি, m = ভর, c = আলোর বেগ।', english: 'E = energy, m = mass, c = light speed.' } 
      }
    ],
    order: 1
  },

  // ── CHAPTER 14: Physics to Save Life ──
  {
    topic: { bangla: 'চিকিৎসায় পদার্থবিজ্ঞান (X-Ray & MRI)', english: 'Physics in Medicine (X-Ray & MRI)' },
    chapter: { 
      number: 14, 
      name: { bangla: 'জীবন বাঁচাতে পদার্থবিজ্ঞান', english: 'Physics to Save Life' } 
    },
    class: 10,
    subject: 'physics',
    content: {
      bangla: 'এক্স-রে উচ্চ শক্তি সম্পন্ন ইলেকট্রনের দ্বারা তৈরি হয়। ইসিজি এবং এন্ডোস্কোপি আধুনিক চিকিৎসায় গুরুত্বপূর্ণ ভূমিকা পালন করে।',
      english: 'X-rays are produced by high-energy electrons. ECG and Endoscopy play crucial roles in modern medicine.'
    },
    formulas: [],
    order: 1
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected: ' + mongoose.connection.host);

    await Topic.deleteMany({});
    console.log('Old topics deleted...');

    await Topic.insertMany(topics);
    console.log('SSC Physics Full Syllabus Seeded Successfully! 🚀');

    process.exit();
  } catch (err) {
    console.error('Error with seeding:', err.message);
    process.exit(1);
  }
};

seedDB();
