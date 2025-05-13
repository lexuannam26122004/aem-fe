import { IFilter } from './Common'
import { IOrderItem } from './OrderItem'

export interface IOrder {
    id: number
    orderCode: string
    customerName?: string
    customerPhone?: string
    avatarPath?: string
    customerId?: string
    itemCount: number
    orderDate: string
    totalAmount: number
    orderStatus: string
    paymentMethod: string
    createdAt: string
}

export interface IOrderDetail extends IOrder {
    subTotal: number
    isConfirmed: boolean
    reviewTime?: string
    discountAmount?: number
    shippingFee: number
    customerNote?: string
    customerEmail?: string
    customerIp: string
    itemList: IOrderItem[]
    shippingAddress: string
    billingAddress?: string
    shipBy?: string
    speedyDelivery?: string
    trackingCode?: string
    discountShippingFee?: number
    taxes?: number
    orderStatusHistory: IOrderStatusHistory[]
    paymentTime?: string
    carrierDeliveryTime?: string
    deliveryTime?: string
    createdBy: string
    updatedAt?: string
    updatedBy?: string
}

export interface IOrderStatusHistory {
    time: string
    content: string
}

export interface IOrderCreate {
    customerId?: string
    orderDate: string
    shippingAddress: string
    billingAddress?: string
    totalAmount: number
    subTotal?: number
    discountAmount?: number
    orderStatus: string
    paymentMethod: string
    shippingFee: number
    customerNote?: string
}

export interface IOrderUpdate extends IOrderCreate {}

export interface IOrderFilter extends IFilter {
    fromDate?: string
    toDate?: string
    orderStatus?: string
    paymentMethod?: string
}
