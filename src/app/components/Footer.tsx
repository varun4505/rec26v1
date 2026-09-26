"use client"
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Github, Linkedin } from 'lucide-react';
import { FaInstagram, FaXTwitter } from 'react-icons/fa6';
import { geistMono, geistSans } from '../landing/fonts';

const iconClass = "text-[#7d8187] hover:text-white transition-colors"

const Footer = () => {
  return (
    <footer className={`w-full bg-[#141414] border-t border-[#212327] text-white ${geistSans.className}`}>
      <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-8 px-6 py-10 md:flex-row md:items-end md:px-[clamp(57px,10vw,113px)]">
        <div className="flex flex-col items-center md:items-start">
          <div className="mb-5">
            <Image
              src="/assets/images/vinnovateit_white.svg"
              alt="VinnovateIT Logo"
              width={140}
              height={45}
              className="h-11 w-auto opacity-90"
            />
          </div>
          <div className="flex justify-center md:justify-start gap-5">
            <Link
              href="https://www.instagram.com/vinnovateit/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram size={22} className={iconClass} />
            </Link>
            <Link
              href="https://twitter.com/v_innovate_it"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <FaXTwitter size={22} className={iconClass} />
            </Link>
            <Link
              href="https://www.facebook.com/VinnovateIT/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <Facebook size={22} strokeWidth={1.75} className={iconClass} />
            </Link>
            <Link
              href="https://github.com/vinnovateit"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <Github size={22} strokeWidth={1.75} className={iconClass} />
            </Link>
            <Link
              href="https://www.linkedin.com/company/v-innovate-it"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <Linkedin size={22} strokeWidth={1.75} className={iconClass} />
            </Link>
          </div>
        </div>

        <div className="md:max-w-md text-center md:text-right">
          <p className={`mb-3 text-[11px] uppercase tracking-[0.12em] text-[#7d8187] ${geistMono.className}`}>
            VinnovateIT · always in build mode
          </p>
          <h2 className="text-[26px] font-medium leading-[1.15] tracking-[-0.02em] text-[#dadbdf]">
            Join us and be a part of the next big thing on campus
          </h2>
        </div>
      </div>
    </footer>
  )
}

export default Footer
