import './globals.css';
import Navbar from './components/navbar';
import Footer from './components/footer';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/authcontext';

export const metadata = {
  title: 'Crypts x Creatures',
  description: 'Welcome to Crypts x Creatures',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dracula">
      <body className="bg-base-300 text-base-content flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Toaster
            position="bottom-center"
            toastOptions={{
              duration: 4000,
              success: {
                style: {
                  background: '#2d2d2d',
                  color: '#86efac',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  textAlign: 'center',
                },
                icon: '🎉',
              },
              error: {
                style: {
                  background: '#2d2d2d',
                  color: '#f87171',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  textAlign: 'center',
                },
                icon: '🔔',
              },
            }}
          />
          <AuthProvider>{children}</AuthProvider>
        </main>
        <Footer />
      </body>
    </html>
  );
}
