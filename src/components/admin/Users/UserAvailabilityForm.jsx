import React, { useState } from 'react';
import { updateUserAvailability } from '@/services/userService';
import useSWR, { mutate } from 'swr';

const UserAvailabilityForm = ({ userId }) => {
  const [isAvailable, setIsAvailable] = useState(true);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await updateUserAvailability(userId, { isAvailable, reason });
      mutate('/users'); // Revalidate SWR cache for users
    } catch (err) {
      setError('Failed to update availability.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <label className="flex items-center space-x-1">
        <input
          type="checkbox"
          checked={isAvailable}
          onChange={(e) => setIsAvailable(e.target.checked)}
          className="form-checkbox"
        />
        <span>Available</span>
      </label>
      <input
        type="text"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Reason"
        className="border px-2 py-1 rounded"
        disabled={isAvailable}
      />
      <button
        type="submit"
        disabled={loading}
        className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        {loading ? 'Updating...' : 'Update'}
      </button>
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </form>
  );
};

export default UserAvailabilityForm;
