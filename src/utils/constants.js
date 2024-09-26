export const ROLES = {
  ADMIN: 'Admin',
  CHEF: 'Chef',
  CASHIER: 'Cashier',
  CLEANER: 'Cleaner',
  TRAINEE_CHEF: 'TraineeChef',
  DRIVER: 'Driver',
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