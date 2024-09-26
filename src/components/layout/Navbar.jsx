import React from 'react';
import useAuth from '@/hooks/useAuth';
import Link from 'next/link';
import { ROLES } from '@/utils/constants';
import { logout } from '@/services/authService';

const Navbar = () => {
  const { user, setUser } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  return (
    <nav className=" bg-gray-800 text-white">
      <div className='max-w-7xl mx-auto flex justify-between p-4'>
      <div>
        <Link href="/">
          <p className="font-bold">My Application</p>
        </Link>
      </div>
      <div className="flex space-x-4">
        {user && user.role === ROLES.ADMIN && (
          <Link href="/admin">
            <p>Admin Dashboard</p>
          </Link>
        )}
        {user && user.role === ROLES.CHEF && (
          <Link href="/chef">
            <p>Chef Dashboard</p>
          </Link>
        )}
        {user && user.role === ROLES.DRIVER && (
          <Link href="/driver">
            <p>Driver Dashboard</p>
          </Link>
        )}
        <button onClick={handleLogout} className="rounded-lg">
            Logout
          </button>
      </div>
      </div>
      
    </nav>
  );
};

export default Navbar;
