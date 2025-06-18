import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from './api'
import { IOrderCreate, IOrderFilter } from '@/models/Order'
import { IResponse } from '@/models/Common'

interface IOrderUpdateDelivery {
    shipBy?: string
    speedyDelivery?: string
    trackingCode?: string
}

export const OrderApis = createApi({
    reducerPath: 'OrderApis',
    baseQuery: createBaseQuery('admin/orders'),
    endpoints: builder => ({
        searchOrder: builder.query<IResponse, IOrderFilter>({
            query: filter => {
                const params = new URLSearchParams()

                if (filter) {
                    if (filter.pageSize) params.append('pageSize', filter.pageSize.toString())
                    if (filter.pageNumber) params.append('pageIndex', filter.pageNumber.toString())
                    if (filter.keyword) params.append('orderCode', filter.keyword)
                    if (filter.isDesc) params.append('isDescending', filter.isDesc.toString())
                    if (filter.sortBy) params.append('sortBy', filter.sortBy)
                    if (filter.fromDate) params.append('fromDate', filter.fromDate)
                    if (filter.toDate) params.append('toDate', filter.toDate)
                    if (filter.orderStatus) params.append('status', filter.orderStatus)
                }

                const queryString = params.toString()
                return queryString ? `?${queryString}` : ''
            }
        }),
        createOrder: builder.mutation<void, IOrderCreate>({
            query: body => ({
                url: ``,
                method: 'POST',
                body: body
            })
        }),
        updateOrderStatus: builder.mutation<void, { orderCode: string; status: string; dateTime: string }>({
            query: ({ orderCode, status, dateTime }) => ({
                url: `update-status`,
                method: 'PUT',
                body: { orderCode, status, dateTime }
            })
        }),
        updateDelivery: builder.mutation<void, { orderCode: string; deliveryInfo: IOrderUpdateDelivery }>({
            query: ({ orderCode, deliveryInfo }) => ({
                url: `${orderCode}/update-delivery`,
                method: 'PUT',
                body: deliveryInfo
            })
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
        exportOrder: builder.query<IResponse, IOrderFilter>({
            query: filter => {
                const params = new URLSearchParams()

                if (filter) {
                    if (filter.pageSize) params.append('PageSize', filter.pageSize.toString())
                    if (filter.pageNumber) params.append('PageNumber', filter.pageNumber.toString())
                    if (filter.keyword) params.append('Keyword', filter.keyword)
                    if (filter.isDesc) params.append('IsDescending', filter.isDesc.toString())
                    if (filter.sortBy) params.append('SortBy', filter.sortBy)
                    if (filter.isActive != undefined) params.append('IsActive', filter.isActive.toString())
                    if (filter.fromDate) params.append('FromDate', filter.fromDate)
                    if (filter.toDate) params.append('ToDate', filter.toDate)
                    if (filter.orderStatus) params.append('OrderStatus', filter.orderStatus)
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
    useUpdateOrderStatusMutation,
    useUpdateDeliveryMutation,
    useGetByIdOrderQuery,
    useExportOrderQuery,
    useGetCountTypeQuery
} = OrderApis
