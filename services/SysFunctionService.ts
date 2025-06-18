import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from './api'
import { IResponse } from '@/models/Common'

export const sysFunctionApi = createApi({
    reducerPath: 'sysFunctionApi',
    baseQuery: createBaseQuery('admin/sys-functions'),
    endpoints: builder => ({
        getAllAsTree: builder.query<IResponse, void>({
            query: () => 'as-tree'
        }),
        getAllFunctions: builder.query<IResponse, void>({
            query: () => ''
        })
    })
})

export const { useGetAllAsTreeQuery, useGetAllFunctionsQuery } = sysFunctionApi
