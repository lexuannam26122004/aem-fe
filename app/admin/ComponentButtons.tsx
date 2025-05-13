'use client'

import { Avatar, Box, Paper, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import ReactECharts from 'echarts-for-react'
import { useTheme } from 'next-themes'
import { ExternalLink } from 'lucide-react'

const responseData = {
    data: {
        pendingQuotations: 10,
        pendingOrders: 0,
        unpaidPurchases: 3
    }
}

function ComponentButtons() {
    const { t } = useTranslation('common')
    const currentDate = new Date()

    // const { data: responseData, isLoading } = useStatsDisplayQuery(currentDate.toISOString().split('T')[0])

    const pendingQuotations = responseData?.data?.pendingQuotations || 0
    const pendingOrders = responseData?.data?.pendingOrders || 0
    const unpaidPurchases = responseData?.data?.unpaidPurchases || 0
    const { theme } = useTheme()

    // if (isLoading) {
    //     return <Loading />
    // }

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
                    gap: '24px',
                    flexDirection: 'column'
                }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        borderLeft: '6px solid #29C5EE',
                        backgroundColor: 'var(--background-color-item)',
                        boxShadow: 'var(--box-shadow-paper)',
                        justifyContent: 'space-between',
                        borderRadius: '15px',
                        padding: '20px 22px 18px 18px',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            backgroundColor: '#29C5EE',
                            width: '40%',
                            borderRadius: '20px',
                            top: '0px',
                            right: '0px',
                            opacity: 0.15, // Làm nhạt
                            filter: 'blur(25px)', // Tạo hiệu ứng glow/mờ
                            height: '75%'
                        }}
                    />
                    <Box width={'100%'}>
                        <Box
                            sx={{
                                display: 'flex',
                                gap: '16px'
                            }}
                        >
                            <Avatar
                                src='/images/order.svg'
                                sx={{
                                    width: '50px',
                                    height: '50px'
                                }}
                            />
                            <Box>
                                <Typography
                                    sx={{
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        color: 'var(--text-color)'
                                    }}
                                >
                                    {t('COMMON.HOME.PENDING_ORDERS')}
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: '13px',
                                        mt: '4px',
                                        color: 'var(--label-title-color)'
                                    }}
                                >
                                    {t('COMMON.HOME.PENDING_ORDERS_SUBTITLE')}
                                </Typography>
                            </Box>
                        </Box>

                        <Box
                            sx={{
                                display: 'flex',
                                marginTop: '5px',
                                marginLeft: '5px',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: '10px',
                                    alignItems: 'end'
                                }}
                            >
                                <Typography
                                    sx={{
                                        color: 'var(--text-color)',
                                        fontSize: '34px',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {pendingOrders}
                                </Typography>

                                <Typography
                                    sx={{
                                        color: '#00B85E',
                                        fontSize: '15px',
                                        textTransform: 'lowercase',
                                        mb: '10px'
                                    }}
                                >
                                    {t('COMMON.HOME.ORDERS')}
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    userSelect: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '13px',
                                    zIndex: 2,
                                    borderRadius: '50%',
                                    backgroundColor: 'var(--background-color-item-hover)',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        backgroundColor: 'var(--background-color-item-selected)'
                                    }
                                }}
                            >
                                <ExternalLink color='var(--text-color)' size={20} />
                            </Box>
                        </Box>
                    </Box>
                </Paper>

                <Paper
                    elevation={0}
                    sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        borderLeft: '6px solid #CF1A2C',
                        backgroundColor: 'var(--background-color-item)',
                        boxShadow: 'var(--box-shadow-paper)',
                        justifyContent: 'space-between',
                        borderRadius: '15px',
                        padding: '20px 22px 18px 18px',
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
                    <Box width={'100%'}>
                        <Box
                            sx={{
                                display: 'flex',
                                gap: '16px'
                            }}
                        >
                            <Avatar
                                src='/images/quotation.svg'
                                sx={{
                                    width: '50px',
                                    height: '50px'
                                }}
                            />
                            <Box>
                                <Typography
                                    sx={{
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        color: 'var(--text-color)'
                                    }}
                                >
                                    {t('COMMON.HOME.PENDING_QUOTATIONS')}
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: '13px',
                                        mt: '4px',
                                        color: 'var(--label-title-color)'
                                    }}
                                >
                                    {t('COMMON.HOME.PENDING_QUOTATIONS_SUBTITLE')}
                                </Typography>
                            </Box>
                        </Box>

                        <Box
                            sx={{
                                display: 'flex',
                                marginTop: '5px',
                                marginLeft: '5px',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: '10px',
                                    alignItems: 'end'
                                }}
                            >
                                <Typography
                                    sx={{
                                        color: 'var(--text-color)',
                                        fontSize: '34px',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {pendingQuotations}
                                </Typography>

                                <Typography
                                    sx={{
                                        color: '#00B85E',
                                        fontSize: '15px',
                                        textTransform: 'lowercase',
                                        mb: '10px'
                                    }}
                                >
                                    {t('COMMON.HOME.QUOTATIONS')}
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    userSelect: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '13px',
                                    zIndex: 2,
                                    borderRadius: '50%',
                                    backgroundColor: 'var(--background-color-item-hover)',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        backgroundColor: 'var(--background-color-item-selected)'
                                    }
                                }}
                            >
                                <ExternalLink color='var(--text-color)' size={20} />
                            </Box>
                        </Box>
                    </Box>
                </Paper>

                <Paper
                    elevation={0}
                    sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        borderLeft: '6px solid #EAB04D',
                        backgroundColor: 'var(--background-color-item)',
                        boxShadow: 'var(--box-shadow-paper)',
                        justifyContent: 'space-between',
                        borderRadius: '15px',
                        padding: '20px 22px 18px 18px',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            backgroundColor: '#EAB04D',
                            width: '40%',
                            borderRadius: '20px',
                            top: '0px',
                            right: '0px',
                            opacity: 0.15, // Làm nhạt
                            filter: 'blur(25px)', // Tạo hiệu ứng glow/mờ
                            height: '75%'
                        }}
                    />
                    <Box width={'100%'}>
                        <Box
                            sx={{
                                display: 'flex',
                                gap: '16px'
                            }}
                        >
                            <Avatar
                                src='/images/coin.svg'
                                sx={{
                                    width: '50px',
                                    height: '50px'
                                }}
                            />
                            <Box>
                                <Typography
                                    sx={{
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        color: 'var(--text-color)'
                                    }}
                                >
                                    {t('COMMON.HOME.UNPAID_PURCHASE_ORDERS')}
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: '13px',
                                        mt: '4px',
                                        color: 'var(--label-title-color)'
                                    }}
                                >
                                    {t('COMMON.HOME.UNPAID_PURCHASE_ORDERS_SUBTITLE')}
                                </Typography>
                            </Box>
                        </Box>

                        <Box
                            sx={{
                                display: 'flex',
                                marginTop: '5px',
                                marginLeft: '5px',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: '10px',
                                    alignItems: 'end'
                                }}
                            >
                                <Typography
                                    sx={{
                                        color: 'var(--text-color)',
                                        fontSize: '34px',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {unpaidPurchases}
                                </Typography>

                                <Typography
                                    sx={{
                                        color: '#00B85E',
                                        fontSize: '15px',
                                        textTransform: 'lowercase',
                                        mb: '10px'
                                    }}
                                >
                                    {t('COMMON.HOME.ORDERS')}
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    userSelect: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '13px',
                                    zIndex: 2,
                                    borderRadius: '50%',
                                    backgroundColor: 'var(--background-color-item-hover)',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        backgroundColor: 'var(--background-color-item-selected)'
                                    }
                                }}
                            >
                                <ExternalLink color='var(--text-color)' size={20} />
                            </Box>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Box>
    )
}

export default ComponentButtons
