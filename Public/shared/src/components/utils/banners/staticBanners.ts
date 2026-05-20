import { IBannerResponseData } from "shared/src/models/Banner.Model";

export const staticHomepageBanners: IBannerResponseData = {
  HomepageBanner: [
    {
      Id: 1,
      BannerTypeId: 1,
      BannerName: "Home",
      DisplayName: "Premium Fashion Collections",
      EnumName: "HomepageBanner",
      Description: "Discover stylish clothing designed for comfort, quality, and everyday elegance.",
      BannerImagePath: "banner/home-default.png",
      ImageAltName: "Premium fashion clothing",
      ImageTitleName: "Premium fashion collections",
      FileName: "home-default.png",
      OriginalFileName: "home-default.png",
      IsPublished: true,
      Active: true,
      BannerTypeName: "Home",
    },
  ],
};

export const getStaticBanners = (): IBannerResponseData => staticHomepageBanners;
