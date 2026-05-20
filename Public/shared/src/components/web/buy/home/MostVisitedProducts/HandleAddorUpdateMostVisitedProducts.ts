import { getLocalStorage } from "shared/src/components/helper/Helper";
import MostVisitedProductsServices from "shared/src/services/MostVisitedProducts.Services";
import MostVisitedProductsCustomerMappingServices from "shared/src/services/MostVisitedProductsCustomerMapping.Services";

const handleMostVisitedTracking = async (productId: string): Promise<void> => {
    const encryptedProductId = productId;
    const customerId = getLocalStorage()?.PersonId;
    
    // Call #1 - General Product Tracking
    try {
        await MostVisitedProductsServices.HandleAddorUpdate({
            EncryptedProductId: encryptedProductId,
        });
    } catch (err) {
        console.error(err);
    }

    // Call #2 - Product + Customer Mapping Tracking (if available)
    if (customerId) {
        try {
            await MostVisitedProductsCustomerMappingServices.HandleAddorUpdate({
                EncryptedProductId: encryptedProductId,
                EncryptedCustomerId: customerId,
            });
        } catch (err) {
            console.error(err);
        }
    } else {
        console.warn("⚠️ No customer ID found. Skipping customer mapping tracking.");
    }
};

export default handleMostVisitedTracking;
