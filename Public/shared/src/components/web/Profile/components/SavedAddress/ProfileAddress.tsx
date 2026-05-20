import { SetStateAction, useEffect, useState } from "react";
import { DelectIcon, EditIcon } from "../../../buy/checkout/assets";
import { IAddressModel } from "shared/src/models/Address.Model";
import { getEncryptedPersonId, getLocalStorage } from "shared/src/components/helper/Helper";
import { useRecoilStateLoadable } from "recoil";
import { containerZindex } from "shared/src/recoil/styleState";
import DeleteConfirmation from "shared/src/components/utils/Cards/Delete-popup/DeleteConfirmation";
import TrackOrderService from "shared/src/services/TrackOrder.Service";

type AddressDataProps = {
  addressData: Array<IAddressModel>;
  direction: string;
  language: "in_en" | "ae_en" | "ae_ar";
  FormHandler: () => void;
  setIsEdit: SetStateAction<any>;
  RemoveAddressHandler: (id: any) => void;
  addressHandler: (addressId: any, type: "view" | "edit") => void;
  setDelete: SetStateAction<any>;
  delet: boolean;
  personId: any;
  defaultValues: IAddressModel;
};

const ProfileAddress = ({
  addressData,
  direction,
  language,
  personId,
  FormHandler,
  setIsEdit,
  RemoveAddressHandler,
  addressHandler,
  delet,
  setDelete,
  defaultValues,
}: AddressDataProps) => {
  const [_, setZindex] = useRecoilStateLoadable(containerZindex);
  const [addressId, setAddressId] = useState<string | number>(0);
  const [billingAddressIds, setBillingAddressIds] = useState<string[]>([]);
  const [isOrder, setIsOrder] = useState<boolean>(false);

  const personIds = getLocalStorage()?.PersonId;

  const DeleteHandler = (EncryptedAddressId?: string | number) => {
    if (EncryptedAddressId && billingAddressIds.includes(EncryptedAddressId as string)) {
      setIsOrder(true);
    }

    if (EncryptedAddressId) {
      setAddressId(EncryptedAddressId);
    }

    if (!delet) {
      setZindex("z-50");
    } else {
      setZindex("z-10");
      setIsOrder(false);
    }

    setDelete((prev: boolean) => !prev);
  };

  const EditHandler = (EncryptedAddressId: string | number) => {
    addressHandler(EncryptedAddressId, "edit");
    FormHandler();
    setIsEdit(true);
  };

  useEffect(() => {
    if (!personIds) return;

    const userId = getLocalStorage()?.PersonId;
    TrackOrderService.GetOrderByCustomerId(userId, "All")
      .then((res) => {
        if (res.status === 200 && res.data?.Items) {
          const ids = res.data.Items.map(
            (order: { EncryptedBillingAddressId: string }) => order.EncryptedBillingAddressId
          ).filter(Boolean);
          setBillingAddressIds(ids);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch orders for billing check:", err);
      });
  }, [personIds]);

  return (
    <>
      {addressData
        ?.sort((a, b) => b.Id - a.Id)
        .map((item, index) => (
          <label
            dir={direction}
            className={`flex justify-between p-5 items-start w-full cursor-pointer ${
              index !== addressData.length - 1 ? "border-b border-[#EBEBEB]" : ""
            }`}
            key={item.Id || index}
          >
            <div className="flex flex-col gap-1 w-full">
              <div className="flex justify-start items-center">
                <div className="flex justify-start gap-2 items-center px-2 font-semibold">
                  <span className="text-sm 2xl:text-md">
                    {item.FullName || "Home"} {/* Fallback if FullName missing */}
                  </span>
                  <span>|</span>
                  <span className="text-sm 2xl:text-md">
                    {item.PhoneNumber ? `+91 ${item.PhoneNumber}` : ""}
                  </span>
                </div>
              </div>

              <div className="pl-2 pr-1 lg:w-3/4 text-sm 2xl:text-md">
                <span>
                  {item.AddressLine1 && <>{item.AddressLine1}, </>}
                  {item.AddressLine2 && <>{item.AddressLine2}, </>}
                </span>
                <br />
                {item.City && <>{item.City}, </>}
                {item.State && <>{item.State} </>}
                {item.Pincode && <> - {item.Pincode}</>}
                {item.Country && <>, {item.Country}</>}
              </div>

              {/* Default Address Badge */}
              {item.isDefault === 1 && (
                <div className="pl-2 mt-2">
                  <span className="text-xs bg-[#EA002A] text-white px-3 py-1 rounded-full">
                    Default Address
                  </span>
                </div>
              )}
            </div>

            <div className="flex justify-start gap-2 items-center px-2">
              <div
                className="cursor-pointer"
                onClick={() => EditHandler(item.EncryptedAddressId || item.Id)}
              >
                <EditIcon />
              </div>
              <span className="text-[#D9D9D9]">|</span>
              <div
                className="cursor-pointer"
                onClick={() => DeleteHandler(item.EncryptedAddressId || item.Id)}
              >
                <DelectIcon />
              </div>
            </div>
          </label>
        ))}

      {delet && (
        <DeleteConfirmation
          handleDeleteCancel={DeleteHandler}
          handleDeleteConfirm={() => RemoveAddressHandler(addressId)}
          isOrder={isOrder}
        />
      )}
    </>
  );
};

export default ProfileAddress;