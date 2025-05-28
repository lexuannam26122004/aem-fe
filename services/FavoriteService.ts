import { IFavoriteCreate, IFavoriteUpdate, IFavoriteFilter } from '@/models/Favorite'
import { IResponse } from '@/models/Common'
import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from './api'

export const FavoriteApis = createApi({
    reducerPath: 'FavoriteApis',
    baseQuery: createBaseQuery('user/favorites'),
    endpoints: builder => ({
        searchFavorite: builder.query<IResponse, IFavoriteFilter>({
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

        createFavorite: builder.mutation<void, IFavoriteCreate>({
            query: body => ({
                url: ``,
                method: 'POST',
                body: body
            })
        }),

        updateFavorite: builder.mutation<void, IFavoriteUpdate>({
            query: body => ({
                url: ``,
                method: 'PUT',
                body: body
            })
        }),

        getFavoriteCount: builder.query<IResponse, number>({
            query: productId => `${productId}/count`
        }),

        getByIdFavorite: builder.query<IResponse, number>({
            query: id => `${id}`
        }),

        deleteFavorite: builder.mutation<void, number>({
            query: id => ({
                url: `${id}`,
                method: 'DELETE'
            })
        }),

        changeStatusFavorite: builder.mutation<void, number>({
            query: id => ({
                url: `${id}/change-status`,
                method: 'PUT'
            })
        })
    })
})

export const {
    useSearchFavoriteQuery,
    useCreateFavoriteMutation,
    useUpdateFavoriteMutation,
    useGetFavoriteCountQuery,
    useGetByIdFavoriteQuery,
    useDeleteFavoriteMutation,
    useChangeStatusFavoriteMutation
} = FavoriteApis
