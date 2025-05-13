import { IFilter } from './Common'

export interface IHistoryWarrantyCreate {
    warrantyId: string
    repairProductId: number
    newProductId: number
    repairSerialNumber: string
    newSerialNumber: string
    repairDate: string
    warrantyDuration: number
    repairDescription: string
    type: string
    status: string
}

export interface IHistoryWarrantyUpdate extends IHistoryWarrantyCreate {}

export interface IHistoryWarranty extends IHistoryWarrantyCreate {
    id: string
    fullName: string
    phoneNumber: string
    repairProductName: string
    newProductName: string
}

export interface IHistoryWarrantyFilter extends IFilter {}
