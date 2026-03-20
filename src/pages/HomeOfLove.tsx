import React, { useState } from 'react';
import { 
  ArrowLeft, Heart, History,  Camera, Calendar, Users, Sparkles, Utensils, MapPin, X 
} from 'lucide-react';

const pastEvents = [
  {
    id: 1,
    title: 'Christmas Food Drive',
    description: 'Distributed food packages to 500+ families in need during the holiday season.',
    imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800',
    date: 'Dec 24, 2023',
    location: 'Downtown Center',
    attendees: 150,
    category: 'Feeding',
  },
  {
    id: 2,
    title: 'Medical Outreach',
    description: 'Free medical checkups and medications for underserved communities.',
    imageUrl: 'https://images.unsplash.com/photo-1516549655669-df565bc5d5ab?auto=format&fit=crop&w=800',
    date: 'Nov 15, 2023',
    location: 'Urban Health Clinic',
    attendees: 300,
    category: 'Medical',
  },
  {
    id: 3,
    title: 'Back to School',
    description: 'Provided school supplies and uniforms for 200 children from low-income families.',
    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800',
    date: 'Aug 28, 2023',
    location: 'City Public School',
    attendees: 200,
    category: 'Education',
  }
];

const stats = [
  { label: 'Families Helped', value: '2,200', icon: <Users size={15} /> },
  { label: 'Meals Served', value: '10,000', icon: <Utensils size={15} /> },
  { label: 'Events Hosted', value: '10+', icon: <Sparkles size={15} /> },
];

interface HomeOfLoveProps {
  onBack: () => void;
}

const HomeOfLove: React.FC<HomeOfLoveProps> = ({ onBack }) => {
  const [selectedEvent, setSelectedEvent] = useState<(typeof pastEvents)[0] | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900 font-sans">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 p-4">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-fuchsia-600 hover:text-fuchsia-700 transition-colors font-semibold text-sm uppercase tracking-wider"
          >
            <ArrowLeft size={18} />
            Back to Ministries
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative h-[60vh] flex items-center justify-center text-white overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=1600" 
          className="absolute inset-0 w-full h-full object-cover"
          alt="Community outreach"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
        
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-fuchsia-700 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
            <Heart size={14} fill="currentColor" /> Global Flame Ministry
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-4">Home of Love</h1>
          <p className="text-lg md:text-xl text-gray-200 font-light italic">
            "Extending God's love through compassionate service and restoring hope."
          </p>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="max-w-5xl mx-auto -mt-12 relative z-20 px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-xl flex items-center gap-4 border border-gray-100">
              <div className="p-3 bg-rose-50 text-fuchsia-600 rounded-xl">{stat.icon}</div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-20">
        
        {/* History & Mission */}
        <section className="mb-32 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-fuchsia-600">
              <History size={24} />
              <h2 className="text-3xl font-serif font-bold text-slate-900">Founded in 2005</h2>
            </div>
            <p className="text-lg text-gray-600 leading-relaxed">
              What began as a small food pantry has grown into a comprehensive community outreach ministry. 
              Home of Love was birthed by a group of church members who saw a growing need for practical 
              assistance in our city.
            </p>
            <div className="p-6 bg-white rounded-xl border-l-4 border-fuchsia-600 shadow-sm">
              <p className="italic text-gray-700">
                "We don't just give handouts—we provide tools and support for long-term transformation."
              </p>
            </div>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-2xl h-100">
            <img 
              src="https://images.unsplash.com/photo-1576765974257-b414b9ea0051?auto=format&fit=crop&w=800" 
              className="w-full h-full object-cover"
              alt="History"
            />
          </div>
        </section>

        {/* Past Events Gallery */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-10">
            <Camera className="text-fuchsia-600" size={28} />
            <h2 className="text-3xl font-serif font-bold">Past Events & Impact</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {pastEvents.map((event) => (
              <div 
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer border border-gray-100"
              >
                <div className="relative h-48 overflow-hidden">
                  <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <span className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-fuchsia-600">
                    {event.category}
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">
                    <Calendar size={14} /> {event.date}
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-fuchsia-600 transition-colors">{event.title}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Modern Dialog (Modal) */}
      {selectedEvent && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="relative h-64">
              <img src={selectedEvent.imageUrl} className="w-full h-full object-cover" alt={selectedEvent.title} />
              <button 
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-rose-100 text-fuchsia-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                  {selectedEvent.category}
                </span>
                <span className="text-gray-400 text-sm">{selectedEvent.date}</span>
              </div>
              <h2 className="text-3xl font-serif font-bold mb-4">{selectedEvent.title}</h2>
              <p className="text-gray-600 leading-relaxed mb-6">{selectedEvent.description}</p>
              
              <div className="grid grid-cols-2 gap-4 border-t pt-6">
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <MapPin size={18} className="text-fuchsia-600" />
                  {selectedEvent.location}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <Users size={18} className="text-fuchsia-600" />
                  {selectedEvent.attendees} Participants
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Final CTA */}
      <footer className="bg-slate-900 text-white py-20 px-6 text-center">
        <h2 className="text-4xl font-serif font-bold mb-4">Join Us in Making a Difference</h2>
        <p className="text-gray-400 max-w-2xl mx-auto mb-10">
          Whether you can volunteer once a week or support through donations, every contribution matters.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white px-10 py-4 rounded-full font-bold transition-all shadow-lg shadow-rose-600/20">
            Volunteer Now
          </button>
          <button className="border border-white/20 hover:bg-white/10 text-white px-10 py-4 rounded-full font-bold transition-all">
            Donate Supplies
          </button>
        </div>
      </footer>
    </div>
  );
};

export default HomeOfLove;