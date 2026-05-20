import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductMasterTab from "./ProductMasterTab";
import ProductVariantTab from "./ProductVariantTab";
import SkuTab from "./SkuTab";
import { Package } from "lucide-react";
import Loader from "../../components/common/loader/Loader";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Toaster from "../../components/common/Toaster";
import CommonService from "../../services/CommonService";
import { cdnURLs } from "../../components/helper/constants";
import { jwtDecode } from "jwt-decode";

interface ApiProductResponse {
  ProductID: number;
  ProductName: string;
  Description: string;
  CategoryID: number;
  CategoryName: string;
  BrandID: number;
  BrandName: string;
  TaxID: number;
  TaxRate: number;
  IsInclusive: boolean;
  SubCategoryId: number;
  SubCategoryName: string;
  ItemSubCategoryId: number;
  ItemSubCategoryName: string;
  StatusID: number;
  StatusName: string;
  Variants: {
    reminderQty: number;
    SkuID: number;
    VariantID: number;
    ProductID: number;
    GradeID: number;
    ColorID: number;
    RamID: number;
    StorageID: number;
    GradeName: string;
    ColorName: string;
    RamSize: string;
    StorageSize: string;
    MRP: number;
    SellingPrice: number;
    StockQty: number;
    Barcode: string;
    ImagePath: string | null;
    StatusID: number;
    StatusName: string;
    IsReturnable: boolean;
    ReturnDays: number;
    IsReplacement: boolean;
    ReplacementDays: number;
  }[];
  ColorImages?: {
    ProductImageId: number;
    ColorID: number;
    ColorName: string;
    ImagePath: string;
  }[];
  Specifications: {
    SpecId: number;
    SpecKey: string;
    SpecValue: string;
  }[];
}

interface ProductMasterData {
  productName: string;
  description: string;
  SubCategoryId: number;
  ItemSubCategoryId: number;
  categoryId: number;
  brandId: number;
  taxId: number;
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
  imagePath: any;
  image: File | null;
  imagePreview: string | null;
  Id?: number;
  reminderQty?: number;
  isReturnable?: boolean;
  returnDays?: number;
  isReplacement?: boolean;
  replacementDays?: number;
}

interface SkuData {
  skuCode: string;
  barcode: string;
  stockQty: number;
}

interface ColorImageItem {
  ProductImageId?: number;
  file: File | null;
  preview: string;
}

interface ColorImageData {
  colorId: number;
  colorName: string;
  images: ColorImageItem[];
}

interface SpecificationData {
  specId: number;
  specKey: string;
  specValue: string;
}

interface FormData {
  productMaster: ProductMasterData;
  variants: VariantData[];
  sku: SkuData;
  colorImages: ColorImageData[];
  specifications: SpecificationData[];
}

interface Toast {
  msg: string;
  type: "success" | "error" | "warning" | "info";
}

