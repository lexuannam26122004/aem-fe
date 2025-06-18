import { IResponse } from '@/models/Common'
import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from './api'
import { ICustomerFilter, ICustomerUpdate } from '@/models/Customer'

export const CustomerApis = createApi({
    reducerPath: 'CustomerApis',
    baseQuery: createBaseQuery('admin/customers'),
    tagTypes: ['Customer'],
    endpoints: builder => ({
        searchCustomer: builder.query<IResponse, ICustomerFilter>({
            query: filter => {
                const params = new URLSearchParams()

                if (filter) {
                    if (filter.pageSize) params.append('PageSize', filter.pageSize.toString())
                    if (filter.pageNumber) params.append('PageNumber', filter.pageNumber.toString())
                    if (filter.keyword) params.append('Keyword', filter.keyword)
                    if (filter.isDesc) params.append('IsDescending', filter.isDesc.toString())
                    if (filter.sortBy) params.append('SortBy', filter.sortBy)
                    if (filter.keyword) params.append('Keyword', filter.keyword)
                    if (filter.fromDate) params.append('FromDate', filter.fromDate)
                    if (filter.toDate) params.append('ToDate', filter.toDate)
                    if (filter.rank) params.append('Rank', filter.rank)
                    if (filter.isActive !== undefined) params.append('IsActive', filter.isActive.toString())
                }

                const queryString = params.toString()
                return queryString ? `?${queryString}` : ''
            },
            providesTags: ['Customer']
        }),

        updateCustomer: builder.mutation<void, { id: string; data: ICustomerUpdate }>({
            query: ({ id, data }) => ({
                url: `${id}`,
                method: 'PUT',
                body: data
            }),
            invalidatesTags: ['Customer']
        }),

        getByIdCustomer: builder.query<IResponse, string>({
            query: id => `${id}`
        }),

        getCustomerCountType: builder.query<IResponse, void>({
            query: () => `count-type`
        }),

        deleteCustomer: builder.mutation<void, string>({
            query: id => ({
                url: `${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Customer']
        }),

        changeStatusCustomer: builder.mutation<void, number>({
            query: id => ({
                url: `${id}/change-status`,
                method: 'PUT'
            })
        })
    })
})

export const {
    useSearchCustomerQuery,
    useUpdateCustomerMutation,
    useGetByIdCustomerQuery,
    useDeleteCustomerMutation,
    useGetCustomerCountTypeQuery,
    useChangeStatusCustomerMutation
} = CustomerApis
