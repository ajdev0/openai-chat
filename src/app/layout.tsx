import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Techy Chat",
  description: "Software ai chat assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="flex min-h-screen items-center justify-center">
          <div className="chat w-[90vw] h-[90vh] flex justify-center items-center bg-[#131e25]/10 backdrop-blur rounded border border-white/10">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
