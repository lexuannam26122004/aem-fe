'use client'
import React from 'react'
import ReactEcharts from 'echarts-for-react'
import { useTheme } from 'next-themes'
import { useTranslation } from 'react-i18next'

export default function OrderStatusChart() {
    const { t } = useTranslation('common')
    const { theme } = useTheme()

    const option = {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'item',
            backgroundColor: theme === 'light' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(35, 40, 50, 0.9)',
            borderColor: theme === 'light' ? '#e6e6e6' : '#4d4d4d',
            borderWidth: 1,
            textStyle: {
                color: theme === 'light' ? '#333333' : '#ffffff'
            },
            formatter: function (params: { name: string; value: number; percent: number }) {
                return `${params.name}: <strong>${params.value}</strong> (${params.percent}%)`
            },
            extraCssText: 'box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);'
        },
        legend: {
            orient: 'horizontal',
            bottom: -3,
            left: 'center',
            itemWidth: 14,
            itemHeight: 14,
            itemGap: 12,
            textStyle: {
                color: theme === 'light' ? '#666666' : '#e1e1e1',
                fontSize: 13,
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif'
            },
            data: [
                t('COMMON.CUSTOMER.SUCCESSFUL_ORDERS'),
                t('COMMON.CUSTOMER.CANCELLED_ORDERS'),
                t('COMMON.CUSTOMER.RETURNED_ORDERS')
            ]
        },
        series: [
            {
                name: 'Tỉ lệ đơn hàng',
                type: 'pie',
                radius: ['35%', '70%'],
                center: ['50%', '40%'],
                avoidLabelOverlap: true,
                itemStyle: {
                    borderRadius: 4,
                    borderColor: theme === 'light' ? '#fff' : '#1e2840',
                    borderWidth: 2
                },
                label: {
                    show: true,
                    formatter: '{d}%',
                    fontSize: 14,
                    fontWeight: 'bold',
                    color: theme === 'light' ? '#333333' : '#e1e1e1'
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
                        shadowColor: 'rgba(0, 0, 0, 0.2)'
                    }
                },
                labelLine: {
                    show: true,
                    length: 15,
                    length2: 10,
                    smooth: true
                },
                labelLayout: {
                    hideOverlap: false
                },
                data: [
                    {
                        value: 82,
                        name: t('COMMON.CUSTOMER.SUCCESSFUL_ORDERS'),
                        itemStyle: { color: '#36a3ff' }
                    },
                    {
                        value: 12,
                        name: t('COMMON.CUSTOMER.CANCELLED_ORDERS'),
                        itemStyle: { color: '#ff6b72' }
                    },
                    {
                        value: 6,
                        name: t('COMMON.CUSTOMER.RETURNED_ORDERS'),
                        itemStyle: { color: '#ffc658' }
                    }
                ],
                animationType: 'scale',
                animationEasing: 'elasticOut',
                animationDelay: function () {
                    return Math.random() * 200
                }
            }
        ]
    }

    return <ReactEcharts option={option} style={{ height: '100%', width: '100%' }} />
}
