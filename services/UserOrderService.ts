import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from './api'
import { IOrderCreate, IUserOrderFilter } from '@/models/Order'
import { IResponse } from '@/models/Common'

export const UserOrderApis = createApi({
    reducerPath: 'UserOrderApis',
    baseQuery: createBaseQuery('user/orders'),
    endpoints: builder => ({
        searchOrder: builder.query<IResponse, IUserOrderFilter>({
            query: filter => {
                const params = new URLSearchParams()

                if (filter) {
                    if (filter.pageSize) params.append('PageSize', filter.pageSize.toString())
                    if (filter.pageNumber) params.append('PageNumber', filter.pageNumber.toString())
                    if (filter.status) params.append('status', filter.status)
                    if (filter.orderCode) params.append('orderCode', filter.orderCode)
                }

                const queryString = params.toString()
                return queryString ? `?${queryString}` : ''
            }
        }),
        createOrder: builder.mutation<IResponse, IOrderCreate>({
            query: body => ({
                url: ``,
                method: 'POST',
                body: body
            })
        }),
        searchByOrderCode: builder.query<IResponse, string>({
            query: code => `search-by-order-code/${code}`
        }),
        deleteOrder: builder.mutation<void, number>({
            query: id => ({
                url: `${id}`,
                method: 'DELETE'
            })
        }),
        getByIdOrder: builder.query<IResponse, string>({
            query: id => `${id}`
        }),
        exportOrder: builder.query<IResponse, IUserOrderFilter>({
            query: filter => {
                const params = new URLSearchParams()

                if (filter) {
                    if (filter.pageSize) params.append('pageSize', filter.pageSize.toString())
                    if (filter.pageNumber) params.append('pageNumber', filter.pageNumber.toString())
                    if (filter.status) params.append('status', filter.status)
                    if (filter.orderCode) params.append('orderCode', filter.orderCode)
                }

                const queryString = params.toString()
                return queryString ? `/export?${queryString}` : ''
            }
        }),
        getCountType: builder.query<IResponse, void>({
            query: () => ({
                url: '/count-type',
                method: 'GET'
            })
        })
    })
})

export const {
    useSearchOrderQuery,
    useCreateOrderMutation,
    useDeleteOrderMutation,
    useSearchByOrderCodeQuery,
    useLazySearchByOrderCodeQuery,
    useGetByIdOrderQuery,
    useExportOrderQuery,
    useGetCountTypeQuery
} = UserOrderApis
