"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function FooterConditional() {
  const pathname = usePathname();

  // Only render footer on the homepage root path
  if (pathname === "/" || pathname === "") {
    return <Footer />;
  }

  return null;
}
