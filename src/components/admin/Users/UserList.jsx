import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import React, { useState } from 'react';
import useUsers from '@/hooks/useUsers';
import { ROLES, RoleColors } from '@/utils/constants';
import { deleteUser } from '@/services/userService';
import Button from '@/components/common/Button';
import { RiDeleteBin6Fill, RiEdit2Fill, RiUser3Line, RiMore2Line, RiCloseLine } from "react-icons/ri";
import { MdCancel } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import { IoFilterOutline } from "react-icons/io5";
import Modal from 'react-modal';
import Pagination from '@/components/common/Pagination';
import Spinner from '@/components/common/Spinner';
import UpdateAvailabilityModal from './UpdateAvailabilityModal';
import { toast } from 'react-toastify';
import Image from 'next/image';
import RegisterUserModal from './RegisterUserModal';
import useDebounce from '@/hooks/useDebounce';
import FilterModal from './FilterUserModal';
import UserProfileModal from './UserProfileModal';

Modal.setAppElement('#__next');

const UserList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10; // Users per page
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms delay

  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState({ role: '', availability: '', minSalary: '', maxSalary: '' });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
  const [availabilityUser, setAvailabilityUser] = useState(null);

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileUser, setProfileUser] = useState(null);

  const { users, isLoading, isError, mutate, totalPages, totalUsers } = useUsers(currentPage, limit, debouncedSearchTerm, filters);

  const openProfileModal = (user) => {
    setProfileUser(user);
    setIsProfileModalOpen(true);
  };

  const closeProfileModal = () => {
    setProfileUser(null);
    setIsProfileModalOpen(false);
  };

 const openFilterModal = () => {
    setIsFilterModalOpen(true);
  };

  const closeFilterModal = () => {
    setIsFilterModalOpen(false);
  };

  const applyFilters = (filterValues) => {
    setFilters(filterValues);
    setCurrentPage(1); 
  };
  const removeFilter = (filterKey) => {
    const updatedFilters = { ...filters };
    delete updatedFilters[filterKey];
    setFilters(updatedFilters);
  };
  const handleSearch = (event) => {
    setSearchTerm(event.target.value); // Update search term
    setCurrentPage(1); // Reset to the first page when searching
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedUser(null);
    setIsDeleteModalOpen(false);
    setDeleteError('');
  };

  const handleDelete = async () => {
    if (!selectedUser) return;

    setIsDeleting(true);
    setDeleteError('');

    try {
      await deleteUser(selectedUser._id);
      mutate(); // Revalidate user list
      toast.success('User deleted successfully.');
      closeDeleteModal();
    } catch (error) {
      console.error('Failed to delete user:', error);
      setDeleteError('Failed to delete user. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const openAvailabilityModal = (user) => {
    setAvailabilityUser(user);
    setIsAvailabilityModalOpen(true);
  };

  const closeAvailabilityModal = () => {
    setAvailabilityUser(null);
    setIsAvailabilityModalOpen(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  

  const openAddUserModal = () => {
    setIsAddUserModalOpen(true);
  };

  const closeAddUserModal = () => {
    setIsAddUserModalOpen(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const areFiltersApplied = Object.values(filters).some(value => value);


  if (isLoading) return <div className="flex justify-center py-10"><Spinner /></div>;
  if (isError) return <div className="text-center py-10 text-red-500">Error loading users.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4">
      <h2 className="text-2xl font-bold mb-2">User Management</h2>
      <h3 className="text-sm mb-6 text-gray-600">Manage your team members and their account here.</h3>
        
      <div className="flex flex-col md:flex-col mb-4">
        <div className="flex justify-between items-center mb-2">
          <p className="text-lg md:text-xl font-semibold text-gray-900">All users <span className="text-gray-500 font-medium">{totalUsers}</span></p>
          <div className="flex justify-end space-x-2">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full md:w-auto border rounded-lg px-4 py-2 text-base hidden md:block"
            />
            <button           
              onClick={openFilterModal}
              className="flex items-center text-gray-600 hover:text-gray-800 border text-sm md:text-base font-semibold rounded-lg px-2 py-2">
              <IoFilterOutline className="mr-2 h-4 w-4" />
              Filters
            </button>
            <button onClick={openAddUserModal} className="flex items-center bg-black text-white text-sm md:text-base font-semibold px-2 py-2 rounded-lg">
              <FaPlus className="mr-2 h-3 w-3" />
              Add
            </button>
          </div>
          <FilterModal isOpen={isFilterModalOpen} onClose={closeFilterModal} onApplyFilter={applyFilters} />
        </div>
{/* Filter Chips */}
{areFiltersApplied && (
        <div className="mb-4 flex flex-wrap gap-2">
          {Object.entries(filters).map(([key, value]) => (
            value && (
              <div
                key={key}
                className="flex items-center space-x-2 bg-gray-200 px-3 py-1 rounded-full text-sm text-gray-800 break-all"
              >
                <span>{key}: {value}</span>
                <button onClick={() => removeFilter(key)}>
                  <MdCancel className="h-4 w-4 text-gray-600 hover:text-gray-800" />
                </button>
              </div>
            )
          ))}
        </div>
      )}
        <div className="w-full block md:hidden">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full md:w-auto border rounded-lg px-4 py-2 text-base"
          />
        </div>
      </div>

      <div className="block md:hidden">
        {/* Mobile version */}
        {users.length === 0 ? (
          <div className="text-center py-4">No users found.</div>
        ) : (
          <ul className="space-y-4">
            {users.map((user) => (
              <li key={user._id} className="flex items-center justify-between bg-white p-4 shadow rounded-lg">
                <div className="flex items-center space-x-3">
                  <Image src={user.avatar || '/images/default-avatar.jpg'} width={200} height={200}  alt={user.username} className="w-8 h-8 rounded-full" />
                  <div>
                    <span className="font-semibold text-black">{user.username}</span>
                    <p className="text-gray-500 text-sm">{user.email}</p>
                  </div>
                </div>

                <Menu as="div" className="relative">
                  <MenuButton className="text-gray-500 hover:text-gray-700 focus:outline-none">
                    <RiMore2Line className="w-6 h-6" />
                  </MenuButton>
                  <MenuItems className="absolute right-0 mt-2 w-36 bg-white shadow-lg rounded-lg z-50">
                    <div className="py-1">
                      <MenuItem as="button" className="block px-4 py-2 text-sm hover:bg-gray-100 text-gray-700" onClick={()=> openProfileModal(user)}>
                        <RiUser3Line className="inline mr-2" /> View Profile
                      </MenuItem>
                      <MenuItem as="button" className="block px-4 py-2 text-sm hover:bg-gray-100 text-gray-700">
                        <RiEdit2Fill className="inline mr-2" /> Edit Details
                      </MenuItem>
                      <MenuItem as="button" className="block px-4 py-2 text-sm hover:bg-gray-100 text-gray-700">
                        <RiEdit2Fill className="inline mr-2" /> Change Role
                      </MenuItem>
                      <MenuItem as="button" className="block px-4 py-2 text-sm hover:bg-gray-100 text-gray-700" onClick={() => openDeleteModal(user)}>
                        <RiDeleteBin6Fill className="inline mr-2 text-red-500" /> Delete User
                      </MenuItem>
                    </div>
                  </MenuItems>
                </Menu>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Desktop version */}
      <div className="hidden md:block">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-2 px-6 text-left">User</th>
              <th className="py-2 px-6 text-left">Role</th>
              <th className="py-2 px-6 text-left">Availability</th>
              <th className="py-2 px-6 text-left">Date added</th>
              <th className="py-2 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-4 px-6 text-center">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-100">
                  <td className="py-2 px-6 flex items-center space-x-3">
                    <Image src={user.avatar || '/images/default-avatar.jpg'} width={200} height={200} alt={user.username} className="w-8 h-8 rounded-full" />
                    <div>
                      <span className="font-semibold text-black">{user.username}</span>
                      <p className="text-gray-500 text-sm">{user.email}</p>
                    </div>
                  </td>
                  <td className="py-2 px-6">
                  <span className={`px-2 py-1 rounded-full text-[12px] font-semibold ${RoleColors[user.role]}`}>
                    {user.role}
                  </span>

                  </td>
                  <td className="py-2 px-6">
                    <div className="flex items-center space-x-2 text-sm">
                      <span className={`font-medium ${user.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                        {user.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                      {user.role !== ROLES.ADMIN && (
                        <button
                          onClick={() => openAvailabilityModal(user)}
                          className="text-blue-500 hover:text-blue-700 focus:outline-none"
                          aria-label={`Update availability for ${user.username}`}
                        >
                          <RiEdit2Fill className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-800 font-semibold text-sm">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <Menu as="div" className="relative inline-block text-left">
                      <MenuButton className="text-gray-500 hover:text-gray-700 focus:outline-none">
                        <RiMore2Line className="w-6 h-6" />
                      </MenuButton>
                      <MenuItems className="absolute right-0 mt-2 w-36 bg-white shadow-lg rounded-lg z-50">
                        <div className="py-1">
                          <MenuItem as="button" className="block px-4 py-2 text-sm hover:bg-gray-100 text-gray-700" onClick={()=> openProfileModal(user)}>
                            <RiUser3Line className="inline mr-2" /> View Profile
                          </MenuItem>
                          <MenuItem as="button" className="block px-4 py-2 text-sm hover:bg-gray-100 text-gray-700">
                            <RiEdit2Fill className="inline mr-2" /> Edit Details
                          </MenuItem>
                          <MenuItem as="button" className="block px-4 py-2 text-sm hover:bg-gray-100 text-gray-700">
                            <RiEdit2Fill className="inline mr-2" /> Change Role
                          </MenuItem>
                          <MenuItem as="button" className="block px-4 py-2 text-sm hover:bg-gray-100 text-gray-700" onClick={() => openDeleteModal(user)}>
                            <RiDeleteBin6Fill className="inline mr-2 text-red-500" /> Delete User
                          </MenuItem>
                        </div>
                      </MenuItems>
                    </Menu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <RegisterUserModal
        isOpen={isAddUserModalOpen}
        onRequestClose={closeAddUserModal}
        onSuccess={mutate}  // Re-fetch users list on success
      />

      {/* Pagination Controls */}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={closeDeleteModal}
        contentLabel="Confirm Deletion"
        className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 relative"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        {/* Close Button */}
        <button
          onClick={closeDeleteModal}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Close Modal"
        >
          <RiCloseLine className="h-6 w-6" />
        </button>

        <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
        {selectedUser && (
          <p className="mb-4">
            Are you sure you want to delete <span className="font-bold">{selectedUser.username}</span>?
          </p>
        )}
        {deleteError && <p className="text-red-500 mb-4">{deleteError}</p>}
        <div className="flex justify-end space-x-4">
          <Button onClick={closeDeleteModal} className="bg-gray-300 hover:bg-gray-400">
            Cancel
          </Button>
          <Button onClick={handleDelete} className="bg-red-500 hover:bg-red-600" disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </Modal>

      {/* Update Availability Modal */}
      {availabilityUser && (
        <UpdateAvailabilityModal
          isOpen={isAvailabilityModalOpen}
          onRequestClose={closeAvailabilityModal}
          user={availabilityUser}
          onSuccess={() => {
            mutate();
            closeAvailabilityModal();
          }}
        />
      )}
      {profileUser && (
        <UserProfileModal
          isOpen={isProfileModalOpen}
          onClose={closeProfileModal}
          user={profileUser}
          isAdmin={true}  
        />
      )}
    </div>
  );
};

export default UserList;
