import Contact from "shared/src/pages/Contact";

export default function index() {
    return (
        <Contact address={{
            Address: "",
            Email: "",
            Phone: "",
            Timing: "",
            PromotionLinks: {
                faceBook: "",
                instagram: "",
                linkedIn: "",
                tikTok: "",
                youTube: "",
                Twitter: ""
            }
        }} direction={""} language={"in_en"} metaTags={{} as any} isSSR={false}/>
    );
}
