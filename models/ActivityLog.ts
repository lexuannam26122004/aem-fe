import { IFilter } from './Common'

export interface IActivityLog {
    id: number
    userId: number
    username: string
    avatar?: string
    fullName: string
    activityType: string
    logDate: string
    description: string
    status: boolean
    email: string
}

export interface IActivityLogFilter extends IFilter {
    fromDate: string
    toDate: string
}
