import React, { useState } from 'react';
import { ShoppingCart, BookOpen, Star, ArrowRight } from 'lucide-react';

// --- Types ---
interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  rating: number;
  description: string;
  imageUrl: string;
  category: string;
}

const BOOKS_DATA: Book[] = [
  {
    id: 1,
    title: "The Midnight Library",
    author: "Matt Haig",
    price: 18.99,
    rating: 4.5,
    category: "Fiction",
    description: "Between life and death there is a library, and within that library, the shelves go on forever.",
    imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: 2,
    title: "Atomic Habits",
    author: "James Clear",
    price: 21.00,
    rating: 5.0,
    category: "Self-Help",
    description: "An easy and proven way to build good habits and break bad ones.",
    imageUrl: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: 3,
    title: "Project Hail Mary",
    author: "Andy Weir",
    price: 24.50,
    rating: 4.8,
    category: "Sci-Fi",
    description: "Ryland Grace is the sole survivor on a desperate, last-chance mission to save humanity.",
    imageUrl: "https://images.unsplash.com/photo-1614544048536-0d28caf77f41?auto=format&fit=crop&q=80&w=400"
  }
];

const BookCard: React.FC<{ book: Book; onOrder: (title: string) => void }> = ({ book, onOrder }) => {
  return (
    <div className="group bg-white rounded-3xl shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-slate-100 overflow-hidden flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden">
        <img 
          src={book.imageUrl} 
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
           <button 
            onClick={() => onOrder(book.title)}
            className="w-full bg-white text-black py-3 rounded-xl font-bold flex items-center justify-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500"
          >
            Quick Add <ShoppingCart size={18} />
          </button>
        </div>
        <div className="absolute top-4 left-4">
          <span className="bg-fuchsia-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
            {book.category}
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-black text-lg text-slate-900 leading-tight">
            {book.title}
          </h3>
        </div>
        
        <p className="text-xs text-slate-400 mb-4 font-bold uppercase tracking-tight">By {book.author}</p>
        
        <div className="flex items-center gap-1 mb-4">
           {[...Array(5)].map((_, i) => (
             <Star key={i} size={12} fill={i < Math.floor(book.rating) ? "#f59e0b" : "none"} className={i < Math.floor(book.rating) ? "text-amber-500" : "text-slate-200"} />
           ))}
           <span className="text-[10px] font-bold ml-1 text-slate-400">({book.rating})</span>
        </div>

        <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
          <span className="text-2xl font-black text-slate-900">${book.price.toFixed(2)}</span>
          <div className="text-fuchsia-600 group-hover:translate-x-2 transition-transform">
            <ArrowRight size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

const Bookstore: React.FC = () => {
  const [cartCount, setCartCount] = useState(0);

  const handleOrder = (_title: string) => {
    setCartCount(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-white font-sans pt-32 pb-20">
      {/* Unique Page Header */}
      <div className="max-w-7xl mx-auto px-6 mb-16 text-center lg:text-left">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full mb-6">
            <BookOpen size={12} className="text-fuchsia-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Resource Center</span>
        </div>
        <h1 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter mb-6">
          The <span className="text-fuchsia-600">Page</span>Turner
        </h1>
        <p className="text-slate-500 max-w-2xl text-lg font-medium leading-relaxed">
          Deepen your faith and expand your knowledge with our curated collection of spiritual literature and ministry resources.
        </p>
      </div>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {BOOKS_DATA.map(book => (
            <BookCard key={book.id} book={book} onOrder={handleOrder} />
          ))}
        </div>
      </main>

      {/* Unique Floating Cart Button */}
      <div className="fixed bottom-10 right-10 z-[60]">
        <button className="relative p-6 bg-slate-900 text-white rounded-full shadow-2xl hover:bg-fuchsia-600 hover:scale-110 transition-all duration-300 group">
          <ShoppingCart size={28} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-fuchsia-500 text-white text-[10px] font-black h-7 w-7 flex items-center justify-center rounded-full border-4 border-white animate-bounce">
              {cartCount}
            </span>
          )}
          {/* Tooltip */}
          <span className="absolute right-20 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            View Cart
          </span>
        </button>
      </div>
    </div>
  );
};

export default Bookstore;