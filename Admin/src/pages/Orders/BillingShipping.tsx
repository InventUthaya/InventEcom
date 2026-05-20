import React, { use, useEffect } from 'react';
import { Edit, MapPin, MoreHorizontal } from 'lucide-react';
import CommonService from '../../services/CommonService';

interface Shipment {
    id: string | number;
    trackingNumber: string;
    totalWeight: number;
    dateShipped: string;
    dateDelivered: string;
    createdOn: string;
}

interface BillingShippingProps {
    orderHeader: {
        FullName?: string;
        Phone?: string;
        Email?: string;
        Id?: number;
    };
    orderTrack: any;
    address: string;
    shippingMethod: string;
    shippingStatus: string;
    shipments: Shipment[];
}

const BillingShipping: React.FC<BillingShippingProps> = ({ orderHeader, address, shippingMethod, shippingStatus, shipments, orderTrack }) => {


    useEffect(() => {
        if (!orderHeader?.Id) return;

        const fetchOrderTrack = async () => {
            try {
                const data = await CommonService.getWithSingleParam(
                    "history",
                    "GetHistory",
                    orderHeader.Id
                );
                console.log("Order Track Data:", data);
            } catch (err) {
                console.error("Error fetching order track:", err);
            }
        };

        fetchOrderTrack();
    }, [orderHeader?.Id]);


    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Billing Address</h3>
                    <div className="space-y-1 text-sm text-gray-900">
                        <div>{orderHeader?.FullName ?? '-'}</div>
                        <div className="break-words">{address}</div>
                        <div className="mt-4">Phone: {orderHeader?.Phone ?? '-'}</div>
                    </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Shipping Address</h3>
                    <div className="space-y-1 text-sm text-gray-900">
                        <div>{orderHeader?.FullName ?? '-'}</div>
                        <div className="break-words">{address}</div>
                        <div className="mt-4">Phone: {orderHeader?.Phone ?? '-'}</div>
                    </div>
                </div>

                <div className="space-y-6 pt-4">
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Shipping method</h3>
                        <div className="text-sm text-gray-900">{shippingMethod}</div>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-3">Shipping status</h3>

                        <div
                            className={`space-y-4 ${orderTrack && orderTrack.length > 3
                                ? 'max-h-[200px] overflow-y-auto pr-2 scrollbar-thin'
                                : ''
                                }`}
                        >

                            {orderTrack && orderTrack.length > 0 ? (
                                orderTrack.map((track: any, index: number) => {
                                    const isCompleted = true;
                                    const isLast = index === orderTrack.length - 1;

                                    return (
                                        <div key={index} className="flex items-start gap-3">
                                            {/* Status Icon */}
                                            <div className="flex flex-col items-center">
                                                <div
                                                    className={`w-3 h-3 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-gray-300'
                                                        }`}
                                                />
                                                {!isLast && (
                                                    <div className="w-[2px] h-8 bg-gray-300 mt-1" />
                                                )}
                                            </div>

                                            <div className="flex-1">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {(() => {
                                                        switch (track.NewStatusId) {
                                                            case 1: return 'Pending';
                                                            case 2: return 'Confirmed';
                                                            case 3: return 'Cancelled';
                                                            case 4: return 'Completed';
                                                            case 5: return 'Rejected';
                                                            case 6: return 'Shipped';
                                                            case 7: return 'Assigned';
                                                            case 8: return 'Pending';
                                                            case 9: return 'Completed';
                                                            case 10: return 'Refund Pending';
                                                            case 11: return 'Refund Completed';
                                                            case 16: return 'Out For Delivery';
                                                            default: return track.StatusName ?? `Status ${track.NewStatusId}`;
                                                        }
                                                    })()}

                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {track.CreatedOn
                                                        ? new Date(track.CreatedOn).toLocaleString()
                                                        : ''}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-sm text-gray-400">No tracking information available</div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default BillingShipping;