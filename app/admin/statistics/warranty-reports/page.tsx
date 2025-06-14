'use client'

import { Box } from '@mui/material'
import DisplayInfo from './DisplayInfo'
import { TopProducts } from './TopProducts'
import ReportTable from './ReportTable'
import WarrantyRateChart from './WarrantyRateChart'
import EmployeeCountChart from './AverageTimeChart'

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
                        width: 'calc(100% / 2 - 12px)',
                        flex: 1
                    }}
                >
                    <TopProducts />
                </Box>

                <Box
                    sx={{
                        flex: 1,
                        width: 'calc(100% / 2 - 12px)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '24px'
                    }}
                >
                    <WarrantyRateChart />

                    <Box
                        sx={{
                            flex: 1
                        }}
                    >
                        <EmployeeCountChart />
                    </Box>
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
