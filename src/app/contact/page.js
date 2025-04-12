"use client";
import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";

export default function Contact() {
  const { darkMode } = useTheme();
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    error: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!formState.name || !formState.email || !formState.message) {
      setFormStatus({
        submitted: false,
        error: "Please fill out all required fields."
      });
      return;
    }
    
    // Simulate form submission
    setFormStatus({
      submitted: true,
      error: null
    });
    
    // Reset form after submission
    setFormState({
      name: "",
      email: "",
      subject: "",
      message: ""
    });
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-[#121212] text-[#f0f0f0]" : "bg-white text-gray-900"
      }`}
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Header />

        <main className="py-8">
          <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              <h2 className="text-xl font-semibold mb-4">Get In Touch</h2>
              <p className="mb-6">
                Have questions about eBookify? We'd love to hear from you! Our team (The Crew) is eager to receive your feedback and improve our service.
              </p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">Team Members</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <svg className="w-5 h-5 mr-2 text-[#6246ea]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                      Ali Al Sules
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 mr-2 text-[#6246ea]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                      Nezar Al-Tarouti
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 mr-2 text-[#6246ea]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                      Hussain Al-Aujyan
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 mr-2 text-[#6246ea]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                      Murtadha Al-Abbas
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium mb-1">Email</h3>
                  <p className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-[#6246ea]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    contact@ebookify-hackathon.sa
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-1">Location</h3>
                  <p className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-[#6246ea]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    Riyadh, Saudi Arabia
                  </p>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="font-medium mb-2">Hackathon Project</h3>
                <p className="mb-2">
                  eBookify was developed as part of the 2025 Saudi Innovation Hackathon, where our team (The Crew) worked to create a solution that makes reading more accessible.
                </p>
                <p>
                  We're proud of what we've built and are excited to continue developing this project beyond the hackathon.
                </p>
              </div>
            </div>
            
            {/* Contact Form */}
            <div>
              {formStatus.submitted ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`rounded-lg p-6 ${
                    darkMode ? 'bg-[#222] border border-[#333]' : 'bg-gray-50 border border-gray-100'
                  }`}
                >
                  <div className="text-center">
                    <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
                      <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                    <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                      Thank you for reaching out to us. Our team will get back to you as soon as possible.
                    </p>
                    <button
                      onClick={() => setFormStatus({ submitted: false, error: null })}
                      className="mt-4 bg-[#6246ea] hover:bg-[#5438d0] text-white font-medium py-2 px-4 rounded transition-colors duration-300"
                    >
                      Send Another Message
                    </button>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {formStatus.error && (
                    <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded">
                      {formStatus.error}
                    </div>
                  )}
                  
                  <div>
                    <label className={`block mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        darkMode 
                          ? "bg-[#333] border-[#444] text-white" 
                          : "bg-white border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-[#6246ea]`}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className={`block mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formState.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        darkMode 
                          ? "bg-[#333] border-[#444] text-white" 
                          : "bg-white border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-[#6246ea]`}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className={`block mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formState.subject}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        darkMode 
                          ? "bg-[#333] border-[#444] text-white" 
                          : "bg-white border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-[#6246ea]`}
                    />
                  </div>
                  
                  <div>
                    <label className={`block mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={formState.message}
                      onChange={handleChange}
                      rows="5"
                      className={`w-full px-4 py-2 rounded-lg border ${
                        darkMode 
                          ? "bg-[#333] border-[#444] text-white" 
                          : "bg-white border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-[#6246ea]`}
                      required
                    ></textarea>
                  </div>
                  
                  <div>
                    <button
                      type="submit"
                      className="w-full bg-[#6246ea] hover:bg-[#5438d0] text-white font-medium py-3 px-4 rounded-lg transition-colors duration-300"
                    >
                      Send Message
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}