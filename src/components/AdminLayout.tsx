import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Activity, LayoutDashboard, Users, MessageSquare,
  Megaphone, Calendar, HandHeart, Star, LogOut, Menu, X,
  Sun, Moon, BookOpen, Heart, Library
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AdminThemeProvider, useAdminTheme } from '../context/AdminThemeContext';

const NAV_ITEMS = [
  { icon: <LayoutDashboard size={18} />, label: 'Analytics',      route: '/admin' },
  { icon: <Users size={18} />,           label: 'Users',           route: '/admin/users' },
  { icon: <MessageSquare size={18} />,   label: 'Messages',        route: '/admin/contacts' },
  { icon: <Megaphone size={18} />,       label: 'Announcements',   route: '/admin/announcements' },
  { icon: <Calendar size={18} />,        label: 'Events',          route: '/admin/events' },
  { icon: <BookOpen size={18} />,        label: 'Sermons',         route: '/admin/sermons' },
  { icon: <HandHeart size={18} />,       label: 'Prayer Requests', route: '/admin/prayer-requests' },
  { icon: <Star size={18} />,            label: 'Testimonies',     route: '/admin/testimonies' },
  { icon: <Heart size={18} />,           label: 'Donations',       route: '/admin/donations' },
  { icon: <Library size={18} />,         label: 'Books',           route: '/admin/books' },
];

const AdminLayoutInner: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate              = useNavigate();
  const location              = useLocation();
  const { logout }            = useAuth();
  const { isDark, toggleTheme } = useAdminTheme();
  const [isOpen, setIsOpen]   = useState(false);

  const isActive = (route: string) =>
    route === '/admin'
      ? location.pathname === '/admin'
      : location.pathname.startsWith(route);

  const sidebarBg = isDark ? 'bg-black border-white/5'     : 'bg-white border-slate-200';
  const overlayBg = isDark ? 'bg-[#0d0d0d]'               : 'bg-slate-50';
  const navText   = isDark
    ? 'text-zinc-400 hover:bg-white/8 hover:text-white'
    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900';
  const topBar    = isDark ? 'bg-[#0d0d0d] border-white/5' : 'bg-white border-slate-200';

  return (
    <div className={`flex h-screen ${overlayBg}`}>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 flex flex-col border-r
        transition-transform duration-300
        ${sidebarBg}
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-fuchsia-600 rounded-lg flex items-center justify-center">
              <Activity size={18} className="text-white" />
            </div>
            <h1 className={`font-black uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>
              GFM <span className="text-fuchsia-600">Core</span>
            </h1>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-white/10 text-zinc-400"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="px-3 space-y-1 flex-1 overflow-y-auto">
          {NAV_ITEMS.map(item => (
            <button
              key={item.route}
              onClick={() => { navigate(item.route); setIsOpen(false); }}
              className={`flex items-center gap-3 w-full p-3 rounded-xl transition-colors text-sm ${
                isActive(item.route)
                  ? 'bg-fuchsia-600 text-white'
                  : navText
              }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>

        <div className={`p-4 border-t ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full p-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors text-sm"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Mobile Top Bar */}
        <div className={`flex items-center justify-between px-6 py-4 border-b lg:hidden ${topBar}`}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsOpen(true)}
              className={`p-2 rounded-lg transition-colors ${
                isDark
                  ? 'bg-white/5 hover:bg-white/10'
                  : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              <Menu size={20} className={isDark ? 'text-white' : 'text-slate-700'} />
            </button>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 bg-fuchsia-600 rounded flex items-center justify-center">
                <Activity size={12} className="text-white" />
              </div>
              <span className={`font-black uppercase text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                GFM <span className="text-fuchsia-600">Core</span>
              </span>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-colors ${
              isDark
                ? 'bg-white/5 hover:bg-white/10'
                : 'bg-slate-100 hover:bg-slate-200'
            }`}
          >
            {isDark
              ? <Sun size={18} className="text-amber-400" />
              : <Moon size={18} className="text-slate-500" />
            }
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AdminThemeProvider>
    <AdminLayoutInner>{children}</AdminLayoutInner>
  </AdminThemeProvider>
);

export default AdminLayout;