import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, Award, Shield, Zap, ChartBar, Users } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const features = [
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Price Predictions",
      description: "Predict AIA price movements and earn rewards"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Win Rewards",
      description: "Earn AIA tokens for accurate predictions"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure Platform",
      description: "Built on secure smart contracts"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Quick Rounds",
      description: "Fast 5-minute prediction rounds"
    },
    {
      icon: <ChartBar className="w-6 h-6" />,
      title: "Live Analytics",
      description: "Real-time price data and trends"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Community Driven",
      description: "Join a growing community of predictors"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto text-center">
      {/* Hero Section */}
      <motion.div 
        className="mb-20"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-violet-200 via-indigo-300 to-purple-200 text-transparent bg-clip-text">
          Omega Protocol
        </h1>
        <p className="text-xl md:text-2xl text-violet-200/80 mb-8">
          Predict. Trade. Earn. The Future of AIA Price Prediction
        </p>
        <motion.button
          onClick={() => navigate('/predict')}
          className="px-8 py-4 text-lg font-medium rounded-lg bg-gradient-to-r from-violet-500 to-indigo-500 text-white hover:from-violet-600 hover:to-indigo-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-violet-500/25"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Start Predicting
        </motion.button>
      </motion.div>

      {/* Stats Section */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <div className="p-6 rounded-lg bg-gradient-to-r from-violet-950/50 to-indigo-950/50 border border-violet-500/10 backdrop-blur-sm">
          <h3 className="text-3xl font-bold text-violet-200">$1M+</h3>
          <p className="text-violet-300/70">Total Volume</p>
        </div>
        <div className="p-6 rounded-lg bg-gradient-to-r from-violet-950/50 to-indigo-950/50 border border-violet-500/10 backdrop-blur-sm">
          <h3 className="text-3xl font-bold text-violet-200">10K+</h3>
          <p className="text-violet-300/70">Predictions Made</p>
        </div>
        <div className="p-6 rounded-lg bg-gradient-to-r from-violet-950/50 to-indigo-950/50 border border-violet-500/10 backdrop-blur-sm">
          <h3 className="text-3xl font-bold text-violet-200">5K+</h3>
          <p className="text-violet-300/70">Active Users</p>
        </div>
      </motion.div>

      {/* Features Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="p-6 rounded-lg bg-gradient-to-r from-violet-950/50 to-indigo-950/50 border border-violet-500/10 backdrop-blur-sm hover:border-violet-500/30 transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 * index }}
            whileHover={{ y: -5 }}
          >
            <div className="w-12 h-12 rounded-full bg-violet-500/20 flex items-center justify-center mx-auto mb-4 text-violet-300">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2 text-violet-200">{feature.title}</h3>
            <p className="text-violet-300/70">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA Section */}
      <motion.div
        className="mt-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <div className="p-8 rounded-lg bg-gradient-to-r from-violet-900/50 to-indigo-900/50 border border-violet-500/20 backdrop-blur-sm">
          <h2 className="text-3xl font-bold mb-4 text-violet-200">Ready to Start?</h2>
          <p className="text-violet-300/70 mb-6">Join thousands of traders making predictions on AIA price movements</p>
          <motion.button
            onClick={() => navigate('/predict')}
            className="px-8 py-4 text-lg font-medium rounded-lg bg-gradient-to-r from-violet-500 to-indigo-500 text-white hover:from-violet-600 hover:to-indigo-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-violet-500/25"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Launch App
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage;