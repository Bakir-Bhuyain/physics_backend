const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function scanModels() {
  try {
    console.log('🔍 Scanning available models for your API Key...');
    // Note: The SDK might not have listModels exposed in the same way, 
    // so we will try to probe the two most common ones directly.
    
    const modelsToProbe = [
      "gemini-1.5-flash",
      "gemini-1.5-pro",
      "gemini-pro",
      "gemini-1.0-pro"
    ];

    for (const modelName of modelsToProbe) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hi");
        console.log(`✅ SUCCESS: "${modelName}" is working!`);
        process.exit(0);
      } catch (e) {
        console.log(`❌ FAILED: "${modelName}" - ${e.message.split('\n')[0]}`);
      }
    }
    console.log('⚠️ None of the standard models worked. Please check if your API Key is active in Google AI Studio.');
  } catch (err) {
    console.error('Diagnostic error:', err);
  }
}

scanModels();
