import { SessionProvider, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './globals.css';

function ProtectedComponent({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) router.push('/login'); // Redirect to login if not signed in
  }, [session, status, router]);

  if (status === 'loading') return null;

  return children;
}

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

  const isLoginPage = Component.name === 'Login';

  return (
    <>
      <ToastContainer autoClose={2000} />
      <SessionProvider session={pageProps.session}>
        <Head />
        {isLoginPage ? (
          // Render login page without protection
          <Component {...pageProps} />
        ) : (
          // Protect all other pages
          <ProtectedComponent>
            <Component {...pageProps} />
          </ProtectedComponent>
        )}
      </SessionProvider>
    </>
  );
}

export default MyApp;
