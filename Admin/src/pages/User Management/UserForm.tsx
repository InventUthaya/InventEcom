import React, { useState, useEffect } from 'react';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import CommonService from '../../services/CommonService';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import PageMeta from '../../components/common/PageMeta';
import PartnerForm from './PartnerForm';
import { cdnURLs } from '../../components/helper/constants';

type PartnerErrorType = {
  Name?: string;
  CompanyName?: string;
  Email?: string;
  PhoneNumber?: string;
  GSTNumber?: string;
  PanCardNumber?: string;
  BankName?: string;
  IFSCCode?: string;
  AccountNumber?: string;
  AccountHolderName?: string;
  CommissionSlabId?: string;
  ChequeLeaf?: string;
  Signature?: string;
};

interface commissionSlabDetalis {
  CommissionSlabId: number;
  MaxCommissionAmount: any;
  MinCommissionAmount: any;
  Percentage: any;
}

const UserCreate = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [partnerErrors, setPartnerErrors] = useState<PartnerErrorType>({});
  const [duplicateErrors, setDuplicateErrors] = useState<{ email?: string; phone?: string }>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [checkingDuplicate, setCheckingDuplicate] = useState(false);

  const isEditMode = !!id;

  const token = sessionStorage.getItem('Token');
  let decodedToken: any = null;
  if (token) {
    try {
      decodedToken = jwtDecode(token);
    } catch (error) {
      console.error('Error decoding JWT:', error);
    }
  }
  const userId = decodedToken?.UserId || 1;

  const [formData, setFormData] = useState({
    User: {
      FullName: '',
      DisplayInList: true,
      IsActive: true,
      CreatedBy: userId.toString(),
      ModifiedBy: userId.toString(),
    },
    UserLogin: {
      Email: '',
      Phone: '',
      PasswordHash: '',
      DisplayInList: true,
      IsActive: true,
      CreatedBy: userId.toString(),
      ModifiedBy: userId.toString(),
    },
    UserRole: {
      RoleId: 0,
      DisplayInList: true,
      IsActive: true,
      CreatedBy: userId.toString(),
      ModifiedBy: userId.toString(),
    },
    UserAddresses: [
      {
        Name: '',
        PhoneNumber: '',
        AddressType: '',
        AddressLine1: '',
        AddressLine2: '',
        City: '',
        State: '',
        Country: '',
        Pincode: '',
        DisplayInList: true,
        IsActive: true,
        CreatedBy: userId.toString(),
        ModifiedBy: userId.toString(),
      },
    ],
  });

  const [partnerData, setPartnerData] = useState({
    Partner: {
      Name: "",
      CompanyName: "",
      Email: "",
      PhoneNumber: "",
      Password: "",
      GSTNumber: "",
      PanCardNumber: "",
      BankName: "",
      IFSCCode: "",
      AccountNumber: "",
      AccountHolderName: "",
      CommissionSlabId: 0,
    },
    Documents: {
      ChequeLeaf: null as File | null,
      Signature: null as File | null,
    },
    existingFiles: {
      ChequeLeaf: null as string | null,
      Signature: null as string | null,
    },
    partnerId: 0 as number, // ← Added to store existing Partner ID
  });

  const [roles, setRoles] = useState<{ id: number; name: string }[]>([]);
  const [commissionSlab, setcommissionSlab] = useState<{ id: number; name: string }[]>([]);
  const [commissionSlabDetails, setcommissionSlabDetails] = useState<commissionSlabDetalis[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [rolesLoading, setRolesLoading] = useState(false);

  // Hardcoded: Partner role ID is 5
  const isPartner = formData.UserRole.RoleId === 5;

  const fetchRoles = async () => {
    setRolesLoading(true);
    setError(null);
    try {
      const res = await CommonService.get('rolemaster', 'rolelist', 'noParam');
      const transformedRoles = res.data
        .filter((role: any) => role.IsActive && role.Id > 0)
        .map((role: any) => ({
          id: role.Id,
          name: role.RoleName,
        }));
      setRoles(transformedRoles);

      if (transformedRoles.length > 0 && formData.UserRole.RoleId === 0) {
        setFormData((prev) => ({
          ...prev,
          UserRole: { ...prev.UserRole, RoleId: transformedRoles[0].id },
        }));
      }
      return transformedRoles;
    } catch (e: any) {
      console.error('Error fetching roles:', e);
      setError('Failed to fetch roles. Please try again.');
      return [];
    } finally {
      setRolesLoading(false);
    }
  };

  const fetchCommission = async () => {
    setError(null);
    try {
      const res = await CommonService.get('products', 'GetAllCommissionSlab', 'noParam');
      const transformedCommission = res.data
        .filter((commission: any) => commission.Id > 0)
        .map((commission: any) => ({
          id: commission.Id,
          name: commission.Name,
        }));
      setcommissionSlab(transformedCommission);
      return transformedCommission;
    } catch (e: any) {
      console.error('Error fetching commissionSlab:', e);
      setError('Failed to fetch commissionSlab. Please try again.');
      return [];
    }
  };

  const fetchCommissionSlabDetails = async () => {
    setError(null);
    try {
      const res = await CommonService.get('products', 'GetAllCommissionSlabDetails', 'noParam');
      const transformedCommission = res.data
      setcommissionSlabDetails(transformedCommission);
      return transformedCommission;
    } catch (e: any) {
      console.error('Error fetching commissionSlab:', e);
      setError('Failed to fetch commissionSlab. Please try again.');
      return [];
    }
  };


  const fetchUserData = async (availableRoles: any[]) => {
    setLoading(true);
    try {
      const res = await CommonService.get('User', id, 'noParam');
      const userData = res.data.UserDetails;
      if (!userData || userData.UserID === 0) {
        throw new Error('User data not found');
      }

      const validRoleId = availableRoles.find((role) => role.id === (userData.UserRoles?.[0]?.RoleId || 0))
        ? userData.UserRoles?.[0]?.RoleId || 0
        : availableRoles.length > 0
          ? availableRoles[0].id
          : 0;

      setFormData({
        User: {
          FullName: userData.FullName || '',
          DisplayInList: userData.DisplayInList ?? true,
          IsActive: userData.IsActive ?? true,
          CreatedBy: userData.CreatedBy || userId.toString(),
          ModifiedBy: userId.toString(),
        },
        UserLogin: {
          Email: userData.UserLogin?.[0]?.Email || '',
          Phone: userData.UserLogin?.[0]?.Phone || '',
          PasswordHash: '',
          DisplayInList: userData.UserLogin?.[0]?.DisplayInList ?? true,
          IsActive: userData.UserLogin?.[0]?.IsActive ?? true,
          CreatedBy: userData.UserLogin?.[0]?.CreatedBy || userId.toString(),
          ModifiedBy: userId.toString(),
        },
        UserRole: {
          RoleId: validRoleId,
          DisplayInList: userData.UserRoles?.[0]?.DisplayInList ?? true,
          IsActive: userData.UserRoles?.[0]?.IsActive ?? true,
          CreatedBy: userData.UserRoles?.[0]?.CreatedBy || userId.toString(),
          ModifiedBy: userId.toString(),
        },
        UserAddresses: userData.UserAddresses?.length > 0
          ? userData.UserAddresses.map((addr: any) => ({
            Name: addr.Name || '',
            PhoneNumber: addr.PhoneNumber || '',
            AddressType: addr.AddressType || '',
            AddressLine1: addr.AddressLine1 || '',
            AddressLine2: addr.AddressLine2 || '',
            City: addr.City || '',
            State: addr.State || '',
            Country: addr.Country || '',
            Pincode: addr.Pincode || '',
            DisplayInList: addr.DisplayInList ?? true,
            IsActive: addr.IsActive ?? true,
            CreatedBy: addr.CreatedBy || userId.toString(),
            ModifiedBy: userId.toString(),
          }))
          : [
            {
              Name: '',
              PhoneNumber: '',
              AddressType: '',
              AddressLine1: '',
              AddressLine2: '',
              City: '',
              State: '',
              Country: '',
              Pincode: '',
              DisplayInList: true,
              IsActive: true,
              CreatedBy: userId.toString(),
              ModifiedBy: userId.toString(),
            },
          ],
      });

      // Pre-fill partner data if exists (for edit mode)
      if (userData.PartnerMaster && userData.PartnerMaster.length > 0) {
        // Find the partner entry with valid commissionSlabId (>0), fallback to first
        const partner = userData.PartnerMaster.find((p: any) => p.commissionSlabId > 0)
          || userData.PartnerMaster[0];

        setPartnerData(prev => ({
          ...prev,
          partnerId: partner.Id || 0,
          Partner: {
            Name: partner.Name || '',
            CompanyName: partner.CompanyName || '',
            Email: partner.Email || '',
            PhoneNumber: partner.PhoneNumber || '',
            Password: '',
            GSTNumber: partner.GSTNumber || '',
            PanCardNumber: partner.PanCardNumber || '',
            BankName: partner.BankName || '',
            IFSCCode: partner.IFSCCode || '',
            AccountNumber: partner.AccountNumber || '',
            AccountHolderName: partner.AccountHolderName || '',
            CommissionSlabId: partner.commissionSlabId || 0,
          },
          existingFiles: {
            ChequeLeaf: cdnURLs(partner.ChequeLeaf) || null,
            Signature: cdnURLs(partner.Signature) || null,
          }
        }));
      }
    } catch (e: any) {
      console.error('Error fetching user data:', e);
      setError(e.response?.data?.message || 'Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      const fetchedRoles = await fetchRoles();
      await fetchCommission();
      await fetchCommissionSlabDetails();
      if (isEditMode) {
        await fetchUserData(fetchedRoles);
      }
    };
    initializeData();
  }, [id]);

  // Sync Email & Phone from main form to Partner form
  useEffect(() => {
    if (isPartner) {
      setPartnerData((prev) => ({
        ...prev,
        Partner: {
          ...prev.Partner,
          Email: formData.UserLogin.Email || prev.Partner.Email,
          PhoneNumber: formData.UserLogin.Phone || prev.Partner.PhoneNumber,
        },
      }));
    }
  }, [isPartner, formData.UserLogin.Email, formData.UserLogin.Phone]);

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRoleId = parseInt(e.target.value, 10) || 0;
    setFormData((prev) => ({
      ...prev,
      UserRole: {
        ...prev.UserRole,
        RoleId: newRoleId,
      },
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, section: 'User' | 'UserLogin', field: string) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
    // Clear field error on change
    const key = `${section}.${field}`;
    setFieldErrors((prev) => { const next = { ...prev }; delete next[key]; return next; });
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: string, index = 0) => {
    const value = e.target.value;
    setFormData((prev) => {
      const updatedAddresses = [...prev.UserAddresses];
      updatedAddresses[index] = { ...updatedAddresses[index], [field]: value };
      return { ...prev, UserAddresses: updatedAddresses };
    });
    // Clear field error on change
    const key = `Address[${index}].${field}`;
    setFieldErrors((prev) => { const next = { ...prev }; delete next[key]; return next; });
  };

  const handleAddAddress = () => {
    setFormData((prev) => ({
      ...prev,
      UserAddresses: [
        ...prev.UserAddresses,
        {
          Name: '',
          PhoneNumber: '',
          AddressType: '',
          AddressLine1: '',
          AddressLine2: '',
          City: '',
          State: '',
          Country: '',
          Pincode: '',
          DisplayInList: true,
          IsActive: true,
          CreatedBy: userId.toString(),
          ModifiedBy: userId.toString(),
        },
      ],
    }));
  };

  const handleRemoveAddress = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      UserAddresses: prev.UserAddresses.filter((_, i) => i !== index),
    }));
  };

  const generatePartnerPassword = () => {
    const pwd = Math.random().toString(36).slice(-10);
    setPartnerData((prev) => ({
      ...prev,
      Partner: { ...prev.Partner, Password: pwd },
    }));
  };

  const handlePartnerChange = (e: React.ChangeEvent<HTMLInputElement>, section: string, field: string) => {
    const value = e.target.value;
    setPartnerData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const handlePartnerFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "ChequeLeaf" | "Signature"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Always clear previous error for this field
    setPartnerErrors((prev: any) => ({
      ...prev,
      [field]: "",
    }));

    if (field === "Signature") {
      const img = new Image();

      img.onload = () => {
        if (img.width !== 500 || img.height !== 500) {
          // ❌ invalid image → show error ONLY
          setPartnerErrors((prev: any) => ({
            ...prev,
            Signature: "Signature must be exactly 500×500 pixels",
          }));

          // IMPORTANT: reset file input so retry doesn't re-mount form
          e.target.value = "";
          return;
        }

        // ✅ valid image
        setPartnerData((prev: any) => ({
          ...prev,
          Documents: {
            ...prev.Documents,
            Signature: file,
          },
        }));
      };

      img.onerror = () => {
        setPartnerErrors((prev: any) => ({
          ...prev,
          Signature: "Invalid image file",
        }));
        e.target.value = "";
      };

      img.src = URL.createObjectURL(file);
    } else {
      // Cheque Leaf (no dimension validation)
      setPartnerData((prev: any) => ({
        ...prev,
        Documents: {
          ...prev.Documents,
          ChequeLeaf: file,
        },
      }));
    }
  };


  const validatePartnerData = (): boolean => {
    const errors: PartnerErrorType = {};
    const { Partner, Documents } = partnerData;

    if (!Partner.Name?.trim()) errors.Name = 'Partner name is required';
    if (!Partner.CompanyName?.trim()) errors.CompanyName = 'Company name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(Partner.Email)) errors.Email = 'Valid email is required';
    if (!/^\+?[0-9]{10,15}$/.test(Partner.PhoneNumber)) errors.PhoneNumber = 'Valid phone number is required';
    if (!Partner.GSTNumber?.trim()) errors.GSTNumber = 'GST number is required';
    if (!Partner.PanCardNumber?.trim()) errors.PanCardNumber = 'PAN number is required';
    if (!Partner.BankName?.trim()) errors.BankName = 'Bank name is required';
    if (!Partner.IFSCCode?.trim()) errors.IFSCCode = 'IFSC is required';
    if (!Partner.AccountNumber?.trim()) errors.AccountNumber = 'Account number is required';
    if (!Partner.AccountHolderName?.trim()) errors.AccountHolderName = 'Account holder name is required';

    if (!Documents.ChequeLeaf && !partnerData.existingFiles?.ChequeLeaf) {
      errors.ChequeLeaf = 'Cheque leaf is required';
    }
    if (!Documents.Signature && !partnerData.existingFiles?.Signature) {
      errors.Signature = 'Signature is required';
    }
    if (!Partner.CommissionSlabId || Partner.CommissionSlabId === 0) {
      errors.CommissionSlabId = 'Commission slab is required';
    }

    setPartnerErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPartnerErrors({});

    try {
      const { User, UserLogin, UserRole, UserAddresses } = formData;
      const errors: Record<string, string> = {};

      // Basic validations
      if (!User.FullName?.trim()) errors['User.FullName'] = 'Full name is required';
      if (!UserLogin.Email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(UserLogin.Email))
        errors['UserLogin.Email'] = 'Valid email is required';
      if (!UserLogin.Phone?.trim() || !/^\+?[1-9]\d{1,14}$/.test(UserLogin.Phone))
        errors['UserLogin.Phone'] = 'Valid phone number is required';
      if (!isEditMode && !UserLogin.PasswordHash?.trim())
        errors['UserLogin.PasswordHash'] = 'Password is required for new users';
      if (!UserRole.RoleId || !roles.some((r) => r.id === UserRole.RoleId))
        errors['UserRole.RoleId'] = 'Valid role is required';

      UserAddresses.forEach((addr, index) => {
        if (!addr.Name?.trim()) errors[`Address[${index}].Name`] = 'Name is required';
        if (!addr.PhoneNumber?.trim() || !/^\+?[1-9]\d{1,14}$/.test(addr.PhoneNumber)) 
          errors[`Address[${index}].PhoneNumber`] = 'Valid phone number is required';
        if (!addr.AddressType?.trim()) errors[`Address[${index}].AddressType`] = 'Address type is required';
        if (!addr.AddressLine1?.trim()) errors[`Address[${index}].AddressLine1`] = 'Address line 1 is required';
        if (!addr.City?.trim()) errors[`Address[${index}].City`] = 'City is required';
        if (!addr.State?.trim()) errors[`Address[${index}].State`] = 'State is required';
        if (!addr.Country?.trim()) errors[`Address[${index}].Country`] = 'Country is required';
        if (!addr.Pincode?.trim()) errors[`Address[${index}].Pincode`] = 'Pincode is required';
      });

      setFieldErrors(errors);

      if (Object.keys(errors).length > 0) {
        setLoading(false);
        return; // Stay on form and show fieldErrors
      }

      // Fresh duplicate check on submit (handles case where user didn't blur the fields)
      const excludeId = isEditMode ? parseInt(id!) : undefined;
      const newDuplicates: { email?: string; phone?: string } = {};

      try {
        const emailParams = `email=${encodeURIComponent(UserLogin.Email)}${excludeId ? `&excludeUserId=${excludeId}` : ''}`;
        const emailRes = await CommonService.get('User', `check-duplicate?${emailParams}`, 'noParam');
        if (emailRes.data?.emailExists) newDuplicates.email = 'This email is already registered';
      } catch { /* silent */ }

      try {
        const phoneParams = `phone=${encodeURIComponent(UserLogin.Phone)}${excludeId ? `&excludeUserId=${excludeId}` : ''}`;
        const phoneRes = await CommonService.get('User', `check-duplicate?${phoneParams}`, 'noParam');
        if (phoneRes.data?.phoneExists) newDuplicates.phone = 'This phone number is already registered';
      } catch { /* silent */ }

      if (newDuplicates.email || newDuplicates.phone) {
        setDuplicateErrors(newDuplicates);
        setLoading(false);
        return; // Stay on form — inline errors are now visible under the fields
      }

      setDuplicateErrors({});

      // Partner validation
      if (isPartner) {
        const isValid = validatePartnerData();
        if (!isValid) {
          setLoading(false);
          return;
        }
      }

      // Build FormData for multipart request
      const payload = new FormData();

      // Append User object
      payload.append('User.FullName', User.FullName);
      payload.append('User.DisplayInList', User.DisplayInList.toString());
      payload.append('User.IsActive', User.IsActive.toString());
      payload.append('User.CreatedBy', User.CreatedBy);
      payload.append('User.ModifiedBy', User.ModifiedBy);

      // Append UserLogin
      payload.append('UserLogin.Email', UserLogin.Email);
      payload.append('UserLogin.Phone', UserLogin.Phone);
      payload.append('UserLogin.PasswordHash', UserLogin.PasswordHash || '');
      payload.append('UserLogin.DisplayInList', UserLogin.DisplayInList.toString());
      payload.append('UserLogin.IsActive', UserLogin.IsActive.toString());
      payload.append('UserLogin.CreatedBy', UserLogin.CreatedBy);
      payload.append('UserLogin.ModifiedBy', UserLogin.ModifiedBy);

      // Append UserRole
      payload.append('UserRole.RoleId', UserRole.RoleId.toString());
      payload.append('UserRole.DisplayInList', UserRole.DisplayInList.toString());
      payload.append('UserRole.IsActive', UserRole.IsActive.toString());
      payload.append('UserRole.CreatedBy', UserRole.CreatedBy);
      payload.append('UserRole.ModifiedBy', UserRole.ModifiedBy);

      // Append UserAddresses (multiple)
      UserAddresses.forEach((addr, index) => {
        payload.append(`UserAddresses[${index}].Name`, addr.Name);
        payload.append(`UserAddresses[${index}].PhoneNumber`, addr.PhoneNumber);
        payload.append(`UserAddresses[${index}].AddressType`, addr.AddressType);
        payload.append(`UserAddresses[${index}].AddressLine1`, addr.AddressLine1);
        payload.append(`UserAddresses[${index}].AddressLine2`, addr.AddressLine2 || '');
        payload.append(`UserAddresses[${index}].City`, addr.City);
        payload.append(`UserAddresses[${index}].State`, addr.State);
        payload.append(`UserAddresses[${index}].Country`, addr.Country);
        payload.append(`UserAddresses[${index}].Pincode`, addr.Pincode);
        payload.append(`UserAddresses[${index}].DisplayInList`, addr.DisplayInList.toString());
        payload.append(`UserAddresses[${index}].IsActive`, addr.IsActive.toString());
        payload.append(`UserAddresses[${index}].CreatedBy`, addr.CreatedBy);
        payload.append(`UserAddresses[${index}].ModifiedBy`, addr.ModifiedBy);
      });

      // Append UserRoleMapping (same as UserRole)
      payload.append('UserRole.RoleId', UserRole.RoleId.toString());
      payload.append('UserRole.DisplayInList', UserRole.DisplayInList.toString());
      payload.append('UserRole.IsActive', UserRole.IsActive.toString());
      payload.append('UserRole.CreatedBy', UserRole.CreatedBy);
      payload.append('UserRole.ModifiedBy', UserRole.ModifiedBy);

      // PartnerMaster handling
      if (!isPartner) {
        payload.append('PartnerMaster', 'null');
      } else {
        // Send PartnerMaster.Id only in edit mode if it exists
        if (isEditMode && partnerData.partnerId > 0) {
          payload.append('PartnerMaster.Id', partnerData.partnerId.toString());
        }

        payload.append('PartnerMaster.Name', partnerData.Partner.Name);
        payload.append('PartnerMaster.CompanyName', partnerData.Partner.CompanyName);
        payload.append('PartnerMaster.Email', partnerData.Partner.Email);
        payload.append('PartnerMaster.PhoneNumber', partnerData.Partner.PhoneNumber);
        payload.append('PartnerMaster.GSTNumber', partnerData.Partner.GSTNumber);
        payload.append('PartnerMaster.PanCardNumber', partnerData.Partner.PanCardNumber);
        payload.append('PartnerMaster.BankName', partnerData.Partner.BankName);
        payload.append('PartnerMaster.IFSCCode', partnerData.Partner.IFSCCode);
        payload.append('PartnerMaster.AccountNumber', partnerData.Partner.AccountNumber);
        payload.append('PartnerMaster.AccountHolderName', partnerData.Partner.AccountHolderName);
        payload.append('PartnerMaster.CommissionSlabId', partnerData.Partner.CommissionSlabId?.toString() || '0');

        // Only append new files if user uploaded them
        if (partnerData.Documents.ChequeLeaf) {
          payload.append('PartnerMaster.ChequeLeaf', partnerData.Documents.ChequeLeaf, partnerData.Documents.ChequeLeaf.name);
        }
        if (partnerData.Documents.Signature) {
          payload.append('PartnerMaster.Signature', partnerData.Documents.Signature, partnerData.Documents.Signature.name);
        }
      }

      const endpoint = isEditMode ? `update/${id}` : 'create';

      await CommonService.post('User', endpoint, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      navigate('/user-management', {
        state: {
          successMessage: isEditMode
            ? 'User updated successfully'
            : 'User created successfully' + (isPartner ? ' with Partner details' : ''),
        },
      });
    } catch (e: any) {
      console.error('Submission error:', e);
      setError(e.message || `Failed to ${isEditMode ? 'update' : 'create'} user`);
    } finally {
      setLoading(false);
    }
  };

  if (loading || rolesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-2 sm:px-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-gray-600 text-sm sm:text-base">{isEditMode ? 'Loading user data...' : 'Loading form...'}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageMeta title={`${isEditMode ? 'Edit' : 'Create'} User | SmartStore`} description="Error loading form" />
        <PageBreadcrumb pageTitle={isEditMode ? 'Edit User' : 'Create User'} />
        <div className="w-full py-4 px-2 sm:px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-600 text-sm sm:text-base">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm sm:text-base"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageMeta title={`${isEditMode ? 'Edit' : 'Create'} User | SmartStore`} description={`${isEditMode ? 'Edit' : 'Create'} a user`} />
      <PageBreadcrumb pageTitle={isEditMode ? 'Edit User' : 'Create User'} />
      <div className="w-full py-4 px-2 sm:px-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <UserPlus className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                {isEditMode ? 'Edit User' : 'Create New User'}
              </h1>
            </div>
            <button
              onClick={() => navigate('/user-management')}
              className="flex items-center text-blue-600 hover:text-blue-800 text-sm sm:text-base"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to User Management
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* User Details */}
              <div className="border-b border-gray-200 pb-4">
                <h2 className="text-base sm:text-lg font-medium text-gray-900 mb-4">User Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.User.FullName}
                      onChange={(e) => handleInputChange(e, 'User', 'FullName')}
                      className={`w-full px-3 py-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2 ${fieldErrors['User.FullName'] ? 'border-red-500 focus:ring-red-400 bg-red-50' : 'border-gray-300 focus:ring-blue-500'}`}
                      placeholder="Enter full name"
                    />
                    {fieldErrors['User.FullName'] && <p className="mt-1 text-xs text-red-600 flex items-center gap-1">⚠ {fieldErrors['User.FullName']}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={formData.UserRole.RoleId}
                      onChange={(e) => { handleRoleChange(e); setFieldErrors((prev) => { const next = { ...prev }; delete next['UserRole.RoleId']; return next; }); }}
                      className={`w-full px-3 py-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2 ${fieldErrors['UserRole.RoleId'] ? 'border-red-500 focus:ring-red-400 bg-red-50' : 'border-gray-300 focus:ring-blue-500'}`}
                    >
                      <option value="0" disabled>Select role</option>
                      {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                    {fieldErrors['UserRole.RoleId'] && <p className="mt-1 text-xs text-red-600 flex items-center gap-1">⚠ {fieldErrors['UserRole.RoleId']}</p>}
                  </div>
                </div>
              </div>

              {/* Login Details */}
              <div className="border-b border-gray-200 pb-4">
                <h2 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Login Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.UserLogin.Email}
                      onChange={(e) => { handleInputChange(e, 'UserLogin', 'Email'); setDuplicateErrors((prev) => { const n = { ...prev }; delete n.email; return n; }); }}
                      className={`w-full px-3 py-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2 ${fieldErrors['UserLogin.Email'] || duplicateErrors.email ? 'border-red-500 focus:ring-red-400 bg-red-50' : 'border-gray-300 focus:ring-blue-500'}`}
                      placeholder="Enter email"
                    />
                    {(fieldErrors['UserLogin.Email'] || duplicateErrors.email) && (
                      <p className="mt-1 text-xs text-red-600 flex items-center gap-1">⚠ {fieldErrors['UserLogin.Email'] || duplicateErrors.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.UserLogin.Phone}
                      onChange={(e) => { handleInputChange(e, 'UserLogin', 'Phone'); setDuplicateErrors((prev) => { const n = { ...prev }; delete n.phone; return n; }); }}
                      className={`w-full px-3 py-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2 ${fieldErrors['UserLogin.Phone'] || duplicateErrors.phone ? 'border-red-500 focus:ring-red-400 bg-red-50' : 'border-gray-300 focus:ring-blue-500'}`}
                      placeholder="Enter phone number (e.g., +1234567890)"
                    />
                    {(fieldErrors['UserLogin.Phone'] || duplicateErrors.phone) && (
                      <p className="mt-1 text-xs text-red-600 flex items-center gap-1">⚠ {fieldErrors['UserLogin.Phone'] || duplicateErrors.phone}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password {isEditMode ? '' : <span className="text-red-600">*</span>}
                    </label>
                    <input
                      type="password"
                      value={formData.UserLogin.PasswordHash}
                      onChange={(e) => handleInputChange(e, 'UserLogin', 'PasswordHash')}
                      className={`w-full px-3 py-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2 ${fieldErrors['UserLogin.PasswordHash'] ? 'border-red-500 focus:ring-red-400 bg-red-50' : 'border-gray-300 focus:ring-blue-500'}`}
                      placeholder={isEditMode ? 'Leave blank to keep existing password' : 'Enter password'}
                    />
                    {fieldErrors['UserLogin.PasswordHash'] && <p className="mt-1 text-xs text-red-600 flex items-center gap-1">⚠ {fieldErrors['UserLogin.PasswordHash']}</p>}
                  </div>
                </div>
              </div>

              {/* Address Details */}
              <div>
                <h2 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Address Details</h2>
                {formData.UserAddresses.map((address, index) => (
                  <div key={index} className="mb-6 border-b border-gray-200 pb-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-medium text-gray-700">Address {index + 1}</h3>
                      {formData.UserAddresses.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveAddress(index)}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          Remove Address
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${fieldErrors[`Address[${index}].Name`] ? 'border-red-500 focus:ring-red-400 bg-red-50' : 'border-gray-300 focus:ring-blue-500'}`}
                          placeholder="Enter Name"
                          value={address.Name}
                          onChange={(e) => handleAddressChange(e, 'Name', index)}
                        />
                        {fieldErrors[`Address[${index}].Name`] && <p className="mt-1 text-xs text-red-600 flex items-center gap-1">⚠ {fieldErrors[`Address[${index}].Name`]}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${fieldErrors[`Address[${index}].PhoneNumber`] ? 'border-red-500 focus:ring-red-400 bg-red-50' : 'border-gray-300 focus:ring-blue-500'}`}
                          placeholder="Enter phone number"
                          value={address.PhoneNumber}
                          onChange={(e) => handleAddressChange(e, 'PhoneNumber', index)}
                        />
                        {fieldErrors[`Address[${index}].PhoneNumber`] && <p className="mt-1 text-xs text-red-600 flex items-center gap-1">⚠ {fieldErrors[`Address[${index}].PhoneNumber`]}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address Type <span className="text-red-600">*</span>
                        </label>
                        <select
                          className={`w-full px-3 py-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2 ${fieldErrors[`Address[${index}].AddressType`] ? 'border-red-500 focus:ring-red-400 bg-red-50' : 'border-gray-300 focus:ring-blue-500'}`}
                          value={address.AddressType}
                          onChange={(e) => handleAddressChange(e, 'AddressType', index)}
                        >
                          <option value="">Select address type</option>
                          <option value="Home">Home</option>
                          <option value="Work">Work</option>
                          <option value="Other">Other</option>
                        </select>
                        {fieldErrors[`Address[${index}].AddressType`] && <p className="mt-1 text-xs text-red-600 flex items-center gap-1">⚠ {fieldErrors[`Address[${index}].AddressType`]}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1 <span className="text-red-600">*</span></label>
                        <input
                          type="text"
                          value={address.AddressLine1}
                          onChange={(e) => handleAddressChange(e, 'AddressLine1', index)}
                          className={`w-full px-3 py-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2 ${fieldErrors[`Address[${index}].AddressLine1`] ? 'border-red-500 focus:ring-red-400 bg-red-50' : 'border-gray-300 focus:ring-blue-500'}`}
                          placeholder="Enter address line 1"
                        />
                        {fieldErrors[`Address[${index}].AddressLine1`] && <p className="mt-1 text-xs text-red-600 flex items-center gap-1">⚠ {fieldErrors[`Address[${index}].AddressLine1`]}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                        <input
                          type="text"
                          value={address.AddressLine2}
                          onChange={(e) => handleAddressChange(e, 'AddressLine2', index)}
                          className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter address line 2 (optional)"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City <span className="text-red-600">*</span></label>
                        <input
                          type="text"
                          value={address.City}
                          onChange={(e) => handleAddressChange(e, 'City', index)}
                          className={`w-full px-3 py-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2 ${fieldErrors[`Address[${index}].City`] ? 'border-red-500 focus:ring-red-400 bg-red-50' : 'border-gray-300 focus:ring-blue-500'}`}
                          placeholder="Enter city"
                        />
                        {fieldErrors[`Address[${index}].City`] && <p className="mt-1 text-xs text-red-600 flex items-center gap-1">⚠ {fieldErrors[`Address[${index}].City`]}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">State <span className="text-red-600">*</span></label>
                        <input
                          type="text"
                          value={address.State}
                          onChange={(e) => handleAddressChange(e, 'State', index)}
                          className={`w-full px-3 py-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2 ${fieldErrors[`Address[${index}].State`] ? 'border-red-500 focus:ring-red-400 bg-red-50' : 'border-gray-300 focus:ring-blue-500'}`}
                          placeholder="Enter state"
                        />
                        {fieldErrors[`Address[${index}].State`] && <p className="mt-1 text-xs text-red-600 flex items-center gap-1">⚠ {fieldErrors[`Address[${index}].State`]}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Country <span className="text-red-600">*</span></label>
                        <input
                          type="text"
                          value={address.Country}
                          onChange={(e) => handleAddressChange(e, 'Country', index)}
                          className={`w-full px-3 py-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2 ${fieldErrors[`Address[${index}].Country`] ? 'border-red-500 focus:ring-red-400 bg-red-50' : 'border-gray-300 focus:ring-blue-500'}`}
                          placeholder="Enter country"
                        />
                        {fieldErrors[`Address[${index}].Country`] && <p className="mt-1 text-xs text-red-600 flex items-center gap-1">⚠ {fieldErrors[`Address[${index}].Country`]}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pincode <span className="text-red-600">*</span></label>
                        <input
                          type="number"
                          value={address.Pincode}
                          onChange={(e) => handleAddressChange(e, 'Pincode', index)}
                          className={`w-full px-3 py-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2 ${fieldErrors[`Address[${index}].Pincode`] ? 'border-red-500 focus:ring-red-400 bg-red-50' : 'border-gray-300 focus:ring-blue-500'}`}
                          placeholder="Enter pincode"
                        />
                        {fieldErrors[`Address[${index}].Pincode`] && <p className="mt-1 text-xs text-red-600 flex items-center gap-1">⚠ {fieldErrors[`Address[${index}].Pincode`]}</p>}
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddAddress}
                  className="mt-4 text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Another Address
                </button>
              </div>

              {/* Partner Form */}
              {isPartner && (
                <PartnerForm
                  partnerData={partnerData}
                  partnerErrors={partnerErrors}
                  handlePartnerChange={handlePartnerChange}
                  handlePartnerFileChange={handlePartnerFileChange}
                  generatePartnerPassword={generatePartnerPassword}
                  commissionSlab={commissionSlab}
                  commissionSlabDetails={commissionSlabDetails}
                />
              )}
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/user-management')}
                className="px-4 py-2 text-sm sm:text-base font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || roles.length === 0}
                className={`px-4 py-2 text-sm sm:text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md ${loading || roles.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              >
                {loading ? (isEditMode ? 'Updating...' : 'Creating...') : isEditMode ? 'Update User' : 'Create User'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserCreate;