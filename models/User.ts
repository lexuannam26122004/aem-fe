export interface IUserCreate {
    fullName: string
    email: string
    birthday: string
    phoneNumber: string
    username: string
    password: string
    title?: string
    address: string
    city: string
    district: string
}

export interface IUserUpdate {
    fullName: string
    email: string
    phoneNumber: string
    birthday?: string
    avatar?: string
    taxCode?: string
    companyName?: string
}

export interface IAdminUser {
    id: number
    username: string
    fullName: string
    email: string
    phoneNumber: string
    birthday?: string
    avatar?: string
    roles: string[]
}

export interface IUser extends IUserUpdate {
    id: number
    username: string
    rank: string
}

export interface IUserChangePassword {
    oldPassword: string
    newPassword: string
    confirmedNewPassword: string
}
