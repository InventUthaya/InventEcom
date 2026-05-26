'use client';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
    MoreVertical, Package, Filter, Download,
    ChevronDown, Check, FileSpreadsheet, X, RotateCcw,
    Home
} from 'lucide-react';
import Breadcrumb from '../../components/common/Breadcrumb';
import CommonService from '../../services/CommonService';
import CustomSearchDropdown from '../../components/common/CustomSearchDropdown';
import { jwtDecode } from 'jwt-decode';
import { TokenData } from '../../types';
import useDebounce from '../../hooks/useDebounce';
import Pagination from '../CustomComponent/Pagination';
import OrderDetails from '../Orders/OrderDetails';

const PageMeta = ({ title, description }) => (
    <head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
    </head>
);

const RefundDashboard = () => {
    const navigate = useNavigate();

    // Pagination & Data State
    const [orders, setOrders] = useState<any[]>([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage] = useState(10);
    const [hasMore, setHasMore] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [showOrderDetails, setShowOrderDetails] = useState(false);

    // Filter & Search State
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const [filters, setFilters] = useState({
        orderNumber: '',
        customer: '',
        shipment: '',
        orderDate: '',
        status: ''
    });

    // Selection & UI State
    const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
    const [showExportDropdown, setShowExportDropdown] = useState(false);
    const [showActionPopup, setShowActionPopup] = useState<number | null>(null);

    const breadcrumbItems = [
        { label: 'Home', href: '/', icon: Home, onClick: () => navigate("/") },
        { label: 'Refund Management', current: true }
    ];

    const handleDecodeToken = (token: string): TokenData => jwtDecode(token);

    // Fetch refunds with pagination and filters
    const fetchRefunds = async (
        page: number = currentPage,
        search: string = debouncedSearchTerm,
        filterParams = filters
    ) => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem("Token");
            if (!token) throw new Error("No authentication token");

            const decoded = handleDecodeToken(token);
            const userId = Number(decoded.UserId);

            const statusCsv = filterParams.status
                ? // Map status string to StatusId list (adjust mapping as per your actual StatusId values)
                  filterParams.status === 'refund_request' ? '10,17' :
                  filterParams.status === 'refund_completed' ? '11,18' : '10,11,17,18'
                : '10,11,17,18'; // Default: all refund-related statuses

            const filterPayload = {
                OffsetStart: (page - 1) * rowsPerPage,
                RowsPerPage: rowsPerPage,
                SearchText: search || null,
                OrderNumber: filterParams.orderNumber || null,
                Customer: filterParams.customer || null,
                StatusId: statusCsv ? statusCsv.split(',').map(Number) : [10, 11, 17, 18],
                OrderDate: filterParams.orderDate || null,
                UserId: userId
            };

            const response = await CommonService.post("ReturnRequest", "GetReturnList", filterPayload);

            if (response.status === 200 && response.data) {
                const refundData = response.data || [];

                const mappedOrders = refundData.map((item: any) => ({
                    id: item.Id ?? item.id,
                    orderId: item.OrderId ?? item.orderId,
                    orderNumber: item.OrderNumber || item.orderNumber || "Unknown Order",
                    customer: item.CustomerName || item.customerName || "Unknown Customer",
                    orderStatus: item.StatusName || item.statusName,
                    orderDate: item.Created || item.created || item.OrderDate || item.orderDate || "",
                    orderTotal: item.RefundAmount ?? item.refundAmount ?? 0,
                    shipment: 'N/A',
                    paymentMethod: 'N/A',
                    reason: item.Reason || item.reason || "No reason",
                    StatusId: item.StatusId ?? item.statusId
                }));

                setOrders(mappedOrders);
                // Assuming API returns total count in some way — adjust if needed
                // If your API doesn't return total, you can infer from hasMore logic
                setTotalRecords(response.data.TotalRecords || (mappedOrders.length < rowsPerPage ? (page - 1) * rowsPerPage + mappedOrders.length : page * rowsPerPage + 1));
                setHasMore(mappedOrders.length === rowsPerPage);
            } else {
                setOrders([]);
                setTotalRecords(0);
                setError("No data received from server");
            }
        } catch (err: any) {
            console.error("Fetch error:", err);
            setError(err.response?.data?.message || "Failed to load refund requests");
            setOrders([]);
            setTotalRecords(0);
        } finally {
            setLoading(false);
        }
    };

    // Initial load
    useEffect(() => {
        fetchRefunds(1);
    }, []);

    // Trigger fetch on debounced search or filter change
    useEffect(() => {
        setCurrentPage(1);
        fetchRefunds(1, debouncedSearchTerm, filters);
    }, [debouncedSearchTerm, filters]);

    // Global click listener to close popups
    useEffect(() => {
        const handleClickOutside = () => {
            setShowActionPopup(null);
            setShowExportDropdown(false);
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        fetchRefunds(page, debouncedSearchTerm, filters);
    };

    // Export functions remain unchanged (client-side for selected, server-side for all)
    const exportToCSV = (data: any[], fileName: string) => {
        if (!data.length) return;
        const headers = Object.keys(data[0]);
        const csvRows = [headers.join(",")];
        data.forEach(row => {
            const values = headers.map(h => `"${row[h] ?? ""}"`);
            csvRows.push(values.join(","));
        });
        const csvString = csvRows.join("\n");
        const blob = new Blob([csvString], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${fileName}_${Date.now()}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleExportSelected = () => {
        if (!selectedOrders.length) return;
        const selectedData = orders.filter(o => selectedOrders.includes(o.id));
        exportToCSV(selectedData, "SelectedRefunds");
        setShowExportDropdown(false);
    };

    const handleExportAll = async () => {
        try {
            const token = localStorage.getItem("Token");
            const decoded = handleDecodeToken(token);
            const userId = Number(decoded.UserId);

            const filter = {
                OrderNumber: null,
                Customer: null,
                StatusId: [10, 11, 17, 18],
                OrderDate: null,
                UserId: userId
            };

            const res = await CommonService.post("ReturnRequest", "GetReturnList", filter);
            const responseData = res?.data ?? [];
            const formattedRefunds = responseData.map((item: any) => ({
                Id: item.Id,
                OrderNumber: item.OrderNumber,
                Customer: item.CustomerName || "Guest",
                StatusId: item.StatusName,
                OrderDate: item.Created,
                RefundAmount: item.RefundAmount,
                Reason: item.Reason
            }));
            exportToCSV(formattedRefunds, "AllRefunds");
        } catch (error) {
            console.error("Failed to export all refunds", error);
        } finally {
            setShowExportDropdown(false);
        }
    };

    // UI Helpers
    const statusConfig = {
        RefundPending: { label: 'Refund Request', color: 'text-orange-600', bgColor: 'bg-orange-600', icon: RotateCcw },
        RefundCompleted: { label: 'Refund Completed', color: 'text-green-600', bgColor: 'bg-green-600', icon: Check },
        ReplacementRequest: { label: 'Replacement Request', color: 'text-orange-600', bgColor: 'bg-orange-600', icon: RotateCcw },
        ReplacementCompleted: { label: 'Replacement Completed', color: 'text-green-600', bgColor: 'bg-green-600', icon: Check },
    };

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
        } catch { return 'Invalid date'; }
    };

    const formatTime = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        } catch { return 'Invalid time'; }
    };

    const formatCurrency = (amount: number) =>
        `INR ${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

    const handleSelectOrder = (orderId: number) => {
        setSelectedOrders(prev =>
            prev.includes(orderId) ? prev.filter(id => id !== orderId) : [...prev, orderId]
        );
    };

    const handleSelectAll = () => {
        if (selectedOrders.length === orders.length) {
            setSelectedOrders([]);
        } else {
            setSelectedOrders(orders.map(order => order.id));
        }
    };

    const handleActionClick = (order: any, event: React.MouseEvent) => {
        event.stopPropagation();
        setShowActionPopup(showActionPopup === order.id ? null : order.id);
    };

    const handleRefundClick = async (order: any) => {
        await CommonService.post("ReturnRequest", "UpdateRefund", { OrderId: order.id });
        fetchRefunds(currentPage);
    };

    const handleReplacementClick = async (order: any) => {
        await CommonService.post("ReturnRequest", "UpdateReplacement", { OrderId: order.id });
        fetchRefunds(currentPage);
    };

    const handleFilterChange = (filterType: string, value: string) => {
        setFilters(prev => ({ ...prev, [filterType]: value }));
        setCurrentPage(1);
    };

    const clearAllFilters = () => {
        setFilters({
            orderNumber: '', customer: '', shipment: '', orderDate: '', status: ''
        });
        setSearchTerm('');
        setCurrentPage(1);
    };

    const getActiveFilterCount = () => {
        let count = searchTerm ? 1 : 0;
        Object.values(filters).forEach(v => v && count++);
        return count;
    };

    const handleOrderNumberClick = (order: any) => {
        setSelectedOrder(order);
        setShowOrderDetails(true);
    };

    const handleBackToOrders = () => {
        setShowOrderDetails(false);
        setSelectedOrder(null);
    };

    if (showOrderDetails && selectedOrder) {
        return <OrderDetails order={selectedOrder} onBack={handleBackToOrders} orderID={selectedOrder.orderId} />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <PageMeta title="Refund Management | Dashboard" description="Refund Dashboard" />

            <div className="max-w-7xl mx-auto px-6 py-4">
                <Breadcrumb items={breadcrumbItems} />
            </div>

            {/* Search Bar */}
            <div className="max-w-7xl mx-auto py-2">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                            <Filter className="h-4 w-4 text-gray-500" />
                            <h3 className="text-base sm:text-lg font-medium text-gray-700">Filters</h3>
                            {getActiveFilterCount() > 0 && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {getActiveFilterCount()} active
                                </span>
                            )}
                        </div>
                        {getActiveFilterCount() > 0 && (
                            <button onClick={clearAllFilters} className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                                Clear all filters
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Search</label>
                            <input
                                type="text"
                                placeholder="Search by order number or customer..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Order Number</label>
                            <input
                                type="text"
                                value={filters.orderNumber}
                                onChange={(e) => handleFilterChange('orderNumber', e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Filter by order number"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Customer</label>
                            <input
                                type="text"
                                value={filters.customer}
                                onChange={(e) => handleFilterChange('customer', e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Filter by customer"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Order Date</label>
                            <input
                                type="date"
                                value={filters.orderDate}
                                onChange={(e) => handleFilterChange('orderDate', e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                            <CustomSearchDropdown
                                buttonText={filters.status ? (filters.status === 'refund_request' ? 'Refund Request' : 'Refund Completed') : "All Statuses"}
                                placeholder="Search status..."
                                items={[
                                    { id: "1", value: "", label: "All Statuses" },
                                    { id: "2", value: "refund_request", label: "Refund Request" },
                                    { id: "3", value: "refund_completed", label: "Refund Completed" }
                                ]}
                                onItemSelect={(item) => handleFilterChange('status', item.value)}
                                buttonClassName="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto pb-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative mb-4 sm:mb-0">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowExportDropdown(!showExportDropdown);
                                }}
                                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
                            >
                                <Download className="h-4 w-4 mr-2" />
                                Export Refund Orders
                                <ChevronDown className="h-4 w-4 ml-2" />
                            </button>
                            {showExportDropdown && (
                                <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-20">
                                    <div className="py-1">
                                        <button
                                            onClick={handleExportSelected}
                                            disabled={selectedOrders.length === 0}
                                            className={`flex items-center w-full px-4 py-2 text-sm ${selectedOrders.length === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                                        >
                                            <FileSpreadsheet className="h-4 w-4 mr-3" />
                                            Export to Excel (selected)
                                        </button>
                                        <button onClick={handleExportAll} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            <FileSpreadsheet className="h-4 w-4 mr-3" />
                                            Export to Excel (all)
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="text-sm text-gray-500">
                            {orders.length} of {totalRecords.toLocaleString()} refund requests
                            {getActiveFilterCount() > 0 && <span className="ml-2 text-blue-600">(filtered)</span>}
                        </div>
                    </div>

                    {/* Table Content */}
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading refund data...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <X className="h-8 w-8 text-red-600" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading data</h3>
                            <p className="text-gray-500">{error}</p>
                        </div>
                    ) : (
                        <>
                            <div className="w-full overflow-x-auto">
                                <table className="w-full min-w-[640px]">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="w-12 px-4 py-3 text-left border-r border-gray-300">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedOrders.length === orders.length && orders.length > 0}
                                                    onChange={handleSelectAll}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                />
                                            </th>
                                            <th className="w-40 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap border-r border-gray-300">Order Number</th>
                                            <th className="w-32 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap border-r border-gray-300">Customer</th>
                                            <th className="w-32 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap border-r border-gray-300">Order Date</th>
                                            <th className="w-28 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap border-r border-gray-300">Order Status</th>
                                            <th className="w-32 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap border-r border-gray-300">Order Total</th>
                                            <th className="w-16 px-2 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {orders.map((order) => {
                                            const StatusIcon = statusConfig[order.orderStatus]?.icon || RotateCcw;
                                            return (
                                                <tr key={order.id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-4 whitespace-nowrap border-r border-gray-200">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedOrders.includes(order.id)}
                                                            onChange={() => handleSelectOrder(order.id)}
                                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap border-r border-gray-200">
                                                        <span
                                                            className="text-xs font-medium text-blue-600 hover:text-blue-800 cursor-pointer hover:underline"
                                                            onClick={() => handleOrderNumberClick(order)}
                                                        >
                                                            {order.orderNumber}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap border-r border-gray-200">
                                                        <span className="text-xs text-gray-900">{order.customer}</span>
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap border-r border-gray-200">
                                                        <div>
                                                            <div className="text-xs text-gray-900">{formatDate(order.orderDate)}</div>
                                                            <div className="text-xs text-gray-900">{formatTime(order.orderDate)}</div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap border-r border-gray-200">
                                                        <span className={`inline-flex items-center text-xs font-medium ${statusConfig[order.orderStatus]?.color || 'text-orange-600'}`}>
                                                            <StatusIcon className="h-3 w-3 mr-1" />
                                                            {statusConfig[order.orderStatus]?.label || order.orderStatus}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap border-r border-gray-200">
                                                        <div className="text-xs font-medium text-gray-900">{formatCurrency(order.orderTotal)}</div>
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-right relative">
                                                        <button
                                                            disabled={!(Number(order.StatusId) === 10 || Number(order.StatusId) === 17)}
                                                            onClick={(e) => handleActionClick(order, e)}
                                                            className={`p-1 ${(Number(order.StatusId) === 10 || Number(order.StatusId) === 17) ? 'text-gray-400 hover:text-gray-600 cursor-pointer' : 'text-gray-300 cursor-not-allowed'}`}
                                                        >
                                                            <MoreVertical className="h-4 w-4" />
                                                        </button>
                                                        {showActionPopup === order.id && (Number(order.StatusId) === 10 || Number(order.StatusId) === 17) && (
                                                            <div className="absolute right-0 top-8 z-50 sm:w-56 w-48">
                                                                <div className="bg-white rounded-lg shadow-lg border border-gray-200 relative">
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setShowActionPopup(null);
                                                                        }}
                                                                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 z-10 p-1 text-xs rounded-sm hover:bg-gray-100"
                                                                    >
                                                                        Close
                                                                    </button>
                                                                    <div className="p-3 space-y-4 text-left">
                                                                        <div className="pt-3">
                                                                            <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Actions</h3>
                                                                            <div className="space-y-0.5">
                                                                                {Number(order.StatusId) === 10 && (
                                                                                    <button 
                                                                                        onClick={() => handleRefundClick(order)} 
                                                                                        className="flex items-center w-full text-left px-2 py-1.5 text-sm rounded-md transition-colors text-gray-800 hover:bg-gray-50"
                                                                                    >
                                                                                        <RotateCcw className="h-4 w-4 mr-2" /> Refund
                                                                                    </button>
                                                                                )}
                                                                                {Number(order.StatusId) === 17 && (
                                                                                    <button 
                                                                                        onClick={() => handleReplacementClick(order)} 
                                                                                        className="flex items-center w-full text-left px-2 py-1.5 text-sm rounded-md transition-colors text-gray-800 hover:bg-gray-50"
                                                                                    >
                                                                                        <RotateCcw className="h-4 w-4 mr-2" /> Replacement
                                                                                    </button>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>

                                {orders.length === 0 && (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Package className="h-8 w-8 text-gray-400" />
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">No refund requests found</h3>
                                        <p className="text-gray-500">Try adjusting your search criteria or filters</p>
                                    </div>
                                )}
                            </div>

                            {/* Custom Pagination */}
                            {orders.length > 0 && (
                                <Pagination
                                    currentPage={currentPage}
                                    onPageChange={handlePageChange}
                                    hasMore={hasMore}
                                    totalRecords={totalRecords}
                                    pageSize={rowsPerPage}
                                    isLoading={loading}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RefundDashboard;