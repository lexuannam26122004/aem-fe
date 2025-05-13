import React from 'react'
import ReactECharts from 'echarts-for-react'
import { Box, Paper } from '@mui/material'
import { Typography } from '@mui/material'
import { useTheme } from 'next-themes'
import { useTranslation } from 'react-i18next'
import Loading from '@/components/Loading'

const responseData = {
    data: {
        totalOrders: 200,
        byStatus: {
            success: 100, // Đơn hàng thành công
            cancelled: 60, // Đơn hàng bị hủy
            returned: 40 // Đơn hàng bị trả
        },
        percentage: {
            success: 50,
            cancelled: 30,
            returned: 20
        }
    }
}

const OrdersStatusChart = () => {
    const { t } = useTranslation('common')
    const { theme } = useTheme()

    const status = responseData.data

    const option = {
        title: {
            left: 'center',
            textStyle: {
                fontFamily: 'Arial',
                color: theme === 'light' ? '#000' : '#fff', // Màu chữ tùy theo chủ đề
                fontSize: 15, // Kích thước chữ
                fontWeight: 'bold' // Đậm
            }
        },
        tooltip: {
            trigger: 'item',
            backgroundColor: theme === 'light' ? 'rgba(250, 250, 250, 0.98)' : 'rgba(20, 26, 25, 0.98)',
            textStyle: {
                color: theme === 'light' ? '#000000' : '#ffffff'
            }
        },
        grid: {
            top: '0',
            containLabel: true
        },
        legend: {
            orient: 'vertical',
            left: 'center',
            bottom: '0px',
            itemGap: 14,
            textStyle: {
                color: theme === 'light' ? '#000000' : '#ffffff',
                fontSize: 14,
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif'
            },
            formatter: (name: string) => {
                const percent =
                    t('COMMON.HOME.SUCCESSFUL_ORDERS') === name
                        ? status.percentage.success?.toFixed(2)
                        : name === t('COMMON.HOME.CANCELLED_ORDERS')
                        ? status.percentage.cancelled?.toFixed(2)
                        : status.percentage.returned?.toFixed(2)
                return `${name}  (${percent}%)`
            },
            selectedMode: false
        },
        series: [
            {
                name: t('COMMON.HOME.ORDERS_STATUS'),
                type: 'pie',
                radius: [30, '80%'],
                center: ['50%', '40%'],
                data: [
                    {
                        value: status.byStatus.success,
                        name: t('COMMON.HOME.SUCCESSFUL_ORDERS'),
                        itemStyle: {
                            color: '#3675ff'
                        }
                    },
                    {
                        value: status.byStatus.returned,
                        name: t('COMMON.HOME.RETURNED_ORDERS'),
                        itemStyle: {
                            color: '#ffab00'
                        }
                    },
                    {
                        value: status.byStatus.cancelled,
                        name: t('COMMON.HOME.CANCELLED_ORDERS'),
                        itemStyle: {
                            color: '#c23531'
                        }
                    }
                ].sort(function (a, b) {
                    return a.value - b.value
                }),
                roseType: 'area',
                itemStyle: {
                    borderRadius: 8
                },
                label: {
                    show: false,
                    formatter: '{d}%',
                    position: 'inside',
                    color: '#dccfcf',
                    fontSize: 11
                },
                animationType: 'scale',
                animationEasing: 'elasticOut',
                animationDelay: function () {
                    return Math.random() * 200
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
                height: '100%'
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'top' }}>
                <Typography
                    sx={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: 'var(--text-color)'
                    }}
                >
                    {t('COMMON.HOME.ORDERS_STATUS')}
                </Typography>
            </Box>
            <ReactECharts option={option} style={{ height: '415px', width: '100%' }} />
        </Paper>
    )
}

export default OrdersStatusChart
