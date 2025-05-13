import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from './api'
import { IReviewFilter } from '@/models/Review'
import { IResponse } from '@/models/Common'

const apiPath = 'https://localhost:44381/api/admin/review'

export const ReviewApis = createApi({
    reducerPath: 'ReviewApis',
    baseQuery: createBaseQuery(apiPath),
    endpoints: builder => ({
        searchReview: builder.query<IResponse, IReviewFilter>({
            query: filter => {
                const params = new URLSearchParams()

                if (filter) {
                    if (filter.pageSize) params.append('PageSize', filter.pageSize.toString())
                    if (filter.pageNumber) params.append('PageNumber', filter.pageNumber.toString())
                    if (filter.keyword) params.append('Keyword', filter.keyword)
                    if (filter.isDesc) params.append('IsDescending', filter.isDesc.toString())
                    if (filter.sortBy) params.append('SortBy', filter.sortBy)
                    if (filter.isActive != undefined) params.append('IsActive', filter.isActive.toString())
                }

                const queryString = params.toString()
                return queryString ? `?${queryString}` : ''
            }
        })
    })
})

export const { useSearchReviewQuery } = ReviewApis
