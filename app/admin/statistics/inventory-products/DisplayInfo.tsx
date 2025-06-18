'use client'

import { Avatar, Box, Paper, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { formatCurrency } from '@/common/format'
import { IResponse } from '@/models/Common'

interface IProps {
    responseData: IResponse
}

function Page({ responseData }: IProps) {
    const { t } = useTranslation('common')

    // const { data: responseData, isLoading } = useStatsDisplayQuery(currentDate.toISOString().split('T')[0])

    const totalProducts = responseData?.data?.statsByDay?.totalProducts || 0
    const totalInventory = responseData?.data?.statsByDay?.totalInventory || 0
    const valueInventory = responseData?.data?.statsByDay?.valueInventory || 0
    const auditCount = responseData?.data?.statsByDay?.auditCount || 0
    const totalProductsRate = responseData?.data?.rate.totalProducts
    const totalInventoryRate = responseData?.data?.rate.totalInventory
    const valueInventoryRate = responseData?.data?.rate.valueInventory
    const auditCountRate = responseData?.data?.rate.auditCount

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '24px',
                flexDirection: 'column'
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '24px'
                }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        width: 'calc(100% / 2)',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        borderLeft: '6px solid #3675ff',
                        backgroundColor: 'var(--background-color-item)',
                        boxShadow: 'var(--box-shadow-paper)',
                        justifyContent: 'space-between',
                        borderRadius: '15px',
                        padding: '24px',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            backgroundColor: '#3675ff',
                            width: '40%',
                            borderRadius: '20px',
                            top: '0px',
                            right: '0px',
                            opacity: 0.15, // Làm nhạt
                            filter: 'blur(25px)', // Tạo hiệu ứng glow/mờ
                            height: '75%'
                        }}
                    />
                    <Box>
                        <Typography
                            sx={{
                                fontSize: '16px',
                                fontWeight: 'bold',
                                color: 'var(--label-title-color)'
                            }}
                        >
                            {t('COMMON.INVENTORY_PRODUCTS_REPORTS.TOTAL_PRODUCT_COUNT')}
                        </Typography>
                        <Typography
                            sx={{
                                color: 'var(--text-color)',
                                fontSize: '34px',
                                margin: '10px 5px',
                                fontWeight: 'bold'
                            }}
                        >
                            {totalProducts}
                        </Typography>
                        <Box
                            sx={{
                                mt: '5px',
                                color: 'var(--text-color)',
                                fontSize: '15px',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            {totalProductsRate !== null &&
                                (!(!totalProductsRate || totalProductsRate >= 0) ? (
                                    <img
                                        src='/images/down.svg'
                                        style={{ marginRight: '6px', width: '26px', height: '26px' }}
                                    />
                                ) : (
                                    <img
                                        src='/images/up.svg'
                                        style={{ marginRight: '6px', width: '26px', height: '26px' }}
                                    />
                                ))}
                            {totalProductsRate !== null ? totalProductsRate + '%' : t('COMMON.HOME.NO_CHANGE')}
                            <Typography
                                sx={{
                                    textTransform: 'lowercase',
                                    ml: '6px',
                                    color: 'var(--text-color)',
                                    fontSize: '15px'
                                }}
                            >
                                {t('COMMON.WARRANTY_REPORT.LAST_MONTH')}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ width: '53px', height: '53px', position: 'absolute', right: '24px' }}>
                        <Avatar
                            src='/images/box.png'
                            sx={{
                                width: '100%',
                                height: '100%',
                                borderRadius: '0'
                            }}
                        />
                    </Box>
                </Paper>

                <Paper
                    elevation={0}
                    sx={{
                        width: 'calc(100% / 2)',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        borderLeft: '6px solid #00a76f',
                        backgroundColor: 'var(--background-color-item)',
                        boxShadow: 'var(--box-shadow-paper)',
                        justifyContent: 'space-between',
                        borderRadius: '15px',
                        padding: '24px',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            backgroundColor: '#00a76f',
                            width: '40%',
                            borderRadius: '20px',
                            top: '0px',
                            right: '0px',
                            opacity: 0.15, // Làm nhạt
                            filter: 'blur(25px)', // Tạo hiệu ứng glow/mờ
                            height: '75%'
                        }}
                    />
                    <Box>
                        <Typography
                            sx={{
                                fontSize: '16px',
                                fontWeight: 'bold',
                                color: 'var(--label-title-color)'
                            }}
                        >
                            {t('COMMON.INVENTORY_PRODUCTS_REPORTS.TOTAL_STOCK_QUANTITY')}
                        </Typography>
                        <Typography
                            sx={{
                                color: 'var(--text-color)',
                                fontSize: '34px',
                                textTransform: 'lowercase',
                                margin: '10px 5px',
                                fontWeight: 'bold'
                            }}
                        >
                            {totalInventory}
                        </Typography>
                        <Box
                            sx={{
                                mt: '5px',
                                color: 'var(--text-color)',
                                fontSize: '15px',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            {totalInventoryRate !== null &&
                                (!(!totalInventoryRate || totalInventoryRate >= 0) ? (
                                    <img
                                        src='/images/down.svg'
                                        style={{ marginRight: '6px', width: '26px', height: '26px' }}
                                    />
                                ) : (
                                    <img
                                        src='/images/up.svg'
                                        style={{ marginRight: '6px', width: '26px', height: '26px' }}
                                    />
                                ))}
                            {totalInventoryRate !== null ? totalInventoryRate + '%' : t('COMMON.HOME.NO_CHANGE')}
                            <Typography
                                sx={{
                                    textTransform: 'lowercase',
                                    ml: '6px',
                                    color: 'var(--text-color)',
                                    fontSize: '15px'
                                }}
                            >
                                {t('COMMON.WARRANTY_REPORT.LAST_MONTH')}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ width: '53px', height: '53px', position: 'absolute', right: '24px' }}>
                        <Avatar
                            src='/images/check-list.png'
                            sx={{
                                width: '100%',
                                height: '100%',
                                borderRadius: '0'
                            }}
                        />
                    </Box>
                </Paper>
            </Box>

            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '24px'
                }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        width: 'calc(100% / 2)',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        borderLeft: '6px solid #CF1A2C',
                        backgroundColor: 'var(--background-color-item)',
                        boxShadow: 'var(--box-shadow-paper)',
                        justifyContent: 'space-between',
                        borderRadius: '15px',
                        padding: '24px',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            backgroundColor: '#CF1A2C',
                            width: '40%',
                            borderRadius: '20px',
                            top: '0px',
                            right: '0px',
                            opacity: 0.15, // Làm nhạt
                            filter: 'blur(25px)', // Tạo hiệu ứng glow/mờ
                            height: '75%'
                        }}
                    />
                    <Box>
                        <Typography
                            sx={{
                                fontSize: '16px',
                                fontWeight: 'bold',
                                color: 'var(--label-title-color)'
                            }}
                        >
                            {t('COMMON.INVENTORY_PRODUCTS_REPORTS.TOTAL_STOCK_VALUE')}
                        </Typography>
                        <Typography
                            sx={{
                                color: 'var(--text-color)',
                                fontSize: '34px',
                                margin: '10px 5px',
                                fontWeight: 'bold'
                            }}
                        >
                            {formatCurrency(valueInventory).replace('VNĐ', '')}
                        </Typography>
                        <Box
                            sx={{
                                mt: '5px',
                                color: 'var(--text-color)', //!(!rewardRate || rewardRate >= 0) ? '#F93C65' : '#00B69B',
                                fontSize: '15px',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            {valueInventoryRate !== null &&
                                (!(!valueInventoryRate || valueInventoryRate >= 0) ? (
                                    <img
                                        src='/images/down.svg'
                                        style={{ marginRight: '6px', width: '26px', height: '26px' }}
                                    />
                                ) : (
                                    <img
                                        src='/images/up.svg'
                                        style={{ marginRight: '6px', width: '26px', height: '26px' }}
                                    />
                                ))}
                            {valueInventoryRate !== null ? valueInventoryRate + '%' : t('COMMON.HOME.NO_CHANGE')}
                            <Typography
                                sx={{
                                    textTransform: 'lowercase',
                                    ml: '6px',
                                    color: 'var(--text-color)',
                                    fontSize: '15px'
                                }}
                            >
                                {t('COMMON.WARRANTY_REPORT.LAST_MONTH')}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ width: '53px', height: '53px', position: 'absolute', right: '24px' }}>
                        <Avatar
                            src='/images/cost.png'
                            sx={{
                                width: '100%',
                                height: '100%',
                                borderRadius: '0'
                            }}
                        />
                    </Box>
                </Paper>

                <Paper
                    elevation={0}
                    sx={{
                        width: 'calc(100% / 2)',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        borderLeft: '6px solid #f1aa2e',
                        backgroundColor: 'var(--background-color-item)',
                        boxShadow: 'var(--box-shadow-paper)',
                        justifyContent: 'space-between',
                        borderRadius: '15px',
                        padding: '24px',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            backgroundColor: '#f1aa2e',
                            width: '40%',
                            borderRadius: '20px',
                            top: '0px',
                            right: '0px',
                            opacity: 0.15, // Làm nhạt
                            filter: 'blur(25px)', // Tạo hiệu ứng glow/mờ
                            height: '75%'
                        }}
                    />
                    <Box>
                        <Typography
                            sx={{
                                fontSize: '16px',
                                fontWeight: 'bold',
                                color: 'var(--label-title-color)'
                            }}
                        >
                            {t('COMMON.INVENTORY_PRODUCTS_REPORTS.AUDIT_COUNT')}
                        </Typography>
                        <Typography
                            sx={{
                                color: 'var(--text-color)',
                                fontSize: '34px',
                                textTransform: 'lowercase',
                                margin: '10px 5px',
                                fontWeight: 'bold'
                            }}
                        >
                            {auditCount}
                        </Typography>
                        <Box
                            sx={{
                                mt: '5px',
                                color: 'var(--text-color)',
                                fontSize: '15px',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            {auditCountRate !== null &&
                                (!(!auditCountRate || auditCountRate >= 0) ? (
                                    <img
                                        src='/images/down.svg'
                                        style={{ marginRight: '6px', width: '26px', height: '26px' }}
                                    />
                                ) : (
                                    <img
                                        src='/images/up.svg'
                                        style={{ marginRight: '6px', width: '26px', height: '26px' }}
                                    />
                                ))}
                            {auditCountRate !== null ? auditCountRate + '%' : t('COMMON.HOME.NO_CHANGE')}
                            <Typography
                                sx={{
                                    textTransform: 'lowercase',
                                    ml: '6px',
                                    color: 'var(--text-color)',
                                    fontSize: '15px'
                                }}
                            >
                                {t('COMMON.WARRANTY_REPORT.LAST_MONTH')}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ width: '53px', height: '53px', position: 'absolute', right: '24px' }}>
                        <Avatar
                            src='/images/taxation.png'
                            sx={{
                                width: '100%',
                                height: '100%',
                                borderRadius: '0'
                            }}
                        />
                    </Box>
                </Paper>
            </Box>
        </Box>
    )
}

export default Page
