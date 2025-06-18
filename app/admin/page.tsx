'use client'

import { Box } from '@mui/material'
import DisplayInfo from './DisplayInfo'
import OrdersStatusChart from './OrdersStatusChart'
import FinancialOverviewChart from './FinancialOverviewChart'
import { TopProducts } from './TopProducts'
import { TopCustomers } from './TopCustomers'
import ComponentButtons from './ComponentButtons'
import ChartOrderRevenue from './ChartOrderRevenue'
import {
    useGetDashboardCardsQuery,
    useGetFinancialOverviewQuery,
    useGetOrderStatusRatioQuery,
    useGetRevenueAndOrdersQuery,
    useGetTodayStatsQuery,
    useGetTopSalesSummaryQuery
} from '@/services/HomeService'
import Loading from '@/components/Loading'

export default function HomePage() {
    const { data: todayResponse, isLoading } = useGetTodayStatsQuery()
    const { data: topSalesResponse, isLoading: isTopSalesLoading } = useGetTopSalesSummaryQuery()
    const { data: revenueResponse, isLoading: isRevenueLoading } = useGetRevenueAndOrdersQuery(14)
    const { data: financialResponse, isLoading: isFinancialLoading } = useGetFinancialOverviewQuery()
    const { data: dashboardResponse, isLoading: isDashboardLoading } = useGetDashboardCardsQuery()
    const { data: orderStatusResponse, isLoading: isOrderStatusLoading } = useGetOrderStatusRatioQuery()

    if (
        isLoading ||
        isTopSalesLoading ||
        isRevenueLoading ||
        isFinancialLoading ||
        isDashboardLoading ||
        isOrderStatusLoading
    ) {
        return <Loading />
    }

    return (
        <Box
            sx={{
                maxWidth: '1200px',
                margin: '0 auto'
            }}
        >
            <DisplayInfo dataResponse={todayResponse} />

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
                    <FinancialOverviewChart responseData={financialResponse} />
                </Box>

                <Box
                    sx={{
                        width: 'calc(100% / 3)',
                        boxShadow: 'var(--box-shadow-paper)',
                        borderRadius: '15px'
                    }}
                >
                    <OrdersStatusChart responseData={orderStatusResponse} />
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
                    <ComponentButtons responseData={dashboardResponse} />
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
                    <ChartOrderRevenue responseData={revenueResponse} />
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
                        width: 'calc(100% / 2 - 12px)',
                        boxShadow: 'var(--box-shadow-paper)',
                        borderRadius: '15px',
                        backgroundColor: 'var(--background-color-item)',
                        padding: '24px'
                    }}
                >
                    <TopProducts data={topSalesResponse.data.topProducts} />
                </Box>

                <Box
                    sx={{
                        width: 'calc(100% / 2 - 12px)',
                        boxShadow: 'var(--box-shadow-paper)',
                        borderRadius: '15px',
                        backgroundColor: 'var(--background-color-item)',
                        padding: '24px'
                    }}
                >
                    <TopCustomers data={topSalesResponse.data.topCustomers} />
                </Box>
            </Box>
        </Box>
    )
}
