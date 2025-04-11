import { ConversionProvider } from '@/contexts/ConversionContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import UploadField from '@/components/upload/UploadField';
import ConversionProgress from '@/components/conversion/ConversionProgress';
import ConversionResult from '@/components/conversion/ConversionResult';

export default function Home() {
  return (
    <ConversionProvider>
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-6xl mx-auto">
          <Header />
          
          <main className="flex-grow container mx-auto flex flex-col items-center justify-center">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                PDF File Converter
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Welcome to eBookify – your go-to platform for converting PDF files or pictures into
                e-book file formats. We designed eBookify for digital bookworms, making it easy for you
                to enjoy your content in its new e-book format.
              </p>
            </div>
            
            <UploadField />
            <ConversionProgress />
            <ConversionResult />
          </main>
          
          <Footer />
        </div>
      </div>
    </ConversionProvider>
  );
}