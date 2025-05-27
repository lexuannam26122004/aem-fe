import { Paper, Typography } from '@mui/material'
import ReactECharts from 'echarts-for-react'
import { useTheme } from 'next-themes'
import { useTranslation } from 'react-i18next'

const responseData = {
    data: {
        revenue: [
            12000000, 13000000, 12500000, 14000000, 15000000, 16000000, 15500000, 16500000, 17000000, 18000000,
            19000000, 20000000
        ],
        expenses: [
            8000000, 8500000, 8200000, 9000000, 9500000, 9700000, 9600000, 10000000, 10200000, 11000000, 11500000,
            12000000
        ],
        months: [
            '06/2024',
            '07/2024',
            '08/2024',
            '09/2024',
            '10/2024',
            '11/2024',
            '12/2024',
            '01/2025',
            '02/2025',
            '03/2025',
            '04/2025',
            '05/2025'
        ]
    }
}

export default function FinancialOverviewChart() {
    const { t } = useTranslation('common')
    const { theme } = useTheme()
    // const currentYear = new Date().getFullYear()

    // const { data: responseData } = useStatsChartQuery(selectedYear)

    const revenue = responseData?.data?.revenue || []
    const expenses = responseData?.data?.expenses || []
    const months = responseData?.data?.months || []

    const option = {
        animation: true, // Bật hiệu ứng chuyển tiếp
        animationDuration: 700, // Thời gian chuyển tiếp (ms)
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
            data: [t('COMMON.HOME.EXPENSES'), t('COMMON.HOME.REVENUE')],
            textStyle: {
                color: theme === 'light' ? '#000000' : '#ffffff',
                fontSize: 14,
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif'
            },
            itemGap: 30
        },
        toolbox: {
            show: true,
            feature: {
                magicType: { show: true, type: ['line', 'bar'] },
                saveAsImage: { show: true }
            }
        },
        grid: {
            left: '0.5%',
            right: '0.5%',
            bottom: '0%',
            containLabel: true
        },
        calculable: true,
        xAxis: [
            {
                type: 'category',
                boundaryGap: true, // Để cột không chạm vào nhau
                axisLine: {
                    lineStyle: {
                        color: theme === 'dark' ? '#919EAB' : '#637381'
                    }
                },
                axisLabel: {
                    fontSize: 14,
                    fontFamily: 'Roboto, Helvetica, Arial, sans-serif'
                },
                splitLine: {
                    lineStyle: {
                        type: 'dashed',
                        color: theme === 'light' ? '#e9ecee' : '#333d47'
                    }
                },
                // prettier-ignore
                data: months // ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            }
        ],
        yAxis: [
            {
                axisLine: {
                    lineStyle: {
                        color: theme === 'dark' ? '#919EAB' : '#637381'
                    }
                },
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
                splitLine: {
                    lineStyle: {
                        type: 'dashed',
                        color: theme === 'light' ? '#e9ecee' : '#333d47'
                    }
                },
                type: 'value'
            }
        ],
        series: [
            {
                name: t('COMMON.HOME.EXPENSES'),
                type: 'bar',
                data: expenses,
                barWidth: '26%', // Điều chỉnh độ rộng của cột
                itemStyle: {
                    color: '#f1aa2e',
                    borderRadius: [6, 6, 0, 0] // Bo tròn đỉnh cột
                }
            },
            {
                name: t('COMMON.HOME.REVENUE'),
                type: 'bar',
                data: revenue,
                barWidth: '26%', // Điều chỉnh độ rộng của cột
                itemStyle: {
                    color: '#3675ff',
                    borderRadius: [6, 6, 0, 0] // Bo tròn đỉnh cột
                }
            }
        ]
    }

    return (
        <Paper
            elevation={0}
            sx={{
                width: '100%',
                backgroundColor: 'var(--background-color-item)',
                borderRadius: '15px',
                height: '100%'
            }}
        >
            <Typography
                sx={{
                    fontSize: '18px',
                    padding: '24px',
                    fontWeight: 'bold',
                    color: 'var(--text-color)'
                }}
            >
                {t('COMMON.HOME.FINANCIAL_OVERVIEW')}
            </Typography>
            <ReactECharts option={option} style={{ height: 420, padding: '0 24px 24px' }} />
        </Paper>
    )
}
