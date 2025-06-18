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
        }),

        exportRevenuePerformanceReport: builder.query<Blob, IRevenueReportFilter>({
            async queryFn(arg, _api, _extraOptions, baseQuery) {
                const { fromDate, toDate, orderStatus = 'all' } = arg
                const token = sessionStorage.getItem('auth_token')
                const url = `/export?fromDate=${fromDate}&toDate=${toDate}&orderStatus=${orderStatus}`
                const result = await baseQuery({
                    url,
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    responseHandler: async response => {
                        if (!response.ok) {
                            throw new Error('Export failed')
                        }
                        return await response.blob()
                    }
                })
                if ('error' in result) {
                    return { error: result.error }
                }
                return { data: result.data as Blob }
            }
        })
    })
})

export const {
    useGetQuotationOrderStatsQuery,
    useGetCouponUsageRateQuery,
    useGetWeeklySalesHeatmapQuery,
    useGetRevenuePerformanceReportQuery,
    useLazyExportRevenuePerformanceReportQuery
} = RevenueApis
