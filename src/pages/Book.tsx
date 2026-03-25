import React, { useState } from 'react';
import { ShoppingCart, BookOpen, Star } from 'lucide-react';

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

// --- Mock Data ---
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

// --- Sub-Component: Book Card ---
const BookCard: React.FC<{ book: Book; onOrder: (title: string) => void }> = ({ book, onOrder }) => {
  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col">
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-200">
        <img 
          src={book.imageUrl} 
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 backdrop-blur px-2 py-1 rounded-md text-xs font-bold text-gray-700 uppercase tracking-wider shadow-sm">
            {book.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
            {book.title}
          </h3>
          <div className="flex items-center text-yellow-500">
            <Star size={14} fill="currentColor" />
            <span className="text-xs font-bold ml-1 text-gray-600">{book.rating}</span>
          </div>
        </div>
        
        <p className="text-sm text-gray-500 mb-3 font-medium">by {book.author}</p>
        
        <p className="text-gray-600 text-sm line-clamp-2 mb-4 italic flex-grow">
          "{book.description}"
        </p>

        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
          <span className="text-xl font-black text-gray-900">${book.price.toFixed(2)}</span>
          <button 
            onClick={() => onOrder(book.title)}
            className="flex items-center gap-2 bg-gray-900 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-all active:scale-95"
          >
            <ShoppingCart size={18} />
            <span>Order</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Page Component ---
const Bookstore: React.FC = () => {
  const [cartCount, setCartCount] = useState(0);

  const handleOrder = (title: string) => {
    console.log(`Ordered: ${title}`);
    setCartCount(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 text-blue-600">
            <BookOpen size={28} strokeWidth={2.5} />
            <span className="text-2xl font-black tracking-tighter text-gray-900 uppercase">PageTurner</span>
          </div>
          
          <div className="relative p-2 hover:bg-gray-100 rounded-full cursor-pointer transition-colors">
            <ShoppingCart className="text-gray-700" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white">
                {cartCount}
              </span>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <header className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Editor's Picks</h2>
          <div className="h-1 w-20 bg-blue-600 rounded-full"></div>
        </header>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {BOOKS_DATA.map(book => (
            <BookCard key={book.id} book={book} onOrder={handleOrder} />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-10 text-center text-gray-400 text-sm">
        &copy; 2026 PageTurner Bookstore. All rights reserved.
      </footer>
    </div>
  );
};

export default Bookstore;