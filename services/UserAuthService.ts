import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from './api'
import { IResponse } from '@/models/Common'

export const UserAuthApis = createApi({
    reducerPath: 'UserAuthApis',
    baseQuery: createBaseQuery('user/auth'),
    endpoints: builder => ({
        getUserAuthMe: builder.query<IResponse, void>({
            query: () => '/me'
        })
    })
})

export const { useGetUserAuthMeQuery, useLazyGetUserAuthMeQuery } = UserAuthApis
