import { useEffect, useState } from 'react';
import { CheckCircle, IndianRupee, Package, ScanEye, Search, Wallet } from 'lucide-react';
import CommonService from '../../services/CommonService';
import { useNavigate } from "react-router-dom";
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripePaymentForm from './StripePaymentForm';
import Pagination from '../CustomComponent/Pagination'; // Import Pagination component

const stripePromise = loadStripe("pk_test_51RoPJL6Om6nYvdQ2Sw3HgRA1EyrP64qVR08Rrk9eip665lCsDGRXuu3rWAoDPRLadE33lP01HvkGZVrxWJNE22t000il3bemTJ");

interface PaymentDashboardData {
    PartnerName: string;
    TotalOrders: any;
    TotalAmount: any;
    TotalCommission: any;
    AvgCommissionPercentage: any;
    CompletedOrders: any;
    PendingOrders: any;
    PartnerId: any;
    TaxPercentage: any;
    ProductTaxTotal: any;
    ProductTotal: any;
    PartnerAmount: any;
    TotalPaidAmount: any;
    TotalPayableAmount: any;
    TotalCommissionAmount: any;
    TotalpaidpendingAmount: any;
    PaymentDoneStatus: any;
}

interface StatsData {
    GrandTotal: any;
    TotalCommissionAmount: any;
    TotalPaidAmount: any;
    TotalPayableAmount: any;
}

