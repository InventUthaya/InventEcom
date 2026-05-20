export interface IAddressModel {
  // Core database fields from API
  Id: number;
  UserId: number;
  AddressLine1: string;
  AddressLine2?: string | null;
  City: string;
  State: string;
  Pincode: string;
  Country: string;
  isDefault: 1 | 0;                  // 1 = default, 0 = not default
  DisplayInList?: boolean;
  IsActive: boolean;

  // Audit fields
  Created: string;                   // ISO date string
  CreatedBy: string;
  Modified?: string | null;
  ModifiedBy?: string | null;

  Name?: string | null;              // Used in newer API responses (e.g., "vj")
  AddressType?: string | null;       // e.g., "Work", "Home"
  PhoneNumber?: string | null;        // Direct from address (overrides profile if present)

  // Validation
  IsValid?: boolean;
  ValidationErrors?: {
    Items: any[];
  };

  FirstName?: string;
  FullName?: string;
  Phone?: string;
  Email?: string;

  EncryptedAddressId?: string;
}

export interface GetAddressModel {
    Id: number;
    Salutation?: string;
    Title?: string;
    FirstName: string;
    LastName: string;
    Email?: string;
    Company?: string;
    CountryId?: number;
    StateProvinceId?: number;
    City?: string;
    Address1: string;
    Address2?: string;
    ZipPostalCode?: string;
    PhoneNumber?: string;
    FaxNumber?: string;
    CreatedOnUtc: string;
    Published?: boolean;
    IsValid: boolean;
    ValidationErrors?: { Items: any[] };
}


export interface ISellButtonConfig {
    IsSellEnabled: boolean;
    SellIndiaUrl: string
    SellUAEUrl: string
}