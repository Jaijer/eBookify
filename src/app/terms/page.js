"use client";
import { useTheme } from "@/contexts/ThemeContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function TermsOfService() {
  const { darkMode } = useTheme();

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-[#121212] text-[#f0f0f0]" : "bg-white text-gray-900"
      }`}
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Header />

        <main className="py-8">
          <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
          
          <div className={`space-y-6 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
              <p>
                Welcome to eBookify, a hackathon project created by four Saudi students who call themselves "The Crew". By using our website and services, you agree to comply with and be bound by the following terms and conditions. Please review them carefully before using our services.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">2. Use License</h2>
              <p>
                eBookify grants you a personal, non-exclusive, non-transferable license to use our conversion tools for your personal or non-commercial use. You may not:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose</li>
                <li>Attempt to decompile or reverse engineer any software</li>
                <li>Remove any copyright or other proprietary notations</li>
                <li>Transfer the materials to another person</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">3. Hackathon Project</h2>
              <p>
                eBookify was created as part of a hackathon by Ali Al Sules, Nezar Al-Tarouti, Hussain Al-Aujyan, and Murtadha Al-Abbas. This service is provided as a demonstration of our technical capabilities and as a solution to make document reading more accessible.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">4. Content Limitations</h2>
              <p>
                Our service is currently limited to converting files up to 4MB in size. This is designed to ensure optimal performance during this demonstration phase. We may adjust these limitations in the future.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">5. Privacy</h2>
              <p>
                Your use of eBookify is also governed by our Privacy Policy, which can be found <a href="/privacy" className="text-[#6246ea] hover:underline">here</a>.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">6. User Content</h2>
              <p>
                When you upload content to eBookify for conversion, you retain ownership of your content. However, you grant eBookify a limited license to use your content for the purpose of providing our services.
              </p>
              <p className="mt-2">
                You are solely responsible for the content you upload, and you affirm that you have all necessary rights to that content.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">7. Disclaimer</h2>
              <p>
                eBookify services are provided "as is". We make no warranties, expressed or implied, and hereby disclaim all warranties including, without limitation, implied warranties of merchantability, fitness for a particular purpose, or non-infringement.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">8. Limitations</h2>
              <p>
                eBookify shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages that result from the use of, or the inability to use, our services.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">9. Service Changes</h2>
              <p>
                As a hackathon project, eBookify is in a demonstration phase and may undergo significant changes or be discontinued after the event. We reserve the right to modify or discontinue our services at any time without notice.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">10. Governing Law</h2>
              <p>
                These terms shall be governed by and construed in accordance with the laws of Saudi Arabia, without regard to its conflict of law provisions.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">11. Contact</h2>
              <p>
                If you have any questions about our Terms of Service, please contact us via our <a href="/contact" className="text-[#6246ea] hover:underline">contact page</a>.
              </p>
            </section>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}