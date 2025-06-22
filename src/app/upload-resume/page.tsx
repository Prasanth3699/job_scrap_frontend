"use client";

import { useState, useEffect } from "react";
import { del, get, set } from "idb-keyval";
import { FileUpload } from "@/components/ui/file-upload";
import { useRouter, useSearchParams } from "next/navigation";
import { ShinyButton } from "@/components/magicui/shiny-button";

export default function UploadResumePage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadedAndSaved, setUploadedAndSaved] = useState(false);
  const [tempFile, setTempFile] = useState<File | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Load file from IndexedDB on component mount
  useEffect(() => {
    const loadFile = async () => {
      const storedFile = await get<File>("resume");
      if (storedFile) {
        setFile(storedFile);
        setUploadedAndSaved(true);
      }
    };
    loadFile();
  }, []);

  // Handle temporary file selection
  const handleFileSelection = (files: File[]) => {
    if (files.length > 0) {
      setTempFile(files[0]);
      setUploadedAndSaved(false);
    }
  };

  // Handle file saving
  const handleSaveFile = async (fileToSave: File) => {
    try {
      // Clear previous file and store new one
      await del("resume");
      await set("resume", fileToSave);
      setFile(fileToSave);
      setTempFile(null);
      setUploadedAndSaved(true);

      // Check if we came from the match page
      const jobIds = searchParams.get("jobs");
      if (jobIds) {
        // Redirect back to match page with job selection
        router.push(`/match?jobs=${jobIds}`);
      } else {
        // Default fallback
        router.push("/landing-page");
      }
    } catch (error) {
      console.error("Error saving file:", error);
    }
  };

  // Handle new upload after a file has been saved
  const handleNewUpload = () => {
    setTempFile(null);
    setUploadedAndSaved(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed border-neutral-800 rounded-lg bg-black p-4">
        {uploadedAndSaved && file ? (
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="bg-neutral-900 p-6 rounded-lg w-full">
              <h2 className="text-xl font-medium text-white mb-4">
                Uploaded Resume
              </h2>
              <div className="flex items-center justify-between bg-black p-4 rounded-md border border-neutral-800">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-neutral-800 rounded-md">
                    <svg
                      className="h-6 w-6 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-medium">{file.name}</p>
                    <p className="text-neutral-400 text-sm">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB • {file.type}
                    </p>
                  </div>
                </div>
                <ShinyButton
                  onClick={handleNewUpload}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-md transition-colors duration-200"
                >
                  Upload New
                </ShinyButton>
              </div>
            </div>
          </div>
        ) : (
          <FileUpload
            onChange={handleFileSelection}
            files={tempFile ? [tempFile] : []}
            className="bg-black"
            maxSizeMB={5}
            showSaveButton={tempFile !== null}
            onSave={handleSaveFile}
          />
        )}
      </div>
    </div>
  );
}
