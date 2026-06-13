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

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured.' },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
    You are an expert career coach and professional copywriter.
    I will provide a Job Description and a Resume. You need to write a highly tailored, compelling, and professional cover letter for the candidate applying to this job. 
    Highlight the specific overlaps between the candidate's experience and the job's requirements. Do not invent any experience that isn't on the resume.
    Keep it concise (3-4 paragraphs) and formatting as plain text (or very light markdown).
    
    Job Description:
    ${jobDescription}
    
    Resume:
    ${resumeText}
    `;

    const result = await model.generateContent(prompt);
    const coverLetter = result.response.text();

    return NextResponse.json({ coverLetter });
  } catch (error: any) {
    console.error('Error generating cover letter:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate cover letter.' },
      { status: 500 }
    );
  }
}
