export interface ITablePermission {
    id: number
    name: string
    parentId: number | null
    sort: number
    pathTo: string
    pathIcon: null | string
    function?: IFunctions
    children?: ITablePermission[]
    data?: IFunctions
    nameController?: string
}

export interface IFunctions {
    isAllowAll?: boolean
    isAllowView?: boolean
    isAllowCreate?: boolean
    isAllowEdit?: boolean
    isAllowPrint?: boolean
    isAllowDelete?: boolean
}

export interface IFilterRole {
    pageSize?: number
    pageNumber?: number
    sortBy?: string
    isDescending?: boolean
    keyword?: string
}

export interface ITableTempData {
    id: number
    data?: IFunctions
}
export interface ISysFile {
    id: number
    name: string
    parentId: number | null
    sort: number
    pathTo: string
    pathIcon: null | string
}

export interface ITableTempData {
    id: number
}
