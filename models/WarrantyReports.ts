import { IFilter } from './Common'

export interface IWarrantyReportFilter extends IFilter {
    fromDate: string
    toDate: string
    type?: string
    status?: string
}

export interface IWarrantyTopProducts {
    id: number
    serialNumber: string
    images: string[]
    description: string
    productName: string
    warrantyPeriod: number
    stockQuantity: number
    soldCount: number
    minStockThreshold: number
    rating: number
    warrantyCount: number
    warrantyRate: number
}

export interface IWarrantyReports {
    productName: string
    warrantyCount: number
    warrantyRate: number
    averageTime: number
    onTimeRate: number
    status: string
    mainReason: string
    images: string[]
    serialNumber: string
}
