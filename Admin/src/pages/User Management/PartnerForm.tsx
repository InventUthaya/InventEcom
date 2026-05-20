import React, { useState } from "react";

const ErrorText = ({ msg }: { msg?: string }) =>
  msg ? <p className="text-xs text-red-600 mt-1">{msg}</p> : null;

const PartnerForm = ({
  partnerData,
  partnerErrors,
  handlePartnerChange,
  handlePartnerFileChange,
  generatePartnerPassword,
  commissionSlab,
  commissionSlabDetails,
}: any) => {
  const { Partner, Documents } = partnerData;

  const [showSlabPopup, setShowSlabPopup] = useState(false);

  const selectedSlabId = partnerData.Partner.CommissionSlabId || 0;

  const selectedSlabName =
    commissionSlab.find((s: any) => s.id == selectedSlabId)?.name || "Select commission slab";

  const handleSelectSlab = (id: number) => {
    const fakeEvent = {
      target: { value: id.toString() },
    } as React.ChangeEvent<HTMLSelectElement>;

    handlePartnerChange(fakeEvent, "Partner", "CommissionSlabId");
    setShowSlabPopup(false);
  };

  return (
    <div className="border-t border-gray-200 pt-8 mt-8">
      <h2 className="text-base sm:text-lg font-medium text-gray-900 mb-6">
        Partner Additional Details
      </h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-4">Partner Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Partner Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={Partner.Name}
                onChange={(e) => handlePartnerChange(e, "Partner", "Name")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <ErrorText msg={partnerErrors.Name} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={Partner.CompanyName}
                onChange={(e) => handlePartnerChange(e, "Partner", "CompanyName")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <ErrorText msg={partnerErrors.CompanyName} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                value={Partner.Email}
                onChange={(e) => handlePartnerChange(e, "Partner", "Email")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <ErrorText msg={partnerErrors.Email} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={Partner.PhoneNumber}
                onChange={(e) => handlePartnerChange(e, "Partner", "PhoneNumber")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+1234567890"
              />
              <ErrorText msg={partnerErrors.PhoneNumber} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GST Number <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={Partner.GSTNumber}
                onChange={(e) => handlePartnerChange(e, "Partner", "GSTNumber")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <ErrorText msg={partnerErrors.GSTNumber} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PAN Card Number <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={Partner.PanCardNumber}
                onChange={(e) => handlePartnerChange(e, "Partner", "PanCardNumber")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <ErrorText msg={partnerErrors.PanCardNumber} />
            </div>
          </div>
        </div>

        {/* ==================== Bank Details ==================== */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-4">Bank Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Bank fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bank Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={Partner.BankName}
                onChange={(e) => handlePartnerChange(e, "Partner", "BankName")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <ErrorText msg={partnerErrors.BankName} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                IFSC Code <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={Partner.IFSCCode}
                onChange={(e) => handlePartnerChange(e, "Partner", "IFSCCode")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <ErrorText msg={partnerErrors.IFSCCode} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Number <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={Partner.AccountNumber}
                onChange={(e) => handlePartnerChange(e, "Partner", "AccountNumber")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <ErrorText msg={partnerErrors.AccountNumber} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Holder Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={Partner.AccountHolderName}
                onChange={(e) => handlePartnerChange(e, "Partner", "AccountHolderName")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <ErrorText msg={partnerErrors.AccountHolderName} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Commission Slab <span className="text-red-600">*</span>
              </label>

              <div
                onClick={() => setShowSlabPopup(true)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white cursor-pointer hover:border-gray-400 flex justify-between items-center transition-shadow hover:shadow-sm"
              >
                <span className={selectedSlabId === 0 ? "text-gray-500" : "text-gray-900 font-medium"}>
                  {selectedSlabName}
                </span>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              <select
                value={selectedSlabId}
                onChange={(e) => handlePartnerChange(e, "Partner", "CommissionSlabId")}
                className="hidden"
                required
              >
                <option value={0} disabled />
                {commissionSlab.map((slab: any) => (
                  <option key={slab.id} value={slab.id}>{slab.name}</option>
                ))}
              </select>

              <ErrorText msg={partnerErrors.CommissionSlabId} />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-4">Documents Upload</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cancelled Cheque Leaf <span className="text-red-600">*</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handlePartnerFileChange(e, "ChequeLeaf")}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {partnerData.existingFiles?.ChequeLeaf && !partnerData.Documents.ChequeLeaf && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">Current:</p>
                  <img src={partnerData.existingFiles.ChequeLeaf} alt="Current cheque" className="mt-1 h-32 w-auto rounded border" />
                </div>
              )}
              <ErrorText msg={partnerErrors.ChequeLeaf} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Signature (500x500 px) <span className="text-red-600">*</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handlePartnerFileChange(e, "Signature")}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {partnerData.existingFiles?.Signature && !partnerData.Documents.Signature && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">Current:</p>
                  <img src={partnerData.existingFiles.Signature} alt="Current signature" className="mt-1 h-32 w-32 rounded border object-cover" />
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">Must be exactly 500×500 pixels</p>
              <ErrorText msg={partnerErrors.Signature} />
            </div>
          </div>
        </div>
      </div>

      {showSlabPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowSlabPopup(false)}
          />

          <div className="relative bg-white  shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-sm font-semibold text-gray-900">Select Commission Slab</h3>
              <button
                onClick={() => setShowSlabPopup(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 px-6 py-3 border-b border-gray-300 font-semibold text-xs text-gray-900">
              <div className="text-left">Percentage</div>
              <div className="text-right">Min Commission</div>
              <div className="text-right">Max Commission</div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {commissionSlab.map((slab: any) => {
                const slabDetails = commissionSlabDetails.filter(
                  (d: any) => d.CommissionSlabId === slab.id
                );

                const isSelected = slab.id === selectedSlabId;

                return (
                  <div
                    key={slab.id}
                    className={`border-b border-gray-200 ${isSelected ? "bg-blue-50" : ""}`}
                  >
                    <div onClick={() => handleSelectSlab(slab.id)} className="px-6 py-3 font-medium text-xs text-gray-900 underline hover:cursor-pointer">{slab.name}</div>

                    {slabDetails.length > 0 ? (
                      slabDetails.map((detail: any, index: number) => (
                        <div
                          key={index}
                          className="grid grid-cols-3 gap-4 px-6 py-2 border-t border-gray-100 cursor-pointer hover:bg-gray-50"
                          onClick={() => handleSelectSlab(slab.id)}
                        >
                          <div className="text-left text-xs text-black">
                            {detail.Percentage != null ? `${detail.Percentage}%` : "-"}
                          </div>

                          <div className="text-right text-xs text-black">
                            ₹{detail.MinCommissionAmount?.toLocaleString() || "0"}
                          </div>

                          <div className="text-right text-xs text-black">
                            ₹{detail.MaxCommissionAmount?.toLocaleString() || "0"}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-6 py-2 text-sm text-gray-400">No commission details available</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default PartnerForm;