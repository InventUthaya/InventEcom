// src/pages/OrderDashboard.tsx (or wherever your file is)
import React, { useEffect, useMemo, useState } from 'react';
import OrderDetails from './OrderDetails';
import Breadcrumb from '../../components/common/Breadcrumb';
import { useNavigate } from 'react-router';
import CommonService from '../../services/CommonService';
import { jwtDecode } from 'jwt-decode';
import { Roles } from '../../components/helper/HelperConstant';
import AssignRiderModal from './AssignRiderModal';
import CustomSearchDropdown from '../../components/common/CustomSearchDropdown';
import Pagination from '../CustomComponent/Pagination';

interface Orders {
    Id: number;
    CustomerName: string;
    OrderNumber: string;
    shipment: string;
    Orderdate: string;
    StatusName: string;
    NetPayable: number;
    paymentMethod: string;
}

const PageMeta = ({ title, description }: { title: string; description: string }) => {
    return (
        <head>
            <title>{title}</title>
            <meta name="description" content={description} />
        </head>
    );
};

const OrderDashboard = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
    const [showExportDropdown, setShowExportDropdown] = useState(false);
    const [showActionPopup, setShowActionPopup] = useState(false);

    const [selectedOrderForAction, setSelectedOrderForAction] = useState<Orders | null>(null);
    const [actionOrderId, setActionOrderId] = useState<number | null>(null);

    const [selectedOrder, setSelectedOrder] = useState<Orders | null>(null);
    const [showOrderDetails, setShowOrderDetails] = useState(false);

    const [isFiltersExpanded, setIsFiltersExpanded] = useState(true);

    const [orders, setOrders] = useState<Orders[]>([]);
    const [totalAmount, setTotalAmount] = useState(0);

    // Server-side pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10; // Adjust as needed
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const [errorMessage, setErrorMessage] = useState('');

    const [roleId, setRoleId] = useState<number>(0);
    const [userId, setUserId] = useState<number>(0);

    // Assign rider
    const [assignRiderOpen, setAssignRiderOpen] = useState(false);
    const [riders, setRiders] = useState<Array<{ id: number; name: string }>>([]);

    // OTP
    const [otpModel, setOtpModel] = useState(false);
    const [otpValue, setOtpValue] = useState('');
    const [cooldown, setCooldown] = useState(0);
    const [totalOrdersCount, setTotalOrdersCount] = useState<number>(0);

    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem('Token');
        if (!token) return;

        try {
            const decoded = jwtDecode(token) as { RoleId: number; UserId: number };
            setRoleId(decoded.RoleId);
            setUserId(parseInt(decoded.UserId.toString(), 10));
        } catch (error) {
            console.error('Error decoding JWT:', error);
        }
    }, []);

    const [filters, setFilters] = useState({
        orderNumber: '',
        customer: '',
        shipment: '',
        orderDate: '',
        orderStatus: '',
    });

    const breadcrumbItems =
        roleId === Roles.Rider
            ? [
                {
                    label: 'Home',
                    href: '/',
                    onClick: (e: React.MouseEvent) => {
                        e.preventDefault();
                        navigate('/');
                    },
                },
                { label: 'Order Dashboard', current: true },
            ]
            : [{ label: 'Order Dashboard', current: true }];

    const statusConfig: Record<string, { label: string }> = {
        pending: { label: 'Pending' },
        processing: { label: 'Processing' },
        confirmed: { label: 'Confirmed' },
        shipped: { label: 'Shipped' },
        delivered: { label: 'Delivered' },
        completed: { label: 'Complete' },
        cancelled: { label: 'Cancelled' },
        rejected: { label: 'Rejected' },
        assigned: { label: 'Assigned' },
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
    };

    const formatTime = (dateString?: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    const formatCurrency = (amount: any) => {
        const num = parseFloat(amount) || 0;
        return `₹ ${num.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    };

    // Client-side filtering on fetched page
    const filteredOrders = useMemo(() => {
        return orders.filter((order) => {
            const matchesSearch =
                !searchTerm ||
                (order.OrderNumber?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (order.CustomerName?.toLowerCase() || '').includes(searchTerm.toLowerCase());

            const matchesOrderNumber =
                !filters.orderNumber ||
                (order.OrderNumber?.toLowerCase() || '').includes(filters.orderNumber.toLowerCase());

            const matchesCustomer =
                !filters.customer ||
                (order.CustomerName?.toLowerCase() || '').includes(filters.customer.toLowerCase());

            const matchesShipment =
                !filters.shipment || (order.shipment?.toLowerCase() || '') === filters.shipment.toLowerCase();

            const matchesOrderStatus =
                !filters.orderStatus || (order.StatusName?.toLowerCase() || '') === filters.orderStatus.toLowerCase();

            const matchesOrderDate =
                !filters.orderDate || (order.Orderdate?.split('T')[0] || '') === filters.orderDate;

            return (
                matchesSearch &&
                matchesOrderNumber &&
                matchesCustomer &&
                matchesShipment &&
                matchesOrderStatus &&
                matchesOrderDate
            );
        });
    }, [orders, searchTerm, filters]);

    const handleSelectOrder = (orderId: number) => {
        setSelectedOrders((prev) =>
            prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
        );
    };

    const handleSelectAll = () => {
        if (selectedOrders.length === filteredOrders.length) setSelectedOrders([]);
        else setSelectedOrders(filteredOrders.map((o) => o.Id));
    };

    const handleActionClick = (order: Orders) => {
        setSelectedOrderForAction(order);
        setActionOrderId(order.Id);
        setShowActionPopup(true);
    };

    const handleOrderNumberClick = (order: Orders) => {
        setSelectedOrder(order);
        setShowOrderDetails(true);
    };

    const handleBackToOrders = () => {
        setShowOrderDetails(false);
        setSelectedOrder(null);
    };

    const handleFilterChange = (filterType: string, value: string) => {
        setFilters((prev) => ({ ...prev, [filterType]: value }));
        setCurrentPage(1);
    };

    const clearAllFilters = () => {
        setFilters({ orderNumber: '', customer: '', shipment: '', orderDate: '', orderStatus: '' });
        setSearchTerm('');
        setCurrentPage(1);
    };

    const removeFilter = (filterType: string) => {
        if (filterType === 'search') setSearchTerm('');
        else setFilters((prev) => ({ ...prev, [filterType]: '' }));
        setCurrentPage(1);
    };

    const getActiveFilterCount = () => {
        let count = searchTerm ? 1 : 0;
        return count + Object.values(filters).filter(Boolean).length;
    };

    const getActiveFilters = () => {
        const active: Array<{ type: string; label: string; value: string }> = [];
        if (searchTerm) active.push({ type: 'search', label: `Search: "${searchTerm}"`, value: searchTerm });
        if (filters.orderNumber) active.push({ type: 'orderNumber', label: `Order Number: "${filters.orderNumber}"`, value: filters.orderNumber });
        if (filters.customer) active.push({ type: 'customer', label: `Customer: "${filters.customer}"`, value: filters.customer });
        if (filters.shipment) active.push({ type: 'shipment', label: `Shipment: "${filters.shipment}"`, value: filters.shipment });
        if (filters.orderDate) active.push({ type: 'orderDate', label: `Order Date: "${filters.orderDate}"`, value: filters.orderDate });
        if (filters.orderStatus) active.push({ type: 'orderStatus', label: `Status: "${filters.orderStatus}"`, value: filters.orderStatus });
        return active;
    };

    // Fetch orders from server with pagination
    const fetchOrders = async (page: number = currentPage) => {
        const token = sessionStorage.getItem('Token');
        if (!token) return;

        setIsLoading(true);

        try {
            const decoded = jwtDecode(token) as any;
            const user = parseInt(decoded.UserId?.toString() ?? '0', 10);

            const offsetStart = (page - 1) * pageSize + 1;

            const data = {
                StatusId: null,
                FromDate: null,
                ToDate: null,
                UserId: user,
                OffsetStart: offsetStart,
                RowsPerPage: pageSize,
            };

            const res = await CommonService.post('order', 'GetOrders', data);

            if (res.status === 200 && res.data) {
                const responseData = Array.isArray(res.data) ? res.data : [];

                if (responseData.length === 0 && page === 1) {
                    setErrorMessage('No orders found.');
                    setOrders([]);
                    setTotalAmount(0);
                    setHasMore(false);
                    setTotalOrdersCount(0);
                    return;
                }

                // Get total count from first order (all orders have same TotalCount)
                const totalCount = responseData.length > 0 ? responseData[0].TotalCount : 0;
                setTotalOrdersCount(totalCount);

                const transformed: Orders[] = responseData.map((o: any) => ({
                    Id: o.Id,
                    CustomerName: o.CustomerName || '',
                    OrderNumber: o.OrderNumber || '',
                    Orderdate: o.Orderdate || '',
                    StatusName: o.StatusName || '',
                    NetPayable: parseFloat(o.NetPayable) || 0,
                    paymentMethod: 'Cash',
                    shipment: 'via Standard Shipping',
                }));

                setOrders(transformed);
                setTotalAmount(transformed.reduce((sum, o) => sum + (o.NetPayable || 0), 0));

                // Calculate if there are more pages
                const hasMoreRecords = (page * pageSize) < totalCount;
                setHasMore(hasMoreRecords);

                setErrorMessage('');
            } else {
                setErrorMessage('Failed to fetch orders.');
                setOrders([]);
                setTotalOrdersCount(0);
                setHasMore(false);
            }
        } catch (e) {
            console.error('Error fetching orders:', e);
            setErrorMessage('Error fetching orders. Please try again.');
            setOrders([]);
            setTotalOrdersCount(0);
            setHasMore(false);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders(currentPage);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

    // Reset to page 1 and refetch on filter/search change
    useEffect(() => {
        if (currentPage !== 1) {
            setCurrentPage(1);
        } else {
            fetchOrders(1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm, filters]);

    const handlePageChange = (newPage: number) => {
        if (newPage < 1) return;
        setCurrentPage(newPage);
    };

    // Status update
    const updateStatus = (orderId: number | null, status: string) => {
        if (!orderId) return;

        CommonService.postWithDoubleQueryParam('orderdetail', 'UpdateOrderStatus', 'orderId', orderId, 'statusName', status)
            .then((res: any) => {
                if (res.status === 200) {
                    setShowActionPopup(false);
                    setAssignRiderOpen(false);
                    setOtpModel(false);
                    setOtpValue('');
                    setCooldown(0);
                    fetchOrders(); // Refresh current page
                }
            })
            .catch((e: any) => console.error('Error updating status:', e));
    };

    const handleAssign = (riderId: number) => {
        if (!actionOrderId) return;

        const data = { riderID: riderId, orderID: actionOrderId };

        CommonService.post('rider-assignment', 'assign-rider-to-order', data)
            .then((res: any) => {
                if (res.status !== 200) return;

                return CommonService.postWithDoubleQueryParam(
                    'orderdetail',
                    'UpdateOrderStatus',
                    'orderId',
                    actionOrderId,
                    'statusName',
                    'Assigned'
                );
            })
            .then((res2: any) => {
                if (res2?.status === 200) {
                    setAssignRiderOpen(false);
                    setShowActionPopup(false);
                    fetchOrders();
                }
            })
            .catch((e: any) => console.error('Error assigning/updating status:', e));
    };

    const getRidersList = () => {
        CommonService.get('rider-assignment', 'riders/assignments', 'noParam')
            .then((res: any) => {
                if (res.status === 200) {
                    const transformed = (res.data || []).map((r: any) => ({
                        id: r.RiderID,
                        name: r.FullName,
                    }));
                    setRiders(transformed);
                }
            })
            .catch((e: any) => console.error('Error fetching riders:', e));
    };

    const generateOTP = () => {
        if (!actionOrderId) return;

        CommonService.postWithSinglyQueryParam('orderdetail', 'CompleteOrderOTP', 'orderId', actionOrderId)
            .then((res: any) => {
                if (res.status === 200) setCooldown(60);
            })
            .catch((e: any) => console.error('Error generating OTP:', e));
    };

    const verifyOTP = () => {
        if (!actionOrderId) return;

        CommonService.postWithDoubleQueryParam('orderdetail', 'VerifyOrderOTP', 'orderId', actionOrderId, 'otp', otpValue)
            .then((res: any) => {
                if (res.status === 200) {
                    updateStatus(actionOrderId, 'Completed');
                }
            })
            .catch((e: any) => console.error('Error verifying OTP:', e));
    };

    useEffect(() => {
        if (!otpModel) return;
        generateOTP();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [otpModel, actionOrderId]);

    useEffect(() => {
        if (cooldown <= 0) return;
        const t = window.setTimeout(() => setCooldown((c) => c - 1), 1000);
        return () => window.clearTimeout(t);
    }, [cooldown]);

    const exportToCSV = (rows: any[], fileName: string) => {
        if (!rows.length) return;
        const headers = Object.keys(rows[0]);
        const csvRows = [headers.join(',')];
        rows.forEach((row) => {
            const values = headers.map((h) => `"${row[h] ?? ''}"`);
            csvRows.push(values.join(','));
        });
        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${fileName}_${Date.now()}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleExportSelected = () => {
        if (!selectedOrders.length) return;
        exportToCSV(orders.filter((o) => selectedOrders.includes(o.Id)), 'SelectedOrders');
        setShowExportDropdown(false);
    };

    const handleExportAll = async () => {
        const token = sessionStorage.getItem('Token');
        if (!token) return;

        const decoded = jwtDecode(token) as { UserId: number };
        const user = parseInt(decoded.UserId.toString(), 10);

        try {
            const data = {
                StatusId: null,
                FromDate: null,
                ToDate: null,
                UserId: user,
                OffsetStart: 1,
                RowsPerPage: 999999,
            };

            const res = await CommonService.post('order', 'GetOrders', data);
            const responseData = Array.isArray(res.data) ? res.data : [];

            const transformedOrders = responseData.map((o: any) => ({
                Id: o.Id,
                CustomerName: o.CustomerName || '',
                OrderNumber: o.OrderNumber || '',
                Orderdate: o.Orderdate || '',
                StatusName: o.StatusName || '',
                NetPayable: parseFloat(o.NetPayable) || 0,
                paymentMethod: 'Cash',
                shipment: 'via Standard Shipping',
            }));

            exportToCSV(transformedOrders, 'AllOrders');
        } catch (error) {
            console.error('Failed to export all', error);
        } finally {
            setShowExportDropdown(false);
        }
    };

    if (showOrderDetails && selectedOrder) {
        return <OrderDetails order={selectedOrder} onBack={handleBackToOrders} orderID={selectedOrder.Id} />;
    }

    const activeFilters = getActiveFilters();

    type ShippingStep = 1 | 2 | 3 | 4;

    const normalizeStatus = (v?: string) =>
        (v ?? '').trim().toLowerCase().replace(/_/g, ' ').replace(/-/g, ' ').replace(/\s+/g, ' ');

    const getNextAllowedStep = (statusName?: string): ShippingStep | null => {
        const s = normalizeStatus(statusName);
        if (s === 'completed' || s === 'complete' || s === 'cancelled' || s === 'canceled') return null;
        if (s === 'shipped') return 2;
        if (s === 'assigned') return 3;
        if (s === 'out of delivery' || s === 'out for delivery') return 4;
        return 1;
    };

    const nextAllowed = getNextAllowedStep(selectedOrderForAction?.StatusName);
    const isEnabled = (step: ShippingStep) => nextAllowed === step;

    const actionBtnClass = (enabled: boolean) =>
        `flex items-center w-full text-left px-2 py-1.5 text-sm rounded-md transition-colors ${enabled ? 'text-gray-800 hover:bg-gray-50' : 'text-gray-400 bg-gray-100 cursor-not-allowed'
        }`;

    return (
        <div className="min-h-screen bg-gray-50">
            <PageMeta title="Dashboard | Order Dashboard" description="This is the Order Dashboard page" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                <Breadcrumb items={breadcrumbItems} />
            </div>

            {/* OTP Modal */}
            {otpModel && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-5">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-base font-semibold text-gray-900">Complete order with OTP</h2>
                            <button
                                onClick={() => {
                                    setOtpModel(false);
                                    setOtpValue('');
                                    setCooldown(0);
                                }}
                                className="text-gray-500 hover:text-gray-800"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="space-y-3">
                            <div className="text-sm text-gray-600">
                                Order ID: <span className="font-medium text-gray-900">{actionOrderId ?? '-'}</span>
                            </div>
                            <input
                                type="number"
                                placeholder="Enter OTP"
                                value={otpValue}
                                onChange={(e) => setOtpValue(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                            <div className="flex flex-col sm:flex-row gap-2">
                                <button
                                    onClick={verifyOTP}
                                    disabled={!otpValue || otpValue.trim() === ''}
                                    className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm disabled:bg-gray-300 disabled:text-gray-600"
                                >
                                    Verify and Complete
                                </button>
                                <button
                                    onClick={generateOTP}
                                    disabled={cooldown > 0}
                                    className={`w-full px-4 py-2 rounded-md text-sm ${cooldown > 0
                                            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                            : 'bg-blue-200 text-blue-800 hover:bg-blue-300'
                                        }`}
                                >
                                    {cooldown > 0 ? `Resend OTP (${cooldown}s)` : 'Resend OTP'}
                                </button>
                            </div>
                            <button
                                onClick={() => {
                                    setOtpModel(false);
                                    setOtpValue('');
                                    setCooldown(0);
                                }}
                                className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <AssignRiderModal open={assignRiderOpen} setOpen={setAssignRiderOpen} riders={riders} onAssign={handleAssign} />

            {/* Filters Section */}
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    {/* ... filters UI unchanged ... */}
                    {/* (keeping the same filter UI as original) */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-medium text-gray-700">Filters</h3>
                            {getActiveFilterCount() > 0 && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {getActiveFilterCount()} active
                                </span>
                            )}
                        </div>
                        <div className="flex items-center space-x-2">
                            {getActiveFilterCount() > 0 && isFiltersExpanded && (
                                <button onClick={clearAllFilters} className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                                    Clear all filters
                                </button>
                            )}
                            <button
                                onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
                                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors duration-200"
                            >
                                {isFiltersExpanded ? (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {activeFilters.length > 0 && (
                        <div className="mb-4">
                            <div className="flex flex-wrap gap-2">
                                {activeFilters.map((filter, index) => (
                                    <span
                                        key={`${filter.type}-${index}`}
                                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                    >
                                        {filter.label}
                                        <button onClick={() => removeFilter(filter.type)} className="ml-2 hover:bg-blue-200 rounded-full p-0.5">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {isFiltersExpanded && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                            {/* All filter inputs exactly as before */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Order Number</label>
                                <input
                                    type="text"
                                    value={filters.orderNumber}
                                    onChange={(e) => handleFilterChange('orderNumber', e.target.value)}
                                    className="w-full px-3 py-2 text-xs border placeholder-gray-700 border-gray-300 rounded-md"
                                    placeholder="Enter order number"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Customer</label>
                                <input
                                    type="text"
                                    value={filters.customer}
                                    onChange={(e) => handleFilterChange('customer', e.target.value)}
                                    className="w-full px-3 py-2 text-xs placeholder-gray-700 border border-gray-300 rounded-md"
                                    placeholder="Enter customer name"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Shipment</label>
                                <CustomSearchDropdown
                                    buttonText={filters.shipment || "All Shipments"}
                                    placeholder="Search shipment methods..."
                                    items={[
                                        { id: "1", value: "", label: "All Shipments" },
                                        { id: "2", value: "via In-Store Pickup", label: "via In-Store Pickup" },
                                        { id: "3", value: "via Express Delivery", label: "via Express Delivery" },
                                        { id: "4", value: "via Standard Shipping", label: "via Standard Shipping" }
                                    ]}
                                    onItemSelect={(item) => handleFilterChange('shipment', item.value)}
                                    buttonClassName="w-full px-3 py-2 text-xs border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:border-blue-500"
                                    menuClassName="rounded-lg shadow-lg border border-gray-300"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Order Date</label>
                                <input
                                    type="date"
                                    value={filters.orderDate}
                                    onChange={(e) => handleFilterChange('orderDate', e.target.value)}
                                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Order Status</label>
                                <CustomSearchDropdown
                                    buttonText={filters.orderStatus || "All Status"}
                                    placeholder="Search status..."
                                    items={[
                                        { id: "1", value: "", label: "All Status" },
                                        { id: "2", value: "pending", label: "Pending" },
                                        { id: "3", value: "processing", label: "Processing" },
                                        { id: "4", value: "confirmed", label: "Confirmed" },
                                        { id: "5", value: "shipped", label: "Shipped" },
                                        { id: "6", value: "delivered", label: "Delivered" },
                                        { id: "7", value: "completed", label: "Complete" },
                                        { id: "8", value: "cancelled", label: "Cancelled" },
                                        { id: "9", value: "rejected", label: "Rejected" },
                                        { id: "10", value: "assigned", label: "Assigned" }
                                    ]}
                                    onItemSelect={(item) => handleFilterChange('orderStatus', item.value)}
                                    buttonClassName="w-full px-3 py-2 text-xs border border-gray-300 rounded-md"
                                    menuClassName="rounded-lg shadow-lg border border-gray-300"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Orders Table */}
            <div className="max-w-7xl mx-auto pb-6 px-4 sm:px-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-visible">
                    <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                            <div className="relative">
                                <button
                                    onClick={() => setShowExportDropdown(!showExportDropdown)}
                                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 384 512" fill="currentColor">
                                        <path d="M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-288-128 0c-17.7 0-32-14.3-32-32L192 0 64 0zM256 0l0 128 128 0L256 0zM155.7 250.2L120 345.4l36.2 95.2c3.3 8.6 14 12.4 22.6 8.3l21.6-10.8c8.6-4.3 12.4-15 8.3-23.6l-27.4-72.2 27.4-72.2c4.1-8.6 .3-19.3-8.3-23.6l-21.6-10.8c-8.6-4.3-19.3-.5-22.6 8.3zm91.4 8.3c-4.1-8.6-14.8-12.4-23.4-8.3l-21.6 10.8c-8.6 4.3-12.4 15-8.3 23.6l18.2 47.8-18.2 47.8c-4.1 8.6-.3 19.3 8.3 23.6l21.6 10.8c8.6 4.3 19.3 .5 23.4-8.3L264 345.4l18.2-47.8-18.2-47.8c-4.1-8.6-.3-19.3 8.3-23.6l21.6-10.8c8.6-4.3 19.3-.5 23.4 8.3l-18.2 47.8 18.2 47.8c4.1 8.6 .3 19.3-8.3 23.6l-21.6 10.8c-8.6 4.3-19.3 .5-23.4-8.3L264 345.4l-16.9-95.2z" />
                                    </svg>&nbsp;
                                    Export Orders
                                </button>

                                {showExportDropdown && (
                                    <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-20">
                                        <div className="py-1">
                                            <button
                                                onClick={handleExportSelected}
                                                disabled={selectedOrders.length === 0}
                                                className={`flex items-center w-full px-4 py-2 text-sm ${selectedOrders.length === 0
                                                        ? 'text-gray-400 cursor-not-allowed'
                                                        : 'text-gray-700 hover:bg-gray-100'
                                                    }`}
                                            >
                                                Export to Excel (selected)
                                            </button>
                                            <button onClick={handleExportAll} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                Export to Excel (all)
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* <div className="text-sm text-gray-500">
                            Showing {filteredOrders.length} orders
                            {getActiveFilterCount() > 0 && <span className="ml-2 text-blue-600">(filtered)</span>}
                        </div> */}
                    </div>

                    {errorMessage && <div className="text-center py-4 text-red-600">{errorMessage}</div>}
                    {isLoading && <div className="text-center py-8 text-gray-500">Loading orders...</div>}

                    <div className="w-full relative overflow-visible">
                        <table className="w-full table-fixed hidden sm:table">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="w-12 px-4 py-3 text-left border-r border-gray-300">
                                        <input
                                            type="checkbox"
                                            checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                                            onChange={handleSelectAll}
                                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                                        />
                                    </th>
                                    <th className="w-40 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap border-r border-gray-300">
                                        Order Number
                                    </th>
                                    <th className="w-32 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap border-r border-gray-300">
                                        Customer
                                    </th>
                                    <th className="w-36 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap border-r border-gray-300">
                                        Shipment
                                    </th>
                                    <th className="w-32 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap border-r border-gray-300">
                                        Order Date
                                    </th>
                                    <th className="w-28 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap border-r border-gray-300">
                                        Order Status
                                    </th>
                                    <th className="w-32 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap border-r border-gray-300">
                                        Order Total
                                    </th>
                                    <th className="w-16 px-2 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredOrders.map((order) => {
                                    const statusKey = (order.StatusName || '').toLowerCase();
                                    const statusLabel = statusConfig[statusKey]?.label || order.StatusName || 'Unknown';

                                    return (
                                        <tr key={order.Id} className="hover:bg-gray-50 relative">
                                            <td className="px-4 py-4 whitespace-nowrap border-r border-gray-200">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedOrders.includes(order.Id)}
                                                    onChange={() => handleSelectOrder(order.Id)}
                                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                                                />
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap border-r border-gray-200">
                                                <button
                                                    onClick={() => handleOrderNumberClick(order)}
                                                    className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline truncate block"
                                                >
                                                    {order.OrderNumber}
                                                </button>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap border-r border-gray-200">
                                                <span className="text-xs text-gray-900 truncate block">{order.CustomerName}</span>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap border-r border-gray-200">
                                                <span className="text-xs text-gray-900 truncate">{order.shipment}</span>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap border-r border-gray-200">
                                                <div className="text-xs text-gray-900">{formatDate(order.Orderdate)}</div>
                                                <div className="text-xs text-gray-900">{formatTime(order.Orderdate)}</div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap border-r border-gray-200">
                                                <span className="inline-flex items-center text-xs font-medium">{statusLabel}</span>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap border-r border-gray-200">
                                                <div className="text-xs font-medium text-gray-900">{formatCurrency(order.NetPayable)}</div>
                                                <div className="text-xs text-gray-500">{order.paymentMethod}</div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-right relative">
                                                <button onClick={() => handleActionClick(order)} className="text-gray-400 hover:text-gray-600 p-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                                    </svg>
                                                </button>

                                                {showActionPopup && selectedOrderForAction?.Id === order.Id && (
                                                    <div className="absolute right-0 top-8 z-50 sm:w-56 w-48">
                                                        <div className="bg-white rounded-lg shadow-lg border border-gray-200 relative">
                                                            <button
                                                                onClick={() => setShowActionPopup(false)}
                                                                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 z-10 p-1 rounded-sm hover:bg-gray-100"
                                                            >
                                                                Close
                                                            </button>
                                                            <div className="p-3 space-y-4 text-left">
                                                                <div className="border-t border-gray-100 pt-3">
                                                                    <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Shipping Status</h3>
                                                                    <div className="space-y-0.5">
                                                                        <button disabled={!isEnabled(1)} onClick={() => updateStatus(actionOrderId, 'Shipped')} className={actionBtnClass(isEnabled(1))}>
                                                                            Shipped
                                                                        </button>
                                                                        <button
                                                                            disabled={!isEnabled(2)}
                                                                            onClick={() => { setAssignRiderOpen(true); setShowActionPopup(false); getRidersList(); }}
                                                                            className={actionBtnClass(isEnabled(2))}
                                                                        >
                                                                            Assign Rider
                                                                        </button>
                                                                        <button disabled={!isEnabled(3)} onClick={() => updateStatus(actionOrderId, 'Out-For-Delivery')} className={actionBtnClass(isEnabled(3))}>
                                                                            Out Of Delivery
                                                                        </button>
                                                                        <button
                                                                            disabled={!isEnabled(4)}
                                                                            onClick={() => { setOtpModel(true); }}
                                                                            className={actionBtnClass(isEnabled(4))}
                                                                        >
                                                                            Complete with otp
                                                                        </button>
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
                    </div>

                    {/* Reusable Pagination Component */}
                    {!isLoading && filteredOrders.length > 0 && (
                        <Pagination
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                            hasMore={hasMore}
                            totalRecords={totalOrdersCount}
                            pageSize={pageSize}
                            isLoading={isLoading}
                        />
                    )}
                </div>
            </div>

            {(showExportDropdown || showActionPopup) && (
                <div
                    className="fixed inset-0 z-10"
                    onClick={() => {
                        setShowExportDropdown(false);
                        setShowActionPopup(false);
                    }}
                />
            )}
        </div>
    );
};

export default OrderDashboard;