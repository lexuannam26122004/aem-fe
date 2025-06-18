// components/DepartmentChart.js
import React from 'react'
import ReactECharts from 'echarts-for-react'
import { Paper, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useTheme } from 'next-themes'

interface IProps {
    data: any
}

const RateInventoryChart = ({ data }: IProps) => {
    const { t } = useTranslation('common')
    const { theme } = useTheme()

    const chartData = [
        { name: t('COMMON.ORDER.RETURNED'), value: data.returned },
        { name: t('COMMON.ORDER.CANCELLED'), value: data.cancelled },
        { name: t('COMMON.ORDER.DELIVERED'), value: data.completed }
    ]

    const option = {
        tooltip: {
            trigger: 'item',
            backgroundColor: theme === 'light' ? 'rgba(250, 250, 250, 0.98)' : 'rgba(20, 26, 25, 0.98)',
            borderColor: theme === 'light' ? 'rgba(250, 250, 250, 0.98)' : 'rgba(20, 26, 25, 0.98)',
            textStyle: {
                color: theme === 'light' ? '#000000' : '#ffffff',
                fontSize: 14,
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif'
            }
        },
        legend: {
            show: true,
            left: 'center',
            top: 'bottom',
            itemGap: 20,
            textStyle: {
                color: theme === 'light' ? 'black' : '#fff',
                fontSize: '14px',
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif'
            }
        },
        color: ['#13eeaa', '#ffbd34', '#ff5d13'],
        series: [
            {
                name: t('COMMON.ORDER.STATUS'),
                type: 'pie',
                center: ['50%', '42%'],
                radius: ['25%', '72%'],
                avoidLabelOverlap: false,
                label: {
                    show: true,
                    position: 'inside',
                    formatter: function (params: any) {
                        return params.percent >= 10 ? `${params.percent}%` : ''
                    },
                    fontSize: 13,
                    fontWeight: 'bold',
                    color: '#FFFFFF'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 16,
                        fontWeight: 'bold'
                    },
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                labelLine: {
                    show: false
                },
                data: chartData
            }
        ]
    }

    return (
        <Paper
            elevation={0}
            sx={{
                width: '100%',
                padding: '24px 24px 20px',
                backgroundColor: 'var(--background-color-secondary)',
                borderRadius: '15px',
                height: '100%'
            }}
        >
            <Typography
                sx={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    mb: '15px',
                    color: 'var(--text-color)'
                }}
            >
                {t('COMMON.CUSTOMER.ORDER_STATUS_OVERVIEW')}
            </Typography>

            <ReactECharts option={option} style={{ height: '86%', width: '100%' }} />
        </Paper>
    )
}

export default RateInventoryChart
