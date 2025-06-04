import { IFilter } from './Common'

export interface IFavorite {
    id: number
    productId: number
    productName: string
    image: string
    sku: string
    originalPrice: number
    discountRate: number
    discountPrice: number
    variants: string
    quantity: number
    isNotify: boolean
    expectedPrice?: number
    favoriteItems: IFavoriteItem[]
}

export interface IFavoriteCreate {
    productId: number
    isNotify: boolean
    favoriteItems: IFavoriteItem[]
    expectedPrice?: number
}

export interface IFavoriteItem {
    optionId: number
    optionValueId: number
}

export interface IFavoriteUpdate extends IFavoriteCreate {
    id: number
}

export interface IFavoriteExpectedPrice {
    id: number
    expectedPrice: number
}

export interface IFavoriteFilter extends IFilter {}
