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
      {/* Decorative Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      {/* Hero Section */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300"
        >
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>AI-Powered Resume Tailoring</span>
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-br from-white to-gray-500 bg-clip-text text-transparent"
        >
          Optimize for the Job.
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto"
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
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 flex flex-col gap-4 shadow-2xl">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              1. Upload Resume (PDF)
            </h2>
            
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 hover:border-white/20 hover:bg-white/5'
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
                <div className="flex items-center gap-3 text-blue-400" onClick={(e) => e.stopPropagation()}>
                  <FileText className="w-8 h-8" />
                  <span className="font-medium truncate max-w-[200px]">{resumeFile.name}</span>
                  <button onClick={clearFile} className="p-1 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <UploadCloud className="w-10 h-10 text-gray-500 mb-3" />
                  <p className="text-sm text-gray-400 text-center">
                    <span className="text-white font-medium">Click to upload</span> or drag and drop<br />
                    PDF files only.
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 flex flex-col gap-4 shadow-2xl">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-400" />
              2. Paste Job Description
            </h2>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              className="w-full h-48 bg-black/50 border border-white/10 rounded-xl p-4 text-sm text-gray-300 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none transition-all"
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
                className="h-full bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-2xl min-h-[500px]"
              >
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                  <Sparkles className="w-10 h-10 text-gray-600" />
                </div>
                <h3 className="text-xl font-medium text-gray-300 mb-2">Awaiting Analysis</h3>
                <p className="text-gray-500 text-sm max-w-[250px]">
                  Upload your resume and paste a job description to see how well you match.
                </p>
              </motion.div>
            ) : (
              <motion.div 
                key="results"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="h-full bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 flex flex-col gap-8 shadow-2xl overflow-hidden relative"
              >
                {/* Match Score */}
                <div className="flex flex-col items-center gap-4">
                  <CircularProgress score={results.matchScore} />
                  <div className="text-center">
                    <h3 className="text-lg font-semibold">ATS Compatibility Score</h3>
                    <p className="text-sm text-gray-400">Based on keyword matching and relevance.</p>
                  </div>
                </div>

                {/* Keywords Analysis */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4 flex flex-col gap-3">
                    <h4 className="text-sm font-semibold text-green-400 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" /> Matched
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {results.matchedKeywords.map((kw, i) => (
                        <span key={i} className="bg-green-500/20 text-green-300 text-xs px-2 py-1 rounded-md">
                          {kw}
                        </span>
                      ))}
                      {results.matchedKeywords.length === 0 && <span className="text-xs text-gray-500">None found</span>}
                    </div>
                  </div>
                  
                  <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 flex flex-col gap-3">
                    <h4 className="text-sm font-semibold text-red-400 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" /> Missing
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {results.missingKeywords.map((kw, i) => (
                        <span key={i} className="bg-red-500/20 text-red-300 text-xs px-2 py-1 rounded-md">
                          {kw}
                        </span>
                      ))}
                      {results.missingKeywords.length === 0 && <span className="text-xs text-gray-500">None found</span>}
                    </div>
                  </div>
                </div>

                {/* Actionable Feedback */}
                <div className="flex flex-col gap-3">
                  <h4 className="text-lg font-semibold border-b border-white/10 pb-2">Actionable Suggestions</h4>
                  <ul className="space-y-3">
                    {results.suggestions.map((suggestion, i) => (
                      <li key={i} className="flex gap-3 text-sm text-gray-300 bg-white/5 p-3 rounded-lg border border-white/5">
                        <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                        <span>{suggestion}</span>
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
