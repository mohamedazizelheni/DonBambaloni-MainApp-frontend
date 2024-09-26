import React, { useState, useContext } from 'react';
import  {AuthContext}  from '@/contexts/AuthContext';
import { register as registerService, fetchUser } from '@/services/authService';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { useRouter } from 'next/router';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import { ROLES } from '@/utils/constants';
import Link from 'next/link';

const Register = () => {
  const { setUser } = useContext(AuthContext);
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'Chef',
    salary: '',
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const { username, email, password, role, salary } = formData;

    try {
      await registerService(username, email, password, role, parseFloat(salary));
      const userData = await fetchUser();
      setUser(userData.user);
      router.push('/admin');    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'An error occurred during registration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute roles={[ROLES.ADMIN]}>
      <div className=" flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Add New User</h2>
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
              </select>
            </div>
            <Input
              label="Salary"
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="Enter your salary"
              required
            />
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Registering...' : 'Register'}
            </Button>
          </form>
          <p className="mt-4 text-center">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Register;
