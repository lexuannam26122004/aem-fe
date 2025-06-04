import { IResponse } from '@/models/Common'
import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from './api'
import { IQuoteCreateVModel } from '@/models/Quote'

export const UserQuoteApis = createApi({
    reducerPath: 'UserQuoteApis',
    baseQuery: createBaseQuery('user/quotes'),
    endpoints: builder => ({
        createQuote: builder.mutation<void, IQuoteCreateVModel>({
            query: body => ({
                url: ``,
                method: 'POST',
                body: body
            })
        }),

        checkQuoted: builder.query<IResponse, number>({
            query: projectId => ({
                url: `check?projectId=${projectId}`,
                method: 'GET'
            })
        })
    })
})

export const { useCreateQuoteMutation, useCheckQuotedQuery } = UserQuoteApis
