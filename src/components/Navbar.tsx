import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  Menu, X, Heart, Globe, Play, Calendar,
  Bell, MessageSquare, UserCircle, ShieldCheck, BookOpen // Added BookOpen icon
} from 'lucide-react';
import { NAV_LINKS } from '../constants';
import logo from '../assets/flames.jpg';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, isAdmin, user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'about': return <Globe className="w-6 h-6" />;
      case 'sermons': return <Play className="w-6 h-6" />;
      case 'events': return <Calendar className="w-6 h-6" />;
      case 'books': return <BookOpen className="w-6 h-6" />; // Added case for books
      case 'announcements':
      case 'news': return <Bell className="w-6 h-6" />;
      case 'community': return <MessageSquare className="w-6 h-6" />;
      default: return <Globe className="w-6 h-6" />;
    }
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-500 ${
        scrolled ? 'bg-white shadow-md py-2' : 'bg-white py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex justify-between items-center h-10">

          {/* ── LOGO ─────────────────────────────────────────────────── */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img
              src={logo}
              alt="GFM Logo"
              className={`transition-all duration-300 ${scrolled ? 'h-10' : 'h-14'}`}
            />
            <span className="hidden lg:block font-serif text-xl font-bold text-gray-900 tracking-tight">
              Global Flame Ministries
            </span>
          </Link>

          {/* ── DESKTOP NAV ──────────────────────────────────────────── */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-5">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-[10px] font-black uppercase tracking-widest transition-colors whitespace-nowrap ${
                    isActive
                      ? 'text-fuchsia-500'
                      : 'text-gray-900 hover:text-amber-600'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}

            {/* Added: Book Store Link */}
            <NavLink
              to="/books"
              className={({ isActive }) =>
                `text-[10px] font-black uppercase tracking-widest transition-colors whitespace-nowrap ${
                  isActive ? 'text-fuchsia-500' : 'text-gray-900 hover:text-amber-600'
                }`
              }
            >
              Books
            </NavLink>

            <NavLink
              to="/announcements"
              className={({ isActive }) =>
                `text-[10px] font-black uppercase tracking-widest transition-colors whitespace-nowrap ${
                  isActive
                    ? 'text-fuchsia-500'
                    : 'text-gray-900 hover:text-amber-600'
                }`
              }
            >
              News
            </NavLink>
          </div>

          {/* ── AUTH BUTTONS (desktop) ───────────────────────────────── */}
          <div className="hidden md:flex items-center border-l pl-4 border-gray-200 gap-2 ml-2">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1 text-fuchsia-600 hover:text-fuchsia-800 transition-colors whitespace-nowrap"
                  >
                    <ShieldCheck size={13} /> Dashboard
                  </Link>
                )}
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">
                  Hi, {user?.firstName}
                </span>
                <button
                  onClick={logout}
                  className="bg-red-600 text-white px-3 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all rounded-sm whitespace-nowrap"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-[10px] font-black uppercase tracking-widest text-gray-900 hover:text-fuchsia-600 transition-colors whitespace-nowrap"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-black text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-fuchsia-600 transition-all rounded-sm whitespace-nowrap"
                >
                  Register
                </Link>
                <Link
                  to="/give"
                  className="bg-fuchsia-600 text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-fuchsia-700 transition-all rounded-sm whitespace-nowrap"
                >
                  Give
                </Link>
              </>
            )}
          </div>

          {/* ── MOBILE HAMBURGER ─────────────────────────────────────── */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(true)}
              className="p-2 text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Menu size={25} />
            </button>
          </div>

        </div>
      </div>

      {/* ── MOBILE DRAWER ────────────────────────────────────────────── */}
      <div className={`fixed inset-0 z-50 transition-all duration-300 ${
        isOpen ? 'visible opacity-100' : 'invisible opacity-0'
      }`}>
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />

        <div className={`absolute right-0 top-0 h-screen w-[70%] max-w-xs bg-[#0071bc] shadow-xl transition-transform duration-500 transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } flex flex-col`}>

          <div className="p-5">
            <div className="flex justify-end mb-6">
              <button
                onClick={() => setIsOpen(false)}
                className="text-white p-2 hover:bg-white/10 rounded-full transition-all"
              >
                <X size={25} />
              </button>
            </div>
          </div>

          {/* Mobile Auth Section */}
          <div className="bg-[#005a96]">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-4 p-5 border-b border-white/10 hover:bg-white/5"
                  >
                    <ShieldCheck className="w-5 h-5 text-amber-400" />
                    <span className="text-white font-bold uppercase tracking-[0.2em] text-[10px]">
                      Dashboard
                    </span>
                  </Link>
                )}
                <div className="flex items-center gap-2 p-5 border-b border-white/10">
                  <UserCircle className="w-5 h-5 text-white" />
                  <span className="text-white font-bold uppercase tracking-[0.2em] text-[10px]">
                    Hi, {user?.firstName}
                  </span>
                </div>
                <button
                  onClick={() => { logout(); setIsOpen(false); }}
                  className="flex items-center gap-4 p-5 border-b border-white/10 hover:bg-white/5 w-full text-left"
                >
                  <UserCircle className="w-5 h-5 text-red-400" />
                  <span className="text-white font-bold uppercase tracking-[0.2em] text-[10px]">
                    Logout
                  </span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 p-5 border-b border-white/10 hover:bg-white/5"
                >
                  <UserCircle className="w-5 h-5 text-white" />
                  <span className="text-white font-bold uppercase tracking-[0.2em] text-[10px]">
                    Login
                  </span>
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 p-5 border-b border-white/10 hover:bg-white/5"
                >
                  <UserCircle className="w-5 h-5 text-green-400" />
                  <span className="text-white font-bold uppercase tracking-[0.2em] text-[10px]">
                    Register
                  </span>
                </Link>
                <Link
                  to="/give"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 p-5 border-b border-white/10 hover:bg-white/5"
                >
                  <Heart className="w-5 h-5 text-red-400 fill-red-400" />
                  <span className="text-white font-bold uppercase tracking-[0.2em] text-[10px]">
                    Donate Now
                  </span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Nav Links */}
          <div className="flex-1 overflow-y-auto">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="flex flex-col items-center py-7 border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <div className="text-white/70 mb-2">{getIcon(link.name)}</div>
                <span className="text-white text-[10px] font-bold uppercase tracking-[0.25em]">
                  {link.name}
                </span>
              </Link>
            ))}

            {/* Added: Book Store for mobile */}
            <Link
              to="/books"
              onClick={() => setIsOpen(false)}
              className="flex flex-col items-center py-7 border-b border-white/5 hover:bg-white/5 transition-colors"
            >
              <div className="text-white/70 mb-2">
                <BookOpen className="w-6 h-6" />
              </div>
              <span className="text-white text-[10px] font-bold uppercase tracking-[0.25em]">
                Books
              </span>
            </Link>

            <Link
              to="/announcements"
              onClick={() => setIsOpen(false)}
              className="flex flex-col items-center py-7 border-b border-white/5 hover:bg-white/5 transition-colors"
            >
              <div className="text-white/70 mb-2">
                <Bell className="w-6 h-6" />
              </div>
              <span className="text-white text-[10px] font-bold uppercase tracking-[0.25em]">
                News
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;