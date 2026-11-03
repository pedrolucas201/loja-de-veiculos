// pages/_app.js
import '../styles/globals.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChakraProvider } from '@chakra-ui/react';
import Navbar from '../components/Navbar';
import { AuthProvider, useAuth } from '../contexts/AuthContext';

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <AppContent Component={Component} pageProps={pageProps} />
    </AuthProvider>
  );
}

function AppContent({ Component, pageProps }) {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center">
        Carregando...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white font-sans">
      <ChakraProvider>
        <Navbar isAdmin={isAdmin} />
        <Component {...pageProps} />
      </ChakraProvider>
    </div>
  );
}