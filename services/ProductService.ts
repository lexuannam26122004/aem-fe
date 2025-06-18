import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from './api'
import { IProductCreate, IProductAdminFilter, IProductUpdate } from '@/models/Product'
import { IResponse } from '@/models/Common'

export const ProductApis = createApi({
    reducerPath: 'ProductApis',
    baseQuery: createBaseQuery('admin/products'),
    endpoints: builder => ({
        searchProduct: builder.query<IResponse, IProductAdminFilter>({
            query: filter => {
                const params = new URLSearchParams()

                if (filter) {
                    if (filter.pageSize) params.append('PageSize', filter.pageSize.toString())
                    if (filter.pageNumber) params.append('PageNumber', filter.pageNumber.toString())
                    if (filter.keyword) params.append('Keyword', filter.keyword)
                    if (filter.isDesc) params.append('IsDescending', filter.isDesc.toString())
                    if (filter.sortBy) params.append('SortBy', filter.sortBy)
                    if (filter.status) params.append('Status', filter.status)
                    if (filter.categoryId) params.append('CategoryId', filter.categoryId.toString())
                }

                const queryString = params.toString()
                return queryString ? `?${queryString}` : ''
            }
        }),

        createProduct: builder.mutation<void, IProductCreate>({
            query: body => ({
                url: ``,
                method: 'POST',
                body: body
            })
        }),

        updateProduct: builder.mutation<void, { id: number; data: IProductUpdate }>({
            query: ({ id, data }) => ({
                url: `${id}`,
                method: 'PUT',
                body: data
            })
        }),

        deleteProduct: builder.mutation<void, number>({
            query: id => ({
                url: `${id}`,
                method: 'DELETE'
            })
        }),

        getByIdProduct: builder.query<IResponse, number>({
            query: id => `${id}`
        }),

        exportProduct: builder.query<IResponse, IProductAdminFilter>({
            query: filter => {
                const params = new URLSearchParams()

                if (filter) {
                    if (filter.pageSize) params.append('pageSize', filter.pageSize.toString())
                    if (filter.pageNumber) params.append('pageIndex', filter.pageNumber.toString())
                    if (filter.keyword) params.append('orderCode', filter.keyword)
                    if (filter.isDesc) params.append('isDescending', filter.isDesc.toString())
                    if (filter.sortBy) params.append('sortBy', filter.sortBy)
                    if (filter.categoryId) params.append('categoryId', filter.categoryId.toString())
                }

                const queryString = params.toString()
                return queryString ? `/export?${queryString}` : ''
            }
        }),
        getProductCountType: builder.query<IResponse, void>({
            query: () => `count-type`
        })
    })
})

export const {
    useSearchProductQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useGetByIdProductQuery,
    useExportProductQuery,
    useLazySearchProductQuery,
    useGetProductCountTypeQuery
} = ProductApis
