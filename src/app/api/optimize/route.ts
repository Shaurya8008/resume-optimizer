import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
const PDFParser = require('pdf2json');

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const jobDescription = formData.get('jobDescription') as string;
    const resumeFile = formData.get('resume') as File | null;

    if (!jobDescription || !resumeFile) {
      return NextResponse.json(
        { error: 'Job description and resume file are required.' },
        { status: 400 }
      );
    }

    // Extract text from PDF using pdf2json
    const arrayBuffer = await resumeFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const resumeText = await new Promise<string>((resolve, reject) => {
      const pdfParser = new PDFParser(this, 1);
      pdfParser.on('pdfParser_dataError', (errData: any) => reject(errData.parserError));
      pdfParser.on('pdfParser_dataReady', () => {
        resolve(pdfParser.getRawTextContent());
      });
      pdfParser.parseBuffer(buffer);
    });

    if (!resumeText.trim()) {
      return NextResponse.json(
        { error: 'Could not extract text from the provided PDF.' },
        { status: 400 }
      );
    }

    // Initialize Gemini API
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured on the server.' },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
    You are an expert ATS (Applicant Tracking System) and Senior Technical Recruiter.
    I will provide a Job Description and a Resume. You need to analyze the resume against the job description and provide a JSON response with the following structure:
    {
      "matchScore": <number between 0 and 100>,
      "matchedKeywords": [<array of strings>],
      "missingKeywords": [<array of strings>],
      "suggestions": [<array of strings of actionable advice to improve the resume for this role>],
      "skillsAnalysis": [
        { "category": "Technical", "score": <number between 0 and 100 based on resume vs JD match> },
        { "category": "Leadership", "score": <number between 0 and 100> },
        { "category": "Communication", "score": <number between 0 and 100> },
        { "category": "Problem Solving", "score": <number between 0 and 100> },
        { "category": "Domain Expertise", "score": <number between 0 and 100> }
      ]
    }
    
    Ensure the output is ONLY valid JSON without any markdown formatting like \`\`\`json.
    
    Job Description:
    ${jobDescription}
    
    Resume:
    ${resumeText}
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Clean up response if it contains markdown code block formatting
    let cleanJson = responseText.trim();
    if (cleanJson.startsWith('\`\`\`json')) {
      cleanJson = cleanJson.slice(7, -3).trim();
    } else if (cleanJson.startsWith('\`\`\`')) {
      cleanJson = cleanJson.slice(3, -3).trim();
    }

    const analysis = JSON.parse(cleanJson);

    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error('Error optimizing resume:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to optimize resume. Please try again.' },
      { status: 500 }
    );
  }
}
