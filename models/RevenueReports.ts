import { IFilter } from './Common'

export interface IRevenueReportFilter extends IFilter {
    fromDate: string
    toDate: string
    orderStatus?: string
}

export interface IRevenueReports {
    date: string // "dd/MM/yyyy"
    orderCount: number
    revenue: number // Tổng doanh thu trước giảm
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
