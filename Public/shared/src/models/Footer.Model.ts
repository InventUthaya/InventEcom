export interface IFooterModel {
    QuickLinks: Array<BaseFooterModal>,
    Sitemap?: Array<BaseFooterModal>
    PopularCategories: Array<BaseFooterModal>
}

export interface BaseFooterModal{
    title: string,
    link: string
}
