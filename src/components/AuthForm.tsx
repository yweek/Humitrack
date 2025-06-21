import React, { useState } from 'react';
import { Cigarette, Mail, Lock, Eye, EyeOff, AlertCircle, BookOpen, BarChart3, Heart, Camera, Star, Users, ArrowRight, CheckCircle, X, Database, TrendingUp, Shield, Zap, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface AuthFormProps {
  onSignIn: (email: string, password: string) => Promise<{ error: any }>;
  onSignUp: (email: string, password: string) => Promise<{ error: any }>;
}

export default function AuthForm({ onSignIn, onSignUp }: AuthFormProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAuth, setShowAuth] = useState(false);

  const getErrorMessage = (error: any) => {
    if (!error) return null;
    
    const message = error.message?.toLowerCase() || '';
    
    if (message.includes('invalid login credentials') || message.includes('invalid_credentials')) {
      return isSignUp 
        ? 'An account with this email may already exist. Try signing in.'
        : 'Invalid email or password. Please check your credentials.'
    }
    
    if (message.includes('email not confirmed')) {
      return 'Please check your email and click the confirmation link before signing in.';
    }
    
    if (message.includes('signup disabled')) {
      return 'New account registration is currently disabled.';
    }
    
    if (message.includes('email already registered')) {
      return 'An account with this email already exists. Try signing in.';
    }
    
    return error.message || 'An unexpected error occurred. Please try again.';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

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
        setError(getErrorMessage(error));
      } else if (isSignUp) {
        setError('Account created successfully! Please check your email for the confirmation link.');
      }
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Digital Humidor",
      description: "Manage your cigar collection with precision. Track humidity, temperature, and aging time for each cigar."
    },
    {
      icon: <Star className="h-6 w-6" />,
      title: "Tasting Notes",
      description: "Record your smoking experiences with detailed notes, photos, and personalized ratings."
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Analytics & Insights",
      description: "Analyze your preferences and discover trends in your collection and tasting history."
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Wishlist",
      description: "Create your wishlist and discover new cigars recommended based on your taste profile."
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: "Discover",
      description: "Explore a database of 1000+ cigars with detailed information and recommendations."
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Collection Growth",
      description: "Track your collection's value and growth over time with comprehensive analytics."
    }
  ];

  const benefits = [
    "1000+ cigars database",
    "Mobile-optimized interface",
    "Cloud synchronization",
    "Real-time analytics",
    "Maximum security"
  ];

  const stats = [
    { number: "1000+", label: "Cigars", icon: <Database className="h-4 w-4" /> },
    { number: "24/7", label: "Access", icon: <Clock className="h-4 w-4" /> },
    { number: "Secure", label: "Cloud", icon: <Shield className="h-4 w-4" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 p-4 bg-white/90 backdrop-blur-md border-b border-amber-200">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <div className="p-1.5 bg-gradient-to-r from-amber-600 to-yellow-600 rounded-lg shadow-lg">
              <Cigarette className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-serif font-bold text-amber-900">HumiTrack</span>
          </motion.div>
          
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => setShowAuth(true)}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium text-sm"
          >
            Sign In
          </motion.button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-amber-900 mb-4">
              Your Digital
              <span className="block text-amber-600">Humidor</span>
            </h1>
            <p className="text-lg md:text-xl text-amber-700 max-w-2xl mx-auto mb-8 leading-relaxed">
              Manage your cigar collection, record your tastings, and discover new favorites with HumiTrack. 
              The ultimate companion for cigar enthusiasts.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAuth(true)}
              className="px-8 py-4 bg-gradient-to-r from-amber-600 to-yellow-600 text-white rounded-xl hover:from-amber-700 hover:to-yellow-700 transition-all font-medium text-lg flex items-center justify-center space-x-2 shadow-lg mx-auto"
            >
              <span>Start Free</span>
              <ArrowRight className="h-5 w-5" />
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-3 gap-4 max-w-2xl mx-auto"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-4 bg-white/50 rounded-xl backdrop-blur-sm">
                <div className="flex justify-center mb-2 text-amber-600">{stat.icon}</div>
                <div className="text-xl font-bold text-amber-600 mb-1">{stat.number}</div>
                <div className="text-sm text-amber-700">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-amber-900 mb-4">
              Key Features
            </h2>
            <p className="text-lg text-amber-700 max-w-2xl mx-auto leading-relaxed">
              Everything you need to manage your passion for cigars, from collection tracking to detailed tasting notes
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
                className="bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-2xl border border-amber-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="text-amber-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-amber-900 mb-3">{feature.title}</h3>
                <p className="text-amber-700 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-amber-100 to-orange-100">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-amber-900 mb-4">
              Why Choose HumiTrack?
            </h2>
            <p className="text-lg text-amber-700 max-w-2xl mx-auto leading-relaxed">
              Join thousands of cigar enthusiasts who trust HumiTrack to manage their collections
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
                className="flex items-center space-x-3 text-left bg-white/50 p-4 rounded-xl backdrop-blur-sm"
              >
                <CheckCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
                <span className="text-amber-800 font-medium">{benefit}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="bg-white/70 p-8 rounded-2xl backdrop-blur-sm"
          >
            <h3 className="text-2xl font-bold text-amber-900 mb-4">Ready to Transform Your Cigar Experience?</h3>
            <p className="text-amber-700 mb-6 leading-relaxed">
              Start managing your collection like a pro. Track your cigars, record your tastings, and discover new favorites with our comprehensive platform.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAuth(true)}
              className="px-8 py-4 bg-gradient-to-r from-amber-600 to-yellow-600 text-white rounded-xl hover:from-amber-700 hover:to-yellow-700 transition-all font-medium text-lg flex items-center justify-center space-x-2 shadow-lg mx-auto"
            >
              <span>Create Free Account</span>
              <ArrowRight className="h-5 w-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-serif font-bold text-amber-900">
                {isSignUp ? 'Create Account' : 'Sign In'}
              </h2>
              <button 
                onClick={() => setShowAuth(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className={`border rounded-lg p-4 flex items-center space-x-2 ${
                    error.includes('success') || error.includes('confirmation')
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <AlertCircle className={`h-5 w-5 flex-shrink-0 ${
                      error.includes('success') || error.includes('confirmation')
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`} />
                    <p className={`text-sm ${
                      error.includes('success') || error.includes('confirmation')
                        ? 'text-green-700'
                        : 'text-red-700'
                    }`}>{error}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Your email"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {isSignUp && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={6}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="Confirm your password"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 text-white py-3 px-4 rounded-lg hover:from-amber-700 hover:to-yellow-700 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all duration-200"
                >
                  {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setError(null);
                      setPassword('');
                      setConfirmPassword('');
                    }}
                    className="text-amber-600 hover:text-amber-700 font-medium"
                  >
                    {isSignUp 
                      ? 'Already have an account? Sign in' 
                      : "Don't have an account? Sign up"
                    }
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}