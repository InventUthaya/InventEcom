import { useEffect, useState } from "react";
import ProfileAddress from "./ProfileAddress";
import { useRecoilState } from "recoil";
import { MenuContentZindex, containerZindex } from "../../../../../recoil/styleState";
import { IAddressModel } from "shared/src/models/Address.Model";
import UserAddressServices from "shared/src/services/UserAddress.Services";
import { Reloader } from "shared/src/recoil/Reloader";
import { IRegistrationModel } from "../../../../../models/Registration.Model";
import DofyGeoService from "shared/src/services/DofyGeo.Service";
import { HelperConstant } from "shared/src/components/helper/HelperConstant";

type AddressProps = {
  direction: string;
  language: "in_en" | "ae_en" | "ae_ar";
  addresses: IAddressModel[];
  personId: any;
  person?: IRegistrationModel;
};

const SavedAddress = ({ direction, language, addresses, personId, person }: AddressProps) => {
  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [reloader, setReloader] = useRecoilState(Reloader);
  const [, setZindex] = useRecoilState(containerZindex);
  const [, setMenuContentZindex] = useRecoilState(MenuContentZindex);

  const [stateList, setStateList] = useState<Array<any>>([]);
  const [cityList, setCityList] = useState<Array<any>>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const profileFullName = person
    ? `${person.firstName || ""} ${person.lastName || ""}`.trim() || "Home"
    : "Home";
  const profilePhone = person?.PhoneNumber || person?.mobileNumber || "";

  const [formData, setFormData] = useState({
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

  // Fetch states on mount
  useEffect(() => {
    DofyGeoService.GetStateList(HelperConstant.serviceTypeId.SELL)
      .then((res) => {
        if (res.status === 200) {
          setStateList(res.data);
        }
      })
      .catch(console.error);
  }, []);

  const loadCities = (stateName: string) => {
    const selectedState = stateList.find((s) => s.Name === stateName);
    if (!selectedState) {
      setCityList([]);
      return;
    }

    DofyGeoService.GetCityByStateList(HelperConstant.serviceTypeId.SELL, selectedState.Id)
      .then((res) => {
        if (res.status === 200) {
          setCityList(res.data);
        }
      })
      .catch(console.error);
  };

  const openAddForm = () => {
    setFormData({
      Name: profileFullName,
      PhoneNumber: profilePhone,
      AddressType: "Home",
      AddressLine1: "",
      AddressLine2: "",
      City: "",
      State: "",
      Pincode: "",
      Country: "India",
    });
    setCityList([]);
    setFormErrors({});
    setIsEditMode(false);
    setEditingAddressId(null);
    setShowForm(true);
    setZindex("z-[100]");
    setMenuContentZindex({ Z_Index: "z-0" });
  };

  const openEditForm = (address: IAddressModel) => {
    setFormData({
      Name: address.Name || address.FullName || profileFullName,
      PhoneNumber: address.PhoneNumber || profilePhone,
      AddressType: address.AddressType || "Home",
      AddressLine1: address.AddressLine1 || "",
      AddressLine2: address.AddressLine2 || "",
      City: address.City || "",
      State: address.State || "",
      Pincode: address.Pincode || "",
      Country: address.Country || "India",
    });

    if (address.State) {
      loadCities(address.State);
    } else {
      setCityList([]);
    }

    setFormErrors({});
    setIsEditMode(true);
    setEditingAddressId(address.Id);
    setShowForm(true);
    setZindex("z-[100]");
    setMenuContentZindex({ Z_Index: "z-0" });
  };

  const closeForm = () => {
    setShowForm(false);
    setIsEditMode(false);
    setEditingAddressId(null);
    setFormData({
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
    setCityList([]);
    setFormErrors({});
    setZindex("z-10");
    setMenuContentZindex({ Z_Index: "z-50" });
  };

  const handleSaveAddress = async () => {
    if (!personId) {
      alert("User not logged in");
      return;
    }

    // Validate fields
    const errors: Record<string, string> = {};
    if (!formData.Name.trim()) errors.Name = "Please enter name";
    if (!formData.PhoneNumber.trim()) {
      errors.PhoneNumber = "Please enter mobile number";
    } else if (!/^\d{10}$/.test(formData.PhoneNumber.trim())) {
      errors.PhoneNumber = "Please enter a valid 10-digit mobile number";
    }
    if (!formData.AddressType) errors.AddressType = "Please select address type";
    if (!formData.AddressLine1.trim()) errors.AddressLine1 = "Please enter address line 1";
    if (!formData.State) errors.State = "Please select state";
    if (!formData.City) errors.City = "Please select city";
    if (!formData.Pincode.trim()) {
      errors.Pincode = "Please enter pincode";
    } else if (!/^\d{6}$/.test(formData.Pincode.trim())) {
      errors.Pincode = "Please enter a valid 6-digit pincode";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});

    try {
      const basePayload = {
        UserId: personId,
        DisplayInList: true,
        IsActive: true,
        ...formData,
      };

      let response;

      if (isEditMode && editingAddressId) {
        // EDIT → update API
        const updatePayload = {
          Id: editingAddressId,
          ...basePayload,
        };
        response = await UserAddressServices.edit(updatePayload);
      } else {
        // ADD → create API
        const createPayload = {
          ...basePayload,
          isDefault: addresses.length === 0 ? 1 : 0,
        };
        response = await UserAddressServices.create(createPayload);
      }

      if (response.status === 200) {
        setReloader(!reloader); // Refetch addresses
        closeForm();
      }
    } catch (err: any) {
      console.error("Failed to save address:", err);
      alert(err.response?.data?.message || "Failed to save address.");
    }
  };

  const handleDelete = async (encryptedId?: string | number) => {
  if (encryptedId === undefined || encryptedId === null || encryptedId === "") {
    console.error("Invalid or missing AddressId");
    alert("Cannot delete address: Invalid ID");
    return;
  }

  if (!personId) {
    alert("User not logged in");
    return;
  }

  try {
    const idStr = String(encryptedId);
    console.log("Calling remove API with:", idStr, personId); // ← Debug log
    await UserAddressServices.remove(idStr, personId);
    setReloader(!reloader);
  } catch (err: any) {
    console.error("Delete API failed:", err);
    alert(err.response?.data?.message || "Failed to delete address");
  }
};

  const enrichedAddresses = addresses.map((addr) => ({
    ...addr,
    FullName: addr.Name || addr.FullName || profileFullName,
    PhoneNumber: addr.PhoneNumber || profilePhone,
  }));

  return (
    <>
      <div className="outerbox mt-[40px]" dir={direction} lang={language}>
        <div className="flex justify-between titlediv">
          <h1 className="font-semibold text-xs 2xl:text-sm flex gap-2">
            <span>SAVED ADDRESS</span>
            <span className="text-[#EA002A]">({addresses.length})</span>
          </h1>
          <h1
            onClick={openAddForm}
            className="text-[#EA002A] font-semibold text-sm lg:text-md 2xl:text-base cursor-pointer"
          >
            Add new address
          </h1>
        </div>

        <div className="mt-[18px] mb-12 lg:mb-0 space-y-6">
          {addresses.length === 0 ? (
            <div className="p-10 text-center border-[1px] border-[#EFEFEF] bg-white rounded-2xl">
              <p className="text-gray-500">No saved address yet.</p>
            </div>
          ) : (
            enrichedAddresses.map((addr) => (
              <div
                key={addr.Id}
                className="border-[1px] border-[#EFEFEF] bg-white rounded-2xl overflow-hidden"
              >
                <ProfileAddress
                  addressData={[addr]}
                  direction={direction}
                  language={language}
                  personId={personId}
                  FormHandler={() => openEditForm(addr)}
                  setIsEdit={setIsEditMode}
                  RemoveAddressHandler={(encryptedId) => handleDelete(encryptedId)}
                  addressHandler={() => {}}
                  delet={false}
                  setDelete={() => {}}
                  defaultValues={addr}
                />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add/Edit Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">
                {isEditMode ? "Edit Address" : "Add New Address"}
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={formData.Name}
                    onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    placeholder="Full name"
                  />
                  {formErrors.Name && (
                    <p className="text-xs text-red-500 mt-1 font-semibold">{formErrors.Name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={formData.PhoneNumber}
                    onChange={(e) => setFormData({ ...formData, PhoneNumber: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    placeholder="10-digit mobile number"
                  />
                  {formErrors.PhoneNumber && (
                    <p className="text-xs text-red-500 mt-1 font-semibold">{formErrors.PhoneNumber}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address Type <span className="text-red-500">*</span></label>
                  <select
                    value={formData.AddressType}
                    onChange={(e) => setFormData({ ...formData, AddressType: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Select type</option>
                    <option value="Home">Home</option>
                    <option value="Work">Work</option>
                    <option value="Other">Other</option>
                  </select>
                  {formErrors.AddressType && (
                    <p className="text-xs text-red-500 mt-1 font-semibold">{formErrors.AddressType}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1 <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={formData.AddressLine1}
                    onChange={(e) => setFormData({ ...formData, AddressLine1: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    placeholder="House no., building, street"
                  />
                  {formErrors.AddressLine1 && (
                    <p className="text-xs text-red-500 mt-1 font-semibold">{formErrors.AddressLine1}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2 (Optional)</label>
                  <input
                    type="text"
                    value={formData.AddressLine2}
                    onChange={(e) => setFormData({ ...formData, AddressLine2: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    placeholder="Apartment, floor, landmark"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State <span className="text-red-500">*</span></label>
                  <select
                    value={formData.State}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData({ ...formData, State: value, City: "" });
                      if (value) loadCities(value);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Select State</option>
                    {stateList.map((s) => (
                      <option key={s.Id} value={s.Name}>
                        {s.Name}
                      </option>
                    ))}
                  </select>
                  {formErrors.State && (
                    <p className="text-xs text-red-500 mt-1 font-semibold">{formErrors.State}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City <span className="text-red-500">*</span></label>
                  <select
                    value={formData.City}
                    onChange={(e) => setFormData({ ...formData, City: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    disabled={!formData.State}
                  >
                    <option value="">Select City</option>
                    {cityList.map((c) => (
                      <option key={c.Id} value={c.Name}>
                        {c.Name}
                      </option>
                    ))}
                  </select>
                  {formErrors.City && (
                    <p className="text-xs text-red-500 mt-1 font-semibold">{formErrors.City}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pincode <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={formData.Pincode}
                    onChange={(e) => setFormData({ ...formData, Pincode: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    placeholder="6-digit pincode"
                  />
                  {formErrors.Pincode && (
                    <p className="text-xs text-red-500 mt-1 font-semibold">{formErrors.Pincode}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    value={formData.Country}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t flex justify-end gap-4">
              <button
                onClick={closeForm}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAddress}
                className="px-6 py-2 bg-[#EA002A] text-white rounded-lg hover:bg-red-700"
              >
                {isEditMode ? "Update Address" : "Save Address"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SavedAddress;