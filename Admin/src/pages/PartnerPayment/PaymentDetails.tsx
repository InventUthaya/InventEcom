import { useEffect, useState } from 'react';
import { CheckCircle, IndianRupee, Package, Search, Wallet } from 'lucide-react';
import CommonService from '../../services/CommonService';
import { useParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripePaymentForm from './StripePaymentForm';
import { jwtDecode } from 'jwt-decode';
interface CustomJwtPayload {
    PartnerId?: number | string;
    LoginId?: number | string;
}

const stripePromise = loadStripe("pk_test_51RoPJL6Om6nYvdQ2Sw3HgRA1EyrP64qVR08Rrk9eip665lCsDGRXuu3rWAoDPRLadE33lP01HvkGZVrxWJNE22t000il3bemTJ");

interface PaymentDashboardData {
    PartnerName: string;
    Amount: any;
    CommissionAmount: any;
    CommissionPercentage: any;
    OrderNumber: any;
    Id: number;
    BasePrice: any;
    PartnerAmount: any;
    PartnerId: any;
    TaxPercentage: any;
    ProductTaxTotal: any;
    ProductTotal: any;
    TotalPaidAmount: any;
    TotalPayableAmount: any;
    TotalCommissionAmount: any;
    TotalpaidpendingAmount: any;
    PaymentDoneStatus: any;
    paymentDone: any
}

interface StatsData {
    GrandTotal: any;
    TotalCommissionAmount: any;
    TotalPaidAmount: any;
    TotalPayableAmount: any;
}

export default function PaymentDetails() {
    const [search, setSearch] = useState('');
    const [partnerData, setPartnerData] = useState<PaymentDashboardData[]>([]);
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<PaymentDashboardData | null>(null);
    const [updatingPayment, setUpdatingPayment] = useState(false);
    const [statesData, setStatesData] = useState<StatsData[]>([]);


    const { id } = useParams<{ id?: string }>();

    useEffect(() => {
        fetchPartnerPaymentData();
    }, [search, id]);

    const fetchPartnerPaymentData = async () => {
        const token = localStorage.getItem("Token");
        if (!token) {
            throw new Error("Token not found");
        }
        const decoded = jwtDecode(token) as CustomJwtPayload;

        const partnerId = Number(decoded.PartnerId);

        const data = {
            Search: search,
            PartnerId: partnerId,
            OffsetStart: 0,
            RowsPerPage: 100,
            SortColumn: 'Modified'
        };

        try {
            const res = await CommonService.post('partnerpayment', 'GetPartnerbyId', data);

            if (res.status === 200) {
                const responseData = Array.isArray(res.data) ? res.data : [];
                setPartnerData(responseData);
            }
        } catch (err) {
            console.error("Failed to fetch partner orders:", err);
        }
    };

    useEffect(() => {
        fetchStatesCount();
    }, []);

    const fetchStatesCount = async () => {
        const token = localStorage.getItem("Token");

        if (!token) {
            throw new Error("Token not found");
        }
        const decoded = jwtDecode(token) as CustomJwtPayload;

        const partnerId = Number(decoded.PartnerId);
        const data = {
            PartnerId: partnerId
        };

        const res = await CommonService.post('partnerpayment', 'paymentStates', data);

        if (res.status === 200) {
            const responseData = Array.isArray(res.data) ? res.data : [];
            setStatesData(responseData);
        }
    };

    const handlePayment = async (e: React.MouseEvent, order: PaymentDashboardData) => {
        e.stopPropagation();
        const commissionAmount = parseFloat(order.PartnerAmount);
        if (!commissionAmount || commissionAmount <= 0) {
            alert("No commission amount to pay for this order.");
            return;
        }

        setSelectedOrder(order);
        // setUpdatingPayment(true);

        try {
            // const res = await CommonService.post('partnerpayment', 'create-payment-intent', {
            //     Amount: Math.round(commissionAmount * 100),
            //     Currency: "INR",
            //     PartnerId: order.PartnerId || parseInt(id!),
            //     PartnerName: order.PartnerName,
            //     OrderId: order.Id,
            //     OrderNumber: order.OrderNumber
            // });

            // if (res.status === 200 && res.data?.clientSecret) {
            //     setClientSecret(res.data.clientSecret);


            // } else {
            // }
            onPaymentSuccess();
        } catch (err: any) {
            console.error(err);
        } finally {
            setUpdatingPayment(false);
        }
    };

    const onPaymentSuccess = async () => {
        if (!selectedOrder) return;
        const ress = await CommonService.post('partnerpayment', 'updatepaymentstatus', {
            PartnerId: selectedOrder.PartnerId,
            PartnerpaymentId: selectedOrder.Id
        });
        fetchPartnerPaymentData();
        fetchStatesCount();
        setClientSecret(null);
        setSelectedOrder(null);

    };

    const onCloseModal = () => {
        setClientSecret(null);
        setSelectedOrder(null);
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
                Partner Payment Details
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
                        {/* Search */}
                        <div className="flex justify-end p-4 border-b">
                            <div className="relative w-64">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search orders..."
                                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs text-gray-500">Partner</th>
                                        <th className="px-6 py-3 text-left text-xs text-gray-500">Tax %</th>
                                        <th className="px-6 py-3 text-left text-xs text-gray-500">Tax Amount</th>
                                        <th className="px-6 py-3 text-left text-xs text-gray-500">Product Amount</th>
                                        <th className="px-6 py-3 text-left text-xs text-gray-500">Commission Amount</th>
                                        <th className="px-6 py-3 text-left text-xs text-gray-500 whitespace-nowrap">Commission %</th>
                                        <th className="px-6 py-3 text-left text-xs text-gray-500">Order Number</th>
                                        <th className="px-6 py-3 text-left text-xs text-gray-500">Partner Amount</th>
                                        <th className="px-6 py-3 text-left text-xs text-gray-500">Payment Status</th>
                                        <th className="px-6 py-3 text-left text-xs text-gray-500">Actions</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y">
                                    {partnerData.length > 0 ? (
                                        partnerData.map((data) => (
                                            <tr key={data.Id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 text-sm font-medium">{data.PartnerName}</td>
                                                <td className="px-6 py-4 text-sm">{data.TaxPercentage}%</td>
                                                <td className="px-6 py-4 text-sm">₹{data.ProductTaxTotal}</td>
                                                <td className="px-6 py-4 text-sm">₹{data.ProductTotal}</td>
                                                <td className="px-6 py-4 text-sm font-medium text-green-600">₹{data.CommissionAmount}</td>
                                                <td className="px-6 py-4 text-sm">{data.CommissionPercentage}%</td>
                                                <td className="px-6 py-4 text-sm">#{data.OrderNumber}</td>
                                                <td className="px-6 py-4 text-sm">₹{data.PartnerAmount}</td>
                                                <td className="px-6 py-4 text-sm">
                                                    {(() => {
                                                        const status = getPaymentStatusText(data.paymentDone);
                                                        return (
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.textColor} ${status.bgColor}`}>
                                                                {status.text}
                                                            </span>
                                                        );
                                                    })()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {data.paymentDone == 8 && (
                                                        <div className="flex items-center gap-3">
                                                            <button
                                                                onClick={(e) => handlePayment(e, data)}
                                                                disabled={updatingPayment}
                                                                className="p-2 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
                                                                title="Pay Commission"
                                                            >
                                                                {updatingPayment && selectedOrder?.Id === data.Id ? (
                                                                    <div className="h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                                                ) : (
                                                                    <img
                                                                        width="24"
                                                                        height="24"
                                                                        src="https://img.icons8.com/fluency-systems-regular/48/bank-card-back-side.png"
                                                                        alt="Pay with card"
                                                                    />
                                                                )}
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>

                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={8} className="text-center py-10 text-gray-500">
                                                No orders found for this partner.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {clientSecret && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
                        <Elements stripe={stripePromise} options={{ clientSecret }}>
                            <StripePaymentForm
                                amount={parseFloat(selectedOrder.PartnerAmount)}
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