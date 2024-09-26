// src/components/chef/KitchenManagement/KitchenList.jsx
import React from 'react';
import useKitchens from '@/hooks/useKitchens';

const KitchenList = () => {
  const { kitchens, isLoading, isError, mutate } = useKitchens();

  if (isLoading) return <div>Loading kitchens...</div>;
  if (isError) return <div>Error loading kitchens.</div>;

  return (
    <div>
      <h2 className="text-xl mb-4">Kitchen Management</h2>
      {/*<KitchenForm mutate={mutate} />*/}
      <ul>
        {kitchens.map((kitchen) => (
          <li key={kitchen.id} className="border p-2 my-2">
            <h3 className="font-bold">{kitchen.name}</h3>
            <p>{kitchen.address}</p>
            {/* Add more kitchen details and actions */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default KitchenList;
