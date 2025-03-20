"use client";

import React, { useState, useEffect } from "react";
import mammoth from "mammoth";

const DocxViewer = ({ file }: { file: File }) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e: ProgressEvent<FileReader>) => {
      try {
        // Convert the DOCX to HTML
        const arrayBuffer = e.target?.result;
        if (!arrayBuffer || typeof arrayBuffer === "string") {
          throw new Error("Failed to read file");
        }
        const result = await mammoth.convertToHtml({ arrayBuffer });
        setContent(result.value);
        setLoading(false);
      } catch (err) {
        console.error("Error converting DOCX:", err);
        setError("Failed to convert DOCX file");
        setLoading(false);
      }
    };
    reader.onerror = () => {
      setError("Error reading DOCX file");
      setLoading(false);
    };
    reader.readAsArrayBuffer(file);
  }, [file]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full bg-neutral-900 rounded-lg p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4" />
        <p className="text-neutral-400">Loading document...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full bg-neutral-900 rounded-lg p-6">
        <svg
          className="h-12 w-12 text-red-500 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          ></path>
        </svg>
        <p className="text-white font-medium mb-2">Error Loading Document</p>
        <p className="text-neutral-400 text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-auto bg-neutral-800 rounded-lg p-4">
        <div
          className="docx-content bg-white text-black p-8 rounded-lg shadow-lg"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
};

export default DocxViewer;
