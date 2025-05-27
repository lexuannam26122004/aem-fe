'use client'

import { Box } from '@mui/material'
import DisplayInfo from './DisplayInfo'
import RateInventoryChart from './RateInventoryChart'
import ReportTable from './ReportTable'
import OutOfStockTable from './OutOfStockTable'
import TopSellingProducts from './TopSellingProducts'
import TopPurchasedProducts from './TopPurchasedProducts'
export default function WarrantyReportsPage() {
    return (
        <Box
            sx={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px'
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    gap: '24px',
                    alignItems: 'stretch'
                }}
            >
                <Box
                    sx={{
                        width: 'calc(100% / 3 * 2 + 24px)'
                    }}
                >
                    <DisplayInfo />
                </Box>

                <Box
                    sx={{
                        width: 'calc(100% / 3)'
                    }}
                >
                    <RateInventoryChart />
                </Box>
            </Box>

            <OutOfStockTable />

            <Box
                sx={{
                    display: 'flex',
                    gap: '24px',
                    alignItems: 'stretch'
                }}
            >
                <Box
                    sx={{
                        width: 'calc(100% / 2 - 12px)'
                    }}
                >
                    <TopSellingProducts />
                </Box>

                <Box
                    sx={{
                        width: 'calc(100% / 2 - 12px)'
                    }}
                >
                    <TopPurchasedProducts />
                </Box>
            </Box>

            <Box
                sx={{
                    width: '100%',
                    boxShadow: 'var(--box-shadow-paper)',
                    borderRadius: '15px'
                }}
            >
                <ReportTable />
            </Box>
        </Box>
    )
}
