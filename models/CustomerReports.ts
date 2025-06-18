import { IFilter } from './Common'

export interface ICustomerReportFilter extends IFilter {
    fromDate: string
    toDate: string
    type?: string
    status?: string
}

export interface ICustomerReports {
    date: string // dd/MM/yyyy
    totalCustomers: number
    newCustomers: number
    returningCustomers: number
    repeatRate: number // %
    newCustomerRate: number // %
    customersWith2OrMoreOrders: number
    dailyRepeatRate: number // %
    totalOrders: number
    ordersPerCustomer: number
    totalSpending: number
    spendingPerCustomer: number
    spendingPerOrder: number
}
