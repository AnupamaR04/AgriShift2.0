import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, Menu, X, ArrowRight, ShieldCheck, Globe, Satellite, Sparkles, LayoutDashboard } from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';
import LanguageSelector from '../common/LanguageSelector';
import Button from '../ui/Button';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { t, isMalayalam } = useTranslation();

  const navLinks = [
    { name: t('nav_features'), href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'NASA Tech', href: '#nasa-tech' },
    { name: t('soil_title').split(' ')[0], href: '#soil-intel' },
    { name: t('nav_schemes'), href: '#schemes' },
    { name: 'About', href: '#about' },
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-agri-sand transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Identity */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-agri-forest flex items-center justify-center text-agri-mist shadow-soft transition-transform group-hover:scale-105">
              <Sprout className="w-6 h-6 text-agri-lightleaf" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-display font-extrabold text-agri-forest tracking-tight">AgriShift</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-sans">2.0 Global</span>
              </div>
              <span className={`text-[11px] font-semibold text-agri-paddy tracking-wide -mt-0.5 ${isMalayalam ? 'font-malayalam' : ''}`}>
                {isMalayalam ? 'അഗ്രിഷിഫ്റ്റ് • ആഗോള കാർഷിക ഇന്റലിജൻസ്' : 'Worldwide Agricultural Intelligence'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="px-3.5 py-2 text-sm font-medium text-agri-forest/80 hover:text-agri-forest hover:bg-agri-sand/60 rounded-lg transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Action: Language Selector & Launch Buttons */}
          <div className="hidden sm:flex items-center space-x-3">
            <LanguageSelector />

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/login')}
              className="text-agri-forest font-medium"
            >
              {t('nav_login')}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="font-bold shadow-soft flex items-center gap-1.5 bg-agri-forest hover:bg-agri-dark"
            >
              <LayoutDashboard className="w-4 h-4 text-agri-lightleaf" />
              {t('nav_dashboard')}
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="flex sm:hidden items-center gap-2">
            <LanguageSelector />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-agri-forest hover:bg-agri-sand/80 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-agri-sand bg-white px-4 pt-2 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="px-4 py-2.5 text-base font-medium text-agri-forest hover:bg-agri-sand/60 rounded-xl"
              >
                {link.name}
              </a>
            ))}
          </div>
          <div className="pt-4 border-t border-agri-sand flex flex-col gap-2">
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/dashboard');
              }}
              className="w-full justify-center shadow-soft font-bold flex items-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4 text-agri-lightleaf" />
              {t('nav_dashboard')}
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/login');
              }}
              className="w-full justify-center"
            >
              {t('nav_login')}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
