'use client';

import { useAuth } from '../lib/AuthContext';
import Image from 'next/image';

export default function Header() {
  const { user, signInWithGoogle, logout } = useAuth();

  return (
    <header className="p-4 bg-gray-800 text-white flex justify-between items-center">
      <h1 className="text-xl font-bold">Logue</h1>
      <div>
        {user ? (
          <div className="flex items-center">
            <Image
              src={user.photoURL || '/default-profile.png'} // Provide a fallback profile image
              alt={user.displayName || 'User'}
              width={40}
              height={40}
              className="rounded-full mr-4"
            />
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={signInWithGoogle}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Login with Google
          </button>
        )}
      </div>
    </header>
  );
}
