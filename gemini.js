const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateSummary(text, instructions) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
  You are an expert meeting notes summarizer. Below is a meeting transcript and specific instructions for how to summarize it.

  INSTRUCTIONS: ${instructions}

  MEETING TRANSCRIPT:
  ${text}

  Generate a well-structured summary following the instructions exactly.
  Format the output with proper headings, bullet points, and clear sections.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error("Failed to generate summary with Gemini");
  }
}

module.exports = { generateSummary };