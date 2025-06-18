import { IFilter } from './Common'

export interface IQuotation {
    id: number
    quotationCode: string
    customerFullName: string
    customerEmail: string
    responsibleName?: string
    responsibleAvatar?: string
    responsiblePhone?: string
    responsibleEmail?: string
    customerAvatar: string
    createdAt: string
    desiredDeliveryDate: string
    totalItems: number
    status: string
}

export interface IQuotationDetail extends IQuotation {
    customerPhone: string
    additionalInformation?: string
    quotationDate?: string
    quotationExpiryDate?: string
    items: IQuotationItem[]
}

export interface IQuotationItem {
    productName: string
    image: string
    variants: string
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

export interface IUpdateResponsiblePersonModel {
    quoteCode: string
    responsibleAvatar?: string
    responsibleName: string
    responsibleEmail: string
    responsiblePhone: string
}

export interface IUpdateQuoteStatusModel {
    quoteCode: string
    status: string
    quotationDate?: string
    quotationExpiryDate?: string
}
