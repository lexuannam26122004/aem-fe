import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from './api'
import { IUser } from '@/models/User'

export const AuthApis = createApi({
    reducerPath: 'AuthApis',
    baseQuery: createBaseQuery('admin/auth'),
    endpoints: builder => ({
        getAuthMe: builder.query<IUser, void>({
            query: () => '/me'
        })
    })
})

export const { useGetAuthMeQuery, useLazyGetAuthMeQuery } = AuthApis
