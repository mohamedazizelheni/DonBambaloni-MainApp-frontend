import React from 'react';
import Modal from 'react-modal';
import AddEntityForm from './AddEntityForm';
import Button from '@/components/common/Button';

Modal.setAppElement('#__next');

const AddEntityModal = ({ isOpen, onClose, onSubmit, entityType,entityData }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel={`Add ${entityType === 'kitchens' ? 'Kitchen' : 'Shop'}`}
      className="max-w-lg mx-auto mt-10 bg-white rounded-lg shadow-lg p-4 md:max-w-2xl md:p-8 z-50 relative"
      overlayClassName="fixed inset-0 bg-black bg-opacity-55 z-50 flex items-center justify-center"
    >
      <div className="mb-4">
        <h2 className="text-xl font-semibold">
          Add {entityType === 'kitchens' ? 'Kitchen' : 'Shop'}
        </h2>
      </div>
      <AddEntityForm entityType={entityType} entityData={entityData} onSubmit={onSubmit} onClose={onClose} />
      
    </Modal>
  );
};

export default AddEntityModal;
