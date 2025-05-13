import { IFilter } from './Common'

export interface IInventory {
    id: number
    assigneeName?: string
    assigneeId?: string
    assigneeAvatarPath?: string
    itemCount: number
    assigneePhone: string
    notes: string
    lastStockUpdate: string
}

export interface IInventoryDetail extends IInventory {
    assigneeEmail: string
    itemList: IInventoryItemList[]
}

export interface IInventoryItemList {
    id: number
    categoryName: string
    productName: string
    productUnit: string
    systemQuantity: number
    notes?: string
    productImage: string
    realQuantity?: number
    stockDifference?: number
    sku?: string
    stockStatus: 'inStock' | 'outOfStock' | 'lowStock'
}

export interface IInventoryCreate {}

export interface IInventoryUpdate {}

export interface IInventoryFilter extends IFilter {
    fromDate?: string
    toDate?: string
    status?: string
    categoryId?: number
}
