'use client'

import { useTheme } from 'next-themes'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ReactECharts from 'echarts-for-react'
import { Box, FormControlLabel, Paper, Switch, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { SwitchProps } from '@mui/material/Switch'

const IOSSwitch = styled((props: SwitchProps) => (
    <Switch focusVisibleClassName='.Mui-focusVisible' disableRipple {...props} />
))(({ theme }) => ({
    width: 40,
    height: 24,
    padding: 0,
    '& .MuiSwitch-switchBase': {
        padding: 0,
        margin: 2,
        transitionDuration: '300ms',
        '&.Mui-checked': {
            transform: 'translateX(16px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                backgroundColor: 'var(--primary-color)',
                opacity: 1,
                border: 0,
                ...theme.applyStyles('dark', {
                    backgroundColor: '#2ECA45'
                })
            },
            '&.Mui-disabled + .MuiSwitch-track': {
                opacity: 0.5
            }
        },
        '&.Mui-focusVisible .MuiSwitch-thumb': {
            color: '#33cf4d',
            border: '6px solid #fff'
        },
        '&.Mui-disabled .MuiSwitch-thumb': {
            color: theme.palette.grey[100],
            ...theme.applyStyles('dark', {
                color: theme.palette.grey[600]
            })
        },
        '&.Mui-disabled + .MuiSwitch-track': {
            opacity: 0.7,
            ...theme.applyStyles('dark', {
                opacity: 0.3
            })
        }
    },
    '& .MuiSwitch-thumb': {
        boxSizing: 'border-box',
        width: 20,
        height: 20
    },
    '& .MuiSwitch-track': {
        borderRadius: 26 / 2,
        backgroundColor: 'var(--background-switch)',
        opacity: 1,
        transition: theme.transitions.create(['background-color'], {
            duration: 500
        }),
        ...theme.applyStyles('dark', {
            backgroundColor: '#39393D'
        })
    }
}))

const responseData = {
    data: {
        stats: [
            [0, 0, 51],
            [1, 0, 82],
            [2, 0, 12],
            [3, 0, 85],
            [4, 0, 19],
            [5, 0, 18],
            [6, 0, 53],
            [7, 0, 99],
            [8, 0, 27],
            [9, 0, 14],
            [10, 0, 81],
            [11, 0, 64],
            [12, 0, 5],
            [13, 0, 6],
            [14, 0, 8],
            [15, 0, 84],
            [16, 0, 8],
            [17, 0, 100],
            [18, 0, 9],
            [19, 0, 84],
            [20, 0, 55],
            [21, 0, 31],
            [22, 0, 7],
            [23, 0, 16],
            [0, 1, 44],
            [1, 1, 52],
            [2, 1, 62],
            [3, 1, 29],
            [4, 1, 29],
            [5, 1, 0],
            [6, 1, 84],
            [7, 1, 54],
            [8, 1, 20],
            [9, 1, 8],
            [10, 1, 17],
            [11, 1, 75],
            [12, 1, 51],
            [13, 1, 1],
            [14, 1, 100],
            [15, 1, 10],
            [16, 1, 39],
            [17, 1, 95],
            [18, 1, 84],
            [19, 1, 86],
            [20, 1, 84],
            [21, 1, 79],
            [22, 1, 54],
            [23, 1, 75],
            [0, 2, 50],
            [1, 2, 35],
            [2, 2, 87],
            [3, 2, 23],
            [4, 2, 43],
            [5, 2, 8],
            [6, 2, 43],
            [7, 2, 43],
            [8, 2, 66],
            [9, 2, 73],
            [10, 2, 35],
            [11, 2, 98],
            [12, 2, 56],
            [13, 2, 95],
            [14, 2, 62],
            [15, 2, 94],
            [16, 2, 94],
            [17, 2, 10],
            [18, 2, 55],
            [19, 2, 18],
            [20, 2, 39],
            [21, 2, 76],
            [22, 2, 75],
            [23, 2, 33],
            [0, 3, 100],
            [1, 3, 54],
            [2, 3, 21],
            [3, 3, 76],
            [4, 3, 96],
            [5, 3, 1],
            [6, 3, 25],
            [7, 3, 77],
            [8, 3, 100],
            [9, 3, 47],
            [10, 3, 76],
            [11, 3, 0],
            [12, 3, 25],
            [13, 3, 81],
            [14, 3, 7],
            [15, 3, 36],
            [16, 3, 72],
            [17, 3, 41],
            [18, 3, 96],
            [19, 3, 45],
            [20, 3, 69],
            [21, 3, 45],
            [22, 3, 28],
            [23, 3, 35],
            [0, 4, 16],
            [1, 4, 10],
            [2, 4, 41],
            [3, 4, 13],
            [4, 4, 67],
            [5, 4, 18],
            [6, 4, 73],
            [7, 4, 45],
            [8, 4, 18],
            [9, 4, 15],
            [10, 4, 19],
            [11, 4, 72],
            [12, 4, 34],
            [13, 4, 47],
            [14, 4, 67],
            [15, 4, 29],
            [16, 4, 29],
            [17, 4, 1],
            [18, 4, 61],
            [19, 4, 90],
            [20, 4, 93],
            [21, 4, 100],
            [22, 4, 8],
            [23, 4, 98],
            [0, 5, 65],
            [1, 5, 20],
            [2, 5, 88],
            [3, 5, 9],
            [4, 5, 28],
            [5, 5, 78],
            [6, 5, 87],
            [7, 5, 84],
            [8, 5, 16],
            [9, 5, 52],
            [10, 5, 51],
            [11, 5, 96],
            [12, 5, 10],
            [13, 5, 36],
            [14, 5, 39],
            [15, 5, 72],
            [16, 5, 30],
            [17, 5, 0],
            [18, 5, 78],
            [19, 5, 95],
            [20, 5, 91],
            [21, 5, 33],
            [22, 5, 40],
            [23, 5, 18],
            [0, 6, 52],
            [1, 6, 29],
            [2, 6, 35],
            [3, 6, 55],
            [4, 6, 76],
            [5, 6, 90],
            [6, 6, 54],
            [7, 6, 27],
            [8, 6, 17],
            [9, 6, 29],
            [10, 6, 81],
            [11, 6, 13],
            [12, 6, 96],
            [13, 6, 48],
            [14, 6, 7],
            [15, 6, 44],
            [16, 6, 85],
            [17, 6, 21],
            [18, 6, 51],
            [19, 6, 100],
            [20, 6, 67],
            [21, 6, 42],
            [22, 6, 31],
            [23, 6, 35]
        ],
        maxOrders: 100,
        minOrders: 0
    }
}

