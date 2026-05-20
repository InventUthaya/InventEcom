import { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { X } from 'lucide-react';

interface StripePaymentFormProps {
    amount: number;
    clientSecret: string;
    onSuccess: () => void;
    onClose: () => void;
}

export default function StripePaymentForm({
    amount,
    onSuccess,
    onClose,
}: StripePaymentFormProps) {
    const stripe = useStripe();
    const elements = useElements();

    const [isProcessing, setIsProcessing] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            setMessage("Stripe has not loaded yet.");
            return;
        }

        setIsProcessing(true);
        setMessage(null);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: window.location.href,
            },
            redirect: 'if_required',
        });

        if (error) {
            setMessage(error.message || "An unexpected error occurred.");
            setIsProcessing(false);
        } else if (paymentIntent?.status === 'succeeded') {
            setMessage("Payment successful!");
            setTimeout(() => onSuccess(), 1200);
        } else {
            setMessage("Payment processing...");
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-40 z-40"
                onClick={onClose}
            />

            {/* Slim Modal */}
            <div className="fixed inset-0 flex items-center justify-center z-50 p-2">
                <div
                    className="bg-white rounded-lg shadow-lg w-full max-w-sm overflow-hidden flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex justify-between items-center p-4 border-b">
                        <h2 className="text-lg font-semibold">Complete Payment</h2>
                        <button
                            onClick={onClose}
                            className="p-1 rounded hover:bg-gray-200"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-4 max-h-[400px] overflow-y-auto scrollbar-thin">
                        <p className="mb-4 text-gray-600 text-sm">
                            Amount to Pay: <span className="font-bold">₹{amount.toFixed(2)}</span>
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="border border-gray-200 rounded p-3 bg-gray-50">
                                <PaymentElement
                                    options={{
                                        layout: "tabs",
                                        paymentMethodOrder: ['card', 'upi'],
                                        wallets: {
                                            applePay: "never",
                                            googlePay: "never",
                                        },
                                    }}
                                />

                            </div>

                            <button
                                type="submit"
                                disabled={isProcessing || !stripe || !elements}
                                className={`w-full py-2 rounded font-medium text-white transition
                                    ${isProcessing || !stripe || !elements
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-blue-600 hover:bg-blue-700"
                                    }`}
                            >
                                {isProcessing ? "Processing…" : `Pay ₹${amount.toFixed(2)}`}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}