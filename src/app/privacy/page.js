"use client";
import { useTheme } from "@/contexts/ThemeContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function PrivacyPolicy() {
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
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
          
          <div className={`space-y-6 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
            <section>
              <h2 className="text-xl font-semibold mb-3">Introduction</h2>
              <p>
                Welcome to eBookify. We are a team of four Saudi students (Ali Al Sules, Nezar Al-Tarouti, Hussain Al-Aujyan, and Murtadha Al-Abbas) who call ourselves "The Crew". 
                This Privacy Policy explains how we handle your data when you use our service.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
              <p>
                eBookify collects only the information necessary to provide our services:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Content you upload for conversion (PDF files and images up to 4MB)</li>
                <li>Basic browser information to optimize our service</li>
                <li>Information collected automatically through cookies for session management</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
              <p>
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Provide the document conversion service</li>
                <li>Process and complete file conversions</li>
                <li>Improve the functionality and performance of our service</li>
                <li>Respond to your comments and questions</li>
                <li>Monitor usage patterns to enhance user experience</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">3. File Storage and Security</h2>
              <p>
                Files you upload for conversion are temporarily stored on our servers only for the purpose of conversion. These files are automatically deleted after the conversion process is complete or after a maximum period of 1 hour. We implement appropriate security measures to protect your information.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">4. Sharing of Information</h2>
              <p>
                As a student hackathon project, eBookify does not sell, trade, or otherwise transfer your personally identifiable information to third parties. Your data remains confidential and is only used to provide the conversion service.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">5. Cookies</h2>
              <p>
                We use minimal cookies that are strictly necessary for the functioning of our website. These help us provide a better service by enabling basic functions like page navigation and access to secure areas of the website.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">6. Third-Party Services</h2>
              <p>
                Our service may contain links to third-party websites or services that are not owned or controlled by eBookify. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">7. Children's Privacy</h2>
              <p>
                Our services are not intended for use by children under the age of 13. We do not knowingly collect personally identifiable information from children under 13.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">8. Hackathon Project Status</h2>
              <p>
                eBookify was created for a hackathon event and is currently in a demonstration phase. As such, this privacy policy and our data handling practices may evolve as the project develops beyond the hackathon.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">9. Your Rights</h2>
              <p>
                You have rights regarding your personal information:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>The right to access information we hold about you</li>
                <li>The right to request deletion of your uploaded files</li>
                <li>The right to object to processing of your information</li>
              </ul>
              <p className="mt-2">
                Since we maintain minimal data and automatically delete files shortly after conversion, most of these rights are automatically honored through our design.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">10. Contact Us</h2>
              <p>
                If you have any questions about our Privacy Policy, please <a href="/contact" className="text-[#6246ea] hover:underline">contact us</a>.
              </p>
            </section>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}