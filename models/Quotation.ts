import { IFilter } from './Common'

export interface IQuotation {
    id: string
    quotationCode: string
    customerName: string
    customerEmail: string
    customerAvatarPath?: string
    assigneeName?: string
    assigneeId?: string
    assigneeAvatarPath?: string
    phone: string
    itemCount: number
    requestedDate: string
    status: 'pending' | 'processing' | 'completed' | 'cancelled'
    createdAt: string
    updatedAt: string
}

export interface IQuotationDetail extends IQuotation {
    itemList: IQuotationItem[]
    notes: string
    customerIp: string
    validityDate?: string
    assigneePhone?: string
    issuedDate?: string
    receiveAddress?: string
}

export interface IQuotationItem {
    id: number
    productName: string
    productImage: string
    productId: string
    sku?: string
    quantity: number
}

export interface IQuotationFilter extends IFilter {
    fromDate?: string
    toDate?: string
    status?: string
}

export interface IQuotationCreate {}

export interface IQuotationUpdate {}
