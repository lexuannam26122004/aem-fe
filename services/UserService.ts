import { IUserChangePassword, IUserCreate, IUserUpdate } from '@/models/User'
import { IResponse } from '@/models/Common'
import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from './api'

export const UserApis = createApi({
    reducerPath: 'UserApis',
    baseQuery: createBaseQuery('user'),
    endpoints: builder => ({
        createUser: builder.mutation<void, IUserCreate>({
            query: body => ({
                url: ``,
                method: 'POST',
                body: body
            })
        }),

        updateUser: builder.mutation<void, IUserUpdate>({
            query: body => ({
                url: ``,
                method: 'PUT',
                body: body
            })
        }),

        getValidUsername: builder.query<void, string>({
            query: username => ({
                url: `validate-username?username=${username}`,
                method: 'GET'
            })
        }),

        getValidEmail: builder.query<void, string>({
            query: email => ({
                url: `validate-email?email=${email}`,
                method: 'GET'
            })
        }),

        deleteUser: builder.mutation<void, void>({
            query: () => ({
                url: ``,
                method: 'DELETE'
            })
        }),

        changePassword: builder.mutation<void, IUserChangePassword>({
            query: body => ({
                url: `change-password`,
                method: 'PUT',
                body: body
            })
        })
    })
})

export const {
    useCreateUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useGetValidUsernameQuery,
    useGetValidEmailQuery,
    useChangePasswordMutation
} = UserApis
