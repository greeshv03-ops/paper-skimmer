"use client";

import { useState } from "react";

type AnalysisResult = {
  summary: string[];
  methods: string;
  equations: string[];
};

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Something went wrong");
      }

      setResult(json.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8 text-gray-900">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header Section */}
        <header className="text-center">
          <h1 className="text-4xl font-bold mb-2">Research Paper Skimmer</h1>
          <p className="text-gray-600">Upload a PDF to get a 3-bullet summary, methods, and key equations.</p>
        </header>

        {/* Upload Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center space-y-4">
          <input 
            type="file" 
            accept="application/pdf" 
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
          <button 
            onClick={handleUpload}
            disabled={!file || isLoading}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? "Analyzing Document..." : "Skim Paper"}
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
            <strong>Error: </strong> {error}
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
            
            <section>
              <h2 className="text-xl font-bold text-blue-900 mb-3 border-b pb-2">3-Point Summary</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                {result.summary.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-900 mb-3 border-b pb-2">Methods & Datasets</h2>
              <p className="text-gray-700 leading-relaxed">{result.methods}</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-900 mb-3 border-b pb-2">Key Equations & Metrics</h2>
              {result.equations.length > 0 ? (
                <ul className="list-disc pl-5 space-y-2 text-gray-700 font-mono text-sm bg-gray-50 p-4 rounded-md">
                  {result.equations.map((eq, idx) => (
                    <li key={idx}>{eq}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No key equations found.</p>
              )}
            </section>
            
          </div>
        )}
      </div>
    </main>
  );
}