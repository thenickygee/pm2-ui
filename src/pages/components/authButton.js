import { useSession, signIn, signOut } from 'next-auth/react';

export default function AuthButton() {
  const { data: session, status } = useSession();

  const handleAuth = () => {
    if (session) {
      signOut();
    } else {
      signIn();
    }
  };

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  return (
    <button
      onClick={handleAuth}
      className='p-1 px-2 font-bold text-blue-100 rounded-md border hover:bg-zinc-800'
    >
      {session ? 'LOGOUT' : 'SIGN IN'}
    </button>
  );
}
