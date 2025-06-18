export interface IAspNetRoleGetAll {
    id: string
    name: string
    description?: string | null
    isActive?: boolean | null
    levelRole: string
    isAdmin: boolean
    createdDate?: string | null
    createdBy: string
    updatedDate?: string | null
    updatedBy: string
}

export interface IAspNetRoleCreate {
    name: string
    description?: string | null
}

export interface IAspNetRoleUpdate {
    id: string
    name: string
    isActive: boolean
    description?: string | null
}

export interface IFilterRole {
    pageSize?: number
    pageNumber?: number
    sortBy?: string
    isDescending?: boolean
    keyword?: string
}
