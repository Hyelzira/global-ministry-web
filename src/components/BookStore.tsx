import React, { useState } from "react";
import {
  ShoppingCart,
  Star,
  ArrowRight,
  Download,
  Music,
  Video,
  X
} from "lucide-react";

/* ================= TYPES ================= */

interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  rating: number;
  description: string;
  imageUrl: string;
  category: string;
  mp3Url?: string;
  mp4Url?: string;
}

/* ================= DATA ================= */

const BOOKS_DATA: Book[] = [
  {
    id: 1,
    title: "The Midnight Library",
    author: "Matt Haig",
    price: 18.99,
    rating: 4.5,
    category: "Fiction",
    description:
      "Between life and death there is a library filled with infinite possibilities.",
    imageUrl:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400",
    mp3Url: "/downloads/midnight-library.mp3",
    mp4Url: "/downloads/midnight-library.mp4"
  },
  {
    id: 2,
    title: "Atomic Habits",
    author: "James Clear",
    price: 21.0,
    rating: 5,
    category: "Self-Help",
    description: "An easy and proven way to build good habits.",
    imageUrl:
      "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=400",
    mp3Url: "/downloads/atomic-habits.mp3",
    mp4Url: "/downloads/atomic-habits.mp4"
  }
];

/* ================= BOOK CARD ================= */

const BookCard: React.FC<{
  book: Book;
  onOrder: (book: Book) => void;
}> = ({ book, onOrder }) => {
  return (
    <div className="group bg-white rounded-3xl shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border overflow-hidden flex flex-col">

      {/* IMAGE */}
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={book.imageUrl}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-110 transition"
        />

        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-end p-6 transition">
          <button
            onClick={() => onOrder(book)}
            className="w-full bg-white py-3 rounded-xl font-bold flex justify-center gap-2"
          >
            Add To Cart <ShoppingCart size={18} />
          </button>
        </div>
      </div>

      {/* INFO */}
      <div className="p-6 flex flex-col flex-grow">

        <h3 className="font-black text-lg">{book.title}</h3>
        <p className="text-xs text-slate-400 mb-3">By {book.author}</p>

        {/* RATING */}
        <div className="flex gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={12} className="text-amber-500" />
          ))}
        </div>

        {/* ✅ BOOK DETAILS SECTION */}
        <div className="bg-slate-50 rounded-xl p-4 text-sm space-y-2 mb-4">
          <p><b>Title:</b> {book.title}</p>
          <p><b>Author:</b> {book.author}</p>
          <p className="text-xs text-slate-600">{book.description}</p>
          <p><b>Price:</b> ${book.price.toFixed(2)}</p>

          <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded">
            High-Quality Cover (PNG/JPG)
          </span>
        </div>

        {/* DOWNLOADS */}
        <div className="bg-slate-50 rounded-xl p-3 mb-4">
          <p className="text-xs font-bold mb-2 flex gap-1 items-center">
            <Download size={14}/> Downloads
          </p>

          <div className="flex gap-2">
            {book.mp3Url && (
              <a href={book.mp3Url} download className="flex-1 border rounded-lg py-2 text-xs flex justify-center gap-1">
                <Music size={14}/> MP3
              </a>
            )}

            {book.mp4Url && (
              <a href={book.mp4Url} download className="flex-1 border rounded-lg py-2 text-xs flex justify-center gap-1">
                <Video size={14}/> MP4
              </a>
            )}
          </div>
        </div>

        <div className="mt-auto flex justify-between items-center">
          <span className="text-xl font-black">${book.price.toFixed(2)}</span>
          <ArrowRight size={20} className="text-fuchsia-600"/>
        </div>

      </div>
    </div>
  );
};

/* ================= ADD TO CART MODAL ================= */

