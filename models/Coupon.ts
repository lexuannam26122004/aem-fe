import { IFilter } from './Common'

export interface ICoupon extends ICouponUpdate {
    id: number
    usageCount: number
    createdAt: string
    createdBy: string
}

export interface ICouponCreate {
    couponCode: string
    discountType: 'percentage' | 'fixed'
    title: string
    couponType: 'product' | 'shipping'
    discountValue: number
    minimumOrderValue: number
    maximumDiscount: number
    usageLimit?: number
    customerType: 'all_customer' | 'new_customer' | 'silver_customer' | 'gold_customer'
    activationDate: string
    expiryDate: string
}

export interface ICouponUpdate extends ICouponCreate {}

export interface ICouponFilter extends IFilter {
    typeCoupon?: 'active' | 'expired' | 'limited'
    customerType?: 'all_customer' | 'new_customer' | 'silver_customer' | 'gold_customer'
}
