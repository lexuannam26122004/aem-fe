'use client'

import { Box } from '@mui/material'
import DisplayInfo from './DisplayInfo'
import CustomerRateChart from './CustomerRateChart'
import ChartOrderRevenue from './CustomerTrendChart'
import ReportTable from './ReportTable'

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
                    width: '100%'
                }}
            >
                <DisplayInfo />
            </Box>

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
                    <ChartOrderRevenue />
                </Box>

                <Box
                    sx={{
                        width: 'calc(100% / 3)'
                    }}
                >
                    <CustomerRateChart />
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
