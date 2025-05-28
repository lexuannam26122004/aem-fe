import { IFeatureCreate, IFeatureUpdate, IFeatureFilter } from '@/models/Feature'
import { IResponse } from '@/models/Common'
import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from './api'

export const FeatureApis = createApi({
    reducerPath: 'FeatureApis',
    baseQuery: createBaseQuery('admin/features'),
    endpoints: builder => ({
        searchFeature: builder.query<IResponse, IFeatureFilter>({
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

        createFeature: builder.mutation<void, IFeatureCreate>({
            query: body => ({
                url: ``,
                method: 'POST',
                body: body
            })
        }),

        updateFeature: builder.mutation<void, IFeatureUpdate>({
            query: body => ({
                url: ``,
                method: 'PUT',
                body: body
            })
        }),

        getByIdFeature: builder.query<IResponse, number>({
            query: id => `${id}`
        }),

        deleteFeature: builder.mutation<void, number>({
            query: id => ({
                url: `${id}`,
                method: 'DELETE'
            })
        }),

        changeStatusFeature: builder.mutation<void, number>({
            query: id => ({
                url: `${id}/change-status`,
                method: 'PUT'
            })
        })
    })
})

export const {
    useSearchFeatureQuery,
    useCreateFeatureMutation,
    useUpdateFeatureMutation,
    useGetByIdFeatureQuery,
    useDeleteFeatureMutation,
    useChangeStatusFeatureMutation
} = FeatureApis
