import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '@/contexts/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (roles && !roles.includes(user.role)) {
        router.push('/unauthorized');
      }
    }
  }, [user, loading, router, roles]);

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  return children;
};

export default ProtectedRoute;
