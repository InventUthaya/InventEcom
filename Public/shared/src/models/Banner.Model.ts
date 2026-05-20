export interface IBannerItem {
    Id: number;
    BannerTypeId: number;
    BannerName: string | null;
    DisplayName: string | null;
    EnumName: string | null;
    Description: string | null;
    BannerImagePath: string | null;
    ImageAltName: string | null;
    ImageTitleName: string | null;
    FileName: string | null;
    OriginalFileName: string | null;
    IsPublished: boolean;
    Active: boolean;
    BannerTypeName: string | null;
  }
  
  export interface IBannerResponseData {
    [category: string]: IBannerItem[];
  }
  
  