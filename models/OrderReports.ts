import { IFilter } from './Common'

export interface IOrderReportFilter extends IFilter {
    fromDate: string
    toDate: string
    type?: string
    status?: string
}

export interface IOrderReports {
    date: string
    orderCount: number
    successfulOrders: number
    cancelledOrders: number
    returnedOrders: number
    totalRevenue: number
    successRate: number
    cancelRate: number
    averageOrderValue: number
    returnValue: number
    totalProductQuantity: number
    productTypeCount: number
    bestSellingProduct: {
        name: string
        image: string
        serial: string
    }
}
