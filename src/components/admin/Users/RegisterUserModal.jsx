// src/components/admin/Users/RegisterUserModal.jsx
import React, { useState, useContext } from 'react';
import Modal from 'react-modal';
import { AuthContext } from '@/contexts/AuthContext';
import { register as registerService, fetchUser } from '@/services/authService';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { RiCloseLine } from 'react-icons/ri';
import { toast } from 'react-toastify';
import { ROLES } from '@/utils/constants';

Modal.setAppElement('#__next');

const RegisterUserModal = ({ isOpen, onRequestClose, onSuccess }) => {
  const { setUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'Chef', 
    salary: '',
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const { username, email, password, role, salary } = formData;

    try {
      await registerService(username, email, password, role, parseFloat(salary));
      const userData = await fetchUser();
      setUser(userData.user);
      toast.success('User registered successfully!');
      if (onSuccess) onSuccess(); 
      onRequestClose()
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'An error occurred during registration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Register User"
      className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 relative"
      overlayClassName="fixed inset-0 bg-black bg-opacity-55 z-50 flex items-center justify-center"
    >
      {/* Close Button */}
      <button
        onClick={onRequestClose}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
        aria-label="Close Modal"
      >
        <RiCloseLine className="h-6 w-6" />
      </button>

      <h2 className="text-2xl font-bold mb-6 text-center">Register User</h2>
      {error && <div className="mb-4 text-red-500 text-center">{error}</div>}

      <form onSubmit={handleSubmit}>
        <Input
          label="Username"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Enter your username"
          required
        />
        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
        />
        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          required
        />
        <div className="mb-4">
          <label htmlFor="role" className="block text-gray-700 mb-2">
            Role
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            required
          >
            <option value="Admin">Admin</option>
            <option value="Chef">Chef</option>
            <option value="Driver">Driver</option>
            {/* Add more roles as needed */}
          </select>
        </div>
        <Input
          label="Salary"
          type="number"
          name="salary"
          value={formData.salary}
          onChange={handleChange}
          placeholder="Enter salary"
          required
        />
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Registering...' : 'Register'}
        </Button>
      </form>
    </Modal>
  );
};

export default RegisterUserModal;
