import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import Button from '@/components/common/Button';
import { getAssignedAndAvailableUsers } from '@/services/userService';
import { FiCheckSquare, FiSquare } from 'react-icons/fi';
import { RoleColors } from '@/utils/constants';

const ManageTeamModal = ({ isOpen, onClose, entity, onSave, entityType }) => {
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState({});
  const [activeShift, setActiveShift] = useState(null);
  const [error, setError] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // Add a search query state

  useEffect(() => {
    if (isOpen && entity) {
      const fetchAssignedAndAvailableUsers = async () => {
        try {
          const { assignedUsers, availableUsers } = await getAssignedAndAvailableUsers(entityType, entity._id);

          const initialSelectedUsers = {};
          entity.operatingShifts.forEach((shift) => {
            initialSelectedUsers[shift] = {
              assigned: assignedUsers[shift] || [],
            };
          });

          setSelectedUsers(initialSelectedUsers);
          setAvailableUsers(availableUsers);
          setActiveShift(entity.operatingShifts[0]);

          const allUsersMap = {};
          availableUsers.forEach((user) => {
            allUsersMap[user._id] = user;
          });

          Object.values(assignedUsers).forEach((shiftUsers) => {
            shiftUsers.forEach((user) => {
              allUsersMap[user._id] = user;
            });
          });

          const allUsersArray = Object.values(allUsersMap);
          setAllUsers(allUsersArray);
        } catch (error) {
          console.error('Failed to fetch users:', error);
          setError('Failed to fetch users.');
        }
      };

      fetchAssignedAndAvailableUsers();
    }
  }, [isOpen, entity, entityType]);

  const handleUserSelection = (user) => {
    setSelectedUsers((prevSelectedUsers) => {
      const { assigned } = prevSelectedUsers[activeShift];
      const isAssigned = assigned.some((u) => u._id === user._id);
      let updatedAssignedUsers;

      if (isAssigned) {
        updatedAssignedUsers = assigned.filter((u) => u._id !== user._id);
      } else {
        updatedAssignedUsers = [...assigned, user];
      }

      return {
        ...prevSelectedUsers,
        [activeShift]: {
          assigned: updatedAssignedUsers,
        },
      };
    });
  };

  const handleSave = async () => {
    try {
      const userIds = selectedUsers[activeShift]?.assigned.map((user) => user._id) || [];
      await onSave(userIds, activeShift);
      onClose();
    } catch (err) {
      setError('Failed to save team.');
    }
  };

  // Combine assigned and available users for the active shift and filter based on the search query
  const getFilteredUsers = () => {
    const filteredUsers = allUsers.filter((user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
    // Separate selected and unselected users
    const selectedUsersForShift = selectedUsers[activeShift]?.assigned || [];
    const selectedUserIds = selectedUsersForShift.map((u) => u._id);
  
    const selectedUsersOnTop = filteredUsers.filter((user) => selectedUserIds.includes(user._id));
    const unselectedUsers = filteredUsers.filter((user) => !selectedUserIds.includes(user._id));
  
    // Return selected users first, followed by unselected users
    return [...selectedUsersOnTop, ...unselectedUsers];
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Manage Team"
      className="max-w-lg mx-auto mt-10 bg-white rounded-lg shadow-lg p-4 md:max-w-2xl md:p-8 z-50 relative"
      overlayClassName="fixed inset-0 bg-black bg-opacity-55 z-50 flex items-center justify-center"
    >
      <h2 className="text-2xl font-semibold mb-6 text-center">{`Manage Team for ${entity?.name}`}</h2>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Search users by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="mb-6 overflow-auto">
        <ul className="flex justify-center border-b">
          {entity?.operatingShifts.map((shift) => (
            <li key={shift} className={`mr-4 ${activeShift === shift ? 'border-b-2 border-blue-500' : ''}`}>
              <button
                className={`px-4 py-2 ${activeShift === shift ? 'text-blue-500 font-semibold' : 'text-gray-600'}`}
                onClick={() => setActiveShift(shift)}
              >
                {shift} Shift
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-6 h-64 overflow-y-auto px-4">
        <h3 className="text-lg font-semibold mb-4">{`Users for ${activeShift} Shift`}</h3>
        <ul className="space-y-4">
          {getFilteredUsers().map((user) => {
            const isAssigned = selectedUsers[activeShift]?.assigned.some((u) => u._id === user._id);
            return (
              <li key={user._id}  className={`flex justify-between items-center py-2 px-4 rounded-md cursor-pointer ${
                isAssigned ? 'bg-blue-100 border-l-4 border-blue-500 hover:bg-blue-200' : 'bg-gray-100 hover:bg-gray-200'
              }`}
              onClick={() => handleUserSelection(user)}>
                <div>
                  <span className="font-medium">{user.username}</span> <span className={`px-2  rounded-full text-[12px] font-semibold ${RoleColors[user.role]}`}>
                    {user.role}
                  </span>
                </div>
                
                  {isAssigned ? (
                    <FiCheckSquare size={20} className="text-blue-500" />
                  ) : (
                    <FiSquare size={20} className="text-gray-400" />
                  )}
              
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex justify-end space-x-4">
        <Button onClick={handleSave} className="px-6 py-2  text-white rounded-md ">
          Save Team
        </Button>
        <Button onClick={onClose} className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">
          Cancel
        </Button>
      </div>
    </Modal>
  );
};

export default ManageTeamModal;
