// pages/_app.js
import { SessionProvider } from 'next-auth/react';
import { useEffect } from 'react';
import Head from 'next/head';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './globals.css';

function MyApp({ Component, pageProps }) {
  const pageTitle = 'PM2 UI';
  const pageDescription = 'PM2 Processes Dashboard';

  useEffect(() => {
    document.title = pageTitle;
    const metaDescription = document.createElement('meta');
    metaDescription.name = 'description';
    metaDescription.content = pageDescription;
    document.head.appendChild(metaDescription);
  }, []);

  return (
    <>
      {' '}
      <ToastContainer autoClose={2000} />
      <SessionProvider session={pageProps.session}>
        <Head />
        <Component {...pageProps} />
      </SessionProvider>
    </>
  );
}

export default MyApp;
