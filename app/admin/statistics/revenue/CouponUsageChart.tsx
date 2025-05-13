// components/Chart.js
import React from 'react'
import ReactECharts from 'echarts-for-react'
import { Box, Divider, Paper, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useTheme } from 'next-themes'
import Loading from '@/components/Loading'
//import { useGetEmployeeAttendanceQuery } from '@/services/AspNetUserService' // API mới để lấy dữ liệu tham gia

const responseData = {
    data: {
        ordersWithCoupon: 50,
        ordersWithoutCoupon: 18,
        withCouponRate: 73.53,
        withoutCouponRate: 26.47
    }
}

const Chart = () => {
    const { t } = useTranslation('common')
    const { theme } = useTheme()
    const currentDate = new Date()

    // const { data: dataResponse, isLoading } = useGetTodayAttendanceSummaryQuery(currentDate.toISOString().split('T')[0])

    const ordersWithCoupon = responseData?.data?.ordersWithCoupon || 0
    const ordersWithoutCoupon = responseData?.data?.ordersWithoutCoupon || 0
    const withoutCouponRate = responseData?.data?.withoutCouponRate || 0
    const withCouponRate = responseData?.data?.withCouponRate || 0

    const chartData = [
        { value: ordersWithCoupon, name: t('COMMON.REVENUE.ORDERS_WITH_COUPON') },
        { value: ordersWithoutCoupon, name: t('COMMON.REVENUE.ORDERS_WITHOUT_COUPON') }
    ]

    const option = {
        animation: true, // Bật hiệu ứng chuyển tiếp
        animationDuration: 700, // Thời gian chuyển tiếp (ms)
        tooltip: {
            backgroundColor: theme === 'light' ? 'rgba(250, 250, 250, 0.98)' : 'rgba(20, 26, 25, 0.98)',
            borderColor: theme === 'light' ? 'rgba(250, 250, 250, 0.98)' : 'rgba(20, 26, 25, 0.98)',
            textStyle: {
                color: theme === 'light' ? '#000000' : '#ffffff',
                fontSize: '14px',
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif'
            }
        },
        legend: {
            show: true,
            orient: 'horizontal',
            left: 'center',
            top: 'bottom',
            itemGap: 14,
            textStyle: {
                color: theme === 'light' ? 'black' : '#fff',
                fontSize: '14px',
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif'
            },
            selectedMode: false
        },
        series: [
            {
                type: 'pie',
                radius: '73%',
                center: ['50%', '42%'],

                data: chartData.map((item, index) => ({
                    ...item,
                    itemStyle: {
                        color: index === 0 ? '#3675ff' : '#f1aa2e'
                    }
                })),
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                label: {
                    show: false,
                    position: 'inside',
                    fontSize: 14,
                    fontWeight: 'bold',
                    color: theme === 'light' ? '#000' : '#fff'
                },
                labelLine: {
                    show: false
                }
            }
        ]
    }

    return (
        <Paper
            elevation={0}
            sx={{
                width: '100%',
                padding: '24px',
                backgroundColor: 'var(--background-color-item)',
                borderRadius: '15px',
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
            }}
        >
            <Box>
                <Typography
                    sx={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: 'var(--text-color)'
                    }}
                >
                    {t('COMMON.REVENUE.COUPON_USAGE_RATE')}
                </Typography>

                <ReactECharts option={option} style={{ height: '326px', width: '100%' }} />
            </Box>

            <Divider
                sx={{
                    margin: '28px -24px 24px',
                    borderStyle: 'dashed',
                    borderColor: 'var(--border-color)'
                }}
            />

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '24px',
                    flex: 1
                }}
            >
                <Box
                    sx={{
                        backgroundColor: 'var(--background-color-item-hover)',
                        padding: '6px 20px 16px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        borderRadius: '15px',
                        width: 'calc(100% / 2)'
                    }}
                >
                    <Typography
                        sx={{
                            fontWeight: 'bold',
                            color: 'var(--text-color)',
                            fontSize: '25px'
                        }}
                    >
                        {ordersWithCoupon}
                    </Typography>

                    <Box
                        sx={{
                            padding: '3px 10px',
                            borderRadius: '8px',
                            background: '#3675ff',
                            fontWeight: 'bold',
                            color: 'white'
                        }}
                    >
                        {withCouponRate}%
                    </Box>
                </Box>

                <Box
                    sx={{
                        backgroundColor: 'var(--background-color-item-hover)',
                        padding: '6px 20px 16px',
                        borderRadius: '15px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        width: 'calc(100% / 2)'
                    }}
                >
                    <Typography
                        sx={{
                            fontWeight: 'bold',
                            color: 'var(--text-color)',
                            fontSize: '25px'
                        }}
                    >
                        {ordersWithoutCoupon}
                    </Typography>

                    <Box
                        sx={{
                            padding: '3px 10px',
                            borderRadius: '8px',
                            background: '#f1aa2e',
                            fontWeight: 'bold',
                            color: 'white'
                        }}
                    >
                        {withoutCouponRate}%
                    </Box>
                </Box>
            </Box>
        </Paper>
    )
}

export default Chart
