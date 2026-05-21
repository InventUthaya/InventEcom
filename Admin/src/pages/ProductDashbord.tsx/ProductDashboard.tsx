import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import PageMeta from '../../components/common/PageMeta';
import Toaster from '../../components/common/Toaster';
import useDebounce from '../../hooks/useDebounce';
import CommonService from '../../services/CommonService';
import Loader from '../../components/common/loader/Loader';
import { Search, Filter, Package } from 'lucide-react';
import DataTable, { Column } from '../../components/common/DataTable';
import DeleteConfirmationModal from '../../components/common/DeleteConfirmationModel';
import ActiveConfirmationModal from '../../components/common/ActiveConfirmationModal';
import CustomSearchDropdown from '../../components/common/CustomSearchDropdown';
import Pagination from '../CustomComponent/Pagination'; // Import your custom Pagination
import { TokenData } from '../../types';
import { jwtDecode } from 'jwt-decode';

interface ApiProduct {
  Id: number;
  ProductId: number;
  ProductName: string;
  Description: string | null;
  CategoryId: number;
  CategoryName?: string;
  BrandId: number | null;
  BrandName?: string | null;
  RamSize?: string | null;
  StorageSize?: string | null;
  BasePrice: number;
  TaxId: number | null;
  StatusId: number;
  StatusName?: string;
  IsActive: boolean | null;
  DisplayInList: boolean | null;
  Created: string;
  CreatedBy: string;
  Modified: string | null;
  ModifiedBy: string | null;
  IsValid: boolean;
  ValidationErrors: { Items: any[] };
  TotalRecords?: number;
}

interface Product {
  id: number;
  productId: number;
  name: string;
  description: string | null;
  categoryId: number;
  categoryName?: string;
  brandId: number | null;
  brandName?: string | null;
  ramSize?: string | null;
  storageSize?: string | null;
  basePrice: number;
  taxId: number | null;
  statusId: number;
  statusName?: string;
  active: boolean | null;
  displayInList: boolean | null;
  created: string;
  createdBy: string;
  modified: string | null;
  modifiedBy: string | null;
}

