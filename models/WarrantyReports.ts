import { IFilter } from './Common'

export interface IWarrantyReportFilter extends IFilter {
    fromDate: string
    toDate: string
    statusOrder?: string
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
    date: string // "dd/MM/yyyy"
    orderCount: number
    warranty: number // Tổng doanh thu trước giảm
    discountValue: number
    netRevenue: number // Doanh thu thực nhận
    costOfGoods: number
    grossProfit: number
    grossProfitRate: number // %
    averageOrderValue: number
    discountOrderCount: number
    discountOrderRate: number // %
    quoteCount: number
    quoteConvertedCount: number
    quoteConversionRate: number // %
}
