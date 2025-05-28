import { IFilter } from './Common'

export interface IBrand {
    id: number
    brandName: string
}

export interface IBrandCreate {
    brandName: string
}

export interface IBrandUpdate extends IBrandCreate {
    id: number
}

export interface IBrandFilter extends IFilter {}
