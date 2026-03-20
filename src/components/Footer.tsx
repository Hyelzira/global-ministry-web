import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, Mail, MapPin, Phone } from 'lucide-react';
import { CHURCH_NAME } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Brand & Bio */}
          <div className="space-y-4">
            <h3 className="text-white text-xl font-serif font-bold">{CHURCH_NAME}</h3>
            <p className="text-sm leading-relaxed text-slate-400">
              A place to believe, belong, and become. We are dedicated to sharing the hope of Jesus with the world.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="hover:text-white transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><Youtube className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-6">Discover</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/about" className="hover:text-brand-400 transition-colors">About Us</Link></li>
              <li><Link to="/sermons" className="hover:text-brand-400 transition-colors">Watch Live</Link></li>
              <li><Link to="/events" className="hover:text-brand-400 transition-colors">Events Calendar</Link></li>
              <li><Link to="/ministries" className="hover:text-brand-400 transition-colors">Ministries</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-6">Visit Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 text-brand-500 shrink-0" />
                <span>Zarmaganda, Diye<br />Off Rayfield Road, Jos, Plateau State, Nigeria</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-brand-500 shrink-0" />
                <span>(+234) 815 333 0011</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-brand-500 shrink-0" />
                <span>codewayne30@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-semibold mb-6">Stay Inspired</h4>
            <p className="text-sm text-slate-400 mb-4">Get daily encouragement sent to your inbox.</p>
            <form className="flex flex-col space-y-2">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="bg-slate-800 border border-slate-700 text-white px-4 py-2 rounded focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-sm"
              />
              <button className="bg-brand-600 text-white px-4 py-2 rounded font-medium hover:bg-brand-700 transition-colors text-sm">
                Subscribe
              </button>
            </form>
          </div>

        </div>
        <div className="border-t border-slate-800 mt-16 pt-8 text-center text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} {CHURCH_NAME}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;