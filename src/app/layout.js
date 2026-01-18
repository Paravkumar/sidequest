import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider"; // Ensure this path matches your project structure

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Side Quest",
  description: "The decentralized economy for students.",
  // --- FORCE FAVICON HERE ---
  icons: {
    icon: '/icon.png', // Looks in public/icon.png
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
  // --------------------------
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-950 text-white`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}