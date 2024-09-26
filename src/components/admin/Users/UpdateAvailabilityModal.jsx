import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import Button from '@/components/common/Button';
import { updateUserAvailability } from '@/services/userService';
import { RiCloseLine } from 'react-icons/ri';
import { toast } from 'react-toastify';

const UpdateAvailabilityModal = ({ isOpen, onRequestClose, user, onSuccess }) => {
  const [isAvailable, setIsAvailable] = useState(user.isAvailable);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Reset state when user changes
  useEffect(() => {
    if (user) {
      setIsAvailable(user.isAvailable);
      setReason('');
      setError('');
      setIsSubmitting(false);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await updateUserAvailability(user._id, {
        isAvailable,
        reason: reason, // Reason only required if unavailable
      });
      toast.success('Availability updated successfully!');
      onSuccess();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update availability.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Update Availability"
      className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 relative"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <button
        onClick={onRequestClose}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
        aria-label="Close Modal"
      >
        <RiCloseLine className="h-6 w-6" />
      </button>

      <h2 className="text-xl font-semibold mb-4">Update Availability</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="isAvailable" className="block text-gray-700 mb-2">
            Availability Status
          </label>
          <select
            id="isAvailable"
            name="isAvailable"
            value={isAvailable}
            onChange={(e) => setIsAvailable(e.target.value === 'true')}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            required
          >
            <option value="true">Available</option>
            <option value="false">Unavailable</option>
          </select>
        </div>

        
          <div>
            <label htmlFor="reason" className="block text-gray-700 mb-2">
              Reason 
            </label>
            <textarea
              id="reason"
              name="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
              required
            ></textarea>
          </div>
        

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex justify-end space-x-4">
          <Button onClick={onRequestClose} className="bg-gray-300 hover:bg-gray-400">
            Cancel
          </Button>
          <Button type="submit" className="bg-blue-500 hover:bg-blue-600" disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default UpdateAvailabilityModal;
