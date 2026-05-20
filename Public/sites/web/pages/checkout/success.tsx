// pages/checkout/success.tsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import BuyOrderServices from "shared/src/services/BuyOrder.Services";

export default function CheckoutSuccess() {
  const router = useRouter();
  const { session_id } = router.query;
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!session_id || typeof session_id !== "string") return;

    const confirmOrder = async () => {
      try {
        // Step 1: Retrieve session + metadata securely from your server
        const res = await fetch(`/api/stripe-session?session_id=${session_id}`);
        if (!res.ok) {
          throw new Error("Failed to verify payment");
        }
        const { metadata, payment_status } = await res.json();


        if (!metadata?.orderId) {
          throw new Error("Invalid order data");
        }

        // Step 2: Build full update payload using metadata
const updateOrderData = {
          OrderId: parseInt(metadata.orderId),
          StatusId: 1,
          Name: metadata.Name || "",
          PhoneNumber: metadata.PhoneNumber || "",
          AddressType: metadata.AddressType || "",
          AddressLine1: metadata.addressLine1 || "",
          AddressLine2: metadata.addressLine2 || "",
          City: metadata.city || "",
          State: metadata.state || "",
          Country: metadata.country || "India",
          Pincode: metadata.pincode || "",
          AddressId: metadata.addressId, 
        };

        // Step 3: Confirm order on your backend
        const response = await BuyOrderServices.updateOrder(updateOrderData);

        if (response.status === 200) {
          localStorage.removeItem("orderId");
          setStatus("success");

          // Auto-redirect to home after 3 seconds
          setTimeout(() => {
            router.push("/");
          }, 3000);
        } else {
          throw new Error("Failed to confirm order");
        }
      } catch (err: any) {
        console.error("Order confirmation error:", err);
        setErrorMessage(err.message || "Something went wrong");
        setStatus("error");
      }
    };

    confirmOrder();
  }, [session_id, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md text-center">
        {status === "loading" && (
          <>
            <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg">Confirming your payment...</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
            <p className="text-gray-600">Your order has been confirmed.</p>
            <p className="text-sm text-gray-500 mt-4">Redirecting to home in 3 seconds...</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
              <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-red-600 mb-4">Payment Confirmation Failed</h2>
            <p className="text-gray-600">{errorMessage}</p>
            <button
              onClick={() => router.push("/")}
              className="mt-6 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Go Home
            </button>
          </>
        )}
      </div>
    </div>
  );
}