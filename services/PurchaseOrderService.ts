import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from './api'
import { IPurchaseOrderCreate, IPurchaseOrderFilter, IPurchaseOrderUpdate } from '@/models/PurchaseOrder'
import { IResponse } from '@/models/Common'

export const PurchaseOrderApis = createApi({
    reducerPath: 'PurchaseOrderApis',
    baseQuery: createBaseQuery('admin/purchase-orders'),
    endpoints: builder => ({
        searchPurchaseOrder: builder.query<IResponse, IPurchaseOrderFilter>({
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
                    if (filter.orderStatus) params.append('OrderStatus', filter.orderStatus)
                }

                const queryString = params.toString()
                return queryString ? `?${queryString}` : ''
            }
        }),
        createPurchaseOrder: builder.mutation<void, IPurchaseOrderCreate>({
            query: body => ({
                url: ``,
                method: 'POST',
                body: body
            })
        }),
        updatePurchaseOrder: builder.mutation<void, { id: number; data: IPurchaseOrderUpdate }>({
            query: ({ id, data }) => ({
                url: `${id}`,
                method: 'PUT',
                body: data
            })
        }),
        deletePurchaseOrder: builder.mutation<void, number>({
            query: id => ({
                url: `${id}`,
                method: 'DELETE'
            })
        }),
        getByIdPurchaseOrder: builder.query<IResponse, string>({
            query: id => `${id}`
        }),
        exportPurchaseOrder: builder.query<IResponse, IPurchaseOrderFilter>({
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
                    if (filter.orderStatus) params.append('OrderStatus', filter.orderStatus)
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
    useSearchPurchaseOrderQuery,
    useCreatePurchaseOrderMutation,
    useUpdatePurchaseOrderMutation,
    useDeletePurchaseOrderMutation,
    useGetByIdPurchaseOrderQuery,
    useExportPurchaseOrderQuery,
    useGetCountTypeQuery
} = PurchaseOrderApis
