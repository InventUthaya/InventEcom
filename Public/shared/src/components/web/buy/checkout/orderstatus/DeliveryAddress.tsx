
type DeliveryAddressProps = {
  orderList: any,
}

export default function DeliveryAddress({ orderList }: DeliveryAddressProps) {
  return (
    <div className="flex flex-col gap-1 lg:gap-2 p-2 lg:py-3 lg:px-5">
      <div className="flex items-center justify-between text-[#9E9E9E] font-semibold text-sm lg:text-base">
        <div>DELIVERY DETAILS</div>
        {/* {orderList?.OBDAvailability === true && (
          <div className="relative group">
            <div className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full border border-green-300 shadow-md cursor-pointer inline-flex items-center">
              OBD Avaliable
            </div>
            <div className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-gray-100 text-gray-800 text-xs font-medium px-3 py-1 rounded shadow-lg z-10 w-max">
              Open Box Delivery
            </div>
          </div>
        )} */}
      </div>
      <div className="flex gap-2 font-semibold  text-sm lg:text-base">
        <span>{orderList?.FullName}</span>
        <span>|</span>
        <span>{orderList?.PhoneNumber}</span>
      </div>
      <div className="font-medium text-sm lg:text-base">
        {orderList?.Address1 && <p>{orderList?.Address1},</p>}
        {orderList?.Address2 && <p>{orderList?.Address2},</p>}
        {orderList?.Title ? <>{orderList?.Title},<br /></> : ""}
        {orderList?.City && <>{orderList?.City}&nbsp;</>}
        {orderList?.ZipPostalCode && - (orderList?.ZipPostalCode)}.
      </div>
    </div>
  );
}

