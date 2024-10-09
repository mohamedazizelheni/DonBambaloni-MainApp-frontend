import React, { useState } from 'react';
import Button from '@/components/common/Button';
import Pagination from '@/components/common/Pagination';
import EntityCard from './EntityCard';
import AddEntityModal from './AddEntityModal';
import useEntities from '@/hooks/useEntities'; // SWR hook to fetch kitchens or shops
import { addEntity, updateEntity } from '@/services/entityService';
import ManageTeamModal from '../admin/Users/ManageTeamModal';
import { assignUsersToKitchenShift } from '@/services/kitchenService';
import { assignUsersToShopShift } from '@/services/shopService';
import Spinner from './Spinner';

const EntityManager = ({ entityType }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editEntity, setEditEntity] = useState(null); // Track the entity being edited (if any)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); 

  // Use the custom SWR hook to fetch either kitchens or shops
  const { entities, totalEntities, totalPages, isLoading, error, mutate } = useEntities(entityType, currentPage, itemsPerPage);

  const handleAddOrUpdateEntity = async (entityData) => {
    try {
      if (editEntity) {
        // If we're editing, call the update function
        await updateEntity(entityType, editEntity._id, entityData);
      } else {
        // If we're adding a new entity, call the add function
        await addEntity(entityType, entityData);
      }
      mutate(); // Revalidate data after adding or updating
      setIsAddModalOpen(false);
      setEditEntity(null); // Reset editEntity after update
    } catch (error) {
      console.error('Failed to add/update entity:', error);
    }
  };
  const handleManageTeam = (entity) => {
    setSelectedEntity(entity);
    setIsModalOpen(true);
  };
  const handleSaveTeam = async (userIds, shiftType) => {
    if (entityType === 'kitchens') {
        await assignUsersToKitchenShift(selectedEntity._id, { userIds, shiftType });
      } else if (entityType === 'shops') {
        await assignUsersToShopShift(selectedEntity._id, { userIds, shiftType });
      }
    setIsModalOpen(false);
    mutate();
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEdit = (entity) => {
    setEditEntity(entity); // Set the entity to be edited
    setIsAddModalOpen(true); // Open the modal
  };

  const filteredEntities = entities.filter((entity) =>
    entity.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <div className="text-center"><Spinner/> </div>;
  }

  if (error) {
    return <div className="text-red-500">Failed to fetch entities: {error.message}</div>;
  }

  return (
    <div className='max-w-7xl mx-auto'>
      <div className="flex justify-between items-center mt-9">
        <p className="text-lg md:text-xl font-semibold text-gray-900">
          {entityType === 'kitchens' ? 'Kitchens' : 'Shops'}: <span className="text-gray-500 font-medium">{totalEntities}</span>
        </p>
        <div className="flex justify-end space-x-2">
        <input
            type="text"
            placeholder={`Search ${entityType === 'kitchens' ? 'kitchens' : 'shops'}...`}
            className="w-full md:w-auto border rounded-lg px-4 py-2 text-base hidden md:block"
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        <Button onClick={() => setIsAddModalOpen(true)}>Add {entityType === 'kitchens' ? 'Kitchen' : 'Shop'}</Button>
        </div>
      </div>
      <div className="w-full block md:hidden">
          <input
            type="text"
            placeholder={`Search ${entityType === 'kitchens' ? 'kitchens' : 'shops'}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-auto border rounded-lg px-4 py-2 text-base mt-4"
          />
        </div>
      <div className=" mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredEntities.length > 0 ? (
          filteredEntities.map((entity) => (
            <EntityCard
            key={entity._id}
            entity={entity}
            entityType={entityType}
            onManageTeam={() => handleManageTeam(entity)}
            onEdit={handleEdit} 
            />
          ))
        ) : (
          <div>No {entityType === 'kitchens' ? 'kitchens' : 'shops'} available.</div>
        )}
      </div>

      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      )}

      {isAddModalOpen && (
        <AddEntityModal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditEntity(null); // Reset editEntity when closing the modal
          }}
          onSubmit={handleAddOrUpdateEntity}
          entityType={entityType}
          entityData={editEntity} // Pass the entity data to the modal (null for add)
        />
      )}
        <ManageTeamModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        entity={selectedEntity}
        entityType={entityType}
        onSave={handleSaveTeam}
        />
    </div>
  );
};

export default EntityManager;
