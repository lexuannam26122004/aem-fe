'use client'

import { Box, Paper, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import ReactECharts from 'echarts-for-react'
import { useTheme } from 'next-themes'
import { IResponse } from '@/models/Common'

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

interface IProps {
    dataResponse: IResponse
}

export default function DisplayInfo({ dataResponse }: IProps) {
    const { t } = useTranslation('common')
    const { theme } = useTheme()

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

    const quotationsSent = dataResponse?.data?.statsByDay?.quotationsSent || 0
    const quotationConverted = dataResponse?.data?.statsByDay?.quotationConverted || 0
    const totalDiscount = dataResponse?.data?.statsByDay?.totalDiscount || 0
    const grossProfit = dataResponse?.data?.statsByDay?.grossProfit || 0

    const quotationsSentRate = dataResponse?.data?.rate?.quotationsSentRate
    const quotationConvertedRate = dataResponse?.data?.rate?.quotationConvertedRate
    const totalDiscountRate = dataResponse?.data?.rate?.totalDiscountRate
    const grossProfitRate = dataResponse?.data?.rate?.grossProfitRate

    const revenue = dataResponse?.data?.statsByDay?.revenue || 0
    const orders = dataResponse?.data?.statsByDay?.orders || 0
    const revenueRate = dataResponse?.data?.rate?.revenueRate
    const ordersRate = dataResponse?.data?.rate?.ordersRate

    const dataSet = dataResponse?.data?.weekData

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
                            {revenueRate !== null &&
                                (!(!revenueRate || revenueRate >= 0) ? (
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
                            {revenueRate !== null ? revenueRate + '%' : t('COMMON.HOME.NO_CHANGE')}
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
                            option={getOption(dataSet.revenue, '#3675ff')}
                            style={{ width: '100%', height: '100%' }}
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
                            {ordersRate !== null &&
                                (!(!ordersRate || ordersRate >= 0) ? (
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
                            {ordersRate !== null ? ordersRate + '%' : t('COMMON.HOME.NO_CHANGE')}
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
                            option={getOption(dataSet.orders, '#00a76f')}
                            style={{ width: '100%', height: '100%' }}
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
                            {t('COMMON.REVENUE.TOTAL_DISCOUNT_VALUE')}
                        </Typography>
                        <Typography
                            sx={{
                                color: 'var(--text-color)',
                                fontSize: '34px',
                                margin: '10px 5px',
                                fontWeight: 'bold'
                            }}
                        >
                            {formatCurrency(totalDiscount)}
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
                            {totalDiscountRate !== null &&
                                (!(!totalDiscountRate || totalDiscountRate >= 0) ? (
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
                            {totalDiscountRate !== null ? totalDiscountRate + '%' : t('COMMON.HOME.NO_CHANGE')}
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
                            option={getOption(dataSet.totalDiscount, '#CF1A2C')}
                            style={{ width: '100%', height: '100%' }}
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
                            {t('COMMON.REVENUE.GROSS_PROFIT')}
                        </Typography>
                        <Typography
                            sx={{
                                color: 'var(--text-color)',
                                fontSize: '34px',
                                margin: '10px 5px',
                                fontWeight: 'bold'
                            }}
                        >
                            {formatCurrency(grossProfit)}
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
                            {grossProfitRate !== null &&
                                (!(!grossProfitRate || grossProfitRate >= 0) ? (
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
                            {grossProfitRate !== null ? grossProfitRate + '%' : t('COMMON.HOME.NO_CHANGE')}
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
                            option={getOption(dataSet.grossProfit, '#f1aa2e')}
                            style={{ width: '100%', height: '100%' }}
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
                        borderLeft: '6px solid #2fcab1',
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
                            backgroundColor: '#2fcab1',
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
                            {t('COMMON.REVENUE.QUOTATIONS_SENT')}
                        </Typography>
                        <Typography
                            sx={{
                                color: 'var(--text-color)',
                                fontSize: '34px',
                                margin: '10px 5px',
                                fontWeight: 'bold'
                            }}
                        >
                            {quotationsSent}
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
                            {quotationsSentRate !== null &&
                                (!(!quotationsSentRate || quotationsSentRate >= 0) ? (
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
                            {quotationsSentRate !== null ? quotationsSentRate + '%' : t('COMMON.HOME.NO_CHANGE')}
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
                            option={getOption(dataSet.quotationsSent, '#2fcab1')}
                            style={{ width: '100%', height: '100%' }}
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
                        borderLeft: '6px solid #f83696',
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
                            backgroundColor: '#f83696',
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
                            {t('COMMON.REVENUE.QUOTATIONS_CONVERTED')}
                        </Typography>
                        <Typography
                            sx={{
                                color: 'var(--text-color)',
                                fontSize: '34px',
                                margin: '10px 5px',
                                fontWeight: 'bold'
                            }}
                        >
                            {quotationConverted}
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
                            {quotationConvertedRate !== null &&
                                (!(!quotationConvertedRate || quotationConvertedRate >= 0) ? (
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
                            {quotationConvertedRate !== null
                                ? quotationConvertedRate + '%'
                                : t('COMMON.HOME.NO_CHANGE')}
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
                            option={getOption(dataSet.quotationConverted, '#f83696')}
                            style={{ width: '100%', height: '100%' }}
                        />
                    </Box>
                </Paper>
            </Box>
        </Box>
    )
}
