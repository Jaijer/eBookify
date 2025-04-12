// src/components/upload/UploadField.jsx
"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import MageCharacter from "../animations/MageCharacter";
import { useTheme } from "@/contexts/ThemeContext";
import { useConversion } from "@/contexts/ConversionContext";

export default function UploadField({ loaderFinished = true }) {
  const { handleFileUpload, file, status } = useConversion();
  const { darkMode } = useTheme();
  const [fileError, setFileError] = useState(null);

  const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      setFileError(null);
      
      // Handle rejected files (too large, wrong type, etc.)
      if (rejectedFiles && rejectedFiles.length > 0) {
        const rejected = rejectedFiles[0];
        if (rejected.file.size > MAX_FILE_SIZE) {
          setFileError(`File is too large. Maximum size is 4MB.`);
        } else {
          setFileError(`Invalid file type. Please upload a PDF or image file.`);
        }
        return;
      }
      
      // Handle accepted files
      if (acceptedFiles && acceptedFiles.length > 0) {
        const selectedFile = acceptedFiles[0];
        
        // Double-check file size (even though Dropzone should handle this)
        if (selectedFile.size > MAX_FILE_SIZE) {
          setFileError(`File is too large. Maximum size is 4MB.`);
          return;
        }
        
        // All good, proceed with upload
        handleFileUpload(selectedFile);
      }
    },
    [handleFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/tiff": [".tiff", ".tif"],
      "image/bmp": [".bmp"],
      "image/webp": [".webp"],
    },
    maxSize: MAX_FILE_SIZE, // 4MB
    disabled: status !== "idle",
  });

  const isEmpty = !file || status === "idle";

  // Animation variants for the wizard - will only start after loader finishes
  const wizardAnimationVariants = {
    hidden: { opacity: 0, y: 200 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3, // Small delay after the loader finishes
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {isEmpty && (
        <motion.div
          initial="hidden"
          animate={loaderFinished ? "visible" : "hidden"}
          variants={wizardAnimationVariants}
          className="flex justify-center"
          style={{ position: "relative", zIndex: 0 }}
        >
          <MageCharacter />
        </motion.div>
      )}

      {isEmpty && (
        <div className="space-y-4">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-15 text-center cursor-pointer ${
              isDragActive
                ? "border-[#6246ea] bg-purple-50"
                : darkMode
                ? "border-gray-700 hover:border-[#757575]"
                : "border-gray-300 hover:border-[#6246ea]"
            } ${
              darkMode ? "bg-[#1E2939]" : "bg-[#F3F4F6]"
            } transition-all duration-300`}
            style={{ position: "relative", zIndex: 1, padding: "3rem 1.5rem" }}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center space-y-4 z-10">
              <div
                className={`p-4 rounded-full transition-all duration-300 ${
                  isDragActive
                    ? "bg-purple-100"
                    : darkMode
                    ? "bg-gray-800"
                    : "bg-gray-100"
                }`}
              >
                <svg
                  className={`w-12 h-12 transition-all duration-300 ${
                    isDragActive
                      ? "text-[#634EFF]"
                      : darkMode
                      ? "text-gray-400"
                      : "text-[#634EFF]"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  ></path>
                </svg>
              </div>
              <div>
                {isDragActive ? (
                  <p className="text-xl font-medium text-[#634EFF] transition-all duration-300">
                    Drop your files here
                  </p>
                ) : (
                  <>
                    <p
                      className={`text-3xl font-medium transition-all duration-300 ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Drag & drop your files here
                    </p>
                    <p
                      className={`mt-2 text-2xl transition-all duration-300 ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      or click to browse files
                    </p>
                  </>
                )}
              </div>
              <p
                className={`text-xs transition-all duration-300 ${
                  darkMode ? "text-gray-500" : "text-gray-400"
                } mt-4`}
              >
                Supports PDF and image files (JPG, PNG, TIFF, BMP, WEBP) up to
                4MB
              </p>
            </div>
          </div>
          
          {fileError && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm">{fileError}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}