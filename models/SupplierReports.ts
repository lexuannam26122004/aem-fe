import { IFilter } from './Common'

export interface ISupplierReportFilter extends IFilter {
    fromDate: string
    toDate: string
}

export interface ITopPurchasesProducts {
    id: number
    serialNumber: string
    images: string[]
    description: string
    productName: string
    warrantyPeriod: number
    stockQuantity: number
    purchasedCount: number
    minStockThreshold: number
    rating: number
    warrantyCount: number
    warrantyRate: number
}

export interface ISupplierReports {
    avatarPath: string
    supplierName: string
    supplierPhone: string
    totalImportValue: number
    importReceiptCount: number
    importedProductCount: number
    importedSKUCount: number
    averageUnitPrice: number
    lastImportDate: string
    importValueContributionRate: number
}
