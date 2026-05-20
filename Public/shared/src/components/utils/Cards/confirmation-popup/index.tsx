function ConfirmaitonPopup({
    handleClosePopup,
  }: {
    handleClosePopup: any;
  }) {
    return (
      <div className="fixed inset-0 flex items-center mt-10 justify-center z-50">
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm "></div>
        <div className="bg-white p-10 rounded-lg animate-slide-down z-10 relative">
          <div className="flex items-center justify-center text-center">
            <div className="rounded-full bg-[#e0f1e4] w-fit px-4 py-5 ">
              <div className="flex items-center justify-center">
                <svg
                  width="33"
                  height="24"
                  viewBox="0 0 33 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M30.4524 1.96484L10.9612 21.4561L2.10156 12.5964"
                    stroke="url(#paint0_linear_1595_4092)"
                    strokeWidth="3.89825"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_1595_4092"
                      x1="16"
                      y1="-7.5"
                      x2="14"
                      y2="35.5"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#22C446" />
                      <stop offset="1" stopColor="#18782D" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
            <div className="absolute left-0">
              <svg
                width="86"
                height="143"
                viewBox="0 0 86 143"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="-71.0276"
                  cy="-13.9626"
                  r="155.718"
                  transform="rotate(30.918 -71.0276 -13.9626)"
                  stroke="url(#paint0_linear_1595_4086)"
                  stroke-width="2"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_1595_4086"
                    x1="-188.248"
                    y1="-115.893"
                    x2="-103.519"
                    y2="136.899"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#249B3E" />
                    <stop
                      offset="0.936081"
                      stop-color="#249B3E"
                      stop-opacity="0"
                    />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="absolute right-0 top-14">
              <svg
                width="29"
                height="191"
                viewBox="0 0 29 191"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="95.217"
                  cy="95.2732"
                  r="94.1777"
                  transform="rotate(38.0927 95.217 95.2732)"
                  stroke="url(#paint0_linear_1595_4085)"
                  stroke-width="2"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_1595_4085"
                    x1="24.0271"
                    y1="33.3689"
                    x2="75.4844"
                    y2="186.894"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#249B3E" />
                    <stop
                      offset="0.936081"
                      stop-color="#249B3E"
                      stop-opacity="0"
                    />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
          <div className="flex flex-col items-center mt-5 py-4">
            <p className="text-[#000000] text-2xl font-semibold">
              Thanks For Your Interest!
            </p>
            <p className="font-normal py-2">
              We got your response, our team will get back to you shortly.
            </p>
            <button
              onClick={handleClosePopup}
              className="mt-4 px-40 py-4 bg-[#EA002A] text-white rounded-lg"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  export default ConfirmaitonPopup;
  