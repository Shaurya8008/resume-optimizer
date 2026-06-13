'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileText, CheckCircle, AlertCircle, Loader2, Sparkles, X } from 'lucide-react';
import CircularProgress from './CircularProgress';

export default function ResumeOptimizer() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<{
    matchScore: number;
    matchedKeywords: string[];
    missingKeywords: string[];
    suggestions: string[];
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        setResumeFile(file);
      } else {
        setError('Please upload a PDF file.');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf') {
        setResumeFile(file);
        setError(null);
      } else {
        setError('Please upload a PDF file.');
      }
    }
  };

  const clearFile = () => {
    setResumeFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleOptimize = async () => {
    if (!resumeFile) {
      setError('Please upload your resume.');
      return;
    }
    if (!jobDescription.trim()) {
      setError('Please paste the job description.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('resume', resumeFile);
    formData.append('jobDescription', jobDescription);

    try {
      const response = await fetch('/api/optimize', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze resume.');
      }

      const data = await response.json();
      setResults(data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12 md:py-20 flex flex-col gap-12 relative">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 -left-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-[128px] opacity-30 animate-blob" />
      <div className="absolute top-0 -right-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-[128px] opacity-30 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-40 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-screen filter blur-[128px] opacity-30 animate-blob animation-delay-4000" />

      {/* Hero Section */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 border border-white/20 text-sm text-gray-100 backdrop-blur-md"
        >
          <Sparkles className="w-4 h-4 text-purple-300" />
          <span className="font-medium">AI-Powered Resume Tailoring</span>
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-br from-white via-white to-gray-300 bg-clip-text text-transparent drop-shadow-sm"
        >
          Optimize for the Job.
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto font-medium"
        >
          Match your resume perfectly to the job description. Beat the ATS, highlight your strengths, and land more interviews.
        </motion.p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 relative z-10">
        {/* Input Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col gap-6"
        >
          <div className="bg-gray-950/60 border border-white/20 backdrop-blur-2xl rounded-2xl p-6 flex flex-col gap-4 shadow-2xl">
            <h2 className="text-xl font-bold flex items-center gap-2 text-white">
              <FileText className="w-6 h-6 text-blue-400" />
              1. Upload Resume (PDF)
            </h2>
            
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                isDragging ? 'border-blue-400 bg-blue-500/20' : 'border-white/30 hover:border-white/50 hover:bg-white/10'
              }`}
            >
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf"
                className="hidden" 
              />
              {resumeFile ? (
                <div className="flex items-center gap-3 text-blue-300" onClick={(e) => e.stopPropagation()}>
                  <FileText className="w-8 h-8" />
                  <span className="font-semibold truncate max-w-[200px] text-white">{resumeFile.name}</span>
                  <button onClick={clearFile} className="p-1 hover:bg-white/20 rounded-full transition-colors text-gray-300 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <>
                  <UploadCloud className="w-12 h-12 text-gray-300 mb-3" />
                  <p className="text-base text-gray-300 text-center font-medium">
                    <span className="text-white font-bold underline decoration-white/30 underline-offset-2">Click to upload</span> or drag and drop<br />
                    PDF files only.
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="bg-gray-950/60 border border-white/20 backdrop-blur-2xl rounded-2xl p-6 flex flex-col gap-4 shadow-2xl">
            <h2 className="text-xl font-bold flex items-center gap-2 text-white">
              <FileText className="w-6 h-6 text-purple-400" />
              2. Paste Job Description
            </h2>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              className="w-full h-48 bg-black/80 border border-white/20 rounded-xl p-4 text-base text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400/50 resize-none transition-all shadow-inner"
            />
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{error}</p>
            </motion.div>
          )}

          <button
            onClick={handleOptimize}
            disabled={isLoading || !resumeFile || !jobDescription}
            className="group relative w-full flex items-center justify-center gap-2 bg-white text-black font-semibold py-4 px-8 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-purple-200 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin relative z-10" />
            ) : (
              <Sparkles className="w-5 h-5 relative z-10" />
            )}
            <span className="relative z-10">{isLoading ? 'Analyzing...' : 'Optimize Resume'}</span>
          </button>
        </motion.div>

        {/* Results Section */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {!results ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full bg-gray-950/60 border border-white/20 backdrop-blur-2xl rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-2xl min-h-[500px]"
              >
                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-6 shadow-inner">
                  <Sparkles className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Awaiting Analysis</h3>
                <p className="text-gray-200 text-base max-w-[300px] leading-relaxed">
                  Upload your resume and paste a job description to see how well you match.
                </p>
              </motion.div>
            ) : (
              <motion.div 
                key="results"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="h-full bg-gray-950/60 border border-white/20 backdrop-blur-2xl rounded-2xl p-6 flex flex-col gap-8 shadow-2xl overflow-hidden relative"
              >
                {/* Match Score */}
                <div className="flex flex-col items-center gap-4">
                  <CircularProgress score={results.matchScore} />
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-white">ATS Compatibility Score</h3>
                    <p className="text-base text-gray-300 font-medium mt-1">Based on keyword matching and relevance.</p>
                  </div>
                </div>

                {/* Keywords Analysis */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-950/60 border border-green-500/40 rounded-xl p-5 flex flex-col gap-4 shadow-inner">
                    <h4 className="text-base font-bold text-green-300 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" /> Matched
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {results.matchedKeywords.map((kw, i) => (
                        <span key={i} className="bg-green-500/30 text-green-100 text-sm px-3 py-1.5 rounded-lg border border-green-500/30 font-medium shadow-sm">
                          {kw}
                        </span>
                      ))}
                      {results.matchedKeywords.length === 0 && <span className="text-sm text-green-200/50 italic">None found</span>}
                    </div>
                  </div>
                  
                  <div className="bg-red-950/60 border border-red-500/40 rounded-xl p-5 flex flex-col gap-4 shadow-inner">
                    <h4 className="text-base font-bold text-red-300 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" /> Missing
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {results.missingKeywords.map((kw, i) => (
                        <span key={i} className="bg-red-500/30 text-red-100 text-sm px-3 py-1.5 rounded-lg border border-red-500/30 font-medium shadow-sm">
                          {kw}
                        </span>
                      ))}
                      {results.missingKeywords.length === 0 && <span className="text-sm text-red-200/50 italic">None found</span>}
                    </div>
                  </div>
                </div>

                {/* Actionable Feedback */}
                <div className="flex flex-col gap-4">
                  <h4 className="text-xl font-bold text-white border-b border-white/20 pb-3">Actionable Suggestions</h4>
                  <ul className="space-y-4">
                    {results.suggestions.map((suggestion, i) => (
                      <li key={i} className="flex gap-4 text-base text-gray-100 bg-white/10 p-4 rounded-xl border border-white/10 shadow-sm">
                        <Sparkles className="w-5 h-5 text-purple-300 flex-shrink-0 mt-0.5" />
                        <span className="font-medium leading-relaxed">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
