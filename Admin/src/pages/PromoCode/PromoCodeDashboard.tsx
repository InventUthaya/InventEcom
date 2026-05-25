import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import PageMeta from '../../components/common/PageMeta';
import Toaster from '../../components/common/Toaster';
import { HTTP_Codes } from '../../components/helper/constants';
import useDebounce from '../../hooks/useDebounce';
import CommonService from '../../services/CommonService';
import Loader from '../../components/common/loader/Loader';
import { Search, Filter, Package } from 'lucide-react';
import DataTable, { Column } from '../../components/common/DataTable';
import DeleteConfirmationModal from '../../components/common/DeleteConfirmationModel';
import CustomSearchDropdown from '../../components/common/CustomSearchDropdown';
import Pagination from '../CustomComponent/Pagination'; // Added import
import { jwtDecode } from 'jwt-decode';

interface ApiPromo {
  PromoID: number;
  PromoCode: string;
  Description: string;
  DiscountType: string;
  Value: number | null;
  StartDate: string | null;
  EndDate: string | null;
  UsageLimit: number | null;
  PerUserLimit: number | null;
  UsedCount: number;
  IsActive: boolean | null;
  Created: string;
}

interface PromoCode {
  id: number;
  code: string;
  description: string;
  type: string;
  value: number | null;
  startDate: string | null;
  endDate: string | null;
  usageLimit: number | null;
  perUserLimit: number | null;
  usedCount: number;
  active: boolean | null;
  created: string;
}

