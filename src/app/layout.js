import { Kantumruy_Pro } from "next/font/google";
import "./globals.css";

const kantumruy = Kantumruy_Pro({
  variable: "--font-sans",
  subsets: ["khmer", "latin"],
});

export const metadata = {
  title: "អនាគតល្អ Good Future",
  description: "ប្រព័ន្ធគ្រប់គ្រងសាលារៀន",
};

export default function RootLayout({ children }) {
  return (
    <html lang="km" className={`${kantumruy.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans text-brand-text bg-brand-bg">{children}</body>
    </html>
  );
}
