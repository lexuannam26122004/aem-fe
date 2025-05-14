// components/DepartmentChart.js
import React from 'react'
import ReactECharts from 'echarts-for-react'
import { Paper, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useTheme } from 'next-themes'

const WarrantyRateChart = () => {
    const { t } = useTranslation('common')
    const { theme } = useTheme()

    const chartData = [
        { name: t('COMMON.WARRANTY_REPORT.REPAIR'), value: 300 },
        { name: t('COMMON.WARRANTY_REPORT.REPLACE'), value: 180 },
        { name: t('COMMON.WARRANTY_REPORT.MAINTENANCE'), value: 140 },
        { name: t('COMMON.WARRANTY_REPORT.UPGRADE'), value: 35 },
        { name: t('COMMON.WARRANTY_REPORT.OTHER'), value: 65 }
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
        color: ['#4285F4', '#E8C358', '#2B6CA3', '#F15B41', '#7CB9E8'],
        legend: {
            orient: 'vertical',
            left: 'left',
            top: 'center',
            itemGap: 25,
            padding: [0, 0, 0, 50],
            textStyle: {
                fontSize: 14,
                color: theme === 'light' ? 'black' : '#fff',
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif'
            },
            selectedMode: false
        },
        series: [
            {
                name: t('COMMON.WARRANTY_REPORT.WARRANTY_TYPE'),
                type: 'pie',
                radius: '90%',
                center: ['65%', '50%'], // Điều chỉnh vị trí của biểu đồ tròn
                data: chartData,
                emphasis: {
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
                padding: '24px 24px 15px',
                boxShadow: 'var(--box-shadow-paper)',
                backgroundColor: 'var(--background-color-item)',
                borderRadius: '15px'
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
                {t('COMMON.WARRANTY_REPORT.WARRANTY_RATE_BY_TYPE')}
            </Typography>

            <ReactECharts option={option} style={{ height: '270px', width: '100%' }} />
        </Paper>
    )
}

export default WarrantyRateChart
