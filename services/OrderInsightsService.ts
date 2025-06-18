import { IResponse } from '@/models/Common'
import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from './api'

interface IDateRange {
    fromDate: string // yyyy-MM-dd hoặc ISO string
    toDate: string
}

export const OrderInsightsApis = createApi({
    reducerPath: 'OrderInsightsApis',
    baseQuery: createBaseQuery('admin/order-insights'),
    endpoints: builder => ({
        // GET: /api/admin/order-insights/monthly-overview
        getMonthlyOverview: builder.query<IResponse, void>({
            query: () => 'monthly-overview'
        }),

        // GET: /api/admin/order-insights/avg-order-duration?days=7
        getAvgOrderDuration: builder.query<IResponse, number | void>({
            query: (days = 7) => `avg-order-duration?days=${days}`
        }),

        // GET: /api/admin/order-insights/value-segments?days=7
        getOrderValueSegments: builder.query<IResponse, number | void>({
            query: (days = 7) => `value-segments?days=${days}`
        }),

        // GET: /api/admin/order-insights/detailed-report?fromDate=...&toDate=...
        getDetailedOrderReport: builder.query<IResponse, IDateRange>({
            query: ({ fromDate, toDate }) => `detailed-report?fromDate=${fromDate}&toDate=${toDate}`
        })
    })
})

export const {
    useGetMonthlyOverviewQuery,
    useGetAvgOrderDurationQuery,
    useGetOrderValueSegmentsQuery,
    useGetDetailedOrderReportQuery
} = OrderInsightsApis
