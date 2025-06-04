export interface ICustomerAddressCreate {
    recipient: string
    phone: string
    email: string
    title: string
    address: string
    district: string
    city: string
    isDefault: boolean
}

export interface ICustomerAddressUpdate extends ICustomerAddressCreate {}

export interface ICustomerAddress extends ICustomerAddressUpdate {
    id?: number
}
