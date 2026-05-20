// components/popups/CancellationPopup.tsx

import { useState } from "react";
import BuyOrderServices from "../../services/BuyOrder.Services"; // Adjust path as needed

interface CancellationPoupProps {
  data: any; // Order data
  setPopupType: (value: boolean) => void;
  popupType: boolean;
  isMobile?: boolean;
  show?: boolean;
}

const CancellationPoup = ({
  data,
  setPopupType,
  popupType,
  isMobile = false,
  show = true,
}: CancellationPoupProps) => {
  const [reason, setReason] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleCancelOrder = async () => {
    // Validation
    if (!reason.trim()) {
      setError("Please enter a reason for cancellation.");
      return;
    }
    if (reason.trim().length < 10) {
      setError("Reason must be at least 10 characters long.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const orderId = data?.Id;

      if (!orderId) {
        setError("Invalid order ID.");
        setLoading(false);
        return;
      }

      let payload = {
        orderId: orderId,
        reason: reason.trim()
      }
      const response = await BuyOrderServices.cancelOrder(payload);

      if (response.status === 200 || response.status === 201) {
        // alert("Your order has been cancelled successfully.");
        setPopupType(false);
        // Refresh track order page to show updated status
        window.location.href = "/trackorder";
      } else {
        setError("Cancellation failed. Please try again.");
      }
    } catch (err: any) {
      console.error("Cancellation error:", err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to cancel order. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!popupType || !show) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 999999, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '1rem', paddingTop: '5rem' }}>
      <div
        className={`${
          isMobile ? "w-full max-w-sm" : "w-full max-w-sm"
        } bg-white rounded-xl shadow-2xl mt-10 overflow-hidden`}
      >
        {/* Header */}
        <div className="bg-[#EA002A] text-white py-3 px-4">
          <h2 className="text-base font-semibold">Cancel Order</h2>
        </div>

        {/* Body */}
        <div className="p-4">
          <p className="text-xs text-gray-600 mb-1">
            Order No:{" "}
            <span className="font-semibold text-black">{data?.OrderNumber || "N/A"}</span>
          </p>
          <p className="text-xs text-gray-600 mb-4">
            Product:{" "}
            <span className="font-semibold text-black">{data?.ProductName || "N/A"}</span>
          </p>

          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Reason for Cancellation <span className="text-[#EA002A]">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (e.target.value.trim() === "" || e.target.value.trim().length >= 10) {
                  setError("");
                }
              }}
              placeholder="Please explain why you want to cancel this order (minimum 10 characters)"
              rows={3}
              className="w-full px-3 py-2 border border-[#EFEFEF] rounded-lg focus:outline-none focus:border-[#EA002A] resize-none transition-colors text-sm"
              disabled={loading}
            />
            <div className="mt-2 flex justify-between items-center">
              <span className="text-xs text-gray-500">
                {reason.length} / 10 characters
              </span>
              {error && <span className="text-xs text-[#EA002A]">{error}</span>}
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-2 px-4 pb-4">
          <button
            onClick={() => setPopupType(false)}
            disabled={loading}
            className="flex-1 py-2 border border-[#939393] text-[#050505] rounded-lg font-medium hover:bg-gray-50 transition disabled:opacity-50 text-sm"
          >
            Back
          </button>
          <button
            onClick={handleCancelOrder}
            disabled={reason.trim().length < 10 || loading}
            className={`flex-1 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 text-sm ${
              reason.trim().length >= 10 && !loading
                ? "bg-[#EA002A] text-white hover:bg-[#c70024]"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              "Confirm Cancellation"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancellationPoup;