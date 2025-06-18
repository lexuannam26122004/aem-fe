import { IFilter } from './Common'

export interface IInventoryProductGet {
    category: string
    productName: string
    image: string
    unit: string
    systemQuantity: number
    notes?: string
    productImage: string
    realQuantity?: number
    difference?: number
    sku?: string
    status: 'in_stock' | 'out_of_stock' | 'low_stock'
}

export interface IInventory {
    id: number
    inventoryDate: string // ISO date string
    notes?: string
    employeeAvatar?: string
    employeePhone: string
    employeeName: string
    employeeMail: string
    employeeId: string
    totalItems: number
}

export interface IInventoryDetail extends IInventory {
    products: IInventoryProductGet[]
}

export interface IInventoryItemList {
    id: number
    categoryName: string
    productName: string
    image: string
    productUnit: string
    systemQuantity: number
    notes?: string
    productImage: string
    realQuantity?: number
    stockDifference?: number
    sku?: string
    stockStatus: 'inStock' | 'outOfStock' | 'lowStock'
}

export interface IInventoryProductCreate {
    productId: number
    systemQuantity: number
    realQuantity: number
    notes?: string
}

export interface IInventoryCreate {
    notes?: string
    inventoryDate: string
    products: IInventoryProductCreate[]
}

export interface IInventoryUpdate {}

export interface IInventoryProductFilter {
    keyword?: string
    categoryId?: number
    page?: number
    pageSize?: number
}

export interface IInventoryFilter {
    keyword?: string
    fromDate?: string // ISO string: "2025-06-16"
    toDate?: string
    page?: number
    pageSize?: number
}
