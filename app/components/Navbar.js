"use client";

import React, { useState, useEffect, useRef } from "react";
import { Github, Instagram, Mail, Linkedin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import Image from "next/image";
import Link from "next/link";

const MainNavbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  // Initial section set to 'home' or equivalent if the user starts at the top
  const [activeSection, setActiveSection] = useState(''); 
  const navRef = useRef(null);
  const sidebarRef = useRef(null);
  const socialIconsRef = useRef(null);

  // --- Utility Hooks ---

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    // Target relevant sections for active link highlighting
    const sections = document.querySelectorAll('#home, #aboutus, #domains, #events, #projects, #board');
    
    const observer = new IntersectionObserver(
      (entries) => {
        let visibleSection = '';
        let maxRatio = 0;
        
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            visibleSection = entry.target.id;
          }
        });
        
        if (visibleSection) {
          setActiveSection(visibleSection);
        } else if (window.scrollY < 200) {
          // Fallback for when no specific section is fully visible (top of page)
          setActiveSection('home');
        }
      },
      {
        threshold: [0, 0.25, 0.5, 0.75, 1],
        rootMargin: '-100px 0px -100px 0px' 
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  useEffect(() => {
    initAnimations();
  }, []);

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isDrawerOpen]);

  const initAnimations = () => {
    if (navRef.current) {
      gsap.fromTo(
        navRef.current,
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
      );
    }
  };

  const toggleDrawer = () => {
    setIsDrawerOpen((prev) => !prev);
    if (!isDrawerOpen && sidebarRef.current) {
      gsap.fromTo(
        sidebarRef.current,
        { y: "-100vh", opacity: 0 },
        {
          y: "0vh",
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
          onComplete: () => {
            const links = sidebarRef.current?.querySelectorAll(".sidebar-link");
            if (links) {
              gsap.fromTo(
                links,
                { y: 50, opacity: 0 },
                {
                  y: 0,
                  opacity: 1,
                  duration: 0.5,
                  stagger: 0.1,
                  ease: "power2.out",
                }
              );
            }
          },
        }
      );
    }
  };

  const handleNavClick = (e, href) => {
    e.preventDefault();
    const targetSection = document.querySelector(href);
    if (targetSection) {
      targetSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    if (isDrawerOpen) {
      setIsDrawerOpen(false);
    }
  };
  
  // --- Data ---

  const socialLinks = [
    {
      icon: <Github size={20} />,
      href: "https://github.com/VinnovateIT/",
      hoverColor: "hover:text-purple-400",
    },
    {
      icon: <Instagram size={20} />,
      href: "https://www.instagram.com/vinnovateit/?hl=en",
      hoverColor: "hover:text-fuchsia-500",
    },
    {
      icon: <Linkedin size={20} />,
      href: "https://www.linkedin.com/company/v-innovate-it/?originalSubdomain=in",
      hoverColor: "hover:text-purple-400",
    },
    {
      icon: <Mail size={20} />,
      href: "mailto:vinnovateit@gmail.com",
      hoverColor: "hover:text-fuchsia-500",
    },
  ];

  const navigationLinks = [
    { href: "#home", text: "Home", sectionId: "home" },
    { href: "#about", text: "About", sectionId: "about" },
    { href: "#domains", text: "Domains", sectionId: "domains" },
  ];

  // Helper to check if the current link should be active (including "Home" at the start)
  const isActive = (sectionId) => {
    // Check if the actual section ID matches the active one
    const isCurrentSection = activeSection === sectionId; 
    // Check if we are at the very top and the link is 'home' (using #home as a safe ID)
    const isHomeAtTop = (sectionId === 'home' || sectionId === '#home') && !activeSection; 
    return isCurrentSection || isHomeAtTop;
  }

  // --- Styles derived from your images ---

  // Orange button style (from image_f0bea4.png)
  const SIGN_IN_BUTTON_STYLE = {
    backgroundColor: 'rgba(248, 104, 0, 0.66)', // #F86800 at 66%
    boxShadow: `
      3px 0px 71.5px 26px rgba(248, 104, 0, 0.3), 
      0px 0px 50.9px 19px rgba(0, 0, 0, 0.1)
    `,
  };

  // Main Navbar Glass Style (from image_f0bbd9.png)
  const NAVBAR_GLASS_STYLE = {
    // Background color: #000000 at 11% opacity
    backgroundColor: 'rgba(0, 0, 0, 0.11)', 
    // Overall Dark Shadow: #000000 at 10%, X=0, Y=0, Blur=50.9, Spread=19
    boxShadow: `0px 0px 50.9px 19px rgba(0, 0, 0, 0.1)`,
  };

  return (
    <> 
      {/* Main Navbar */}
      <nav 
        ref={navRef} 
        className="z-[100] fixed top-4 left-1/2 transform -translate-x-1/2 w-[95%] lg:w-2/3 max-w-4xl rounded-full px-4 sm:px-6 opacity-0"
      >
        {/* Container for the Glassmorphism and Shadow */}
        <div 
          className="relative rounded-full border border-white/20 p-2 sm:p-3 flex items-center justify-between" 
          style={NAVBAR_GLASS_STYLE} 
        >
          {/* Glassmorphism backdrop: Subtle grey background with strong blur */}
          <div className="absolute inset-0 backdrop-blur-xl rounded-full" /> 
          
          {/* Content Wrapper: Logo Left, Links Centered, Button Right */}
          <div className="relative w-full flex items-center justify-between"> 
            
            {/* 1. Logo Section (Left) */}
            <div className="flex items-center z-20">
              <Link href="#home" onClick={(e) => handleNavClick(e, '#home')}>
                <Image
                  // --- CORRECTED LOGO PATH ---
                  src="/whiteLogoViit.svg" 
                  alt="VinnovateIT Logo"
                  width={isMobile ? 80 : 120} // Adjusted size
                  height={isMobile ? 30 : 40} // Added a fixed height for proper Next/Image rendering
                  priority
                  // No filter/invert needed, assuming the SVG file is dark as seen in your image
                />
              </Link>
            </div>

            {/* 2. Desktop Navigation Links (Center) */}
            <div className="hidden lg:flex items-center justify-center flex-1 z-20">
              <div className="flex items-center gap-10"> {/* Used gap-10 for equal spacing */}
                {navigationLinks.map((link, index) => (
                  <div key={index} className="relative">
                    <a
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className={`transition-colors font-medium text-lg tracking-wide cursor-pointer text-gray-800 hover:text-orange-500`}
                    >
                      {link.text}
                    </a>
                    {/* Underline indicator */}
                    {isActive(link.sectionId.replace('#', '')) && (
                      <motion.div
                        layoutId="nav-underline"
                        className="absolute bottom-[-4px] left-0 w-full h-[3px] bg-gray-500 rounded"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Sign In Button and Hamburger (Right) */}
            <div className="flex items-center space-x-4 z-20">
                {/* Sign In Button - Desktop (Right) */}
                <Link href="#signup" onClick={(e) => handleNavClick(e, '#signup')} className="hidden lg:block">
                    <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={SIGN_IN_BUTTON_STYLE}
                    className="px-12 py-2 text-black font-medium rounded-full text-lg whitespace-nowrap transition-all duration-300"
                    >
                    Sign In
                    </motion.button>
                </Link>

                {/* Mobile and tablet hamburger menu */}
                <div className="lg:hidden">
                    <button 
                        onClick={toggleDrawer} 
                        className="p-1 flex flex-col items-center justify-center w-6 h-6 space-y-0.5 relative z-10"
                        aria-label="Toggle Menu"
                    >
                        {/* Hamburger lines with dark color for light navbar */}
                        <motion.div 
                        className="w-6 h-0.5 bg-gray-800 origin-center"
                        animate={isDrawerOpen ? { rotate: 45, y: 2 } : { rotate: 0, y: 0 }}
                        transition={{ duration: 0.3 }}
                        />
                        <motion.div 
                        className="w-6 h-0.5 bg-gray-800"
                        animate={isDrawerOpen ? { opacity: 0 } : { opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        />
                        <motion.div 
                        className="w-6 h-0.5 bg-gray-800 origin-center"
                        animate={isDrawerOpen ? { rotate: -45, y: -2 } : { rotate: 0, y: 0 }}
                        transition={{ duration: 0.3 }}
                        />
                    </button>
                </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer (Kept as is for full functionality) */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 z-[500]"
              onClick={toggleDrawer}
            />
            
            <motion.div
              ref={sidebarRef}
              initial={{ y: "-100vh" }}
              animate={{ y: "0vh" }}
              exit={{ y: "-100vh" }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="fixed top-0 left-0 w-full h-full text-white z-[600] overflow-hidden"
            >
              <div className="absolute inset-0 backdrop-blur-md bg-black/80" />
              <div className="absolute inset-0 bg-gradient-to-b from-purple-900/50 via-black/80 to-purple-900/50" />
              
              <div className="relative h-full flex flex-col">
                <div className="flex justify-between items-center p-4 sm:p-6 pt-8 sm:pt-12">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex items-center"
                  >
                    <Image
                      src="/whiteLogoViit.svg"
                      alt="VIIT Logo"
                      width={80}
                      height={80}
                      priority
                      className="sm:w-24 sm:h-24"
                    />
                  </motion.div>
                  
                  <motion.button 
                    onClick={toggleDrawer} 
                    className="p-2 sm:p-3 hover:bg-purple-900/30 rounded-full transition-colors backdrop-blur-sm bg-white/10 border border-white/20"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <svg 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      className="text-white sm:w-6 sm:h-6"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </motion.button>
                </div>

                <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6">
                  <div className="space-y-6 sm:space-y-8 md:space-y-10 text-center">
                    {navigationLinks.map((link, index) => {
                      const sectionId = link.href.replace('#', '');
                      const isActiveLink = activeSection === sectionId;
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 50 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                        >
                          <a
                            href={link.href}
                            onClick={(e) => handleNavClick(e, link.href)}
                            className={`sidebar-link block font-medium text-xl sm:text-2xl md:text-3xl lg:text-4xl py-3 sm:py-4 px-4 sm:px-6 md:px-8 rounded-xl transition-all tracking-wider hover:bg-purple-900/20 hover:scale-105 cursor-pointer font-orbitron ${
                              isActiveLink 
                                ? 'text-purple-400 bg-purple-900/30 scale-105' 
                                : 'hover:text-purple-400'
                            }`}
                          >
                            {link.text}
                          </a>
                        </motion.div>
                      );
                    })}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 + navigationLinks.length * 0.1 }}
                    >
                        <Link href="#signup" onClick={(e) => handleNavClick(e, '#signup')}>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                style={SIGN_IN_BUTTON_STYLE}
                                className="w-full mt-4 px-8 py-4 text-white font-semibold rounded-full text-2xl transition-all duration-300"
                            >
                                Sign In
                            </motion.button>
                        </Link>
                    </motion.div>
                  </div>
                </div>

                <motion.div 
                  className="px-4 sm:px-6 py-8 sm:py-10 md:py-12 border-t border-purple-500/20"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <p className="text-sm sm:text-base md:text-lg text-gray-300 text-center mb-4 sm:mb-6 md:mb-8 font-orbitron">Connect with us</p>
                  <div className="flex space-x-6 sm:space-x-8 md:space-x-10 justify-center">
                    {socialLinks.map((social, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 1 + index * 0.1 }}
                      >
                        <Link
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`text-white ${social.hoverColor} transition-all transform hover:scale-125 p-3 sm:p-4 rounded-full hover:bg-purple-900/30 block`}
                        >
                          <div className="text-lg sm:text-xl">
                            {social.icon}
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MainNavbar;