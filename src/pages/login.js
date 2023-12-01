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
import AuthButton from './components/authButton';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Clear any previous error messages
    setError('');

    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      // Redirect to the home page after successful login
      router.push('/');
      console.log('Logged in');
    } else {
      // Display an error message if login fails
      setError('Failed to login. Check your username and password.');
    }
  };

  const isFormFilled = username !== '' && password !== '';
  const buttonClass = `p-1 px-3 flex h-min justify-center items-center font-bold text-white rounded-md bg-gradient-to-r from-blue-400 to-blue-500 hover:bg-blue-300 ${
    isFormFilled ? '' : 'opacity-50'
  }`;

  return (
    <div className='min-h-screen min-w-screen bg-zinc-800 text-white flex align-top items-center justify-center'>
      <Navbar />
      <AuthButton />
    </div>
  );
}
