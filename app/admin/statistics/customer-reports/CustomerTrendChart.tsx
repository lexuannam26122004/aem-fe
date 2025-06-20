import { MenuItem, FormControl, Select, Box, Typography, SelectChangeEvent, InputLabel } from '@mui/material'
import ReactECharts from 'echarts-for-react'
import { useTheme } from 'next-themes'
import { useState } from 'react'
import * as echarts from 'echarts'
import { useTranslation } from 'react-i18next'
import { useGetCustomerTrendQuery } from '@/services/CustomerReportService'
import Loading from '@/components/Loading'

export default function CustomerTrendChart() {
    const { t } = useTranslation('common')
    const { theme } = useTheme()
    const [type, setType] = useState(0)

    const { data: trend, isLoading: isTrendLoading } = useGetCustomerTrendQuery(type === 0 ? 7 : type === 1 ? 14 : 30)

    const labels = trend?.data?.labels || []
    const newCustomers = trend?.data?.newCustomerSeries || []
    const returningCustomers = trend?.data?.returningCustomerSeries || []
    const orders = trend?.data?.orderSeries || []

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
            data: [
                t('COMMON.CUSTOMER_REPORTS.NEW_CUSTOMERS'),
                t('COMMON.CUSTOMER_REPORTS.RETURNING_CUSTOMERS'),
                t('COMMON.CUSTOMER_REPORTS.ORDERS')
            ],
            textStyle: {
                fontSize: 14,
                color: theme === 'light' ? '#000000' : '#ffffff',
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif'
            },
            itemWidth: 12,
            itemHeight: 12,
            itemGap: 25,
            icon: 'circle'
        },
        grid: {
            top: '12%',
            left: '0%',
            right: '1%',
            bottom: '1%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: labels,
            axisLabel: {
                fontSize: 14,
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif'
            },
            axisLine: {
                lineStyle: {
                    color: theme === 'dark' ? '#919EAB' : '#637381'
                }
            }
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                fontSize: 14,
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                color: theme === 'dark' ? '#919EAB' : '#637381'
            },
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'dashed',
                    color: theme === 'light' ? '#e9ecee' : '#333d47'
                }
            }
        },
        series: [
            {
                name: t('COMMON.CUSTOMER_REPORTS.NEW_CUSTOMERS'),
                type: 'line',
                data: newCustomers,
                smooth: true,
                lineStyle: { color: '#ffab00', width: 3 },
                itemStyle: { color: '#ffab00' },
                areaStyle: {
                    opacity: 0.2,
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#FFB300' },
                        { offset: 1, color: 'rgba(255, 179, 0, 0.05)' }
                    ])
                },
                emphasis: {
                    scale: true,
                    focus: 'none',
                    itemStyle: {
                        borderWidth: 6,
                        borderColor: '#ffab00'
                    }
                }
            },
            {
                name: t('COMMON.CUSTOMER_REPORTS.RETURNING_CUSTOMERS'),
                type: 'line',
                data: returningCustomers,
                smooth: true,
                lineStyle: { color: '#00a76f', width: 3 },
                itemStyle: { color: '#00a76f' },
                areaStyle: {
                    opacity: 0.2,
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#00BFA5' },
                        { offset: 1, color: 'rgba(0, 191, 165, 0.05)' }
                    ])
                },
                emphasis: {
                    scale: true,
                    focus: 'none',
                    itemStyle: {
                        borderWidth: 6,
                        borderColor: '#00a76f'
                    }
                }
            },
            {
                name: t('COMMON.CUSTOMER_REPORTS.ORDERS'),
                type: 'line',
                data: orders,
                smooth: true,
                lineStyle: { color: '#3675ff', width: 3 },
                itemStyle: { color: '#3675ff' },
                areaStyle: {
                    opacity: 0.2,
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#2979FF' },
                        { offset: 1, color: 'rgba(41, 121, 255, 0.05)' }
                    ])
                },
                emphasis: {
                    scale: true,
                    focus: 'none',
                    itemStyle: {
                        borderWidth: 6,
                        borderColor: '#3675ff'
                    }
                }
            }
        ]
    }

    if (isTrendLoading) {
        return <Loading />
    }

    return (
        <Box
            sx={{
                padding: '24px',
                borderRadius: '15px',
                backgroundColor: 'var(--background-color-item)',
                boxShadow: 'var(--box-shadow-paper)'
            }}
        >
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
                    {t('COMMON.CUSTOMER_REPORTS.CUSTOMER_TREND')}
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
        </Box>
    )
}
