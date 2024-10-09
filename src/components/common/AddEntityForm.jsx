import React, { useState, useEffect } from 'react';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Image from 'next/image';

const AddEntityForm = ({ entityType, onSubmit, onClose, entityData }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    operatingShifts: [],
    image: null,
  });
  const [previewImage, setPreviewImage] = useState(null); // For image preview
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form data when updating
  useEffect(() => {
    if (entityData) {
      setFormData({
        name: entityData.name || '',
        address: entityData.address || '',
        operatingShifts: entityData.operatingShifts || [],
        image: null, // Reset image to null on load (user can upload a new one)
      });

      // Set the preview image if it exists
      if (entityData.image) {
        const imageUrl = `${process.env.NEXT_PUBLIC_API_IMAGE_URL}/${entityData.image}`.replace(/\\/g, '/');
        setPreviewImage(imageUrl);
      
    }
    }
  }, [entityData]);

  console.log(previewImage)
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files.length > 0) {
      const file = files[0];
      setFormData((prevData) => ({ ...prevData, image: file }));

      // Create preview for the new image
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleShiftChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prevData) => {
      const newShifts = checked
        ? [...prevData.operatingShifts, value]
        : prevData.operatingShifts.filter((shift) => shift !== value);
      return { ...prevData, operatingShifts: newShifts };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (!formData.name || !formData.address || formData.operatingShifts.length === 0) {
      setError('Please fill in all required fields.');
      setIsSubmitting(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('address', formData.address);
      formData.operatingShifts.forEach((shift) => {
        formDataToSend.append('operatingShifts', shift);
      });

      // Append the image if it's a new file
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      // Send the request to add or update the entity
      await onSubmit(formDataToSend);
      onClose();
    } catch (err) {
      setError('Failed to submit the form. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Show the current image if available */}
      {previewImage ? (
        <div className="mb-4">
          <Image src={previewImage} alt="Preview" className="w-32 h-32 object-cover mx-auto rounded-lg mb-4" height={100} width={100} crossOrigin="anonymous"
 />
        </div>
      ) : (
        <div>No image available</div>
      )}

      <Input
        label={`${entityType === 'kitchens' ? 'Kitchen' : 'Shop'} Name`}
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <Input
        label="Address"
        name="address"
        value={formData.address}
        onChange={handleChange}
        required
      />

      {/* Shift selection checkboxes */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Operating Shifts</label>
        {['Morning', 'Afternoon', 'Night'].map((shift) => (
          <div key={shift} className="mb-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="operatingShifts"
                value={shift}
                checked={formData.operatingShifts.includes(shift)}
                onChange={handleShiftChange}
              />
              <span className="ml-2">{shift}</span>
            </label>
          </div>
        ))}
      </div>

      <Input
        label="Image"
        name="image"
        type="file"
        accept="image/*"
        onChange={handleChange}
      />

      <div className="flex justify-between">
      <Button onClick={onClose} className='bg-gray-400 hover:bg-gray-500'>Close</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : `Submit ${entityType === 'kitchens' ? 'Kitchen' : 'Shop'}`}
        </Button>
        
      </div>
    </form>
  );
};

export default AddEntityForm;

