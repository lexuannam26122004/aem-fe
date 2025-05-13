import { MenuItem, FormControl, Select, Box, Paper, Typography, SelectChangeEvent, InputLabel } from '@mui/material'
import ReactECharts from 'echarts-for-react'
import { useTheme } from 'next-themes'
import { useMemo, useState } from 'react'
import * as echarts from 'echarts'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'

const getChartData = (range: number) => {
    const dayCount = range === 0 ? 7 : range === 1 ? 14 : 30
    const today = dayjs()

    const labels = Array.from({ length: dayCount }, (_, i) => today.subtract(dayCount - 1 - i, 'day').format('DD/MM'))

    const revenue = Array.from({ length: dayCount }, () => Math.floor(Math.random() * 5000000) + 8000000)

    const orders = Array.from({ length: dayCount }, () => Math.floor(Math.random() * 100) + 100)

    return { labels, revenue, orders }
}

export default function ChartOrderRevenue() {
    const { t } = useTranslation('common')
    const { theme } = useTheme()
    const [type, setType] = useState(0)

    const today = dayjs()
    const labels = Array.from({ length: 7 }, (_, i) => today.subtract(6 - i, 'day').format('DD/MM'))

    const fakeData = {
        revenue: [12400000, 9700000, 12300000, 11000000, 9800000, 15000000, 13400000],
        orders: [120, 200, 180, 165, 100, 210, 160]
    }

    const chartData = useMemo(() => getChartData(type), [type])

    const handleTypeChange = (event: SelectChangeEvent<number>) => {
        setType(event.target.value as number)
    }

    const option = {
        tooltip: {
            trigger: 'axis',
            backgroundColor: theme === 'light' ? 'rgba(250, 250, 250, 0.98)' : 'rgba(20, 26, 25, 0.98)',
            borderColor: theme === 'light' ? 'rgba(250, 250, 250, 0.98)' : 'rgba(20, 26, 25, 0.98)',
            textStyle: {
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                color: theme === 'light' ? '#000000' : '#ffffff'
            }
        },
        legend: {
            data: [t('COMMON.HOME.REVENUE') + ' (VND)', t('COMMON.HOME.ORDERS')],
            textStyle: {
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                fontSize: 14,
                color: theme === 'light' ? '#000000' : '#ffffff'
            },
            itemWidth: 12,
            itemHeight: 12,
            itemGap: 30,
            icon: 'circle'
        },
        grid: {
            top: '12%',
            left: '0.5%',
            right: '0.5%',
            bottom: '0%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: chartData.labels,
                axisLabel: {
                    fontSize: 14,
                    fontFamily: 'Roboto, Helvetica, Arial, sans-serif'
                },
                axisLine: {
                    lineStyle: {
                        color: theme === 'dark' ? '#919EAB' : '#637381'
                    }
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                position: 'left',
                axisLabel: {
                    formatter: function (value: number) {
                        if (value >= 1000000000) return value / 1000000000 + 'B'
                        if (value >= 1000000) return value / 1000000 + 'M'
                        if (value >= 1000) return value / 1000 + 'K'
                        return value
                    },
                    fontSize: 14,
                    fontFamily: 'Roboto, Helvetica, Arial, sans-serif'
                },
                axisLine: {
                    lineStyle: {
                        color: '#3675ff'
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: 'dashed',
                        color: theme === 'light' ? '#e9ecee' : '#333d47'
                    }
                }
            },
            {
                type: 'value',
                position: 'right',
                axisLabel: {
                    fontSize: 14,
                    fontFamily: 'Roboto, Helvetica, Arial, sans-serif'
                },
                axisLine: {
                    lineStyle: {
                        color: '#ffab00'
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: 'dashed',
                        color: theme === 'light' ? '#e9ecee' : '#333d47'
                    }
                }
            }
        ],
        series: [
            {
                name: t('COMMON.HOME.REVENUE') + ' (VND)',
                type: 'line',
                yAxisIndex: 0,
                data: chartData.revenue,
                smooth: true,
                lineStyle: { color: '#3675ff', width: 3 },
                itemStyle: { color: '#3675ff' },
                areaStyle: {
                    opacity: 1,
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(54, 117, 255, 0.2)' },
                        { offset: 1, color: 'rgba(54, 117, 255, 0)' }
                    ])
                },
                emphasis: {
                    scale: true,
                    focus: 'none',
                    itemStyle: {
                        borderWidth: 8,
                        borderColor: '#3675ff'
                    }
                }
            },
            {
                name: t('COMMON.HOME.ORDERS'),
                type: 'line',
                yAxisIndex: 1,
                data: chartData.orders,
                smooth: true,
                lineStyle: { color: '#ffab00', width: 3 },
                itemStyle: { color: '#ffab00' },
                areaStyle: {
                    opacity: 1,
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(255, 171, 0, 0.2)' }, // Màu vàng cam đậm
                        { offset: 1, color: 'rgba(255, 171, 0, 0)' } // Mờ dần
                    ])
                },
                emphasis: {
                    scale: true,
                    focus: 'none',
                    itemStyle: {
                        borderWidth: 8,
                        borderColor: '#ffab00'
                    }
                }
            }
        ]
    }

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: '5px'
                }}
            >
                <Typography
                    sx={{
                        fontSize: '18px',
                        mb: '24px',
                        fontWeight: 'bold',
                        color: 'var(--text-color)'
                    }}
                >
                    {t('COMMON.HOME.REVENUE_ORDER')}
                </Typography>

                <FormControl
                    sx={{
                        width: '150px',
                        mb: 'auto',
                        '& .MuiOutlinedInput-root:hover fieldset': {
                            borderColor: 'var(--field-color-hover)'
                        },
                        '& .MuiOutlinedInput-root.Mui-error:hover fieldset': {
                            borderColor: 'var(--error-color)'
                        },
                        '& .MuiOutlinedInput-root.Mui-error fieldset': {
                            borderColor: 'var(--error-color)'
                        },
                        '& .MuiOutlinedInput-root.Mui-focused fieldset': {
                            border: '2px solid var(--field-color-selected)'
                        },
                        '& .MuiOutlinedInput-root.Mui-error.Mui-focused fieldset': {
                            borderColor: 'var(--error-color)'
                        },
                        '& .MuiInputLabel-root': {
                            color: 'var(--label-title-color)'
                        },
                        '&:hover .MuiInputLabel-root': {
                            color: 'var(--field-color-selected)'
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            fontWeight: 'bold',
                            color: 'var(--field-color-selected)'
                        }
                    }}
                >
                    <InputLabel id='select-label'>{t('COMMON.HOME.TIME_RANGE')}</InputLabel>
                    <Select
                        label={t('COMMON.HOME.TIME_RANGE')}
                        defaultValue={1}
                        value={type}
                        onChange={handleTypeChange}
                        sx={{
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'var(--border-color)'
                            },
                            '& fieldset': {
                                borderRadius: '8px',
                                borderColor: 'var(--border-color)'
                            },
                            '& .MuiSelect-icon': {
                                color: 'var(--text-color)'
                            },
                            '& .MuiInputBase-input': {
                                color: 'var(--text-color)',
                                padding: '11px 14px'
                            }
                        }}
                        MenuProps={{
                            PaperProps: {
                                elevation: 0,
                                sx: {
                                    mt: '4px',
                                    borderRadius: '8px',
                                    padding: '0 8px',
                                    backgroundImage:
                                        'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSJ1cmwoI3BhaW50MF9yYWRpYWxfMjc0OV8xNDUxODYpIiBmaWxsLW9wYWNpdHk9IjAuMTIiLz4KPGRlZnM+CjxyYWRpYWxHcmFkaWVudCBpZD0icGFpbnQwX3JhZGlhbF8yNzQ5XzE0NTE4NiIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgxMjAgMS44MTgxMmUtMDUpIHJvdGF0ZSgtNDUpIHNjYWxlKDEyMy4yNSkiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMDBCOEQ5Ii8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzAwQjhEOSIgc3RvcC1vcGFjaXR5PSIwIi8+CjwvcmFkaWFsR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+Cg==), url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSJ1cmwoI3BhaW50MF9yYWRpYWxfMjc0OV8xNDUxODcpIiBmaWxsLW9wYWNpdHk9IjAuMTIiLz4KPGRlZnM+CjxyYWRpYWxHcmFkaWVudCBpZD0icGFpbnQwX3JhZGlhbF8yNzQ5XzE0NTE4NyIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIDEyMCkgcm90YXRlKDEzNSkgc2NhbGUoMTIzLjI1KSI+CjxzdG9wIHN0b3AtY29sb3I9IiNGRjU2MzAiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjRkY1NjMwIiBzdG9wLW9wYWNpdHk9IjAiLz4KPC9yYWRpYWxHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K)',
                                    backgroundPosition: 'top right, bottom left',
                                    backgroundSize: '50%, 50%',
                                    backgroundRepeat: 'no-repeat',
                                    backdropFilter: 'blur(20px)',
                                    backgroundColor: 'var(--background-color-item)',
                                    color: 'var(--text-color)',
                                    border: '1px solid var(--border-color)',
                                    '& .MuiMenuItem-root': {
                                        '&:hover': { backgroundColor: 'var(--background-color-item-hover)' },
                                        '&.Mui-selected': {
                                            backgroundColor: 'var(--background-color-item-selected)',
                                            '&:hover': { backgroundColor: 'var(--background-color-item-hover)' }
                                        }
                                    }
                                }
                            },
                            anchorOrigin: {
                                vertical: 'bottom',
                                horizontal: 'right' // Căn chỉnh bên phải
                            },
                            transformOrigin: {
                                vertical: 'top',
                                horizontal: 'right' // Căn chỉnh bên phải
                            }
                        }}
                    >
                        <MenuItem
                            value={0}
                            sx={{
                                borderRadius: '6px'
                            }}
                        >
                            {t('COMMON.HOME.LAST_7_DAYS')}
                        </MenuItem>

                        <MenuItem
                            value={1}
                            sx={{
                                borderRadius: '6px',
                                mt: '3px'
                            }}
                        >
                            {t('COMMON.HOME.LAST_14_DAYS')}
                        </MenuItem>

                        <MenuItem
                            value={2}
                            sx={{
                                borderRadius: '6px',
                                mt: '3px'
                            }}
                        >
                            {t('COMMON.HOME.LAST_30_DAYS')}
                        </MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <ReactECharts option={option} style={{ height: 375 }} />
        </>
    )
}
