import { IResponse } from '@/models/Common'
import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from './api'

interface ISupplierImportReportParams {
    fromDate: string // yyyy-MM-dd hoặc ISO string
    toDate: string
}

export const InventoryReportApis = createApi({
    reducerPath: 'InventoryReportApis',
    baseQuery: createBaseQuery('admin/inventory-report'),
    endpoints: builder => ({
        // GET: /api/admin/inventory-report/overview
        getInventoryOverview: builder.query<IResponse, void>({
            query: () => 'overview'
        }),

        // GET: /api/admin/inventory-report/stock-distribution
        getStockDistribution: builder.query<IResponse, void>({
            query: () => 'stock-distribution'
        }),

        // GET: /api/admin/inventory-report/top-selling
        getTopSellingProducts: builder.query<IResponse, void>({
            query: () => 'top-selling'
        }),

        // GET: /api/admin/inventory-report/top-imported
        getTopImportedProducts: builder.query<IResponse, void>({
            query: () => 'top-imported'
        }),

        // GET: /api/admin/inventory-report/supplier-import-report?fromDate=...&toDate=...
        getSupplierImportReport: builder.query<IResponse, ISupplierImportReportParams>({
            query: ({ fromDate, toDate }) => `supplier-import-report?fromDate=${fromDate}&toDate=${toDate}`
        })
    })
})

export const {
    useGetInventoryOverviewQuery,
    useGetStockDistributionQuery,
    useGetTopSellingProductsQuery,
    useGetTopImportedProductsQuery,
    useGetSupplierImportReportQuery
} = InventoryReportApis
