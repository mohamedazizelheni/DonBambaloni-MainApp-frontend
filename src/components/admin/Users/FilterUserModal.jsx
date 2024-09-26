import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import React, { useState } from 'react';
import Button from '@/components/common/Button';

const FilterUserModal = ({ isOpen, onClose, onApplyFilter }) => {
  const [role, setRole] = useState('');
  const [availability, setAvailability] = useState('');
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');

  const handleApplyFilter = () => {
    onApplyFilter({ role, availability, minSalary, maxSalary });
    onClose();
  };

  const handleResetFilters = () => {
    setRole('');
    setAvailability('');
    setMinSalary('');
    setMaxSalary('');
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 flex w-screen bg-black bg-opacity-30 items-center justify-center p-4">
        <DialogPanel className="max-w-md space-y-4 border bg-white p-6 rounded-2xl">
          <DialogTitle className="text-lg font-semibold">Filters</DialogTitle>
          <div className="mt-4">
            {/* Role Filter */}
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Any</option>
              <option value="Admin">Admin</option>
              <option value="Chef">Chef</option>
              <option value="Driver">Driver</option>
              <option value="Cleaner">Cleaner</option>
              <option value="Cashier">Cashier</option>
            </select>

            {/* Availability Filter */}
            <label className="block text-sm font-medium text-gray-700 mt-4">Availability</label>
            <select
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Any</option>
              <option value="Available">Available</option>
              <option value="Unavailable">Unavailable</option>
            </select>

            {/* Salary Filter */}
            <label className="block text-sm font-medium text-gray-700 mt-4">Salary Range</label>
            <div className="flex space-x-2">
              <input
                type="number"
                value={minSalary}
                onChange={(e) => setMinSalary(e.target.value)}
                placeholder="Min Salary"
                className="mt-1 block w-1/2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
              <input
                type="number"
                value={maxSalary}
                onChange={(e) => setMaxSalary(e.target.value)}
                placeholder="Max Salary"
                className="mt-1 block w-1/2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-between space-x-4">
            <Button onClick={handleResetFilters} className="bg-gray-300 hover:bg-gray-400">
              Reset
            </Button>
            <div className="flex space-x-2">
              <Button onClick={onClose} className="bg-gray-300 hover:bg-gray-400">
                Cancel
              </Button>
              <Button onClick={handleApplyFilter} className="bg-blue-500 hover:bg-blue-600">
                Apply
              </Button>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default FilterUserModal;
