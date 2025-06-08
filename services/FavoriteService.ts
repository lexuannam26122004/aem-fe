import { IFavoriteCreate, IFavoriteUpdate, IFavoriteExpectedPrice } from '@/models/Favorite'
import { IResponse } from '@/models/Common'
import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from './api'
import { IProjectAddProduct } from '@/models/Project'

export const FavoriteApis = createApi({
    reducerPath: 'FavoriteApis',
    baseQuery: createBaseQuery('user/favorites'),
    tagTypes: ['Favorite', 'FavoriteCountByProduct'],
    endpoints: builder => ({
        searchFavorite: builder.query<IResponse, void>({
            query: () => '',
            providesTags: [{ type: 'Favorite' }]
        }),

        createFavorite: builder.mutation<void, IFavoriteCreate>({
            query: body => ({
                url: ``,
                method: 'POST',
                body: body
            }),
            invalidatesTags: ['Favorite']
        }),

        updateFavorite: builder.mutation<void, IFavoriteUpdate>({
            query: body => ({
                url: ``,
                method: 'PUT',
                body: body
            })
        }),

        updateNotify: builder.mutation<void, number>({
            query: id => ({
                url: `${id}/update-notify`,
                method: 'PUT',
                body: {}
            })
        }),

        updateExpectedPrice: builder.mutation<void, IFavoriteExpectedPrice>({
            query: body => ({
                url: ``,
                method: 'PUT',
                body: body
            })
        }),

        getFavoriteCountByProduct: builder.query<IResponse, number>({
            query: productId => `${productId}/count`,
            providesTags: [{ type: 'FavoriteCountByProduct' }]
        }),

        getFavoriteCount: builder.query<IResponse, void>({
            query: () => `count`,
            providesTags: [{ type: 'Favorite' }]
        }),

        getByIdFavorite: builder.query<IResponse, number>({
            query: id => `${id}`
        }),

        deleteFavorite: builder.mutation<void, number>({
            query: id => ({
                url: `${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Favorite']
        }),

        deleteFavoriteByProductId: builder.mutation<void, number>({
            query: productId => ({
                url: `by-productId/${productId}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Favorite', 'FavoriteCountByProduct']
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
    useUpdateNotifyMutation,
    useGetFavoriteCountByProductQuery,
    useUpdateExpectedPriceMutation,
    useDeleteFavoriteMutation,
    useDeleteFavoriteByProductIdMutation,
    useChangeStatusFavoriteMutation
} = FavoriteApis