const ProductEdit: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id) && id !== "create";

  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  const [data, setData] = useState<FormData>({
    productMaster: {
      productName: '',
      description: '',
      categoryId: 0,
      ItemSubCategoryId: 0,
      SubCategoryId: 0,
      brandId: 0,
      taxId: 0,
    },
    variants: [],
    colorImages: [],
    sku: { skuCode: "", barcode: "", stockQty: 0 },
    specifications: [{ specId: 0, specKey: "", specValue: "" }],
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({
    productMaster: "",
    productVariant: "",
    sku: "",
  });

  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [brands, setBrands] = useState<{ id: number; name: string }[]>([]);
  const [grades, setGrades] = useState<{ id: number; name: string }[]>([]);
  const [colors, setColors] = useState<{ id: number; name: string }[]>([]);
  const [rams, setRams] = useState<{ id: number; size: string }[]>([]);
  const [storages, setStorages] = useState<{ id: number; size: string }[]>([]);
  const [userId, setUserId] = useState<number>(0);

  const tabs = ["ProductMaster", "ProductVariant", "Sku"];

  useEffect(() => {
    const token = sessionStorage.getItem('Token');
    if (!token) return;

    try {
      const decoded = jwtDecode(token) as { RoleId: number; UserId: number };
      setUserId(parseInt(decoded.UserId.toString(), 10));
    } catch (error) {
      console.error('Error decoding JWT:', error);
    }
  }, []);

  const resolveGradeId = (gradeName?: string | null) => {
    if (!gradeName) return null;
    const match = grades.find(g => g.name.toLowerCase() === gradeName.toLowerCase());
    return match ? match.id : null;
  };

  const resolveColorId = (colorName?: string | null) => {
    if (!colorName) return null;
    const match = colors.find(c => c.name.toLowerCase() === colorName.toLowerCase());
    return match ? match.id : null;
  };

  const resolveRamId = (ramSize?: string | null) => {
    if (!ramSize) return null;
    const match = rams.find(r => r.size.toLowerCase() === ramSize.toLowerCase());
    return match ? match.id : null;
  };

  const resolveStorageId = (storageSize?: string | null) => {
    if (!storageSize) return null;
    const match = storages.find(s => s.size.toLowerCase() === storageSize.toLowerCase());
    return match ? match.id : null;
  };

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [
          catRes,
          brandRes,
          gradeRes,
          colorRes,
          ramRes,
          storageRes,
        ] = await Promise.all([
          CommonService.get("master", "categorylist"),
          CommonService.get("master", "brandlist"),
          CommonService.get("master", "gradelist"),
          CommonService.get("master", "colorlist"),
          CommonService.get("master", "ramlist"),
          CommonService.get("master", "storagelist"),
        ]);

        setCategories(catRes.data || []);
        setBrands(brandRes.data || []);

        setGrades((gradeRes.data || []).filter((item: any) => item.IsActive && item.DisplayInList).map((item: any) => ({ id: item.Id, name: item.GradeName })));
        setColors((colorRes.data || []).filter((item: any) => item.IsActive && item.DisplayInList).map((item: any) => ({ id: item.Id, name: item.ColorName })));
        setRams((ramRes.data || []).filter((item: any) => item.IsActive && item.DisplayInList).map((item: any) => ({ id: item.Id, size: item.RamSize })));
        setStorages((storageRes.data || []).filter((item: any) => item.IsActive && item.DisplayInList).map((item: any) => ({ id: item.Id, size: item.StorageSize })));
      } catch (err) {
        console.error("Failed to load dropdowns", err);
        setToast({ msg: "Failed to load options", type: "error" });
      }
    };

    fetchDropdowns();
  }, []);

  useEffect(() => {
    if (isEditMode && id) {
      if (
        categories.length === 0 ||
        brands.length === 0 ||
        grades.length === 0 ||
        colors.length === 0 ||
        rams.length === 0 ||
        storages.length === 0
      ) {
        return;
      }

      const fetchProductDetails = async () => {
        setIsLoading(true);
        try {
          const response = await CommonService.get("products", `GetProductDetails/${id}`, "noParam");
          if (response.status === 200) {
            const apiData: ApiProductResponse = response.data;

            const colorImageGroups: ColorImageData[] = [];
            const colorMap = new Map<number, ColorImageData>();

            (apiData.ColorImages || []).forEach((item) => {
              if (!colorMap.has(item.ColorID)) {
                colorMap.set(item.ColorID, {
                  colorId: item.ColorID,
                  colorName: item.ColorName,
                  images: []
                });
              }
              colorMap.get(item.ColorID)!.images.push({
                ProductImageId: item.ProductImageId,
                file: null,
                preview: cdnURLs(item.ImagePath)
              });
            });

            colorImageGroups.push(...colorMap.values());

            setData(prev => ({
              ...prev,
              productMaster: {
                productName: apiData.ProductName || '',
                description: apiData.Description || '',
                categoryId: apiData.CategoryID || 0,
                brandId: apiData.BrandID || 0,
                taxId: apiData.TaxID || 0,
                SubCategoryId: apiData.SubCategoryId || 0,
                ItemSubCategoryId: apiData.ItemSubCategoryId || 0,
              },
              variants: apiData.Variants.map((v) => ({
                Id: v.VariantID,
                gradeId: v.GradeID > 0 ? v.GradeID : resolveGradeId(v.GradeName),
                colorId: v.ColorID > 0 ? v.ColorID : resolveColorId(v.ColorName),
                ramId: v.RamID > 0 ? v.RamID : resolveRamId(v.RamSize),
                storageId: v.StorageID > 0 ? v.StorageID : resolveStorageId(v.StorageSize),
                price: v.MRP ?? 0,
                basePrice: v.SellingPrice ?? 0,
                discountPrice: (v.MRP ?? 0) - (v.SellingPrice ?? 0),
                stockQty: v.StockQty ?? 0,
                reminderQty: v.reminderQty ?? 0,
                imagePath: v.ImagePath ?? "",
                image: null,
                imagePreview: v.ImagePath ? cdnURLs(v.ImagePath) : null,
                isReturnable: v.IsReturnable,
                returnDays: v.ReturnDays,
                isReplacement: v.IsReplacement,
                replacementDays: v.ReplacementDays,
              })),
              colorImages: colorImageGroups,
              sku: {
                skuCode: apiData.Variants[0]?.SkuID?.toString() ?? "",
                barcode: apiData.Variants[0]?.Barcode ?? "",
                stockQty: apiData.Variants[0]?.StockQty ?? 0,
              },
              specifications: apiData.Specifications.map((s) => ({
                specId: s.SpecId || 0,
                specKey: s.SpecKey || "",
                specValue: s.SpecValue || "",
              })),
            }));
          }
        } catch (err: any) {
          console.error("Error fetching product:", err);
          setToast({ msg: "Failed to load product details", type: "error" });
        } finally {
          setIsLoading(false);
        }
      };

      fetchProductDetails();
    }
  }, [id, isEditMode, categories.length, brands.length, grades.length, colors.length, rams.length, storages.length]);

  const validateCurrentTab = () => {
    const validationErrors: { [key: string]: string } = {};
    switch (tabs[currentStep]) {
      case "ProductMaster":
        if (!data.productMaster.productName.trim()) validationErrors.productMaster = "Product name is required";
        else if (!data.productMaster.description.trim()) validationErrors.productMaster = "Description is required";
        else if (data.productMaster.categoryId <= 0) validationErrors.productMaster = "Category is required";
        else if (data.productMaster.brandId <= 0) validationErrors.productMaster = "Brand is required";
        else if (data.productMaster.taxId <= 0) validationErrors.productMaster = "Tax is required";
        break;

      case "ProductVariant":
        if (data.variants.length === 0) validationErrors.productVariant = "At least one variant is required";
        else if (!data.variants.every(v => v.gradeId && v.colorId && v.ramId && v.storageId && v.price > 0 && v.basePrice > 0)) {
          validationErrors.productVariant = "All variant fields must be filled";
        }
        break;

      case "Sku":
        if (!data.sku.skuCode.trim()) validationErrors.sku = "SKU code is required";
        else if (!data.sku.barcode.trim()) validationErrors.sku = "Barcode is required";
        else if (data.specifications.some(s => !s.specKey.trim() || !s.specValue.trim())) {
          validationErrors.sku = "All specifications are required";
        }
        break;
    }
    return validationErrors;
  };

  const handleNext = () => {
    const validationErrors = validateCurrentTab();
    const hasError = Object.values(validationErrors).some(e => e);
    if (!hasError) {
      setCurrentStep(prev => prev + 1);
    } else {
      setErrors(prev => ({ ...prev, ...validationErrors }));
      setToast({ msg: Object.values(validationErrors)[0] || "Please fill all required fields", type: "error" });
    }
  };

  const handlePrev = () => setCurrentStep(prev => prev - 1);

  const handleSave = async () => {
    const validationErrors = validateCurrentTab();
    if (Object.values(validationErrors).some(e => e)) {
      setErrors(prev => ({ ...prev, ...validationErrors }));
      setToast({ msg: "Please fix validation errors", type: "error" });
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    const currentDate = new Date().toISOString();

    formData.append("product.id", isEditMode ? id! : "0");
    formData.append("product.productName", data.productMaster.productName);
    formData.append('product.SubCategoryId', data.productMaster.SubCategoryId.toString());
    formData.append('product.ItemSubCategoryId', data.productMaster.ItemSubCategoryId.toString());
    formData.append("product.description", data.productMaster.description);
    formData.append("product.categoryId", data.productMaster.categoryId.toString());
    formData.append("product.brandId", data.productMaster.brandId.toString());
    formData.append("product.taxId", data.productMaster.taxId.toString());
    formData.append("product.statusId", "8");
    formData.append("product.displayInList", "true");
    formData.append("product.created", currentDate);
    formData.append("product.createdBy", "system");
    formData.append("product.modified", currentDate);
    formData.append("product.modifiedBy", "system");
    formData.append("product.isActive", "true");

    data.variants.forEach((v, i) => {
      formData.append(`variants[${i}].id`, v.Id?.toString() || "0");
      if (isEditMode) formData.append(`variants[${i}].productId`, id!);
      formData.append(`variants[${i}].gradeId`, v.gradeId?.toString() || "0");
      formData.append(`variants[${i}].colorId`, v.colorId?.toString() || "0");
      formData.append(`variants[${i}].ramId`, v.ramId?.toString() || "0");
      formData.append(`variants[${i}].storageId`, v.storageId?.toString() || "0");
      formData.append(`variants[${i}].price`, v.price.toString());
      formData.append(`variants[${i}].basePrice`, v.basePrice.toString());
      formData.append(`variants[${i}].discountPrice`, v.discountPrice.toString());
      formData.append(`variants[${i}].stockQty`, v.stockQty.toString());
      formData.append(`variants[${i}].reminderQty`, (v.reminderQty || 0).toString());
      formData.append(`variants[${i}].statusId`, "8");
      formData.append(`variants[${i}].displayInList`, "true");
      formData.append(`variants[${i}].ImagePath`, v.imagePath || "");
      if (v.image) {
        formData.append(`variants[${i}].image`, v.image, v.image.name);
      }
      formData.append(`variants[${i}].isReturnable`, (v.isReturnable || false).toString());
      formData.append(`variants[${i}].returnDays`, (v.returnDays || 0).toString());
      formData.append(`variants[${i}].isReplacement`, (v.isReplacement || false).toString());
      formData.append(`variants[${i}].replacementDays`, (v.replacementDays || 0).toString());
    });

    formData.append("sku.id", "0");
    formData.append("sku.skuCode", data.sku.skuCode);
    formData.append("sku.barcode", data.sku.barcode);
    formData.append("sku.stockQty", data.sku.stockQty.toString());
    formData.append("sku.statusId", "8");
    formData.append("sku.displayInList", "true");
    formData.append("PersonId", userId.toString());

    data.specifications.forEach((s, i) => {
      const specIdToSend = isEditMode && s.specId > 0 ? s.specId : 0;
      formData.append(`specification[${i}].Id`, specIdToSend.toString());
      formData.append(`specification[${i}].specKey`, s.specKey);
      formData.append(`specification[${i}].specValue`, s.specValue);
      formData.append(`specification[${i}].productId`, isEditMode ? id! : "0");
      formData.append(`specification[${i}].displayInList`, "true");
    });

    let imageIndex = 0;
    data.colorImages.forEach((colorGroup) => {
      colorGroup.images.forEach((img) => {
        const productImageId = img.ProductImageId || 0;

        formData.append(`ColorImages[${imageIndex}].ProductImageId`, productImageId.toString());
        formData.append(`ColorImages[${imageIndex}].ColorId`, colorGroup.colorId.toString());

        if (img.file instanceof File) {
          formData.append(`ColorImages[${imageIndex}].ImageFile`, img.file, img.file.name);
        } else if (img.preview && img.preview.startsWith('http')) {
          const relativePath = img.preview.replace(/^.*\/products\//, 'products/');
          formData.append(`ColorImages[${imageIndex}].ImagePath`, relativePath);
        }

        imageIndex++;
      });
    });

    try {
      const endpoint = isEditMode ? "UpdateProduct" : "CreateProduct";
      const response = await CommonService.post("products", endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        setToast({ msg: `Product ${isEditMode ? "updated" : "created"} successfully`, type: "success" });
        navigate("/product-dashboard");
      }
    } catch (err: any) {
      setToast({ msg: err.response?.data?.message || "Save failed", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const updateProductMaster = (updated: Partial<ProductMasterData>) =>
    setData(prev => ({ ...prev, productMaster: { ...prev.productMaster, ...updated } }));

  const updateVariants = (variants: VariantData[]) =>
    setData(prev => ({ ...prev, variants }));

  const updateSku = (updated: Partial<SkuData>) =>
    setData(prev => ({ ...prev, sku: { ...prev.sku, ...updated } }));

  const updateSpecifications = (specifications: SpecificationData[]) =>
    setData(prev => ({ ...prev, specifications }));

  const renderTabContent = () => {
    switch (tabs[currentStep]) {
      case "ProductMaster":
        return (
          <ProductMasterTab
            data={data.productMaster}
            onChange={updateProductMaster}
            categories={categories}
            brands={brands}
          />
        );
      case "ProductVariant":
        return (
          <ProductVariantTab
            variants={data.variants}
            onVariantsChange={updateVariants}
            colorImages={data.colorImages}
            onColorImagesChange={(colorImages: ColorImageData[]) =>
              setData(prev => ({ ...prev, colorImages }))}
            grades={grades}
            colors={colors}
            rams={rams}
            storages={storages}
          />
        );
      case "Sku":
        return (
          <SkuTab
            data={data.sku}
            specifications={data.specifications}
            onChange={updateSku}
            onSpecificationsChange={updateSpecifications}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-3 bg-white rounded-xl shadow-2xl">
      <Loader isOpen={isLoading} />
      {toast && (
        <Toaster
          message={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <PageMeta
        title={`${isEditMode ? "Edit" : "Create"} Product`}
        description={`${isEditMode ? "Edit" : "Create"} Product`}
      />
      <PageBreadcrumb
        pageTitle={`${isEditMode ? "Edit" : "Create"} Product`}
      />

      <div className="bg-white rounded-lg shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-3 pt-3 mb-2">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Package className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">
              {isEditMode ? "Edit Product" : "Create Product"}
            </h1>
          </div>

          <div className="p-1 pt-2">
            <div className="flex space-x-1 w-full">
              {tabs.map((tab, index) => (
                <button
                  key={tab}
                  onClick={() => setCurrentStep(index)}
                  className={`flex-1 px-6 py-1 rounded-t-lg font-semibold text-center ${
                    currentStep === index
                      ? "bg-blue-400 text-white shadow-md"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {tab.replace("Product", "")}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-3 mt-1 rounded-lg shadow-inner">
        {renderTabContent()}
        {errors[tabs[currentStep]] && (
          <p className="text-red-500 text-sm mt-2">{errors[tabs[currentStep]]}</p>
        )}
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={handlePrev}
          disabled={currentStep === 0}
          className="bg-gray-400 text-white px-3 py-1.5 rounded-lg hover:bg-gray-500 disabled:opacity-50"
        >
          Previous
        </button>

        {currentStep === tabs.length - 1 ? (
          <button
            onClick={handleSave}
            className="bg-green-500 text-white px-3 py-1.5 rounded-lg hover:bg-green-600"
          >
            Save
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductEdit;