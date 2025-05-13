import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from './api'
import { IQuotationCreate, IQuotationFilter, IQuotationUpdate } from '@/models/Quotation'
import { IResponse } from '@/models/Common'

const apiPath = 'https://localhost:44381/api/admin/quotation'

export const QuotationApis = createApi({
    reducerPath: 'QuotationApis',
    baseQuery: createBaseQuery(apiPath),
    endpoints: builder => ({
        searchQuotation: builder.query<IResponse, IQuotationFilter>({
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
                    if (filter.status) params.append('Status', filter.status)
                }

                const queryString = params.toString()
                return queryString ? `?${queryString}` : ''
            }
        }),
        createQuotation: builder.mutation<void, IQuotationCreate>({
            query: body => ({
                url: ``,
                method: 'POST',
                body: body
            })
        }),
        updateQuotation: builder.mutation<void, { id: number; data: IQuotationUpdate }>({
            query: ({ id, data }) => ({
                url: `${id}`,
                method: 'PUT',
                body: data
            })
        }),
        deleteQuotation: builder.mutation<void, number>({
            query: id => ({
                url: `${id}`,
                method: 'DELETE'
            })
        }),
        getByIdQuotation: builder.query<IResponse, number>({
            query: id => `${id}`
        }),
        exportQuotation: builder.query<IResponse, IQuotationFilter>({
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
                    if (filter.status) params.append('Status', filter.status)
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
    useSearchQuotationQuery,
    useCreateQuotationMutation,
    useUpdateQuotationMutation,
    useDeleteQuotationMutation,
    useGetByIdQuotationQuery,
    useExportQuotationQuery,
    useGetCountTypeQuery
} = QuotationApis
