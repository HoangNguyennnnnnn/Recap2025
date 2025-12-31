import { useNavigate, useLocation } from 'react-router-dom';
import { clearSession } from '../../utils/auth';

interface NavItem {
  label: string;
  path: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', path: '/', icon: '🏠' },
  { label: 'Vault', path: '/vault', icon: '💌' },
  { label: 'Hna', path: '/hna-gallery', icon: '💖' },
  { label: 'Thanks', path: '/thanks', icon: '✨' },
  { label: 'Timeline', path: '/stats', icon: '🪐' },
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    clearSession();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-deep-blue/90 backdrop-blur-lg border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 py-2 md:py-3 flex justify-between items-center">
        {/* Logo */}
        <button onClick={() => navigate('/')} className="flex items-center gap-2 group">
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-tr from-stardust-gold to-soft-pink flex items-center justify-center text-deep-blue font-dancing font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
            L
          </div>
          <span className="font-dancing text-lg md:text-xl text-soft-pink hidden sm:block">
            Our Universe
          </span>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-2 text-sm font-medium transition-all ${
                isActive(item.path)
                  ? 'text-stardust-gold scale-105'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Mobile Navigation + Logout */}
        <div className="flex items-center gap-1">
          {/* Mobile Nav Icons */}
          <div className="flex md:hidden items-center">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`p-2 text-lg transition-all rounded-lg ${
                  isActive(item.path)
                    ? 'text-stardust-gold bg-white/5'
                    : 'text-white/40 hover:text-white/70'
                }`}
                aria-label={item.label}
              >
                {item.icon}
              </button>
            ))}
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="p-2 ml-2 text-white/40 hover:text-rose-400 transition-colors rounded-lg hover:bg-white/5"
            aria-label="Logout"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
