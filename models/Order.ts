import { IFilter } from './Common'
import { IOrderItem } from './OrderItem'

export interface IOrder {
    id: number
    orderCode: string
    customerName?: string
    customerPhone?: string
    avatar?: string
    customerId?: string
    productQuantity: number
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
    shippingEmail?: string
    customerIp: string
    shippingPhone: string
    shippingRecipient: string
    shippingDistrict: string
    shippingCity: string
    items: IOrderItem[]
    shippingAddress: string
    billingAddress?: string
    shipBy?: string
    speedyDelivery?: string
    trackingCode?: string
    discountShippingFee?: number
    taxes?: number
    histories: IOrderStatusHistory[]
    paymentTime?: string
    carrierDeliveryTime?: string
    deliveryTime?: string
    createdBy: string
    updatedAt?: string
    updatedBy?: string
}

export interface IOrderStatusHistory {
    time: string
    title: string
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

export interface IUserOrderFilter {
    pageSize?: number
    pageNumber?: number
    status?: string
    orderCode?: string
}

export interface IUserOrderGetAll {
    id: number
    orderCode: string
    orderStatus: string
    orderDate: string
    trackingCode: string
    totalAmount: number
    items: IOrderItemShort[]
}

export interface IOrderItemShort {
    image?: string
    productName: string
    sku: string
    variants: string
    price: number
    discountPrice: number
    quantity: number
}
