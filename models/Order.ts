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

export interface IOrderItemSelectionCreate {
    optionId: number
    optionValueId: number
}

export interface IOrderItemCreate {
    productId: number
    quantity: number
    price: number
    discountPrice: number
    discountType?: string
    discountValue?: number
    selections: IOrderItemSelectionCreate[]
}

export interface IOrderCreate {
    paymentMethod: string
    shippingFee: number
    paymentTime?: string
    customerNote: string
    taxes: number
    discountShippingFee: number
    discountAmount: number
    subTotal: number

    items: IOrderItemCreate[]
    couponIds: number[]

    shippingRecipient: string
    shippingPhone: string
    shippingEmail: string
    shippingAddress: string
    shippingDistrict: string
    shippingCity: string
    clientIpAddress?: string
}

export interface IOrderFilter extends IFilter {
    fromDate?: string
    toDate?: string
    orderStatus?: string
    paymentMethod?: string
}
