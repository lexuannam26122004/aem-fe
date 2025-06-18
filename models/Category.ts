import { IFilter } from './Common'

export interface ICategory {
    id: number
    categoryName: string
    description?: string
    parentId?: number
    level: number
    order: number
    isExpanded?: boolean
    children?: ICategory[]
}

export interface ICategoryCreate {
    categoryName: string
    description?: string
    parentId?: number
    level: number
    order: number
}

export interface ICategoryUpdate extends ICategoryCreate {
    isExpanded: boolean
    id: number
}

export interface ICategoryFilter extends IFilter {
    level?: number
}
