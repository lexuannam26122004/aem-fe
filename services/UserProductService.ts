import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from './api'
import { IProductCreate, IProductFilter, IProductUpdate } from '@/models/Product'
import { IResponse } from '@/models/Common'

export const UserProductApis = createApi({
    reducerPath: 'UserProductApis',
    baseQuery: createBaseQuery('user/products'),
    endpoints: builder => ({
        searchProduct: builder.query<IResponse, IProductFilter>({
            query: filter => {
                const params = new URLSearchParams()

                if (filter) {
                    if (filter.pageSize) params.append('PageSize', filter.pageSize.toString())
                    if (filter.pageNumber) params.append('PageNumber', filter.pageNumber.toString())
                    if (filter.keyword) params.append('Keyword', filter.keyword)
                    if (filter.isDesc !== undefined) params.append('IsDescending', filter.isDesc.toString())
                    if (filter.sortBy) params.append('SortBy', filter.sortBy)
                    if (filter.isActive !== undefined) params.append('IsActive', filter.isActive.toString())
                    if (filter.typeSection) params.append('TypeSection', filter.typeSection)
                    if (filter.categoryIds && filter.categoryIds.length > 0) {
                        filter.categoryIds.forEach(id => params.append('CategoryId', id.toString()))
                    }
                    if (filter.brands && filter.brands.length > 0) {
                        filter.brands.forEach(brand => params.append('Brand', brand))
                    }
                    if (filter.stockStatus) params.append('StockStatus', filter.stockStatus)
                    if (filter.priceRange) params.append('PriceRange', filter.priceRange)
                    if (filter.featureIds && filter.featureIds.length > 0) {
                        filter.featureIds.forEach(id => params.append('FeatureId', id.toString()))
                    }
                }

                const queryString = params.toString()
                return queryString ? `?${queryString}` : ''
            }
        }),
        createProduct: builder.mutation<void, IProductCreate>({
            query: body => ({
                url: ``,
                method: 'POST',
                body: body
            })
        }),
        getProductName: builder.query<IResponse, void>({
            query: () => 'get-product-name'
        }),
        getRecommendedProducts: builder.query<IResponse, void>({
            query: () => 'get-recommended'
        }),
        updateProduct: builder.mutation<void, { id: number; data: IProductUpdate }>({
            query: ({ id, data }) => ({
                url: `${id}`,
                method: 'PUT',
                body: data
            })
        }),
        deleteProduct: builder.mutation<void, number>({
            query: id => ({
                url: `${id}`,
                method: 'DELETE'
            })
        }),
        getByIdProduct: builder.query<IResponse, number>({
            query: id => `${id}`
        }),
        getCompareProductById: builder.query<IResponse, number>({
            query: id => `${id}/get-compare-product`
        }),
        exportProduct: builder.query<IResponse, IProductFilter>({
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
                return queryString ? `/export?${queryString}` : ''
            }
        })
    })
})

export const {
    useSearchProductQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useGetRecommendedProductsQuery,
    useGetProductNameQuery,
    useGetCompareProductByIdQuery,
    useGetByIdProductQuery,
    useExportProductQuery,
    useLazySearchProductQuery
} = UserProductApis
