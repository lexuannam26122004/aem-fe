'use client'
import React from 'react'
import ReactEcharts from 'echarts-for-react'
import { useTheme } from 'next-themes'
import { useTranslation } from 'react-i18next'

export default function Chart() {
    const { theme } = useTheme()
    const { t } = useTranslation('common')

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const option = {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'axis',
            backgroundColor: theme === 'light' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(35, 40, 50, 0.9)',
            borderColor: theme === 'light' ? '#e6e6e6' : '#4d4d4d',
            borderWidth: 1,
            textStyle: {
                color: theme === 'light' ? '#333333' : '#ffffff'
            },
            formatter: function (params: any): string {
                const param = params[0]
                const formattedValue =
                    param.value >= 1000 ? (param.value / 1000).toFixed(0) + 'K' : param.value.toLocaleString()

                return `${
                    param.name
                }<br/><span style="display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;background-color:${
                    param.color
                };"></span>${t('COMMON.CUSTOMER.AVERAGE_VALUE')}: ${formattedValue} VNĐ`
            },
            extraCssText: 'box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);'
        },
        grid: {
            left: '1%',
            right: '1%',
            bottom: '0%',
            top: '14%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: months,
            axisLine: {
                lineStyle: {
                    color: theme === 'light' ? '#d9d9d9' : '#444444'
                }
            },
            axisLabel: {
                color: theme === 'light' ? '#333333' : '#e1e1e1',
                fontSize: 13,
                interval: 0,
                margin: 15
            },
            axisTick: {
                alignWithLabel: true
            }
        },
        yAxis: {
            type: 'value',
            name: t('COMMON.CUSTOMER.VALUE_VND'),
            nameTextStyle: {
                color: theme === 'light' ? '#666666' : '#e1e1e1',
                fontSize: 13,
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                padding: [0, 0, 10, -15]
            },
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            splitLine: {
                lineStyle: {
                    color: theme === 'light' ? '#d9d9d9' : '#4d52578d',
                    type: 'dashed'
                }
            },
            axisLabel: {
                color: theme === 'light' ? '#333333' : '#e1e1e1',
                fontSize: 13,
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                formatter: function (value: number): string {
                    if (value >= 1000) {
                        return Math.round(value / 1000) + 'K'
                    }
                    return value.toString()
                }
            },
            max: 750000
        },
        series: [
            {
                name: 'Giá trị trung bình đơn hàng',
                type: 'bar',
                barWidth: '65%',
                data: [
                    { value: 350000, itemStyle: { color: '#2589ff' } },
                    { value: 320000, itemStyle: { color: '#2589ff' } },
                    { value: 380000, itemStyle: { color: '#2589ff' } },
                    { value: 410000, itemStyle: { color: '#2589ff' } },
                    { value: 450000, itemStyle: { color: '#2589ff' } },
                    { value: 490000, itemStyle: { color: '#2589ff' } },
                    { value: 510000, itemStyle: { color: '#2589ff' } },
                    { value: 520000, itemStyle: { color: '#2589ff' } },
                    { value: 550000, itemStyle: { color: '#2589ff' } },
                    { value: 580000, itemStyle: { color: '#2589ff' } },
                    { value: 620000, itemStyle: { color: '#2589ff' } },
                    { value: 680000, itemStyle: { color: '#2589ff' } }
                ],
                itemStyle: {
                    borderRadius: [6, 6, 0, 0],
                    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                    shadowColor: 'rgba(0, 0, 0, 0.05)',
                    shadowBlur: 5
                },
                emphasis: {
                    itemStyle: {
                        color: '#1677ff',
                        shadowColor: 'rgba(22, 119, 255, 0.2)',
                        shadowBlur: 10
                    }
                }
            }
        ],
        animation: true,
        animationDuration: 1200,
        animationEasing: 'elasticOut'
    }

    return <ReactEcharts option={option} style={{ height: '100%', width: '100%' }} />
}
