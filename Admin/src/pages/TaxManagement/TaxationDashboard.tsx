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
import Pagination from '../CustomComponent/Pagination'; // Import pagination component

// Interface for the raw API response
interface ApiTaxation {
  TaxMgmtId: number;
  Igst: number | null;
  Cgst: number | null;
  Sgst: number | null;
  Tds: number | null;
  DisplayInList: boolean | null;
  EffectiveStartDate: string | null;
  EffectiveEndDate: string | null;
  Created: string;
  Modified: string | null;
  IsActive: boolean | null;
  Id: number;
  CreatedBy: string;
  ModifiedBy: string | null;
  IsValid: boolean;
  ValidationErrors: { Items: any[] };
  TotalCount?: number; // Added for pagination
}

// Interface for the component's Taxation model
interface Taxation {
  Id: number;
  igst: number | null;
  cgst: number | null;
  sgst: number | null;
  tds: number | null;
  effectiveStartDate: string | null;
  effectiveEndDate: string | null;
  displayInList: boolean | null;
  created: string;
  modified: string | null;
  active: boolean | null;
  TotalCount: number;
}

interface Toast {
  msg: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

const TaxationDashboard = () => {
  const navigate = useNavigate();
  const [taxations, setTaxations] = useState<Taxation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Taxation | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Changed from 99999 to 10
  const [totalRecords, setTotalRecords] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    column: string | null;
    order: 'asc' | 'desc';
  }>({ column: null, order: 'asc' });
  const [filter, setFilter] = useState<string>('');

  const debouncedSearchText = useDebounce(searchTerm, 500);

  const columns: Column[] = [
    { header: 'IGST %', accessor: 'igst', displayInList: true, sortable: true },
    { header: 'CGST %', accessor: 'cgst', displayInList: true, sortable: true },
    { header: 'SGST %', accessor: 'sgst', displayInList: true, sortable: true },
    { header: 'TDS %', accessor: 'tds', displayInList: true, sortable: true },
    { header: 'Start Date', accessor: 'effectiveStartDate', displayInList: true, datatype: 'date', sortable: true },
    { header: 'End Date', accessor: 'effectiveEndDate', displayInList: true, datatype: 'date', sortable: true },
    { header: 'Created', accessor: 'created', displayInList: true, datatype: 'datetime' },
    { header: 'Modified', accessor: 'modified', displayInList: true, datatype: 'datetime' },
    { header: 'Active', accessor: 'active', displayInList: true, datatype: 'boolean' },
  ];

  const mapApiToTaxation = (apiData: ApiTaxation[]): any[] => {
    return apiData.map((item) => ({
      Id: item.Id,
      igst: item.Igst,
      cgst: item.Cgst,
      sgst: item.Sgst,
      tds: item.Tds,
      effectiveStartDate: item.EffectiveStartDate,
      effectiveEndDate: item.EffectiveEndDate,
      displayInList: item.DisplayInList,
      created: item.Created,
      modified: item.Modified,
      active: item.IsActive,
    }));
  };

