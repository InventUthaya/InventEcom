export const HelperConstant = {
  orderStatus: {
    PendingOrders: "Pending",
    CompletedOrder: "Completed",
    ProcessingOrder: "Processing",
    Cancelled: "Cancelled",
    Rejected: "Rejected",
    Confirmed: "Confirmed",
    Assigned: "Assigned"
  },

  ResendOtpTime: 10
};

export const Roles = {
  Admin: 1,
  Rider: 4,
  Partner:5
};

export const OrderStausMaster = {
  Pending: 1,
  Confirmed: 2,
  Cancelled: 3,
  Completed: 4,
  Rejected: 5,
  Shipped: 6,
  Assigned: 7
};
