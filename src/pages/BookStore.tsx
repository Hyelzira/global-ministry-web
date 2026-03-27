import React, { useState, useEffect } from "react";
import {
  Star, Library, Loader, X, ShoppingBag, ExternalLink
} from "lucide-react";
import { bookApi } from "../api/bookApi";
import type { BookDto } from "../types";

/* ================= BUY MODAL ================= */

const BuyModal: React.FC<{
  book: BookDto;
  onClose: () => void;
}> = ({ book, onClose }) => {

  const hasAmazon = !!book.amazonUrl;
  const hasSelar  = !!book.selarUrl;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] px-4">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-1.5 rounded-full hover:bg-slate-100 transition"
        >
          <X size={18} className="text-slate-500" />
        </button>

        {/* Book info */}
        <div className="flex gap-4 mb-6">
          {book.coverImageUrl ? (
            <img
              src={book.coverImageUrl}
              alt={book.title}
              className="w-16 h-24 object-cover rounded-xl shadow-md shrink-0"
            />
          ) : (
            <div className="w-16 h-24 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
              <Library size={24} className="text-slate-300" />
            </div>
          )}
          <div className="flex flex-col justify-center">
            <h3 className="font-black text-lg leading-tight">{book.title}</h3>
            <p className="text-sm text-slate-400 mt-1">By {book.author}</p>
            {book.price && (
              <p className="text-fuchsia-600 font-bold mt-2">
                {book.currency} {book.price.toLocaleString()}
              </p>
            )}
          </div>
        </div>

        {/* Prompt */}
        <p className="text-sm text-slate-500 mb-4 font-medium text-center">
          Where would you like to purchase this book?
        </p>

        {/* Platform buttons */}
        <div className="flex flex-col gap-3">
          {hasAmazon && (
            
              <a href={book.amazonUrl!}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full px-5 py-4 bg-[#FF9900] hover:bg-[#e68a00] text-white rounded-2xl font-bold transition group">
              <span className="flex items-center gap-3">
                {/* Amazon smile-ish icon using text */}
                <span className="text-xl">📦</span>
                Buy on Amazon
              </span>
              <ExternalLink size={16} className="opacity-70 group-hover:opacity-100 transition" />
            </a>
          )}

          {hasSelar && (
            
              <a href={book.selarUrl!}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full px-5 py-4 bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-2xl font-bold transition group">
              <span className="flex items-center gap-3">
                <span className="text-xl">🛒</span>
                Buy on Selar
              </span>
              <ExternalLink size={16} className="opacity-70 group-hover:opacity-100 transition" />
            </a>
          )}

          {!hasAmazon && !hasSelar && (
            <div className="text-center py-4 text-slate-400 text-sm">
              No purchase links available yet. Check back soon.
            </div>
          )}
        </div>

        {/* Cancel */}
        <button
          onClick={onClose}
          className="mt-4 w-full py-3 text-sm text-slate-400 hover:text-slate-600 transition font-medium"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
};

/* ================= BOOK CARD ================= */

const BookCard: React.FC<{
  book: BookDto;
  onSelect: (book: BookDto) => void;
}> = ({ book, onSelect }) => {

  const displayPrice = book.price
    ? `${book.currency} ${book.price.toLocaleString()}`
    : 'Free';

  return (
    <div className="group bg-white rounded-3xl shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border overflow-hidden flex flex-col">

      {/* IMAGE */}
      <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
        {book.coverImageUrl ? (
          <img
            src={book.coverImageUrl}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Library size={48} className="text-slate-300" />
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-end p-6 transition duration-300">
          <button
            onClick={() => onSelect(book)}
            className="w-full bg-white py-3 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-fuchsia-50 transition"
          >
            <ShoppingBag size={18} className="text-fuchsia-600" />
            Get This Book
          </button>
        </div>

        {/* Featured badge */}
        {book.isFeatured && (
          <div className="absolute top-3 left-3 bg-fuchsia-600 text-white text-[10px] font-bold uppercase px-2 py-1 rounded-full">
            Featured
          </div>
        )}
      </div>

      {/* INFO */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-black text-lg leading-tight">{book.title}</h3>
        <p className="text-xs text-slate-400 mt-1 mb-3">By {book.author}</p>

        {/* Stars — decorative */}
        <div className="flex gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={12} className="text-amber-400 fill-amber-400" />
          ))}
        </div>

        {book.description && (
          <p className="text-xs text-slate-500 mb-4 line-clamp-3">{book.description}</p>
        )}

        {/* Available on badges */}
        {(book.amazonUrl || book.selarUrl) && (
          <div className="flex gap-2 mb-4 flex-wrap">
            {book.amazonUrl && (
              <span className="text-[10px] font-bold uppercase px-2 py-1 bg-amber-100 text-amber-700 rounded-full">
                Amazon
              </span>
            )}
            {book.selarUrl && (
              <span className="text-[10px] font-bold uppercase px-2 py-1 bg-fuchsia-100 text-fuchsia-700 rounded-full">
                Selar
              </span>
            )}
          </div>
        )}

        <div className="mt-auto flex justify-between items-center">
          <span className="text-xl font-black text-slate-900">{displayPrice}</span>
          <button
            onClick={() => onSelect(book)}
            className="flex items-center gap-1.5 px-4 py-2 bg-fuchsia-600 hover:bg-fuchsia-500 text-white text-xs font-bold rounded-xl transition"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

/* ================= MAIN PAGE ================= */

const Bookstore: React.FC = () => {

  const [books, setBooks]               = useState<BookDto[]>([]);
  const [isLoading, setIsLoading]       = useState(true);
  const [error, setError]               = useState<string | null>(null);
  const [selectedBook, setSelectedBook] = useState<BookDto | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await bookApi.getPublished({ pageSize: 50, pageNumber: 1 });
        if (res.data.isSuccess && res.data.data) {
          setBooks(res.data.data.items);
        } else {
          setError('Could not load books right now.');
        }
      } catch {
        setError('Could not reach the server.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="min-h-screen bg-white pt-32 pb-20">

      {/* HEADER */}
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-fuchsia-600 mb-2">
          Global Flame Ministries
        </p>
        <h1 className="text-4xl font-black">
          The <span className="text-fuchsia-600">Page</span>Turner
        </h1>
        <p className="text-slate-400 mt-2 text-sm">
          Transformative reads — available on Amazon and Selar.
        </p>
      </div>

      {/* LOADING */}
      {isLoading && (
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-center py-24">
          <Loader size={32} className="animate-spin text-fuchsia-600" />
        </div>
      )}

      {/* ERROR */}
      {error && !isLoading && (
        <div className="max-w-7xl mx-auto px-6">
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            ⚠️ {error}
          </div>
        </div>
      )}

      {/* EMPTY */}
      {!isLoading && !error && books.length === 0 && (
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-center py-24 text-center">
          <Library size={48} className="text-slate-300 mb-4" />
          <p className="text-slate-500 text-lg font-medium">No books available yet.</p>
          <p className="text-slate-400 text-sm mt-1">Check back soon.</p>
        </div>
      )}

      {/* BOOK GRID */}
      {!isLoading && !error && books.length > 0 && (
        <main className="max-w-7xl mx-auto px-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {books.map(book => (
            <BookCard
              key={book.id}
              book={book}
              onSelect={setSelectedBook}
            />
          ))}
        </main>
      )}

      {/* BUY MODAL */}
      {selectedBook && (
        <BuyModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
        />
      )}
    </div>
  );
};

export default Bookstore;