interface Toast {
  msg: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

const PromoCodeDashboard = () => {
  const navigate = useNavigate();
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<PromoCode | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [hasMore, setHasMore] = useState(false); // Added for custom pagination
  const [sortConfig, setSortConfig] = useState<{ column: string | null; order: 'asc' | 'desc'; }>({ column: null, order: 'asc' });
  const [filter, setFilter] = useState<string>('');
  const debouncedSearchText = useDebounce(searchTerm, 500);

  const columns: Column[] = [
    { header: 'Code', accessor: 'code', displayInList: true, sortable: true, className: 'min-w-[120px] px-4' },
    { header: 'Type', accessor: 'type', displayInList: true, sortable: true, className: 'min-w-[120px] px-4' },
    { header: 'Value', accessor: 'value', displayInList: true, sortable: true, className: 'min-w-[100px] px-4' },
    { header: 'Start Date', accessor: 'startDate', displayInList: true, datatype: 'date', sortable: true, className: 'min-w-[140px] px-4' },
    { header: 'End Date', accessor: 'endDate', displayInList: true, datatype: 'date', sortable: true, className: 'min-w-[140px] px-4' },
    { header: 'Usage Limit', accessor: 'usageLimit', displayInList: true, sortable: true, className: 'min-w-[120px] px-4' },
    { header: 'Per User Limit', accessor: 'perUserLimit', displayInList: true, sortable: true, className: 'min-w-[120px] px-4' },
    { header: 'Used Count', accessor: 'usedCount', displayInList: true, sortable: true, className: 'min-w-[100px] px-4' },
    { header: 'Active', accessor: 'active', displayInList: true, datatype: 'boolean', className: 'min-w-[100px] px-4' },
    { header: 'Created', accessor: 'created', displayInList: true, datatype: 'datetime', className: 'min-w-[160px] px-4' },
  ];

  const mapApiToPromoCode = (apiData: ApiPromo[] | undefined): PromoCode[] => {
    if (!apiData || !Array.isArray(apiData)) return [];
    return apiData.map((item) => ({
      id: item.PromoID,
      code: item.PromoCode,
      description: item.Description,
      type: item.DiscountType,
      value: item.Value,
      startDate: item.StartDate,
      endDate: item.EndDate,
      usageLimit: item.UsageLimit,
      perUserLimit: item.PerUserLimit,
      usedCount: item.UsedCount,
      active: item.IsActive,
      created: item.Created,
    }));
  };

  const fetchPromoCodes = async (
    page: number = currentPage,
    size: number = rowsPerPage,
    search: string = '',
    sortColumn: string = '',
    sortOrder: string = 'asc',
    filterValue?: string
  ) => {
    setIsLoading(true);
    const f = typeof filterValue !== 'undefined' ? filterValue : filter;

    const token = localStorage.getItem("token") || sessionStorage.getItem("Token");
    let partnerId: number | null = null;
    if (token) {
      try {
        const decoded = jwtDecode<any>(token);
        if (decoded && decoded.PartnerId) {
          partnerId = Number(decoded.PartnerId);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }

    const requestData: any = {
      pageSize: size,
      pageIndex: page - 1,
      searchText: search || undefined,
      sortOrder: sortOrder.toUpperCase(),
      sortColumn: sortColumn || 'Created',
      PartnerId: partnerId || null,
    };

    if (f === 'active') requestData.IsActive = true;
    else if (f === 'inactive') requestData.IsActive = false;

    try {
      const res = await CommonService.post('bogo', 'GetPromoList', requestData);
      if (res.status === HTTP_Codes.Success || res.status === HTTP_Codes.Created) {
        const apiList: ApiPromo[] =
          res.data?.data ??
          res.data?.Data ??
          res.data ?? [];

        const total =
          res.data?.total ??
          res.data?.totalCount ??
          res.data?.TotalCount ??
          res.data?.totalItems ??
          0;

        const mapped = mapApiToPromoCode(apiList);
        setPromoCodes(mapped);
        setTotalItems(Number(total) || mapped.length);
        const calculatedTotalPages = Math.ceil((Number(total) || mapped.length) / size);
        setTotalPages(calculatedTotalPages);
        setHasMore(page < calculatedTotalPages);
        setCurrentPage(page);
      } else {
        setToast({ msg: res.data?.message || 'Failed to fetch promo codes', type: 'error' });
        setPromoCodes([]);
        setTotalItems(0);
        setHasMore(false);
      }
    } catch (e: any) {
      console.error('Error fetching promo codes:', e);
      setToast({ msg: e?.response?.data?.message || 'Failed to fetch promo codes', type: 'error' });
      setPromoCodes([]);
      setTotalItems(0);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const mapToBackendColumn = (uiColumn: string) => {
    const map: Record<string, string> = {
      code: "PromoCode",
      type: "DiscountType",
      value: "Value",
      startDate: "StartDate",
      endDate: "EndDate",
      usageLimit: "UsageLimit",
      perUserLimit: "PerUserLimit",
      usedCount: "UsedCount",
      active: "IsActive",
      created: "Created"
    };
    return map[uiColumn] || uiColumn;
  };

  const handleSort = (column: string, order: 'asc' | 'desc') => {
    const backendColumn = mapToBackendColumn(column);
    setSortConfig({ column, order });
    setCurrentPage(1);
    fetchPromoCodes(1, rowsPerPage, searchTerm, backendColumn, order, filter);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const backendColumn = sortConfig.column ? mapToBackendColumn(sortConfig.column) : '';
    fetchPromoCodes(page, rowsPerPage, searchTerm, backendColumn, sortConfig.order, filter);
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
    const backendColumn = sortConfig.column ? mapToBackendColumn(sortConfig.column) : '';
    fetchPromoCodes(1, newRowsPerPage, searchTerm, backendColumn, sortConfig.order, filter);
  };

  const handleEdit = (row: PromoCode) => {
    navigate(`/promo-code-form/${row.id}`);
  };

  const hidePromoById = async (promoId: number) => {
    setIsLoading(true);
    try {
      const payload = { Id: promoId, Active: false };
      const res = await CommonService.post('bogo', 'TogglePromoStatus', payload);
      if (res.status === HTTP_Codes.Success || res.status === HTTP_Codes.Created) {
        setToast({ msg: res.data?.message || 'Promo code hidden successfully', type: 'success' });
        fetchPromoCodes(currentPage, rowsPerPage, searchTerm, sortConfig.column || '', sortConfig.order, filter);
      } else {
        setToast({ msg: res.data?.message || 'Failed to hide promo code', type: 'error' });
      }
    } catch (e: any) {
      console.error('Error hiding promo code:', e);
      setToast({ msg: e?.response?.data?.message || 'Failed to hide promo code', type: 'error' });
    } finally {
      setIsLoading(false);
      setOpenDeleteModal(false);
      setSelectedRow(null);
    }
  };

  const handleDelete = (row: PromoCode) => {
    setOpenDeleteModal(true);
    setSelectedRow(row);
  };

  const confirmDelete = () => {
    if (selectedRow) {
      hidePromoById(selectedRow.id);
    }
  };

  const handleFilterChange = (value: string) => {
    setFilter(value);
    setCurrentPage(1);
    fetchPromoCodes(1, rowsPerPage, searchTerm, sortConfig.column || '', sortConfig.order, value);
  };

  const clearFilter = () => {
    setFilter('');
    setSearchTerm('');
    fetchPromoCodes(1, rowsPerPage, '', sortConfig.column || '', sortConfig.order, '');
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filter !== '') count++;
    if (searchTerm !== '') count++;
    return count;
  };

  useEffect(() => {
    fetchPromoCodes(1, rowsPerPage, '', 'Created', 'desc', filter);
  }, []);

  useEffect(() => {
    if (debouncedSearchText !== undefined) {
      setCurrentPage(1);
      fetchPromoCodes(1, rowsPerPage, debouncedSearchText, sortConfig.column || '', sortConfig.order, filter);
    }
  }, [debouncedSearchText]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Loader isOpen={isLoading} />
      {toast && <Toaster message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <PageMeta title="Promo Code Dashboard | Smart Store" description="Promo Code Dashboard" />
      <PageBreadcrumb pageTitle="Promo Code Dashboard" />

      <div className="bg-white rounded-lg shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Package className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Promo Codes</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by code, description, type, or date"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="block w-full md:w-80 pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <button
                onClick={() => navigate('/promo-code-form')}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Create Promo Code
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
                onClick={clearFilter}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
              <CustomSearchDropdown
                buttonText={filter || "All Status"}
                placeholder="Search status..."
                items={[
                  { id: "1", value: "", label: "All Status" },
                  { id: "2", value: "active", label: "Active" },
                  { id: "3", value: "inactive", label: "Inactive" }
                ]}
                onItemSelect={(item) => handleFilterChange(item.value)}
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
              {promoCodes.length} of {totalItems} promo codes
              {getActiveFilterCount() > 0 && <span className="ml-2 text-blue-600">(filtered)</span>}
            </div> */}
          </div>

          <div className="overflow-x-auto">
            <DataTable
              columns={columns}
              data={promoCodes}
              showActions={true}
              showDelete={true}
              showCreate={false}
              showPagination={false} // Disabled built-in pagination
              count={totalItems}
              rowsPerPage={rowsPerPage}
              onSearch={handleSearch}
              onSort={handleSort}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          </div>

          {/* Custom Pagination - Same as TaxationDashboard */}
          {promoCodes.length > 0 && (
            <Pagination
              currentPage={currentPage}
              onPageChange={handlePageChange}
              hasMore={hasMore}
              totalRecords={totalItems}
              pageSize={rowsPerPage}
              isLoading={isLoading}
            />
          )}

          {promoCodes.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No promo codes found</h3>
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
          message="Confirm that you wish to hide this promo code?"
        />
      )}
    </div>
  );
};

export default PromoCodeDashboard;