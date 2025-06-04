import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from './api'
import {
    IProjectAddProduct,
    IProjectCreate,
    IProjectUpdate,
    IProjectUpdateProduct,
    IUserProjectFilter
} from '@/models/Project'
import { IResponse } from '@/models/Common'

export const UserProjectApis = createApi({
    reducerPath: 'UserProjectApis',
    baseQuery: createBaseQuery('user/projects'),
    tagTypes: ['Project'],
    endpoints: builder => ({
        searchProject: builder.query<IResponse, IUserProjectFilter>({
            query: filter => {
                const params = new URLSearchParams()

                if (filter) {
                    if (filter.pageSize) params.append('pageSize', filter.pageSize.toString())
                    if (filter.pageNumber) params.append('pageNumber', filter.pageNumber.toString())
                    if (filter.status) params.append('status', filter.status)
                    if (filter.projectName) params.append('projectName', filter.projectName)
                }

                const queryString = params.toString()
                return queryString ? `?${queryString}` : ''
            },
            providesTags: ['Project']
        }),
        createProject: builder.mutation<void, IProjectCreate>({
            query: body => ({
                url: ``,
                method: 'POST',
                body: body
            }),
            invalidatesTags: ['Project']
        }),
        deleteProject: builder.mutation<void, number>({
            query: id => ({
                url: `${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Project']
        }),
        updateProject: builder.mutation<void, { id: number; body: IProjectUpdate }>({
            query: ({ id, body }) => ({
                url: `${id}`,
                method: 'PUT',
                body: body
            }),
            invalidatesTags: ['Project']
        }),
        getByIdProject: builder.query<IResponse, number>({
            query: id => `${id}`
        }),
        exportProject: builder.query<IResponse, IUserProjectFilter>({
            query: filter => {
                const params = new URLSearchParams()

                if (filter) {
                    if (filter.pageSize) params.append('PageSize', filter.pageSize.toString())
                    if (filter.pageNumber) params.append('PageNumber', filter.pageNumber.toString())
                    if (filter.status) params.append('status', filter.status)
                    if (filter.projectName) params.append('projectName', filter.projectName)
                }

                const queryString = params.toString()
                return queryString ? `/export?${queryString}` : ''
            }
        }),

        updateProjectQuantity: builder.mutation<void, { id: number; quantity: number }>({
            query: body => ({
                url: `products/${body.id}/quantity`,
                method: 'PUT',
                body: body.quantity,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        }),

        deleteProjectProduct: builder.mutation<void, number>({
            query: id => ({
                url: `products/${id}`,
                method: 'DELETE'
            })
        }),

        addProductIntoProject: builder.mutation<void, IProjectAddProduct>({
            query: body => ({
                url: `products`,
                method: 'POST',
                body: body
            })
        })
    })
})

export const {
    useSearchProjectQuery,
    useCreateProjectMutation,
    useUpdateProjectMutation,
    useDeleteProjectMutation,
    useGetByIdProjectQuery,
    useExportProjectQuery,
    useUpdateProjectQuantityMutation,
    useDeleteProjectProductMutation,
    useAddProductIntoProjectMutation
} = UserProjectApis
