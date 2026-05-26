import React, { useCallback, useEffect, useState } from 'react';
import {
    ArrowLeft,
    FileDown,
    Bike,
    Check,
    X,
    Truck,
    Package2,
    CheckCircle,
    PackageCheck // for Shipped & Out for Delivery
} from 'lucide-react';
import BillingShipping from './BillingShipping';
import Products from './Products';
import OrderNotes from './OrderNotes';
import Attributes from './Attributes';
import AssignRiderModal from './AssignRiderModal';
import CommonService from '../../services/CommonService';
import { HelperConstant } from '../../components/helper/HelperConstant';
import { useNavigate } from 'react-router-dom';

// -------------------- Types --------------------
interface Rider {
    id: number;
    name: string;
}

interface OrderHeader {
    Id?: number;
    UserId?: number;
    FullName?: string;
    OrderNumber?: string;
    AddressLine1?: string;
    AddressLine2?: string;
    City?: string;
    State?: string;
    Country?: string;
    PinCode?: string;
    OrderDate?: string;
    ProductTotal?: number;
    ProductTaxTotal?: number;
    ChargeTotal?: number;
    NetPayable?: number;
    OrderStatus?: string;
    StatusId?: number; // Critical for logic
    Modified?: string;
    Created?: string;
    Email?: string;
    Phone?: string;
    DiscountTotal?: number;
    PromoCode?: string;
    PromoType?: string;
    PromoValue?: number;
}

// ... (other interfaces unchanged: OrderDetail, ProductDetail, Payment, StatusHistory)

interface OrderProps {
    order: any;
    onBack: () => void;
    orderID: number | string;
}

