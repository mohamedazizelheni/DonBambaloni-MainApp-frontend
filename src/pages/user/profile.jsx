import React, { useState, useEffect } from 'react';
import useAuth from '@/hooks/useAuth';
import { useRouter } from 'next/router';
import { getUserProfile, updateUserProfile } from '@/services/userService';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Image from 'next/image';
import SalaryHistoryModal from '@/components/profile/SalaryHistoryModal';
import AvailabilityHistoryModal from '@/components/profile/AvailabilityHistoryModal';
import ActionHistoryModal from '@/components/profile/ActionHistoryModal';

const Profile = () => {
  const { user, loading,refreshUser} = useAuth();
  const router = useRouter();
  const [salary, setSalary] = useState(null);
  const [isAvailable, setIsAvailable] = useState(null);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    nationality: '',
    sex: '',
    image: null, 
  });

  const [previewImage, setPreviewImage] = useState(null); // For image preview
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

   // Histories
   const [salaryHistory, setSalaryHistory] = useState([]);
   const [availabilityHistory, setAvailabilityHistory] = useState([]);
   const [actionHistory, setActionHistory] = useState([]);
 
   // Modals
   const [isSalaryModalOpen, setIsSalaryModalOpen] = useState(false);
   const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
   const [isActionModalOpen, setIsActionModalOpen] = useState(false);

  // Fetch user profile data on component mount
  useEffect(() => {
    if (!loading && user) {
      const fetchProfile = async () => {
        try {
          //const { user: userProfile } = await getUserProfile();
          setFormData({
            username: user.username || '',
            email: user.email || '',
            password: '',
            nationality: user.nationality || '',
            sex: user.sex || '',
            image: null,
          });
          setPreviewImage(user.image ? `${process.env.NEXT_PUBLIC_API_IMAGE_URL}/${user.image}` : null);
          setSalaryHistory(user.salaryHistory || []);
          setAvailabilityHistory(user.availabilityHistory || []);
          setActionHistory(user.history || []);
          setSalary(user.salary || null);
          setIsAvailable(user.isAvailable !== undefined ? user.isAvailable : null);
        } catch (err) {
          console.error('Failed to fetch profile:', err);
          setError('Failed to load profile data.');
        }
      };

      fetchProfile();
    }
  }, [user, loading]);
  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'image' && files.length > 0) {
      const file = files[0];
      setFormData((prevData) => ({ ...prevData, image: file }));

      // Generate preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      const updatedData = { ...formData };

      // Prepare form data for image upload
      const formDataToSend = new FormData();
      Object.keys(updatedData).forEach((key) => {
        if (updatedData[key]) {
          formDataToSend.append(key, updatedData[key]);
        }
      });

      // Make API call to update profile
      await updateUserProfile(formDataToSend);
      refreshUser();
      setSuccess('Profile updated successfully.');

      // Optionally, update the user in the AuthContext
      // ... (you might need to fetch the updated user data)
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError(err.response?.data?.message || 'An error occurred during profile update.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    router.replace('/login');
    return null;
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6">My Profile</h2>

      {error && <div className="mb-4 text-red-500">{error}</div>}
      {success && <div className="mb-4 text-green-500">{success}</div>}

      <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
        {/* Profile Image */}
        <div className="mb-6 text-center">
          <div className="relative inline-block">
            {previewImage ? (
              <Image
                src={previewImage}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border"
                crossOrigin="anonymous"
                width={250}
                height={250}
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}
            <label
              htmlFor="image"
              className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
              </svg>
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              className="hidden"
              onChange={handleChange}
            />
          </div>
        </div>

        <Input
          label="Username"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter new password (leave blank to keep current)"
        />

        <Input
          label="Nationality"
          type="text"
          name="nationality"
          value={formData.nationality}
          onChange={handleChange}
        />

        <div className="mb-4">
          <label htmlFor="sex" className="block text-gray-700 mb-2">
            Sex
          </label>
          <select
            id="sex"
            name="sex"
            value={formData.sex}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
          >
            <option value="">Select Sex</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Updating...' : 'Update Profile'}
        </Button>
      </form>

       {/* Additional Data Section */}
       <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Additional Information</h3>

        {/* Current Salary */}
        <div className="mb-4">
          <span className="font-semibold">Current Salary:</span>{' '}
          {salary !== null ? `$${salary}` : 'N/A'}
          <Button
            className="ml-4"
            onClick={() => setIsSalaryModalOpen(true)}
          >
            View Salary History
          </Button>
        </div>

        {/* Availability Status */}
        <div className="mb-4">
          <span className="font-semibold">Current Availability:</span>{' '}
          {isAvailable !== null ? (isAvailable ? 'Available' : 'Unavailable') : 'N/A'}

          <Button
            className="ml-4"
            onClick={() => setIsAvailabilityModalOpen(true)}
          >
            View Availability History
          </Button>
        </div>

        {/* Action History */}
        <div className="mb-4">
          <Button onClick={() => setIsActionModalOpen(true)}>
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

export default Profile;
