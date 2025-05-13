'use client'
import React from 'react'
import ReactEcharts from 'echarts-for-react'
import { useTheme } from 'next-themes'

export default function TrendByCategories() {
    const { theme } = useTheme()

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
                let result = params[0].name + '<br/>'
                params.forEach((param: any) => {
                    const formattedValue =
                        param.value >= 1000
                            ? Math.round(param.value / 1000).toLocaleString() + 'K'
                            : param.value.toLocaleString()

                    result += `<span style="display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;background-color:${param.color};"></span>`
                    result += `${param.seriesName}: ${formattedValue}<br/>`
                })
                return result
            },
            extraCssText: 'box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);'
        },
        legend: {
            data: [
                'Điện tử',
                'Thời trang',
                'Gia dụng',
                'Mỹ phẩm',
                'Thực phẩm',
                'Đồ chơi',
                'Sách & Văn phòng phẩm',
                'Thể thao'
            ],
            orient: 'vertical',
            itemGap: 14,
            left: '-5',
            top: 'middle',
            textStyle: {
                color: theme === 'light' ? '#333333' : '#e1e1e1',
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif'
            }
        },
        grid: {
            left: '20%',
            right: '2.5%',
            bottom: '0%',
            top: '2%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: months,
            axisLine: {
                lineStyle: {
                    color: theme === 'light' ? '#d9d9d9' : '#444444'
                }
            },
            axisLabel: {
                color: theme === 'light' ? '#333333' : '#e1e1e1',
                fontSize: 12
            }
        },
        yAxis: {
            type: 'value',
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
                fontSize: 12,
                formatter: function (value: number): string {
                    if (value >= 1000) {
                        return Math.round(value / 1000) + 'K'
                    }
                    return value.toString()
                }
            }
        },
        series: [
            {
                name: 'Điện tử',
                type: 'line',
                symbol: 'emptyCircle',
                symbolSize: 6,
                data: [23, 18, 21, 24, 28, 32, 35, 33, 37, 41, 48, 52],
                lineStyle: {
                    width: 3,
                    color: '#1890ff'
                },
                itemStyle: {
                    color: '#1890ff'
                }
            },
            {
                name: 'Thời trang',
                type: 'line',
                symbol: 'emptyCircle',
                symbolSize: 6,
                data: [34, 31, 35, 38, 42, 46, 43, 45, 48, 51, 56, 62],
                lineStyle: {
                    width: 3,
                    color: '#ff6b81'
                },
                itemStyle: {
                    color: '#ff6b81'
                }
            },
            {
                name: 'Gia dụng',
                type: 'line',
                symbol: 'emptyCircle',
                symbolSize: 6,
                data: [18, 16, 19, 22, 25, 28, 31, 33, 35, 37, 42, 45],
                lineStyle: {
                    width: 3,
                    color: '#feca57'
                },
                itemStyle: {
                    color: '#feca57'
                }
            },
            {
                name: 'Mỹ phẩm',
                type: 'line',
                symbol: 'emptyCircle',
                symbolSize: 6,
                data: [21, 19, 23, 26, 30, 32, 34, 36, 39, 43, 47, 51],
                lineStyle: {
                    width: 3,
                    color: '#ff9ff3'
                },
                itemStyle: {
                    color: '#ff9ff3'
                }
            },
            {
                name: 'Thực phẩm',
                type: 'line',
                symbol: 'emptyCircle',
                symbolSize: 6,
                data: [42, 39, 43, 45, 48, 50, 52, 54, 56, 59, 63, 68],
                lineStyle: {
                    width: 3,
                    color: '#54a0ff'
                },
                itemStyle: {
                    color: '#54a0ff'
                }
            },
            {
                name: 'Đồ chơi',
                type: 'line',
                symbol: 'emptyCircle',
                symbolSize: 6,
                data: [12, 10, 13, 15, 17, 19, 22, 25, 28, 32, 38, 45],
                lineStyle: {
                    width: 3,
                    color: '#5f27cd'
                },
                itemStyle: {
                    color: '#5f27cd'
                }
            },
            {
                name: 'Sách & Văn phòng phẩm',
                type: 'line',
                symbol: 'emptyCircle',
                symbolSize: 6,
                data: [15, 13, 16, 19, 22, 25, 23, 27, 30, 33, 36, 39],
                lineStyle: {
                    width: 3,
                    color: '#26de81'
                },
                itemStyle: {
                    color: '#26de81'
                }
            },
            {
                name: 'Thể thao',
                type: 'line',
                symbol: 'emptyCircle',
                symbolSize: 6,
                data: [17, 15, 18, 21, 25, 29, 33, 37, 35, 33, 38, 43],
                lineStyle: {
                    width: 3,
                    color: '#fd79a8'
                },
                itemStyle: {
                    color: '#fd79a8'
                }
            }
        ],
        animation: true,
        animationDuration: 1000,
        animationEasing: 'cubicOut'
    }

    return <ReactEcharts option={option} style={{ height: '100%', width: '100%' }} />
}
