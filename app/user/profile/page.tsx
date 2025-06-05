'use client'

import { useEffect, useState } from 'react'
import LoginRequired from '@/components/LoginRequired'
import UserProfileContent from './UserProfileContent'
export default function UserOrders() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isAuthChecked, setIsAuthChecked] = useState(false)

    useEffect(() => {
        const token = sessionStorage.getItem('auth_token')
        if (token) {
            setIsAuthenticated(true)
        }
        setIsAuthChecked(true)
    }, [])

    if (!isAuthChecked) return null
    if (!isAuthenticated) return <LoginRequired type='profile' />

    return <UserProfileContent />
}
