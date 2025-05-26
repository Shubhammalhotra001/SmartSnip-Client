
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { loadSlim } from 'tsparticles-slim';
import { tsParticles } from 'tsparticles-engine'; // ✅ Required import

export default function AuthForm({ title, submitText, onSubmit, linkText, linkTo, linkLabel }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    if (formRef.current) {
      formRef.current.querySelector('input')?.focus();
    }
  }, []);

  const particlesInit = async (main) => {
    await loadSlim(main); // ✅ Fix: use the passed main object
  };

  useEffect(() => {
    const initParticles = async () => {
      await particlesInit(tsParticles); // ✅ Fix: pass tsParticles as `main`
      tsParticles.load('particles', {
        particles: {
          number: { value: 50, density: { enable: true, value_area: 800 } },
          color: { value: ['#FFD700', '#D4A017'] },
          shape: { type: 'circle' },
          opacity: { value: 0.5, random: true },
          size: { value: 3, random: true },
          line_linked: {
            enable: true,
            distance: 120,
            color: '#FFD700',
            opacity: 0.3,
            width: 1,
          },
          move: {
            enable: true,
            speed: 1,
            direction: 'none',
            random: true,
            straight: false,
            out_mode: 'out',
          },
        },
        interactivity: {
          detect_on: 'canvas',
          events: {
            onhover: { enable: true, mode: 'grab' },
            onclick: { enable: true, mode: 'push' },
            resize: true,
          },
          modes: {
            grab: { distance: 140, line_linked: { opacity: 0.5 } },
            push: { particles_nb: 3 },
          },
        },
        retina_detect: true,
      });
    };
    initParticles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const success = await onSubmit(email, password, setErrors, setMessage, setIsLoading);
    if (success) {
      setEmail('');
      setPassword('');
    }
  };

  const variants = {
    hidden: { opacity: 0, scale: 0.9, y: 50 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.9, y: -50 },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4 relative overflow-hidden">
      <div id="particles" className="absolute inset-0 z-0"></div>
      <div className="absolute inset-0 bg-black/40 animate-pulse-slow z-1"></div>
      <motion.div
        className="relative bg-white/10 backdrop-blur-2xl rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gold-500/30 glow-effect z-10"
        variants={variants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.8, ease: 'easeOut' }}
        role="dialog"
        aria-labelledby="form-title"
        ref={formRef}
      >
        <motion.h2
          id="form-title"
          className="text-4xl font-extrabold text-center mb-4 text-white neon-glow font-inter"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          SmartSnip
        </motion.h2>
        <motion.p
          className="text-center text-sm mb-6 text-gray-300 font-inter"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {title}
        </motion.p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <label htmlFor="email" className="block text-sm font-medium text-gray-200 font-inter">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full p-4 rounded-md2 bg-black/50 border border-gold-500/50 text-white focus:outline-none focus:ring-2 focus:ring-gold-400 transition-all duration-300 font-inter placeholder-gray-400 hover:border-gold-400"
              placeholder="Enter your email"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            <AnimatePresence>
              {errors.email && (
                <motion.p
                  id="email-error"
                  className="text-red-400 text-xs mt-1 font-inter"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {errors.email}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <label htmlFor="password" className="block text-sm font-medium text-gray-200 font-inter">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full p-4 rounded-md2 bg-black/50 border border-gold-500/50 text-white focus:outline-none focus:ring-2 focus:ring-gold-400 transition-all duration-300 font-inter placeholder-gray-400 hover:border-gold-400"
              placeholder="Enter your password"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-error' : undefined}
            />
            <AnimatePresence>
              {errors.password && (
                <motion.p
                  id="password-error"
                  className="text-red-400 text-xs mt-1 font-inter"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {errors.password}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
          <motion.button
            type="submit"
            disabled={isLoading}
            className="w-full p-4 rounded-md2 bg-gradient-to-r from-gold-500 to-gold-600 text-black font-semibold hover:from-gold-600 hover:to-gold-700 disabled:opacity-50 transition-all duration-300 font-inter flex items-center justify-center shadow-lg glow-button"
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(212, 160, 23, 0.6)' }}
            whileTap={{ scale: 0.95 }}
            aria-label={submitText}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
            ) : (
              submitText
            )}
          </motion.button>
          <AnimatePresence>
            {message && (
              <motion.p
                className={`text-sm text-center font-inter ${message.includes('successful') ? 'text-green-400' : 'text-red-400'}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
              >
                {message}
              </motion.p>
            )}
          </AnimatePresence>
          <motion.p
            className="text-sm text-center text-gray-300 font-inter"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            {linkText}{' '}
            <Link to={linkTo} className="text-gold-400 hover:text-gold-300 font-semibold transition-all duration-200">
              {linkLabel}
            </Link>
          </motion.p>
        </form>
      </motion.div>
    </div>
  );
}
