import { IFilter } from './Common'

export interface IFavorite {
    id: number
    productId: number
    quantity: number
    isNotify: boolean
    expectedPrice?: number
}

export interface IFavoriteCreate {
    productId: number
    quantity: number
    isNotify: boolean
    expectedPrice?: number
}

export interface IFavoriteUpdate extends IFavoriteCreate {
    id: number
}

export interface IFavoriteFilter extends IFilter {}
