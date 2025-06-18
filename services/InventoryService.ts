import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from './api'
import { IInventoryCreate, IInventoryFilter, IInventoryProductFilter, IInventoryUpdate } from '@/models/Inventory'
import { IResponse } from '@/models/Common'

export const InventoryApis = createApi({
    reducerPath: 'InventoryApis',
    baseQuery: createBaseQuery('admin/inventories'),
    endpoints: builder => ({
        searchInventory: builder.query<IResponse, IInventoryFilter>({
            query: filter => {
                const params = new URLSearchParams()

                if (filter) {
                    if (filter.page) params.append('Page', filter.page.toString())
                    if (filter.pageSize) params.append('PageSize', filter.pageSize.toString())
                    if (filter.keyword) params.append('Keyword', filter.keyword)
                    if (filter.fromDate) params.append('FromDate', filter.fromDate)
                    if (filter.toDate) params.append('ToDate', filter.toDate)
                }

                const queryString = params.toString()
                return `${queryString ? `?${queryString}` : ''}`
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
        getByIdInventory: builder.query<IResponse, { id: number; filter?: IInventoryProductFilter }>({
            query: ({ id, filter }) => {
                const params = new URLSearchParams()

                if (filter) {
                    if (filter.keyword) params.append('Keyword', filter.keyword)
                    if (filter.categoryId) params.append('CategoryId', filter.categoryId.toString())
                }

                const queryString = params.toString()
                return `${id}${queryString ? `?${queryString}` : ''}`
            }
        }),

        getCountType: builder.query<IResponse, void>({
            query: () => ({
                url: '/count-type',
                method: 'GET'
            })
        }),

        getProducts: builder.query<IResponse, string>({
            query: keyword => ({
                url: `/search-products?keyword=${keyword}`,
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
    useGetCountTypeQuery,
    useGetProductsQuery
} = InventoryApis
