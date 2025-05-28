import { ICategoryCreate, ICategoryUpdate, ICategoryFilter } from '@/models/Category'
import { IResponse } from '@/models/Common'
import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from './api'

export const CategoryApis = createApi({
    reducerPath: 'CategoryApis',
    baseQuery: createBaseQuery('admin/categories'),
    endpoints: builder => ({
        searchCategory: builder.query<IResponse, ICategoryFilter>({
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

        createCategory: builder.mutation<void, ICategoryCreate>({
            query: body => ({
                url: ``,
                method: 'POST',
                body: body
            })
        }),

        updateCategory: builder.mutation<void, ICategoryUpdate>({
            query: body => ({
                url: ``,
                method: 'PUT',
                body: body
            })
        }),

        getByIdCategory: builder.query<IResponse, number>({
            query: id => `${id}`
        }),

        deleteCategory: builder.mutation<void, number>({
            query: id => ({
                url: `${id}`,
                method: 'DELETE'
            })
        }),

        changeStatusCategory: builder.mutation<void, number>({
            query: id => ({
                url: `${id}/change-status`,
                method: 'PUT'
            })
        })
    })
})

export const {
    useSearchCategoryQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useGetByIdCategoryQuery,
    useDeleteCategoryMutation,
    useChangeStatusCategoryMutation
} = CategoryApis
