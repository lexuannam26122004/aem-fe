import { IEmployeeCreate, IEmployeeUpdate, IEmployeeFilter } from '@/models/Employee'
import { IResponse } from '@/models/Common'
import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from './api'

export const EmployeeApi = createApi({
    reducerPath: 'EmployeeApis',
    baseQuery: createBaseQuery('admin/employee'),
    endpoints: builder => ({
        searchEmployee: builder.query<IResponse, IEmployeeFilter>({
            query: filter => {
                const params = new URLSearchParams()

                if (filter) {
                    if (filter.pageSize) params.append('PageSize', filter.pageSize.toString())
                    if (filter.pageNumber) params.append('PageNumber', filter.pageNumber.toString())
                    if (filter.keyword) params.append('Keyword', filter.keyword)
                    if (filter.isDesc) params.append('IsDescending', filter.isDesc.toString())
                    if (filter.sortBy) params.append('SortBy', filter.sortBy)
                    if (filter.isActive != undefined) params.append('IsActive', filter.isActive.toString())
                }

                const queryString = params.toString()
                return queryString ? `?${queryString}` : ''
            }
        }),

        createEmployee: builder.mutation<void, IEmployeeCreate>({
            query: body => ({
                url: ``,
                method: 'POST',
                body: body
            })
        }),

        updateEmployee: builder.mutation<void, { id: string; data: IEmployeeUpdate }>({
            query: ({ id, data }) => ({
                url: `${id}`,
                method: 'PUT',
                body: data
            })
        }),

        getByIdEmployee: builder.query<IResponse, number>({
            query: id => `${id}`
        }),

        deleteEmployee: builder.mutation<void, number>({
            query: id => ({
                url: `${id}`,
                method: 'DELETE'
            })
        }),

        changeStatusEmployee: builder.mutation<void, number>({
            query: id => ({
                url: `${id}/change-status`,
                method: 'PUT'
            })
        })
    })
})

export const {
    useSearchEmployeeQuery,
    useCreateEmployeeMutation,
    useUpdateEmployeeMutation,
    useGetByIdEmployeeQuery,
    useDeleteEmployeeMutation,
    useChangeStatusEmployeeMutation
} = EmployeeApi
