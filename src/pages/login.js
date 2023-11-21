// pages/login.js
// import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { faArrowAltCircleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import Navbar from './components/nav';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      router.push('/');
      console.log('logged in');
    } else {
      setError('Failed to login. Check your username and password.');
    }
  };

  const isFormFilled = username !== '' && password !== '';
  const buttonClass = `p-1 px-3 flex h-min justify-center items-center font-bold text-white rounded-md bg-gradient-to-r from-blue-400 to-blue-500 hover:bg-blue-300 ${
    isFormFilled ? '' : 'opacity-50'
  }`;

  return (
    <div className='min-h-screen min-w-screen bg-zinc-800 text-white'>
      <Navbar />
      <div className='pt-20'>
        <div className='flex flex-col gap-2 p-6 px-20 rounded-md shadow-xl justify-center items-center bg-zinc-700 max-w-xl align-middle mx-auto'>
          <div className='flex flex-col gap-2 pb-4'>
            <Image
              src='/pm2.logo.png'
              alt='wordstamp'
              width={200}
              height={200}
              className=''
            />{' '}
          </div>{' '}
          {/* <button
            onClick={() => signIn('github')}
            className='bg-zinc-950 p-3 rounded-md flex gap-2 items-center'
          >
            <FontAwesomeIcon icon={faGithub} className='text-xl text-white' />
            Sign in with GitHub
          </button> */}
          <div>
            <form
              className='flex flex-col gap-2 min-w-full'
              onSubmit={handleSubmit}
            >
              <label htmlFor='username'></label>
              <div className='flex gap-1'>
                <input
                  type='text'
                  id='username'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className='p-1 px-2 rounded-md bg-zinc-900 text-white placeholder:text-gray-400'
                  placeholder='username'
                />
                <label htmlFor='password'></label>
                <input
                  type='password'
                  id='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='p-1 px-2 rounded-md bg-zinc-900 text-white placeholder:text-gray-400'
                  placeholder='password'
                />
              </div>
              <button
                className={buttonClass}
                type='submit'
                disabled={!isFormFilled}
              >
                <FontAwesomeIcon
                  icon={faArrowAltCircleRight}
                  className='pr-2'
                />
                Login
              </button>
              {error && <p>{error}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
