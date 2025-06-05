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
    productName: string
    description?: string
    categoryId: number
    supplierId: number
    price: number
    discountPrice: number
    unit?: string
    warrantyPeriod?: number
    stockQuantity?: number
    serialNumber: string
    minStockThreshold: number
    brand?: string
    sku?: string
    weight?: number
    length?: number
    width?: number
    height?: number
    seoTitle?: string
    seoDescription?: string
    seoKeywords?: string
    detailDescription?: string

    features: ProductFeature[]
    images: ProductImage[]
    variants: ProductVariantWithOptions[]
}

export interface ProductFeature {
    id: number
}

export interface ProductImage {
    url: string
    name: string
    isPrimary: boolean
}

export interface ProductVariantWithOptions {
    name: string
    options: VariantOptionWithValues[]
    combinations: VariantCombinationWithDetails[]
}

export interface VariantOptionWithValues {
    id: number
    isHasImage: boolean
    optionName: string
    values: VariantOptionDetail[]
}

export interface VariantOptionDetail {
    id: number
    value: string
    image?: string
}

export interface VariantCombinationWithDetails {
    sku: string
    price: number
    comparePrice: number
    inventory: number
    weight: number
    combinationDetails: CombinationDetail[]
}

export interface CombinationDetail {
    optionName: string
    optionValue: string
}

export interface IProductShort {
    id: number
    image?: string
    productName: string
    sku: string
    variants: string
    price: number
    discountPrice: number
    discountRate: number
    quantity: number
}

export interface IProductUpdate extends IProductCreate {}

export interface IProductGetById extends IProductUpdate {
    id: number
    reviewCount: number
    discountRate?: number
    soldCount: number
    favoriteCount: number
    saveAmount: number
    rating: number
    isActive: boolean
}

export interface IProductSearch {
    id: number
    productName: string
    brand: string
    price: number
    discountPrice: number
    discountRate: number
    stockQuantity: number
    soldCount: number
    rating: number
    image?: string
}

export interface IProductFilter extends IFilter {
    typeSection?: string
    keyword?: string
    categoryIds?: number[]
    brands?: string[]
    stockStatus?: string
    priceRange?: string
    featureIds?: number[]
}
