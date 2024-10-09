import React, { useState, useEffect } from 'react';
import useAuth from '@/hooks/useAuth';
import { useRouter } from 'next/router';
import { updateUserProfile } from '@/services/userService';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Image from 'next/image';
import AdditionalInfo from '@/components/profile/AdditionalInfo';
import CountryList from 'react-select-country-list';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css'; 
import { toast } from 'react-toastify';

const Profile = () => {
  const [countries] = useState(CountryList().getData());

  const { user, loading, refreshUser } = useAuth();
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

  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch user profile data on component mount
  useEffect(() => {
    if (!loading && user) {
      const fetchProfile = async () => {
        try {
          setFormData({
            username: user.username || '',
            email: user.email || '',
            password: '',
            nationality: user.nationality || '',
            sex: user.sex || '',
            image: null,
          });
          setPreviewImage(user.image ? `${process.env.NEXT_PUBLIC_API_IMAGE_URL}/${user.image}` : null);
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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files.length > 0) {
      const file = files[0];
      setFormData((prevData) => ({ ...prevData, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleNationalityChange = (e) => {
    const selectedCountry = e.target.value;
    setFormData((prevData) => ({ ...prevData, nationality: selectedCountry }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      const updatedData = { ...formData };
      const formDataToSend = new FormData();
      Object.keys(updatedData).forEach((key) => {
        if (updatedData[key]) {
          formDataToSend.append(key, updatedData[key]);
        }
      });

      await updateUserProfile(formDataToSend);
      refreshUser();
      toast.success('Profile updated successfully.');

    } catch (err) {
      console.error('Failed to update profile:', err);
      setError(err.response?.data?.message || 'An error occurred during profile update.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (!user) {
    router.replace('/login');
    return null;
  }

  return (
    <div className="container mx-auto px-6 py-8 lg:px-12">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">My Profile</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Image and Info */}
        <div className="lg:col-span-1">
          <div className="  rounded-lg p-6  ">
            <div className="mb-6 text-center">
              <div className="relative inline-block shadow-2xl rounded-full border-gray-700 border-8">
                {previewImage ? (
                  <Image
                    src={previewImage}
                    alt="Profile"
                    className="w-40 h-40 rounded-full object-cover border"
                    crossOrigin="anonymous"
                    width={160}
                    height={160}
                  />
                ) : (
                  <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
                <label
                  htmlFor="image"
                  className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-700">{user.username}</h3>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Middle Column: Personal Details */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Input label="Username" type="text" name="username" value={formData.username} onChange={handleChange} required />
                <Input label="Email" type="email" name="email" value={formData.email} onChange={handleChange} required />
                {/* Nationality dropdown */}
                <div className="mb-4">
                  <label htmlFor="nationality" className="block text-gray-700 mb-2">
                    Nationality
                  </label>
                  <select
                    id="nationality"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleNationalityChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  >
                    <option value="">Select Nationality</option>
                    {countries.map((country) => (
                      <option key={country.value} value={country.value}>
                        {country.label}
                      </option>
                    ))}
                  </select>
                </div>                
                <div className="">
                  <label htmlFor="sex" className="block text-gray-700 mb-2">
                    Sex
                  </label>
                  <select id="sex" name="sex" value={formData.sex} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300">
                    <option value="">Select Sex</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? 'Updating...' : 'Update Profile'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Right Column: Additional Information */}
      
      <AdditionalInfo
        salary={salary}
        isAvailable={isAvailable}
       
      />
    </div>
  );
};

export default Profile;
