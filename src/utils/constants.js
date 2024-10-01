export const ROLES = {
  ADMIN: 'Admin',
  CHEF: 'Chef',
  CASHIER: 'Cashier',
  CLEANER: 'Cleaner',
  TRAINEE_CHEF: 'TraineeChef',
  DRIVER: 'Driver',
  };
 export const RoleColors = {
    Admin: 'bg-green-100 border border-green-400 text-green-800',
    Chef: 'bg-pink-100 border border-pink-400 text-pink-800',
    Cashier: 'bg-purple-100 border border-purple-400 text-purple-800',
    Cleaner: 'bg-pink-100 border border-pink-400 text-pink-800',
    TraineeChef: 'bg-orange-100 border border-orange-400 text-orange-800',
    Driver: 'bg-blue-100 border border-blue-400 text-blue-800',
  };
  
export const AvailabilityStatus = {
    AVAILABLE: 'Available',
    UNAVAILABLE: 'Unavailable',
  };
  
export const ActionType = {
    AVAILABILITY_UPDATED: 'AvailabilityUpdated',
    USER_DELETED: 'UserDeleted',
    ASSIGNED_TO_KITCHEN: 'AssignedToKitchen',
    UNASSIGNED_FROM_KITCHEN: 'UnassignedFromKitchen',
    ASSIGNED_TO_SHOP: 'AssignedToShop',
    UNASSIGNED_FROM_SHOP: 'UnassignedFromShop',
    };  

  export const ShiftType = {
    MORNING: 'Morning',
    AFTERNOON: 'Afternoon',
    NIGHT: 'Night',
    BOTH: 'Both',
  };