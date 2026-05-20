import React from 'react';
import { Plus } from 'lucide-react';

interface SpecificationData {
  specKey: string;
  specValue: string;
}

interface ProductSpecificationTabProps {
  specifications: SpecificationData[];
  onChange: (specifications: SpecificationData[]) => void;
}

const ProductSpecificationTab: React.FC<ProductSpecificationTabProps> = ({ specifications, onChange }) => {
  const handleAddSpecification = () => {
    onChange([...specifications, { specKey: '', specValue: '' }]);
  };

  const handleChange = (index: number, field: keyof SpecificationData, value: string) => {
    const newSpecifications = [...specifications];
    newSpecifications[index] = { ...newSpecifications[index], [field]: value };
    onChange(newSpecifications);
  };

  return (
    <div className="space-y-6">
      {specifications.map((spec, index) => (
        <div key={index} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <label className="block mb-2 font-medium text-gray-700 text-sm">Specification Key <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={spec.specKey}
              onChange={(e) => handleChange(index, 'specKey', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          </div>
          <div className="lg:col-span-2">
            <label className="block mb-2 font-medium text-gray-700 text-sm">Specification Value <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={spec.specValue}
              onChange={(e) => handleChange(index, 'specValue', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
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
  );
};

export default ProductSpecificationTab;