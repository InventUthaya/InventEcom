'use client';
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { 
    ChevronLeft, Package, FileText, CreditCard, Truck, StickyNote, Hash, 
    MoreHorizontal, Trash2, Check, Info, X
} from 'lucide-react';

const orders = [
    {
        orderNumber: '1558202509093717',
        orderRef: '6ad80908-dde1-46f7-a524-9fa215d641a1',
        customer: 'Aganjan',
        shipment: 'via In-Store Pickup',
        orderDate: '9/15/2025 11:39 AM',
        orderStatus: 'Processing',
        orderTotal: 14000.00,
        paymentMethod: 'Prepayment (Payments:Prepayment)',
        paymentStatus: 'Paid',
        createdOn: '9/15/2025 11:39 AM',
        updatedOn: '9/15/2025 11:47 AM',
        acceptsTransfer: 'No',
        customerIp: '0.0.0.1',
        orderTax: 0.00,
        orderShipping: 0.00,
        orderSubtotal: 14000.00,
        email: 'aganjan@example.com',
        billingAddress: {
            name: 'Al Furjan Aganjan',
            address: '1 Sheikh Mohammed bin Rashid Blvd - Downtown Dubai - Dubai -',
            country: 'United Arab Emirates',
            city: 'Buy Khalifa',
            email: 'Email',
            phone: '0610916290'
        },
        shippingAddress: {
            name: 'Al Furjan Aganjan',
            address: '1 Sheikh Mohammed bin Rashid Blvd - Downtown Dubai - Dubai -',
            country: 'United Arab Emirates', 
            city: 'Buy Khalifa',
            email: 'Email',
            phone: '0610916290'
        },
        shippingMethod: 'In-Store Pickup',
        shippingStatus: 'Not yet shipped',
        products: [
            {
                id: 1,
                name: 'Copy of iPhone 15',
                description: 'Look like new,4GB,Blue',
                sku: '234',
                price: 14000.00,
                quantity: 1,
                discount: 0.00,
                total: 14000.00
            }
        ],
        orderNotes: [
            {
                id: 1,
                createdOn: '9/15/2025 5:17:40 PM',
                note: 'Order status has been changed to Processing',
                displayToCustomer: false
            },
            {
                id: 2,
                createdOn: '9/15/2025 5:17:40 PM', 
                note: 'Order has been marked as paid',
                displayToCustomer: false
            }
        ],
        attributes: []
    },
];