  const fetchTaxations = async (
    page: number = currentPage,
    size: number = rowsPerPage,
    search: string = '',
    sortColumn: string = '',
    sortOrder: string = 'asc',
    IsActive: boolean | null = null
  ) => {
    setIsLoading(true);

    try {
      // Build query params
      const queryParams: any = {
        Page: page,
        PageSize: size,
        SearchText: search || undefined,
        SortColumn: sortColumn || 'Created',
        SortOrder: sortOrder.toUpperCase(),
        IsActive: IsActive
      };

      // Add IsActive filter only if selected
      // if (filter === 'active') {
      //   queryParams.IsActive = true;
      // } else if (filter === 'inactive') {
      //   queryParams.IsActive = false;
      // }
      // If filter is empty, don't send IsActive (will get all records)

      const res = await CommonService.post('taxination', 'GetTaxList', queryParams);

      if (res.status === HTTP_Codes.Success || res.status === HTTP_Codes.Created) {
        if (res.data && res.data.Taxes) {
          const apiData = res.data.Taxes as ApiTaxation[];
          const mappedItems = mapApiToTaxation(apiData || []);

          setTaxations(mappedItems);
          setTotalRecords(res.data.TotalRecords || 0);

          // Calculate if there are more pages
          const totalPages = res.data.TotalPages || Math.ceil((res.data.TotalRecords || 0) / size);
          setHasMore(page < totalPages);
          setCurrentPage(page);
        } else {
          // Fallback for old API structure
          const responseData = res.data as ApiTaxation[];
          const mappedItems = mapApiToTaxation(responseData || []);

          setTaxations(mappedItems);
          const totalFromFirstItem = mappedItems.length > 0 ? mappedItems[0]?.TotalCount || 0 : 0;
          setTotalRecords(totalFromFirstItem);
          setHasMore(mappedItems.length === size);
          setCurrentPage(page);
        }
      } else {
        setToast({ msg: res.data?.message || 'Failed to fetch taxations', type: 'error' });
        setTaxations([]);
        setTotalRecords(0);
        setHasMore(false);
      }
    } catch (e: any) {
      console.error('Error fetching taxations:', e);
      setToast({ msg: e.response?.data?.message || 'Failed to fetch taxations', type: 'error' });
      setTaxations([]);
      setTotalRecords(0);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleSort = (column: string, order: 'asc' | 'desc') => {
    setSortConfig({ column, order });
    setCurrentPage(1);
    let isActiveFilter: boolean | null = null;
    if (filter === 'active') {
      isActiveFilter = true;
    } else if (filter === 'inactive') {
      isActiveFilter = false;
    }

    fetchTaxations(1, rowsPerPage, searchTerm, column, order, isActiveFilter);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    let isActiveFilter: boolean | null = null;
    if (filter === 'active') {
      isActiveFilter = true;
    } else if (filter === 'inactive') {
      isActiveFilter = false;
    }

    fetchTaxations(page, rowsPerPage, searchTerm, sortConfig.column || '', sortConfig.order, isActiveFilter);
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
    let isActiveFilter: boolean | null = null;
    if (filter === 'active') {
      isActiveFilter = true;
    } else if (filter === 'inactive') {
      isActiveFilter = false;
    }

    fetchTaxations(1, newRowsPerPage, searchTerm, sortConfig.column || '', sortConfig.order, isActiveFilter);
  };

  const handleEdit = (row: Taxation) => {
    navigate(`/taxation-form/${row.Id}`);
  };

  const handleDelete = (row: Taxation) => {
    setOpenDeleteModal(true);
    setSelectedRow(row);
  };

  const confirmDelete = async () => {
    if (!selectedRow) return;

    setIsLoading(true);
    const payload = {
      id: selectedRow.Id,
      igst: selectedRow.igst ? Number(selectedRow.igst) : null,
      cgst: selectedRow.cgst ? Number(selectedRow.cgst) : null,
      sgst: selectedRow.sgst ? Number(selectedRow.sgst) : null,
      tds: selectedRow.tds ? Number(selectedRow.tds) : null,
      effectiveStartDate: selectedRow.effectiveStartDate
        ? new Date(selectedRow.effectiveStartDate).toISOString()
        : null,
      effectiveEndDate: selectedRow.effectiveEndDate
        ? new Date(selectedRow.effectiveEndDate).toISOString()
        : null,
      isActive: false,
    };

    const res = await CommonService.post(
      'taxination',
      'CreateOrEditTax',
      payload
    );

    if (
      res.status === HTTP_Codes.Success ||
      res.status === HTTP_Codes.Created
    ) {
      if (res.data?.data === 0) {
        setToast({ msg: 'Taxation already exists', type: 'error' });
      } else {
        setToast({
          msg: res.data?.message || 'Taxation deleted successfully',
          type: 'success',
        });
        setOpenDeleteModal(false);
        fetchTaxations(currentPage, rowsPerPage, searchTerm, sortConfig.column || '', sortConfig.order);
      }
    }
    setIsLoading(false);
  };

  const handleFilterChange = (value: string) => {
    setFilter(value);
    setCurrentPage(1);
    let isActiveFilter: boolean | null = null;

    if (value === 'active') {
      isActiveFilter = true;
    } else if (value === 'inactive') {
      isActiveFilter = false;
    } else {
      isActiveFilter = null;
    }

    fetchTaxations(1, rowsPerPage, searchTerm, sortConfig.column || '', sortConfig.order, isActiveFilter);
  };

  const clearFilter = () => {
    setFilter('');
    setSearchTerm('');
    setCurrentPage(1);
    fetchTaxations(1, rowsPerPage, '', sortConfig.column || '', sortConfig.order);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filter !== '') count++;
    if (searchTerm !== '') count++;
    return count;
  };

  // Initial fetch
  useEffect(() => {
    fetchTaxations(1, rowsPerPage, '', 'Created', 'DESC');
  }, []);

  // Fetch on search change
  useEffect(() => {
    if (debouncedSearchText !== undefined) {
      setCurrentPage(1);
      fetchTaxations(1, rowsPerPage, debouncedSearchText, sortConfig.column || '', sortConfig.order);
    }
  }, [debouncedSearchText]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Loader isOpen={isLoading} />
      {toast && <Toaster message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <PageMeta title="Tax Management Dashboard | Smart Store" description="Tax Management Dashboard" />
      <PageBreadcrumb pageTitle="Tax Management Dashboard" />

      <div className="bg-white rounded-lg shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Package className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Taxations</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by tax rate or date"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="block w-80 pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                onClick={() => navigate('/taxation-form')}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Create Taxation
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
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filter}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="text-sm text-gray-500">
              {/* {taxations.length} of {totalRecords} taxations */}
              {getActiveFilterCount() > 0 && <span className="ml-2 text-blue-600">(filtered)</span>}
            </div>
          </div>

          <DataTable
            columns={columns}
            data={taxations}
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
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />

          {/* Add Custom Pagination Component */}
          {taxations.length > 0 && (
            <Pagination
              currentPage={currentPage}
              onPageChange={handlePageChange}
              hasMore={hasMore}
              totalRecords={totalRecords}
              pageSize={rowsPerPage}
              isLoading={isLoading}
            />
          )}

          {taxations.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No taxations found</h3>
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
          message="Confirm that you wish to hide this taxation?"
        />
      )}
    </div>
  );
};

export default TaxationDashboard;