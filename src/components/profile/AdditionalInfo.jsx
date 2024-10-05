// src/components/profile/AdditionalInfo.jsx
import React from 'react';
import { FiDollarSign, FiCheckCircle, FiActivity } from 'react-icons/fi';
import Button from '@/components/common/Button';
import SalaryHistoryModal from '@/components/profile/SalaryHistoryModal';
import AvailabilityHistoryModal from '@/components/profile/AvailabilityHistoryModal';
import ActionHistoryModal from '@/components/profile/ActionHistoryModal';

const AdditionalInfo = ({
  salary,
  isAvailable,
  salaryHistory,
  availabilityHistory,
  actionHistory,
}) => {
  const [isSalaryModalOpen, setIsSalaryModalOpen] = React.useState(false);
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = React.useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = React.useState(false);

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-semibold mb-6 text-gray-800">Additional Information</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Salary Card */}
        <div className="bg-slate-100 shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center mb-4">
            <FiDollarSign className="text-blue-500 text-3xl mr-4" />
            <div>
              <h4 className="text-xl font-semibold text-gray-700">Current Salary</h4>
              <p className="text-gray-500">{salary !== null ? `$${salary}` : 'N/A'}</p>
            </div>
          </div>
          <Button
            className="mt-4 w-full"
            onClick={() => setIsSalaryModalOpen(true)}
          >
            View Salary History
          </Button>
        </div>

        {/* Availability Card */}
        <div className="bg-slate-100 shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center mb-4">
            <FiCheckCircle className="text-green-500 text-3xl mr-4" />
            <div>
              <h4 className="text-xl font-semibold text-gray-700">Availability Status</h4>
              <p className="text-gray-500">
                {isAvailable !== null ? (isAvailable ? 'Available' : 'Unavailable') : 'N/A'}
              </p>
            </div>
          </div>
          <Button
            className="mt-4 w-full"
            onClick={() => setIsAvailabilityModalOpen(true)}
          >
            View Availability History
          </Button>
        </div>

        {/* Action History Card */}
        <div className="bg-slate-100 shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center mb-4">
            <FiActivity className="text-yellow-500 text-3xl mr-4" />
            <div>
              <h4 className="text-xl font-semibold text-gray-700">Action History</h4>
              <p className="text-gray-500">View your recent actions</p>
            </div>
          </div>
          <Button
            className="mt-4 w-full"
            onClick={() => setIsActionModalOpen(true)}
          >
            View Action History
          </Button>
        </div>
      </div>

      {/* Modals */}
      {isSalaryModalOpen && (
        <SalaryHistoryModal
          isOpen={isSalaryModalOpen}
          onClose={() => setIsSalaryModalOpen(false)}
          salaryHistory={salaryHistory}
        />
      )}

      {isAvailabilityModalOpen && (
        <AvailabilityHistoryModal
          isOpen={isAvailabilityModalOpen}
          onClose={() => setIsAvailabilityModalOpen(false)}
          availabilityHistory={availabilityHistory}
        />
      )}

      {isActionModalOpen && (
        <ActionHistoryModal
          isOpen={isActionModalOpen}
          onClose={() => setIsActionModalOpen(false)}
          actionHistory={actionHistory}
        />
      )}
    </div>
  );
};

export default AdditionalInfo;
