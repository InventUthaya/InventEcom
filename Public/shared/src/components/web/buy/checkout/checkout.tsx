import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import { currencyByCountry, formatPrice, getLocalStorage } from "shared/src/components/helper/Helper";
import UserAddressServices from "shared/src/services/UserAddress.Services";
import BuyOrderServices from "shared/src/services/BuyOrder.Services";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripePaymentForm from "./utils/StripePaymentForm";
import DofyGeoService from "shared/src/services/DofyGeo.Service";
import { HelperConstant } from "shared/src/components/helper/HelperConstant";
import DiscountServices from "shared/src/services/Discount.Services";
import CartService from "shared/src/services/Cart.Service";
import { Store, Trash2 } from "lucide-react";
import Breadcrumbs from "shared/src/components/utils/BreadCrumb/Breadcrumbs";

const CdnUrl = process.env.NEXT_PUBLIC_IMAGE_CDN_URL || "";
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function SimpleCheckoutPage() {
  const router = useRouter();
  const userId = getLocalStorage()?.PersonId as any;
  const [loading, setLoading] = useState(true);
  const [updatingOrder, setUpdatingOrder] = useState(false);
  const [personId, setPersonId] = useState<number | null>(null);
  const [orderHeader, setOrderHeader] = useState<any>({});
  const [orderDetails, setOrderDetails] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [promoCode, setPromoCode] = useState("");
  const [promoMessage, setPromoMessage] = useState("");
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "card" | "upi">("cod");
  const [newAddress, setNewAddress] = useState({
    Name: "",
    PhoneNumber: "",
    AddressType: "",
    AddressLine1: "",
    AddressLine2: "",
    City: "",
    State: "",
    Pincode: "",
    Country: "India",
  });
  const [state, setState] = useState<Array<any>>([]);
  const [city, setCity] = useState<Array<any>>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const handleInputChange = (field: string, value: string) => {
    setNewAddress((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successfulOrders, setSuccessfulOrders] = useState<string[]>([]);
  const [isPromoCodeValid, setIsPromoCodeValid] = useState(false);
  const [validPromoCode, setValidPromoCode] = useState("");
  const [appliedPromoData, setAppliedPromoData] = useState<{
    value: number;
    type: "FLAT" | "PERCENTAGE";
  } | null>(null);

  const getStateList = () => {
    DofyGeoService.GetStateList(HelperConstant.serviceTypeId.SELL)
      .then(res => {
        if (res.status === 200) {
          setState(res.data);
        }
      })
      .catch(e => console.log(e));
  };

  const GetCityByStateList = (StateName: any) => {
    const selectedState = state.find(item => item.Name === StateName);
    if (!selectedState) return;
    DofyGeoService.GetCityByStateList(HelperConstant.serviceTypeId.SELL, selectedState.Id)
      .then(res => {
        if (res.status === 200) {
          setCity(res.data);
        }
      })
      .catch(e => console.log(e));
  };

  const handleEditAddress = (address: any) => {
    setNewAddress({
      Name: address.Name || "",
      PhoneNumber: address.PhoneNumber || "",
      AddressType: address.AddressType || "",
      AddressLine1: address.AddressLine1 || "",
      AddressLine2: address.AddressLine2 || "",
      City: address.City || "",
      State: address.State || "",
      Pincode: address.Pincode || "",
      Country: address.Country || "India",
    });
    setEditingAddressId(address.Id);
    setIsEditingAddress(true);
    if (address.State) {
      GetCityByStateList(address.State);
    } else {
      setCity([]);
    }
  };

  const fetchAddressData = async (userId: number) => {
    try {
      const response = await UserAddressServices.GetAddressByCustomerId(userId);
      if (response.status === 200) {
        let addressesArray = [];
        if (Array.isArray(response.data)) {
          addressesArray = response.data;
        } else if (response.data) {
          addressesArray = [response.data];
        }
        setAddresses(addressesArray);
        const defaultAddress = addressesArray.find((addr: any) => addr.isDefault === true || addr.IsDefault === 1 || addr.isDefault === 1);
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.Id);
          setSelectedAddress(defaultAddress);
        } else if (addressesArray.length > 0) {
          setSelectedAddressId(addressesArray[0].Id);
          setSelectedAddress(addressesArray[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const fetchCartDataByUserId = async () => {
    try {
      if (!personId) {
        console.error("User not logged in");
        setLoading(false);
        return;
      }

      const response = await CartService.getAllCart(personId);
      if (response.status === 200 && response.data?.Items && response.data.Items.length > 0) {
        const cartItems = response.data.Items;
        const details = cartItems.map((item: any) => {
          const quantity = item.CartQuantity || 1;
          const unitPrice = item.SellingPrice;
          const taxRate = item.TaxRate || 0;
          const isInclusive = item.IsInclusive || false;
          const taxAmount = unitPrice * (taxRate / 100.0) * quantity;
          const totalPrice = unitPrice * quantity;
          return {
            CartId: item.CartId,
            SkuId: item.SkuId,
            ProductName: item.ProductName,
            Description: item.Description || "",
            ImageUrl: item.ImagePath ? `${CdnUrl}${item.ImagePath}` : null,
            Quantity: quantity,
            TaxRate: taxRate,
            IsInclusive: isInclusive,
            TaxID: item.TaxID || null,
            UnitPrice: unitPrice,
            TotalPrice: totalPrice,
            TaxAmount: taxAmount,
            RamSize: item.RamSize,
            StorageSize: item.StorageSize,
            ColorName: item.ColorName,
            GradeName: item.GradeName,
            BrandName: item.BrandName,
            selected: true,
            PartnerCompanyName: item.PartnerCompanyName,
            StockQty: item.StockQty || 0,
          };
        });
        setOrderDetails(details);
        setOrderHeader({
          OrderStatus: "Pending",
          OrderNumber: "CART-" + Date.now(),
          OrderDate: new Date().toISOString(),
        });
      } else {
        setOrderDetails([]);
        setOrderHeader({
          OrderStatus: "Pending",
          OrderNumber: "CART-EMPTY",
        });
      }
    } catch (error) {
      console.error("Error fetching cart data:", error);
      setOrderDetails([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectItem = (index: number) => {
    setOrderDetails(prev => prev.map((item, i) => i === index ? { ...item, selected: !item.selected } : item));
  };

  const updateQuantity = (index: number, delta: number) => {
    setOrderDetails(prev => prev.map((item, i) => {
      if (i === index) {
        const newQty = Math.max(1, item.Quantity + delta);
        const newTaxAmount = item.UnitPrice * (item.TaxRate / 100.0) * newQty;
        return {
          ...item,
          Quantity: newQty,
          TotalPrice: newQty * item.UnitPrice,
          TaxAmount: newTaxAmount
        };
      }
      return item;
    }));
  };

  const handleDeleteItem = async (index: number) => {
    const item = orderDetails[index];
    if (personId && item.CartId) {
      try {
        const response = await CartService.deleteCartItem(item.CartId);
        if (response.status === 200) {
          setOrderDetails(prev => prev.filter((_, i) => i !== index));
        }
      } catch (error) {
        console.error("Error deleting cart item:", error);
      }
    } else {
      // For guest checkout or local cart
      setOrderDetails(prev => prev.filter((_, i) => i !== index));
      localStorage.removeItem("cartItem");
    }
  };

  useEffect(() => {
    setPersonId(userId || null as any);
    fetchAddressData(userId || null as any);
    getStateList();
    fetchCartDataByUserId();
  }, [personId]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showSuccessPopup) {
      timer = setTimeout(() => {
        setShowSuccessPopup(false);
        router.push('/myorder');
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [showSuccessPopup]);

  const selectedItems = orderDetails.filter(item => item.selected);
  const isStockExceeded = selectedItems.some(item => item.Quantity > item.StockQty);

  const calculateTotals = () => {
    const selected = orderDetails.filter(i => i.selected);
    const originalProductTotal = selected.reduce((sum, i) => sum + i.TotalPrice, 0);
    const backendDiscount = orderHeader.DiscountTotal || 0;
    const baseForPromo = originalProductTotal - backendDiscount;

    let promoDiscount = 0;
    if (appliedPromoData && isPromoCodeValid) {
      promoDiscount = appliedPromoData.type === 'FLAT'
        ? appliedPromoData.value
        : Math.round(baseForPromo * appliedPromoData.value / 100.0);
      promoDiscount = Math.min(promoDiscount, baseForPromo);
    }

    let newProductTotal = 0;
    let newTaxTotal = 0;
    let hasExclusiveTax = false;

    selected.forEach(item => {
      const itemOriginalTotal = item.TotalPrice;
      const itemBackendDisc = originalProductTotal > 0 ? Math.round((itemOriginalTotal / originalProductTotal) * backendDiscount) : 0;
      const itemBaseAfterBackend = itemOriginalTotal - itemBackendDisc;
      const itemPromoDisc = baseForPromo > 0 ? Math.round((itemBaseAfterBackend / baseForPromo) * promoDiscount) : 0;
      const itemPrePromoUnitPrice = itemBaseAfterBackend / item.Quantity;
      const itemNewTax = itemPrePromoUnitPrice * (item.TaxRate / 100.0) * item.Quantity;
      
      const itemNetTotal = itemOriginalTotal - itemBackendDisc - itemPromoDisc;
      const itemNewTotal = itemNetTotal;

      newProductTotal += itemNewTotal;
      newTaxTotal += itemNewTax;

      if (!item.IsInclusive) {
        hasExclusiveTax = true;
      }
    });

    const roundedProductTotal = Math.round(newProductTotal);
    const roundedTaxTotal = Math.round(newTaxTotal);
    const finalAmount = roundedProductTotal + roundedTaxTotal;

    return {
      productTotal: hasExclusiveTax ? Math.round(originalProductTotal) : Math.round(originalProductTotal) + roundedTaxTotal,
      taxTotal: roundedTaxTotal,
      hasExclusiveTax,
      discountTotal: Math.round(backendDiscount),
      promoDiscount: Math.round(promoDiscount),
      netPayableBeforePromo: Math.round(baseForPromo),
      netPayable: finalAmount,
      finalAmount,
    };
  };

  const totals = calculateTotals();

  const handleAddressSelect = (addressId: number) => {
    setSelectedAddressId(addressId);
    const address = addresses.find(addr => addr.Id === addressId);
    setSelectedAddress(address);
  };

  const handlePromoCodeSubmit = async () => {
    if (!promoCode.trim()) {
      setPromoMessage("Please enter a promo code");
      setAppliedPromoData(null);
      setIsPromoCodeValid(false);
      setValidPromoCode("");
      return;
    }

    setPromoMessage("Validating promo code...");
    setUpdatingOrder(true);

    try {
      const personId = getLocalStorage()?.PersonId;
      if (!personId) {
        setPromoMessage("User not logged in");
        setAppliedPromoData(null);
        setIsPromoCodeValid(false);
        setValidPromoCode("");
        return;
      }

      const response = await DiscountServices.getPromoCodeByPersonId(promoCode.trim(), personId);

      if (response.status === 200 && response.data) {
        const discountData = response.data;
        const discountType = (discountData.DiscountType || discountData.Type || "FLAT").toUpperCase() as "FLAT" | "PERCENTAGE";
        const promoValue = Number(discountData.Value) || 0;

        setAppliedPromoData({ value: promoValue, type: discountType });
        setPromoMessage("Promo code applied successfully!");
        setIsPromoCodeValid(true);
        setValidPromoCode(promoCode.trim());
      } else {
        setAppliedPromoData(null);
        setPromoMessage("Invalid or expired promo code");
        setIsPromoCodeValid(false);
        setValidPromoCode("");
      }
    } catch (error: any) {
      setAppliedPromoData(null);
      setIsPromoCodeValid(false);
      setValidPromoCode("");
      setPromoMessage(error.response?.data?.message || "Error validating promo code. Please try again.");
    } finally {
      setUpdatingOrder(false);
    }
  };

  const createOrderFromCart = async () => {
    if (!selectedAddressId || !personId || !selectedAddress) {
      alert("Please select a delivery address");
      return;
    }
    if (selectedItems.length === 0) {
      alert("Please select at least one item to place order");
      return;
    }

    try {
      const orderItems = selectedItems.map(item => ({
        SkuId: item.SkuId,
        Quantity: item.Quantity
      }));
      const skuIdsString = selectedItems.map(item => item.SkuId).join(',');
      const orderAddress = {
        AddressId: selectedAddress.Id,
        AddressLine1: selectedAddress.AddressLine1 || "",
        AddressLine2: selectedAddress.AddressLine2 || "",
        City: selectedAddress.City || "",
        State: selectedAddress.State || "",
        Pincode: selectedAddress.Pincode || "",
        Country: selectedAddress.Country || "India",
      };

      const orderModel = {
        UserID: personId,
        AddressID: selectedAddressId,
        OrderAddress: orderAddress,
        PaymentMethod: paymentMethod === "cod" ? "COD" : "Online",
        SKUIds: skuIdsString,
        PromoCode: isPromoCodeValid ? validPromoCode : null,
        ProductQuantity: orderItems,
        EncryptedOrderId: '',
        EncryptedCustomerId: personId.toString(),
        EncryptedBillingAddressId: "",
        EncryptedShippingAddressId: "",
        billingAddressId: 0,
        shippingAddressId: 0,
        customerCurrencyCode: "INR",
        discountUsageHistory: {},
        storeId: 1
      };

      const response = await BuyOrderServices.BulkOrder([orderModel]);

      if (response.status === 200 && response.data && response.data.length > 0) {
        const successfulOrdersList = response.data
          .filter((item: any) => item.Success && item.OrderNumber)
          .map((item: any) => item.OrderNumber);

        if (successfulOrdersList.length > 0) {
          setSuccessfulOrders(successfulOrdersList);
          setOrderHeader({
            OrderNumbers: successfulOrdersList,
            OrderNumber: successfulOrdersList.join(", ")
          });
          setShowSuccessPopup(true);
        } else {
          const errorMessage = response.data?.[0]?.Message || "No successful orders were created.";
          alert(`Order placement failed: ${errorMessage}`);
        }
      } else {
        alert(response.data?.[0]?.Message || "Failed to place order");
      }
    } catch (error: any) {
      console.error("Order creation failed:", error);
      alert(error.response?.data?.message || "Failed to place order");
    } finally {
      setUpdatingOrder(false);
    }
  };

  const handleUpdateOrder = async () => {
    if (!selectedAddressId) {
      alert("Please select a delivery address");
      return;
    }
    if (selectedItems.length === 0) {
      alert("Please select at least one item");
      return;
    }
    setUpdatingOrder(true);

    if (paymentMethod === "cod") {
      await createOrderFromCart();
    } else {
      try {
        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: Math.round(totals.finalAmount * 100),
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          alert("Payment setup failed: " + (errorData.error || "Unknown error"));
          setUpdatingOrder(false);
          return;
        }

        const { clientSecret } = await response.json();
        setClientSecret(clientSecret);
        setUpdatingOrder(false);
      } catch (err) {
        console.error(err);
        alert("Something went wrong. Please try again.");
        setUpdatingOrder(false);
      }
    }
  };

  const HandleSaveAddress = async () => {
    // Validate fields
    const errors: Record<string, string> = {};
    if (!newAddress.Name.trim()) errors.Name = "Please enter name";
    if (!newAddress.PhoneNumber.trim()) {
      errors.PhoneNumber = "Please enter mobile number";
    } else if (!/^\d{10}$/.test(newAddress.PhoneNumber.trim())) {
      errors.PhoneNumber = "Please enter a valid 10-digit mobile number";
    }
    if (!newAddress.AddressType) errors.AddressType = "Please select address type";
    if (!newAddress.AddressLine1.trim()) errors.AddressLine1 = "Please enter address line 1";
    if (!newAddress.State) errors.State = "Please select state";
    if (!newAddress.City) errors.City = "Please select city";
    if (!newAddress.Pincode.trim()) {
      errors.Pincode = "Please enter pincode";
    } else if (!/^\d{6}$/.test(newAddress.Pincode.trim())) {
      errors.Pincode = "Please enter a valid 6-digit pincode";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});

    try {
      let savedAddress;
      if (editingAddressId) {
        const payload = {
          Id: editingAddressId,
          UserId: personId,
          DisplayInList: 1,
          IsActive: 1,
          ...newAddress,
          IsDefault: selectedAddressId === editingAddressId ? 1 : 0,
        };
        const response = await BuyOrderServices.AddAddress(payload);
        if (response.status === 200) {
          savedAddress = response.data;
        }
      } else {
        const payload = {
          isDefault: addresses.length === 0 ? 1 : 0,
          DisplayInList: 1,
          IsActive: 1,
          UserId: personId,
          ...newAddress,
        };
        const response = await BuyOrderServices.AddAddress(payload);
        if (response.status === 200) {
          savedAddress = response.data;
        }
      }

      if (personId) {
        await fetchAddressData(personId);
      }
      if (savedAddress) {
        setSelectedAddressId(savedAddress.Id);
      }

      setIsEditingAddress(false);
      setEditingAddressId(null);
      setNewAddress({
        Name: "",
        PhoneNumber: "",
        AddressType: "",
        AddressLine1: "",
        AddressLine2: "",
        City: "",
        State: "",
        Pincode: "",
        Country: "India",
      });
      setCity([]);
    } catch (err: any) {
      console.error("Address save/update failed", err);
      alert(err.response?.data?.message || "Failed to save address. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your order...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Breadcrumbs
        category={"Chekout"}
        subcategory={""} />
      <Elements stripe={stripePromise}>
        <div className="min-h-screen bg-gray-50 py-8 relative">
          {showSuccessPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-sm w-full animate-fade-in">
                <div className="p-8 text-center">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                    <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Order Placed Successfully!</h3>
                  <p className="text-gray-600 mb-2">Your order has been confirmed and will be processed shortly.</p>
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <div className="text-sm">
                      <div className="mb-2">
                        <span className="text-gray-500">Order Number{successfulOrders.length > 1 ? "s" : ""}:</span>
                        <div className="font-medium text-gray-900 mt-1">{successfulOrders.join(", ")}</div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Total:</span>
                        <span className="font-medium text-green-600">{currencyByCountry(formatPrice(totals.finalAmount))}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mb-2">Redirecting to my orders in 3 seconds...</div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                    <div className="bg-green-600 h-1.5 rounded-full animate-countdown"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Order Summary</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>
                  </div>
                  {orderDetails.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No items in your cart</p>
                  ) : (
                    <div className="space-y-6">
                      {orderDetails.map((item, index) => (
                        <div key={index} className="flex border-b pb-6 relative">
                          <div className="flex items-start">
                            <input type="checkbox" checked={item.selected} onChange={() => toggleSelectItem(index)} className="mt-8 h-5 w-5 text-red-600 border-gray-300 rounded focus:ring-red-500" />
                          </div>
                          <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden ml-4">
                            <img src={item.ImageUrl.toLowerCase() || "/placeholder.jpg"} alt={item.ProductName || "Product"} className="w-full h-full object-cover" />
                          </div>
                          <div className="ml-6 flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-lg font-medium text-gray-900">{item.ProductName || "Product"}</h3>
                                <p className="text-sm text-gray-500 mt-1">{item.Description || "No description"}</p>
                              </div>
                              <button
                                onClick={() => handleDeleteItem(index)}
                                className="text-gray-400 hover:text-red-600 transition-colors p-1"
                                title="Remove item"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                            <div className="mt-2 flex items-center justify-between">
                              <div>
                                <p className="text-sm text-gray-600">Colour: {item.ColorName}</p>
                                {item.BrandName && <p className="text-sm text-gray-600">Brand: {item.BrandName}</p>}
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-semibold text-gray-900">{currencyByCountry(formatPrice(item.IsInclusive ? item.TotalPrice + item.TaxAmount : item.TotalPrice))}</p>
                              </div>
                            </div>
                            {item.Quantity > item.StockQty && (
                              <div className="mt-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2 flex items-center space-x-2 animate-fade-in">
                                <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <span className="font-semibold text-xs">Stock Not Available! Only {item.StockQty} available.</span>
                              </div>
                            )}
                            <div className="pt-2 mt-auto flex items-center gap-2 border-t border-[#EFEFEF]">
                              <Store size={14} className="text-gray-500" />
                              <span className="text-xs text-gray-600 truncate">{item.PartnerCompanyName}</span>
                            </div>
                          </div>
                          <div className="ml-4 flex items-center space-x-0.5">
                            <button onClick={() => updateQuantity(index, -1)} className="w-5 h-5 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-xs font-bold">−</button>
                            <span className="text-xs font-medium w-6 text-center">{item.Quantity}</span>
                            <button onClick={() => updateQuantity(index, 1)} className="w-5 h-5 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-xs font-bold">+</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Deliver Address</h2>
                    <button onClick={() => {
                      if (isEditingAddress) {
                        setIsEditingAddress(false);
                        setEditingAddressId(null);
                        setNewAddress({ Name: "", PhoneNumber: "", AddressType: "", AddressLine1: "", AddressLine2: "", City: "", State: "", Pincode: "", Country: "India" });
                        setCity([]);
                        setFormErrors({});
                      } else {
                        setIsEditingAddress(true);
                        setEditingAddressId(null);
                      }
                    }} className="text-red-600 font-medium hover:text-red-700">
                      {isEditingAddress ? "Cancel" : "Add New"}
                    </button>
                  </div>

                  {isEditingAddress ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
                          <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" value={newAddress.Name} onChange={e => handleInputChange("Name", e.target.value)} />
                          {formErrors.Name && <p className="text-xs text-red-500 mt-1 font-semibold">{formErrors.Name}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
                          <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" value={newAddress.PhoneNumber} onChange={e => handleInputChange("PhoneNumber", e.target.value)} />
                          {formErrors.PhoneNumber && <p className="text-xs text-red-500 mt-1 font-semibold">{formErrors.PhoneNumber}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Address Type <span className="text-red-500">*</span></label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" value={newAddress.AddressType} onChange={e => handleInputChange("AddressType", e.target.value)}>
                            <option value="">Select address type</option><option value="Home">Home</option><option value="Work">Work</option><option value="Other">Other</option>
                          </select>
                          {formErrors.AddressType && <p className="text-xs text-red-500 mt-1 font-semibold">{formErrors.AddressType}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1 <span className="text-red-500">*</span></label>
                          <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" value={newAddress.AddressLine1} onChange={e => handleInputChange("AddressLine1", e.target.value)} />
                          {formErrors.AddressLine1 && <p className="text-xs text-red-500 mt-1 font-semibold">{formErrors.AddressLine1}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2 (Optional)</label>
                          <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" value={newAddress.AddressLine2} onChange={e => handleInputChange("AddressLine2", e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">State <span className="text-red-500">*</span></label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" value={newAddress.State || ""} onChange={e => { handleInputChange("State", e.target.value); setNewAddress(prev => ({...prev, City: ""})); GetCityByStateList(e.target.value); }}>
                            <option value="">Select State</option>{state.map(item => <option key={item.Id} value={item.Name}>{item.Name}</option>)}
                          </select>
                          {formErrors.State && <p className="text-xs text-red-500 mt-1 font-semibold">{formErrors.State}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">City <span className="text-red-500">*</span></label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" value={newAddress.City || ""} onChange={e => handleInputChange("City", e.target.value)}>
                            <option value="">Select City</option>{city.map(item => <option key={item.Id} value={item.Name}>{item.Name}</option>)}
                          </select>
                          {formErrors.City && <p className="text-xs text-red-500 mt-1 font-semibold">{formErrors.City}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Pincode <span className="text-red-500">*</span></label>
                          <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" value={newAddress.Pincode} onChange={e => handleInputChange("Pincode", e.target.value)} />
                          {formErrors.Pincode && <p className="text-xs text-red-500 mt-1 font-semibold">{formErrors.Pincode}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                          <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" value={newAddress.Country} onChange={e => handleInputChange("Country", e.target.value)} />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-3">
                        <button onClick={() => {
                          setIsEditingAddress(false);
                          setEditingAddressId(null);
                          setNewAddress({ Name: "", PhoneNumber: "", AddressType: "", AddressLine1: "", AddressLine2: "", City: "", State: "", Pincode: "", Country: "India" });
                          setCity([]);
                          setFormErrors({});
                        }} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
                        <button onClick={HandleSaveAddress} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">{editingAddressId ? "Update Address" : "Save Address"}</button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {addresses.length === 0 ? (
                        <p className="text-gray-500">No addresses saved. Please add an address.</p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {addresses.map(address => (
                            <div key={address.Id} className={`border rounded-lg p-4 cursor-pointer transition-colors relative ${selectedAddressId === address.Id ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-gray-300"}`} onClick={() => handleAddressSelect(address.Id)}>
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <h3 className="font-medium text-gray-900">{address.Name || "User"}</h3>
                                    {(address.isDefault || address.IsDefault === 1) && <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Default</span>}
                                  </div>
                                  <p className="text-sm text-gray-600 mt-1">{address.AddressLine1}</p>
                                  {address.AddressLine2 && <p className="text-sm text-gray-600">{address.AddressLine2}</p>}
                                  <p className="text-sm text-gray-600">{address.City}, {address.State} - {address.Pincode}</p>
                                  <p className="text-sm text-gray-600">{address.Country}</p>
                                  <p className="text-sm text-gray-600 mt-1">Phone: {address.PhoneNumber}</p>
                                </div>
                                <div className="flex items-center space-x-3">
                                  {selectedAddressId === address.Id && (
                                    <div className="text-red-600">
                                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                      </svg>
                                    </div>
                                  )}
                                  <button onClick={(e) => { e.stopPropagation(); handleEditAddress(address); }} className="text-gray-500 hover:text-red-600 transition">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Method</h2>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input type="radio" id="cod" name="payment" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300" />
                      <label htmlFor="cod" className="ml-3 block text-sm font-medium text-gray-700">Cash on Delivery (COD)</label>
                    </div>
                    <div className="flex items-center">
                      <input type="radio" id="card" name="payment" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300" />
                      <label htmlFor="card" className="ml-3 block text-sm font-medium text-gray-700">Credit/Debit Card</label>
                    </div>
                    <div className="flex items-center">
                      <input type="radio" id="upi" name="payment" checked={paymentMethod === "upi"} onChange={() => setPaymentMethod("upi")} className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300" />
                      <label htmlFor="upi" className="ml-3 block text-sm font-medium text-gray-700">UPI</label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8">


                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Price Details</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Product Total</span>
                      <span className="font-medium">{currencyByCountry(formatPrice(totals.productTotal))}</span>
                    </div>
                    {totals.taxTotal > 0 && totals.hasExclusiveTax && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax</span>
                        <span className="font-medium">+{currencyByCountry(formatPrice(totals.taxTotal))}</span>
                      </div>
                    )}
                    {totals.discountTotal > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Discount</span>
                        <span className="font-medium text-red-600">-{currencyByCountry(formatPrice(totals.discountTotal))}</span>
                      </div>
                    )}
                    <div className="pt-4 border-t">
                      <div className="flex mb-2">
                        <input type="text" value={promoCode} onChange={(e) => { setPromoCode(e.target.value); setPromoMessage(""); setAppliedPromoData(null); setIsPromoCodeValid(false); setValidPromoCode(""); }} placeholder="Enter promo code" className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-red-500" />
                        <button onClick={handlePromoCodeSubmit} className="px-4 py-2 bg-gray-800 text-white rounded-r-md hover:bg-gray-900">Apply</button>
                      </div>
                      {promoMessage && <p className={`text-sm ${isPromoCodeValid ? "text-green-600" : "text-red-600"}`}>{promoMessage}</p>}
                      {totals.promoDiscount > 0 && (
                        <div className="flex justify-between mt-2">
                          <span className="text-gray-600">Promo Discount</span>
                          <span className="font-medium text-red-600">-{currencyByCountry(formatPrice(totals.promoDiscount))}</span>
                        </div>
                      )}
                    </div>
                    <div className="pt-4 border-t">
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total Amount</span>
                        <span>{currencyByCountry(formatPrice(totals.finalAmount))}</span>
                      </div>
                      <p className="font-medium text-green-600">Inclusive of all taxes</p>
                    </div>
                  </div>

                  {(() => {
                    const isFinishDisabled = !selectedAddressId || updatingOrder || selectedItems.length === 0 || isStockExceeded;
                    return (
                      <button onClick={handleUpdateOrder} disabled={isFinishDisabled} className={`w-full mt-6 py-3 px-4 rounded-md font-medium transition-all ${isFinishDisabled ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-red-600 text-white hover:bg-red-700"}`}>
                        {updatingOrder ? (
                          <div className="flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Placing Order...
                          </div>
                        ) : "Finish"}
                      </button>
                    );
                  })()}

                  <p className="text-sm text-gray-500 mt-4 text-center">By placing this order, you agree to our Terms of Service</p>
                </div>
              </div>
            </div>
          </div>

          {clientSecret && paymentMethod !== "cod" && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative">
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <StripePaymentForm amount={totals.finalAmount} clientSecret={clientSecret} onSuccess={async () => { await createOrderFromCart(); setClientSecret(null); }} onClose={() => setClientSecret(null)} />
                </Elements>
              </div>
            </div>
          )}
        </div>

        <style jsx global>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes countdown { from { width: 100%; } to { width: 0%; } }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .animate-countdown { animation: countdown 3s linear forwards; }
      `}</style>
      </Elements>
    </>
  );
}