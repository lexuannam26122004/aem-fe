import { IFilter } from './Common'

export interface ICreateSupplier {
    supplierName: string
    contactName: string
    address: string
    url?: string
    phoneNumber: string
    email: string
    description: string
    taxID: string
    avatarPath?: string
}

export interface IUpdateSupplier extends ICreateSupplier {
    id: number
}

export interface ISupplier extends IUpdateSupplier {
    isPartner: boolean
}

export interface ISupplierFilter extends IFilter {
    isPartner?: boolean
}
