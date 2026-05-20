import React, { useState, useEffect } from 'react';
import { AxiosResponse } from 'axios';
import CommonService from '../../services/CommonService';

interface ProductMasterData {
  productName: string;
  description: string;
  categoryId: number;
  SubCategoryId: number;
  ItemSubCategoryId: number;
  brandId: number;
  taxId: number;
}

interface ProductMasterTabProps {
  data: ProductMasterData;
  onChange: (updated: Partial<ProductMasterData>) => void;
  categories: { id: number; name: string }[];
  brands: { id: number; name: string }[];
}

interface DropdownOption {
  id: number;
  name: string;
  parentId?: number;
}

interface ApiCategoryResponse {
  Id: number;
  CategoryName: string;
  Description: string;
  IsActive: boolean;
  DisplayInList: boolean;
  Created: string;
  CreatedBy: string | null;
  Modified: string | null;
  ModifiedBy: string | null;
  TotalRecords: number;
  IsValid: boolean;
  ValidationErrors: { Items: any[] };
  CountryCode: string | null;
}


interface ApiSubCategoryResponse {
  Id: number;
  CategoryMasterId: number;
  SubCategoryName: string;
  IsActive: boolean;
  DisplayInList: boolean;
  Created: string;
}

interface ApiItemsSubCategoryResponse {
  Id: number;
  SubCategoryMasterId: number;
  ItemsCategoryName: string;
  IsActive: boolean;
  DisplayInList: boolean;
  Created: string;
}

interface ApiBrandResponse {
  Id: number;
  BrandName: string;
  Description: string;
  IsActive: boolean;
  DisplayInList: boolean;
  Created: string;
  CreatedBy: string | null;
  Modified: string | null;
  ModifiedBy: string | null;
  TotalRecords: number;
  IsValid: boolean;
  ValidationErrors: { Items: any[] };
  CountryCode: string | null;
}

interface ApiTaxResponse {
  Id: number;
  TaxName: string;
  Description: string;
  IsActive: boolean;
  DisplayInList: boolean;
  Created: string;
  CreatedBy: string | null;
  Modified: string | null;
  ModifiedBy: string | null;
  TotalRecords: number;
  IsValid: boolean;
  ValidationErrors: { Items: any[] };
  CountryCode: string | null;
}

