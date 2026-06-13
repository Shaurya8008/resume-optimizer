# Resume Optimizer

Resume Optimizer is a state-of-the-art web application designed to help job seekers tailor their resumes to perfectly match any job description. By leveraging the power of Google's Gemini AI, this application provides an intelligent, ATS-like analysis of your resume and gives you actionable feedback on how to improve your chances of landing an interview.

## 🌟 Features

- **AI-Powered Analysis**: Uses Gemini to analyze your resume against the job description.
- **ATS Compatibility Score**: Get a direct score of how well your resume matches the job requirements.
- **Keyword Extraction**: Easily see what keywords you successfully hit and which critical keywords you are missing.
- **Actionable Suggestions**: Receive specific, tailored advice on what to change or add to your resume.
- **PDF Upload**: Upload your resume directly as a PDF (parsing happens server-side).
- **Stunning UI**: A sleek, dark-mode, glassmorphic interface built with Next.js, Tailwind CSS, and Framer Motion.

## 🛠️ Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **AI Integration**: `@google/generative-ai` SDK (Gemini 2.5 Flash)
- **PDF Parsing**: `pdf2json`
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites

Make sure you have Node.js and npm installed on your machine. You will also need a Google Gemini API key.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Shaurya8008/resume-optimizer.git
   cd resume-optimizer
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` file in the root of your project and add your Gemini API Key:
   ```env
   GEMINI_API_KEY="your_api_key_here"
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```

5. **Open the Application:**
   Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 💡 Usage

1. Click the upload area to select your Resume PDF (or drag and drop).
2. Paste the text of the Job Description you want to apply for into the text box.
3. Click the **"Optimize Resume"** button.
4. Wait a few seconds for the AI to process, and read through your personalized match score, keyword analysis, and suggestions!

## 📜 License

This project is open-source and available under the MIT License.
