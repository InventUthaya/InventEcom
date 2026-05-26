import React, { useState } from 'react';
import { ReturnRequestModel } from 'shared/src/models/ReturnRequest.Model';
import ReturnRequestService from 'shared/src/services/ReturnRequest.Service';
import { getLocalStorage } from '../../helper/Helper';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    orderNumber: string;
    orderId: number;
    SkuId: number;
    OrderDetailId: number;
    PartnerId:number;
    IsReturn : boolean;
    RefundAmount: number;
}

const ReturnReasonModal: React.FC<Props> = ({ isOpen, onClose, orderNumber, orderId, OrderDetailId, SkuId, PartnerId, IsReturn, RefundAmount }) => {
    const [reason, setReason] = useState('');
    const [comment, setComment] = useState('');
    const PersonId = getLocalStorage()?.PersonId as any;
    const handleSubmit = async () => {
        const data = {
            storeId: 1,
            OrderId: orderId,
            UserId: PersonId,
            quantity: 1,
            Reason: reason + (comment ? ` | Note: ${comment}` : ''),
            requestedAction: 'Repair',
            customerComments: comment,
            returnRequestStatusId: 0,
            OrderDetailId: OrderDetailId,
            SkuId: SkuId,
            RefundAmount: RefundAmount,
            PartnerId : PartnerId,
            IsReturn: IsReturn
        }
console.log("Datsas", data)

        ReturnRequestService.updateReturnRequest(data)
            .then((res: any) => {
                if (res.status === 200) {
                    onClose();
                    window.location.reload();
                }
            })
            .catch((e: Error) => {
                console.log(e);
            });
    }

    if (!isOpen) return null;

    const returnReasons = [
        "Incorrect Bearing Specifications",
        "Bearing Clearance / Fit Issue",
        "Wrong Part Ordered",
        "Damaged / Defective Part",
        "No Longer Required"
    ];

    const replacementReasons = [
        "Defective / Noisy Bearing",
        "Incorrect Size / Dimension Received",
        "Damaged in Transit",
        "Wrong Brand / Grade Shipped"
    ];

    const reasonsToDisplay = IsReturn ? returnReasons : replacementReasons;

    return (
        <div id="keyboard-avoid" className="fixed bottom-0 inset-0 flex items-center justify-center z-[51] overflow-y-scroll">
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white rounded-2xl z-10 absolute animate-slide-up-mobile w-full max-w-md mx-auto p-6">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white shadow-md w-8 h-8 rounded-full flex items-center justify-center">
                    <button onClick={onClose} className="text-xl text-[#000000] hover:text-gray-800">
                        &times;
                    </button>
                </div>
                <h1 className="text-xl font-semibold mb-2">
                    {IsReturn ? "Return" : "Replacement"} Order #{orderNumber}
                </h1>
                <p className="text-sm mb-4 text-gray-600">
                    Please select a reason and add any comments you'd like to include for your {IsReturn ? "return" : "replacement"}.
                </p>

                <label className="block text-sm font-medium mb-1">
                    Reason for {IsReturn ? "Return" : "Replacement"}
                </label>
                <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full border rounded-md p-2 mb-4 bg-white"
                >
                    <option value="">Select a reason</option>
                    {reasonsToDisplay.map((r) => (
                        <option key={r} value={r}>
                            {r}
                        </option>
                    ))}
                </select>

                <label className="block text-sm font-medium mb-1">Comments</label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={2}
                    className="w-full border rounded-md p-2 mb-4"
                    placeholder="Provide additional details..."
                />

                <div className="flex justify-center">
                    <button
                        onClick={handleSubmit}
                        disabled={!reason}
                        className="bg-[#EA002A] text-white px-4 py-2 rounded-md hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                    >
                        Submit {IsReturn ? "Return" : "Replacement"} Request
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReturnReasonModal;
