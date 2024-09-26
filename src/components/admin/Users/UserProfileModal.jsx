import React from 'react';
import { Dialog, DialogPanel, DialogTitle, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { useState } from 'react';
import Button from '@/components/common/Button';
import { formatDate } from '@/utils/dateUtils';
import { MdEdit } from 'react-icons/md';
import { Tab } from '@headlessui/react';
import Image from 'next/image';

const UserProfileModal = ({ isOpen, onClose, user, isAdmin }) => {
  const [editable, setEditable] = useState(false); // For admin to toggle edit mode

  const toggleEdit = () => {
    setEditable(!editable);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-30">
        <DialogPanel className="max-w-lg w-full bg-white rounded-lg p-6 shadow-lg">
          <DialogTitle className="text-lg font-semibold flex justify-between">
            User Profile
            {isAdmin && (
              <button onClick={toggleEdit} className="text-blue-500 hover:text-blue-700">
                <MdEdit className="h-6 w-6" />
              </button>
            )}
          </DialogTitle>

          {/* Tabbed Interface */}
          <TabGroup>
            <TabList className="flex space-x-0 mt-4 border-b justify-between">
              <Tab as="button" className={({ selected }) => `py-2 px-0 ${selected ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-600'}`}>
                Personal Info
              </Tab>
              <Tab as="button" className={({ selected }) => `py-2 px-4 ${selected ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-600'}`}>
                Job Info
              </Tab>
              {isAdmin && (
                <Tab as="button" className={({ selected }) => `py-2 px-0 ${selected ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-600'}`}>
                  Salary History
                </Tab>
              )}
              <Tab as="button" className={({ selected }) => `py-2 px-0 ${selected ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-600'}`}>
                User Actions
              </Tab>
            </TabList>

            <TabPanels className="mt-4">
              {/* Personal Info Tab */}
              <TabPanel>
                <div className="space-y-4">
                  <div className="flex justify-start space-x-4 items-center mt-4">
                    <Image src='/images/default-avatar.jpg' height={200} width={200} alt={user.username} className="w-24 h-24 rounded-full shadow-lg" />
                    <div className="flex flex-col ">
                      <span className='text-xl font-bold'>{user.username}</span>
                      <span className='text-gray-500 mb-2'>{user.email}</span>
                      <span className={`px-2 rounded-full m-auto ml-0 text-sm font-semibold ${user.role === 'Admin' ? 'bg-green-100 border border-green-400 text-green-800' : 'bg-blue-100 text-blue-600 border border-blue-400'}`}>
                      {user.role} 
                    </span>
                    </div>
                   
                  </div>
                  <div className="space-y-2 ">
                   
                    <div className="flex justify-between pb-2 border-b ">
                      <span className='font-semibold text-gray-700'>Nationality:</span>
                      <span>{user.nationality}</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b">
                      <span className='font-semibold text-gray-700'>Gender:</span>
                      <span>{user.sex}</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b">
                      <span className='font-semibold text-gray-700'>Visa Status:</span>
                      <span>{user.visaStatus}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className='font-semibold text-gray-700'>Visa Expiry Date:</span>
                      <span>{formatDate(user.visaExpiryDate)}</span>
                    </div>
                  </div>
                </div>
              </TabPanel>

              {/* Job Info Tab */}
              <TabPanel>
                <div className="space-y-4">
                  <h3 className="text-md font-semibold">Job Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between pb-2 border-b">
                      <span className='font-semibold text-gray-700'>Role:</span>
                      <span>{editable && isAdmin ? (
                        <select defaultValue={user.role} className="border rounded-md px-2">
                          <option value="Admin">Admin</option>
                          <option value="User">User</option>
                          <option value="Chef">Chef</option>
                          <option value="Driver">Driver</option>
                        </select>
                      ) : (
                        user.role
                      )}</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b">
                      <span className='font-semibold text-gray-700'>Salary:</span>
                      <span>{editable && isAdmin ? (
                        <input type="number" defaultValue={user.salary} className="border rounded-md px-2" />
                      ) : (
                        `AED ${user.salary}`
                      )}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className='font-semibold text-gray-700'>Availability:</span>
                      <span>{user.isAvailable ? 'Available' : 'Unavailable'}</span>
                    </div>
                  </div>
                </div>
              </TabPanel>

              {/* Salary History Tab (Admin only) */}
              {isAdmin && (
                <TabPanel>
                  <div className="space-y-4">
                    <h3 className="text-md font-semibold">Salary History</h3>
                    {user.salaryHistory && user.salaryHistory.length > 0 ? (
                      <ul className="space-y-2 overflow-y-auto max-h-32">
                        {user.salaryHistory.map((record) => (
                          <li key={record.date} className="flex justify-between">
                            <span>{formatDate(record.date)}</span>
                            <span>${record.amount}</span>
                            <span>{record.status}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No salary history available.</p>
                    )}
                  </div>
                </TabPanel>
              )}

              {/* User Actions Tab */}
              <TabPanel>
                <div className="space-y-4">
                  <h3 className="text-md font-semibold">User Actions</h3>
                  {user.history && user.history.length > 0 ? (
                    <ul className="space-y-2 overflow-y-auto max-h-32">
                      {user.history.map((action, index) => (
                        <li key={index} className="flex justify-between">
                          <span>{action.action}</span>
                          <span>{formatDate(action.timestamp)}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No user actions recorded.</p>
                  )}
                </div>
              </TabPanel>
            </TabPanels>
          </TabGroup>

          <div className="mt-6 flex justify-end space-x-4">
            <Button onClick={onClose} className="bg-gray-300 hover:bg-gray-400">
              Close
            </Button>
            {isAdmin && editable && (
              <Button onClick={() => {/* ekhdem e save y azizzzzz */}} className="bg-blue-500 hover:bg-blue-600">
                Save
              </Button>
            )}
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default UserProfileModal;
