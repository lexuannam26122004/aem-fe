import { IFilter } from './Common'

export interface ICart {
    id: number
    productId: number
    productName: string
    image: string
    favoriteId: number | null
    sku: string
    isFavorite: boolean
    originalPrice: number
    discountRate: number
    discountPrice: number
    isSelected: boolean
    variants: string
    quantity: number
    selections: ICartItem[]
}

export interface ICartCreate {
    productId: Number
    quantity: number
    selections: ICartItem[]
}

export interface ICartUpdateQuantity {
    id: number
    quantity: number
}

export interface ICartItem {
    optionId: number
    optionValueId: number
}

export interface ICartUpdate extends ICartCreate {
    id: number
}

export interface ICartFilter extends IFilter {}
