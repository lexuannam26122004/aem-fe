import { IFilter } from './Common'

export interface ICoupon {
    id: number
    couponCode: string
    discountType: 'percentage' | 'fixed'
    discountValue: number
    minimumOrderValue: number
    maximumDiscount: number
    usageCount: number
    usageLimit: number
    activationDate: string
    expiryDate: string
    createdAt: string
    createdBy: string
    updatedAt: string
    updatedBy: string
}

export interface ICouponCreate {
    couponCode: string
    discountType: 'percentage' | 'fixed'
    discountValue: number
    minimumOrderValue: number
    maximumDiscount: number
    usageLimit?: number
    customerType: 'all_customer' | 'new_customer' | 'silver_customer' | 'gold_customer'
    activationDate: string
    expiryDate: string
}

export interface ICouponUpdate extends ICouponCreate {
    usageCount: number
}

export interface ICouponFilter extends IFilter {
    customerType?: 'all_customer' | 'new_customer' | 'silver_customer' | 'gold_customer'
}
