import React from 'react';
import './globals.css';

export const metadata = {
  title: 'Trading Bot Dashboard',
  description: 'Real-time monitoring for your trading bot',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black antialiased">{children}</body>
    </html>
  );
}
