'use client'

import { usePathname } from 'next/navigation'
import { Provider } from 'react-redux'
import store from '@/redux/store'
import LayoutAdmin from '@/components/LayoutAdmin'
import ToastContainer from '@/components/ToastContainer'
import { ThemeProvider } from './theme-provider'

export default function ClientProviders({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isAdmin = pathname.startsWith('/admin')

    return (
        <Provider store={store}>
            <ThemeProvider enableSystem attribute='class' defaultTheme='system' disableTransitionOnChange>
                {isAdmin ? (
                    // <ProtectedLayout>
                    <LayoutAdmin>
                        <main>{children}</main>
                    </LayoutAdmin>
                ) : (
                    // </ProtectedLayout>
                    <main>{children}</main>
                )}
                <ToastContainer />
            </ThemeProvider>
        </Provider>
    )
}
