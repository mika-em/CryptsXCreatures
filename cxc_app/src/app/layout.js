import localFont from 'next/font/local';
import './globals.css';
import Navbar from './components/navbar';
import Footer from './components/footer';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata = {
  title: 'Crypts x Creatures',
  description: 'Welcome to Crypts x Creatures',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dracula">
      <body className="bg-base-100 text-base-content">
        <Navbar />
        <main className="flex-grow min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
