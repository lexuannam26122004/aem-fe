'use client'

import { useTheme } from 'next-themes'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ReactECharts from 'echarts-for-react'
import { Box, FormControlLabel, Paper, Switch, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { SwitchProps } from '@mui/material/Switch'
import { IResponse } from '@/models/Common'

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

interface IProps {
    responseData: IResponse
}

const SalesHeatmapByTime = ({ responseData }: IProps) => {
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
                color: theme === 'light' ? '#6b7280' : '#919eab',
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
                color: theme === 'light' ? '#6b7280' : '#919eab',
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
                color: theme === 'light' ? '#6b7280' : '#919eab'
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
