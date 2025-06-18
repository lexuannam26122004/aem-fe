import { IResponse } from '@/models/Common'
import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from './api'

export const HomeApis = createApi({
    reducerPath: 'HomeApis',
    baseQuery: createBaseQuery('admin/home'),
    endpoints: builder => ({
        // GET: /api/admin/home/today-stats
        getTodayStats: builder.query<IResponse, void>({
            query: () => 'today-stats'
        }),

        // GET: /api/admin/home/revenue-orders?days=7
        getRevenueAndOrders: builder.query<IResponse, number | void>({
            query: (days = 7) => `revenue-orders?days=${days}`
        }),

        // GET: /api/admin/home/financial-overview
        getFinancialOverview: builder.query<IResponse, void>({
            query: () => 'financial-overview'
        }),

        // GET: /api/admin/home/order-status-ratio
        getOrderStatusRatio: builder.query<IResponse, void>({
            query: () => 'order-status-ratio'
        }),

        // GET: /api/admin/home/cards
        getDashboardCards: builder.query<IResponse, void>({
            query: () => 'cards'
        }),

        // GET: /api/admin/home/top-sales
        getTopSalesSummary: builder.query<IResponse, void>({
            query: () => 'top-sales'
        })
    })
})

export const {
    useGetTodayStatsQuery,
    useGetRevenueAndOrdersQuery,
    useGetFinancialOverviewQuery,
    useGetOrderStatusRatioQuery,
    useGetDashboardCardsQuery,
    useGetTopSalesSummaryQuery
} = HomeApis
