import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '@/contexts/AuthContext';
import Spinner from './Spinner';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/login');//  replace to prevent back navigation
      } else if (roles && !roles.includes(user.role)) {
        router.push('/unauthorized');
      }
    }
  }, [user, loading, router, roles]);

  
  if (loading || !user) return <div className="flex justify-center py-10"><Spinner /></div>;


  return children;
};

export default ProtectedRoute;
