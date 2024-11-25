import './globals.css';
import Navbar from './components/navbar';
import Footer from './components/footer';
import { Toaster } from 'react-hot-toast';
import AppContent from './AppContent';
import { AuthProvider } from './context/authcontext';

export const metadata = {
  title: 'Crypts x Creatures',
  description: 'Welcome to Crypts x Creatures',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dracula">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Courier+Prime&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Special+Elite&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&family=Silkscreen&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-base-300 text-base-content flex flex-col min-h-screen">
        <AuthProvider>
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
          <Navbar />
          <main className="flex-1 container mx-auto px-4 py-8">
            <AppContent>{children}</AppContent>
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
