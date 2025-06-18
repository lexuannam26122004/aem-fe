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

    const totalCustomers = responseData?.data?.totalCustomers || 0
    const totalSpending = responseData?.data?.totalSpending || 0
    const activeCustomers = responseData?.data?.totalBuyers || 0
    const totalCustomersRate = responseData?.data?.growthCustomers || 0
    const totalSpendingRate = responseData?.data?.growthSpending || 0
    const activeCustomersRate = responseData?.data?.growthBuyers || 0

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
                        width: 'calc(100% / 3)',
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
                            {t('COMMON.CUSTOMER_REPORTS.TOTAL_CUSTOMERS')}
                        </Typography>
                        <Typography
                            sx={{
                                color: 'var(--text-color)',
                                fontSize: '34px',
                                margin: '10px 5px',
                                fontWeight: 'bold'
                            }}
                        >
                            {totalCustomers}
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
                            {totalCustomersRate !== null &&
                                (!(!totalCustomersRate || totalCustomersRate >= 0) ? (
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
                            {totalCustomersRate !== null ? totalCustomersRate + '%' : t('COMMON.HOME.NO_CHANGE')}
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
                            src='/images/client_icon.png'
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
                        width: 'calc(100% / 3)',
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
                            {t('COMMON.CUSTOMER_REPORTS.TOTAL_SPENDING')}
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
                            {formatCurrency(totalSpending).replace('VNĐ', '')}
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
                            {totalSpendingRate !== null &&
                                (!(!totalSpendingRate || totalSpendingRate >= 0) ? (
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
                            {totalSpendingRate !== null ? totalSpendingRate + '%' : t('COMMON.HOME.NO_CHANGE')}
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
                            src='/images/cash-flow.png'
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
                        width: 'calc(100% / 3)',
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
                            {t('COMMON.CUSTOMER_REPORTS.ACTIVE_CUSTOMERS')}
                        </Typography>
                        <Typography
                            sx={{
                                color: 'var(--text-color)',
                                fontSize: '34px',
                                margin: '10px 5px',
                                fontWeight: 'bold'
                            }}
                        >
                            {activeCustomers}
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
                            {activeCustomersRate !== null &&
                                (!(!activeCustomersRate || activeCustomersRate >= 0) ? (
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
                            {activeCustomersRate !== null ? activeCustomersRate + '%' : t('COMMON.HOME.NO_CHANGE')}
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
                            src='/images/active_customer.png'
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
