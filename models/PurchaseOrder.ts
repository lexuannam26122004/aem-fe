import { IFilter } from './Common'
import { IPurchaseOrderItem } from './PurchaseOrderItem'

export interface IPurchaseOrder {
    id: number
    supplierAvatarPath?: string
    purchaseCode: string
    supplierName: string
    supplierPhone?: string
    supplierEmail?: string
    supplierAddress?: string
    itemCount: number
    purchaseDate: string
    receivedTime?: string
    receivedBy?: string
    receivedId?: string
    totalAmount: number
    discountAmount?: number
    paymentStatus: 'unpaid' | 'paid'
    paymentTime?: string
    notes?: string
    createdAt: string
    createdBy: string
}

export interface IPurchaseOrderDetail extends IPurchaseOrder {
    itemList: IPurchaseOrderItem[]
    shippingFee: number
    supplierTaxID?: string
    receivedPhone?: string
    employeeAvatarPath?: string
    subTotal: number
    discountShippingFee?: number
    paymentMethod: string
    taxes?: number
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