// -------------------- Component --------------------
const OrderDetails: React.FC<OrderProps> = ({ order, onBack, orderID }) => {
    const [activeTab, setActiveTab] = useState<'general' | 'billing' | 'products' | 'notes' | 'attributes'>('general');
    const [otpValue, setOtp] = useState<string>('');
    const [open, setOpen] = useState<boolean>(false);
    const [rejectModalOpen, setRejectModalOpen] = useState<boolean>(false);
    const [cooldown, setCooldown] = useState<number>(0);
    const [otpModel, setOtpModel] = useState<boolean>(false);
    const [riders, setRiders] = useState<Rider[]>([]);
    const [orderHeader, setOrderHeader] = useState<OrderHeader>({});
    const [orderTrack, setOrderTrack] = useState({});
    const [orderDetails, setOrderDetails] = useState([]);
    const [productDetails, setProductDetails] = useState([]);
    const [payments, setPayments] = useState([]);
    const [statusHistory, setStatusHistory] = useState([]);
    const [actionType, setActionType] = useState<'assign' | 'reject' | 'complete' | null>(null);
    const [isReturnModalOpen, setIsReturnModalOpen] = useState<boolean>(false);
    const [isReplacementModalOpen, setIsReplacementModalOpen] = useState<boolean>(false);
    const [selectedOrderDetailId, setSelectedOrderDetailId] = useState<number | null>(null);
    const [returnReason, setReturnReason] = useState<string>('');
    const [returnNote, setReturnNote] = useState<string>('');
    const navigate = useNavigate();
    const [paymentStatus, setPaymentStatus] = useState<string>('-');
    const orderSubtotal = Number(orderHeader?.ProductTotal) || 0;
    const netPayable = Number(orderHeader?.NetPayable);
    const orderTaxAmount = Number.isFinite(netPayable) ? Math.abs(netPayable - orderSubtotal) : 0;
    const orderTotal = orderSubtotal;
    const [isRefundModalOpen, setIsRefundModalOpen] = useState<boolean>(false);
    const [refundAmount, setRefundAmount] = useState<string>('');
    const [refundReason, setRefundReason] = useState<string>('');
    const [refundNote, setRefundNote] = useState<string>('');

    const tabs = [
        { id: 'general', label: 'General', icon: PackageCheck, active: true },
        { id: 'billing', label: 'Billing & Shipping', icon: PackageCheck, active: true },
        { id: 'products', label: 'Products', icon: PackageCheck, active: true },
        { id: 'notes', label: 'Order notes', icon: PackageCheck, active: true },
    ];

    useEffect(() => {
        document.title = `Order Details - ${order?.Id ?? orderID}`;
    }, [order, orderID]);

    const formatDate = useCallback((dateString?: string) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return (
            date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' }) +
            ' ' +
            date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
        );
    }, []);

    const formatCurrency = useCallback((amount?: number) => {
        if (amount == null || amount === 0) return '-';
        return `₹ ${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    }, []);

    // Fetch order details
    const fetchOrderDetails = useCallback(() => {
        CommonService.getWithSingleParam('order', 'GetOrderDetails', orderID)
            .then((res: any) => {
                if (res.status === 200) {
                    setOrderHeader(res.data?.OrderHeader ?? {});
                    setOrderTrack(res.data?.OrderTrack ?? {});
                    setOrderDetails(res.data?.OrderDetails ?? []);
                    setProductDetails(res.data?.ProductDetails ?? []);
                    setPayments(res.data?.Payments ?? []);
                    setStatusHistory(res.data?.StatusHistory ?? []);
                }
            })
            .catch((e: any) => console.error('Error fetching orders:', e));
    }, [orderID]);

    useEffect(() => {
        fetchOrderDetails();
    }, [fetchOrderDetails]);

    // Your API to update status by StatusId
    const updateOrderStatusById = useCallback((newStatusId: number) => {
        const payload = {
            orderId: orderHeader?.Id,
            statusId: newStatusId,
        };

        CommonService.post('order', 'UpdateOrderStatusById', payload)
            .then((res: any) => {
                if (res.status === 200) {
                    fetchOrderDetails(); // Refresh data
                }
            })
            .catch((e: any) => {
                console.error('Error updating order status:', e);
            });
    }, [orderHeader?.Id, fetchOrderDetails]);

    const generateOTP = useCallback(() => {
        CommonService.postWithSinglyQueryParam('orderdetail', 'CompleteOrderOTP', 'orderId', orderHeader?.Id)
            .then((res: any) => {
                if (res.status === 200) {
                    // OTP sent
                }
            })
            .catch((e: any) => console.error('Error generating OTP:', e));
    }, [orderHeader?.Id]);

    const verifyOTP = (otp: string) => {
        CommonService.postWithDoubleQueryParam('orderdetail', 'VerifyOrderOTP', 'orderId', orderHeader?.Id, 'otp', otp)
            .then((res: any) => {
                if (res.status === 200) {
                    updateOrderStatusById(4); // Mark as Completed
                    setOtpModel(false);
                }
            })
            .catch((e: any) => console.error('Error verifying OTP:', e));
    };

    const resendOtp = () => {
        generateOTP();
        setCooldown(60);
    };

    useEffect(() => {
        if (cooldown > 0) {
            const timer = setTimeout(() => setCooldown(c => c - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [cooldown]);

    useEffect(() => {
        if (otpModel) generateOTP();
    }, [otpModel, generateOTP]);

    useEffect(() => {
        if (payments && payments.length > 0) {
            setPaymentStatus(payments[0].PaymentStatus);
        }
    }, [payments]);

    const getRidersList = useCallback(() => {
        CommonService.get('rider-assignment', 'riders/assignments', 'noParam')
            .then((res: any) => {
                if (res.status === 200) {
                    const transformedRiders = (res.data || []).map((rider: any) => ({
                        id: rider.RiderID,
                        name: rider.FullName
                    }));
                    setRiders(transformedRiders);
                }
            })
            .catch((e: any) => console.error('Error fetching riders:', e));
    }, []);

    const handleAssign = (riderId: number) => {
        const data = { riderID: riderId, orderID: orderHeader?.Id };
        CommonService.post('rider-assignment', 'assign-rider-to-order', data)
            .then((res: any) => {
                if (res.status === 200) {
                    updateOrderStatusById(7); // Move to Out for Delivery
                    setOpen(false);
                }
            })
            .catch((e: any) => console.error('Error assigning rider:', e));
    };

    const handleShipped = () => {
        updateOrderStatusById(6);
    };

    const handleOutForDelivery = () => {
        updateOrderStatusById(16);
    };

    const handleCompleteWithOTP = () => {
        setOtpModel(true);
    };

    // Render shipping flow actions
    const renderShippingActions = () => {
        const currentStatus = orderHeader?.OrderStatus;

        // If order is already completed, show nothing
        if (currentStatus === HelperConstant.orderStatus.CompletedOrder) {
            return null;
        }

        // If order is cancelled or rejected, show nothing
        if (currentStatus === HelperConstant.orderStatus.Cancelled ||
            currentStatus === HelperConstant.orderStatus.Rejected) {
            return null;
        }

        // Shipping flow buttons
        switch (currentStatus) {
            // case 'Pending':
            case 'Confirmed':
                return (
                    <button
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                        onClick={handleShipped}
                    >
                        <Package2 className="h-4 w-4 mr-2" />
                        Mark as Shipped
                    </button>
                );

            case 'Shipped':
                return (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className="text-sm font-medium text-gray-500">Ready for delivery. Kindly assign a rider</span>
                        <button
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                            onClick={() => {
                                setOpen(true);
                                setActionType('assign');
                                getRidersList();
                            }}
                        >
                            <Bike className="h-4 w-4 mr-2" />
                            Assign Rider
                        </button>
                    </div>
                );

            case 'Assigned':
                return (
                    <button
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-colors"
                        onClick={handleOutForDelivery}
                    >
                        <Truck className="h-4 w-4 mr-2" />
                        Out For Delivery
                    </button>
                );

            case 'Out For Delivery':
                return (
                    <button
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors"
                        onClick={handleCompleteWithOTP}
                    >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Complete Order with OTP
                    </button>
                );

            default:
                return null;
        }
    };

    // Render existing order actions (combined with shipping actions)
    // Main Action Renderer based purely on StatusId
    const renderOrderActions = () => {
        const currentStatus = orderHeader?.OrderStatus;
        const statusId = orderHeader?.StatusId;

        // If order is completed, cancelled, or rejected, show nothing
        if (currentStatus === HelperConstant.orderStatus.CompletedOrder ||
            currentStatus === HelperConstant.orderStatus.Cancelled ||
            currentStatus === HelperConstant.orderStatus.Rejected) {
            return null;
        }

        // For shipping flow statuses (Pending, Shipped, Assigned, Out For Delivery)
        if (currentStatus === 'Confirmed' ||
            currentStatus === 'Shipped' ||
            currentStatus === 'Assigned' ||
            currentStatus === 'Out For Delivery') {
            return (
                <div className="border p-3 rounded-2xl">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className="text-sm font-medium text-gray-500">Order Status Actions</span>
                        {renderShippingActions()}
                    </div>
                </div>
            );
        }

        // Original logic for other statuses
        switch (currentStatus) {
            case HelperConstant.orderStatus.PendingOrders:
                return (
                    <div className="border p-3 rounded-2xl">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <span className="text-sm font-medium text-gray-500">Yet to assign Assignee. Kindly assign it</span>
                            <button
                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                                onClick={() => {
                                    setOpen(true);
                                    setActionType('assign');
                                    getRidersList();
                                }}
                            >
                                <Bike className="h-4 w-4 mr-2" />
                                Assign Rider
                            </button>
                        </div>
                    </div>
                );

                // Rejected or Completed → No actions
                if (statusId === 4 || statusId === 16) {
                    return null;
                }

                // Status 1: Show "Mark as Shipped"
                if (statusId === 2) {
                    return (
                        <div className="border p-4 rounded-2xl bg-blue-50">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <span className="text-sm font-medium text-blue-900">
                                    Order is ready. Mark it as shipped to proceed.
                                </span>
                                <button
                                    onClick={() => updateOrderStatusById(6)} // Move to Rider Assignable
                                    className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                                >
                                    <PackageCheck className="h-4 w-4 mr-2" />
                                    Mark as Shipped
                                </button>
                            </div>
                        </div>
                    );
                }

                // Status 6: Assign Rider
                if (statusId === 6) {
                    return (
                        <div className="border p-4 rounded-2xl bg-yellow-50">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <span className="text-sm font-medium text-yellow-900">
                                    Order is shipped. Assign a rider for delivery.
                                </span>
                                <button
                                    onClick={() => {
                                        setOpen(true);
                                        getRidersList();
                                    }}
                                    className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 rounded-md"
                                >
                                    <Bike className="h-4 w-4 mr-2" />
                                    Assign Rider
                                </button>
                            </div>
                        </div>
                    );
                }

            case HelperConstant.orderStatus.ProcessingOrder:
                return (
                    <div className="flex gap-2 flex-wrap">
                        <button
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-red-400 hover:bg-red-600 rounded-md transition-colors"
                            onClick={() => {
                                setRejectModalOpen(true);
                            }}
                        >
                            <X className="h-4 w-4 mr-2" />
                            Order Reject
                        </button>
                        <button
                            onClick={() => setOtpModel(true)}
                            className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md"
                        >
                            <Check className="h-4 w-4 mr-2" />
                            Complete with OTP
                        </button>
                    </div>
                );

            default:
                return null;
        }
    };

    const generateReferenceNumber = (orderNumber?: string) => {
        if (!orderNumber) return '-';
        return `06fddcf5-5e57-4d53-8c18-a${orderNumber.slice(-8)}`;
    };

    const formatAddress = () => {
        const addr = orderHeader;
        if (!addr?.AddressLine1) return '-';
        return [addr.AddressLine1, addr.AddressLine2, addr.City, addr.State, addr.Country, addr.PinCode]
            .filter(Boolean).join(', ');
    };

    const getProductDetail = (productId?: number) => {
        return productDetails.find(p => p.ProductId === productId) || {};
    };

    const handleOrderAsPDF = (orderId: number) => {
        CommonService.getWithSingleParam('order', 'GenerateInvoice', orderId)
            .then((res: any) => {
                if (res.status === 200 && res.data) {
                    const byteCharacters = atob(res.data);
                    const byteNumbers = new Array(byteCharacters.length);
                    for (let i = 0; i < byteCharacters.length; i++) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }
                    const byteArray = new Uint8Array(byteNumbers);
                    const blob = new Blob([byteArray], { type: "application/pdf" });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = `Invoice_${orderId}.pdf`;
                    link.click();
                    URL.revokeObjectURL(url);
                }
            })
            .catch((err: any) => console.error("Failed to generate invoice PDF", err));
    };

    const handleTabClick = (tabId: string) => setActiveTab(tabId as any);
    const handleSubmitRefund = () => {
        // Example payload – adjust according to your backend
        const payload = {
            orderId: orderHeader?.Id,
            amount: Number(refundAmount),
            reason: refundReason,
            note: refundNote,
            paymentId: payments[0]?.Id, // if needed
        };

        CommonService.post('order', 'ProcessOfflineRefund', payload)
            .then((res: any) => {
                if (res.status === 200) {
                    alert('Refund processed successfully');
                    setIsRefundModalOpen(false);
                    fetchOrderDetails(); // refresh order data
                    // Reset fields
                    setRefundAmount('');
                    setRefundReason('');
                    setRefundNote('');
                }
            })
            .catch((err: any) => {
                console.error('Refund error:', err);
                alert('Failed to process refund');
            });
    };
    const handleCreateReturnRequest = async () => {
        if (!selectedOrderDetailId || !returnReason) {
            alert('Please select an item and reason.');
            return;
        }

        const selectedDetail = orderDetails.find((d: any) => d.Id === selectedOrderDetailId);
        if (!selectedDetail) return;

        const refundAmount = getLineItemTotal(selectedDetail);

        const payload = {
            OrderId: orderHeader?.Id,
            OrderDetailId: selectedOrderDetailId,
            SkuId: selectedDetail.SkuId || selectedDetail.ProductId,
            UserId: orderHeader?.UserId,
            Reason: returnReason + (returnNote ? ` | Note: ${returnNote}` : ''),
            RefundAmount: refundAmount,
            IsReturn: true,
            PartnerId: selectedDetail.PartnerId || 0,
        };

        try {
            const res = await CommonService.post('ReturnRequest', 'CreateReturn', payload);
            if (res.status === 200) {
                // alert(`Return request created successfully! ID: ${res.data.ReturnId}`);
                setPaymentStatus('Return Initiated');
                setIsReturnModalOpen(false);
                fetchOrderDetails();
            }
        } catch (err: any) {
            console.error('Return request failed:', err);
            alert(err.response?.data?.message || 'Failed to create return request. Check order status or return window.');
        }
    };

    const handleCreateReplacementRequest = async () => {
        if (!selectedOrderDetailId || !returnReason) {
            alert('Please select an item and reason.');
            return;
        }

        const selectedDetail = orderDetails.find((d: any) => d.Id === selectedOrderDetailId);
        if (!selectedDetail) return;

        const payload = {
            OrderId: orderHeader?.Id,
            OrderDetailId: selectedOrderDetailId,
            SkuId: selectedDetail.SkuId || selectedDetail.ProductId,
            UserId: orderHeader?.UserId,
            Reason: returnReason + (returnNote ? ` | Note: ${returnNote}` : ''),
            RefundAmount: 0,
            IsReturn: false,
            PartnerId: selectedDetail.PartnerId || 0,
        };

        try {
            const res = await CommonService.post('ReturnRequest', 'CreateReturn', payload);
            if (res.status === 200) {
                setPaymentStatus('Replacement Initiated');
                setIsReplacementModalOpen(false);
                fetchOrderDetails();
            }
        } catch (err: any) {
            console.error('Replacement request failed:', err);
            alert(err.response?.data?.message || 'Failed to create replacement request.');
        }
    };

    const getLineItemTotal = (detail: any) => {
        if (!detail) return 0;
        return Number(detail.TotalPrice ?? detail.UnitPrice * detail.Quantity);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center space-x-4">
                            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
                                <ArrowLeft className="h-5 w-5" />
                            </button>
                            <h1 className="text-xl font-semibold">Order #{orderHeader?.OrderNumber || orderID}</h1>
                        </div>
                        {order.StatusName == 'Completed' && (
                            <div className="flex items-center space-x-2 flex-wrap gap-2">
                                <button
                                    onClick={() => handleOrderAsPDF(order?.Id ?? orderID)}
                                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                                >
                                    <FileDown className="h-4 w-4 mr-2" />
                                    Order as PDF
                                </button>
                            </div>)}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto py-6 px-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row">
                    {/* Tab Navigation */}
                    <div className="w-full md:w-48 p-0 md:p-3 border-b md:border-b-0 md:border-r border-gray-200">
                        <div className="md:hidden overflow-x-auto whitespace-nowrap pb-2">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabClick(tab.id)}
                                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors mr-2 ${activeTab === tab.id
                                        ? 'bg-orange-50 text-orange-700 border-b-4 border-orange-500'
                                        : tab.active
                                            ? 'text-gray-900 hover:bg-gray-50'
                                            : 'text-gray-400 cursor-not-allowed'
                                        }`}
                                    disabled={!tab.active}
                                >
                                    <tab.icon className="h-4 w-4 mr-2" />
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                        <div className="hidden md:block">
                            <nav className="space-y-1">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => handleTabClick(tab.id)}
                                        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tab.id
                                            ? 'bg-orange-50 text-orange-700 border-l-4 border-orange-500'
                                            : tab.active
                                                ? 'text-gray-900 hover:bg-gray-50'
                                                : 'text-gray-400 cursor-not-allowed'
                                            }`}
                                        disabled={!tab.active}
                                    >
                                        <tab.icon className="h-4 w-4 mr-3" />
                                        {tab.label}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 p-6">
                        {activeTab === 'general' && (
                            <div className="space-y-6">
                                {/* Current Status */}
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-gray-500">Order Status</span>
                                    <span className="text-sm font-semibold capitalize text-blue-700">
                                        {orderHeader?.OrderStatus || '-'}
                                    </span>
                                </div>

                                {/* Dynamic Actions Based on StatusId */}
                                {renderOrderActions()}

                                {/* OTP Modal for Status 7 → 16 */}
                                {otpModel && (
                                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                                        <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
                                            <h3 className="text-lg font-semibold mb-4">Complete Order with OTP</h3>
                                            <input
                                                type="text"
                                                placeholder="Enter OTP"
                                                value={otpValue}
                                                onChange={(e) => setOtp(e.target.value)}
                                                className="w-full px-4 py-2 border rounded-md mb-4 focus:ring-2 focus:ring-green-500"
                                            />
                                            <div className="flex justify-end gap-3">
                                                <button
                                                    onClick={() => setOtpModel(false)}
                                                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() => verifyOTP(otpValue)}
                                                    disabled={!otpValue.trim()}
                                                    className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-400"
                                                >
                                                    Verify & Complete
                                                </button>
                                            </div>
                                            <button
                                                onClick={resendOtp}
                                                disabled={cooldown > 0}
                                                className="text-sm text-blue-600 mt-4 block underline"
                                            >
                                                {cooldown > 0 ? `Resend OTP in ${cooldown}s` : 'Resend OTP'}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Reject Modal (if needed in future) */}
                                {rejectModalOpen && (
                                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                                        <div className="bg-white rounded-lg p-6 w-full max-w-sm">
                                            <h3 className="text-lg font-semibold mb-4">Reject Order?</h3>
                                            <p className="text-sm text-gray-600 mb-6">This cannot be undone.</p>
                                            <div className="flex justify-end gap-3">
                                                <button onClick={() => setRejectModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded-md">
                                                    Cancel
                                                </button>
                                                <button onClick={() => { updateOrderStatusById(4); setRejectModalOpen(false); }} className="px-4 py-2 bg-red-600 text-white rounded-md">
                                                    Confirm Reject
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Order Number */}
                                <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2">
                                    <span className="text-sm font-medium text-gray-500">Order Number</span>
                                    <span className="text-sm text-gray-900">{orderHeader?.OrderNumber ?? '-'}</span>
                                </div>

                                {/* Order Reference Number */}
                                <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2">
                                    <span className="text-sm font-medium text-gray-500">Order reference number</span>
                                    <span className="text-sm text-gray-500">{generateReferenceNumber(orderHeader?.OrderNumber)}</span>
                                </div>

                                <hr className="border-gray-200" />

                                {/* Customer */}
                                <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2">
                                    <span className="text-sm font-medium text-gray-500">Customer</span>
                                    <button className="text-sm text-black">{orderHeader?.FullName ?? '-'}</button>
                                </div>

                                {/* Customer IP Address */}
                                {/* <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2">
                                    <span className="text-sm font-medium text-gray-500">Customer IP address</span>
                                    <span className="text-sm text-gray-900">-</span>
                                </div> */}

                                <hr className="border-gray-200" />

                                {/* Order Subtotal */}
                                {/* <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2">
                                    <span className="text-sm font-medium text-gray-500">Order subtotal (excl tax)</span>
                                    <span className="text-sm text-gray-900">
                                        {formatCurrency(orderSubtotal)}
                                    </span>
                                </div> */}

                                {(() => {
                                    const postDiscountBase = Number(orderHeader?.ProductTotal) || 0;
                                    const postDiscountTax = Number(orderHeader?.ProductTaxTotal) || 0;
                                    const preTaxDiscount = Number(orderHeader?.DiscountTotal) || 0;
                                    const taxRate = orderDetails?.[0]?.TaxRate || 0;

                                    // 1. Final Total (what the customer actually paid)
                                    const finalTotalInclusive = postDiscountBase + postDiscountTax;

                                    let promoDiscountInclusive = 0;
                                    let originalTotalInclusive = 0;

                                    const isFlat = orderHeader?.PromoType === 'FLAT' || orderHeader?.PromoType?.toLowerCase() === 'flat';

                                    if (isFlat) {
                                        // For FLAT, the user expects to see the exact coupon value
                                        promoDiscountInclusive = orderHeader?.PromoValue || 0;
                                        // Calculate the "Product Total" backwards so the math aligns perfectly
                                        originalTotalInclusive = finalTotalInclusive + promoDiscountInclusive;
                                    } else {
                                        // For Percentage, we calculate the original base and tax accurately
                                        const originalBase = postDiscountBase + preTaxDiscount;
                                        const originalTax = Math.round(originalBase * (taxRate / 100));
                                        originalTotalInclusive = originalBase + originalTax;
                                        promoDiscountInclusive = originalTotalInclusive - finalTotalInclusive;
                                    }

                                    return (
                                        <>
                                            {/* Product Total (Inclusive of Tax) */}
                                            <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2">
                                                <span className="text-sm font-medium text-gray-500">Product Total (Incl. Tax)</span>
                                                <span className="text-sm text-gray-900">{formatCurrency(originalTotalInclusive)}</span>
                                            </div>

                                            {/* Order Tax Rate */}
                                            <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2">
                                                <span className="text-sm font-medium text-gray-500">Order Tax Rate</span>
                                                <span className="text-sm text-gray-900">{taxRate} %</span>
                                            </div>

                                            {/* Order Quantity */}
                                            <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2">
                                                <span className="text-sm font-medium text-gray-500">Order Quantity</span>
                                                <span className="text-sm text-gray-900">{orderDetails?.[0]?.Quantity || 0}</span>
                                            </div>

                                            {preTaxDiscount > 0 && (
                                                <>
                                                    <hr className="border-gray-200" />
                                                    <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2">
                                                        <span className="text-sm font-medium text-gray-500">Promo Discount</span>
                                                        <span className="text-sm font-semibold text-green-600">
                                                            - {formatCurrency(promoDiscountInclusive)}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2">
                                                        <span className="text-sm font-medium text-gray-500">Promo Details</span>
                                                        <span className="text-sm text-gray-900">
                                                            {orderHeader?.PromoCode ? (
                                                                <>Code: <strong>{orderHeader.PromoCode}</strong> ({orderHeader.PromoType === 'percentage' ? `${orderHeader.PromoValue}%` : 'FLAT'} off)</>
                                                            ) : (
                                                                <span className="text-orange-500 text-xs italic">Restart Backend API to load promo details</span>
                                                            )}
                                                        </span>
                                                    </div>
                                                </>
                                            )}

                                            {/* Order Total */}
                                            <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2 mt-4 pt-4 border-t border-gray-200">
                                                <span className="text-base font-bold text-gray-900">Total Amount (Incl. Tax)</span>
                                                <span className="text-base font-bold text-gray-900">
                                                    {formatCurrency(finalTotalInclusive)}
                                                </span>
                                            </div>
                                        </>
                                    );
                                })()}

                                <hr className="border-gray-200" />

                                {/* Payment Method */}
                                <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2">
                                    <span className="text-sm font-medium text-gray-500">Payment method</span>
                                    <span className="text-sm text-gray-900">{payments[0]?.PaymentMethod ?? '-'}</span>
                                </div>

                                {/* Payment Status */}
                                <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2">
                                    <span className="text-sm font-medium text-gray-500">Payment status</span>
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                                        <span
                                            className={`text-sm font-medium ${paymentStatus === 'Refunded'
                                                ? 'text-green-600'
                                                : paymentStatus === 'Return Initiated'
                                                    ? 'text-orange-600'
                                                    : 'text-gray-900'
                                                }`}
                                        >
                                            {paymentStatus}
                                        </span>


                                        {/* <button className="px-3 py-1 text-xs text-gray-700 bg-gray-100 hover:bg-gray-200 rounded border transition-colors">
                                            Refund (Offline)
                                        </button> */}
                                        {/* <button className="px-3 py-1 text-xs text-gray-700 bg-gray-100 hover:bg-gray-200 rounded border transition-colors">
                                            Partial refund
                                        </button> */}
                                    </div>
                                </div>

                                <hr className="border-gray-200" />

                                {/* Created On */}
                                <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2">
                                    <span className="text-sm font-medium text-gray-500">Created on</span>
                                    <span className="text-sm text-gray-900">{formatDate(orderHeader?.Created)}</span>
                                </div>

                                {/* Updated On */}
                                <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2">
                                    <span className="text-sm font-medium text-gray-500">Updated on</span>
                                    <span className="text-sm text-gray-900">{formatDate(orderHeader?.Modified)}</span>
                                </div>

                                <hr className="border-gray-200" />

                                {/* Accepts Transfer of Email */}
                                <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2">
                                    <span className="text-sm font-medium text-gray-500">Accepts transfer of email</span>
                                    <span className="text-sm text-gray-900">{orderHeader?.Email ?? '-'}</span>
                                </div>
                            </div>
                        )}

                        {activeTab === 'billing' && (
                            <BillingShipping
                                orderHeader={orderHeader}
                                orderTrack={orderTrack}
                                address={formatAddress()}
                                shippingMethod="In-Store Pickup"
                                shippingStatus={orderHeader?.OrderStatus ?? '-'}
                                shipments={orderDetails.map((detail) => ({
                                    id: detail.Id ?? '-',
                                    trackingNumber: '-',
                                    totalWeight: 0,
                                    dateDelivered: formatDate(detail.Modified),
                                    createdOn: formatDate(detail.Created),
                                    dateShipped: formatDate(detail.Modified)
                                }))}
                            />
                        )}

                        {activeTab === 'products' && (
                            <Products
                                orderDetails={orderDetails}
                                productDetails={productDetails}
                                getProductDetail={getProductDetail}
                                formatCurrency={formatCurrency}
                            />
                        )}

                        {activeTab === 'notes' && (
                            // <OrderNotes statusHistory={statusHistory} formatDate={formatDate} />
                            <OrderNotes statusHistory={orderTrack} formatDate={formatDate} />
                        )}

                        {activeTab === 'attributes' && <Attributes order={order} />}
                    </div>
                </div>
            </div>
            {isReturnModalOpen && (
                <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto">
                    <div className="bg-white rounded-xl p-6 w-full max-w-[540px] mx-4 shadow-2xl my-8">
                        <h2 className="text-xl font-semibold text-center mb-6 text-gray-800">
                            Initiate Return Request
                        </h2>

                        {/* Select Item to Return */}
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Item to Return <span className="text-red-500">*</span>
                            </label>
                            {/* <select
                                value={selectedOrderDetailId || ''}
                                onChange={(e) => {
                                    const id = Number(e.target.value);
                                    setSelectedOrderDetailId(id);
                                }}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                required
                            >
                                <option value="">-- Select an item --</option>
                                {orderDetails.map((detail: any) => {
                                    const product = getProductDetail(detail.ProductId);
                                    const lineTotal = getLineItemTotal(detail);
                                    return (
                                        <option key={detail.Id} value={detail.Id}>
                                            {product.Name || 'Unknown Product'} × {detail.Quantity || 1} - ₹{lineTotal.toFixed(2)}
                                        </option>
                                    );
                                })}
                            </select> */}
                            <select
                                value={selectedOrderDetailId || ''}
                                onChange={(e) => {
                                    const orderDetailId = Number(e.target.value);
                                    setSelectedOrderDetailId(orderDetailId);

                                    const selectedDetail = orderDetails.find(
                                        (od: any) => od.Id === orderDetailId
                                    );

                                    if (selectedDetail) {
                                        setRefundAmount(selectedDetail.TotalPrice);
                                    }
                                }}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md"
                            >
                                <option value="">-- Select an item --</option>

                                {orderDetails.length === 0 && (
                                    <option disabled>No items available for return</option>
                                )}

                                {orderDetails.map((detail: any) => {
                                    const product = getProductDetail(detail.ProductId);

                                    return (
                                        <option key={detail.Id} value={detail.Id}>
                                            {product?.Name ?? 'Product'} × {detail.Quantity} – ₹{detail.TotalPrice}
                                        </option>
                                    );
                                })}
                            </select>

                        </div>

                        {/* Refund Amount (Auto-filled, editable) */}
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Refund Amount (INR) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                value={refundAmount ? refundAmount : ''}
                                readOnly
                                className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed"
                            />

                            <p className="text-xs text-gray-500 mt-1">
                                This is the total amount eligible for refund for the selected item.
                            </p>
                        </div>

                        {/* Reason */}
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Reason for Return <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={returnReason}
                                onChange={(e) => setReturnReason(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                required
                            >
                                <option value="">-- Select reason --</option>
                                <option value="Item defective - does not work as described">
                                    Item defective - does not work as described
                                </option>
                                <option value="Wrong size received">Wrong size received</option>
                                <option value="Changed mind">Changed mind</option>
                                <option value="Arrived damaged">Arrived damaged</option>
                                <option value="Wrong item shipped">Wrong item shipped</option>
                                <option value="Not as described">Not as described</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {/* Additional Note */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Additional Note (optional)
                            </label>
                            <textarea
                                value={returnNote}
                                onChange={(e) => setReturnNote(e.target.value)}
                                placeholder="Any extra details for operations team..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-md resize-none h-24 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setIsReturnModalOpen(false);
                                    setSelectedOrderDetailId(null);
                                    setReturnReason('');
                                    setReturnNote('');
                                }}
                                className="px-6 py-2.5 text-sm font-medium bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleCreateReturnRequest}
                                disabled={!selectedOrderDetailId || !returnReason.trim()}
                                className="px-6 py-2.5 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                            >
                                Submit Return Request
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isReplacementModalOpen && (
                <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto">
                    <div className="bg-white rounded-xl p-6 w-full max-w-[540px] mx-4 shadow-2xl my-8">
                        <h2 className="text-xl font-semibold text-center mb-6 text-gray-800">
                            Initiate Replacement Request
                        </h2>

                        {/* Select Item to Replace */}
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Item to Replace <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={selectedOrderDetailId || ''}
                                onChange={(e) => setSelectedOrderDetailId(Number(e.target.value))}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md"
                            >
                                <option value="">-- Select an item --</option>
                                {orderDetails.length === 0 && (
                                    <option disabled>No items available for replacement</option>
                                )}
                                {orderDetails.map((detail: any) => {
                                    const product = getProductDetail(detail.ProductId);
                                    return (
                                        <option key={detail.Id} value={detail.Id}>
                                            {product?.Name ?? 'Product'} × {detail.Quantity}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>

                        {/* Reason */}
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Reason for Replacement <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={returnReason}
                                onChange={(e) => setReturnReason(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                <option value="">-- Select reason --</option>
                                <option value="Item defective - does not work as described">Item defective - does not work as described</option>
                                <option value="Wrong size received">Wrong size received</option>
                                <option value="Arrived damaged">Arrived damaged</option>
                                <option value="Wrong item shipped">Wrong item shipped</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {/* Additional Note */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Additional Note (optional)
                            </label>
                            <textarea
                                value={returnNote}
                                onChange={(e) => setReturnNote(e.target.value)}
                                placeholder="Any extra details for operations team..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-md resize-none h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setIsReplacementModalOpen(false);
                                    setSelectedOrderDetailId(null);
                                    setReturnReason('');
                                    setReturnNote('');
                                }}
                                className="px-6 py-2.5 text-sm font-medium bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleCreateReplacementRequest}
                                disabled={!selectedOrderDetailId || !returnReason.trim()}
                                className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                            >
                                Submit Replacement Request
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Rider Assignment Modal */}
            <AssignRiderModal open={open} setOpen={setOpen} riders={riders} onAssign={handleAssign} />
        </div>
    );
};

export default OrderDetails;