// src/pages/login.jsx
import React, { useState, useContext } from 'react';
import { login as loginService, fetchUser } from '@/services/authService';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { useRouter } from 'next/router';
import RedirectIfAuthenticated from '@/components/common/RedirectIfAuthenticated';
import  {AuthContext}  from '@/contexts/AuthContext';

const Login = () => {
  const { setUser } = useContext(AuthContext);
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const { email, password } = formData;

    try {
      await loginService(email, password);
      const userData = await fetchUser();
      setUser(userData.user);
      // Redirect will happen via useEffect in RedirectIfAuthenticated
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'An error occurred during login.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <RedirectIfAuthenticated>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
          {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
          <form onSubmit={handleSubmit}>
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
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Logging in...' : 'Login'}
            </Button>
          </form>
         
        </div>
      </div>
    </RedirectIfAuthenticated>
  );
};

export default Login;
