import { IResponse } from '@/models/Common'
import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from './api'

interface ICustomerTableReportParams {
    fromDate: string // ISO hoặc yyyy-MM-dd
    toDate: string
}

export const CustomerReportApis = createApi({
    reducerPath: 'CustomerReportApis',
    baseQuery: createBaseQuery('admin/customer-report'),
    endpoints: builder => ({
        // GET: /api/admin/customer-report/overview
        getCustomerOverview: builder.query<IResponse, void>({
            query: () => 'overview'
        }),

        // GET: /api/admin/customer-report/trend?days=7
        getCustomerTrend: builder.query<IResponse, number | void>({
            query: (days = 7) => `trend?days=${days}`
        }),

        // GET: /api/admin/customer-report/group-distribution
        getCustomerGroupDistribution: builder.query<IResponse, void>({
            query: () => 'group-distribution'
        }),

        // GET: /api/admin/customer-report/table-report?fromDate=...&toDate=...
        getCustomerTableReport: builder.query<IResponse, ICustomerTableReportParams>({
            query: ({ fromDate, toDate }) => `table-report?fromDate=${fromDate}&toDate=${toDate}`
        })
    })
})

export const {
    useGetCustomerOverviewQuery,
    useGetCustomerTrendQuery,
    useGetCustomerGroupDistributionQuery,
    useGetCustomerTableReportQuery
} = CustomerReportApis
