import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';

interface SkuData {
  skuCode: string;
  barcode: string;
  stockQty: number;
}

interface SpecificationData {
  specKey: string;
  specValue: string;
}

interface SkuTabProps {
  data: SkuData;
  specifications: SpecificationData[];
  onChange: (updated: Partial<SkuData>) => void;
  onSpecificationsChange: (specifications: SpecificationData[]) => void;
}

const SkuTab: React.FC<SkuTabProps> = ({ data, specifications, onChange, onSpecificationsChange }) => {
  const [specErrors, setSpecErrors] = useState<{ [index: number]: { specKey?: string; specValue?: string } }>({});

  useEffect(() => {
    // Only validate when entering the tab or data changes
    const newErrors: { [index: number]: { specKey?: string; specValue?: string } } = {};
    specifications.forEach((spec, index) => {
      newErrors[index] = {
        specKey: spec.specKey.trim() === '' ? 'Specification key is required' : '',
        specValue: spec.specValue.trim() === '' ? 'Specification value is required' : '',
      };
    });
    setSpecErrors(newErrors);
  }, [specifications]);

  const handleSpecificationChange = (index: number, field: keyof SpecificationData, value: string) => {
    const newSpecifications = [...specifications];
    newSpecifications[index] = { ...newSpecifications[index], [field]: value };
    onSpecificationsChange(newSpecifications);
  };

  const handleAddSpecification = () => {
    onSpecificationsChange([...specifications, { specKey: '', specValue: '' }]);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <label className="block mb-2 font-medium text-gray-700 text-sm">SKU Code <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={data.skuCode}
            onChange={(e) => onChange({ skuCode: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            required
          />
        </div>
        <div>
          <label className="block mb-2 font-medium text-gray-700 text-sm">Barcode <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={data.barcode}
            onChange={(e) => onChange({ barcode: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            required
          />
        </div>
        <div>
          <label className="block mb-2 font-medium text-gray-700 text-sm">Stock Quantity <span className="text-red-500">*</span></label>
          <input
            type="number"
            value={data.stockQty === 0 ? '' : data.stockQty}
            onChange={(e) => onChange({ stockQty: e.target.value ? parseInt(e.target.value.replace(/^0+/, '')) || 0 : 0 })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            placeholder="Enter stock quantity"
            required
          />
        </div>
      </div>
      <div className="space-y-6">
        {specifications.map((spec, index) => (
          <div key={index} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <label className="block mb-2 font-medium text-gray-700 text-sm">Specification Key <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={spec.specKey}
                onChange={(e) => handleSpecificationChange(index, 'specKey', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                required
              />
              {specErrors[index]?.specKey && <p className="text-red-500 text-sm mt-1">{specErrors[index].specKey}</p>}
            </div>
            <div className="lg:col-span-2">
              <label className="block mb-2 font-medium text-gray-700 text-sm">Specification Value <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={spec.specValue}
                onChange={(e) => handleSpecificationChange(index, 'specValue', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                required
              />
              {specErrors[index]?.specValue && <p className="text-red-500 text-sm mt-1">{specErrors[index].specValue}</p>}
            </div>
          </div>
        ))}
        <button
          onClick={handleAddSpecification}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200 flex items-center"
        >
          <Plus size={18} className="mr-2" /> Add Specification
        </button>
      </div>
    </div>
  );
};

export default SkuTab;