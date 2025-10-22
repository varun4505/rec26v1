"use client"
import React from 'react'
import { Instrument_Sans, Khand } from 'next/font/google'
import Link from 'next/link'
import Image from 'next/image'
import { Instagram, Twitter, Facebook } from 'lucide-react'

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500"], 
  variable: "--font-instrument-sans", 
});

const khandFont = Khand({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-khand",
});

const Footer = () => {
  return (
    <footer className={`w-full py-8 px-8 md:px-16 bg-gradient-to-r from-[#FFF2EC] to-[#FFEEFC] ${instrumentSans.className}`}>
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex flex-col">
          <div className="mb-4">
            <Image 
              src="/blackLogoViit.svg" 
              alt="VinnovateIT Logo" 
              width={120}
              height={40}
              className="h-10 w-auto"
            />
          </div>
          <div className="flex gap-6">
            <Link href="https://www.instagram.com/vinnovateit/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <Instagram size={28} strokeWidth={1.5} className="text-[#1E1E1E] hover:text-[#E1306C] transition-colors" />
            </Link>
            <Link href="https://twitter.com/v_innovate_it" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <Twitter size={28} strokeWidth={1.5} className="text-[#1E1E1E] hover:text-[#1DA1F2] transition-colors" />
            </Link>
            <Link href="https://www.facebook.com/VinnovateIT/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <Facebook size={28} strokeWidth={1.5} className="text-[#1E1E1E] hover:text-[#4267B2] transition-colors" />
            </Link>
          </div>
        </div>
        
        <div className="md:max-w-md md:text-right">
          <h2 className={`text-[36px] leading-[100%] tracking-[0.01em] text-right text-[#1E1E1E] ${khandFont.className}`}>
            Join us and be a part of the next big thing on campus
          </h2>
        </div>
      </div>
    </footer>
  )
}

export default Footer