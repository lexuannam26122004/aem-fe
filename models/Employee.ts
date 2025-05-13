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
    address: string
    birthday: string
    avatarPath?: string
    gender: boolean
    isActive: boolean
    roles: string[]
}

export interface IEmployee extends IEmployeeUpdate {
    id: number
    username: string
    createdAt: string
}

export interface IEmployeeFilter extends IFilter {}
