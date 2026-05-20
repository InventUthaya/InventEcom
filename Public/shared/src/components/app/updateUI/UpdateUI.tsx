import { AppUpdate } from '@capawesome/capacitor-app-update';
import Image from 'next/image';

type Props = {
    forcedUpdate: boolean;
    flexibleUpdate: boolean;
    noUpdate: any
}

function UpdateUI({ forcedUpdate, flexibleUpdate, noUpdate }: Props) {

    const routeRespectiveStore = () => {
        AppUpdate.openAppStore();
    }

    return (
        <div className="fixed flex flex-col gap-4 max-w-lg w-full h-full z-[999999999] bg-white">
            <div
                className={`max-w-lg w-full h-full bg-[#${forcedUpdate ? "fef4f3" : "f2f5fc"}] border border-[#F0F0F0] rounded-2xl 
        flex flex-col justify-between items-center relative overflow-hidden`}
            >
                <div className="py-16 flex flex-col gap-3 justify-center items-center">
                    <div className="text-4xl font-semibold">
                        {forcedUpdate ? "It's time to" : "Catch the"} <span className="text-[#EA002A]">update!</span>
                    </div>
                    {forcedUpdate ?
                        <div className="text-xl font-medium">
                            Please Update the app to continue.
                        </div>
                        :
                        <div className="text-xl font-medium">
                            Now, DOFY app is in its new avatar.
                        </div>
                    }
                </div>
                <Image
                    height={1000} width={1000}
                    src="/assets/images/banner/dofyimg.png"
                    alt="banner"
                    className="w-[80%] h-[80%] z-30 object-contain"
                />
                <div className="absolute top-[40%] right-0">
                    {forcedUpdate ? <ForcedRound />
                        :
                        <Round />
                    }
                </div>
                <div className="absolute top-[60%] left-0 rotate-180">
                    {forcedUpdate ? <ForcedRound />
                        :
                        <Round />
                    }
                </div>
            </div>
            <div className="bg-[#EA002A] text-white p-3 rounded-md text-center font-medium" onClick={() => routeRespectiveStore()}>Update Now</div>
            {!forcedUpdate &&
                <div className="p-3 rounded-md text-center font-medium border" onClick={() => noUpdate()}>Remind me Later</div>
            }
        </div>
    );
}

export default UpdateUI;

const ForcedRound = () => (
    <svg
        width="68"
        height="331"
        viewBox="0 0 48 231"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <circle
            cx="115.557"
            cy="115.495"
            r="113.708"
            transform="rotate(54.2025 115.557 115.495)"
            stroke="url(#paint0_linear_1608_35969)"
            strokeWidth="2"
        />
        <defs>
            <linearGradient
                id="paint0_linear_1608_35969"
                x1="29.7585"
                y1="40.8875"
                x2="101.195"
                y2="237.291"
                gradientUnits="userSpaceOnUse"
            >
                <stop stopColor="#EA002A" />
                <stop offset="1" stopColor="#EA002A" stopOpacity="0" />
            </linearGradient>
        </defs>
    </svg>
);

const Round = () => (
    <svg
        width="68"
        height="331"
        viewBox="0 0 48 231"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <circle
            cx="115.557"
            cy="115.495"
            r="113.708"
            transform="rotate(34.3195 115.557 115.495)"
            stroke="url(#paint0_linear_1608_22419)"
            strokeWidth="2"
        />
        <defs>
            <linearGradient
                id="paint0_linear_1608_22419"
                x1="29.7591"
                y1="40.8877"
                x2="101.195"
                y2="237.291"
                gradientUnits="userSpaceOnUse"
            >
                <stop stopColor="#1E54C9" />
                <stop offset="1" stopColor="#1E54C9" stopOpacity="0" />
            </linearGradient>
        </defs>
    </svg>
);