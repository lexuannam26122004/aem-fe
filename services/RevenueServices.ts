import { IResponse } from '@/models/Common'
import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from './api'
import { IRevenueReportFilter } from '@/models/RevenueReports'

export const RevenueApis = createApi({
    reducerPath: 'RevenueApis',
    baseQuery: createBaseQuery('admin/revenue'),
    endpoints: builder => ({
        // GET: /api/admin/revenue/quotation-order-statistics
        getQuotationOrderStats: builder.query<IResponse, void>({
            query: () => 'quotation-order-statistics'
        }),

        // GET: /api/admin/revenue/coupon-usage-rate
        getCouponUsageRate: builder.query<IResponse, void>({
            query: () => 'coupon-usage-rate'
        }),

        // GET: /api/admin/revenue/weekly-sales-heatmap
        getWeeklySalesHeatmap: builder.query<IResponse, void>({
            query: () => 'weekly-sales-heatmap'
        }),

        // GET: /api/admin/revenue/performance-report?fromDate=...&toDate=...&orderStatus=...
        getRevenuePerformanceReport: builder.query<IResponse, IRevenueReportFilter>({
            query: ({ fromDate, toDate, orderStatus = 'all' }) =>
                `performance-report?fromDate=${fromDate}&toDate=${toDate}&orderStatus=${orderStatus}`
        })
    })
})

export const {
    useGetQuotationOrderStatsQuery,
    useGetCouponUsageRateQuery,
    useGetWeeklySalesHeatmapQuery,
    useGetRevenuePerformanceReportQuery
} = RevenueApis
