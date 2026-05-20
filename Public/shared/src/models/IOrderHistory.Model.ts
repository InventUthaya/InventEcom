export interface IOrderHistory {
    Id: number;
    OrderId: number;
    StatusId: number;
    AssignedTo?: number;
    Amount?: number;
    TransactionDate: any;
    AppointmentDate: any;
    Comments: string;
    Active: boolean;
    Created: any;
    CreatedBy: number;
    Modified: any;
    ModifiedBy: number;
    StatusName: string;
    AssigneeName: string;
    ColorCode: string;
}