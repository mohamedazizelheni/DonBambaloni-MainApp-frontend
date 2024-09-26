import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '@/contexts/AuthContext';

const RedirectIfAuthenticated = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

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

  if (loading || user) {
    return <div>Loading...</div>;
  }

  return children;
};

export default RedirectIfAuthenticated;
