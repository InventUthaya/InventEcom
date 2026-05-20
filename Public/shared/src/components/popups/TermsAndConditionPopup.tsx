import React from 'react'
import { termsContents } from 'shared/src/Languages/FAQ_TermsContent';
import { Direction, getUserLanguage } from '../helper/Helper';

type props = {
    setIsTerms: any,
    isTerms: any,
    setIsSelected: any,
    isSelected: any
}

function TermsAndConditionPopup({ setIsTerms, isTerms, setIsSelected, isSelected }: props) {
    const content = termsContents[getUserLanguage() as "in_en"];

    function markup(descVal: any) {
        return { __html: descVal.desc };
    }

    return (
        <div id="terms-default-modal" className="fixed inset-0 z-[100] flex justify-center items-center w-full h-full" dir={Direction()}>
            <div className="relative p-3 w-full max-w-2xl max-h-full">
                <div className="relative bg-white rounded-lg shadow">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                        <h3 className="text-xl font-semibold text-gray-900">
                            {content[0].title}
                        </h3>
                        <button onClick={() => setIsTerms(!isTerms)} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center" data-modal-hide="default-modal">
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <div className="p-4 md:p-5 space-y-4 h-80 overflow-y-scroll">
                        {content.slice(1).map((val: any, i: any) => (
                            <div className="" key={i}>
                                <h2 className="text-xl mt-2">{val.title}</h2>
                                {val.description.map((descVal: any, descI: any) => (
                                    <React.Fragment key={descI}>
                                        <div key={descI} className="text-base mt-2" dangerouslySetInnerHTML={markup(descVal)}></div>
                                        <div className="text-base mt-2">{descVal.point}</div>
                                    </React.Fragment>
                                ))}
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b bg-white">
                        <button onClick={() => {
                            setIsTerms(!isTerms); setIsSelected(true);
                            setTimeout(() => {
                                let ele = document.getElementById("check-box");
                                ele?.scrollIntoView({ behavior: "smooth" });
                            }, 400);
                        }} data-modal-hide="default-modal" type="button" className="text-white bg-[#EA002A] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">I accept</button>
                        <button onClick={() => {
                            setIsTerms(!isTerms); setIsSelected(false);
                            setTimeout(() => {
                                let ele = document.getElementById("check-box");
                                ele?.scrollIntoView({ behavior: "smooth" });
                            }, 400);
                        }} data-modal-hide="default-modal" type="button" className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 focus:z-10 focus:ring-4 focus:ring-gray-100">Decline</button>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default TermsAndConditionPopup