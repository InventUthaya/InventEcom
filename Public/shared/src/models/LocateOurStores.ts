export interface ILocateOurStoresModel {
    CountryName: string;
    id: number,
    Pincode: number,
    Address: string,
    Contact1: number,
    Contact2:number,
    StateId: number,
    CityId: number,
    StateName:string,
    CityName:string,
    Area: string,
    Timing: string,
    Location: string,
    Image:string,
    created: any,
    createdBy: number,
    active: true,
    modified: any,
    modifiedBy: number,
}

export interface ILocateOurStoresModel{
    OffsetStart : number ;
    RowsPerPage: number;
    SortOrder : string ;
    SortOrderColumn: string ;
    SearchText: any;
 }  