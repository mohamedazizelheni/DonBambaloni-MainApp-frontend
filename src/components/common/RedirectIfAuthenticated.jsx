import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '@/contexts/AuthContext';
import Spinner from './Spinner';

const RedirectIfAuthenticated = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();
  console.log(user)


  useEffect(() => {
    if (!loading && user) {
      // Redirect based on user role
      if (user.role === 'Admin') {
        router.replace('/admin');
      } else if (user.role === 'Chef') {
        router.replace('/chef');
      } else if (user.role === 'Driver') {
        router.replace('/driver');
      } else {
        router.replace('/');
      }
    }
  }, [user, loading, router]);

  if (loading || user) return <div className="flex justify-center py-10"><Spinner /></div>;


  return children;
};

export default RedirectIfAuthenticated;
