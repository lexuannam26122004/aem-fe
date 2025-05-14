// components/DepartmentChart.js
import React from 'react'
import ReactECharts from 'echarts-for-react'
import { Paper, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useTheme } from 'next-themes'

const OrderValueChart = () => {
    const { t } = useTranslation('common')
    const { theme } = useTheme()

    const generateFakeData = () => {
        const result: { categories: string[]; low: number[]; mid: number[]; high: number[] } = {
            categories: [],
            low: [],
            mid: [],
            high: []
        }

        for (let i = 6; i >= 0; i--) {
            const date = new Date()
            date.setDate(date.getDate() - i)
            const dayStr = date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }) // ex: "14/05"
            result.categories.push(dayStr)
            result.low.push(Math.floor(Math.random() * 6) + 1)
            result.mid.push(Math.floor(Math.random() * 6) + 1)
            result.high.push(Math.floor(Math.random() * 6) + 1)
        }

        return result
    }

    const chartData = generateFakeData()

    const option = {
        animation: true,
        animationDuration: 700,
        tooltip: {
            trigger: 'axis',
            backgroundColor: theme === 'light' ? 'rgba(250, 250, 250, 0.98)' : 'rgba(20, 26, 25, 0.98)',
            borderColor: theme === 'light' ? 'rgba(250, 250, 250, 0.98)' : 'rgba(20, 26, 25, 0.98)',
            textStyle: {
                color: theme === 'light' ? '#000000' : '#ffffff',
                fontSize: 14,
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif'
            }
        },
        angleAxis: {
            type: 'category',
            axisLabel: {
                fontSize: 14,
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                color: theme === 'light' ? '#6b7280' : '#919eab'
            },
            axisLine: {
                lineStyle: {
                    color: theme === 'dark' ? '#919EAB' : '#637381'
                }
            },
            splitLine: {
                lineStyle: {
                    type: 'dashed',
                    color: theme === 'light' ? '#e9ecee' : '#333d47'
                }
            },
            data: chartData.categories
        },
        color: ['#E8C358', '#4285F4', '#F15B41'],
        radiusAxis: {
            axisLabel: {
                fontSize: 14,
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                color: theme === 'light' ? '#6b7280' : '#919eab'
            },
            axisLine: {
                lineStyle: {
                    color: theme === 'dark' ? '#919EAB' : '#637381'
                }
            },
            splitLine: {
                lineStyle: {
                    type: 'dashed',
                    color: theme === 'light' ? '#e9ecee' : '#333d47'
                }
            }
        },
        polar: {
            center: ['50%', '44%'], // Vị trí biểu đồ (theo chiều ngang, dọc)
            radius: [20, '75%'] // [bán kính trong, bán kính ngoài] (giúp điều chỉnh độ dày vòng tròn)
        },
        series: [
            {
                type: 'bar',
                data: chartData.low,
                coordinateSystem: 'polar',
                name: '< 5M',
                stack: 'a',
                emphasis: { focus: 'series' }
            },
            {
                type: 'bar',
                data: chartData.mid,
                coordinateSystem: 'polar',
                name: '5M - 20M',
                stack: 'a',
                emphasis: { focus: 'series' }
            },
            {
                type: 'bar',
                data: chartData.high,
                coordinateSystem: 'polar',
                name: '> 20M',
                stack: 'a',
                emphasis: { focus: 'series' }
            }
        ],
        legend: {
            show: true,
            left: 'center',
            top: 'bottom',
            itemGap: 25,
            data: ['< 5M', '5M - 20M', '> 20M'],
            textStyle: {
                color: theme === 'light' ? 'black' : '#fff',
                fontSize: '14px',
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif'
            }
        }
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
                {t('COMMON.ORDER_REPORTS.ORDER_VALUE_TIERS')}
            </Typography>

            <ReactECharts option={option} style={{ height: '85%', width: '100%' }} />
        </Paper>
    )
}

export default OrderValueChart
