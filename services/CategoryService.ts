import { ICategoryCreate, ICategoryUpdate, ICategoryFilter } from '@/models/Category'
import { IResponse } from '@/models/Common'
import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from './api'

export interface ICategoryReorderRequest {
    parentId?: number | null
    categoryIds: number[]
}

export const CategoryApis = createApi({
    reducerPath: 'CategoryApis',
    baseQuery: createBaseQuery('admin/categories'),
    tagTypes: ['Category'],
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
                    if (filter.level != undefined) params.append('Level', filter.level.toString())
                    if (filter.isActive != undefined) params.append('IsActive', filter.isActive.toString())
                }

                const queryString = params.toString()
                return queryString ? `?${queryString}` : ''
            },
            providesTags: ['Category']
        }),

        createCategory: builder.mutation<IResponse, ICategoryCreate>({
            query: body => ({
                url: ``,
                method: 'POST',
                body: body
            }),
            invalidatesTags: ['Category']
        }),

        updateCategory: builder.mutation<IResponse, { id: number; body: ICategoryUpdate }>({
            query: ({ id, body }) => ({
                url: `${id}`,
                method: 'PUT',
                body: body
            }),
            invalidatesTags: ['Category']
        }),

        getByIdCategory: builder.query<IResponse, number>({
            query: id => `${id}`,
            providesTags: ['Category']
        }),

        deleteCategory: builder.mutation<IResponse, number>({
            query: id => ({
                url: `${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Category']
        }),

        changeStatusCategory: builder.mutation<IResponse, number>({
            query: id => ({
                url: `${id}/change-status`,
                method: 'PUT'
            }),
            invalidatesTags: ['Category']
        }),

        changeExpanded: builder.mutation<IResponse, number>({
            query: id => ({
                url: `${id}/change-expanded`,
                method: 'PUT'
            })
        }),

        reorderCategories: builder.mutation<IResponse, ICategoryReorderRequest>({
            query: body => ({
                url: 'reorder',
                method: 'PUT',
                body: body
            }),
            invalidatesTags: ['Category']
        })
    })
})

export const {
    useSearchCategoryQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useGetByIdCategoryQuery,
    useChangeExpandedMutation,
    useDeleteCategoryMutation,
    useChangeStatusCategoryMutation,
    useReorderCategoriesMutation
} = CategoryApis
