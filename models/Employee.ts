import { IFilter } from './Common'

export interface IEmployeeCreate {
    fullName: string
    email: string
    phoneNumber: string
    address: string
    birthday: string
    username: string
    password: string
    avatarPath?: string
    gender: boolean
    roles: string[]
}

export interface IEmployeeUpdate {
    fullName: string
    email: string
    phoneNumber: string
    username: string
    address: string
    birthday: string
    avatar?: string
    gender: boolean
    isActive: boolean
    roles: string[]
}

export interface IEmployee extends IEmployeeUpdate {
    id: string
    createdDate: string
}

export interface IEmployeeFilter extends IFilter {}