export default function PaymentDashboard() {
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [partnerData, setPartnerData] = useState<PaymentDashboardData[]>([]);
    const [statesData, setStatesData] = useState<StatsData[]>([]);
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [selectedPartner, setSelectedPartner] = useState<PaymentDashboardData | null>(null);
    const [updatingPayment, setUpdatingPayment] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const fetchPartnerPaymentData = async () => {
        setIsLoading(true);
        const data = {
            Search: search,
            OffsetStart: (currentPage - 1) * pageSize, // Calculate offset
            RowsPerPage: pageSize,
            SortColumn: 'Modified'
        };

        try {
            const res = await CommonService.post('partnerpayment', 'GetPartnersData', data);

            if (res.status === 200) {
                const responseData = Array.isArray(res.data) ? res.data : [];
                setPartnerData(responseData);
                
                // Calculate total records and hasMore based on response
                // Since SP doesn't return total count, we'll estimate based on current page
                if (responseData.length > 0) {
                    // Get total count from first item if available
                    const firstItem = responseData[0];
                    if (firstItem.TotalPayableAmount || firstItem.TotalCommissionAmount) {
                        // If we have aggregated totals, we can estimate
                        // This is a workaround since SP doesn't return total count
                        setTotalRecords(responseData.length === pageSize ? 
                            (currentPage * pageSize) + 1 : 
                            (currentPage - 1) * pageSize + responseData.length);
                    } else {
                        // Fallback: estimate based on current page and data length
                        setTotalRecords(responseData.length === pageSize ? 
                            (currentPage * pageSize) + 1 : 
                            (currentPage - 1) * pageSize + responseData.length);
                    }
                } else {
                    setTotalRecords(0);
                }
                
                // Set hasMore based on whether we got a full page
                setHasMore(responseData.length === pageSize);
            }
        } catch (error) {
            console.error('Error fetching partner data:', error);
            setPartnerData([]);
            setTotalRecords(0);
            setHasMore(false);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPartnerPaymentData();
    }, [search, currentPage]);

    useEffect(() => {
        fetchStatesCount();
    }, []);

    const fetchStatesCount = async () => {
        const data = {
            PartnerId: null
        };

        const res = await CommonService.post('partnerpayment', 'paymentStates', data);

        if (res.status === 200) {
            const responseData = Array.isArray(res.data) ? res.data : [];
            setStatesData(responseData);
        }
    };

    const handlePayment = async (e: React.MouseEvent, partner: PaymentDashboardData) => {
        e.stopPropagation();
        const partnerAmount = parseFloat(partner.PartnerAmount);
        if (!partnerAmount || partnerAmount <= 0) {
            return;
        }

        setSelectedPartner(partner);

        try {
            const ress = await CommonService.post('partnerpayment', 'updategrouppaymentstatus', {
                PartnerId: selectedPartner.PartnerId,
            });
            fetchStatesCount();
            fetchPartnerPaymentData();
        } catch (err: any) {
            console.error("Payment error:", err);
        } finally {
            setUpdatingPayment(false);
        }
    };

    const onPaymentSuccess = () => {
        setClientSecret(null);
        setSelectedPartner(null);
        fetchPartnerPaymentData();
    };

    const onCloseModal = async () => {
        setClientSecret(null);
        setSelectedPartner(null);
    };

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setCurrentPage(1); // Reset to first page on search
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const STAT_STYLES: Record<string, { bg: string; iconBg: string; text: string }> = {
        'Total': { bg: 'bg-blue-50', iconBg: 'bg-blue-100', text: 'text-blue-700' },
        'commision': { bg: 'bg-sky-50', iconBg: 'bg-sky-100', text: 'text-sky-700' },
        'payable': { bg: 'bg-amber-50', iconBg: 'bg-amber-100', text: 'text-amber-700' },
        'paid': { bg: 'bg-green-50', iconBg: 'bg-green-100', text: 'text-green-700' },
    };

    const totalOrders = statesData.reduce((s, p) => s + Number(p.GrandTotal || 0), 0);
    const totalCommission = statesData.reduce((s, p) => s + Number(p.TotalCommissionAmount || 0), 0);
    const totalPayable = statesData.reduce((s, p) => s + Number(p.TotalPayableAmount || 0), 0);
    const totalPaid = statesData.reduce((s, p) => s + Number(p.TotalPaidAmount || 0), 0);

    const getPaymentStatusText = (statusId: any) => {
        switch (Number(statusId)) {
            case 8:
                return { text: "Pending", textColor: "text-yellow-700", bgColor: "bg-yellow-100" };
            case 9:
                return { text: "Completed", textColor: "text-green-700", bgColor: "bg-green-100" };
            default:
                return { text: "-", textColor: "text-gray-500", bgColor: "bg-gray-100" };
        }
    };

    return (
        <> 
            <h1 className="text-xl font-semibold text-gray-900 mb-6">
                Payment Dashboard
            </h1>
            <div className="mt-4 max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Total */}
                    <div className={`flex items-center justify-between p-3 rounded-lg border ${STAT_STYLES.Total.bg}`}>
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-md ${STAT_STYLES.Total.iconBg}`}>
                                <Package className="w-4 h-4 text-blue-700" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-700">Total</p>
                                <p className={`text-sm font-bold ${STAT_STYLES.Total.text}`}>
                                    {totalOrders}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* commision */}
                    <div className={`flex items-center justify-between p-3 rounded-lg border ${STAT_STYLES.commision.bg}`}>
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-md ${STAT_STYLES.commision.iconBg}`}>
                                <IndianRupee className="w-4 h-4 text-sky-700" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-700">commision</p>
                                <p className={`text-sm font-bold ${STAT_STYLES.commision.text}`}>
                                    ₹{totalCommission}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* payable */}
                    <div className={`flex items-center justify-between p-3 rounded-lg border ${STAT_STYLES.payable.bg}`}>
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-md ${STAT_STYLES.payable.iconBg}`}>
                                <Wallet className="w-4 h-4 text-amber-700" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-700">payable</p>
                                <p className={`text-sm font-bold ${STAT_STYLES.payable.text}`}>
                                    ₹{totalPayable}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* paid */}
                    <div className={`flex items-center justify-between p-3 rounded-lg border ${STAT_STYLES.paid.bg}`}>
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-md ${STAT_STYLES.paid.iconBg}`}>
                                <CheckCircle className="w-4 h-4 text-green-700" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-700">paid</p>
                                <p className={`text-sm font-bold ${STAT_STYLES.paid.text}`}>
                                    {totalPaid}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto p-4">
                    <div className="bg-white rounded-lg shadow-sm">
                        <div className="flex justify-end p-4 border-b">
                            <div className="relative w-64">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    placeholder="Search..."
                                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs text-gray-500">Partner</th>
                                        <th className="px-6 py-3 text-left text-xs text-gray-500">Total Products</th>
                                        <th className="px-6 py-3 text-left text-xs text-gray-500">Total Amount</th>
                                        <th className="px-6 py-3 text-left text-xs text-gray-500">Tax %</th>
                                        <th className="px-6 py-3 text-left text-xs text-gray-500">Tax Amount</th>
                                        <th className="px-6 py-3 text-left text-xs text-gray-500">Product Total</th>
                                        <th className="px-6 py-3 text-left text-xs text-gray-500">Commission %</th>
                                        <th className="px-6 py-3 text-left text-xs text-gray-500">Commission Amount</th>
                                        <th className="px-6 py-3 text-left text-xs text-gray-500">Completed Order</th>
                                        <th className="px-6 py-3 text-left text-xs text-gray-500">Pending Order</th>
                                        <th className="px-6 py-3 text-left text-xs text-gray-500">Payable Amount</th>
                                        <th className="px-6 py-3 text-left text-xs text-gray-500">Payment Status</th>
                                        <th className="px-6 py-3 text-left text-xs text-gray-500">Actions</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y">
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={13} className="text-center py-6">
                                                <div className="flex justify-center">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : partnerData.length > 0 ? (
                                        partnerData.map((data) => (
                                            <tr
                                                key={data.PartnerId}
                                                onClick={() => navigate(`/payment/${data.PartnerId}`)}
                                                className="hover:bg-gray-50 cursor-pointer"
                                            >
                                                <td className="px-6 py-4 text-sm">{data.PartnerName}</td>
                                                <td className="px-6 py-4 text-sm">{data.TotalOrders}</td>
                                                <td className="px-6 py-4 text-sm">₹{data.TotalAmount}</td>
                                                <td className="px-6 py-4 text-sm">{data.TaxPercentage}%</td>
                                                <td className="px-6 py-4 text-sm">₹{data.ProductTaxTotal}</td>
                                                <td className="px-6 py-4 text-sm">₹{data.ProductTotal}</td>
                                                <td className="px-6 py-4 text-sm">{data.AvgCommissionPercentage}%</td>
                                                <td className="px-6 py-4 text-sm">₹{data.TotalCommission}</td>
                                                <td className="px-6 py-4 text-sm font-medium">
                                                    {data.CompletedOrders}
                                                </td>
                                                <td className="px-6 py-4 text-sm">{data.PendingOrders}</td>
                                                <td className="px-6 py-4 text-sm">₹{data.PartnerAmount}</td>

                                                <td className="px-6 py-4 text-sm">
                                                    {(() => {
                                                        const status = getPaymentStatusText(data.PaymentDoneStatus);
                                                        return (
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.textColor} ${status.bgColor}`}>
                                                                {status.text}
                                                            </span>
                                                        );
                                                    })()}
                                                </td>

                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        {/* View Button */}
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                navigate(`/payment/${data.PartnerId}`);
                                                            }}
                                                            className="p-1 hover:bg-gray-100 rounded"
                                                            title="View Details"
                                                        >
                                                            <ScanEye className="h-5 w-5 text-blue-600" />
                                                        </button>

                                                        {/* Payment Button - Fixed Icon */}
                                                        {data.PaymentDoneStatus === 8 && (
                                                            <button
                                                                onClick={(e) => handlePayment(e, data)}
                                                                disabled={updatingPayment}
                                                                className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                                                                title="Pay Commission"
                                                            >
                                                            {updatingPayment && selectedPartner?.PartnerId === data.PartnerId ? (
                                                                <div className="h-5 w-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                                            ) : (
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    className="h-6 w-6 text-green-600"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    stroke="currentColor"
                                                                    strokeWidth={1.5}
                                                                >
                                                                    <rect x="2" y="4" width="20" height="16" rx="3" ry="3" />
                                                                    <line x1="2" y1="10" x2="22" y2="10" />
                                                                    <path d="M6 14h.01M10 14h.01M14 14h.01" />
                                                                </svg>
                                                            )}
                                                        </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={13} className="text-center py-6 text-sm text-gray-500">
                                                No records found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Add Pagination Component */}
                        {partnerData.length > 0 && (
                            <Pagination
                                currentPage={currentPage}
                                onPageChange={handlePageChange}
                                hasMore={hasMore}
                                totalRecords={totalRecords}
                                pageSize={pageSize}
                                isLoading={isLoading}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Stripe Payment Modal */}
            {clientSecret && selectedPartner && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative">
                        <Elements stripe={stripePromise} options={{ clientSecret }}>
                            <StripePaymentForm
                                amount={parseFloat(selectedPartner.PartnerAmount)}
                                clientSecret={clientSecret}
                                onSuccess={onPaymentSuccess}
                                onClose={onCloseModal}
                            />
                        </Elements>
                    </div>
                </div>
            )}
        </>
    );
}