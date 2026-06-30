import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy_key");

export async function POST(request) {
  try {
    const { materialType, gradeLevel, subject, topic, tone, imageBase64, mimeType } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ 
        text: `### Mock ${materialType} for ${subject}\n\n**Topic:** ${topic}\n**Grade:** ${gradeLevel}\n**Tone:** ${tone}\n\nThis is a mock response because the GEMINI_API_KEY is missing in your .env.local file.`
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    let structureInstructions = "";
    if (materialType === 'មេរៀនសង្ខេប') {
      structureInstructions = `
You MUST structure the output with the following exact Markdown headings:
## 1. វត្ថុបំណងមេរៀន (Lesson Objectives)
## 2. សម្ភារៈឧបទ្ទេស (Materials Needed)
## 3. សេចក្តីផ្តើម (Introduction)
## 4. ខ្លឹមសារមេរៀន (Core Lesson)
## 5. សេចក្តីសន្និដ្ឋាន (Conclusion & Assessment)
`;
    } else if (materialType === 'វិញ្ញាសា និងចម្លើយ') {
      structureInstructions = `
You MUST structure the output with the following exact Markdown headings:
## ផ្នែកទី១៖ សំណួរពហុជ្រើសរើស (Multiple Choice - 5 questions)
## ផ្នែកទី២៖ សំណួរសរសេរ (Short Answer - 3 questions)
## អត្រាកំណែ (Answer Key)
Provide clear answers for all questions in the Answer Key section.
`;
    } else if (materialType === 'សំណួរពិភាក្សា') {
      structureInstructions = `
You MUST structure the output with the following exact Markdown headings:
## សំណួរពិភាក្សាជាក្រុម (Group Discussion Questions)
## សំណួរត្រិះរិះពិចារណា (Critical Thinking Questions)
## គន្លឹះសម្រាប់គ្រូ (Facilitator Tips)
`;
    } else {
      structureInstructions = `Structure your response cleanly using Markdown headings.`;
    }

    let toneInstructions = "";
    if (tone === 'ផ្លូវការ') toneInstructions = "Maintain a highly formal, academic, and professional tone.";
    else if (tone === 'រីករាយ') toneInstructions = "Use a fun, engaging, enthusiastic, and highly encouraging tone.";
    else if (tone === 'តឹងរ៉ឹង') toneInstructions = "Use a strict, highly disciplined, and rigorous tone.";

    let prompt = `You are an expert, highly experienced teacher creating educational material in Khmer.
Task: Generate a ${materialType} for a ${gradeLevel} class.
Subject: ${subject}
Topic: ${topic}

Tone Requirements: ${toneInstructions}
Language: Primarily Khmer, but you can use English in parentheses for technical terms.

Formatting Requirements:
${structureInstructions}

Make the content directly usable by a teacher in a classroom. Do not output any preamble, just start with the requested structure.`;

    if (imageBase64 && mimeType) {
      prompt += "\n\nAdditionally, I have provided an image of a lesson or assignment. Please incorporate the concepts, questions, or text from this image into your generation.";
      const imagePart = {
        inlineData: {
          data: imageBase64.split(',')[1] || imageBase64, // Remove data URL prefix if present
          mimeType: mimeType
        }
      };
      
      const result = await model.generateContent([prompt, imagePart]);
      const text = result.response.text();
      return NextResponse.json({ text });
    } else {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      return NextResponse.json({ text });
    }

  } catch (error) {
    console.error("Error generating AI content:", error);
    return NextResponse.json({ error: error.message || "Failed to generate content" }, { status: 500 });
  }
}
