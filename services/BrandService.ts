import { IBrandCreate, IBrandUpdate, IBrandFilter } from '@/models/Brand'
import { IResponse } from '@/models/Common'
import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from './api'

export const BrandApis = createApi({
    reducerPath: 'BrandApis',
    baseQuery: createBaseQuery('admin/brands'),
    endpoints: builder => ({
        searchBrand: builder.query<IResponse, IBrandFilter>({
            query: filter => {
                const params = new URLSearchParams()

                if (filter) {
                    if (filter.pageSize) params.append('PageSize', filter.pageSize.toString())
                    if (filter.pageNumber) params.append('PageNumber', filter.pageNumber.toString())
                    if (filter.keyword) params.append('Keyword', filter.keyword)
                    if (filter.isDesc) params.append('IsDescending', filter.isDesc.toString())
                    if (filter.sortBy) params.append('SortBy', filter.sortBy)
                    if (filter.isActive != undefined) params.append('IsActive', filter.isActive.toString())
                }

                const queryString = params.toString()
                return queryString ? `?${queryString}` : ''
            }
        }),

        createBrand: builder.mutation<void, IBrandCreate>({
            query: body => ({
                url: ``,
                method: 'POST',
                body: body
            })
        }),

        updateBrand: builder.mutation<void, IBrandUpdate>({
            query: body => ({
                url: ``,
                method: 'PUT',
                body: body
            })
        }),

        getByIdBrand: builder.query<IResponse, number>({
            query: id => `${id}`
        }),

        deleteBrand: builder.mutation<void, number>({
            query: id => ({
                url: `${id}`,
                method: 'DELETE'
            })
        }),

        changeStatusBrand: builder.mutation<void, number>({
            query: id => ({
                url: `${id}/change-status`,
                method: 'PUT'
            })
        })
    })
})

export const {
    useSearchBrandQuery,
    useCreateBrandMutation,
    useUpdateBrandMutation,
    useGetByIdBrandQuery,
    useDeleteBrandMutation,
    useChangeStatusBrandMutation
} = BrandApis