const ProductMasterTab: React.FC<ProductMasterTabProps> = ({ data, onChange }) => {
  const [categories, setCategories] = useState<DropdownOption[]>([]);
  const [subcategories, setSubCategories] = useState<DropdownOption[]>([]);
  const [itemssubcategories, setItemsSubCategories] = useState<DropdownOption[]>([]);
  const [brands, setBrands] = useState<DropdownOption[]>([]);
  const [taxes, setTaxes] = useState<DropdownOption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const categoryResponse: AxiosResponse<ApiCategoryResponse[]> = await CommonService.get('master', 'categorylist', 'noParam');
        const categoryOptions: DropdownOption[] = categoryResponse.data
          .filter(item => item.IsActive && item.DisplayInList)
          .map(item => ({
            id: item.Id,
            name: item.CategoryName,
          }));

        const brandResponse: AxiosResponse<ApiBrandResponse[]> = await CommonService.get('master', 'brandlist', 'noParam');
        const brandOptions: DropdownOption[] = brandResponse.data
          .filter(item => item.IsActive && item.DisplayInList)
          .map(item => ({
            id: item.Id,
            name: item.BrandName,
          }));

        const taxResponse: AxiosResponse<ApiTaxResponse[]> = await CommonService.get('master', 'taxlist', 'noParam');
        const taxOptions: DropdownOption[] = taxResponse.data
          .filter(item => item.IsActive && item.DisplayInList)
          .map(item => ({
            id: item.Id,
            name: item.TaxName,
          }));

        setCategories(categoryOptions);
        setBrands(brandOptions);
        setTaxes(taxOptions);
      } catch (err) {
        setError('Failed to fetch dropdown data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  useEffect(() => {
    fetchSubCategory();
    fetchItemsSubCategory();
  }, []);

  const fetchSubCategory = async () => {
    const SubcategoryResponse: AxiosResponse<ApiSubCategoryResponse[]> = await CommonService.get('Subcategory', 'getall', 'noParam');
    const categoryOptions: DropdownOption[] = SubcategoryResponse.data
      .filter(item => item.IsActive && item.DisplayInList)
      .map(item => ({
        id: item.Id,
        name: item.SubCategoryName,
      }));
    setSubCategories(
      SubcategoryResponse.data
        .filter(item => item.IsActive && item.DisplayInList)
        .map(item => ({
          id: item.Id,
          name: item.SubCategoryName,
          parentId: item.CategoryMasterId,
        }))
    );
  };

  const fetchItemsSubCategory = async () => {
    const ItemsSubcategoryResponse: AxiosResponse<ApiItemsSubCategoryResponse[]> = await CommonService.get('itemssubcategory', 'getall', 'noParam');
    const categoryOptions: DropdownOption[] = ItemsSubcategoryResponse.data
      .filter(item => item.IsActive && item.DisplayInList)
      .map(item => ({
        id: item.Id,
        name: item.ItemsCategoryName,
      }));
    setItemsSubCategories(
      ItemsSubcategoryResponse.data
        .filter(item => item.IsActive && item.DisplayInList)
        .map(item => ({
          id: item.Id,
          name: item.ItemsCategoryName,
          parentId: item.SubCategoryMasterId,
        }))
    );
  };


  if (loading) {
    return <div className="text-center text-gray-600 font-semibold">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 font-semibold">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div>
        <label className="block mb-2 font-medium text-gray-700 text-sm">Product Name <span className="text-red-500">*</span></label>
        <input
          type="text"
          value={data.productName}
          onChange={(e) => onChange({ productName: e.target.value })}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          placeholder="Enter product name"
          required
        />
      </div>
      <div>
        <label className="block mb-2 font-medium text-gray-700 text-sm">Menu <span className="text-red-500">*</span></label>
        <select
          value={data.categoryId}
          onChange={(e) => onChange({ categoryId: parseInt(e.target.value) || 0 })}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          required
        >
          <option value={0}>Select a Menu</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-2 font-medium text-gray-700 text-sm">category<span className="text-red-500">*</span></label>
        <select
          value={data.SubCategoryId}
          onChange={(e) => {
            const val = parseInt(e.target.value) || 0;
            onChange({ SubCategoryId: val, ItemSubCategoryId: 0 }); // Reset items category when sub changes
          }}
          disabled={data.categoryId === 0}
          className={`px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full ${data.categoryId === 0 ? 'cursor-not-allowed bg-gray-200' : ''
            }`}
          required
        >
          <option value={0}>Select a category</option>
          {subcategories
            .filter((cat) => cat.parentId == data.categoryId) // Assuming you added parentId in DropdownOption
            .map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
        </select>
      </div>

      <div>
        <label className="block mb-2 font-medium text-gray-700 text-sm">Sub Category<span className="text-red-500">*</span></label>
        <select
          value={data.ItemSubCategoryId}
          onChange={(e) => onChange({ ItemSubCategoryId: parseInt(e.target.value) || 0 })}
          disabled={data.SubCategoryId === 0}
          className={`px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full ${data.SubCategoryId === 0 ? 'cursor-not-allowed bg-gray-200' : ''
            }`}
          required
        >
          <option value={0}>Select an Sub Category</option>
          {itemssubcategories
            .filter((cat) => cat.parentId === data.SubCategoryId) // Assuming you added parentId in DropdownOption
            .map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
        </select>
      </div>
      <div>
        <label className="block mb-2 font-medium text-gray-700 text-sm">Brand <span className="text-red-500">*</span></label>
        <select
          value={data.brandId}
          onChange={(e) => onChange({ brandId: parseInt(e.target.value) || 0 })}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          required
        >
          <option value={0}>Select a brand</option>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </select>
      </div>
      <div className="lg:col-span-3">
        <label className="block mb-2 font-medium text-gray-700 text-sm">Description <span className="text-red-500">*</span></label>
        <textarea
          value={data.description}
          onChange={(e) => onChange({ description: e.target.value })}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          placeholder="Enter product description"
          rows={6}
          required
        />
      </div>
      <div>
        <label className="block mb-2 font-medium text-gray-700 text-sm">Tax <span className="text-red-500">*</span></label>
        <select
          value={data.taxId}
          onChange={(e) => onChange({ taxId: parseInt(e.target.value) || 0 })}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          required
        >
          <option value={0}>Select a tax</option>
          {taxes.map((tax) => (
            <option key={tax.id} value={tax.id}>
              {tax.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ProductMasterTab;