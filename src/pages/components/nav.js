import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBookBookmark,
  faHeartBroken,
  faHeartPulse,
  faProcedures,
  faWaveSquare,
} from '@fortawesome/free-solid-svg-icons';
import { faDochub, faGithub } from '@fortawesome/free-brands-svg-icons';
// import AuthButton from './authButton';

const Navbar = () => {
  const { data: session } = useSession();
  return (
    <div className='px-3 w-full z-[100] fixed top-0 bg-black/80 backdrop-blur-sm h-[55px] justify-between items-center align-middle flex select-none cursor-default'>
      {' '}
      <p className='font-bold text-gray-100 text-sm md:text-xl'>
        {' '}
        <FontAwesomeIcon
          icon={faHeartPulse}
          className='pr-2 hidden md:relative'
        />{' '}
        PM2 UI
      </p>{' '}
      <div className={{ session } ? 'flex gap-2' : 'hidden'}>
        <button
          onClick={() =>
            window.open(
              'https://pm2.keymetrics.io/docs/usage/quick-start/',
              '_blank'
            )
          }
          className='p-1 px-3 flex h-min items-center font-bold text-white rounded-md bg-gradient-to-r from-zinc-600 to-zinc-700 hover:bg-blue-300'
        >
          <FontAwesomeIcon
            icon={faBookBookmark}
            className='pr-2 hidden md:relative'
          />{' '}
          PM2
        </button>
        <button
          onClick={() => window.open('https://www.dev.azure.com', '_blank')}
          className='p-1 px-3 flex h-min items-center font-bold text-white rounded-md bg-gradient-to-r from-zinc-600 to-zinc-700 hover:bg-blue-300'
        >
          <FontAwesomeIcon
            icon={faWaveSquare}
            className='pr-2 hidden md:relative'
          />{' '}
          AZURE
        </button>
        <button
          onClick={() =>
            window.open('https://github.com/thenickygee/pm2-ui', '_blank')
          }
          className='p-1 px-3 flex h-min items-center font-bold text-white rounded-md bg-gradient-to-r from-zinc-600 to-zinc-700   hover:bg-blue-300'
        >
          <FontAwesomeIcon
            icon={faGithub}
            className='pr-2 hidden md:relative'
          />{' '}
          GITHUB
        </button>
        {/* <AuthButton /> */}
      </div>
    </div>
  );
};

export default Navbar;
