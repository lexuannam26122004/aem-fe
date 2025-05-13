'use client'

import { Box, Button, Divider, Paper, Tab, Tabs, Typography } from '@mui/material'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import DisplayInfo from './DisplayInfo'
import OrdersStatusChart from './OrdersStatusChart'
import FinancialOverviewChart from './FinancialOverviewChart'
import { useTranslation } from 'react-i18next'
import ProductTable from './ProductTable'
import { TopProducts } from './TopProducts'
import { TopCustomers } from './TopCustomers'
import ComponentButtons from './ComponentButtons'
import ChartOrderRevenue from './ChartOrderRevenue'

export default function HomePage() {
    const { t } = useTranslation('common')
    const path = usePathname()
    const [open, setOpen] = useState(false)

    return (
        <Box
            sx={{
                maxWidth: '1200px',
                margin: '0 auto'
            }}
        >
            <DisplayInfo />

            <Box
                sx={{
                    mt: '24px',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'stretch',
                    gap: '24px'
                }}
            >
                <Box
                    sx={{
                        width: 'calc(100% / 3 * 2 + 24px)',
                        boxShadow: 'var(--box-shadow-paper)',
                        borderRadius: '15px',
                        overflow: 'hidden'
                    }}
                >
                    <FinancialOverviewChart />
                </Box>

                <Box
                    sx={{
                        width: 'calc(100% / 3)',
                        boxShadow: 'var(--box-shadow-paper)',
                        borderRadius: '15px'
                    }}
                >
                    <OrdersStatusChart />
                </Box>
            </Box>

            <Box
                sx={{
                    mt: '24px',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'stretch',
                    gap: '24px'
                }}
            >
                <Box
                    sx={{
                        width: 'calc(100% / 3)',
                        borderRadius: '15px'
                    }}
                >
                    <ComponentButtons />
                </Box>

                <Box
                    sx={{
                        width: 'calc(100% / 3 * 2 + 24px)',
                        boxShadow: 'var(--box-shadow-paper)',
                        borderRadius: '15px',
                        backgroundColor: 'var(--background-color-item)',
                        padding: '24px'
                    }}
                >
                    <ChartOrderRevenue />
                </Box>
            </Box>

            <Box
                sx={{
                    mt: '24px',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'stretch',
                    gap: '24px'
                }}
            >
                <Box
                    sx={{
                        width: 'calc(100% / 2)',
                        boxShadow: 'var(--box-shadow-paper)',
                        borderRadius: '15px',
                        backgroundColor: 'var(--background-color-item)',
                        padding: '24px'
                    }}
                >
                    <TopProducts />
                </Box>

                <Box
                    sx={{
                        width: 'calc(100% / 2)',
                        boxShadow: 'var(--box-shadow-paper)',
                        borderRadius: '15px',
                        backgroundColor: 'var(--background-color-item)',
                        padding: '24px'
                    }}
                >
                    <TopCustomers />
                </Box>
            </Box>
        </Box>
    )
}
