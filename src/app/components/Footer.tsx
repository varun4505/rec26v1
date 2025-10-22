"use client"
import React from 'react'
import { Instrument_Sans } from 'next/font/google'
import Link from 'next/link'
import { Instagram, Twitter, Facebook } from 'lucide-react'

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500"], 
  variable: "--font-instrument-sans", 
});

const Footer = () => {
  return (
    <footer className={`w-full py-6 px-8 md:px-12 bg-gradient-to-r from-[#FFF2EC] to-[#FFEEFC] ${instrumentSans.className}`}>
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex flex-col mb-6 md:mb-0">
          <h4 className="text-2xl font-medium text-[#1E1E1E] mb-4">VinnovateIT</h4>
          <div className="flex gap-4">
            <a href="https://www.instagram.com/vinnovateit/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <Instagram size={24} className="text-[#1E1E1E] hover:text-[#E1306C] transition-colors" />
            </a>
            <a href="https://x.com/v_innovate_it" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <Twitter size={24} className="text-[#1E1E1E] hover:text-[#1DA1F2] transition-colors" />
            </a>
            <a href="https://www.facebook.com/VinnovateIT/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <Facebook size={24} className="text-[#1E1E1E] hover:text-[#4267B2] transition-colors" />
            </a>
          </div>
        </div>
        
        <div className="max-w-md text-right">
          <h4 className="text-xl md:text-2xl font-normal text-[#1E1E1E]">
            Join us and be a part of the next big thing on campus
          </h4>
        </div>
      </div>
    </footer>
  )
}

export default Footer