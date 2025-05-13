'use client'

import { Box } from '@mui/material'
import DisplayInfo from './DisplayInfo'
import { TopProducts } from './TopProducts'

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
                        width: 'calc(100% / 2 + 12px)'
                    }}
                >
                    <TopProducts />
                </Box>
                <Box
                    sx={{
                        width: 'calc(100% / 2 + 12px)'
                    }}
                ></Box>
            </Box>
        </Box>
    )
}