const hours = [
    '00:00',
    '01:00',
    '02:00',
    '03:00',
    '04:00',
    '05:00',
    '06:00',
    '07:00',
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
    '21:00',
    '22:00',
    '23:00'
]

const SalesHeatmapByTime = () => {
    const { t } = useTranslation('common')
    const { theme } = useTheme()
    const [openLabel, setOpenLabel] = useState(false)
    const currentDate = new Date()

    const currentDayOfWeek = currentDate.getDay()

    const daysOfWeek = [
        t('COMMON.WEEK.SUNDAY'),
        t('COMMON.WEEK.MONDAY'),
        t('COMMON.WEEK.TUESDAY'),
        t('COMMON.WEEK.WEDNESDAY'),
        t('COMMON.WEEK.THURSDAY'),
        t('COMMON.WEEK.FRIDAY'),
        t('COMMON.WEEK.SATURDAY')
    ]

    const reorderedDays = [...daysOfWeek.slice(currentDayOfWeek + 1), ...daysOfWeek.slice(0, currentDayOfWeek + 1)]

    // const { data: responseData } = useGetHourlyAttendanceStatsQuery(currentDate.toISOString().split('T')[0])

    const data = responseData?.data.stats || []
    const maxCount = responseData?.data.maxOrders || 0
    const minCount = responseData?.data.minOrders || 0

    const transformedData = data.map(([hour, day, value]) => [day, hour, value])

    const handleToggle = () => {
        setOpenLabel(prev => !prev)
    }

    const option = {
        tooltip: {
            position: 'top',
            backgroundColor: theme === 'light' ? 'rgba(250, 250, 250, 0.98)' : 'rgba(20, 26, 25, 0.98)',
            borderColor: theme === 'light' ? 'rgba(250, 250, 250, 0.98)' : 'rgba(20, 26, 25, 0.98)',
            textStyle: {
                fontSize: 14,
                color: theme === 'light' ? '#000000' : '#ffffff',
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif'
            }
        },
        grid: {
            top: '2%',
            left: '0%',
            right: '8%',
            bottom: '1%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: reorderedDays, // Các ngày trong tuần
            axisLine: {
                show: false // Ẩn đường trục y
            },
            axisTick: {
                show: false // Ẩn đánh dấu trục y
            },
            axisLabel: {
                fontSize: '14px',
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif'
            },
            splitLine: {
                show: false // Ẩn đường chia lưới
            }
        },
        yAxis: {
            type: 'category',
            data: hours,
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                fontSize: '14px',
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif'
            },
            splitLine: {
                show: false
            }
        },
        visualMap: {
            min: minCount,
            max: maxCount,
            calculable: true,
            orient: 'vertical',
            left: 'right',
            top: 'center',
            textStyle: {
                color: theme === 'light' ? '#000000' : '#ffffff'
            },
            inRange: {
                color: ['#cbdcff', '#5f8eff', '#3675ff']
            }
        },
        series: [
            {
                name: t('COMMON.REVENUE.COUNT_ORDERS'),
                type: 'heatmap',
                data: transformedData,
                itemStyle: {
                    borderRadius: 12,
                    borderWidth: 6, // Thêm đường viền để làm rõ khoảng cách giữa các ô
                    borderColor: theme === 'light' ? '#fff' : '#1c252e' // Màu viền
                },
                label: {
                    show: openLabel, // Hiển thị văn bản trong ô
                    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                    fontSize: 13,
                    fontWeight: 'bold'
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(0, 0, 0, 0.5)',
                        shadowOffsetX: 4, // Độ lệch bóng theo chiều X
                        shadowOffsetY: 4, // Độ lệch bóng theo chiều Y
                        borderWidth: 0 // Đảm bảo không làm mờ viền khi blur
                    }
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
                overflow: 'hidden',
                borderRadius: '15px',
                backgroundColor: 'var(--background-color-item)'
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography
                    sx={{
                        color: 'var(--text-color)',
                        fontWeight: 'bold',
                        fontSize: '18px',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    {t('COMMON.REVENUE.ORDERS_BY_TIME')}
                </Typography>

                <FormControlLabel
                    sx={{
                        '& .MuiFormControlLabel-label': {
                            color: 'var(--label-title-color)',
                            fontSize: '15px'
                        }
                    }}
                    control={<IOSSwitch sx={{ m: 1, mr: 2 }} onChange={handleToggle} checked={openLabel} />}
                    label={t('COMMON.REVENUE.CELL_VALUE')}
                />
            </Box>

            <ReactECharts option={option} style={{ height: '900px', width: '100%' }} />
        </Paper>
    )
}

export default SalesHeatmapByTime
