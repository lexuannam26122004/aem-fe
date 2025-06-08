import { ICustomerAddressCreate, ICustomerAddressUpdate } from '@/models/CustomerAddress'
import { IResponse } from '@/models/Common'
import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from './api'

export const CustomerAddressApis = createApi({
    reducerPath: 'CustomerAddressApis',
    baseQuery: createBaseQuery('user/customer-addresses'),
    tagTypes: ['CustomerAddress', 'CustomerAddressDefault'],
    endpoints: builder => ({
        searchCustomerAddress: builder.query<IResponse, void>({
            query: () => '',
            providesTags: [{ type: 'CustomerAddress' }]
        }),

        getDefaultCustomerAddress: builder.query<IResponse, void>({
            query: () => 'get-default',
            providesTags: [{ type: 'CustomerAddressDefault' }]
        }),

        createCustomerAddress: builder.mutation<void, ICustomerAddressCreate>({
            query: body => ({
                url: ``,
                method: 'POST',
                body: body
            }),
            invalidatesTags: ['CustomerAddress']
        }),

        updateCustomerAddress: builder.mutation<void, { id: number; body: ICustomerAddressUpdate }>({
            query: ({ id, body }) => ({
                url: `${id}`,
                method: 'PUT',
                body: body
            }),
            invalidatesTags: ['CustomerAddress']
        }),

        getByIdCustomerAddress: builder.query<IResponse, number>({
            query: id => `${id}`
        }),

        deleteCustomerAddress: builder.mutation<void, number>({
            query: id => ({
                url: `${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['CustomerAddress']
        }),

        changeDefaultCustomerAddress: builder.mutation<void, number>({
            query: id => ({
                url: `${id}/change-default`,
                method: 'PUT'
            }),
            invalidatesTags: ['CustomerAddress', 'CustomerAddressDefault']
        })
    })
})

export const {
    useLazySearchCustomerAddressQuery,
    useCreateCustomerAddressMutation,
    useUpdateCustomerAddressMutation,
    useGetByIdCustomerAddressQuery,
    useLazyGetDefaultCustomerAddressQuery,
    useDeleteCustomerAddressMutation,
    useChangeDefaultCustomerAddressMutation
} = CustomerAddressApis
