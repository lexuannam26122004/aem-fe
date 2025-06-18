import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from './api'
import { IAdminUser } from '@/models/User'
import { IResponse } from '@/models/Common'

export const AuthApis = createApi({
    reducerPath: 'AuthApis',
    baseQuery: createBaseQuery('admin/auth'),
    endpoints: builder => ({
        getAuthMe: builder.query<IResponse, void>({
            query: () => '/me'
        })
    })
})

export const { useGetAuthMeQuery, useLazyGetAuthMeQuery } = AuthApis
