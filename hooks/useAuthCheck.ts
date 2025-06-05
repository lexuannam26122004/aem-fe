import { useEffect, useState } from 'react'

export function useAuthCheck() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isAuthChecked, setIsAuthChecked] = useState(false)

    useEffect(() => {
        const token = sessionStorage.getItem('auth_token')
        if (token) {
            setIsAuthenticated(true)
        }
        setIsAuthChecked(true)
    }, [])

    return { isAuthenticated, isAuthChecked }
}
