import React from 'react';
import { motion } from 'framer-motion';

const Birthday = () => {
  const flowers = [
    { delay: 0, left: '15%', height: 280 },
    { delay: 0.5, left: '35%', height: 320 },
    { delay: 1, left: '50%', height: 300 },
    { delay: 0.7, left: '65%', height: 340 },
    { delay: 1.2, left: '80%', height: 290 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 via-sky-200 to-green-100 overflow-hidden relative">
      {/* Sun */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute top-12 right-16 w-24 h-24 bg-yellow-400 rounded-full shadow-lg shadow-yellow-300/50"
      />

      {/* Birthday Message */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 2 }}
        className="text-center pt-16 relative z-10"
      >
        <h1 className="text-7xl font-bold text-pink-500 mb-2 drop-shadow-lg">
          Happy Birthday!
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.5 }}
          className="text-2xl text-pink-400 font-medium"
        >
          May your day bloom with joy and happiness! 🌸
        </motion.p>
      </motion.div>

      {/* Ground/Grass */}
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-green-300 to-transparent" />

      {/* Flowers */}
      <div className="absolute bottom-0 w-full">
        {flowers.map((flower, index) => (
          <Flower
            key={index}
            delay={flower.delay}
            left={flower.left}
            height={flower.height}
          />
        ))}
      </div>

      {/* Decorative sparkles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            delay: 2 + i * 0.2,
            repeat: Infinity,
            repeatDelay: 3,
          }}
          className="absolute w-2 h-2 bg-yellow-300 rounded-full"
          style={{
            left: `${10 + i * 7}%`,
            top: `${20 + (i % 3) * 15}%`,
          }}
        />
      ))}
    </div>
  );
};

const Flower = ({ delay, left, height }: { delay: number; left: string; height: number }) => {
  return (
    <div
      className="absolute bottom-0"
      style={{ left, height: `${height}px` }}
    >
      {/* Stem growing animation */}
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: '100%' }}
        transition={{ duration: 2, delay, ease: 'easeOut' }}
        className="relative"
      >
        {/* Main stem */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-full bg-gradient-to-t from-green-600 to-green-500 rounded-full" />

        {/* Leaves */}
        <motion.div
          initial={{ scale: 0, rotate: 0 }}
          animate={{ scale: 1, rotate: -25 }}
          transition={{ duration: 0.5, delay: delay + 1 }}
          className="absolute left-0 top-1/3 w-12 h-6 bg-green-500 rounded-full origin-right"
          style={{ clipPath: 'ellipse(50% 50% at 0% 50%)' }}
        />
        <motion.div
          initial={{ scale: 0, rotate: 0 }}
          animate={{ scale: 1, rotate: 25 }}
          transition={{ duration: 0.5, delay: delay + 1.1 }}
          className="absolute right-0 top-1/2 w-12 h-6 bg-green-500 rounded-full origin-left"
          style={{ clipPath: 'ellipse(50% 50% at 100% 50%)' }}
        />
        <motion.div
          initial={{ scale: 0, rotate: 0 }}
          animate={{ scale: 1, rotate: -30 }}
          transition={{ duration: 0.5, delay: delay + 1.2 }}
          className="absolute left-0 top-2/3 w-10 h-5 bg-green-500 rounded-full origin-right"
          style={{ clipPath: 'ellipse(50% 50% at 0% 50%)' }}
        />

        {/* Flower bloom at top */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2">
          {/* Petals */}
          {[0, 72, 144, 216, 288].map((rotation, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, rotate: rotation }}
              animate={{ scale: 1, rotate: rotation }}
              transition={{ 
                duration: 0.6, 
                delay: delay + 1.5 + i * 0.1,
                ease: 'easeOut'
              }}
              className="absolute w-8 h-12 bg-gradient-to-t from-pink-400 to-pink-300 rounded-full origin-bottom"
              style={{
                transformOrigin: 'center bottom',
                left: '50%',
                bottom: '50%',
                marginLeft: '-1rem',
              }}
            />
          ))}
          
          {/* Center of flower */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, delay: delay + 2 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-yellow-400 rounded-full z-10"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Birthday;
