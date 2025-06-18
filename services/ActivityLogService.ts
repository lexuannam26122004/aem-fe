import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from './api'
import { IQuotationFilter } from '@/models/Quotation'
import { IResponse } from '@/models/Common'
import { IActivityLogFilter } from '@/models/ActivityLog'

export const ActivityLogApis = createApi({
    reducerPath: 'ActivityLogApis',
    baseQuery: createBaseQuery('admin/activity-logs'),
    endpoints: builder => ({
        searchActivityLog: builder.query<IResponse, IActivityLogFilter>({
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
                }

                const queryString = params.toString()
                return queryString ? `?${queryString}` : ''
            }
        }),
        exportActivityLog: builder.query<IResponse, IActivityLogFilter>({
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
                }

                const queryString = params.toString()
                return queryString ? `/export?${queryString}` : ''
            }
        }),
        getCountActivityLogType: builder.query<IResponse, void>({
            query: () => ({
                url: '/count-type',
                method: 'GET'
            })
        })
    })
})

export const { useSearchActivityLogQuery, useExportActivityLogQuery, useGetCountActivityLogTypeQuery } = ActivityLogApis
