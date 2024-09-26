import ProtectedRoute from '@/components/common/ProtectedRoute';
import AdminDashboard from '@/components/admin/Dashboard/AdminDashboard';
import { ROLES } from '@/utils/constants';

const AdminPage = () => {
  return (
    <ProtectedRoute roles={[ROLES.ADMIN]}>
      <div className="p-4">
        <AdminDashboard />
      </div>
    </ProtectedRoute>
  );
};

export default AdminPage;
