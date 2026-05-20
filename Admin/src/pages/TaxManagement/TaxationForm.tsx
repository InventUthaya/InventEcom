import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import ComponentCard from '../../components/common/ComponentCard';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import PageMeta from '../../components/common/PageMeta';
import Toaster from '../../components/common/Toaster';
import ToggleSwitch from '../../components/common/ToggleSwitch';
import Input from '../../components/form/input/InputField';
import Label from '../../components/form/Label';
import { HTTP_Codes } from '../../components/helper/constants';
import Button from '../../components/ui/button/Button';
import CommonService from '../../services/CommonService';
import Loader from '../../components/common/loader/Loader';
import { Package } from 'lucide-react';

interface TaxationFormData {
  id: number;
  igst: string;
  cgst: string;
  sgst: string;
  tds: string;
  effectiveStartDate: string;
  effectiveEndDate: string;
  active: boolean;
  created: string;
  createdBy: string;
  modified: string;
  modifiedBy: string;
}

interface Toast {
  msg: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

const TaxationForm = () => {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const [toast, setToast] = useState<Toast | null>(null);
  const [active, setActive] = useState(true);
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<TaxationFormData>({
    defaultValues: {
      id: 0,
      igst: '',
      cgst: '',
      sgst: '',
      tds: '',
      effectiveStartDate: '',
      effectiveEndDate: '',
      active: true,
      created: new Date().toISOString(),
      createdBy: '',
      modified: new Date().toISOString(),
      modifiedBy: '',
    },
    mode: 'onChange',
  });

  const getTaxationById = async (id: string) => {
    try {
      setIsLoading(true);
      const res = await CommonService.getWithSingleParam('taxination', `GetTaxById`, id);
      if (res.status === HTTP_Codes.Success || res.status === HTTP_Codes.Created) {
        const data = res.data;
        reset({
          id: data.Id || 0,
          igst: data.Igst != null ? data.Igst.toString() : '',
          cgst: data.Cgst != null ? data.Cgst.toString() : '',
          sgst: data.Sgst != null ? data.Sgst.toString() : '',
          tds: data.Tds != null ? data.Tds.toString() : '',
          effectiveStartDate: data.EffectiveStartDate ? new Date(data.EffectiveStartDate).toISOString().slice(0, 10) : '',
          effectiveEndDate: data.EffectiveEndDate ? new Date(data.EffectiveEndDate).toISOString().slice(0, 10) : '',
          active: data.IsActive !== null ? data.IsActive : true,
          created: data.Created || new Date().toISOString(),
          createdBy: data.CreatedBy || '',
          modified: data.Modified || new Date().toISOString(),
          modifiedBy: data.ModifiedBy || '',
        });
        setActive(data.IsActive !== null ? data.IsActive : true);
      } else {
        setToast({ msg: res.data.message || 'Failed to fetch taxation', type: 'error' });
      }
    } catch (e) {
      console.error('Error fetching taxation:', e);
      setToast({ msg: e.response?.data?.message || 'Failed to fetch taxation', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const createTaxation = async (data: TaxationFormData) => {
    try {
      const payload = {
        ...data,
        id: 0,
        igst: data.igst ? parseFloat(data.igst) : null,
        cgst: data.cgst ? parseFloat(data.cgst) : null,
        sgst: data.sgst ? parseFloat(data.sgst) : null,
        tds: data.tds ? parseFloat(data.tds) : null,
        effectiveStartDate: data.effectiveStartDate ? new Date(data.effectiveStartDate).toISOString() : null,
        effectiveEndDate: data.effectiveEndDate ? new Date(data.effectiveEndDate).toISOString() : null,
        IsActive: active,
      };
      const res = await CommonService.post('taxination', 'CreateOrEditTax', payload);
      if (res.status === HTTP_Codes.Success || res.status === HTTP_Codes.Created) {
        if (res.data.data === 0) {
          setToast({ msg: 'Taxation already exists', type: 'error' });
        } else {
          setToast({ msg: res.data.message || 'Taxation created successfully', type: 'success' });
          navigate('/tax-management-dashboard');
        }
      } else {
        setToast({ msg: res.data.message || 'Failed to create taxation', type: 'error' });
      }
    } catch (e) {
      console.error('Error creating taxation:', e);
      setToast({ msg: e.response?.data?.message || 'Failed to create taxation', type: 'error' });
    }
  };

  const updateTaxation = async (id: string, data: TaxationFormData) => {
    try {
      const payload = {
        ...data,
        id: parseInt(id),
        igst: data.igst ? parseFloat(data.igst) : null,
        cgst: data.cgst ? parseFloat(data.cgst) : null,
        sgst: data.sgst ? parseFloat(data.sgst) : null,
        tds: data.tds ? parseFloat(data.tds) : null,
        effectiveStartDate: data.effectiveStartDate ? new Date(data.effectiveStartDate).toISOString() : null,
        effectiveEndDate: data.effectiveEndDate ? new Date(data.effectiveEndDate).toISOString() : null,
        IsActive: active,
      };
      const res = await CommonService.post('taxination', 'CreateOrEditTax', payload);
      if (res.status === HTTP_Codes.Success || res.status === HTTP_Codes.Created) {
        if (res.data.data === 0) {
          setToast({ msg: 'Taxation already exists', type: 'error' });
        } else {
          setToast({ msg: res.data.message || 'Taxation updated successfully', type: 'success' });
          navigate('/tax-management-dashboard');
        }
      } else {
        setToast({ msg: res.data.message || 'Failed to update taxation', type: 'error' });
      }
    } catch (e) {
      console.error('Error updating taxation:', e);
      setToast({ msg: e.response?.data?.message || 'Failed to update taxation', type: 'error' });
    }
  };

  const onSubmit = async (data: TaxationFormData) => {
    try {
      setIsLoading(true);
      if (isEditMode && id) {
        await updateTaxation(id, data);
      } else {
        await createTaxation(data);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setToast({ msg: error.response?.data?.message || 'An error occurred. Please try again.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isEditMode && id) {
      getTaxationById(id);
    }
  }, [id, isEditMode]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Loader isOpen={isLoading} />
      {toast && (
        <Toaster
          message={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <PageMeta
        title={`${isEditMode ? 'Edit' : 'Create'} Taxation | Smart Store`}
        description={`${isEditMode ? 'Edit' : 'Create'} Taxation`}
      />
      <PageBreadcrumb pageTitle={`${isEditMode ? 'Edit' : 'Create'} Taxation`} />

      <div className="bg-white rounded-lg shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Package className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditMode ? 'Edit Taxation' : 'Create Taxation'}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="igst" className="block text-sm font-medium text-gray-700 mb-2">
                  IGST Amount (%) <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  id="igst"
                  placeholder="Enter IGST amount"
                  className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  step="0.01"
                  disabled={isEditMode}
                  {...register('igst', {
                    required: 'IGST amount is required',
                    min: { value: 0, message: 'IGST amount must be non-negative' },
                    onChange: (e) => {
                      const value = e.target.value;
                      setValue('igst', value === '' ? '' : value, { shouldValidate: true });
                    },
                  })}
                />
                {errors.igst && (
                  <p className="text-red-500 text-xs mt-1">{errors.igst.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="cgst" className="block text-sm font-medium text-gray-700 mb-2">
                  CGST Amount (%) <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  id="cgst"
                  placeholder="Enter CGST amount"
                  className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  step="0.01"
                  disabled={isEditMode}
                  {...register('cgst', {
                    required: 'CGST amount is required',
                    min: { value: 0, message: 'CGST amount must be non-negative' },
                    onChange: (e) => {
                      const value = e.target.value;
                      setValue('cgst', value === '' ? '' : value, { shouldValidate: true });
                    },
                  })}
                />
                {errors.cgst && (
                  <p className="text-red-500 text-xs mt-1">{errors.cgst.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="sgst" className="block text-sm font-medium text-gray-700 mb-2">
                  SGST Amount (%) <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  id="sgst"
                  placeholder="Enter SGST amount"
                  className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  step="0.01"
                  disabled={isEditMode}
                  {...register('sgst', {
                    required: 'SGST amount is required',
                    min: { value: 0, message: 'SGST amount must be non-negative' },
                    onChange: (e) => {
                      const value = e.target.value;
                      setValue('sgst', value === '' ? '' : value, { shouldValidate: true });
                    },
                  })}
                />
                {errors.sgst && (
                  <p className="text-red-500 text-xs mt-1">{errors.sgst.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="tds" className="block text-sm font-medium text-gray-700 mb-2">
                  TDS Amount (%) <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  id="tds"
                  placeholder="Enter TDS amount"
                  className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  step="0.01"
                  disabled={isEditMode}
                  {...register('tds', {
                    required: 'TDS amount is required',
                    min: { value: 0, message: 'TDS amount must be non-negative' },
                    onChange: (e) => {
                      const value = e.target.value;
                      setValue('tds', value === '' ? '' : value, { shouldValidate: true });
                    },
                  })}
                />
                {errors.tds && (
                  <p className="text-red-500 text-xs mt-1">{errors.tds.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="effectiveStartDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Effective Start Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="date"
                  id="effectiveStartDate"
                  placeholder="Select Effective Start Date"
                  className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  disabled={isEditMode}
                  {...register('effectiveStartDate', {
                    required: 'Effective Start Date is required',
                    onChange: (e) => {
                      const value = e.target.value;
                      setValue('effectiveStartDate', value === '' ? '' : value, { shouldValidate: true });
                    },
                  })}
                />
                {errors.effectiveStartDate && (
                  <p className="text-red-500 text-xs mt-1">{errors.effectiveStartDate.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="effectiveEndDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Effective End Date
                </Label>
                <Input
                  type="date"
                  id="effectiveEndDate"
                  placeholder="Select Effective End Date"
                  className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  disabled={isEditMode}
                  {...register('effectiveEndDate', {
                    onChange: (e) => {
                      const value = e.target.value;
                      setValue('effectiveEndDate', value === '' ? '' : value, { shouldValidate: true });
                    },
                  })}
                />
                {errors.effectiveEndDate && (
                  <p className="text-red-500 text-xs mt-1">{errors.effectiveEndDate.message}</p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <input
                type="hidden"
                {...register('active')}
              />
              <ToggleSwitch
                id="activeToggle"
                label="Active Status"
                checked={active}
                onChange={(checked) => {
                  setActive(checked);
                  setValue('active', checked);
                }}
              // className="flex items-center space-x-3"
              // labelClassName="text-sm font-medium text-gray-700"
              // switchClassName="bg-gray-200 relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              // thumbClassName={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${active ? 'translate-x-6 bg-blue-600' : 'translate-x-1'}`}
              />
            </div>

            <div className="flex justify-end space-x-4 mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/tax-management-dashboard')}
                className="px-6 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSubmit(onSubmit)}
                disabled={isLoading}
                className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Processing...' : isEditMode ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxationForm;