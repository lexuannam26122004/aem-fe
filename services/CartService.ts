import { ICartCreate, ICartUpdate, ICartUpdateQuantity } from '@/models/Cart'
import { IResponse } from '@/models/Common'
import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from './api'

export const CartApis = createApi({
    reducerPath: 'CartApis',
    baseQuery: createBaseQuery('user/carts'),
    tagTypes: ['Cart'],
    endpoints: builder => ({
        searchCart: builder.query<IResponse, void>({
            query: () => ''
        }),

        createCart: builder.mutation<void, ICartCreate>({
            query: body => ({
                url: ``,
                method: 'POST',
                body: body
            }),
            invalidatesTags: ['Cart']
        }),

        updateCart: builder.mutation<void, ICartUpdate>({
            query: body => ({
                url: ``,
                method: 'PUT',
                body: body
            })
        }),

        updateCartQuantity: builder.mutation<void, ICartUpdateQuantity>({
            query: body => ({
                url: `${body.id}/quantity`,
                method: 'PUT',
                body: body.quantity,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        }),

        getByIdCart: builder.query<IResponse, number>({
            query: id => `${id}`
        }),

        getCartCount: builder.query<IResponse, void>({
            query: () => `count`,
            providesTags: [{ type: 'Cart' }]
        }),

        deleteCart: builder.mutation<void, number>({
            query: id => ({
                url: `${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Cart']
        }),

        deleteRangeCart: builder.mutation<void, number[]>({
            query: body => ({
                url: 'remove-range',
                body: { ids: body },
                method: 'DELETE'
            }),
            invalidatesTags: ['Cart']
        })
    })
})

export const {
    useLazySearchCartQuery,
    useCreateCartMutation,
    useUpdateCartMutation,
    useGetByIdCartQuery,
    useGetCartCountQuery,
    useDeleteCartMutation,
    useDeleteRangeCartMutation,
    useUpdateCartQuantityMutation
} = CartApis
