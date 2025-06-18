import { createApi } from '@reduxjs/toolkit/query/react'
import { IFilterRole, IAspNetRoleCreate, IAspNetRoleUpdate } from '@/models/AspNetRole'
import { createBaseQuery } from './api'
import { IResponse } from '@/models/Common'

export const roleApi = createApi({
    reducerPath: 'roleApi',
    baseQuery: createBaseQuery('admin/roles'),
    tagTypes: ['Role'],
    endpoints: builder => ({
        getAllRoles: builder.query<IResponse, IFilterRole>({
            query: filter => {
                const params = new URLSearchParams()

                if (filter) {
                    if (filter.pageSize) params.append('PageSize', filter.pageSize.toString())
                    if (filter.pageNumber) params.append('PageNumber', filter.pageNumber.toString())
                    if (filter.keyword) params.append('Keyword', filter.keyword)
                    if (filter.isDescending !== undefined) params.append('IsDescending', filter.isDescending.toString())
                    if (filter.sortBy) params.append('SortBy', filter.sortBy)
                }

                return `?${params.toString()}`
            },
            providesTags: ['Role']
        }),

        createRoles: builder.mutation<void, IAspNetRoleCreate>({
            query: roles => ({
                url: '',
                method: 'POST',
                body: roles
            }),
            invalidatesTags: ['Role']
        }),

        getByIdRoles: builder.query<IResponse, string>({
            query: id => `${id}`
        }),

        updateRoles: builder.mutation<void, IAspNetRoleUpdate>({
            query: roles => ({
                url: '',
                method: 'PUT',
                body: roles
            }),
            invalidatesTags: ['Role']
        }),

        getJsonRoleHasFunctions: builder.query<IResponse, string>({
            query: id => `${id}/get-json-role`
        }),

        updateJsonRoleHasFunctions: builder.mutation<IResponse, any>({
            query: data => ({
                url: '/update-json-role',
                method: 'PUT',
                body: data
            })
        }),

        deleteRole: builder.mutation<void, string>({
            query: id => ({
                url: `${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Role']
        })
    })
})

export const {
    useGetAllRolesQuery,
    useGetByIdRolesQuery,
    useGetJsonRoleHasFunctionsQuery,
    useUpdateJsonRoleHasFunctionsMutation,
    useCreateRolesMutation,
    useUpdateRolesMutation,
    useDeleteRoleMutation
} = roleApi
