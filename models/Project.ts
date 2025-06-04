export interface IProjectCreate {
    projectName: string
    description?: string
    estimatedBudget: number
    projectCode?: string
    doneDate?: string
}

export interface IProjectUpdate extends IProjectCreate {}

export interface IProjectGetAll {
    id: number
    thumbnail: string
    projectName: string
    projectCode?: string
    description?: string
    status: string
    doneDate?: string
    estimatedBudget: number
    totalProducts: number
}

export interface IProjectProductSelection {
    optionId: number
    optionValueId: number
}

export interface IProjectAddProduct {
    projectIds: number[]
    productId: number
    quantity: number
    selections: IProjectProductSelection[]
}

export interface IProjectUpdateProduct {
    projectProductId: number
    quantity: number
    specifications: string
    selections: IProjectProductSelection[]
}

export interface IProjectProduct {
    productId: number
    productName: string
    sku: string
    variants: string
    quantity: number
    specifications: string
}

export interface IProjectGetById {
    id: number
    projectName: string
    description?: string
    status: string
    estimatedBudget: number
    projectCode?: string
    doneDate?: string
    products: IProjectProduct[]
}

export interface IUserProjectFilter {
    pageSize?: number
    pageNumber?: number
    status?: string
    projectName?: string
}

export interface IProjectProduct {
    id: number
    productId: number
    productImage: string
    productName: string
    sku: string
    variants: string
    quantity: number
    specifications: string
}

export interface IProjectGetById {
    id: number
    projectName: string
    description?: string
    status: string
    estimatedBudget: number
    projectCode?: string
    doneDate?: string // ISO string format (e.g., '2025-06-03T12:00:00Z')
    products: IProjectProduct[]
}