interface Toast {
  msg: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

const ProductDashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openActiveModal, setOpenActiveModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0); // Renamed from totalItems for clarity
  const [sortConfig, setSortConfig] = useState<{
    column: string | null;
    order: 'asc' | 'desc';
  }>({ column: null, order: 'asc' });
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [userId, setUserId] = useState<number>(0);
  const [hasMore, setHasMore] = useState(false); // For pagination

  const debouncedSearchText = useDebounce(searchTerm, 500);

  const columns: Column[] = [
    { header: 'Name', accessor: 'name', displayInList: true, sortable: true, className: 'min-w-[100px] px-6' },
    { header: 'Category', accessor: 'categoryName', displayInList: true, sortable: true, className: 'min-w-[100px] px-6' },
    { header: 'Brand', accessor: 'brandName', displayInList: true, sortable: true, className: 'min-w-[100px] px-6' },
    { header: 'size', accessor: 'ramSize', displayInList: true, sortable: false, className: 'min-w-[100px] px-6' },
    { header: 'B Width', accessor: 'storageSize', displayInList: true, sortable: false, className: 'min-w-[100px] px-6' },
    { header: 'Base Price', accessor: 'basePrice', displayInList: true, sortable: false, className: 'min-w-[100px] px-6' },
    { header: 'Created', accessor: 'created', displayInList: true, datatype: 'datetime', className: 'min-w-[100px] px-6' },
    { header: 'Modified', accessor: 'modified', displayInList: true, datatype: 'datetime', className: 'min-w-[100px] px-6' },
    { header: 'Active', accessor: 'active', displayInList: true, datatype: 'boolean', className: 'min-w-[100px] px-6' },
  ];

  const getSortBy = (column: string, order: string) => {
    if (column.toLowerCase() === 'baseprice') {
      return order === 'asc' ? 'price_asc' : 'price_desc';
    } else if (column.toLowerCase() === 'created' && order === 'desc') {
      return 'newest';
    }
    return 'newest';
  };

  const buildSearchRequest = (
    page: number,
    size: number,
    search: string,
    sortColumn: string,
    sortOrder: string,
    active: number | null,
    userId: number | null
  ) => {
    return {
      PageSize: size,
      Page: page,
      SearchText: search || undefined,
      SortBy: getSortBy(sortColumn, sortOrder),
      Active: active,
      UserId: userId
    };
  };

  const mapApiToProduct = (apiData: ApiProduct[]): Product[] => {
    return apiData.map((item) => ({
      id: item.Id,
      productId: item.ProductId,
      name: item.ProductName,
      description: item.Description,
      categoryId: item.CategoryId,
      categoryName: item.CategoryName,
      brandId: item.BrandId,
      brandName: item.BrandName,
      ramSize: item.RamSize,
      storageSize: item.StorageSize,
      basePrice: Math.round(item.BasePrice),
      taxId: item.TaxId,
      statusId: item.StatusId,
      statusName: item.StatusName,
      active: item.IsActive,
      displayInList: item.DisplayInList,
      created: item.Created,
      createdBy: item.CreatedBy,
      modified: item.Modified,
      modifiedBy: item.ModifiedBy,
    }));
  };

  const fetchProducts = async (
    page: number = currentPage,
    size: number = rowsPerPage,
    search: string = '',
    sortColumn: string = '',
    sortOrder: string = 'asc',
    active: number | null = null,
    userId: number
  ) => {
    setIsLoading(true);
    const requestData = buildSearchRequest(page, size, search, sortColumn, sortOrder, active, userId);
    try {
      const response = await CommonService.post('products', 'SearchProducts', requestData);
      if (response.status === 200) {
        const apiProducts: ApiProduct[] = response.data.Products || [];
        const transformedProducts = mapApiToProduct(apiProducts);
        setProducts(transformedProducts);

        // FIX: Get total records from first product item, not from root
        // Each product has TotalRecords: 19 (actual total from database)
        let serverTotalRecords = 0;
        if (apiProducts.length > 0 && apiProducts[0].TotalRecords) {
          serverTotalRecords = apiProducts[0].TotalRecords;
        } else {
          // Fallback to root TotalRecords if not found in products
          serverTotalRecords = response.data.TotalRecords || 0;
        }

        setTotalRecords(serverTotalRecords);

        // Calculate if there are more pages
        const hasMoreRecords = (page * size) < serverTotalRecords;
        setHasMore(hasMoreRecords);

        setCurrentPage(page);
      } else {
        setToast({ msg: 'Failed to fetch products', type: 'error' });
        setProducts([]);
        setTotalRecords(0);
        setHasMore(false);
      }
    } catch (e: any) {
      console.error('Error fetching products:', e);
      setToast({ msg: e.response?.data?.message || 'Failed to fetch products', type: 'error' });
      setProducts([]);
      setTotalRecords(0);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Remove client-side filtering and pagination - use server-side only
  const filteredProducts = useMemo(() => {
    // Only do client-side filtering for active/inactive if needed
    // But your API already handles this via @Active parameter
    return products;
  }, [products]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleSort = (column: string, order: 'asc' | 'desc') => {
    setSortConfig({ column, order });
    const activeValue = statusFilter === 'active' ? 1 : statusFilter === 'inactive' ? 0 : null;
    fetchProducts(1, rowsPerPage, searchTerm, column, order, activeValue, userId);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const activeValue = statusFilter === 'active' ? 1 : statusFilter === 'inactive' ? 0 : null;
    fetchProducts(page, rowsPerPage, searchTerm, sortConfig.column || 'Created', sortConfig.order, activeValue, userId);
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    const activeValue = statusFilter === 'active' ? 1 : statusFilter === 'inactive' ? 0 : null;
    fetchProducts(1, newRowsPerPage, searchTerm, sortConfig.column || 'Created', sortConfig.order, activeValue, userId);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
    const activeValue = value === 'active' ? 1 : value === 'inactive' ? 0 : null;
    fetchProducts(1, rowsPerPage, searchTerm, sortConfig.column || 'Created', sortConfig.order, activeValue, userId);
  };

  const clearAllFilters = () => {
    setStatusFilter('');
    setSearchTerm('');
    setCurrentPage(1);
    fetchProducts(1, rowsPerPage, '', 'Created', 'desc', null, userId);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (statusFilter !== '') count++;
    if (searchTerm !== '') count++;
    return count;
  };

  const handleEdit = (row: Product) => {
    navigate(`/product-form/${row.productId}`);
  };

  const deleteProductById = async (productId: number) => {
    setIsLoading(true);
    try {
      const response = await CommonService.post('products', 'InActiveProduct', { productId });
      if (response.status == 200) {
        setOpenDeleteModal(false);
        setSelectedRow(null);
        setToast({ msg: 'Product hidden successfully', type: 'success' });
        // Refetch current page to update list
        const activeValue = statusFilter === 'active' ? 1 : statusFilter === 'inactive' ? 0 : null;
        fetchProducts(currentPage, rowsPerPage, searchTerm, sortConfig.column || 'Created', sortConfig.order, activeValue, userId);
      }
    } catch (e: any) {
      console.error('Error deleting product:', e);
      setToast({ msg: e.response?.data?.message || 'Failed to delete product', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const activeProductById = async (productId: number) => {
    setIsLoading(true);
    try {
      const response = await CommonService.post('products', 'ActiveProduct', { productId });
      if (response.status == 200) {
        setOpenActiveModal(false);
        setSelectedRow(null);
        setToast({ msg: 'Product activated successfully', type: 'success' });
        // Refetch current page to update list
        const activeValue = statusFilter === 'active' ? 1 : statusFilter === 'inactive' ? 0 : null;
        fetchProducts(currentPage, rowsPerPage, searchTerm, sortConfig.column || 'Created', sortConfig.order, activeValue, userId);
      }
    } catch (e: any) {
      console.error('Error activating product:', e);
      setToast({ msg: e.response?.data?.message || 'Failed to activate product', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (row: Product) => {
    setOpenDeleteModal(true);
    setSelectedRow(row);
  };

  const handleActive = (row: Product) => {
    setOpenActiveModal(true);
    setSelectedRow(row);
  };

  const confirmDelete = () => {
    if (selectedRow) {
      deleteProductById(selectedRow.productId);
    }
  };

  const confirmActive = () => {
    if (selectedRow) {
      activeProductById(selectedRow.productId);
    }
  };

  const handleDecodeToken = (token: string | null): number => {
    if (!token) return 0;
    try {
      const tokenData: TokenData = jwtDecode(token);
      return Number(tokenData.UserId) || 0;
    } catch {
      return 0;
    }
  };

  // Initial load: decode token and fetch only ONCE when userId is ready
  useEffect(() => {
    const token = localStorage.getItem("Token");
    const decodedUserId = handleDecodeToken(token);
    setUserId(decodedUserId);

    if (decodedUserId > 0) {
      fetchProducts(1, rowsPerPage, '', 'Created', 'desc', null, decodedUserId);
    }
  }, []); // Empty dependency → runs only once on mount

  // Trigger fetch on search or filter changes
  useEffect(() => {
    if (userId === 0) return; // Prevent call before userId is set

    const activeValue = statusFilter === 'active' ? 1 : statusFilter === 'inactive' ? 0 : null;
    fetchProducts(1, rowsPerPage, debouncedSearchText, sortConfig.column || 'Created', sortConfig.order, activeValue, userId);
  }, [debouncedSearchText]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Loader isOpen={isLoading} />
      {toast && <Toaster message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <PageMeta title="Product Management Dashboard | Smart Store" description="Product Management Dashboard" />
      <PageBreadcrumb pageTitle="Product Management Dashboard" />

      <div className="bg-white rounded-lg shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Package className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Products</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name, description, category or brand"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="block w-80 pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                onClick={() => navigate('/product-form')}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Create Product
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-4">
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
            {getActiveFilterCount() > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
              <CustomSearchDropdown
                buttonText={statusFilter || "All Status"}
                placeholder="Search status..."
                items={[
                  { id: "1", value: "", label: "All Status" },
                  { id: "2", value: "active", label: "Active" },
                  { id: "3", value: "inactive", label: "Inactive" }
                ]}
                onItemSelect={(item) => handleStatusFilterChange(item.value)}
                buttonClassName="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                menuClassName="rounded-lg shadow-lg border border-gray-300"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            {/* <div className="text-sm text-gray-500">
              Showing {filteredProducts.length} of {totalRecords} products
              {getActiveFilterCount() > 0 && <span className="ml-2 text-blue-600">(filtered)</span>}
            </div> */}
          </div>
          <div className="overflow-x-auto">
            <div className="overflow-x-auto">
              <DataTable
                columns={columns}
                data={filteredProducts}
                showActions={true}
                showDelete={true}
                showCreate={false}
                showPagination={false} // Set to false since we're using custom pagination
                count={totalRecords}
                rowsPerPage={rowsPerPage}
                onSearch={handleSearch}
                onSort={handleSort}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onActive={handleActive}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
              />
            </div>

            {/* Add Custom Pagination Component */}
            {filteredProducts.length > 0 && (
              <Pagination
                currentPage={currentPage}
                onPageChange={handlePageChange}
                hasMore={hasMore}
                totalRecords={totalRecords}
                pageSize={rowsPerPage}
                isLoading={isLoading}
              />
            )}
          </div>
          {filteredProducts.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your search criteria or filters</p>
            </div>
          )}
        </div>
      </div>

      {openDeleteModal && (
        <DeleteConfirmationModal
          handleDeleteConfirm={confirmDelete}
          handleDeleteCancel={() => {
            setOpenDeleteModal(false);
            setSelectedRow(null);
          }}
          message="Confirm that you wish to hide this product?"
        />
      )}

      {openActiveModal && (
        <ActiveConfirmationModal
          handleActiveConfirm={confirmActive}
          handleActiveCancel={() => {
            setOpenActiveModal(false);
            setSelectedRow(null);
          }}
          message="Confirm that you wish to activate this product?"
        />
      )}
    </div>
  );
};

export default ProductDashboard;