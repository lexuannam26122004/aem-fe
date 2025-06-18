import { IFilter } from './Common'
import { IPurchaseOrderItem } from './PurchaseOrderItem'

export interface IPurchaseOrder {
    id: number
    supplierAvatar?: string
    orderCode: string
    supplierName: string
    supplierPhone?: string
    supplierEmail?: string
    supplierAddress?: string
    totalItems: number
    purchaseDate: string
    deliveryDate?: string
    totalAmount: number
    discountAmount?: number
    orderStatus: 'unpaid' | 'paid'
    paymentTime?: string
    description?: string
}

export interface IPurchaseOrderDetail {
    items: IPurchaseOrderItem[]
    supplier: ISupplierInfo
    receiver: IReceiverInfo
    orderCode: string
    orderDate: string
    deliveryDate?: string
    orderStatus: string
    description?: string
    subTotal: number
    shippingCost: number
    discountShipping?: number
    discountAmount?: number
    payment: IPaymentInfo
    taxAmount?: number
    totalAmount: number
}

interface IPaymentInfo {
    method: string
    time: string
}

interface IReceiverInfo {
    fullName: string
    avatar?: string
    phone: string
    code: string
    receiveTime: string
}

interface ISupplierInfo {
    id: string
    name: string
    avatar?: string
    phone: string
    email: string
    address: string
    taxCode: string
}

export interface IPurchaseOrderCreate {
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

export interface IPurchaseOrderUpdate extends IPurchaseOrderCreate {}

export interface IPurchaseOrderFilter extends IFilter {
    fromDate?: string
    toDate?: string
    orderStatus?: string
    paymentMethod?: string
}
