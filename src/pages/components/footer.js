import React from 'react';
import Image from 'next/image';

const Footer = () => {
  return (
    <div className='flex gap-4 bg-black px-2 p-2'>
      {' '}
      <p className='text-gray-100'>Powered by</p>
      <a
        href='https://pm2.keymetrics.io/'
        target='_blank'
        rel='noopener noreferrer'
      >
        <Image
          src='/pm2.logo.png'
          alt='wordstamp'
          width={130}
          height={130}
          className='cursor-pointer'
          styles={'width: auto'}
        />{' '}
      </a>
    </div>
  );
};

export default Footer;
