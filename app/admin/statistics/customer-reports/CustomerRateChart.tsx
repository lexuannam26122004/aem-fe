// components/DepartmentChart.js
import React from 'react'
import ReactECharts from 'echarts-for-react'
import { Paper, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useTheme } from 'next-themes'
import { IResponse } from '@/models/Common'

interface IProps {
    responseData: IResponse
}

const CustomerRateChart = ({ responseData }: IProps) => {
    const { t } = useTranslation('common')
    const { theme } = useTheme()

    const chartData = [
        { name: t('COMMON.CUSTOMER.GOLD_CUSTOMER'), value: responseData.data.gold },
        { name: t('COMMON.CUSTOMER.SILVER_CUSTOMER'), value: responseData.data.silver },
        { name: t('COMMON.CUSTOMER.NEW_CUSTOMER'), value: responseData.data.new }
    ]

    const option = {
        tooltip: {
            trigger: 'item',
            backgroundColor: theme === 'light' ? 'rgba(250, 250, 250, 0.98)' : 'rgba(20, 26, 25, 0.98)',
            textStyle: {
                fontSize: 14,
                color: theme === 'light' ? '#000000' : '#ffffff',
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif'
            }
        },
        color: ['#E8C358', '#4285F4', '#F15B41'],
        legend: {
            orient: 'horizontal',
            left: 'center',
            top: 'bottom',
            itemGap: 20,
            textStyle: {
                fontSize: 14,
                color: theme === 'light' ? 'black' : '#fff',
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif'
            },
            selectedMode: false
        },
        series: [
            {
                name: t('COMMON.COUPON.CUSTOMER_TYPE'),
                type: 'pie',
                radius: '75%',
                center: ['50%', '40%'], // Điều chỉnh vị trí của biểu đồ tròn
                data: chartData,
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
                labelLine: {
                    show: false // Ẩn đường chỉ ra
                }
            }
        ]
    }

    return (
        <Paper
            elevation={0}
            sx={{
                width: '100%',
                padding: '24px 24px',
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
                {t('COMMON.CUSTOMER_REPORTS.CUSTOMER_DISTRIBUTION')}
            </Typography>

            <ReactECharts option={option} style={{ height: '85%', width: '100%' }} />
        </Paper>
    )
}

export default CustomerRateChart
