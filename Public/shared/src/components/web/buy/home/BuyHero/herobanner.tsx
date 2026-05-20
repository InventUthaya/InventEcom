import ImageSlider from "./imageSlider";
import HomeCardSlider from "./homeCardSlider";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CategoryService from "shared/src/services/CategoryService";
import {
  MobileIcon,
  deskTopIcon,
  gamingConsoleIcon,
  laptopIcon,
  televisionIcon,
  watchIcon,
} from "../../assets/Devices";
import MasterServices from "shared/src/services/Master.Services";
import PriceService from "shared/src/services/Price.Service";
import { IBannerResponseData } from "shared/src/models/Banner.Model";


interface branddata {
  Id: number;
  BrandName: string;
  FormattedMediaFileName?: string;
}

export const Herobanner = ({ bannerResData }: { bannerResData?: IBannerResponseData }) => {
  const [category, setCategory] = useState<Array<any>>([]);
  const [brand, setBrand] = useState<branddata[]>([]);
  const [loading, setLoading] = useState(false);
  const [cardsPerView, setCardsPerView] = useState(2.15);
  const [priceList, setPriceList] = useState<Array<any>>([]);
  const [banner, setBanner] = useState<Array<any>>([]);

  useEffect(() => {
    const updateCardsPerView = () => {
      const width = window.innerWidth;
      if (width >= 1280) {
        setCardsPerView(4.15);
      } else if (width >= 1024) {
        setCardsPerView(3.15);
      } else if (width >= 768) {
        setCardsPerView(2.5);
      } else if (width >= 640) {
        setCardsPerView(2.15);
      } else {
        setCardsPerView(2);
      }
    };
    updateCardsPerView();
    window.addEventListener("resize", updateCardsPerView);
    return () => {
      window.removeEventListener("resize", updateCardsPerView);
    };
  }, []);

  const getLocalBrandImage = (brandName: string) => {
    const name = brandName.toUpperCase();
    const brandImageMap: Record<string, string> = {
      "ABBA": "/assets/BrandImages/ABBA.png",
      "ABRD": "/assets/BrandImages/ABRO.jpg",
      "AMAANDO": "/assets/BrandImages/AMAANDO.png",
      "APZ": "/assets/BrandImages/APZ.png",
      "ARGO": "/assets/BrandImages/ARGO.png",
      "ARP": "/assets/BrandImages/ARP.png",
      "ART BEARINGS": "/assets/BrandImages/ART.png",
      "ASAHI": "/assets/BrandImages/ASAHI.png",
      "ASTON SEALS": "/assets/BrandImages/ASTON.png",
      "BBC-R": "/assets/BrandImages/BBCR.png",
      "BEA": "/assets/BrandImages/BEA.jpg",
      "BECO": "/assets/BrandImages/BECO.png",
      "BECOOL": "/assets/BrandImages/BECOOL.jpg",
      "BELIEV": "/assets/BrandImages/BELIEF.png",
      "BMZ": "/assets/BrandImages/BMZ.png",
      "BONDLOC": "/assets/BrandImages/BONDLOC.png",
      "PERMATEX": "/assets/BrandImages/Permatex.jpg",
      "PODTRADE": "/assets/BrandImages/Podtrade.png",
      "BOSCH REXROTH": "/assets/BrandImages/REXROTH.png",
      "BS": "/assets/BrandImages/BS BEARING.jpg",
      "BSN": "/assets/BrandImages/BSN.png",
      "BW": "/assets/BrandImages/BW.png",
      "CAMOZZI": "/assets/BrandImages/CAMOZZI.png",
      "CHIARAVALLI": "/assets/BrandImages/CHIARAVALLI.png",
      "CHOHO": "/assets/BrandImages/CHOCHO.png",
      "CONTITECH": "/assets/BrandImages/CONTITECH.jpg",
      "COOPER": "/assets/BrandImages/COOPER.png",
      "COPELAND": "/assets/BrandImages/COPELAND.jpg",
      "CRAFT BEARINGS": "/assets/BrandImages/CRAFT BEARINGS.png",
      "CSB": "/assets/BrandImages/CSB.png",
      "CSHBELT": "/assets/BrandImages/CSHBELT.png",
      "CTE": "/assets/BrandImages/CTS.png",
      "CX": "/assets/BrandImages/CX.png",
      "CZH BEARING": "/assets/BrandImages/CZH.gif",
      "DESCH": "/assets/BrandImages/DESCH.png",
      "DETOOL": "/assets/BrandImages/DETOOL.png",
      "DICHTOMATIK": "/assets/BrandImages/DICHTOMATIK.png",
      "DINROLL": "/assets/BrandImages/DINROLL.png",
      "DONGHUA": "/assets/BrandImages/DONGHUA.png",
      "DPN": "/assets/BrandImages/DPN.png",
      "DURBAL": "/assets/BrandImages/DURBAL.png",
      "DXP": "/assets/BrandImages/DXP.png",
      "DYZ": "/assets/BrandImages/DYZ.png",
      "EDGE": "/assets/BrandImages/EDGE.png",
      "ELATECH": "/assets/BrandImages/ELATECH.png",
      "EWELLIX": "/assets/BrandImages/EWELLIX.png",
      "EZO": "/assets/BrandImages/EZO.png",
      "FAG": "/assets/BrandImages/FAG.png",
      "FBC": "/assets/BrandImages/FBC.png",
      "FBJ": "/assets/BrandImages/FBJ.png",
      "FEIKEN": "/assets/BrandImages/FEKEN.png",
      "FENNER": "/assets/BrandImages/FENNER.png",
      "FERSA": "/assets/BrandImages/FERSA.png",
      "FHY": "/assets/BrandImages/FHY.png",
      "FK": "/assets/BrandImages/FK.png",
      "FKD": "/assets/BrandImages/FKD.png",
      "FKL": "/assets/BrandImages/FKL.png",
      "FLI": "/assets/BrandImages/FLI.png",
      "FLT": "/assets/BrandImages/FLT.png",
      "FLURO": "/assets/BrandImages/FLURO.png",
      "FREUDENBERG": "/assets/BrandImages/FREUDENBERG.png",
      "FUJI": "/assets/BrandImages/FUJI.png",
      "FYH": "/assets/BrandImages/FYH.png",
      "GATES": "/assets/BrandImages/GATES.png",
      "GAZPROMNEFT": "/assets/BrandImages/GAZPROMNEFT.png",
      "GRANIT": "/assets/BrandImages/GAZPROMNEFT.png",
      "GMB": "/assets/BrandImages/GMB.png",
      "GMN": "/assets/BrandImages/GMN.png",
      "HENKEL": "/assets/BrandImages/HENKEL.png",
      "HIMPT": "/assets/BrandImages/HIMPT.png",
      "HITACHI": "/assets/BrandImages/HITACHI.png",
      "HIWIN": "/assets/BrandImages/HIWIN.png",
      "HOFFMANN BEARINGS": "/assets/BrandImages/HOFFMANN BEARINGS.png",
      "HYMA": "/assets/BrandImages/HYMA.png",
      "IBB": "/assets/BrandImages/IBB.png",
      "EFELE": "/assets/BrandImages/IEFELE.png",
      "IGUS": "/assets/BrandImages/IGUS.png",
      "IJK": "/assets/BrandImages/IJK.png",
      "IKO": "/assets/BrandImages/IKO.png",
      "ILJIN": "/assets/BrandImages/ILJIN.png",
      "INA": "/assets/BrandImages/INA.png",
      "ISB": "/assets/BrandImages/ISB.png",
      "ISKRA": "/assets/BrandImages/ISKRA.png",
      "ITJ BEARINGS": "/assets/BrandImages/ITJ BEARINGS.png",
      "ITN BEARINGS": "/assets/BrandImages/ITN BEARING.png",
      "JED": "/assets/BrandImages/JED BEARINGS.png",
      "JIPE": "/assets/BrandImages/JIPE.png",
      "JNS": "/assets/BrandImages/JNS.png",
      "JVB": "/assets/BrandImages/JVB.png",
      "JTEKT KOYO": "/assets/BrandImages/JTEKT.png",
      "KBS LLC": "/assets/BrandImages/KBS LLC.png",
      "KG": "/assets/BrandImages/KG.png",
      "KMR": "/assets/BrandImages/KMR.png",
      "KOFK": "/assets/BrandImages/KOFK.png",
      "KSM": "/assets/BrandImages/KSM.png",
      "LDI": "/assets/BrandImages/LDI.png",
      "LDK BEARINGS": "/assets/BrandImages/LDK BEARINGS.png",
      "LFD": "/assets/BrandImages/LFD.png",
      "LINK-BELT": "/assets/BrandImages/LINK-BELT.png",
      "LK": "/assets/BrandImages/LK.png",
      "LOCTITE": "/assets/BrandImages/LOCTITE.png",
      "LOXEAL": "/assets/BrandImages/LOXEAL.jpg",
      "LPZ": "/assets/BrandImages/LPZ.png",
      "LS": "/assets/BrandImages/LS.png",
      "LYC": "/assets/BrandImages/LYC.png",
      "MANEUROP": "/assets/BrandImages/MANEUROP.jpg",
      "MANNOL": "/assets/BrandImages/MANNOL.png",
      "MAXCUT": "/assets/BrandImages/MAXCUT.png",
      "MAYR": "/assets/BrandImages/MAYR.png",
      "MBY": "/assets/BrandImages/MBY.png",
      "MK": "/assets/BrandImages/MK.png",
      "MOBIL": "/assets/BrandImages/MOBIL.png",
      "MOL": "/assets/BrandImages/MOL.jpg",
      "MOLYKOTE": "/assets/BrandImages/MOLYKOTE.png",
      "MPZ": "/assets/BrandImages/MPZ.png",
      "MRC": "/assets/BrandImages/MRC.png",
      "MTM BEARINGS": "/assets/BrandImages/MTM BEARINGS.png",
      "NACHI": "/assets/BrandImages/NACHI.png",
      "NADELLA": "/assets/BrandImages/NADELLA.png",
      "NAK": "/assets/BrandImages/NAK.png",
      "NANO": "/assets/BrandImages/NANO.png",
      "NANO GREASE": "/assets/BrandImages/NANO.png",
      "NB": "/assets/BrandImages/NB.png",
      "NBS": "/assets/BrandImages/NBS.png",
      "NECTECH": "/assets/BrandImages/NECTECH.png",
      "NEUTRAL": "/assets/BrandImages/NEUTRAL.png",
      "NIS RHINO": "/assets/BrandImages/NIS RHINO.png",
      "NIS": "/assets/BrandImages/NIS.jpg",
      "NITEK": "/assets/BrandImages/NITEK.png",
      "NKE BEARINGS": "/assets/BrandImages/NKE BEARINGS.png",
      "NKE": "/assets/BrandImages/NKE.png",
      "NMB": "/assets/BrandImages/NMB.png",
      "NOK": "/assets/BrandImages/NOK.png",
      "NORD": "/assets/BrandImages/NORD.png",
      "NPZ": "/assets/BrandImages/NPZ.png",
      "NSK": "/assets/BrandImages/NSK.png",
      "NTE": "/assets/BrandImages/NTE.png",
      "NTL": "/assets/BrandImages/NTL.png",
      "NTN": "/assets/BrandImages/NTN.png",
      "NXZ": "/assets/BrandImages/NXZ.png",
      "OID": "/assets/BrandImages/OID.png",
      "OILRIGHT": "/assets/BrandImages/OILRIGHT.png",
      "OPTIBELT": "/assets/BrandImages/OPTIBELT.png",
      "PATRIOT": "/assets/BrandImages/PATRIOT.jpg",
      "PEER BEARING": "/assets/BrandImages/PEER BEARING.png",
      "PETROPUMP": "/assets/BrandImages/PETROPUMP.jpg",
      "PIJ": "/assets/BrandImages/PIJ.png",
      "PIZZIRANI": "/assets/BrandImages/PIZZIRANI.png",
      "PMI": "/assets/BrandImages/PMI.png",
      "PODTRADE NEUTRAL": "/assets/BrandImages/PODTRADE NEUTRAL.png",
      "POWER STEER": "/assets/BrandImages/POWER STEER.jpg",
      "PTI": "/assets/BrandImages/PTI.png",
      "QIBR BEARINGS": "/assets/BrandImages/QIBR BEARINGS.png",
      "RDC": "/assets/BrandImages/RDC.png",
      "REGINA": "/assets/BrandImages/REGINA.png",
      "RENOLD": "/assets/BrandImages/RENOLD.png",
      "RGZ": "/assets/BrandImages/RGZ.png",
      "RHP": "/assets/BrandImages/RHP.png",
      "RINGSPANN": "/assets/BrandImages/RINGSPANN.png",
      "ROCKFORCE": "/assets/BrandImages/ROCKFORCE.png",
      "ROLLON": "/assets/BrandImages/ROLLON.png",
      "ROSLOCK": "/assets/BrandImages/ROSLOCK.png",
      "ROSPOD": "/assets/BrandImages/ROSPOD.jpg",
      "RUBENA": "/assets/BrandImages/RUBENA.jpg",
      "SAMICK": "/assets/BrandImages/SAMICK.jpg",
      "SANLUX": "/assets/BrandImages/SANLUX.jpg",
      "SATI": "/assets/BrandImages/SATI.png",
      "SBC": "/assets/BrandImages/SBC.png",
      "SCHAEFFLER FAG": "/assets/BrandImages/SCHAEFFLER FAG.png",
      "SCHNEEBERGER": "/assets/BrandImages/SCHNEEBERGER.png",
      "SECOP": "/assets/BrandImages/SECOP.png",
      "SIT": "/assets/BrandImages/SIT.png",
      "SKF": "/assets/BrandImages/SKF.png",
      "SLC": "/assets/BrandImages/SLC.png",
      "SLZ": "/assets/BrandImages/SLZ.jpg",
      "SMAZKA RU": "/assets/BrandImages/SMAZKA RU.png",
      "SMB BEARINGS": "/assets/BrandImages/SMB BEARINGS.png",
      "SNB LINEAR": "/assets/BrandImages/SNB LINEAR.png",
      "SNR": "/assets/BrandImages/SNR.png",
      "SPANTA": "/assets/BrandImages/SPARTA.png",
      "STAF": "/assets/BrandImages/STAF.png",
      "STANLEY FATMAX": "/assets/BrandImages/STANLEY FATMAX.png",
      "KURSK BEARING COMPANY": "/assets/BrandImages/KURSK BEARING COMPANY.jpg",
      "STC": "/assets/BrandImages/STC.png",
      "SXM": "/assets/BrandImages/SXM.png",
      "SYBR": "/assets/BrandImages/SYBR.png",
      "TBI": "/assets/BrandImages/TBI.png",
      "TECMIX": "/assets/BrandImages/TECHNIX.png",
      "TEROSON": "/assets/BrandImages/TEROSON.png",
      "TFN": "/assets/BrandImages/TFN.png",
      "THK": "/assets/BrandImages/THK.png",
      "TIMKEN": "/assets/BrandImages/TIMKEN.png",
      "TOPTUL": "/assets/BrandImages/TOPTUL.png",
      "TORQUE": "/assets/BrandImages/TORQUE.png",
      "TSUBAKI": "/assets/BrandImages/TSUBAKI.png",
      "UBC": "/assets/BrandImages/UBC.png",
    };
    return brandImageMap[name] || null;
  };

  const mediaUrlPrefix = process.env.NEXT_PUBLIC_MEDIA_URL || "";

  const categoryImages: string[] = category
    .map((item: any) => {
      const formattedMediaFileName = item.FormattedMediaFileName || "";
      if (!formattedMediaFileName) return null;
      return encodeURI(`${mediaUrlPrefix}${formattedMediaFileName.split(",")[0].trim()}`);
    })
    .filter(Boolean) as string[];

  const getCategory = () => {
    CategoryService.getCategoryList()
      .then((res: any) => {
        if (res.status === 200) {
          setCategory(res.data || []);
          setLoading(false);
        }
      })
      .catch((e: string) => {
        console.log(e);
      });
  };

  const getPriceList = () => {
    PriceService.getShopByPrice()
      .then((res: any) => {
        if (res.status === 200) {
          setPriceList(res.data);
          setLoading(false);
        }
      })
      .catch((e: string) => {
        console.log(e);
      });
  };

  const getBrandName = () => {
    PriceService.getBrandName()
      .then((res: any) => {
        if (res.status === 200) {
          setBrand(res.data);
          setLoading(false);
        }
      })
      .catch((e: string) => {
        console.log(e);
      });
  };

  const GetBannerList = () => {
    MasterServices.GetBannerList()
      .then((res: any) => {
        if (res.status === 200) {
          setBanner(res.data.Items);
          setLoading(false);
        }
      })
      .catch((e: string) => {
        console.log(e);
      });
  };

  useEffect(() => {
    setLoading(true);
    getCategory();
    getBrandName();
    getPriceList();
    // GetBannerList();
  }, []);

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 md:gap-6 lg:gap-8 mt-3 lg:mt-5 px-4 sm:px-6 md:px-8 lg:px-0 w-full">
        <div className="w-full lg:w-[45%] h-48 sm:h-56 md:h-64 lg:h-auto relative">
          <ImageSlider bannerResData={bannerResData} />
        </div>
        <div className="w-full lg:w-[55%] flex flex-col gap-4 sm:gap-5 md:gap-6 lg:gap-8">
          <div className="bg-[#FFFFFF] px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-5 md:py-6 rounded-xl border border-[#EFEFEF88] shadow-sm">
            <HomeCardSlider title="Shop by Brand" cardsPerView={cardsPerView}>
              {brand.map((card: any, index: number) => {
                const brandImage = card.FormattedMediaFileName
                  ? encodeURI(`${mediaUrlPrefix}${card.FormattedMediaFileName.split(',')[0].trim()}`)
                  : getLocalBrandImage(card.BrandName);
                return (
                  <CardHomeBrand
                    id={card.Id}
                    key={index}
                    text={card.BrandName}
                    img={brandImage}
                    width={100 / cardsPerView}
                  />
                );
              })}
            </HomeCardSlider>
          </div>
        </div>
      </div>
    </>
  );
};

