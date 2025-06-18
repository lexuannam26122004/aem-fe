'use client'

import { Box } from '@mui/material'
import DisplayInfo from './DisplayInfo'
import RateInventoryChart from './RateInventoryChart'
import ReportTable from './ReportTable'
import TopSellingProducts from './TopSellingProducts'
import TopPurchasedProducts from './TopPurchasedProducts'
import {
    useGetInventoryOverviewQuery,
    useGetStockDistributionQuery,
    useGetTopSellingProductsQuery,
    useGetTopImportedProductsQuery
} from '@/services/InventoryReportService'
import Loading from '@/components/Loading'

export default function WarrantyReportsPage() {
    const { data: inventoryOverviewData, isLoading: isInventoryOverviewLoading } = useGetInventoryOverviewQuery()
    const { data: stockDistributionData, isLoading: isStockDistributionLoading } = useGetStockDistributionQuery()
    const { data: topSellingData, isLoading: isTopSellingLoading } = useGetTopSellingProductsQuery()
    const { data: topImportedData, isLoading: isTopImportedLoading } = useGetTopImportedProductsQuery()

    if (isInventoryOverviewLoading || isTopSellingLoading || isTopImportedLoading || isStockDistributionLoading) {
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
                    <DisplayInfo responseData={inventoryOverviewData} />
                </Box>

                <Box
                    sx={{
                        width: 'calc(100% / 3)'
                    }}
                >
                    <RateInventoryChart responseData={stockDistributionData} />
                </Box>
            </Box>

            {/* <OutOfStockTable /> */}

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
                    <TopSellingProducts data={topSellingData?.data} />
                </Box>

                <Box
                    sx={{
                        width: 'calc(100% / 2 - 12px)'
                    }}
                >
                    <TopPurchasedProducts data={topImportedData?.data} />
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
