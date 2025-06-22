// src/components/resume/PDFViewer.tsx
"use client";

import React, { useState, useEffect } from "react";

interface PDFViewerProps {
  file: File;
}

const SimplePDFViewer: React.FC<PDFViewerProps> = ({ file }) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setError("No file provided");
      setIsLoading(false);
      return;
    }

    try {
      // Validate file type
      if (file.type !== "application/pdf") {
        setError("Invalid file type. Please upload a PDF.");
        setIsLoading(false);
        return;
      }

      // Create a URL for the PDF file
      const url = URL.createObjectURL(file);
      setPdfUrl(url);
      setIsLoading(false);

      // Clean up the URL when component unmounts
      return () => {
        URL.revokeObjectURL(url);
      };
    } catch (err) {
      setError(
        `Error processing PDF file: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
      setIsLoading(false);
    }
  }, [file]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-neutral-900 rounded-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-neutral-900 rounded-lg text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <iframe
        src={pdfUrl || ""}
        width="100%"
        height="100%"
        className="border-none rounded-lg"
        title="PDF Viewer"
      >
        <p>
          Your browser does not support PDF viewing.
          <a href={pdfUrl || "#"} download>
            Download the PDF
          </a>{" "}
          instead.
        </p>
      </iframe>
    </div>
  );
};

export default SimplePDFViewer;
