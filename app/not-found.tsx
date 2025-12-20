'use client';

import { motion, useSpring } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

export default function NotFound() {
  const router = useRouter();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isHoveringButton, setIsHoveringButton] = useState(false);
  const [isHovering404, setIsHovering404] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Smooth spring animations for cursor following
  const cursorX = useSpring(0, { stiffness: 500, damping: 28 });
  const cursorY = useSpring(0, { stiffness: 500, damping: 28 });
  const cursorScale = useSpring(1, { stiffness: 500, damping: 28 });
  const cursorOpacity = useSpring(1, { stiffness: 500, damping: 28 });

  // Trailing cursor positions for smooth effect
  const [trailPositions, setTrailPositions] = useState<Array<{ x: number; y: number }>>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      
      cursorX.set(x);
      cursorY.set(y);

      // Update trail positions
      setTrailPositions((prev) => {
        const newTrail = [{ x, y }, ...prev.slice(0, 4)];
        return newTrail;
      });

      // Parallax effect for main content
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 40,
        y: (e.clientY / window.innerHeight - 0.5) * 40,
      });
    };

    const handleMouseEnter = () => {
      cursorOpacity.set(1);
    };

    const handleMouseLeave = () => {
      cursorOpacity.set(0);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [cursorX, cursorY, cursorOpacity]);

  // Update cursor scale based on hover states
  useEffect(() => {
    if (isHoveringButton) {
      cursorScale.set(2);
    } else if (isHovering404) {
      cursorScale.set(1.5);
    } else {
      cursorScale.set(1);
    }
  }, [isHoveringButton, isHovering404, cursorScale]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1.0],
      },
    },
  };

  const numberVariants = {
    hidden: { opacity: 0, scale: 0.5, rotate: -180 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 15,
        duration: 1,
      },
    },
  };

  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const glowVariants = {
    animate: {
      opacity: [0.3, 0.6, 0.3],
      scale: [1, 1.1, 1],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  // Hide default cursor
  useEffect(() => {
    document.body.style.cursor = 'none';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, []);

  return (
    <div 
        ref={containerRef}
        className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#10141D]"
      >
        {/* Custom Cursor - Main */}
        <motion.div
          className="fixed pointer-events-none z-[9999]"
          style={{
            left: cursorX,
            top: cursorY,
            x: '-50%',
            y: '-50%',
            scale: cursorScale,
            opacity: cursorOpacity,
          }}
        >
          {/* Outer pulsing ring */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: '50px',
              height: '50px',
              left: '50%',
              top: '50%',
              x: '-50%',
              y: '-50%',
              border: '2px solid rgba(199, 90, 56, 0.4)',
              boxShadow: '0 0 30px rgba(199, 90, 56, 0.4)',
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          
          {/* Middle ring */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: '30px',
              height: '30px',
              left: '50%',
              top: '50%',
              x: '-50%',
              y: '-50%',
              border: '2px solid #C75A38',
              boxShadow: '0 0 20px rgba(199, 90, 56, 0.6), 0 0 40px rgba(199, 90, 56, 0.3)',
            }}
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
          
          {/* Inner glowing dot */}
          <motion.div
            className="absolute rounded-full bg-[#C75A38]"
            style={{
              width: '10px',
              height: '10px',
              left: '50%',
              top: '50%',
              x: '-50%',
              y: '-50%',
              boxShadow: '0 0 15px rgba(199, 90, 56, 1), 0 0 30px rgba(199, 90, 56, 0.6)',
            }}
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          
          {/* Hover effect - expanding ripple */}
          {isHoveringButton && (
            <>
              <motion.div
                className="absolute rounded-full border-2 border-[#C75A38]"
                style={{
                  width: '40px',
                  height: '40px',
                  left: '50%',
                  top: '50%',
                  x: '-50%',
                  y: '-50%',
                }}
                initial={{ scale: 0.8, opacity: 0.8 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
              <motion.div
                className="absolute rounded-full border-2 border-[#A3A7B8]"
                style={{
                  width: '40px',
                  height: '40px',
                  left: '50%',
                  top: '50%',
                  x: '-50%',
                  y: '-50%',
                }}
                initial={{ scale: 0.8, opacity: 0.6 }}
                animate={{ scale: 2.5, opacity: 0 }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
              />
            </>
          )}
        </motion.div>

      {/* Cursor Trail - Multiple trailing elements */}
      {trailPositions.map((pos, index) => (
        <motion.div
          key={index}
          className="fixed pointer-events-none z-[9998]"
          style={{
            left: pos.x,
            top: pos.y,
            x: '-50%',
            y: '-50%',
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.3, 0.1, 0],
            scale: [0.8, 0.4, 0],
          }}
          transition={{
            duration: 0.5,
            delay: index * 0.1,
            ease: 'easeOut',
          }}
        >
          <div
            className="rounded-full bg-[#C75A38]"
            style={{
              width: `${8 - index * 1.5}px`,
              height: `${8 - index * 1.5}px`,
              opacity: 0.4 - index * 0.1,
            }}
          />
        </motion.div>
      ))}
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, rgba(199, 90, 56, 0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 50%, rgba(199, 90, 56, 0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 50% 20%, rgba(199, 90, 56, 0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 50%, rgba(199, 90, 56, 0.3) 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-[#C75A38] opacity-30"
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + (i % 3) * 20}%`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.sin(i) * 50, 0],
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.3,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Main content */}
      <motion.div
        className="relative z-10 text-center px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
        }}
      >
        {/* Glowing orb behind 404 */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          variants={glowVariants}
          animate="animate"
        >
          <div className="w-96 h-96 rounded-full bg-gradient-to-r from-[#C75A38]/20 to-[#A3A7B8]/20 blur-3xl" />
        </motion.div>

        {/* 404 Number */}
        <motion.div
          className="relative mb-8"
          variants={numberVariants}
        >
          <motion.h1
            className="text-[180px] md:text-[240px] font-bold font-[var(--font-cormorant-garamond)] text-transparent bg-clip-text leading-none cursor-none relative"
            onMouseEnter={() => {
              setIsHovering(true);
              setIsHovering404(true);
            }}
            onMouseLeave={() => {
              setIsHovering(false);
              setIsHovering404(false);
            }}
            animate={
              isHovering
                ? {
                    backgroundPosition: ['0%', '100%', '200%', '300%', '0%'],
                    scale: 1.05,
                    filter: 'brightness(1.3)',
                  }
                : {
                    backgroundPosition: ['0%', '100%', '0%'],
                    scale: 1,
                    filter: 'brightness(1)',
                  }
            }
            transition={
              isHovering
                ? {
                    backgroundPosition: {
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    },
                    scale: {
                      duration: 0.3,
                      ease: 'easeOut',
                    },
                    filter: {
                      duration: 0.3,
                      ease: 'easeOut',
                    },
                  }
                : {
                    backgroundPosition: {
                      duration: 5,
                      repeat: Infinity,
                      ease: 'linear',
                    },
                    scale: {
                      duration: 0.3,
                      ease: 'easeOut',
                    },
                    filter: {
                      duration: 0.3,
                      ease: 'easeOut',
                    },
                  }
            }
            style={{
              backgroundSize: isHovering ? '400% 100%' : '200% 100%',
              backgroundImage: isHovering
                ? 'linear-gradient(90deg, #F0EAD6 0%, #C75A38 15%, #A3A7B8 30%, #C75A38 45%, #F0EAD6 60%, #C75A38 75%, #A3A7B8 90%, #C75A38 100%)'
                : 'linear-gradient(90deg, #F0EAD6 0%, #C75A38 50%, #F0EAD6 100%)',
            }}
          >
            404
          </motion.h1>
        </motion.div>

        {/* Title */}
        <motion.h2
          className="text-4xl md:text-5xl font-semibold font-[var(--font-cormorant-garamond)] text-[#F0EAD6] mb-4"
          variants={itemVariants}
        >
          Page Not Found
        </motion.h2>

        {/* Description */}
        <motion.p
          className="text-lg md:text-xl text-[#A3A7B8] mb-12 max-w-md mx-auto"
          variants={itemVariants}
        >
          The page you're looking for seems to have vanished into the void.
          Let's guide you back to elegance.
        </motion.p>

        {/* Action buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center relative z-20"
          variants={itemVariants}
        >
          <motion.button
            onClick={() => router.push('/')}
            className="px-8 py-4 bg-[#C75A38] text-[#F0EAD6] rounded-lg font-medium font-[var(--font-poppins)] text-lg relative overflow-hidden group z-20 cursor-none"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => setIsHoveringButton(true)}
            onMouseLeave={() => setIsHoveringButton(false)}
          >
            <motion.span
              className="relative z-10"
              initial={{ x: 0 }}
              whileHover={{ x: -5 }}
            >
              Return Home
            </motion.span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-[#C75A38] to-[#A3A7B8] opacity-0 group-hover:opacity-100 pointer-events-none"
              initial={{ x: '-100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>

          <motion.button
            onClick={() => {
              if (window.history.length > 1) {
                router.back();
              } else {
                router.push('/');
              }
            }}
            className="px-8 py-4 border-2 border-[#A3A7B8] text-[#A3A7B8] rounded-lg font-medium font-[var(--font-poppins)] text-lg hover:border-[#C75A38] hover:text-[#C75A38] transition-colors relative z-20 cursor-none"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => setIsHoveringButton(true)}
            onMouseLeave={() => setIsHoveringButton(false)}
          >
            Go Back
          </motion.button>
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          className="absolute -left-20 top-1/2 w-40 h-40 border border-[#A3A7B8]/20 rounded-full pointer-events-none"
          variants={floatingVariants}
          animate="animate"
        />
        <motion.div
          className="absolute -right-20 top-1/2 w-32 h-32 border border-[#C75A38]/20 rounded-full pointer-events-none"
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: 1 }}
        />
      </motion.div>

      {/* Animated grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(199, 90, 56, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(199, 90, 56, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>
    </div>
  );
}

