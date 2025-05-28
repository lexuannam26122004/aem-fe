import { IFilter } from './Common'

export interface ICategory {
    id: number
    categoryName: string
    categoryDescription?: string
    parentId?: number
    level: number
    order: number
}

export interface ICategoryCreate {
    categoryName: string
    categoryDescription?: string
    parentId?: number
    level: number
    order: number
}

export interface ICategoryUpdate extends ICategoryCreate {
    id: number
}

export interface ICategoryFilter extends IFilter {}
