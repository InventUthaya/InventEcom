import React, { useState, useEffect } from 'react';
import { Trash2, Plus, X } from 'lucide-react';
import { AxiosResponse } from 'axios';
import CommonService from '../../services/CommonService';

interface ProductVariantTabProps {
  variants: VariantData[];
  colorImages: ColorImageData[];
  onVariantsChange: (variants: VariantData[]) => void;
  onColorImagesChange?: (colorImages: ColorImageData[]) => void;
  grades: { id: number; name: string }[];
  colors: { id: number; name: string }[];
  rams: { id: number; size: string }[];
  storages: { id: number; size: string }[];
}

interface VariantData {
  gradeId: number | null;
  colorId: number | null;
  ramId: number | null;
  storageId: number | null;
  price: number;
  basePrice: number;
  discountPrice: number;
  stockQty: number;
  reminderQty?: number;
  isReturnable?: boolean;
  returnDays?: number;
  isReplacement?: boolean;
  replacementDays?: number;
}

interface ColorImageData {
  colorId: number;
  colorName: string;
  images: { file: File | null; preview: string; ProductImageId?: number }[];
}

const ProductVariantTab: React.FC<ProductVariantTabProps> = ({
  variants,
  colorImages: initialColorImages,
  onVariantsChange,
  onColorImagesChange,
  grades,
  colors,
  rams,
  storages
}) => {
  const [selectedGradeIds, setSelectedGradeIds] = useState<number[]>([]);
  const [selectedColorIds, setSelectedColorIds] = useState<number[]>([]);
  const [selectedRamIds, setSelectedRamIds] = useState<number[]>([]);
  const [selectedStorageIds, setSelectedStorageIds] = useState<number[]>([]);
  const [colorImages, setColorImages] = useState<ColorImageData[]>(initialColorImages || []);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    if (initialColorImages && initialColorImages.length > 0) {
      setColorImages(initialColorImages);
    }
  }, [initialColorImages]);

  useEffect(() => {
    if (onColorImagesChange) {
      onColorImagesChange(colorImages);
    }
  }, [colorImages, onColorImagesChange]);

  const validateVariant = (variant: VariantData, index: number): string[] => {
    const errors: string[] = [];
    if (!variant.gradeId) errors.push(`Variant ${index + 1}: Grade is required`);
    // if (!variant.colorId) errors.push(`Variant ${index + 1}: Color is required`);
    // if (!variant.ramId) errors.push(`Variant ${index + 1}: RAM is required`);
    // if (!variant.storageId) errors.push(`Variant ${index + 1}: Storage is required`);
    if (variant.price <= 0) errors.push(`Variant ${index + 1}: Price must be greater than 0`);
    if (variant.basePrice <= 0) errors.push(`Variant ${index + 1}: Base Price must be greater than 0`);
    if (variant.stockQty < 0) errors.push(`Variant ${index + 1}: Stock Quantity cannot be negative`);
    if (variant.reminderQty < 0) errors.push(`Variant ${index + 1}: Reminder Quantity cannot be negative`);
    return errors;
  };

  const validateImage = (file: File): string | null => {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    const maxSize = 5 * 1024 * 1024;
    if (!allowedTypes.includes(file.type)) return 'Only PNG and JPG files are allowed';
    if (file.size > maxSize) return 'File size must be less than 5MB';
    return null;
  };

  const toggleSelection = (id: number, selectedIds: number[], setSelected: React.Dispatch<React.SetStateAction<number[]>>) => {
    setSelected(prev => prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]);
  };

  const generateCombinations = () => {
    // if (selectedGradeIds.length === 0 || selectedColorIds.length === 0 || selectedRamIds.length === 0 || selectedStorageIds.length === 0) {
    //   setValidationErrors(['Please select at least one option for each attribute.']);
    //   return;
    // }

    const selectedGrades = grades.filter(g => selectedGradeIds.includes(g.id));
    // const selectedColors = colors.filter(c => selectedColorIds.includes(c.id));
    // const selectedRams = rams.filter(r => selectedRamIds.includes(r.id));
    // const selectedStorages = storages.filter(s => selectedStorageIds.includes(s.id));

    const selectedColors = selectedColorIds.length > 0 ? colors.filter(c => selectedColorIds.includes(c.id)) : [{ id: null, name: '' }];
    const selectedRams = selectedRamIds.length > 0 ? rams.filter(r => selectedRamIds.includes(r.id)) : [{ id: null, size: '' }];
    const selectedStorages = selectedStorageIds.length > 0 ? storages.filter(s => selectedStorageIds.includes(s.id)) : [{ id: null, size: '' }];

    const newVariants: VariantData[] = [];
    selectedGrades.forEach(grade => {
      selectedColors.forEach(color => {
        selectedRams.forEach(ram => {
          selectedStorages.forEach(storage => {
            newVariants.push({
              gradeId: grade.id,
              colorId: color.id,
              ramId: ram.id,
              storageId: storage.id,
              price: 0,
              basePrice: 0,
              discountPrice: 0,
              stockQty: 0,
              reminderQty: 0,
              isReturnable: false,
              returnDays: 0,
              isReplacement: false,
              replacementDays: 0,
            });
          });
        });
      });
    });

    onVariantsChange([...variants, ...newVariants]);
    setValidationErrors([]);
  };

  const addEmptyVariant = () => {
    onVariantsChange([...variants, {
      gradeId: null,
      colorId: null,
      ramId: null,
      storageId: null,
      price: 0,
      basePrice: 0,
      discountPrice: 0,
      stockQty: 0,
      reminderQty: 0,
      isReturnable: false,
      returnDays: 0,
      isReplacement: false,
      replacementDays: 0,
    }]);
  };

  const updateVariant = (index: number, field: keyof VariantData, value: any) => {
    const newVariants = [...variants];
    if (['price', 'basePrice', 'discountPrice', 'stockQty', 'reminderQty', 'returnDays', 'replacementDays'].includes(field)) {
      value = value === '' ? 0 : Number(value);
    }
    if (['gradeId', 'colorId', 'ramId', 'storageId'].includes(field)) {
      value = value === '' ? null : Number(value);
    }
    if (['isReturnable', 'isReplacement'].includes(field)) {
      value = Boolean(value);
    }
    newVariants[index] = { ...newVariants[index], [field]: value };
    const errors = newVariants.flatMap((v, i) => validateVariant(v, i));
    setValidationErrors(errors);
    onVariantsChange(newVariants);
  };

  const handleColorImageUpload = (colorId: number, colorName: string, files: FileList | null) => {
    if (!files || files.length === 0) return;
    const validFiles = Array.from(files).filter(file => {
      const error = validateImage(file);
      if (error) {
        alert(error);
        return false;
      }
      return true;
    });
    if (validFiles.length === 0) return;

    const newImages = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      ProductImageId: undefined
    }));

    setColorImages(prev => {
      const existing = prev.find(c => c.colorId === colorId);
      if (existing) {
        return prev.map(c => c.colorId === colorId ? { ...c, images: [...c.images, ...newImages] } : c);
      } else {
        return [...prev, { colorId, colorName, images: newImages }];
      }
    });
  };

  const removeColorImage = (colorId: number, imageIndex: number) => {
    setColorImages(prev => prev
      .map(c => c.colorId === colorId ? { ...c, images: c.images.filter((_, i) => i !== imageIndex) } : c)
      .filter(c => c.images.length > 0)
    );
  };

  const removeVariant = (index: number) => {
    const newVariants = variants.filter((_, i) => i !== index);
    const errors = newVariants.flatMap((v, i) => validateVariant(v, i));
    setValidationErrors(errors);
    onVariantsChange(newVariants);
  };

  const getColorImages = (colorId: number | null) => {
    if (!colorId) return [];
    const colorData = colorImages.find(c => c.colorId === colorId);
    return colorData?.images || [];
  };

  if (grades.length === 0 || colors.length === 0 || rams.length === 0 || storages.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-orange-600 font-semibold text-lg">Loading variant options...</div>
        <p className="text-sm text-gray-500 mt-3">Please wait while we load Grades, Colors, RAM, and Storage.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {validationErrors.length > 0 && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
          <strong className="font-bold">Validation Errors:</strong>
          <ul className="list-disc pl-5">
            {validationErrors.map((err, idx) => <li key={idx}>{err}</li>)}
          </ul>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Select Available Variant Options</h2>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div>
            <label className="block mb-2 font-medium text-gray-700 text-sm">Grades <span className="text-red-500">*</span></label>
            <div className="border border-gray-300 rounded-md p-2 max-h-40 overflow-y-auto">
              {grades.map(grade => (
                <div key={grade.id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={selectedGradeIds.includes(grade.id)}
                    onChange={() => toggleSelection(grade.id, selectedGradeIds, setSelectedGradeIds)}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <label className="ml-2 text-sm">{grade.name}</label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700 text-sm">D Internal <span className="text-red-500">*</span></label>
            <div className="border border-gray-300 rounded-md p-2 max-h-40 overflow-y-auto">
              {colors.map(color => (
                <div key={color.id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={selectedColorIds.includes(color.id)}
                    onChange={() => toggleSelection(color.id, selectedColorIds, setSelectedColorIds)}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <label className="ml-2 text-sm">{color.name}</label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700 text-sm">D External <span className="text-red-500">*</span></label>
            <div className="border border-gray-300 rounded-md p-2 max-h-40 overflow-y-auto">
              {rams.map(ram => (
                <div key={ram.id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={selectedRamIds.includes(ram.id)}
                    onChange={() => toggleSelection(ram.id, selectedRamIds, setSelectedRamIds)}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <label className="ml-2 text-sm">{ram.size}</label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700 text-sm">B Width <span className="text-red-500">*</span></label>
            <div className="border border-gray-300 rounded-md p-2 max-h-40 overflow-y-auto">
              {storages.map(storage => (
                <div key={storage.id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={selectedStorageIds.includes(storage.id)}
                    onChange={() => toggleSelection(storage.id, selectedStorageIds, setSelectedStorageIds)}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <label className="ml-2 text-sm">{storage.size}</label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button onClick={generateCombinations} className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600 shadow-md">
            Generate Combinations
          </button>
          {/* <button onClick={addEmptyVariant} className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 shadow-md">
            Add Manual Variant
          </button> */}
        </div>
      </div>

      {variants.some(v => v.colorId !== null) && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Upload Images by Specification</h2>
          <p className="text-sm text-gray-600 mb-4">Images uploaded here will be shown for all variants of the same specification.</p>
          <div className="space-y-6">
            {colors
              .filter(c => variants.some(v => v.colorId === c.id))
              .map(color => (
                <div key={color.id} className="border border-gray-300 rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-3">{color.name}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4">
                    {getColorImages(color.id).map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={img.preview}
                          alt={`${color.name} ${idx + 1}`}
                          className="w-full h-32 object-cover rounded-md border"
                        />
                        <button
                          onClick={() => removeColorImage(color.id, idx)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                    <label className="border-2 border-dashed border-gray-400 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-500 h-32">
                      <Plus size={28} className="text-gray-400" />
                      <span className="text-xs text-gray-500 mt-1">Add Image</span>
                      <input
                        type="file"
                        multiple
                        accept=".png,.jpg,.jpeg"
                        className="hidden"
                        onChange={(e) => handleColorImageUpload(color.id, color.name, e.target.files)}
                      />
                    </label>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="space-y-6">
        {variants.map((variant, index) => {
          const colorName = colors.find(c => c.id === variant.colorId)?.name || 'Unknown';
          const variantImages = getColorImages(variant.colorId);

          return (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Variant {index + 1} - {colorName}</h3>
                <button onClick={() => removeVariant(index)} className="text-red-500 hover:text-red-700">
                  <Trash2 size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block mb-2 font-medium text-gray-700 text-sm">Grade <span className="text-red-500">*</span></label>
                  <select
                    value={variant.gradeId || ''}
                    onChange={e => updateVariant(index, 'gradeId', e.target.value ? Number(e.target.value) : null)}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select grade</option>
                    {grades.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block mb-2 font-medium text-gray-700 text-sm">D Internal <span className="text-red-500">*</span></label>
                  <select
                    value={variant.colorId || ''}
                    onChange={e => updateVariant(index, 'colorId', e.target.value ? Number(e.target.value) : null)}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select color</option>
                    {colors.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block mb-2 font-medium text-gray-700 text-sm">D External <span className="text-red-500">*</span></label>
                  <select
                    value={variant.ramId || ''}
                    onChange={e => updateVariant(index, 'ramId', e.target.value ? Number(e.target.value) : null)}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Size</option>
                    {rams.map(r => <option key={r.id} value={r.id}>{r.size}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block mb-2 font-medium text-gray-700 text-sm">B Width <span className="text-red-500">*</span></label>
                  <select
                    value={variant.storageId || ''}
                    onChange={e => updateVariant(index, 'storageId', e.target.value ? Number(e.target.value) : null)}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Material</option>
                    {storages.map(s => <option key={s.id} value={s.id}>{s.size}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block mb-2 font-medium text-gray-700 text-sm">MRP Price <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    step="0.01"
                    value={variant.price === 0 ? '' : variant.price}
                    onChange={e => updateVariant(index, 'price', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Enter price"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium text-gray-700 text-sm">Sale Price <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    step="0.01"
                    value={variant.basePrice === 0 ? '' : variant.basePrice}
                    onChange={e => updateVariant(index, 'basePrice', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Enter base price"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium text-gray-700 text-sm">Discount Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={variant.discountPrice === 0 ? '' : variant.discountPrice}
                    onChange={e => updateVariant(index, 'discountPrice', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Enter discount price"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium text-gray-700 text-sm">Stock Quantity <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    value={variant.stockQty === 0 ? '' : variant.stockQty}
                    onChange={e => updateVariant(index, 'stockQty', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Enter stock quantity"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium text-gray-700 text-sm">Reminder Quantity</label>
                  <input
                    type="number"
                    value={variant.reminderQty === 0 ? '' : variant.reminderQty}
                    onChange={e => updateVariant(index, 'reminderQty', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Enter reminder quantity"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={variant.isReturnable || false}
                    onChange={e => updateVariant(index, 'isReturnable', e.target.checked)}
                    className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label className="font-medium text-gray-700 text-sm">Returnable</label>
                </div>

                <div>
                  <label className="block mb-2 font-medium text-gray-700 text-sm">Return Days</label>
                  <input
                    type="number"
                    min="0"
                    value={variant.returnDays === undefined || variant.returnDays === 0 ? '' : variant.returnDays}
                    onChange={e => {
                      const val = e.target.value;
                      updateVariant(index, 'returnDays', val === '' ? 0 : Number(val));
                    }}
                    disabled={!variant.isReturnable}
                    className={`w-full px-3 py-2 border rounded-md ${!variant.isReturnable ? 'bg-gray-200 cursor-not-allowed' : ''}`}
                    placeholder="Enter return days"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={variant.isReplacement || false}
                    onChange={e => updateVariant(index, 'isReplacement', e.target.checked)}
                    className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label className="font-medium text-gray-700 text-sm">Replacement Available</label>
                </div>

                <div>
                  <label className="block mb-2 font-medium text-gray-700 text-sm">Replacement Days</label>
                  <input
                    type="number"
                    min="0"
                    value={variant.replacementDays === undefined || variant.replacementDays === 0 ? '' : variant.replacementDays}
                    onChange={e => {
                      const val = e.target.value;
                      updateVariant(index, 'replacementDays', val === '' ? 0 : Number(val));
                    }}
                    disabled={!variant.isReplacement}
                    className={`w-full px-3 py-2 border rounded-md ${!variant.isReplacement ? 'bg-gray-200 cursor-not-allowed' : ''}`}
                    placeholder="Enter replacement days"
                  />
                </div>
              </div>

              {variant.colorId && variantImages.length === 0 && (
                <p className="text-orange-600 text-sm mt-4"></p>
              )}
            </div>
          );
        })}

        {variants.length === 0 && (
          <p className="text-center text-gray-500 mt-6">No variants added yet. Generate combinations or add manually.</p>
        )}
      </div>
    </div>
  );
};

export default ProductVariantTab;