// General Tab Component
const GeneralSection = ({ order }) => {
    const [showRefundConfirm, setShowRefundConfirm] = useState(false);
    const [showPartialRefund, setShowPartialRefund] = useState(false);
    const [refundAmount, setRefundAmount] = useState('0.00');

    const handleRefundOffline = () => {
        setShowRefundConfirm(true);
    };

    const handlePartialRefund = () => {
        setShowPartialRefund(true);
    };

    const confirmRefund = () => {
        console.log('Full refund confirmed');
        setShowRefundConfirm(false);
        // Add refund logic here
    };

    const processPartialRefund = () => {
        console.log('Partial refund amount:', refundAmount);
        setShowPartialRefund(false);
        // Add partial refund logic here
    };

    const closePopups = () => {
        setShowRefundConfirm(false);
        setShowPartialRefund(false);
        setRefundAmount('0.00');
    };

    return (
        <>
            <div className="p-2 md:p-5">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 lg:gap-x-12 gap-y-4 lg:gap-y-6 text-sm">
                    <div>
                        <div className="text-gray-500 mb-1">Order Number</div>
                        <div className="font-medium text-gray-900 break-all">{order.orderNumber}</div>
                    </div>
                    <div>
                        <div className="text-gray-500 mb-1">Order reference number</div>
                        <div className="text-gray-900 break-all">{order.orderRef}</div>
                    </div>
                    <div>
                        <div className="text-gray-500 mb-1">Customer</div>
                        <div className="text-blue-600 hover:text-blue-800 cursor-pointer">{order.customer}</div>
                    </div>
                    <div>
                        <div className="text-gray-500 mb-1">Customer IP address</div>
                        <div className="text-gray-900">{order.customerIp}</div>
                    </div>
                    <div>
                        <div className="text-gray-500 mb-1">Order subtotal (excl tax)</div>
                        <div className="text-gray-900">INR {order.orderSubtotal.toFixed(2)} *</div>
                    </div>
                    <div>
                        <div className="text-gray-500 mb-1">Order shipping (excl tax)</div>
                        <div className="text-gray-900">INR {order.orderShipping.toFixed(2)}</div>
                    </div>
                    <div>
                        <div className="text-gray-500 mb-1">Order tax</div>
                        <div className="text-gray-900">INR {order.orderTax.toFixed(2)}</div>
                    </div>
                    <div>
                        <div className="text-gray-500 mb-1">Order total</div>
                        <div className="font-semibold text-gray-900">INR {order.orderTotal.toFixed(2)}</div>
                    </div>
                    <div className="lg:col-span-2">
                        <div className="text-gray-500 mb-1">Payment method</div>
                        <div className="text-gray-900 break-all">{order.paymentMethod}</div>
                    </div>
                    <div className="lg:col-span-2">
                        <div className="text-gray-500 mb-1">Payment status</div>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                            <button 
                                onClick={handleRefundOffline}
                                className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200 whitespace-nowrap transition-colors"
                            >
                                Refund (Offline)
                            </button>
                            <button 
                                onClick={handlePartialRefund}
                                className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200 whitespace-nowrap transition-colors"
                            >
                                Partial refund (Offline)
                            </button>
                        </div>
                    </div>
                    <div>
                        <div className="text-gray-500 mb-1">Created on</div>
                        <div className="text-gray-900">{order.createdOn}</div>
                    </div>
                    <div>
                        <div className="text-gray-500 mb-1">Updated on</div>
                        <div className="text-gray-900">{order.updatedOn}</div>
                    </div>
                    <div className="lg:col-span-2">
                        <div className="text-gray-500 mb-1">Accepts transfer of email</div>
                        <div className="text-gray-900">{order.acceptsTransfer}</div>
                    </div>
                </div>
            </div>

            {/* Full Refund Confirmation Popup */}
            {showRefundConfirm && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl border max-w-md w-full p-6">
                        <div className="text-center">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Confirm Refund
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Would you like to proceed with the full refund?
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-center">
                                <button
                                    onClick={confirmRefund}
                                    className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                                >
                                    <Check className="h-4 w-4 mr-2" />
                                    Confirm
                                </button>
                                <button
                                    onClick={closePopups}
                                    className="px-6 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Partial Refund Popup */}
            {showPartialRefund && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl border max-w-lg w-full p-6">
                        {/* Close button */}
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-gray-900">
                                Partial refund for order #{order.orderNumber.slice(-3)}
                            </h3>
                            <button
                                onClick={closePopups}
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="h-5 w-5 text-gray-400" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Amount input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Amount to refund
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={refundAmount}
                                        onChange={(e) => setRefundAmount(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-16"
                                        placeholder="0.00"
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center">
                                        <select className="h-full py-0 pl-2 pr-8 border-0 bg-transparent text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-r-md">
                                            <option>INR</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Max amount info */}
                            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 flex items-start">
                                <Info className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                                <div className="text-sm text-blue-800">
                                    Max amount is INR {order.orderTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
                                <button
                                    onClick={processPartialRefund}
                                    className="px-6 py-2 bg-orange-500 text-white text-sm font-medium rounded-md hover:bg-orange-600 transition-colors flex items-center justify-center"
                                >
                                    <Check className="h-4 w-4 mr-2" />
                                    Refund
                                </button>
                                <button
                                    onClick={closePopups}
                                    className="px-6 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

// Billing & Shipping Component
const BillingSection = ({ order }) => (
    <div className="p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-6 lg:mb-8">
            {/* Billing Address */}
            <div>
                <div className="mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Billing Address</h3>
                </div>
                <div className="space-y-2 text-sm">
                    <div className="font-medium">{order.billingAddress.name}</div>
                    <div className="break-words">{order.billingAddress.address}</div>
                    <div>{order.billingAddress.country}</div>
                    <div>{order.billingAddress.city}</div>
                    <div className="break-all">{order.billingAddress.email}</div>
                    <div>Phone: {order.billingAddress.phone}</div>
                </div>
            </div>

            {/* Shipping Address */}
            <div>
                <div className="mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Shipping Address</h3>
                </div>
                <div className="space-y-2 text-sm">
                    <div className="font-medium">{order.shippingAddress.name}</div>
                    <div className="break-words">{order.shippingAddress.address}</div>
                    <div>{order.shippingAddress.country}</div>
                    <div>{order.shippingAddress.city}</div>
                    <div className="break-all">{order.shippingAddress.email}</div>
                    <div>Phone: {order.shippingAddress.phone}</div>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-6 lg:mb-8">
            <div>
                <div className="text-gray-500 mb-1 text-sm">Shipping method</div>
                <div className="text-gray-900">{order.shippingMethod}</div>
            </div>
            <div>
                <div className="text-gray-500 mb-1 text-sm">Shipping status</div>
                <div className="text-gray-900">{order.shippingStatus}</div>
            </div>
        </div>

        {/* Shipments Section */}
        <div>
            <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900">Shipments</h3>
            </div>
            
            <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                    Tracking number
                                </th>
                                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                    Total weight
                                </th>
                                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                    Date shipped
                                </th>
                                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                    Date delivered
                                </th>
                                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                    Created on
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            <tr>
                                <td colSpan={5} className="px-3 md:px-6 py-8 text-center text-gray-500">
                                    No data
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
);

// Products Component
const ProductsSection = ({ order }) => (
    <div className="p-4 md:p-8">
        <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Product name
                            </th>
                            <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                Price
                            </th>
                            <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                Quantity
                            </th>
                            <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                Discount
                            </th>
                            <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                Total
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {order.products.map((product) => (
                            <tr key={product.id}>
                                <td className="px-3 md:px-6 py-4">
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">
                                            {product.name}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {product.description}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            SKU: {product.sku}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    INR {product.price.toFixed(2)} *
                                </td>
                                <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {product.quantity}
                                </td>
                                <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    INR {product.discount.toFixed(2)} *
                                </td>
                                <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    INR {product.total.toFixed(2)} *
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

// Order Notes Component
const OrderNotesSection = ({ order }) => (
    <div className="p-4 md:p-8">
        <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                Created on
                            </th>
                            <th className="w-2/5 md:w-1/2 px-2 md:px-4 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Note
                            </th>
                            <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                Display to customer
                            </th>
                            <th className="w-8 px-2 md:px-4 py-2 md:py-3"></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {order.orderNotes.map((note) => (
                            <tr key={note.id}>
                                <td className="px-2 md:px-4 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-900">
                                    {note.createdOn}
                                </td>
                                <td className="px-2 md:px-4 py-3 md:py-4 text-xs md:text-sm text-gray-900">
                                    <div className="break-words pr-2">
                                        {note.note}
                                    </div>
                                </td>
                                <td className="px-2 md:px-4 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-900">
                                    {note.displayToCustomer ? 'Yes' : ''}
                                </td>
                                <td className="px-2 md:px-4 py-3 md:py-4 whitespace-nowrap text-right text-xs md:text-sm font-medium">
                                    <button className="text-gray-400 hover:text-gray-600">
                                        <MoreHorizontal className="h-3 w-3 md:h-4 md:w-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

// Attributes Component
const AttributesSection = ({ order }) => (
    <div className="p-4 md:p-8">
        <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name *
                            </th>
                            <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Value
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        <tr>
                            <td colSpan={2} className="px-3 md:px-6 py-8 text-center text-gray-500">
                                No data
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

// Main Component
const RefundOrderDetails = () => {
    const { orderNumber } = useParams();
    const navigate = useNavigate();
    const order = orders.find(o => o.orderNumber === orderNumber);
    const [activeTab, setActiveTab] = useState('general');

    const sidebarItems = [
        { id: 'general', label: 'General', icon: Package },
        { id: 'billing', label: 'Billing & Shipping', icon: CreditCard },
        { id: 'products', label: 'Products', icon: FileText },
        { id: 'notes', label: 'Order Notes', icon: StickyNote },
        { id: 'attributes', label: 'Attributes', icon: Hash },
    ];

    if (!order) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="bg-white rounded-lg shadow-lg p-6 md:p-10 text-center max-w-md w-full">
                    <h2 className="text-xl md:text-2xl font-bold text-red-600 mb-4">Order Not Found</h2>
                    <p className="text-gray-600">No order matched the provided number: {orderNumber}</p>
                </div>
            </div>
        );
    }

    const handleBackClick = () => {
        navigate(-1);
    };

    const renderActiveSection = () => {
        switch(activeTab) {
            case 'general':
                return <GeneralSection order={order} />;
            case 'billing':
                return <BillingSection order={order} />;
            case 'products':
                return <ProductsSection order={order} />;
            case 'notes':
                return <OrderNotesSection order={order} />;
            case 'attributes':
                return <AttributesSection order={order} />;
            default:
                return <GeneralSection order={order} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="w-full px-4 md:px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 md:space-x-4 min-w-0 flex-1">
                            <button
                                onClick={handleBackClick}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                            >
                                <ChevronLeft className="h-4 w-4 md:h-5 md:w-5 text-gray-600" />
                            </button>

                            <div className="min-w-0 flex-1">
                                <h1 className="text-base md:text-xl font-semibold text-gray-900 truncate">
                                    Refund order details - {orderNumber}
                                </h1>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 md:space-x-3 flex-shrink-0">
                            <button className="px-2 md:px-4 py-2 text-xs md:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center">
                                <Package className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                                <span className="hidden sm:inline">Print</span>
                            </button>
                            <button className="px-2 md:px-4 py-2 text-xs md:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center">
                                <FileText className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                                <span className="hidden sm:inline">PDF</span>
                            </button>
                            <button className="px-2 md:px-4 py-2 text-xs md:text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 flex items-center">
                                <Trash2 className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                                <span className="hidden sm:inline">Delete</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full py-2 md:py-4">
                <div className="flex">
                    {/* Desktop Sidebar */}
                    <div className="hidden md:block w-64 bg-white rounded-l-lg shadow border border-r-gray-200 flex-shrink-0">
                        <div className="p-4">
                            <nav className="space-y-1">
                                {sidebarItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => setActiveTab(item.id)}
                                            className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                                activeTab === item.id
                                                    ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-500'
                                                    : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                        >
                                            <Icon className="h-4 w-4 mr-3" />
                                            {item.label}
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 bg-white rounded-lg md:rounded-l-none shadow border border-l-0 md:border-l-gray-200 min-w-0">
                        {/* Mobile Tab Navigation */}
                        <div className="md:hidden border-b border-gray-200 bg-white rounded-t-lg">
                            <div className="overflow-x-auto">
                                <nav className="flex space-x-0 px-4 py-2">
                                    {sidebarItems.map((item) => {
                                        const Icon = item.icon;
                                        return (
                                            <button
                                                key={item.id}
                                                onClick={() => setActiveTab(item.id)}
                                                className={`flex items-center px-3 py-2 text-xs font-medium whitespace-nowrap rounded-md transition-colors ${
                                                    activeTab === item.id
                                                        ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500'
                                                        : 'text-gray-700 hover:bg-gray-50'
                                                }`}
                                            >
                                                <Icon className="h-4 w-4 mr-2" />
                                                {item.label}
                                            </button>
                                        );
                                    })}
                                </nav>
                            </div>
                        </div>

                        {/* Content Section */}
                        {renderActiveSection()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RefundOrderDetails;
