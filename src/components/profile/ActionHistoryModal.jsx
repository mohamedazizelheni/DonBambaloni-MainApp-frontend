import React from 'react';
import Modal from 'react-modal';
import Button from '@/components/common/Button';

Modal.setAppElement('#__next');

const ActionHistoryModal = ({ isOpen, onClose, actionHistory }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Action History"
      className="max-w-2xl mx-auto mt-24 bg-white rounded-lg shadow-lg p-6 outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <h2 className="text-xl font-semibold mb-4">Action History</h2>
      <div className="overflow-y-auto max-h-96">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Timestamp</th>
              <th className="py-2 px-4 border-b">Action</th>
              <th className="py-2 px-4 border-b">Details</th>
            </tr>
          </thead>
          <tbody>
            {actionHistory.length > 0 ? (
              actionHistory
                .slice()
                .reverse()
                .map((record, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4 border-b">
                      {new Date(record.timestamp).toLocaleString()}
                    </td>
                    <td className="py-2 px-4 border-b">{record.action}</td>
                    <td className="py-2 px-4 border-b">
                      {JSON.stringify(record.details) || 'N/A'}
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="3" className="py-4 px-6 text-center">
                  No action history available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end mt-4">
        <Button onClick={onClose}>Close</Button>
      </div>
    </Modal>
  );
};

export default ActionHistoryModal;
