'use client'

import { Box } from '@mui/material'
import CouponUsageChart from './CouponUsageChart'
import DisplayInfo from './DisplayInfo'
import SalesHeatmapByTime from './SalesHeatmapByTime'
import ReportTable from './ReportTable'
import {
    useGetCouponUsageRateQuery,
    useGetQuotationOrderStatsQuery,
    useGetWeeklySalesHeatmapQuery
} from '@/services/RevenueServices'
import Loading from '@/components/Loading'

export default function RevenuePage() {
    const { data: quotationStats, isLoading: isLoadingQuotation } = useGetQuotationOrderStatsQuery()
    const { data: couponUsageRate, isLoading: isLoadingCouponUsage } = useGetCouponUsageRateQuery()
    const { data: heatmap, isLoading: isLoadingHeatmap } = useGetWeeklySalesHeatmapQuery()

    if (isLoadingQuotation || isLoadingHeatmap || isLoadingCouponUsage) {
        return <Loading />
    }

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
                    <DisplayInfo dataResponse={quotationStats} />
                </Box>

                <Box
                    sx={{
                        width: 'calc(100% / 3)',
                        boxShadow: 'var(--box-shadow-paper)',
                        borderRadius: '15px'
                    }}
                >
                    <CouponUsageChart responseData={couponUsageRate} />
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
                <SalesHeatmapByTime responseData={heatmap} />
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
