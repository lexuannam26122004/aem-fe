import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const getToken = () => {
    return sessionStorage.getItem('auth_token')
}

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export const createBaseQuery = (resourcePath: string) => {
    return fetchBaseQuery({
        baseUrl: `${BASE_API_URL}/${resourcePath}`,
        prepareHeaders: headers => {
            const token = getToken()
            if (token) {
                headers.set('Authorization', `Bearer ${token}`)
            }
            return headers
        }
    })
}
