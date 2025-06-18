import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from './api'
import {
    IQuotationCreate,
    IQuotationFilter,
    IQuotationUpdate,
    IUpdateQuoteStatusModel,
    IUpdateResponsiblePersonModel
} from '@/models/Quotation'
import { IResponse } from '@/models/Common'

export const QuotationApis = createApi({
    reducerPath: 'QuotationApis',
    baseQuery: createBaseQuery('admin/quotes'),
    tagTypes: ['Quotation'],
    endpoints: builder => ({
        searchQuotation: builder.query<IResponse, IQuotationFilter>({
            query: filter => {
                const params = new URLSearchParams()

                if (filter) {
                    if (filter.pageSize) params.append('pageSize', filter.pageSize.toString())
                    if (filter.pageNumber) params.append('pageIndex', filter.pageNumber.toString())
                    if (filter.keyword) params.append('keyword', filter.keyword)
                    if (filter.isDesc) params.append('isDesc', filter.isDesc.toString())
                    if (filter.sortBy) params.append('sortBy', filter.sortBy)
                    if (filter.isActive != undefined) params.append('isActive', filter.isActive.toString())
                    if (filter.fromDate) params.append('fromDate', filter.fromDate)
                    if (filter.toDate) params.append('toDate', filter.toDate)
                    if (filter.status) params.append('status', filter.status)
                }

                const queryString = params.toString()
                return queryString ? `?${queryString}` : ''
            }
        }),
        updateQuotation: builder.mutation<void, { id: number; data: IQuotationUpdate }>({
            query: ({ id, data }) => ({
                url: `${id}`,
                method: 'PUT',
                body: data
            })
        }),

        updateResponsibleEmployee: builder.mutation<void, IUpdateResponsiblePersonModel>({
            query: body => ({
                url: `update-responsible-employee`,
                method: 'PUT',
                body
            }),
            invalidatesTags: (result, error, body) => [{ type: 'Quotation', id: body.quoteCode }]
        }),

        updateQuoteStatus: builder.mutation<void, IUpdateQuoteStatusModel>({
            query: body => ({
                url: `update-quote-status`,
                method: 'PUT',
                body
            }),
            invalidatesTags: (result, error, body) => [{ type: 'Quotation', id: body.quoteCode }]
        }),

        deleteQuotation: builder.mutation<void, number>({
            query: id => ({
                url: `${id}`,
                method: 'DELETE'
            })
        }),
        getByIdQuotation: builder.query<IResponse, string>({
            query: id => `${id}`,
            providesTags: (result, error, id) => [{ type: 'Quotation', id }]
        }),
        exportQuotation: builder.query<IResponse, IQuotationFilter>({
            query: filter => {
                const params = new URLSearchParams()

                if (filter) {
                    if (filter.pageSize) params.append('pageSize', filter.pageSize.toString())
                    if (filter.pageNumber) params.append('pageIndex', filter.pageNumber.toString())
                    if (filter.keyword) params.append('keyword', filter.keyword)
                    if (filter.isDesc) params.append('isDescending', filter.isDesc.toString())
                    if (filter.sortBy) params.append('sortBy', filter.sortBy)
                    if (filter.isActive != undefined) params.append('isActive', filter.isActive.toString())
                    if (filter.fromDate) params.append('fromDate', filter.fromDate)
                    if (filter.toDate) params.append('toDate', filter.toDate)
                    if (filter.status) params.append('status', filter.status)
                }

                const queryString = params.toString()
                return queryString ? `/export?${queryString}` : ''
            }
        }),
        getCountQuotesType: builder.query<IResponse, void>({
            query: () => ({
                url: '/count-type',
                method: 'GET'
            })
        })
    })
})

export const {
    useSearchQuotationQuery,
    useUpdateQuotationMutation,
    useDeleteQuotationMutation,
    useGetByIdQuotationQuery,
    useUpdateQuoteStatusMutation,
    useExportQuotationQuery,
    useUpdateResponsibleEmployeeMutation,
    useGetCountQuotesTypeQuery
} = QuotationApis
