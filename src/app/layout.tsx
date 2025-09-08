import { ToastContainer } from "react-toastify";
import ThemeRegistry from "./ThemeRegistry";
import "react-toastify/dist/ReactToastify.css";
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
        <ThemeRegistry options={{ key: "joy" }}>{children}</ThemeRegistry>
        <ToastContainer />
      </body>
    </html>
  );
}
