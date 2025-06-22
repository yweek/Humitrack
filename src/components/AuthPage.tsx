import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cigarette, Sparkles, ArrowLeft } from 'lucide-react';
import AuthForm from './AuthForm';

interface AuthPageProps {
  onSignIn: (email: string, password: string) => Promise<{ error: any }>;
  onSignUp: (email: string, password: string) => Promise<{ error: any }>;
  onBack: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onSignIn, onSignUp, onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5E8D0] via-[#E8D5B0] to-[#C18D5A] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.button
            onClick={onBack}
            className="flex items-center text-[#7E7C7B] hover:text-[#3C2F2F] transition-colors mb-4 mx-auto"
            whileHover={{ x: -4 }}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </motion.button>
          
          <motion.div 
            className="flex items-center justify-center space-x-2 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <Cigarette className="h-8 w-8 text-[#9E5A4A]" />
              <Sparkles className="h-4 w-4 text-[#C18D5A] absolute -top-1 -right-1" />
            </div>
            <span className="text-2xl font-bold text-[#3C2F2F]">HumiTrack</span>
          </motion.div>
          
          <motion.h1 
            className="text-2xl font-semibold text-[#3C2F2F]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Sign in to your account
          </motion.h1>
        </div>

        {/* Auth Form */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <AuthForm 
            onSignIn={onSignIn}
            onSignUp={onSignUp}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage; 