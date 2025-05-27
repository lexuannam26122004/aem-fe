'use client'

import { Box } from '@mui/material'
import CouponUsageChart from './CouponUsageChart'
import DisplayInfo from './DisplayInfo'
import SalesHeatmapByTime from './SalesHeatmapByTime'
import ReportTable from './ReportTable'

export default function RevenuePage() {
    return (
        <Box
            sx={{
                maxWidth: '1200px',
                margin: '0 auto'
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'stretch',
                    gap: '24px'
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
                        width: 'calc(100% / 3)',
                        boxShadow: 'var(--box-shadow-paper)',
                        borderRadius: '15px'
                    }}
                >
                    <CouponUsageChart />
                </Box>
            </Box>

            <Box
                sx={{
                    width: '100%',
                    mt: '24px',
                    boxShadow: 'var(--box-shadow-paper)',
                    borderRadius: '15px'
                }}
            >
                <SalesHeatmapByTime />
            </Box>

            <Box
                sx={{
                    width: '100%',
                    mt: '24px',
                    boxShadow: 'var(--box-shadow-paper)',
                    borderRadius: '15px'
                }}
            >
                <ReportTable />
            </Box>
        </Box>
    )
}
