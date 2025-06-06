import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from './api'
import { IResponse } from '@/models/Common'

export const UserCouponApis = createApi({
    reducerPath: 'UserCouponApis',
    baseQuery: createBaseQuery('user/coupons'),
    endpoints: builder => ({
        getUserCoupon: builder.query<IResponse, void>({
            query: () => ''
        })
    })
})

export const { useGetUserCouponQuery } = UserCouponApis
