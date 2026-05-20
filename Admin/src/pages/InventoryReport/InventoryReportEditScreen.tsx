import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Loader, AlertCircle, Package } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import CommonService from '../../services/CommonService';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import PageMeta from '../../components/common/PageMeta';

interface BrandData {
    Id: number;
    BrandName: string;
}

interface StatusData {
    Id: number;
    StatusName: string;
}

const EditProduct = () => {
    const { productId: productId, variantId: variantId } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState({
        ProductId: 0,
        ProductName: '',
        Description: '',
        CategoryId: '',
        CategoryName: '',
        BrandId: '',
        BrandName: '',
        BasePrice: '',
        TotalStock: '',
        StatusId: '',
        StatusName: '',
        Specifications: '',
        Created: '',
        Modified: ''
    });

    const [formData, setFormData] = useState(product);
    const [brand, setBrand] = useState<BrandData[]>([]);
    const [status, setStatus] = useState<StatusData[]>([]);
    const [uiState, setUiState] = useState({
        isLoading: true,
        isSaving: false,
        error: null,
        success: null
    });

    const fetchProduct = async () => {
        console.log("Token:", localStorage.getItem('token'));
        setUiState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            const res = await CommonService.getWithSingleParam("products", "GetProductForEdit", productId);
            console.log("Product", res.data);

            if (res && res.status === 200) {
                const transformedProduct = {
                    ProductId: res.data.ProductId || 0,
                    ProductName: res.data.ProductName || '',
                    Description: res.data.Description || '',
                    CategoryId: res.data.CategoryId || '',
                    CategoryName: res.data.CategoryName || '',
                    BrandId: res.data.BrandId || '',
                    BrandName: res.data.BrandName || '',
                    BasePrice: res.data.CurrentPrice || '',
                    TotalStock: res.data.TotalStock || '',
                    StatusId: res.data.StatusId || '',
                    StatusName: res.data.StatusName || '',
                    Specifications: res.data.Specifications || '',
                    Created: res.data.Created || '',
                    Modified: res.data.Modified || ''
                };
                setProduct(transformedProduct);
                setFormData(transformedProduct);
                setUiState(prev => ({ ...prev, isLoading: false, error: null }));
            } else {
                throw new Error('Failed to load product');
            }
        } catch (e) {
            console.error("Error fetching product:", e.response ? e.response.data : e);
            setUiState(prev => ({
                ...prev,
                isLoading: false,
                error: e.response?.data?.message || 'An error occurred while fetching the product.'
            }));
        }
    };

    useEffect(() => {
        console.log("Product ID from params:", productId);
        if (productId) {
            fetchProduct();
            fetchBrand();
            fetchStatus();
        }
    }, [productId]);


    const fetchBrand = async () => {
        try {
            const res = await CommonService.get("master", "brandlist", "");
            setBrand(res.data);
        } catch (e: any) {
            console.error("Error fetching inventory report:", e?.response ? e.response.data : e);
        }
    };

    const fetchStatus = async () => {
        try {
            const res = await CommonService.get("master", "statuslist", "");
            setStatus(res.data);
        } catch (e: any) {
            console.error("Error fetching inventory report:", e?.response ? e.response.data : e);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        console.log("Token:", localStorage.getItem('token'));

        if (!formData.ProductName.trim()) {
            setUiState(prev => ({ ...prev, error: 'Product name is required' }));
            return;
        }
        if (!formData.CategoryId || parseInt(formData.CategoryId) <= 0) {
            setUiState(prev => ({ ...prev, error: 'Valid category is required' }));
            return;
        }
        if (!formData.BrandId || parseInt(formData.BrandId) <= 0) {
            setUiState(prev => ({ ...prev, error: 'Valid brand is required' }));
            return;
        }
        if (!formData.StatusId || parseInt(formData.StatusId) <= 0) {
            setUiState(prev => ({ ...prev, error: 'Valid status is required' }));
            return;
        }
        if (!formData.BasePrice || parseFloat(formData.BasePrice) <= 0) {
            setUiState(prev => ({ ...prev, error: 'Base price must be greater than 0' }));
            return;
        }

        setUiState(prev => ({ ...prev, isSaving: true, error: null }));

        const updateData = {
            ProductId: formData.ProductId,
            variantId: variantId,
            ProductName: formData.ProductName.trim(),
            Description: formData.Description.trim() || null,
            CategoryId: parseInt(formData.CategoryId),
            BrandId: parseInt(formData.BrandId),
            BasePrice: parseFloat(formData.BasePrice),
            TotalStock: formData.TotalStock ? parseInt(formData.TotalStock) : null,
            StatusId: parseInt(formData.StatusId),
            Specifications: formData.Specifications.trim() || null
        };

        console.log("Update data:", updateData);

        try {
            const res = await CommonService.postWithSingleEntityWithData("products", "UpdateProductForEdit", productId, updateData);
            if (res && res.status === 200) {
                console.log("Product updated", res.data);
                setProduct(formData);
                setUiState(prev => ({
                    ...prev,
                    isSaving: false,
                    success: 'Product updated successfully!'
                }));
                setTimeout(() => navigate('/inventory-report'), 1500);
            } else {
                throw new Error('Failed to update product');
            }
        } catch (e) {
            console.error("Error updating product:", e.response ? e.response.data : e);
            setUiState(prev => ({
                ...prev,
                isSaving: false,
                error: e.response?.data?.message || 'An error occurred while updating the product.'
            }));
        }
    };

    const handleCancel = () => {
        setFormData(product);
        navigate('/inventory-report');
    };

    if (uiState.isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <PageMeta title="Edit Product | SmartStore" description="Loading..." />
                <PageBreadcrumb pageTitle="Edit Product" />
                <div className="flex justify-center items-center min-h-screen">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Package className="h-8 w-8 text-gray-400" />
                        </div>
                        <Loader className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-4" />
                        <p className="text-gray-600">Loading product details...</p>
                        <p className="text-sm text-gray-500 mt-2">Product ID: {productId}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (uiState.error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <PageMeta title="Edit Product Error | SmartStore" description="Error loading product" />
                <PageBreadcrumb pageTitle="Edit Product" />
                <div className="max-w-7xl mx-auto py-12 px-6">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Product</h3>
                        <p className="text-red-600 mb-4">{uiState.error}</p>
                        <p className="text-sm text-red-600 mb-4">Product ID: {productId}</p>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={fetchProduct}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                            >
                                Retry
                            </button>
                            <button
                                onClick={() => navigate('/inventory-report')}
                                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
                            >
                                Back to Inventory
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <PageMeta
                title={`Edit ${product.ProductName} | SmartStore`}
                description="Edit product details"
            />
            <PageBreadcrumb pageTitle={`Edit Product: ${product.ProductName}`} />

            <div className="bg-white rounded-lg shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={handleCancel}
                                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </button>
                            <div className="p-2 bg-blue-600 rounded-lg">
                                <Package className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
                                <p className="text-sm text-gray-500">Product ID: #{product.ProductId}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={handleSave}
                                disabled={uiState.isSaving}
                                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {uiState.isSaving ? (
                                    <>
                                        <Loader className="h-4 w-4 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {(uiState.error || uiState.success) && (
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className={`rounded-lg p-4 ${uiState.error
                        ? 'bg-red-50 border border-red-200 text-red-800'
                        : 'bg-green-50 border border-green-200 text-green-800'
                        }`}>
                        <div className="flex items-center">
                            {uiState.error ? (
                                <AlertCircle className="h-5 w-5 mr-2" />
                            ) : (
                                <Save className="h-5 w-5 mr-2" />
                            )}
                            <span>{uiState.error || uiState.success}</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto py-6 px-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Product Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="ProductName"
                                value={formData.ProductName}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter product name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Product ID</label>
                            <input
                                type="text"
                                value={`#${formData.ProductId}`}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                                readOnly
                            />
                        </div>
                    </div>

                    <div className="md:col-span-2 mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            name="Description"
                            value={formData.Description}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter product description"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Selling Price <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 text-sm">₹</span>
                                </div>
                                <input
                                    type="number"
                                    name="BasePrice"
                                    value={formData.BasePrice}
                                    onChange={handleInputChange}
                                    step="0.01"
                                    min="0"
                                    className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Total Stock</label>
                            <input
                                type="number"
                                name="TotalStock"
                                value={formData.TotalStock}
                                onChange={handleInputChange}
                                min="0"
                                className="w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Brand <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="BrandId"
                                value={formData.BrandId}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Select a brand</option>
                                {brand.map((b) => (
                                    <option key={b.Id} value={b.Id}>
                                        {b.BrandName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="StatusId"
                                value={formData.StatusId}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Select a status</option>
                                {status.map((s) => (
                                    <option key={s.Id} value={s.Id}>
                                        {s.StatusName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="md:col-span-2 mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Category</label>
                        <input
                            type="text"
                            value={formData.CategoryName || 'Not set'}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                            readOnly
                        />
                        <p className="mt-1 text-xs text-gray-500">Category will be updated when you save changes</p>
                    </div>

                    <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Specifications</label>
                        <textarea
                            name="Specifications"
                            value={formData.Specifications}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Color: Red; Size: Large; Material: Cotton"
                        />
                        <p className="mt-1 text-xs text-gray-500">Separate with semicolons</p>
                    </div>

                    <div className="flex justify-end space-x-3 pt-6">
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={uiState.isSaving}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={uiState.isSaving}
                            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {uiState.isSaving ? (
                                <>
                                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProduct;