import Card from "./OrdersCard";
import { OrdersCardData } from "./OrdersData";

const Orders = () => {
  return (
    <div className="mt-[40px]">
      <header className="flex items-center justify-between">
        <h3 className="font-semibold tracking-[2px] text-sm lg:text-base leading-[14px]">
          MY ORDERS <span className="text-[#EA002A]">(4)</span>
        </h3>
        <p className="font-medium text-right text-[#EA002A] tracking-[2px]  text-sm lg:text-base leading-[14px]">
          View all
        </p>
      </header>
      <main className="mt-[18px] grid gap-5">
        {OrdersCardData.map((data) => {
          return <Card key={data.id} {...data} />;
        })}
      </main>
    </div>
  );
};

export default Orders;
