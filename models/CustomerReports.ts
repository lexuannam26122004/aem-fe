import { IFilter } from './Common'

export interface ICustomerReportFilter extends IFilter {
    fromDate: string
    toDate: string
    type?: string
    status?: string
}

export interface ICustomerReports {
    date: string
    customerCount: number
    newCustomerCount: number
    returningCustomerCount: number
    returningRate: number
    repeatCustomerCount: number
    newCustomerRate: number
    sameDayRepeatRate: number
    orderCount: number
    averageOrderPerCustomer: number
    revenue: number
    averageSpendPerCustomer: number
    averageSpendPerOrder: number
}
