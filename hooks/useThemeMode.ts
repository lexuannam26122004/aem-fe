import { useState, useEffect } from 'react'

type ThemeMode = 'light' | 'dark' | 'system'

export const useThemeMode = () => {
    const [mode, setMode] = useState<ThemeMode>(() => {
        if (typeof window !== 'undefined') {
            return (localStorage?.getItem('theme-mode') as ThemeMode) || 'system'
        }
        return 'system'
    })

    useEffect(() => {
        localStorage.setItem('theme-mode', mode)
    }, [mode])

    return { mode, setMode }
}
