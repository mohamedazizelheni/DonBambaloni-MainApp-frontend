import React from 'react';
import Button from '@/components/common/Button';
import Image from 'next/image';
import { FiEdit, FiUsers, FiEye } from 'react-icons/fi';
import Link from 'next/link';

const EntityCard = ({ entity, entityType, onManageTeam, onEdit }) => {
  const imageUrl = entity.image
    ? `${process.env.NEXT_PUBLIC_API_IMAGE_URL}/${entity.image}`
    : '/placeholder-image.png';

  return (
    <div className="bg-white rounded-lg shadow-lg transition-shadow duration-200 hover:shadow-xl flex flex-col h-full">
      {/* Display full image with fixed height */}
      <div className="relative w-full h-60 overflow-hidden">
        <Image
          src={imageUrl}
          alt={entity.name}
          layout="fill"
          objectFit="cover"
          className="rounded-t-lg"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between p-4 flex-grow">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">{entity.name}</h3>
          <Link href={`/${entityType}/${entity._id}`} passHref>
            <p className="text-blue-500 hover:text-blue-700 transition-colors">
              <FiEye className="inline-block" size={20} color='black' />
            </p>
          </Link>
        </div>
        <p className="text-gray-500 text-sm mb-4">{entity.address}</p>

        <div className="flex justify-between items-center mt-4">
          <button
            className="flex items-center px-3 py-2 text-sm text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
            onClick={onManageTeam}
          >
            <FiUsers className="mr-1" /> Manage Team
          </button>

          <button
            className="flex items-center px-3 py-2 text-sm text-gray-600 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
            onClick={() => onEdit(entity)}
          >
            <FiEdit className="mr-1" /> Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default EntityCard;
