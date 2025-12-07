import type { Metadata } from "next";
import localFont from "next/font/local";
import { Khand } from "next/font/google";
import "./globals.css";
import MainNavbar from './components/Navbar';
import Footer from './components/Footer';

const arrayFont = localFont({
  src: [
    {
      path: "../../public/fonts/array/Array-Regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-array",
  display: "swap",
});

const khandFont = Khand({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-khand",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VinnovateIT Recruitments",
  description: "The next step advancement in your career",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${arrayFont.variable} ${khandFont.variable} antialiased font-khand flex flex-col min-h-screen`}
      >
        <MainNavbar />
        <div className="flex-grow">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
