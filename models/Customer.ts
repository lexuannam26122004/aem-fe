import { IFilter } from './Common'

export interface ICustomerCreate {
    fullName: string
    email: string
    phoneNumber: string
    address: string
    birthday: string
    passwordHash: string
    username: string
    avatarPath: string
    gender: boolean
}

export interface ICustomerUpdate {
    fullName: string
    email: string
    phoneNumber: string
    address: string
    birthday: string
    avatar: string
    gender: boolean
}

export interface ICustomer extends ICustomerUpdate {
    id: number
    username: string
    createdAt: string
    rank: string
    lastPurchase: string
    totalOrders: number
    totalSpent: number
    isActive: boolean
}

export interface ICustomerFilter extends IFilter {
    fromDate?: string
    toDate?: string
    rank?: 'silver_customer' | 'gold_customer' | 'new_customer' | 'all_customer'
}