const CartModal: React.FC<{
  cart: Book[];
  onClose: () => void;
  onCheckout: () => void;
}> = ({ cart, onClose, onCheckout }) => {

  const total = cart.reduce((sum, b) => sum + b.price, 0);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100]">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 relative">

        <button onClick={onClose} className="absolute right-4 top-4">
          <X />
        </button>

        <h2 className="text-xl font-black mb-4">
          Add To Cart
        </h2>

        {/* 4 BOOK SPACES */}
        <div className="space-y-3">
          {[0,1,2,3].map(i => (
            <div key={i} className="border rounded-xl p-3 text-sm">
              {cart[i]
                ? `${cart[i].title} — $${cart[i].price.toFixed(2)}`
                : "Empty Book Slot"}
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t flex justify-between font-bold">
          <span>Total Books:</span>
          <span>{cart.length}</span>
        </div>

        <div className="flex justify-between text-lg font-black">
          <span>Total Amount:</span>
          <span>${total.toFixed(2)}</span>
        </div>

        <button
          onClick={onCheckout}
          className="mt-6 w-full bg-fuchsia-600 text-white py-3 rounded-xl font-bold"
        >
          Proceed to Checkout →
        </button>
      </div>
    </div>
  );
};

/* ================= CHECKOUT MODAL ================= */

const CheckoutModal: React.FC<{
  cart: Book[];
  onClose: () => void;
}> = ({ cart, onClose }) => {

  const total = cart.reduce((sum, b) => sum + b.price, 0);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[120]">
      <div className="bg-white w-full max-w-lg rounded-3xl p-8 relative">

        <button onClick={onClose} className="absolute right-5 top-5">
          <X />
        </button>

        <h2 className="text-2xl font-black mb-6">
          Checkout Summary
        </h2>

        <div className="space-y-3">
          {cart.map((book, i) => (
            <div key={i} className="flex justify-between border-b pb-2">
              <span>{book.title}</span>
              <span>${book.price.toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t flex justify-between text-lg font-black">
          <span>Total ({cart.length} items)</span>
          <span>${total.toFixed(2)}</span>
        </div>

        <button className="mt-6 w-full bg-green-600 text-white py-3 rounded-xl font-bold">
          Complete Purchase
        </button>
      </div>
    </div>
  );
};

/* ================= MAIN PAGE ================= */

const Bookstore: React.FC = () => {

  const [cart, setCart] = useState<Book[]>([]);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  const addToCart = (book: Book) => {
    if (cart.length >= 4) return; // limit slots
    setCart(prev => [...prev, book]);
  };

  return (
    <div className="min-h-screen bg-white pt-32 pb-20">

      {/* HEADER */}
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <h1 className="text-4xl font-black">
          The <span className="text-fuchsia-600">Page</span>Turner
        </h1>
      </div>

      {/* BOOK GRID */}
      <main className="max-w-7xl mx-auto px-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {BOOKS_DATA.map(book => (
          <BookCard key={book.id} book={book} onOrder={addToCart}/>
        ))}
      </main>

      {/* FLOATING CART */}
      <div className="fixed bottom-10 right-10 z-[60]">
        <button
          onClick={() => setShowCartModal(true)}
          className="relative p-6 bg-slate-900 text-white rounded-full shadow-2xl hover:bg-fuchsia-600 transition"
        >
          <ShoppingCart size={28}/>
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-fuchsia-500 text-white text-xs font-black h-7 w-7 flex items-center justify-center rounded-full border-4 border-white">
              {cart.length}
            </span>
          )}
        </button>
      </div>

      {/* ADD TO CART MODAL */}
      {showCartModal && (
        <CartModal
          cart={cart}
          onClose={() => setShowCartModal(false)}
          onCheckout={() => {
            setShowCartModal(false);
            setShowCheckout(true);
          }}
        />
      )}

      {/* CHECKOUT MODAL */}
      {showCheckout && (
        <CheckoutModal
          cart={cart}
          onClose={() => setShowCheckout(false)}
        />
      )}

    </div>
  );
};

export default Bookstore;