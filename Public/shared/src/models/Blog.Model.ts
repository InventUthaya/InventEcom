export interface IBlogModel {
    Id: Number,
    Name: string,
    TitleOfThePage: string,
    EditionDate: any,
    ImagePath: string,
    ImageAltName: string,
    ImageTitleName: string,
    DownloadPath: string,
    ShortDescription: string,
    ContentDetails: string,
    LinkedInPath: string,
    XPath: string,
    FacebookPath: string,
    Question: string,
    Answer: string,
    IsPublish: 0,
    DisplayInList: string,
    Active: boolean,
    RowOrder: Number,
    Created: any,
    CreatedBy: number,
    Modified: any,
    ModifiedBy: number,
    TotalRowsCount: number,
    StatusName : string,
    StatusId : number;
    BlogFAQ: IBlogFAQModel[];
    URLTitle:any,
    SchemaContent:any,
}

export interface IBlogModel {
    OffsetStart: number;
    RowsPerPage: number;
    SortOrder: string;
    SortOrderColumn: string;
    SearchText: any;
    CreatedStartDate: any;
    CreatedEndDate: any,
    StatusId : number,
    Ispublic : boolean
}

export interface IBlogFAQModel {
    Id: Number,
    Question: string,
    Answer: string,
    DisplayInList: string,
    Active: boolean,
    RowOrder: Number,
    Created: any,
    CreatedBy: number,
    Modified: any,
    ModifiedBy: number,
}