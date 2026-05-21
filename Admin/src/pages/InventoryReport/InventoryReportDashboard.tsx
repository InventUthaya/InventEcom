import React, { useState, useEffect, useRef } from 'react';
import { Edit, Filter, ChevronUp, ChevronDown, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CommonService from '../../services/CommonService';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import PageMeta from '../../components/common/PageMeta';
import Loader from '../../components/common/loader/Loader';
import useDebounce from "../../hooks/useDebounce";
import { jwtDecode } from 'jwt-decode';
import { TokenData } from '../../types';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import Pagination from '../CustomComponent/Pagination';

const InventoryReport = () => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(10);
    const [isFiltersExpanded, setIsFiltersExpanded] = useState(true);
    const [filters, setFilters] = useState({
        category: '',
        brand: '',
        productName: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const debouncedFilters = useDebounce(filters, 400);
    const [totalRecords, setTotalRecords] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    const [allProductsCache, setAllProductsCache] = useState([]); // Cache for total count
    const filtersRef = useRef(debouncedFilters); // Track filters for cache invalidation

    const handleDecodeToken = (token: string | null): number => {
        if (!token) return 0;
        try {
            const tokenData: TokenData = jwtDecode(token);
            return Number(tokenData.UserId) || 0;
        } catch {
            return 0;
        }
    };

    // Fetch total count (all data) - called only once or when filters change
    const fetchTotalCount = async () => {
        const token = localStorage.getItem("Token");
        const decodedUserId = handleDecodeToken(token);

        try {
            const params = {
                pageIndex: 0,
                pageSize: 99999, // Get ALL data
                category: debouncedFilters.category || null,
                brand: debouncedFilters.brand || null,
                productName: debouncedFilters.productName || null,
                sortColumn: "Modified",
                sortOrder: "DESC",
                userId: decodedUserId
            };

            const res = await CommonService.getWithParams("products", "inventory-report", params);

            const rawData = Array.isArray(res.data)
                ? res.data
                : Array.isArray(res.data?.data)
                    ? res.data.data
                    : [];

            // Cache the data for export and count
            setAllProductsCache(rawData);

            // Set the actual total count
            setTotalRecords(rawData.length);

            // Calculate hasMore based on total count and current page
            const totalPages = Math.ceil(rawData.length / productsPerPage);
            setHasMore(currentPage < totalPages);

        } catch (e: any) {
            console.error("Error fetching total count:", e);
            // Fallback to estimation
            setTotalRecords(products.length === productsPerPage ?
                (currentPage * productsPerPage) + 1 :
                (currentPage - 1) * productsPerPage + products.length);
        }
    };

    // Fetch paginated data
    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("Token");
        const decodedUserId = handleDecodeToken(token);

        try {
            const pageIndex = currentPage - 1;

            const params = {
                pageIndex: pageIndex,
                pageSize: productsPerPage,
                category: debouncedFilters.category || null,
                brand: debouncedFilters.brand || null,
                productName: debouncedFilters.productName || null,
                sortColumn: "Modified",
                sortOrder: "DESC",
                userId: decodedUserId
            };

            const res = await CommonService.getWithParams("products", "inventory-report", params);

            const rawData = Array.isArray(res.data)
                ? res.data
                : Array.isArray(res.data?.data)
                    ? res.data.data
                    : [];

            const transformedProducts = rawData.map((product) => ({
                id: product.VariantId ?? product.ProductId,
                variantId: product.VariantId ?? product.ProductId,
                productId: product.ProductId,
                name: product.ProductName,
                category: product.CategoryName,
                brand: product.BrandName,
                stock: product.TotalStock,
                price: product.BasePrice,
                status: product.StatusName
            }));

            setProducts(transformedProducts);

            // Update hasMore based on whether we got a full page
            setHasMore(transformedProducts.length === productsPerPage);

        } catch (e: any) {
            console.error("Error fetching inventory report:", e?.response ? e.response.data : e);
            setError(e?.response?.data?.message || "Failed to fetch inventory report");
            setProducts([]);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    };

    // Initial load and when page changes
    useEffect(() => {
        fetchProducts();
    }, [currentPage]);

    // When filters change, reset to page 1 and fetch new data
    useEffect(() => {
        if (filtersRef.current !== debouncedFilters) {
            filtersRef.current = debouncedFilters;
            setCurrentPage(1);
            // Don't fetch products here - it will be triggered by the currentPage change above
        }
    }, [debouncedFilters]);

    // Fetch total count when filters change
    useEffect(() => {
        fetchTotalCount();
    }, [debouncedFilters]);

    const handleEdit = (productId, variantId) => {
        navigate(`/product/edit/${productId}/${variantId}`);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleFilterChange = (filterType, value) => {
        setFilters((prev) => ({
            ...prev,
            [filterType]: value,
        }));
    };

    const clearAllFilters = () => {
        setFilters({
            category: '',
            brand: '',
            productName: '',
        });
    };

    const getActiveFilterCount = () => {
        let count = 0;
        Object.values(filters).forEach((value) => {
            if (value !== '') count++;
        });
        return count;
    };

    const exportToExcel = async () => {
        setLoading(true);
        try {
            // Use cached data or fetch fresh if cache is empty
            let dataToExport = allProductsCache;

            if (dataToExport.length === 0) {
                await fetchTotalCount(); // This will populate the cache
                dataToExport = allProductsCache;
            }

            const exportData = dataToExport.map((product: any) => ({
                'Product Name': product.ProductName || 'N/A',
                'Category': product.CategoryName || 'N/A',
                'Brand': product.BrandName || 'N/A',
                'Stock': product.TotalStock,
                'Price (₹)': product.BasePrice?.toFixed(2) || '0.00',
                'Status': product.StatusName || 'N/A',
            }));

            const worksheet = XLSX.utils.json_to_sheet(exportData);

            const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
            const headerRow = range.s.r;

            for (let col = range.s.c; col <= range.e.c; ++col) {
                const cellAddress = XLSX.utils.encode_cell({ r: headerRow, c: col });
                if (!worksheet[cellAddress]) worksheet[cellAddress] = {};
                worksheet[cellAddress].s = {
                    font: { bold: true }
                };
            }

            const colWidths = [
                { wch: 30 },
                { wch: 20 },
                { wch: 20 },
                { wch: 12 },
                { wch: 15 },
                { wch: 15 },
            ];
            worksheet['!cols'] = colWidths;

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventory Report');

            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(data, `Inventory_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
        } catch (e) {
            console.error("Error exporting to Excel:", e);
            alert("Failed to export. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const exportOutOfStockToExcel = async () => {
        setLoading(true);
        try {
            // Use cached data
            let dataToExport = allProductsCache;

            if (dataToExport.length === 0) {
                await fetchTotalCount();
                dataToExport = allProductsCache;
            }

            const outOfStockProducts = dataToExport.filter((product: any) => product.TotalStock === 0);

            if (outOfStockProducts.length === 0) {
                alert("No out of stock products found.");
                return;
            }

            const exportData = outOfStockProducts.map((product: any) => ({
                'Product Name': product.ProductName || 'N/A',
                'Category': product.CategoryName || 'N/A',
                'Brand': product.BrandName || 'N/A',
                'Stock': product.TotalStock,
                'Price (₹)': product.BasePrice?.toFixed(2) || '0.00',
                'Status': product.StatusName || 'N/A',
            }));

            const worksheet = XLSX.utils.json_to_sheet(exportData);

            const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
            const headerRow = range.s.r;
            for (let col = range.s.c; col <= range.e.c; ++col) {
                const cellAddress = XLSX.utils.encode_cell({ r: headerRow, c: col });
                if (!worksheet[cellAddress]) worksheet[cellAddress] = {};
                worksheet[cellAddress].s = { font: { bold: true } };
            }

            worksheet['!cols'] = [
                { wch: 30 },
                { wch: 20 },
                { wch: 20 },
                { wch: 12 },
                { wch: 15 },
                { wch: 15 },
            ];

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Out of Stock Report');

            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(data, `Out_of_Stock_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
        } catch (e) {
            console.error("Error exporting out of stock:", e);
            alert("Failed to export. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (error && products.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50">
                <PageMeta title="Inventory Report | SmartStore" description="Error loading inventory" />
                <PageBreadcrumb pageTitle="Inventory Report" />
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                        <Package className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Inventory</h3>
                        <p className="text-red-600 mb-4">{error}</p>
                        <button
                            onClick={() => {
                                fetchTotalCount();
                                fetchProducts();
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Loader isOpen={loading} />

            <PageMeta title="Inventory Report | SmartStore" description="View all products and their inventory details" />
            <PageBreadcrumb pageTitle="Inventory Report" />

            <div className="bg-white rounded-lg shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-600 rounded-lg">
                                <Package className="h-6 w-6 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900">Inventory Report</h1>
                        </div>
                        <div className="mt-4 sm:mt-0 sm:flex sm:items-center sm:space-x-4">
                            {products.length > 0 && (
                                <>
                                    <button
                                        onClick={exportToExcel}
                                        className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center space-x-2 w-full sm:w-auto justify-center mb-2 sm:mb-0"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 384 512" fill="currentColor">
                                            <path d="M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-288-128 0c-17.7 0-32-14.3-32-32L192 0 64 0zM256 0l0 128 128 0L256 0zM155.7 250.2L120 345.4l36.2 95.2c3.3 8.6 14 12.4 22.6 8.3l21.6-10.8c8.6-4.3 12.4-15 8.3-23.6l-27.4-72.2 27.4-72.2c4.1-8.6 .3-19.3-8.3-23.6l-21.6-10.8c-8.6-4.3-19.3-.5-22.6 8.3zm91.4 8.3c-4.1-8.6-14.8-12.4-23.4-8.3l-21.6 10.8c-8.6 4.3-12.4 15-8.3 23.6l18.2 47.8-18.2 47.8c-4.1 8.6-.3 19.3 8.3 23.6l21.6 10.8c8.6 4.3 19.3 .5 23.4-8.3L264 345.4l18.2-47.8-18.2-47.8c-4.1-8.6-.3-19.3 8.3-23.6l21.6-10.8c8.6-4.3 19.3-.5 23.4 8.3l-18.2 47.8 18.2 47.8c4.1 8.6 .3 19.3-8.3 23.6l-21.6 10.8c-8.6 4.3-19.3 .5-23.4-8.3L264 345.4l-16.9-95.2z" />
                                        </svg>
                                        <span>Export All</span>
                                    </button>

                                    <button
                                        onClick={exportOutOfStockToExcel}
                                        disabled={allProductsCache.filter((p: any) => p.TotalStock === 0).length === 0}
                                        className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed px-4 py-2 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center space-x-2 w-full sm:w-auto justify-center"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 384 512" fill="currentColor">
                                            <path d="M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-288-128 0c-17.7 0-32-14.3-32-32L192 0 64 0zM256 0l0 128 128 0L256 0zM155.7 250.2L120 345.4l36.2 95.2c3.3 8.6 14 12.4 22.6 8.3l21.6-10.8c8.6-4.3 12.4-15 8.3-23.6l-27.4-72.2 27.4-72.2c4.1-8.6 .3-19.3-8.3-23.6l-21.6-10.8c-8.6-4.3-19.3-.5-22.6 8.3zm91.4 8.3c-4.1-8.6-14.8-12.4-23.4-8.3l-21.6 10.8c-8.6 4.3-12.4 15-8.3 23.6l18.2 47.8-18.2 47.8c-4.1 8.6-.3 19.3 8.3 23.6l21.6 10.8c8.6 4.3 19.3 .5 23.4-8.3L264 345.4l18.2-47.8-18.2-47.8c-4.1-8.6-.3-19.3 8.3-23.6l21.6-10.8c8.6-4.3 19.3-.5 23.4 8.3l-18.2 47.8 18.2 47.8c4.1 8.6 .3 19.3-8.3 23.6l-21.6 10.8c-8.6 4.3-19.3 .5-23.4-8.3L264 345.4l-16.9-95.2z" />
                                        </svg>
                                        <span>Export Out of Stock</span>
                                    </button>
                                </>
                            )}
                            {/* <button
                                onClick={() => navigate('/product-dashboard')}
                                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
                            >
                                Create Product
                            </button> */}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                            <Filter className="h-4 w-4 text-gray-500" />
                            <h3 className="text-lg font-medium text-gray-700">Filters</h3>
                            {getActiveFilterCount() > 0 && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {getActiveFilterCount()} active
                                </span>
                            )}
                        </div>
                        <div className="flex items-center space-x-2">
                            {getActiveFilterCount() > 0 && (
                                <button
                                    onClick={clearAllFilters}
                                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    Clear all filters
                                </button>
                            )}
                            <button
                                onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
                                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors duration-200"
                                aria-label={isFiltersExpanded ? "Collapse filters" : "Expand filters"}
                            >
                                {isFiltersExpanded ? (
                                    <ChevronUp className="h-4 w-4" />
                                ) : (
                                    <ChevronDown className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    {isFiltersExpanded && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                                <input
                                    type="text"
                                    value={filters.category}
                                    onChange={(e) => handleFilterChange('category', e.target.value)}
                                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Filter by category"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Brand</label>
                                <input
                                    type="text"
                                    value={filters.brand}
                                    onChange={(e) => handleFilterChange('brand', e.target.value)}
                                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Filter by brand"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Product</label>
                                <input
                                    type="text"
                                    value={filters.productName}
                                    onChange={(e) => handleFilterChange('productName', e.target.value)}
                                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Filter by product name"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-7xl mx-auto pb-6 px-4 sm:px-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                        <div className="text-sm text-gray-500">
                            Showing {products.length} of {totalRecords} products
                        </div>
                    </div>
                    <div className="sm:overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 hidden sm:table">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">Product Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">Category</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">Brand</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">Stock</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">Price</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {products.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">{product.name}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">{product.category || 'N/A'}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">{product.brand || 'N/A'}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">{product.stock}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">₹{product.price?.toFixed(2) || '0.00'}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm border-r border-gray-200">
                                            <span className={`font-bold ${product.status === 'Active' ? 'text-green-600' : product.status === 'In-Active' ? 'text-red-600' : 'text-gray-900'}`}>
                                                {product.status || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                                            <button
                                                onClick={() => handleEdit(product.productId, product.variantId)}
                                                className="inline-flex items-center px-2 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-gray-100 rounded-md transition-colors duration-200"
                                            >
                                                <Edit className="h-3.5 w-3.5 mr-2" />
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="sm:hidden space-y-4 p-4">
                            {products.map((product) => (
                                <div key={product.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 shadow-sm">
                                    <div className="flex items-center mb-3">
                                        <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                            <span className="text-xs font-medium text-blue-600">
                                                {product.name?.charAt(0)?.toUpperCase() || 'P'}
                                            </span>
                                        </div>
                                        <span className="text-sm font-medium text-gray-900">{product.name || 'N/A'}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div>
                                            <span className="text-gray-500">Category:</span>
                                            <p className="text-gray-900">{product.category || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Brand:</span>
                                            <p className="text-gray-900">{product.brand || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Stock:</span>
                                            <p className="text-gray-900">{product.stock}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Price:</span>
                                            <p className="text-gray-900">₹{product.price?.toFixed(2) || '0.00'}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Status:</span>
                                            <p className={`font-bold ${product.status === 'Active' ? 'text-green-600' : product.status === 'In-Active' ? 'text-red-600' : 'text-gray-900'}`}>
                                                {product.status || 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex justify-end mt-3">
                                        <button
                                            onClick={() => handleEdit(product.productId, product.variantId)}
                                            className="inline-flex items-center px-2 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-gray-100 rounded-md transition-colors duration-200"
                                        >
                                            <Edit className="h-3.5 w-3.5 mr-2" />
                                            Edit
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {products.length === 0 && !loading && (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Package className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                            <p className="text-gray-500">Try adjusting your search criteria or filters</p>
                        </div>
                    )}

                    {/* Add Pagination Component */}
                    {products.length > 0 && (
                        <Pagination
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                            hasMore={hasMore}
                            totalRecords={totalRecords}
                            pageSize={productsPerPage}
                            isLoading={loading}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default InventoryReport;