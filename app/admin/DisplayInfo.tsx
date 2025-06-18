'use client'

import { Box, Paper, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import ReactECharts from 'echarts-for-react'
import { useTheme } from 'next-themes'
import { IResponse } from '@/models/Common'
// import { useStatsDisplayQuery } from '@/services/TimekeepingService'

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount).replace('₫', '')
}

const getLastWeekDays = (daysOfWeek: string[]) => {
    const currentDate = new Date()
    const currentDay = currentDate.getDay()

    const weekDays = []
    for (let i = 0; i < 7; i++) {
        const dayIndex = (currentDay + i) % 7
        weekDays.push(daysOfWeek[dayIndex])
    }
    return weekDays
}

const colors = ['#00a76f', '#3675ff', '#ff5630', '#f83696', '#ffab00', '#b863f0']

interface IPageProps {
    dataResponse: IResponse
}

function Page({ dataResponse }: IPageProps) {
    const { t } = useTranslation('common')
    const daysOfWeek = [
        t('COMMON.WEEK.SUNDAY'),
        t('COMMON.WEEK.MONDAY'),
        t('COMMON.WEEK.TUESDAY'),
        t('COMMON.WEEK.WEDNESDAY'),
        t('COMMON.WEEK.THURSDAY'),
        t('COMMON.WEEK.FRIDAY'),
        t('COMMON.WEEK.SATURDAY')
    ]

    // const { data: responseData, isLoading } = useStatsDisplayQuery(currentDate.toISOString().split('T')[0])

    const revenue = dataResponse?.data?.statsByDay[0]?.revenue || 0
    const orders = dataResponse?.data?.statsByDay[0]?.orders || 0
    const newCustomers = dataResponse?.data?.statsByDay[0]?.newCustomers || 0
    const revenuePercent = dataResponse?.data?.rate.revenue
    const ordersPercent = dataResponse?.data?.rate.orders
    const newCustomersPercent = dataResponse?.data?.rate.newCustomers
    const { theme } = useTheme()

    const getOption = (data: number[], color: string) => {
        return {
            animation: true,
            animationDuration: 700,
            tooltip: {
                trigger: 'axis',
                confine: false,
                appendToBody: true,
                backgroundColor: theme === 'light' ? 'rgba(250, 250, 250, 0.98)' : 'rgba(20, 26, 25, 0.98)',
                borderColor: theme === 'light' ? 'rgba(250, 250, 250, 0.98)' : 'rgba(20, 26, 25, 0.98)',
                textStyle: {
                    color: theme === 'light' ? '#000000' : '#ffffff'
                },
                extraCssText: 'width: 100px; white-space: normal; word-wrap: break-word;' // Thêm CSS để thay đổi chiều rộng
            },
            title: {
                text: 'My Chart',
                show: false
            },
            xAxis: {
                type: 'category',
                data: getLastWeekDays(daysOfWeek),
                axisLine: { show: false },
                axisTick: { show: false },
                axisLabel: { show: false }
            },
            yAxis: {
                type: 'value',
                axisLine: { show: false },
                axisTick: { show: false },
                axisLabel: { show: false },
                splitLine: { show: false }
            },
            series: [
                {
                    data: data, // Dữ liệu động
                    type: 'bar',
                    itemStyle: {
                        color: color,
                        borderRadius: [2.2, 2.2, 0, 0]
                    },
                    label: {
                        show: false
                    }
                }
            ],
            grid: {
                left: '0',
                right: '0',
                top: '0',
                bottom: '0'
            }
        }
    }

    // const dataSet = responseData?.Data?.DataSet || {}

    const dataSet = {
        revenue: [12000000, 11000000, 11500000, 13000000, 12500000, 13500000, 14500000], // Hôm nay là 14,500,000 VNĐ
        orders: [15, 10, 12, 20, 18, 25, 30],
        newCustomers: [5, 7, 6, 4, 8, 3, 6]
    }

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
                            {t('COMMON.HOME.TODAY_REVENUE')}
                        </Typography>
                        <Typography
                            sx={{
                                color: 'var(--text-color)',
                                fontSize: '34px',
                                margin: '10px 5px',
                                fontWeight: 'bold'
                            }}
                        >
                            {formatCurrency(revenue)}
                        </Typography>
                        <Box
                            sx={{
                                mt: '5px',
                                color: 'var(--text-color)', //!(!rewardPercent || rewardPercent >= 0) ? '#F93C65' : '#00B69B',
                                fontSize: '15px',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            {revenuePercent !== null &&
                                (!(!revenuePercent || revenuePercent >= 0) ? (
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
                            {revenuePercent !== null ? revenuePercent + '%' : t('COMMON.HOME.NO_CHANGE')}
                            <Typography
                                sx={{
                                    ml: '6px',
                                    color: 'var(--text-color)',
                                    fontSize: '15px'
                                }}
                            >
                                {t('COMMON.HOME.YESTERDAY')}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ width: '60px', height: '40px', position: 'absolute', right: '24px' }}>
                        <ReactECharts
                            option={getOption(dataSet.revenue, colors[1])}
                            style={{ width: '100%', height: '100%' }}
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
                            {t('COMMON.HOME.TODAY_ORDERS')}
                        </Typography>
                        <Typography
                            sx={{
                                color: 'var(--text-color)',
                                fontSize: '34px',
                                margin: '10px 5px',
                                fontWeight: 'bold'
                            }}
                        >
                            {orders}
                        </Typography>
                        <Box
                            sx={{
                                mt: '5px',
                                color: 'var(--text-color)', //!(!rewardPercent || rewardPercent >= 0) ? '#F93C65' : '#00B69B',
                                fontSize: '15px',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            {ordersPercent !== null &&
                                (!(!ordersPercent || ordersPercent >= 0) ? (
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
                            {ordersPercent !== null ? ordersPercent + '%' : t('COMMON.HOME.NO_CHANGE')}
                            <Typography
                                sx={{
                                    ml: '6px',
                                    color: 'var(--text-color)',
                                    fontSize: '15px'
                                }}
                            >
                                {t('COMMON.HOME.YESTERDAY')}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ width: '60px', height: '40px', position: 'absolute', right: '24px' }}>
                        <ReactECharts
                            option={getOption(dataSet.orders, colors[0])}
                            style={{ width: '100%', height: '100%' }}
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
                            {t('COMMON.HOME.NEW_CUSTOMERS')}
                        </Typography>
                        <Typography
                            sx={{
                                color: 'var(--text-color)',
                                fontSize: '34px',
                                margin: '10px 5px',
                                fontWeight: 'bold'
                            }}
                        >
                            {newCustomers}
                        </Typography>
                        <Box
                            sx={{
                                mt: '5px',
                                color: 'var(--text-color)', //!(!rewardPercent || rewardPercent >= 0) ? '#F93C65' : '#00B69B',
                                fontSize: '15px',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            {newCustomersPercent !== null &&
                                (!(!newCustomersPercent || newCustomersPercent >= 0) ? (
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
                            {newCustomersPercent !== null ? newCustomersPercent + '%' : t('COMMON.HOME.NO_CHANGE')}
                            <Typography
                                sx={{
                                    ml: '6px',
                                    color: 'var(--text-color)',
                                    fontSize: '15px'
                                }}
                            >
                                {t('COMMON.HOME.YESTERDAY')}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ width: '60px', height: '40px', position: 'absolute', right: '24px' }}>
                        <ReactECharts
                            option={getOption(dataSet.newCustomers, '#f1aa2e')}
                            style={{ width: '100%', height: '100%' }}
                        />
                    </Box>
                </Paper>
            </Box>
        </Box>
    )
}

export default Page
