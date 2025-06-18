// components/DepartmentChart.js
import React, { useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import { Paper, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useTheme } from 'next-themes'
import { IResponse } from '@/models/Common'

interface IProps {
    responseData: IResponse
}

const RateInventoryChart = ({ responseData }: IProps) => {
    const { t } = useTranslation('common')
    const { theme } = useTheme()

    const chartData = responseData?.data

    const translatedChartData = useMemo(() => {
        if (!chartData) return []

        console.log(chartData)

        return chartData.map(row => {
            if (typeof row.name === 'string') {
                return { name: t(row.name), value: row.value }
            }
            return row
        })
    }, [chartData, t])

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
                name: t('COMMON.INVENTORY_PRODUCTS_REPORTS.PRODUCT_QUANTITY'),
                type: 'pie',
                center: ['50%', '37%'],
                radius: ['25%', '70%'],
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
                data: translatedChartData
            }
        ]
    }

    return (
        <Paper
            elevation={0}
            sx={{
                width: '100%',
                padding: '24px 24px 20px',
                boxShadow: 'var(--box-shadow-paper)',
                backgroundColor: 'var(--background-color-item)',
                borderRadius: '15px',
                height: '100%'
            }}
        >
            <Typography
                sx={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    mb: '15px',
                    color: 'var(--text-color)'
                }}
            >
                {t('COMMON.INVENTORY_PRODUCTS_REPORTS.INVENTORY_STATUS_DISTRIBUTION')}
            </Typography>

            <ReactECharts option={option} style={{ height: '86%', width: '100%' }} />
        </Paper>
    )
}

export default RateInventoryChart
