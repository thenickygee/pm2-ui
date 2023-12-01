import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function AuthButton() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleAuth = () => {
    if (session) {
      signOut({ callbackUrl: '/login' }); // Redirect to login page after sign out
    } else {
      signIn('credentials', { callbackUrl: '/' }); // Redirect to home page after sign in
    }
  };

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  return (
    <button
      onClick={handleAuth}
      className='p-1 px-2 font-bold text-blue-100 rounded-md border hover:bg-zinc-800 cursor-pointer shadow-sm'
    >
      {session ? 'LOGOUT' : 'SIGN IN'}
    </button>
  );
}
