import React, { useState } from 'react';
import { ArrowLeft, History, Image as ImageIcon, X, CheckCircle2 } from 'lucide-react';

// Import local assets
import choir1 from '../assets/sing.jpg';
import choir2 from '../assets/choir.jpg';
import choir3 from '../assets/worship.jpg';
import choir4 from '../assets/preach.jpg';
import choir5 from '../assets/p.jpg';
import choir6 from '../assets/praise.jpg';
import choirHistory from '../assets/choir.jpg';

interface GlobalChoirProps {
  onBack: () => void;
}

const GlobalChoir: React.FC<GlobalChoirProps> = ({ onBack }) => {
  const [isAuditionModalOpen, setIsAuditionModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [auditionFile, setAuditionFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const galleryImages = [
    { id: 1, src: choir1, alt: 'Annual Conference 2025' },
    { id: 2, src: choir2, alt: 'Tuesday Worship' },
    { id: 3, src: choir3, alt: 'Rehearsal Sessions' },
    { id: 4, src: choir4, alt: 'Community Outreach' },
    { id: 5, src: choir5, alt: 'Youth Choir' },
    { id: 6, src: choir6, alt: '2025 Crossover night' },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'video/mp4', 'video/quicktime'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      setFileError('Only audio or video files are allowed (MP3, WAV, MP4).');
      setAuditionFile(null);
      return;
    }

    if (file.size > maxSize) {
      setFileError('File size must not exceed 10MB.');
      setAuditionFile(null);
      return;
    }

    setFileError(null);
    setAuditionFile(file);
  };

  const closeModal = () => {
    setIsAuditionModalOpen(false);
    setSubmitted(false);
    setAuditionFile(null);
    setFileError(null);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans animate-in fade-in duration-700">
      {/* Navigation */}
      <nav className="p-6 max-w-7xl mx-auto flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-brand-600 hover:text-black transition-colors font-bold uppercase tracking-widest text-xs"
        >
          <ArrowLeft size={16} />
          Back to Ministries
        </button>
      </nav>

      {/* Hero */}
      <header className="bg-[#0a0a0a] text-white py-24 px-6 border-b border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-brand-500 uppercase tracking-[0.4em] text-[10px] font-bold mb-4 block">
            Music Ministry
          </span>
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">
            The Global Choir
          </h1>
          <p className="text-xl text-gray-400 italic font-light">
            "Making a joyful noise unto the Lord across nations."
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-20">
        {/* History Section */}
        <section className="mb-32 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex items-center gap-3 mb-6 text-brand-600">
              <History size={28} />
              <h2 className="text-3xl font-serif font-bold text-black">Our Journey</h2>
            </div>
            <div className="space-y-6 text-lg text-gray-600 leading-relaxed font-light">
              <p>
                Founded in 1998, the Global Choir began as a small group of ten passionate vocalists.
                Over the decades, we have evolved into a world-class ensemble.
              </p>
              <p>
                Our mission is to bridge divides through harmony and worship,
                creating atmospheres where people encounter the Divine.
              </p>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute -inset-4 bg-brand-50 rounded-2xl -z-10 group-hover:bg-brand-100 transition-colors" />
            <div className="bg-gray-100 rounded-xl h-96 overflow-hidden shadow-2xl">
              <img
                src={choirHistory}
                alt="Vintage choir"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition duration-700"
              />
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section>
          <div className="flex items-center gap-3 mb-12">
            <ImageIcon size={28} className="text-brand-600" />
            <h2 className="text-3xl font-serif font-bold">Gallery & Moments</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryImages.map((image) => (
              <div key={image.id} className="group relative overflow-hidden rounded-sm shadow-lg aspect-4/3">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all flex items-end p-6">
                  <p className="text-white font-bold uppercase tracking-wider text-xs">
                    {image.alt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer CTA */}
      <footer className="bg-gray-50 py-20 text-center border-t border-gray-100">
        <h3 className="text-2xl font-serif font-bold mb-2">Interested in joining the harmony?</h3>
        <p className="text-gray-500 mb-8 font-light">We hold auditions quarterly for all vocal ranges.</p>
        <button
          onClick={() => setIsAuditionModalOpen(true)}
          className="px-12 py-4 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-brand-600 transition-all shadow-xl"
        >
          Audition Now
        </button>
      </footer>

      {/* Audition Modal */}
      {isAuditionModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={closeModal} />
          
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
            {!submitted ? (
              <div className="p-10">
                <div className="flex justify-between items-start mb-8 text-left">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-600">Expression of Interest</span>
                    <h3 className="text-3xl font-serif font-bold text-gray-900 mt-1">Choir Audition</h3>
                  </div>
                  <button onClick={closeModal} className="text-gray-400 hover:text-black transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!fileError) setSubmitted(true);
                  }}
                  className="space-y-5 text-left"
                >
                  <div className="grid grid-cols-1 gap-4">
                    <input required placeholder="Full Name" className="w-full bg-gray-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-brand-500 outline-none" />
                    <input required type="email" placeholder="Email Address" className="w-full bg-gray-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-brand-500 outline-none" />
                  </div>

                  <select required className="w-full bg-gray-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-brand-500 outline-none">
                    <option value="">Select Vocal Range</option>
                    <option>Soprano</option>
                    <option>Alto</option>
                    <option>Tenor</option>
                    <option>Bass</option>
                  </select>

                  <textarea rows={3} placeholder="Previous experience..." className="w-full bg-gray-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-brand-500 outline-none" />

                  {/* Enhanced File Upload UI */}
                  <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-4 transition-colors hover:border-brand-300">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                      Audition Audio/Video (Max 10MB)
                    </label>
                    <input
                      type="file"
                      accept="audio/*,video/*"
                      onChange={handleFileChange}
                      className="text-xs w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-600 hover:file:bg-brand-100 cursor-pointer"
                    />
                    {fileError && <p className="text-red-500 text-[10px] mt-2 font-bold uppercase tracking-tighter">{fileError}</p>}
                    {auditionFile && <p className="text-brand-600 text-[10px] mt-2 font-bold uppercase tracking-tighter">✓ {auditionFile.name}</p>}
                  </div>

                  <button type="submit" className="w-full bg-black text-white font-bold uppercase tracking-widest py-5 rounded-xl hover:bg-brand-600 transition-all shadow-lg">
                    Submit Application
                  </button>
                </form>
              </div>
            ) : (
              <div className="p-16 text-center animate-in zoom-in-95">
                <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-brand-600" />
                </div>
                <h3 className="text-2xl font-serif font-bold mb-2">Audition Received</h3>
                <p className="text-gray-500 mb-8 font-light">Your voice matters. We'll review your details and contact you about the next rehearsal.</p>
                <button onClick={closeModal} className="border border-gray-200 px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-gray-50 transition-all">
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalChoir;