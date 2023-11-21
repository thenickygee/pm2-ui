import AppCard from './components/appCard';
import Navbar from './components/nav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDashboard } from '@fortawesome/free-solid-svg-icons';
import Footer from './components/footer';

export default function Home({ session }) {
  return (
    <>
      <div className='min-h-screen bg-zinc-900 pt-14'>
        <Navbar />
        <div className='flex flex-col items-center justify-center align-middle'>
          <AppCard />
        </div>
      </div>
      <Footer />
    </>
  );
}
