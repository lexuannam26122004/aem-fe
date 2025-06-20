import { ICreateSupplier, IUpdateSupplier, ISupplierFilter } from '@/models/Supplier'
import { IResponse } from '@/models/Common'
import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from './api'

export const supplierApis = createApi({
    reducerPath: 'SupplierApis',
    baseQuery: createBaseQuery('admin/supplier'),
    endpoints: builder => ({
        searchSupplier: builder.query<IResponse, ISupplierFilter>({
            query: filter => {
                const params = new URLSearchParams()

                if (filter) {
                    if (filter.pageSize) params.append('PageSize', filter.pageSize.toString())
                    if (filter.pageNumber) params.append('PageNumber', filter.pageNumber.toString())
                    if (filter.keyword) params.append('Keyword', filter.keyword)
                    if (filter.isDesc) params.append('IsDescending', filter.isDesc.toString())
                    if (filter.sortBy) params.append('SortBy', filter.sortBy)
                    if (filter.isActive != undefined) params.append('IsActive', filter.isActive.toString())
                    if (filter.isPartner != undefined) params.append('IsPartner', filter.isPartner.toString())
                }

                const queryString = params.toString()
                return queryString ? `?${queryString}` : ''
            }
        }),

        createSupplier: builder.mutation<void, ICreateSupplier>({
            query: body => ({
                url: ``,
                method: 'POST',
                body: body
            })
        }),

        updateSupplier: builder.mutation<void, IUpdateSupplier>({
            query: body => ({
                url: ``,
                method: 'PUT',
                body: body
            })
        }),

        getByIdSupplier: builder.query<IResponse, number>({
            query: id => `${id}`
        }),

        deleteSupplier: builder.mutation<void, number>({
            query: id => ({
                url: `${id}`,
                method: 'DELETE'
            })
        }),

        changeStatusSupplier: builder.mutation<void, number>({
            query: id => ({
                url: `${id}/change-status`,
                method: 'PUT'
            })
        }),

        changeIsPartnerSupplier: builder.mutation<void, number>({
            query: id => ({
                url: `${id}/change-is-partner`,
                method: 'PUT'
            })
        }),

        getCountPartner: builder.query<IResponse, void>({
            query: () => `count-partner`
        })
    })
})

export const {
    useSearchSupplierQuery,
    useCreateSupplierMutation,
    useUpdateSupplierMutation,
    useGetByIdSupplierQuery,
    useDeleteSupplierMutation,
    useChangeStatusSupplierMutation,
    useChangeIsPartnerSupplierMutation,
    useGetCountPartnerQuery
} = supplierApis
