import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
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

interface PromoCodeFormData {
  id: number;
  code: string;
  description: string;
  type: string;
  value: string;
  startDate: string;
  endDate: string;
  usageLimit: string;
  perUserLimit: string;
  usedCount: number;
  active: boolean;
  created: string;
}

interface Toast {
  msg: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

const PromoCodeForm = () => {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const [toast, setToast] = useState<Toast | null>(null);
  const [active, setActive] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<PromoCodeFormData>({
    defaultValues: {
      id: 0,
      code: '',
      description: '',
      type: '',
      value: '',
      startDate: '',
      endDate: '',
      usageLimit: '',
      perUserLimit: '',
      usedCount: 0,
      active: true,
      created: new Date().toISOString(),
    },
    mode: 'onChange',
  });

  const discountType = watch('type');

  // Dynamic label for Value field
  const getValueLabel = () => {
    if (discountType === 'flat') return 'Amount';
    if (discountType === 'percentage') return 'Percentage Amount';
    return 'Value';
  };

  const getPromoById = async (id: string) => {
    try {
      setIsLoading(true);
      const res = await CommonService.getWithSingleParam("bogo", "getPromoDetailsById", id);
      if (res.status === HTTP_Codes.Success || res.status === HTTP_Codes.Created) {
        const data = res.data.data;
        reset({
          id: data.PromoID || 0,
          code: data.PromoCode || '',
          description: data.Description || '',
          type: data.DiscountType || '',
          value: data.Value != null ? data.Value.toString() : '',
          startDate: data.StartDate ? new Date(data.StartDate).toISOString().slice(0, 10) : '',
          endDate: data.EndDate ? new Date(data.EndDate).toISOString().slice(0, 10) : '',
          usageLimit: data.UsageLimit != null ? data.UsageLimit.toString() : '',
          perUserLimit: data.PerUserLimit != null ? data.PerUserLimit.toString() : '',
          usedCount: data.UsedCount || 0,
          active: data.IsActive !== null ? data.IsActive : true,
          created: data.Created || new Date().toISOString(),
        });
        setActive(data.IsActive !== null ? data.IsActive : true);
      } else {
        setToast({ msg: res.data.message || 'Failed to fetch promo code', type: 'error' });
      }
    } catch (e) {
      console.error('Error fetching promo code:', e);
      setToast({ msg: e.response?.data?.message || 'Failed to fetch promo code', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const createPromo = async (data: PromoCodeFormData) => {
    try {
      const payload = {
        PromoID: 0,
        PromoCode: data.code,
        Description: data.description,
        DiscountType: data.type,
        Value: data.value ? parseFloat(data.value) : null,
        StartDate: data.startDate ? new Date(data.startDate).toISOString() : null,
        EndDate: data.endDate ? new Date(data.endDate).toISOString() : null,
        UsageLimit: data.usageLimit ? parseInt(data.usageLimit) : null,
        PerUserLimit: data.perUserLimit ? parseInt(data.perUserLimit) : null,
        UsedCount: 0,
        IsActive: active,
      };
      const res = await CommonService.post('bogo', 'CreateOrEditPromo', payload);
      if (res.status === HTTP_Codes.Success || res.status === HTTP_Codes.Created) {
        if (res.data.data === 0) {
          setToast({ msg: 'Promo code already exists', type: 'error' });
        } else {
          setToast({ msg: res.data.message || 'Promo code created successfully', type: 'success' });
          navigate('/promo-code-dashboard');
        }
      } else {
        setToast({ msg: res.data.message || 'Failed to create promo code', type: 'error' });
      }
    } catch (e) {
      console.error('Error creating promo code:', e);
      setToast({ msg: e.response?.data?.message || 'Failed to create promo code', type: 'error' });
    }
  };

  const updatePromo = async (id: string, data: PromoCodeFormData) => {
    try {
      const payload = {
        PromoID: parseInt(id),
        PromoCode: data.code,
        Description: data.description,
        DiscountType: data.type,
        Value: data.value ? parseFloat(data.value) : null,
        StartDate: data.startDate ? new Date(data.startDate).toISOString() : null,
        EndDate: data.endDate ? new Date(data.endDate).toISOString() : null,
        UsageLimit: data.usageLimit ? parseInt(data.usageLimit) : null,
        PerUserLimit: data.perUserLimit ? parseInt(data.perUserLimit) : null,
        UsedCount: data.usedCount,
        IsActive: active,
      };
      const res = await CommonService.post('bogo', 'CreateOrEditPromo', payload);
      if (res.status === HTTP_Codes.Success || res.status === HTTP_Codes.Created) {
        if (res.data.data === 0) {
          setToast({ msg: 'Promo code already exists', type: 'error' });
        } else {
          setToast({ msg: res.data.message || 'Promo code updated successfully', type: 'success' });
          navigate('/promo-code-dashboard');
        }
      } else {
        setToast({ msg: res.data.message || 'Failed to update promo code', type: 'error' });
      }
    } catch (e) {
      console.error('Error updating promo code:', e);
      setToast({ msg: e.response?.data?.message || 'Failed to update promo code', type: 'error' });
    }
  };

  const onSubmit = async (data: PromoCodeFormData) => {
    try {
      setIsLoading(true);
      if (isEditMode && id) {
        await updatePromo(id, data);
      } else {
        await createPromo(data);
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
      getPromoById(id);
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
        title={`${isEditMode ? 'Edit' : 'Create'} Promo Code | Smart Store`}
        description={`${isEditMode ? 'Edit' : 'Create'} Promo Code`}
      />
      <PageBreadcrumb pageTitle={`${isEditMode ? 'Edit' : 'Create'} Promo Code`} />

      <div className="bg-white rounded-lg shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Package className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditMode ? 'Edit Promo Code' : 'Create Promo Code'}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Promo Code */}
              <div>
                <Label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                  Promo Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  id="code"
                  placeholder="Enter promo code"
                  className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  {...register('code', {
                    required: 'Promo code is required',
                  })}
                />
                {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code.message}</p>}
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </Label>
                <Input
                  type="text"
                  id="description"
                  placeholder="Enter description"
                  className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  {...register('description')}
                />
              </div>

              {/* Discount Type */}
              <div>
                <Label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Type <span className="text-red-500">*</span>
                </Label>
                <select
                  id="type"
                  className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  {...register('type', { required: 'Discount type is required' })}
                >
                  <option value="">Select type</option>
                  <option value="flat">Flat</option>
                  <option value="percentage">Percentage</option>
                </select>
                {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>}
              </div>

              {/* Value (with dynamic label) */}
              <div>
                <Label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-2">
                  {getValueLabel()} <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  id="value"
                  placeholder={`Enter ${getValueLabel().toLowerCase()}`}
                  className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  step="0.01"
                  {...register('value', {
                    required: 'Value is required',
                    min: { value: 0, message: 'Value must be non-negative' },
                  })}
                />
                {errors.value && <p className="text-red-500 text-xs mt-1">{errors.value.message}</p>}
              </div>

              {/* Start Date */}
              <div>
                <Label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="date"
                  id="startDate"
                  className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  {...register('startDate', { required: 'Start Date is required' })}
                />
                {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate.message}</p>}
              </div>

              {/* End Date */}
              <div>
                <Label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </Label>
                <Input
                  type="date"
                  id="endDate"
                  className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  {...register('endDate')}
                />
              </div>

              {/* Usage Limit */}
              <div>
                <Label htmlFor="usageLimit" className="block text-sm font-medium text-gray-700 mb-2">
                  Usage Limit
                </Label>
                <Input
                  type="number"
                  id="usageLimit"
                  placeholder="Enter usage limit"
                  className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  {...register('usageLimit', {
                    min: { value: 0, message: 'Usage limit must be non-negative' },
                  })}
                />
                {errors.usageLimit && <p className="text-red-500 text-xs mt-1">{errors.usageLimit.message}</p>}
              </div>

              {/* Per User Limit */}
              <div>
                <Label htmlFor="perUserLimit" className="block text-sm font-medium text-gray-700 mb-2">
                  Per User Limit
                </Label>
                <Input
                  type="number"
                  id="perUserLimit"
                  placeholder="Enter per user limit"
                  className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  {...register('perUserLimit', {
                    min: { value: 0, message: 'Per user limit must be non-negative' },
                  })}
                />
                {errors.perUserLimit && <p className="text-red-500 text-xs mt-1">{errors.perUserLimit.message}</p>}
              </div>

              {/* Used Count (disabled) */}
              <div>
                <Label htmlFor="usedCount" className="block text-sm font-medium text-gray-700 mb-2">
                  Used Count
                </Label>
                <Input
                  type="number"
                  id="usedCount"
                  placeholder="Enter used count"
                  className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled
                  {...register('usedCount', {
                    min: { value: 0, message: 'Used count must be non-negative' },
                  })}
                />
              </div>
            </div>

            {/* Active Toggle */}
            <div className="mt-6">
              <input type="hidden" {...register('active')} />
              <ToggleSwitch
                id="activeToggle"
                label="Active Status"
                checked={active}
                onChange={(checked) => {
                  setActive(checked);
                  setValue('active', checked);
                }}
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-4 mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/promo-code-dashboard')}
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

export default PromoCodeForm;