export interface IFilter {
    keyword?: string
    pageSize: number
    pageNumber: number
    sortBy?: string
    isActive?: boolean
    isDesc?: boolean
}

export interface IResponse {
    success: boolean
    data: any
}
