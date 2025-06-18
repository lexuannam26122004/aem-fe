// src/components/EmployeeCountChart.js
import React, { useMemo, useState } from 'react'
import { Box, Paper, Typography, FormControl, Select, MenuItem, InputLabel } from '@mui/material'
import ReactECharts from 'echarts-for-react'
import { useTheme } from 'next-themes'
import { useTranslation } from 'react-i18next'
import { SelectChangeEvent } from '@mui/material' // Import SelectChangeEvent
import { useGetAvgOrderDurationQuery } from '@/services/OrderInsightsService'
import Loading from '@/components/Loading'

const generateRandomData = (t: any) => {
    const types = [
        t('COMMON.ORDER.PENDING'),
        t('COMMON.ORDER.PROCESSING'),
        t('COMMON.ORDER.SHIPPING'),
        t('COMMON.ORDER.DELIVERED'),
        t('COMMON.ORDER.CANCELLED'),
        t('COMMON.ORDER.RETURNED')
    ]

    return [
        ['score', 'amount', 'status'],
        ...types.map(type => {
            const value = Math.floor(Math.random() * 15) + 1
            return [value, value, type]
        })
    ]
}
const OrderStatusChart = () => {
    const { t } = useTranslation('common')
    const { theme } = useTheme()
    const [type, setType] = useState(0)

    const { data: chartDataResponse, isLoading: isChartDataLoading } = useGetAvgOrderDurationQuery(
        type === 0 ? 7 : type === 1 ? 14 : 30
    )
    const chartData = chartDataResponse?.data

    const translatedChartData = useMemo(() => {
        if (!chartData) return []

        return chartData.map(row => {
            // row = [score, amount, status]
            const [score, amount, status] = row
            if (typeof status === 'string') {
                return [score, amount, t(status)]
            }
            return row
        })
    }, [chartData, t])

    const handleTypeChange = (event: SelectChangeEvent<number>) => {
        setType(event.target.value as number)
    }

    console.log('chartDataResponse', generateRandomData(t))

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
        dataset: {
            source: translatedChartData
        },
        calculable: true,
        grid: {
            top: '2%',
            left: '0.5%',
            right: '13%',
            bottom: '1%',
            containLabel: true
        },
        yAxis: {
            name: `${t('COMMON.TIME')} (${t('COMMON.DAYS')})`,
            axisLabel: {
                fontSize: 14,
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif'
            },
            boundaryGap: true,
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
        xAxis: {
            type: 'category',
            axisLabel: {
                fontSize: 14,
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif'
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
        visualMap: {
            show: true,
            min: 1,
            top: 'middle',
            textStyle: {
                fontSize: 14,
                color: theme === 'light' ? '#6b7280' : '#919eab',
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif'
            },
            left: 'right',
            max: 15,
            text: [t('COMMON.HIGH_SCORE'), t('COMMON.LOW_SCORE')],
            dimension: 0,
            inRange: {
                color: ['#16A085', '#1ABC9C', '#2980B9', '#3675FF']
            }
        },
        series: [
            {
                type: 'bar',
                encode: {
                    y: 'amount',
                    x: 'status'
                },
                barWidth: '50%',
                itemStyle: {
                    borderRadius: [10, 10, 0, 0]
                },
                label: {
                    show: false
                }
            }
        ]
    }

    if (isChartDataLoading || !chartDataResponse) {
        return <Loading />
    }

    return (
        <Paper
            elevation={0}
            sx={{
                width: '100%',
                padding: '24px',
                boxShadow: 'var(--box-shadow-paper)',
                borderRadius: '15px',
                height: '100%',
                backgroundColor: 'var(--background-color-item)'
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    mb: '18px',
                    justifyContent: 'space-between'
                }}
            >
                <Typography
                    sx={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: 'var(--text-color)'
                    }}
                >
                    {t('COMMON.WARRANTY_REPORT.AVERAGE_WARRANTY_TIME_BY_TYPE')}
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

            <ReactECharts option={option} style={{ height: '375px' }} />
        </Paper>
    )
}

export default OrderStatusChart
