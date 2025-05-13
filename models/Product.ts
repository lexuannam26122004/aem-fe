import { IFilter } from './Common'

export interface IProduct {
    id: number
    serialNumber: string
    discountRate: number
    discountPrice: number
    price: number
    images: string[]
    description: string
    productName: string
    categoryName: string
    supplierName: string
    unit: string
    warrantyPeriod: number
    stockQuantity: number
    soldCount: number
    minStockThreshold: number
    rating: number
    createdAt: string
    createdBy: string
}

export interface IProductCreate {
    serialNumber: string
    discountRate: number
    images: string[]
    discountPrice: number
    price: number
    description: string
    productName: string
    categoryId: number
    supplierId: number
    unit: string
    warrantyPeriod: number
}

export interface IProductUpdate extends IProductCreate {
    stockQuantity: number
    soldCount: number
}

export interface IProductFilter extends IFilter {
    status?: string
    categoryId?: number
}
