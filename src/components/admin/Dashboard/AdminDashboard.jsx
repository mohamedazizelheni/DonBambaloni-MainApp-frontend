// src/components/admin/Dashboard/AdminDashboard.jsx
import React from 'react';
import KitchenList from '../Kitchens/KitchenList';
import UserList from '../Users/UserList';

const AdminDashboard = () => {
  return (
    <div className="space-y-8">
      <UserList />
     
      {/*  <KitchenList /> */}
    </div>
  );
};

export default AdminDashboard;