// Card Components remain unchanged
const CardHomeDevices = (props: any) => {
  const navigate = useRouter();
  return (
    <div
      className="snap-start flex flex-row items-center gap-1 rounded-lg border border-[#EFEFEF] py-2 sm:py-3 px-3 sm:px-4 cursor-pointer hover:bg-[#F9FAFA] hover:shadow-md transition-all duration-200"
      onClick={() => navigate.push(`/buy/${props.id}_Category`)}
    >
      {props.img && (
        <div className="w-10 h-6 sm:w-12 sm:h-8 md:w-12 md:h-10">
          {(Array.isArray(props.img) ? props.img : [props.img]).map((src: string, index: number) => (
            <img
              key={index}
              src={src}
              alt={`Brand ${index}`}
              className="max-w-full max-h-full object-contain"
            />
          ))}
        </div>
      )}
      <div className="text-xs sm:text-sm md:text-base font-medium text-[#050505] truncate">
        {props.text}
      </div>
    </div>
  );
};

const CardHomeBrand = (props: { img?: string | null; text: string; id: string; width: number }) => {
  const navigate = useRouter();
  return (
    <div
      className="snap-start flex flex-col items-center gap-2 sm:gap-3 rounded-lg border border-[#EFEFEF] py-3 sm:py-4 px-2 sm:px-3 cursor-pointer hover:bg-[#F9FAFA] hover:shadow-md transition-all duration-200"
      onClick={() => navigate.push(`/buy/brand?${props.text.toLowerCase()}`)}
    >
      {props.img ? (
        <div className="w-16 h-8 sm:w-20 sm:h-10 md:w-24 md:h-12 lg:w-28 lg:h-14 flex items-center justify-center shrink-0">
          <img
            src={props.img}
            alt={props.text}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      ) : (
        <div className="w-16 h-8 sm:w-20 sm:h-10 md:w-24 md:h-12 lg:w-28 lg:h-14 flex items-center justify-center shrink-0 bg-gray-100 rounded">
          <span className="text-gray-400 text-xs">No logo</span>
        </div>
      )}
      <div className="text-xs sm:text-sm md:text-base lg:text-lg text-center font-medium text-[#050505]">
        {props.text}
      </div>
    </div>
  );
};

const CardHomePrice = (props: any) => {
  const navigate = useRouter();
  return (
    <div
      className="snap-start flex flex-col items-center gap-2 sm:gap-3 rounded-lg border border-[#EFEFEF] py-3 sm:py-4 px-2 sm:px-3 cursor-pointer hover:bg-[#F9FAFA] hover:shadow-md transition-all duration-200"
      onClick={() => navigate.push(`/buy/${props.id}_Price`)}
    >
      <div className="text-xs sm:text-sm md:text-base lg:text-lg text-center font-medium text-[#050505]">
        {props.text}
      </div>
    </div>
  );
};