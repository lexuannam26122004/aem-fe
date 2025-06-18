'use client'

import { Box } from '@mui/material'
import DisplayInfo from './DisplayInfo'
import OrderStatusChart from './OrderStatusChart'
import OrderValueChart from './OrderValueChart'
import ReportTable from './ReportTable'
import { useGetMonthlyOverviewQuery } from '@/services/OrderInsightsService'
import Loading from '@/components/Loading'

export default function WarrantyReportsPage() {
    const { data: displayResponse, isLoading: isDisplayLoading } = useGetMonthlyOverviewQuery()

    if (isDisplayLoading || !displayResponse) {
        return <Loading />
    }

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
                <DisplayInfo responseData={displayResponse} />
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
                    <OrderStatusChart />
                </Box>

                <Box
                    sx={{
                        width: 'calc(100% / 3)'
                    }}
                >
                    <OrderValueChart />
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
