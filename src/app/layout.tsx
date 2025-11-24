"use client";
import ClientRoot from "./ClientRoot";
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['500','600', '700', '800'], 
  display: 'swap',
  variable: '--font-montserrat',
});


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <ClientRoot>{children}</ClientRoot>
      </body>
    </html>
  );
}
