export interface IUserCreate {
    fullName: string
    email: string
    phoneNumber: string
    username: string
    password: string
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
