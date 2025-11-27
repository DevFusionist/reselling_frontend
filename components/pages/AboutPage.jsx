'use client';
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const AboutPage = () => {
    useEffect(() => { window.scrollTo(0, 0); }, []);
  
    const textVariant = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };
    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="lg:text-center">
                <motion.p 
                    className="text-base font-semibold text-indigo-600 uppercase tracking-wide"
                    variants={textVariant} initial="hidden" animate="visible" transition={{ duration: 0.5 }}
                >
                    Our Philosophy
                </motion.p>
                <motion.h1 
                    className="mt-2 text-6xl font-extrabold text-gray-900 tracking-tighter sm:text-7xl"
                    variants={textVariant} initial="hidden" animate="visible" transition={{ duration: 0.5, delay: 0.2 }}
                >
                    The Ethos Manifesto
                </motion.h1>
                <motion.p 
                    className="mt-4 text-2xl text-gray-500"
                    variants={textVariant} initial="hidden" animate="visible" transition={{ duration: 0.5, delay: 0.4 }}
                >
                    We believe the most advanced technology is the one you forget you're using.
                </motion.p>
            </div>
  
            <div className="mt-20 lg:grid lg:grid-cols-3 lg:gap-16">
                {[{
                    title: "Design First, Tech Second",
                    description: "Inspired by Ray-Ban's timeless frames, our commitment is to aesthetic integrity. Technology serves the design; it never dictates it. We build products that are first pieces of art, and second, powerful devices."
                }, {
                    title: "The Invisible Interface",
                    description: "Drawing on Meta's vision of ambient computing, we create interfaces that exist only when needed. Information is delivered contextually, silently, and privately, allowing you to remain fully present."
                }, {
                    title: "The Luxury of Time",
                    description: "Much like OKA's focus on curated, lasting pieces, our products are built for longevity. We reject obsolescence, offering modular upgrades and premium materials that improve with age, not degrade."
                }].map((item, index) => (
                    <motion.div
                        key={index}
                        className={`mt-12 lg:mt-0`}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.6, delay: index * 0.2 }}
                    >
                        <h2 className="text-3xl font-bold text-gray-900">
                            {item.title}
                        </h2>
                        <p className="mt-4 text-lg text-gray-600">
                            {item.description}
                        </p>
                    </motion.div>
                ))}
            </div>
  
            <div className="mt-20 text-center pt-16 border-t border-gray-100">
                <motion.p 
                    className="text-2xl font-black text-gray-900"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                >
                    Ethos: Elegant Technology. Essential Living.
                </motion.p>
            </div>
        </main>
    );
};

export default AboutPage;
