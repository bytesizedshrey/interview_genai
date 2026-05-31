import { GoogleGenAI } from "@google/genai";
import { config } from "dotenv";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import puppeteer from "puppeteer";

config();

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

const interviewReportSchema = z.object({
  matchScore: z
    .number()
    .describe(
      "A score between 0 and 100 indicating how well the candidate profile matches the job"
    ),

  technicalQuestions: z
    .array(
      z.object({
        question: z.string().describe("The technical question that can be asked in the interview"),
        intention: z.string().describe("The intention of the interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc."),
      })
    )
    .describe("Technical interview questions"),

  behavioralQuestions: z
    .array(
      z.object({
        question: z.string().describe("The behavioral question that can be asked in the interview"),
        intention: z.string().describe("The intention of the interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc."),
      })
    )
    .describe("Behavioral interview questions"),

  skillGaps: z
    .array(
      z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum(["low", "medium", "high"]).describe("The severity of this skill gap"),
      })
    )
    .describe("Candidate skill gaps"),

  preparationPlan: z
    .array(
      z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan"),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day"),
      })
    )
    .describe("Day-wise preparation plan"),

  title: z.string().describe("The title of the job for which the interview report is generated"),
});

async function invokeGeminiAi() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents:
      "Why is Charles Leclerc always remembered while talking about Monaco?",
  });

  console.log(response.text);
}

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `
Generate an interview report for a candidate with the following details:

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: zodToJsonSchema(interviewReportSchema),
    },
  });

  return JSON.parse(response.text);
}

async function generatePdfFromHtml(htmlContent) {
  // Launch Puppeteer headless browser
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    margin: {
      top: "20mm",
      bottom: "20mm",
      left: "15mm",
      right: "15mm"
    }
  });

  await browser.close();
  return pdfBuffer;
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
  const resumePdfSchema = z.object({
    html: z.string().describe(
      "The HTML content of the resume, well-structured, clean, professional, and easily printable to PDF."
    ),
  });

  const prompt = `
Generate resume for a candidate with the following details:
Resume Context:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}

The response MUST be a JSON object with a single field "html" containing clean, well-styled HTML of the resume.
The resume should be tailored to fit the target Job Description, highlight key matching skills, and follow high-end typography (e.g. elegant margins, nice spacing, clear sections).
The CSS should be embedded in a <style> tag in the HTML. Keep it clean, ATS friendly, and highly professional. Avoid dark background colors in the print CSS, keeping the text dark and the background white. Ensure it is ideally 1-2 pages long.
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: zodToJsonSchema(resumePdfSchema),
    },
  });

  const jsonContent = JSON.parse(response.text);
  const pdfBuffer = await generatePdfFromHtml(jsonContent.html);

  return pdfBuffer;
}

export { invokeGeminiAi, generateInterviewReport, generateResumePdf };