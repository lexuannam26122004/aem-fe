import { IInteractiveReviewCreate } from '@/models/InteractiveReview'
import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from './api'

export const InteractiveReviewApis = createApi({
    reducerPath: 'InteractiveReviewApis',
    baseQuery: createBaseQuery('user/interactive-reviews'),
    endpoints: builder => ({
        createInteractiveReview: builder.mutation<void, IInteractiveReviewCreate>({
            query: body => ({
                url: ``,
                method: 'POST',
                body: body
            })
        })
    })
})

export const { useCreateInteractiveReviewMutation } = InteractiveReviewApis
