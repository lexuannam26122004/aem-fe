'use client'

import { Box } from '@mui/material'
import DisplayInfo from './DisplayInfo'
import CustomerRateChart from './CustomerRateChart'
import ChartOrderRevenue from './CustomerTrendChart'
import ReportTable from './ReportTable'
import { useGetCustomerGroupDistributionQuery, useGetCustomerOverviewQuery } from '@/services/CustomerReportService'
import Loading from '@/components/Loading'

export default function WarrantyReportsPage() {
    const { data: overview, isLoading: isOverviewLoading } = useGetCustomerOverviewQuery()

    const { data: groupDistribution, isLoading: isGroupDistributionLoading } = useGetCustomerGroupDistributionQuery()

    if (isOverviewLoading || isGroupDistributionLoading) {
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
                <DisplayInfo responseData={overview} />
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
                    <CustomerRateChart responseData={groupDistribution} />
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
