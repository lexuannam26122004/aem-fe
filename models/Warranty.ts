import { IFilter } from './Common'

export interface IWarrantyCreate {
    orderId: string
    productId: string
    warrantyStart: string
    warrantyEnd: string
    description: string
    serialNumber: string
}

export interface IWarrantyUpdate extends IWarrantyCreate {}

export interface IWarranty extends IWarrantyCreate {
    id: string
    avatarPath: string | null
    fullName: string
    phoneNumber: string
    createdBy: string
    productName: string
}

export interface IWarrantyFilter extends IFilter {
    fromDate: string
    toDate: string
}
