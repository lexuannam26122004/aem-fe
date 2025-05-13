import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from './api'
import { IInventoryCreate, IInventoryFilter, IInventoryUpdate } from '@/models/Inventory'
import { IResponse } from '@/models/Common'

const apiPath = 'https://localhost:44381/api/admin/inventory'

export const InventoryApis = createApi({
    reducerPath: 'InventoryApis',
    baseQuery: createBaseQuery(apiPath),
    endpoints: builder => ({
        searchInventory: builder.query<IResponse, IInventoryFilter>({
            query: filter => {
                const params = new URLSearchParams()

                if (filter) {
                    if (filter.pageSize) params.append('PageSize', filter.pageSize.toString())
                    if (filter.pageNumber) params.append('PageNumber', filter.pageNumber.toString())
                    if (filter.keyword) params.append('Keyword', filter.keyword)
                    if (filter.isDesc) params.append('IsDescending', filter.isDesc.toString())
                    if (filter.sortBy) params.append('SortBy', filter.sortBy)
                    if (filter.isActive != undefined) params.append('IsActive', filter.isActive.toString())
                    if (filter.fromDate) params.append('FromDate', filter.fromDate)
                    if (filter.toDate) params.append('ToDate', filter.toDate)
                    if (filter.status) params.append('Status', filter.status)
                }

                const queryString = params.toString()
                return queryString ? `?${queryString}` : ''
            }
        }),
        createInventory: builder.mutation<void, IInventoryCreate>({
            query: body => ({
                url: ``,
                method: 'POST',
                body: body
            })
        }),
        updateInventory: builder.mutation<void, { id: number; data: IInventoryUpdate }>({
            query: ({ id, data }) => ({
                url: `${id}`,
                method: 'PUT',
                body: data
            })
        }),
        deleteInventory: builder.mutation<void, number>({
            query: id => ({
                url: `${id}`,
                method: 'DELETE'
            })
        }),
        getByIdInventory: builder.query<IResponse, number>({
            query: id => `${id}`
        }),
        exportInventory: builder.query<IResponse, IInventoryFilter>({
            query: filter => {
                const params = new URLSearchParams()

                if (filter) {
                    if (filter.pageSize) params.append('PageSize', filter.pageSize.toString())
                    if (filter.pageNumber) params.append('PageNumber', filter.pageNumber.toString())
                    if (filter.keyword) params.append('Keyword', filter.keyword)
                    if (filter.isDesc) params.append('IsDescending', filter.isDesc.toString())
                    if (filter.sortBy) params.append('SortBy', filter.sortBy)
                    if (filter.isActive != undefined) params.append('IsActive', filter.isActive.toString())
                    if (filter.fromDate) params.append('FromDate', filter.fromDate)
                    if (filter.toDate) params.append('ToDate', filter.toDate)
                    if (filter.status) params.append('Status', filter.status)
                }

                const queryString = params.toString()
                return queryString ? `/export?${queryString}` : ''
            }
        }),
        getCountType: builder.query<IResponse, void>({
            query: () => ({
                url: '/count-type',
                method: 'GET'
            })
        })
    })
})

export const {
    useSearchInventoryQuery,
    useCreateInventoryMutation,
    useUpdateInventoryMutation,
    useDeleteInventoryMutation,
    useGetByIdInventoryQuery,
    useExportInventoryQuery,
    useGetCountTypeQuery
} = InventoryApis
