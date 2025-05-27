import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from './api'
import { IPaymentRequest, IPaymentResponse } from '@/models/Payment'

export const PaymentApis = createApi({
    reducerPath: 'PaymentApis',
    baseQuery: createBaseQuery('user/payment'),
    endpoints: builder => ({
        createVnpayUrl: builder.mutation<IPaymentResponse, IPaymentRequest>({
            query: body => ({
                url: '/create-vnpay-url',
                method: 'POST',
                body
            })
        })
    })
})

export const { useCreateVnpayUrlMutation } = PaymentApis
