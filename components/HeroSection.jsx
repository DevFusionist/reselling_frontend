import React from 'react';
import { motion } from 'framer-motion';
import { Twitter, Instagram, Youtube, ShoppingCart } from 'lucide-react';

// Simplified SVG for the background wave/organic curve
const BackgroundCurve = () => (
  <svg
    className="absolute -top-1/4 left-1/2 w-[200%] h-[150%] transform -translate-x-1/2"
    viewBox="0 0 1000 700"
    preserveAspectRatio="none"
  >
    <path
      d="M0,350 Q250,150 500,350 T1000,350 L1000,700 L0,700 Z"
      fill="#F8F8FF" // Off-white/light-grey background color
      opacity="1"
    />
  </svg>
);

const HeroSection = ({ navigate }) => {
  const transition = { duration: 1.0, type: "spring", stiffness: 100 };
  
  return (
    <section className="relative min-h-[95vh] bg-white overflow-hidden flex items-center">
      
      {/* 1. Background Organic Curve (Off-white) */}
      <BackgroundCurve />

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side - Content & Typography */}
          <motion.div
            className="space-y-6 md:space-y-8 lg:space-y-10"
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={transition}
          >
            {/* Main Heading */}
            <div className="space-y-2">
              <motion.p
                className="text-xl font-semibold text-royal-blue"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                PREMIUM E-COMMERCE COLLECTION
              </motion.p>
              <motion.h1
                className="text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter leading-none"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <span className="text-gray-900">SHOPPING</span>
                <br />
                <span className="text-bright-orange">SUPER SALE</span>
              </motion.h1>
            </div>

            {/* Description Text */}
            <motion.p
              className="text-lg text-gray-600 max-w-lg leading-relaxed border-l-4 border-royal-blue pl-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Discover premium technology and curated products at unbeatable prices. Experience the perfect blend of elegance and innovation with our exclusive collection.
            </motion.p>

            {/* Call to Action Button */}
            <motion.button
              onClick={() => navigate('shop')}
              className="px-10 py-4 bg-bright-orange text-white font-bold rounded-full text-xl transition duration-300 shadow-xl hover:bg-red-accent flex items-center gap-3"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(255, 120, 0, 0.4)" }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingCart size={24} /> 
              SHOP NOW
            </motion.button>
          </motion.div>

          {/* Right Side - Floating Visuals and Abstract Shapes */}
          <motion.div
            className="relative h-[550px] lg:h-[650px] w-full flex justify-center items-center"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={transition}
          >
            {/* 2. Abstract Geometric Shapes */}
            
            {/* Royal Blue Semi-Circle Blob */}
            <motion.div
              className="absolute top-10 -left-10 w-48 h-48 bg-royal-blue/10 rounded-full blur-xl"
              animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
            />
            
            {/* Bright Orange Ring */}
            <motion.div
              className="absolute bottom-20 right-10 w-32 h-32 border-4 border-bright-orange/40 rounded-full"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            />
            
            {/* Red Accent Dot Pattern */}
            <div className="absolute top-1/4 left-10 w-24 h-24 text-red-accent opacity-50">
              {/* Simple Dotted Grid */}
              <svg className="w-full h-full" viewBox="0 0 100 100">
                  {Array.from({ length: 9 }).map((_, i) => (
                      <circle key={i} cx={((i % 3) * 30) + 10} cy={(Math.floor(i / 3) * 30) + 10} r="3" fill="currentColor" />
                  ))}
              </svg>
            </div>
            
            {/* Floating Plus Sign (Royal Blue) */}
            <motion.div
              className="absolute top-1/3 right-0 text-royal-blue text-5xl font-light"
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
              +
            </motion.div>
            
            {/* 3. Floating Circular Product Images */}
            
            {/* Top Product (Phone/Tech) */}
            <motion.div
              className="absolute top-10 right-10 w-72 h-72 rounded-full overflow-hidden border-4 border-white shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] z-30"
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0, y: [0, -15, 0] }}
              transition={{ ...transition, delay: 0.8, duration: 1.5 }}
            >
              <img
                src="/images/watch.jpg" // Ensure this path is correct
                alt="Premium Phone Product"
                className="w-full h-full object-cover scale-[1.1]" // Slightly scaled to fill the circle better
              />
            </motion.div>

            {/* Bottom Product (Speaker/Accessory) */}
            <motion.div
              className="absolute bottom-10 left-10 w-64 h-64 rounded-full overflow-hidden border-4 border-white shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)] z-30"
              initial={{ scale: 0, rotate: 45 }}
              animate={{ scale: 1, rotate: 0, y: [0, 15, 0] }}
              transition={{ ...transition, delay: 1.0, duration: 1.5 }}
            >
              <img
                src="/images/speaker.jpg" // Ensure this path is correct
                alt="Premium Speaker Product"
                className="w-full h-full object-cover scale-[1.1]"
              />
            </motion.div>

            {/* Ribbon Tag (SALE) */}
            <motion.div
              className="absolute bottom-1/4 right-0 bg-red-accent text-white px-5 py-2 text-md font-bold transform -rotate-12 shadow-xl z-40"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...transition, delay: 1.5 }}
            >
              <span className="font-mono">🔥 40% OFF</span>
            </motion.div>
            
          </motion.div>
        </div>
      </div>
      
      {/* Footer Social Icons - Stylized */}
      <motion.div
          className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-4 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg z-30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
      >
        {[Twitter, Instagram, Youtube].map((Icon, index) => (
          <motion.a
            key={index}
            href="#"
            className="w-10 h-10 rounded-full bg-royal-blue flex items-center justify-center text-white hover:bg-bright-orange transition duration-200"
            whileHover={{ scale: 1.1, rotate: index % 2 === 0 ? 5 : -5 }}
            whileTap={{ scale: 0.9 }}
          >
            <Icon size={20} />
          </motion.a>
        ))}
      </motion.div>
      
      {/* Tailwind Custom Color Classes (Requires Configuration) */}
      <style jsx global>{`
        .text-royal-blue { color: #4169E1; }
        .bg-royal-blue { background-color: #4169E1; }
        .border-royal-blue { border-color: #4169E1; }
        .text-bright-orange { color: #FF7800; }
        .bg-bright-orange { background-color: #FF7800; }
        .text-red-accent { color: #DC143C; }
        .bg-red-accent { background-color: #DC143C; }
      `}</style>
    </section>
  );
};

export default HeroSection;