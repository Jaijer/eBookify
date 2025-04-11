export default function Footer() {
    return (
      <footer className="mt-16 py-6 border-t border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-500">
              © 2025 eBookify. All rights reserved.
            </p>
          </div>
          
          <div className="flex space-x-6">
            <a href="#" className="text-sm text-gray-500 hover:text-[#6246ea]">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-[#6246ea]">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-[#6246ea]">
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    );
  } 