import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Package, 
  Heart, 
  FileText, 
  BarChart3, 
  Settings, 
  Menu, 
  X, 
  User, 
  LogOut, 
  ChevronRight,
  Search
} from 'lucide-react';
import CigarCutterIcon from './CigarCutterIcon';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
  userEmail?: string;
  onSignOut: () => void;
}

export default function Layout({ children, currentPage, onPageChange, userEmail, onSignOut }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'humidor', label: 'Humidor', icon: Home, color: 'from-amber-500 to-orange-500' },
    { id: 'wishlist', label: 'Wishlist', icon: Heart, color: 'from-amber-500 to-orange-500' },
    { id: 'discover', label: 'Discover', icon: Search, color: 'from-amber-500 to-orange-500' },
    { id: 'recommendations', label: 'Insights', icon: BarChart3, color: 'from-amber-500 to-orange-500' },
    { id: 'tasting-notes', label: 'Tasting', icon: FileText, color: 'from-amber-500 to-orange-500' },
  ];

  const handleNavClick = (pageId: string) => {
    onPageChange(pageId);
    setIsMobileMenuOpen(false);
  };

  const handleSignOut = () => {
    onSignOut();
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled 
          ? 'bg-white shadow-lg border-b border-amber-200' 
          : 'bg-white shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo and Title */}
            <div className="flex items-center">
              <h1 className="text-xl sm:text-2xl font-sans font-extrabold tracking-wide text-amber-900">
                HumiTrack
              </h1>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-3 rounded-2xl bg-amber-100 text-amber-700 hover:bg-amber-200 transition-all duration-200 shadow-md"
              aria-label="Main menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>

            {/* Desktop Navigation - Hidden on mobile */}
            <nav className="hidden lg:flex space-x-2">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onPageChange(item.id)}
                    className={`flex items-center space-x-2 py-3 px-4 rounded-2xl transition-all duration-300 ${
                      isActive
                        ? 'bg-amber-600 text-white shadow-lg'
                        : 'text-amber-700 hover:bg-amber-100 hover:shadow-md'
                    }`}
                  >
                    <IconComponent className="h-5 w-5" />
                    <span className="font-semibold">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Desktop User Info - Hidden on mobile */}
            <div className="hidden lg:flex items-center space-x-4">
              {userEmail && (
                <div className="text-right">
                  <div className="flex items-center space-x-3 p-3 bg-amber-100 rounded-2xl">
                    <div className="p-2 bg-amber-600 rounded-xl">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <p className="text-amber-800 font-semibold text-sm">
                      {userEmail.split('@')[0]}
                    </p>
                  </div>
                </div>
              )}
              <button
                onClick={onSignOut}
                className="p-3 bg-red-600 hover:bg-red-700 rounded-2xl text-white transition-all duration-200 shadow-lg hover:shadow-xl"
                title="Sign Out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0 z-50 bg-black/20 backdrop-blur-sm" 
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white shadow-2xl" 
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 h-full flex flex-col">
                {/* Mobile Menu Header */}
                <div className="flex justify-between items-center mb-8 pb-6 border-b border-amber-100">
                  <span className="font-sans font-extrabold text-2xl tracking-wide text-amber-900">
                    HumiTrack
                  </span>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-3 rounded-2xl bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 hover:from-gray-200 hover:to-gray-300 transition-all duration-200"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* User Info */}
                {userEmail && (
                  <div className="mb-8 p-5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl border border-amber-200 shadow-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl shadow-md">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-amber-800 font-bold text-lg">{userEmail.split('@')[0]}</p>
                        <p className="text-amber-600 text-sm">{userEmail}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Items */}
                <nav className="space-y-3 mb-8 flex-1 overflow-y-auto">
                  {navItems.map((item) => {
                    const IconComponent = item.icon;
                    const isActive = currentPage === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id)}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${
                          isActive
                            ? `bg-gradient-to-r ${item.color} text-white shadow-lg transform scale-105`
                            : 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 hover:from-amber-50 hover:to-orange-50 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`p-2.5 rounded-xl ${
                            isActive ? 'bg-white/20' : 'bg-gradient-to-r from-amber-100 to-orange-100'
                          }`}>
                            <IconComponent className="h-6 w-6" />
                          </div>
                          <span className="font-semibold text-lg">{item.label}</span>
                        </div>
                        <ChevronRight className={`h-5 w-5 transition-transform duration-200 ${
                          isActive ? 'text-white' : 'text-gray-400'
                        }`} />
                      </button>
                    );
                  })}
                </nav>

                {/* Sign Out Button */}
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center space-x-4 p-4 bg-gradient-to-r from-red-400 to-pink-500 text-white rounded-2xl hover:from-red-500 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <div className="p-2 bg-white/20 rounded-xl">
                    <LogOut className="h-5 w-5" />
                  </div>
                  <span className="font-semibold text-lg">Sign Out</span>
                </button>

                {/* Quote in mobile menu */}
                <div className="mt-8 pt-6 border-t border-amber-100">
                  <p className="text-amber-700 text-center italic font-medium">
                    "A good cigar is as great as a work of art"
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-amber-900 to-orange-900 border-t-2 border-amber-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-amber-100 font-medium">
              © 2024 HumiTrack - Your Premium Cigar Collection Manager
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}