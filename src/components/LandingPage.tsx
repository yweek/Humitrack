import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  Star, 
  FileText, 
  Camera, 
  Heart, 
  Users, 
  Cigarette,
  BarChart3,
  Sparkles,
  ArrowRight,
  X,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react';

interface LandingPageProps {
  onSignIn: (email: string, password: string) => Promise<{ error: any }>;
  onSignUp: (email: string, password: string) => Promise<{ error: any }>;
  user: any;
}

const LandingPage: React.FC<LandingPageProps> = ({ onSignIn, onSignUp, user }) => {
  const [showAuth, setShowAuth] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fermer automatiquement le modal quand l'utilisateur est connecté
  useEffect(() => {
    if (user && showAuth) {
      setShowAuth(false);
    }
  }, [user, showAuth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const { error } = isSignUp 
        ? await onSignUp(email, password)
        : await onSignIn(email, password);

      if (error) {
        setError(error.message || 'An error occurred');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowAuth(false);
    setEmail('');
    setPassword('');
    setError(null);
    setIsSignUp(false);
  };

  const features = [
    {
      icon: Package,
      title: "Digital Humidor",
      description: "Track every cigar in your collection with detailed information"
    },
    {
      icon: Star,
      title: "Rate & Review",
      description: "Rate your smoking experience and share detailed reviews"
    },
    {
      icon: FileText,
      title: "Tasting Notes",
      description: "Document flavors, aromas, and personal tasting experiences"
    },
    {
      icon: Camera,
      title: "Photo Gallery",
      description: "Save photos of your favorite cigar bands and moments"
    },
    {
      icon: Heart,
      title: "Wishlist",
      description: "Build your dream list of cigars to discover and try"
    },
    {
      icon: BarChart3,
      title: "Analytics",
      description: "Monitor aging, inventory, and smoking patterns"
    }
  ];

  const stats = [
    { number: "1000+", label: "Cigars in database" },
    { number: "48+", label: "Premium brands" },
    { number: "10+", label: "Countries of origin" },
  ];

  const testimonials = [
    {
      name: "Alex Rodriguez",
      role: "Cigar Enthusiast",
      content: "Finally, a digital humidor that understands cigar lovers. The tasting notes feature is incredible!",
      avatar: "AR"
    },
    {
      name: "Maria Santos",
      role: "Collector",
      content: "I love how easy it is to track my collection and discover new cigars. The interface is beautiful.",
      avatar: "MS"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5E8D0] via-[#E8D5B0] to-[#C18D5A]">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-[#C18D5A]/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative">
                <Cigarette className="h-8 w-8 text-[#9E5A4A]" />
                <Sparkles className="h-4 w-4 text-[#C18D5A] absolute -top-1 -right-1" />
              </div>
              <span className="text-xl font-bold text-[#3C2F2F]">HumiTrack</span>
            </motion.div>
            <motion.button
              onClick={() => setShowAuth(true)}
              className="btn-primary"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-6"
            >
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-[#9E5A4A]/10 text-[#9E5A4A] border border-[#9E5A4A]/20">
                <Sparkles className="h-4 w-4 mr-2" />
                The Ultimate Digital Humidor
              </span>
            </motion.div>
            
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#3C2F2F] mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Track Your
              <br />
              <span className="bg-gradient-to-r from-[#9E5A4A] to-[#C18D5A] bg-clip-text text-transparent">
                Cigar Journey
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl text-[#7E7C7B] max-w-2xl mx-auto mb-10 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              A beautiful digital humidor designed by and for cigar enthusiasts. 
              Rate, review, and track your collection with elegance.
            </motion.p>

            <motion.div
              className="flex justify-center items-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <motion.button
                onClick={() => setShowAuth(true)}
                className="btn-primary text-lg px-8 py-4 flex items-center group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Your Collection
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </motion.div>

            <motion.div 
              className="flex items-center justify-center space-x-8 text-sm text-[#7E7C7B]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                <span>Join enthusiasts from 10+ countries</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl md:text-5xl font-bold text-[#9E5A4A] mb-2">
                  {stat.number}
                </div>
                <div className="text-lg text-[#7E7C7B]">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#3C2F2F] mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-[#7E7C7B] max-w-2xl mx-auto">
              All the tools you need to manage your cigar collection and enhance your smoking experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="card group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-[#9E5A4A] to-[#C18D5A] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-[#3C2F2F] mb-3">{feature.title}</h3>
                <p className="text-[#7E7C7B] leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#3C2F2F] mb-4">
              Loved by Cigar Enthusiasts
            </h2>
            <p className="text-lg text-[#7E7C7B] max-w-2xl mx-auto">
              See what our community has to say about their experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#9E5A4A] to-[#C18D5A] rounded-full flex items-center justify-center text-white font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="text-[#7E7C7B] mb-4 leading-relaxed">"{testimonial.content}"</p>
                    <div>
                      <div className="font-semibold text-[#3C2F2F]">{testimonial.name}</div>
                      <div className="text-sm text-[#7E7C7B]">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#9E5A4A] to-[#C18D5A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of cigar enthusiasts who are already tracking their collections
            </p>
            <motion.button
              onClick={() => setShowAuth(true)}
              className="bg-white text-[#9E5A4A] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors flex items-center mx-auto group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#3C2F2F] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Cigarette className="h-6 w-6 text-[#C18D5A]" />
                <span className="text-xl font-bold">HumiTrack</span>
              </div>
              <p className="text-[#C18D5A] mb-4 max-w-md">
                The ultimate digital humidor for cigar enthusiasts. Track, rate, and discover your perfect smoke.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-[#C18D5A]">
                <li>Features</li>
                <li>Pricing</li>
                <li>API</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-[#C18D5A]">
                <li>About</li>
                <li>Contact</li>
                <li>Privacy</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#4A3A3A] mt-8 pt-8 text-center text-[#7E7C7B]">
            <p>&copy; 2025 HumiTrack. Made with ❤️ for cigar lovers.</p>
          </div>
        </div>
      </footer>

      {showAuth && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-8 rounded-xl w-full max-w-md shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-amber-900">
                {isSignUp ? 'Create Account' : 'Sign In'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              {error && (
                <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                  {error}
                </div>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 text-white py-3 rounded-lg font-medium hover:from-amber-700 hover:to-yellow-700 transition-all disabled:opacity-50"
              >
                {loading ? 'Loading...' : (isSignUp ? 'Create Account' : 'Sign In')}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError(null);
                }}
                className="text-amber-600 hover:text-amber-700 text-sm font-medium"
              >
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default LandingPage; 