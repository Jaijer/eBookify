"use client";
import { useTheme } from "@/contexts/ThemeContext";
import { ConversionProvider } from "@/contexts/ConversionContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import UploadField from "@/components/upload/UploadField";
import ConversionProgress from "@/components/conversion/ConversionProgress";
import ConversionResult from "@/components/conversion/ConversionResult";
import EntranceLines from "@/components/animations/EntranceLines";
import PageLoader from "@/components/animations/PageLoader";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const { darkMode } = useTheme();
  const [showContent, setShowContent] = useState(false);
  const [loaderFinished, setLoaderFinished] = useState(false);

  // This effect handles the animation sequence
  useEffect(() => {
    // Step 1: Page Loader (handled internally in the PageLoader component)
    const loaderTimer = setTimeout(() => {
      setLoaderFinished(true); // Signal that loader is finished

      // Step 2: After loader finishes, show content with a slight delay
      const contentTimer = setTimeout(() => {
        setShowContent(true);
      }, 300);

      return () => clearTimeout(contentTimer);
    }, 2000); // Should be slightly longer than the PageLoader's internal timing

    return () => clearTimeout(loaderTimer);
  }, []);

  return (
    <ConversionProvider>
      <div
        className={`min-h-screen transition-colors duration-300 ${
          darkMode ? "bg-[#121212] text-[#f0f0f0]" : "bg-white text-gray-900"
        }`}
      >
        {/* Page loader - Passes the setLoaderFinished callback */}
        <PageLoader onFinish={() => setLoaderFinished(true)} />

        {/* Entrance lines component */}
        <EntranceLines />

        <div
          className={`max-w-6xl mx-auto px-4 py-8 transition-opacity duration-500 ${
            showContent ? "opacity-100" : "opacity-0"
          }`}
        >
          <Header />

          <main className="flex-grow flex flex-col items-center justify-center py-12">
            <div className="text-center mb-12">
              <h2 className="text-6xl font-bold mb-4">eBookify</h2>
              <p
                className={`text-xl max-w-2xl mx-auto leading-relaxed ${
                  darkMode ? "text-[#aaa]" : "text-gray-600"
                }`}
              >
                Welcome to eBookify, your solution for converting PDF files into
                reader-friendly text formats. Generate optimized books for e-readers.
              </p>
              <img
                src="/witch-hat.png"
                alt="The witch's hat"
                className="
                  hidden md:block
                  mx-auto
                  mt-0
                  w-14
                  -translate-x-[83.5px]
                  -translate-y-[167px]
                "
              />

            </div>

            <div className="w-full">
              <UploadField loaderFinished={loaderFinished} />
              <ConversionProgress />
              <ConversionResult />
            </div>

            <div
              className={`mt-16 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              <div
                className={`text-center p-6 rounded-lg transition-all duration-300 ${
                  darkMode
                    ? "bg-[#1a1f2c] border border-[#2d3748] shadow-lg shadow-[#0f131a]"
                    : "shadow-md"
                }`}
              >
                <div className="mb-4 text-blue-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Simple Upload</h3>
                <p>
                  Drag and drop your PDF files or browse to select them. We
                  support a variety of formats including images and PDFs up to 4MB.
                </p>
              </div>

              <div
                className={`text-center p-6 rounded-lg transition-all duration-300 ${
                  darkMode
                    ? "bg-[#1a1f2c] border border-[#2d3748] shadow-lg shadow-[#0f131a]"
                    : "shadow-md"
                }`}
              >
                <div className="mb-4 text-green-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Secure Conversion
                </h3>
                <p>
                  Your files are processed securely and deleted after
                  conversion. We prioritize your privacy and data security.
                </p>
              </div>

              <div
                className={`text-center p-6 rounded-lg transition-all duration-300 ${
                  darkMode
                    ? "bg-[#1a1f2c] border border-[#2d3748] shadow-lg shadow-[#0f131a]"
                    : "shadow-md"
                }`}
              >
                <div className="mb-4 text-purple-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Instant Download</h3>
                <p>
                  Download your converted text files immediately after
                  processing. No registration required for basic conversions.
                </p>
              </div>
            </div>
          </main>

          <Footer />
        </div>
      </div>
    </ConversionProvider>
  );
}