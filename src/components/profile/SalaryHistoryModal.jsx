import React, { useState ,useEffect } from 'react';
import Modal from 'react-modal';
import Button from '@/components/common/Button';
import { getSalaryHistory } from '@/services/historyService';
import Spinner from '@/components/common/Spinner';
import Pagination from '../common/Pagination';

Modal.setAppElement('#__next');

const SalaryHistoryModal = ({ isOpen, onClose }) => {
  const [salaryHistory, setSalaryHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); 
  const [totalRecords, setTotalRecords] = useState(0);

  const fetchSalaryHistory = async () => {
    try {
      const data = await getSalaryHistory();
      setSalaryHistory(data.salaryHistory);
      setTotalPages(data.totalPages);
      setTotalRecords(data.totalRecords);
    } catch (error) {
      console.error('Failed to fetch salary history:', error);
    } finally {
      setLoading(false);
    }
  };

   // Fetch salary history when the modal is opened
   useEffect(() => {
    if (isOpen) {
      fetchSalaryHistory(currentPage);
    }
  }, [isOpen,currentPage]);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Salary History"
      className="max-w-2xl mx-auto mt-24 bg-white rounded-lg shadow-lg p-6 outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <h2 className="text-xl font-semibold mb-4">Salary History</h2>
      <div className="overflow-y-auto max-h-96">
      {loading ? (
        <div className="flex justify-center py-10"><Spinner /></div>
              ) : (
                <>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Date</th>
              <th className="py-2 px-4 border-b">Amount</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Notes</th>
            </tr>
          </thead>
          <tbody>
            {salaryHistory.length > 0 ? (
              salaryHistory
                .slice()
                .reverse()
                .map((record, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4 border-b">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 border-b">${record.amount}</td>
                    <td className="py-2 px-4 border-b">{record.status}</td>
                    <td className="py-2 px-4 border-b">{record.notes || 'N/A'}</td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="4" className="py-4 px-6 text-center">
                  No salary history available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination
         currentPage={currentPage}
         totalPages={totalPages}
         onPageChange={handlePageChange}
       />
       </>
        )}
      </div>
      <div className="flex justify-end mt-4">
        <Button onClick={onClose}>Close</Button>
      </div>
    </Modal>
  );
};

export default SalaryHistoryModal;
