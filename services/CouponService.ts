import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from './api'
import { ICouponCreate, ICouponFilter, ICouponUpdate } from '@/models/Coupon'
import { IResponse } from '@/models/Common'

export const CouponApis = createApi({
    reducerPath: 'CouponApis',
    baseQuery: createBaseQuery('admin/coupon'),
    endpoints: builder => ({
        searchCoupon: builder.query<IResponse, ICouponFilter>({
            query: filter => {
                const params = new URLSearchParams()

                if (filter) {
                    if (filter.pageSize) params.append('PageSize', filter.pageSize.toString())
                    if (filter.pageNumber) params.append('PageNumber', filter.pageNumber.toString())
                    if (filter.keyword) params.append('Keyword', filter.keyword)
                    if (filter.isDesc) params.append('IsDescending', filter.isDesc.toString())
                    if (filter.sortBy) params.append('SortBy', filter.sortBy)
                    if (filter.isActive != undefined) params.append('IsActive', filter.isActive.toString())
                    if (filter.customerType !== undefined) params.append('CustomerType', filter.customerType.toString())
                    if (filter.typeCoupon) params.append('TypeCoupon', filter.typeCoupon)
                }

                const queryString = params.toString()
                return queryString ? `?${queryString}` : ''
            }
        }),
        createCoupon: builder.mutation<void, ICouponCreate>({
            query: body => ({
                url: ``,
                method: 'POST',
                body: body
            })
        }),
        updateCoupon: builder.mutation<void, { id: number; data: ICouponUpdate }>({
            query: ({ id, data }) => ({
                url: `${id}`,
                method: 'PUT',
                body: data
            })
        }),
        deleteCoupon: builder.mutation<void, number>({
            query: id => ({
                url: `${id}`,
                method: 'DELETE'
            })
        }),
        getByIdCoupon: builder.query<IResponse, number>({
            query: id => `${id}`
        }),
        exportCoupon: builder.query<IResponse, ICouponFilter>({
            query: filter => {
                const params = new URLSearchParams()

                if (filter) {
                    if (filter.pageSize) params.append('PageSize', filter.pageSize.toString())
                    if (filter.pageNumber) params.append('PageNumber', filter.pageNumber.toString())
                    if (filter.keyword) params.append('Keyword', filter.keyword)
                    if (filter.isDesc) params.append('IsDescending', filter.isDesc.toString())
                    if (filter.sortBy) params.append('SortBy', filter.sortBy)
                    if (filter.isActive != undefined) params.append('IsActive', filter.isActive.toString())
                    if (filter.customerType !== undefined) params.append('CustomerType', filter.customerType.toString())
                }

                const queryString = params.toString()
                return queryString ? `/export?${queryString}` : ''
            }
        }),
        getCountType: builder.query<IResponse, void>({
            query: () => '/type-count'
        }),
        getStatisticOrdersByCoupon: builder.query<IResponse, number>({
            query: id => `/${id}/statistic-by-coupon`
        })
    })
})

export const {
    useSearchCouponQuery,
    useGetStatisticOrdersByCouponQuery,
    useCreateCouponMutation,
    useUpdateCouponMutation,
    useDeleteCouponMutation,
    useGetByIdCouponQuery,
    useExportCouponQuery,
    useGetCountTypeQuery
} = CouponApis
