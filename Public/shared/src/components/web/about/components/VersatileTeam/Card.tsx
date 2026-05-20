import "./style/style.css";
import Image from "next/image";

const Card = (props: any) => {
    return (
        <>
            <div className="relative mx-4 Card  w-[325px] md:w-[391px] overflow-hidden rounded-2xl">
                <Image
                    className="w-full rounded-[16px] "
                    src={props.image}
                    alt="404"
                    width={1000}
                    height={1000}
                />

                <div className="w-full container flex h-full hover:top-0 hover:rounded-2xl absolute left-0 xl:top-[400px] lg:top-[300px] md:top-[190px] top-[370px] rounded-b-[16px] transition-all duration-[1s]">
                    <div className="content-box px-[16px] py-[16px] flex flex-col gap-2 relative top-0 duration-[1s] transform transition-transform hover:translate-y-[-40px]">
                        <div className=" Name text-[#FFFFFF] text-[22px] md:text-[26px] leading-7 font-normal flex flex-col gap-1">
                            <h2>{props.name}</h2>
                        </div>
                        <div className="role text-[#EA002A] text-[14px] md:text-[16px] leading-7">
                            <h3>{props.role}</h3>
                        </div>
                        <div className="about font-normal text-[#FFFFFF] text-[12px] leading-[22px] text-justify">
                            <p>{props.about}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Card;