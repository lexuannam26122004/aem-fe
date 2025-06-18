'use client'

import React, { useState } from 'react'
import {
    CalendarIcon,
    ChartBarIcon,
    CreditCardIcon,
    UserCircleIcon,
    CheckCircleIcon,
    XCircleIcon,
    MailIcon,
    PhoneIcon,
    TrendingUpIcon,
    ShoppingBagIcon,
    HeartIcon,
    StarIcon,
    GiftIcon,
    BellIcon,
    PackageIcon,
    RefreshCwIcon,
    ChevronRightIcon,
    ShoppingCartIcon,
    MapPinHouse
} from 'lucide-react'
// import { PlusIcon } from 'lucide-react'
import {
    Avatar,
    Box,
    Button,
    Chip,
    Grid2 as Grid,
    Paper,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    Typography
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { formatCurrency, formatDate } from '@/common/format'
import ReactECharts from 'echarts-for-react'
import { useTheme } from 'next-themes'
import TrendByCategories from '../TrendByCategories'
import Chart from '../AverageByMonth'
import OrderStatusChart from '../OrderStatus'
import GetStyleCustomer from '@/components/GetStyleCustomer'
import { usePathname, useRouter } from 'next/navigation'
import RateInventoryChart from './RateInventoryChart'
import { useGetByIdCustomerQuery } from '@/services/CustomerService'
import Loading from '@/components/Loading'
import EmptyState from '@/components/EmptyState'

export interface ICustomerDetail {
    profile: {
        fullName: string
        username: string
        avatar: string
        gender: boolean
        birthday: string
        createdAt: string
        status: boolean
        phoneNumber: string
        email: string
        address: string
        rank: string
    }

    overview: {
        totalSpent: number
        orderCount: number
        averageOrderValue: number
        lastPurchaseDate: string | null
        spendingChangeRate: number
        averageOrderChangeRate: number
    }

    recentOrders: Array<{
        orderCode: string
        orderDate: string
        productCount: number
        total: number
        status: string
    }>

    paymentStats: {
        vnpay: number
        momo: number
        cod: number
    }

    orderStatusStats: {
        completed: number
        cancelled: number
        returned: number
    }

    shoppingTrend: {
        months: string[]
        values: number[]
    }
}

// Recent activity data
const recentActivity = [
    {
        type: 'purchase',
        event: 'Đặt hàng',
        detail: 'iPhone 13 Pro Max',
        date: '15/03/2025',
        icon: <ShoppingBagIcon className='w-4 h-4' />
    },
    {
        type: 'coupon',
        event: 'Sử dụng mã giảm giá',
        detail: 'SUMMER20',
        date: '15/03/2025',
        icon: <GiftIcon className='w-4 h-4' />
    },
    {
        type: 'review',
        event: 'Đánh giá sản phẩm',
        detail: '5 sao - Tai nghe Sony',
        date: '13/02/2025',
        icon: <StarIcon className='w-4 h-4' />
    },
    {
        type: 'wishlist',
        event: 'Thêm vào danh sách yêu thích',
        detail: 'Samsung Galaxy S23',
        date: '05/02/2025',
        icon: <HeartIcon className='w-4 h-4' />
    }
]

function getStatusBgColor(status: string): string {
    if (status === 'cancelled') {
        return 'var(--background-color-cancel-selected)'
    } else if (status === 'delivered') {
        return 'var(--background-color-success-selected)'
    } else if (status === 'pending') {
        return 'var(--background-color-pending-selected)'
    } else if (status === 'returned') {
        return 'var(--background-color-silver-selected)'
    } else if (status === 'processing') {
        return 'var(--background-color-pink-selected)'
    } else {
        return 'var(--background-color-blue-selected)'
    }
}

function getBorderColor(status: string): string {
    if (status === 'cancelled') {
        return 'var(--border-color-cancel-selected)'
    } else if (status === 'delivered') {
        return 'var(--border-color-success-selected)'
    } else if (status === 'pending') {
        return 'var(--border-color-pending-selected)'
    } else if (status === 'returned') {
        return 'var(--border-color-silver-selected)'
    } else if (status === 'processing') {
        return 'var(--border-color-pink-selected)'
    } else {
        return 'var(--border-color-blue-selected)'
    }
}

function getStatusTextColor(status: string): string {
    if (status === 'cancelled') {
        return 'var(--text-color-cancel-selected)'
    } else if (status === 'delivered') {
        return 'var(--text-color-success-selected)'
    } else if (status === 'pending') {
        return 'var(--text-color-pending-selected)'
    } else if (status === 'returned') {
        return 'var(--text-color-silver-selected)'
    } else if (status === 'processing') {
        return 'var(--text-color-pink-selected)'
    } else {
        return 'var(--text-color-blue-selected)'
    }
}

export default function Page() {
    const [activeTab, setActiveTab] = useState('info')
    const { t } = useTranslation('common')
    const { theme } = useTheme()
    const router = useRouter()
    const pathname = usePathname()
    const customerId = pathname.split('/').pop() || ''

    const { data: customerData, isLoading, error } = useGetByIdCustomerQuery(customerId)
    const customer: ICustomerDetail = customerData?.data || {}

    if (isLoading) {
        return <Loading />
    }

    if (error) {
        return <EmptyState />
    }

    const option = {
        grid: {
            left: '1%',
            right: '2%',
            bottom: '2%',
            top: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: customer?.shoppingTrend?.months,
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
                formatter: function (value: number) {
                    // Chuyển đổi số tiền thành định dạng K
                    if (value >= 1000) {
                        return Math.round(value / 1000) + 'K'
                    }
                    return value
                }
            }
        },
        tooltip: {
            trigger: 'axis',
            backgroundColor: theme === 'light' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(35, 40, 50, 0.9)',
            borderColor: theme === 'light' ? '#e6e6e6' : '#4d4d4d',
            borderWidth: 1,
            textStyle: {
                color: theme === 'light' ? '#333333' : '#ffffff'
            },
            axisPointer: {
                type: 'line',
                lineStyle: {
                    color: '#1890ff',
                    width: 1.5
                }
            },
            formatter: function (params: any) {
                // Định dạng tooltip để hiển thị giá trị tiền tệ
                let result = params[0].name + '<br/>'
                params.forEach((param: any) => {
                    // Định dạng số với dấu phân cách hàng nghìn và thêm K
                    const formattedValue =
                        param.value >= 1000
                            ? Math.round(param.value / 1000).toLocaleString() + 'K'
                            : param.value.toLocaleString()

                    result += `<span style="display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;background-color:${param.color};"></span>`
                    result += `${param.seriesName || 'Giá trị'}: ${formattedValue}<br/>`
                })
                return result
            },
            extraCssText: 'box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);'
        },
        series: [
            {
                name: t('COMMON.CUSTOMER.REVENUE'),
                data: customer?.shoppingTrend?.values || [],
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 8,
                itemStyle: {
                    color: '#1890ff'
                },
                lineStyle: {
                    color: '#1890ff',
                    width: 3
                },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            {
                                offset: 0,
                                color: theme === 'light' ? 'rgba(24, 144, 255, 0.5)' : 'rgba(24, 144, 255, 0.6)'
                            },
                            {
                                offset: 1,
                                color: theme === 'light' ? 'rgba(24, 144, 255, 0.05)' : 'rgba(24, 144, 255, 0.1)'
                            }
                        ]
                    }
                },
                label: {
                    show: false,
                    position: 'top',
                    formatter: function (params: any) {
                        // Hiển thị nhãn với định dạng K
                        return params.value >= 1000 ? Math.round(params.value / 1000) + 'K' : params.value
                    }
                }
            }
        ],
        animation: true,
        animationDuration: 1000,
        animationEasing: 'cubicOut'
    }

    return (
        <Box
            sx={{
                maxWidth: '1200px',
                margin: '0 auto',
                mt: '20px',
                mb: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px'
            }}
        >
            <Paper
                sx={{
                    borderRadius: '15px',
                    backgroundColor: 'var(--background-color-item)',
                    overflow: 'hidden'
                }}
            >
                <Box
                    sx={{
                        background: 'linear-gradient(to right, #2563eb, #60a4fa)',
                        p: 4,
                        color: 'white'
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            justifyContent: { md: 'space-between' },
                            alignItems: { md: 'center' },
                            gap: 3
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                            <Box sx={{ position: 'relative' }}>
                                <Box
                                    sx={{
                                        bgcolor: 'rgba(255, 255, 255, 0.3)',
                                        backdropFilter: 'blur(4px)',
                                        borderRadius: '50%',
                                        p: 0.75
                                    }}
                                >
                                    {customer.profile.avatar ? (
                                        <Avatar
                                            src={customer.profile.avatar}
                                            alt={customer.profile.fullName}
                                            sx={{
                                                height: 96,
                                                width: 96,
                                                border: '4px solid white',
                                                boxShadow: 3
                                            }}
                                        />
                                    ) : (
                                        <Avatar
                                            sx={{
                                                height: 96,
                                                width: 96,
                                                bgcolor: 'linear-gradient(to bottom right, #bbdefb, #90caf9)',
                                                color: '#1565c0',
                                                fontSize: '1.875rem',
                                                fontWeight: 'bold',
                                                border: '4px solid white',
                                                boxShadow: 3
                                            }}
                                        >
                                            {customer.profile.fullName.charAt(0)}
                                        </Avatar>
                                    )}
                                </Box>
                                {customer.profile.status && (
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            bottom: 4,
                                            right: 4,
                                            bgcolor: '#22c55e',
                                            height: 20,
                                            width: 20,
                                            borderRadius: '50%',
                                            border: '2px solid white'
                                        }}
                                    />
                                )}
                            </Box>

                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: '3px',
                                    flexDirection: 'column'
                                }}
                            >
                                <Typography variant='h4' fontWeight='bold'>
                                    {customer.profile.fullName}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1 }}>
                                    {<GetStyleCustomer customerRank={customer.profile.rank} />}
                                    {customer.profile.status ? (
                                        <Chip
                                            icon={
                                                <CheckCircleIcon
                                                    style={{ width: 16, height: 16, marginRight: 1, color: 'white' }}
                                                />
                                            }
                                            label={t('COMMON.CUSTOMER.ACTIVE')}
                                            size='small'
                                            sx={{
                                                bgcolor: '#00ff28a6',
                                                borderRadius: '9999px',
                                                color: 'white',
                                                fontWeight: 'bold',
                                                height: 'auto',
                                                padding: '5px 10px'
                                            }}
                                        />
                                    ) : (
                                        <Chip
                                            icon={
                                                <XCircleIcon
                                                    style={{ width: 16, height: 16, marginRight: 1, color: 'white' }}
                                                />
                                            }
                                            label={t('COMMON.CUSTOMER.INACTIVE')}
                                            size='small'
                                            sx={{
                                                bgcolor: '#e15f5a',
                                                borderRadius: '9999px',
                                                color: 'white',
                                                fontWeight: 'bold',
                                                height: 'auto',
                                                padding: '5px 10px'
                                            }}
                                        />
                                    )}
                                </Box>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        mt: 1,
                                        gap: '5px',
                                        color: 'rgba(255, 255, 255, 0.8)'
                                    }}
                                >
                                    <UserCircleIcon style={{ width: 16, height: 16, marginRight: 0.5 }} />
                                    <Typography variant='body2'> {customer.profile.username}</Typography>
                                </Box>
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { md: 'flex-end' } }}>
                            <Box sx={{ display: 'flex', gap: '25px', mb: 2 }}>
                                <Button
                                    variant='contained'
                                    startIcon={<MailIcon style={{ width: 16, height: 16 }} />}
                                    sx={{
                                        bgcolor: 'white',
                                        color: 'primary.main',
                                        px: 2,
                                        py: 1.25,
                                        fontWeight: 600,
                                        borderRadius: '9px',
                                        '&:hover': {
                                            bgcolor: '#e9f5ff'
                                        },
                                        textTransform: 'none'
                                    }}
                                >
                                    {t('COMMON.CUSTOMER.SEND_EMAIL')}
                                </Button>

                                <Button
                                    variant='contained'
                                    startIcon={<BellIcon style={{ width: 16, height: 16 }} />}
                                    sx={{
                                        bgcolor: '#007bff',
                                        color: 'white',
                                        px: 2,
                                        py: 1.25,
                                        fontWeight: 600,
                                        borderRadius: '9px',
                                        '&:hover': {
                                            bgcolor: '#1c74d7'
                                        },
                                        textTransform: 'none'
                                    }}
                                >
                                    {t('COMMON.BUTTON.UPDATE')}
                                </Button>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'right',
                                    flexDirection: 'column',
                                    gap: 1,
                                    color: 'rgba(255, 255, 255, 0.8)',
                                    fontSize: '14px'
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        marginLeft: 'auto',
                                        gap: '8px'
                                    }}
                                >
                                    <PackageIcon style={{ width: 16, height: 16, marginRight: 0.5 }} />
                                    <Typography variant='body2'>
                                        {customer.overview.orderCount} {t('COMMON.CUSTOMER.ORDER')}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <CalendarIcon style={{ width: 16, height: 16, marginRight: 0.5 }} />
                                    <Typography variant='body2'>
                                        {t('COMMON.CUSTOMER.CREATED_AT')} {formatDate(customer.profile.createdAt)}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>

                <Grid
                    container
                    columnSpacing='24px'
                    rowSpacing={1}
                    sx={{ p: 3, backgroundColor: 'var(--background-color-secondary)' }}
                >
                    <Grid size={4}>
                        <Paper
                            elevation={0}
                            sx={{
                                background: 'linear-gradient(to bottom right, #dfedff, #bedaff)',
                                borderRadius: 4,
                                p: 3,
                                display: 'flex',
                                flexDirection: 'column',
                                border: '1px solid #a3c2ff',
                                '&:hover': {
                                    boxShadow: 2,
                                    transition: 'box-shadow 0.1s ease-in-out'
                                }
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'top', mb: 1 }}>
                                <Typography variant='body2' fontWeight='bold' fontSize={16} color='#2563eb'>
                                    {t('COMMON.CUSTOMER.TOTAL_SPENT')}
                                </Typography>
                                <Box sx={{ bgcolor: '#3b82f6', borderRadius: 2, p: 1, color: 'white' }}>
                                    <CreditCardIcon style={{ height: 20, width: 20 }} />
                                </Box>
                            </Box>
                            <Typography
                                variant='h5'
                                fontWeight='bold'
                                color='text.primary'
                                sx={{
                                    mb: 1
                                }}
                            >
                                {formatCurrency(customer.overview.totalSpent)}
                            </Typography>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mt: 1,
                                    color: '#2563eb'
                                }}
                            >
                                <TrendingUpIcon style={{ height: 15, width: 15, marginRight: '8px' }} />

                                <Typography
                                    sx={{
                                        fontSize: '14px'
                                    }}
                                >
                                    {t('COMMON.UP_FROM_PERIOD', { value: '20' })}
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>

                    <Grid size={4}>
                        <Paper
                            elevation={0}
                            sx={{
                                background: 'linear-gradient(to bottom right, #fffbeb , #fef3c7)',
                                borderRadius: 4,
                                p: 3,
                                display: 'flex',
                                flexDirection: 'column',
                                border: '1px solid #ffe082',
                                '&:hover': {
                                    boxShadow: 2,
                                    transition: 'box-shadow 0.1s ease-in-out'
                                }
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'top', mb: 1 }}>
                                <Typography variant='body2' fontWeight={600} fontSize={16} color='#fb931a'>
                                    {t('COMMON.CUSTOMER.TOTAL_ORDER')}
                                </Typography>
                                <Box sx={{ bgcolor: '#ff8826', borderRadius: 2, p: 1, color: 'white' }}>
                                    <ShoppingBagIcon style={{ height: 20, width: 20 }} />
                                </Box>
                            </Box>
                            <Typography
                                variant='h5'
                                fontWeight='bold'
                                color='text.primary'
                                sx={{
                                    mb: 1
                                }}
                            >
                                {customer.overview.orderCount}
                            </Typography>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mt: 1,
                                    color: '#fb931a'
                                }}
                            >
                                <RefreshCwIcon style={{ height: 15, width: 15, marginRight: '8px' }} />
                                <Typography
                                    sx={{
                                        fontSize: '14px'
                                    }}
                                >
                                    {t('COMMON.CUSTOMER.LAST_PURCHASE', {
                                        value: formatDate(customer.overview.lastPurchaseDate) || 'N/A'
                                    })}
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* <Grid size={4}>
                        <Paper
                            elevation={1}
                            sx={{
                                background: 'linear-gradient(to bottom right, #fffbeb , #fef3c7)',
                                borderRadius: 4,
                                p: 3,
                                display: 'flex',
                                flexDirection: 'column',
                                border: '1px solid #ffe082',
                                '&:hover': {
                                    boxShadow: 2,
                                    transition: 'box-shadow 0.1s ease-in-out'
                                }
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant='body2' fontWeight={500} color='#fb931a'>
                                    Đánh giá sản phẩm
                                </Typography>
                                <Box sx={{ bgcolor: '#ff8826', borderRadius: 2, p: 1, color: 'white' }}>
                                    <StarIcon style={{ height: 20, width: 20 }} />
                                </Box>
                            </Box>
                            <Typography variant='h5' fontWeight='bold' color='text.primary'>
                                {customer.loyaltyPoints}
                            </Typography>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mt: 1,
                                    color: '#fb931a',
                                    fontSize: '0.75rem'
                                }}
                            >
                                <GiftIcon style={{ height: 12, width: 12, marginRight: 0.5 }} />
                                <Typography variant='caption'>Có thể đổi voucher 200.000 VND</Typography>
                            </Box>
                        </Paper>
                    </Grid> */}

                    <Grid size={4}>
                        <Paper
                            elevation={0}
                            sx={{
                                background: 'linear-gradient(to bottom right, #ecfdf5 , #d1fae5)',
                                borderRadius: 4,
                                p: 3,
                                display: 'flex',
                                flexDirection: 'column',
                                border: '1px solid #d1fae5',
                                '&:hover': {
                                    boxShadow: 2,
                                    transition: 'box-shadow 0.1s ease-in-out'
                                }
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'top', mb: 1 }}>
                                <Typography variant='body2' fontSize={16} fontWeight={600} color='#059669'>
                                    {t('COMMON.CUSTOMER.AVERAGE_ORDER')}
                                </Typography>
                                <Box sx={{ bgcolor: '#10b981', borderRadius: 2, p: 1, color: 'white' }}>
                                    <ChartBarIcon style={{ height: 20, width: 20 }} />
                                </Box>
                            </Box>
                            <Typography
                                variant='h5'
                                fontWeight='bold'
                                color='text.primary'
                                sx={{
                                    mb: 1
                                }}
                            >
                                {Math.round(
                                    customer.overview.totalSpent / customer.overview.orderCount
                                ).toLocaleString()}{' '}
                                VND
                            </Typography>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mt: 1,
                                    color: '#059669'
                                }}
                            >
                                <TrendingUpIcon style={{ height: 15, width: 15, marginRight: '8px' }} />

                                <Typography
                                    sx={{
                                        fontSize: '14px'
                                    }}
                                >
                                    {t('COMMON.HIGHER_THAN_AVERAGE', { value: '15' })}
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Paper>

            <Paper
                sx={{
                    mt: '10px',
                    borderRadius: '15px',
                    backgroundColor: 'var(--background-color-item)'
                }}
            >
                <Tabs
                    value={activeTab}
                    onChange={(_, newValue) => setActiveTab(newValue)}
                    indicatorColor='primary'
                    textColor='primary'
                    sx={{
                        maxHeight: '60px',
                        display: 'flex',
                        borderRadius: '15px 0 0 0',
                        borderBottom: '1px solid var(--border-color)',
                        alignItems: 'center',
                        '& .Mui-selected': {
                            backgroundColor: '#2c6cee !important',
                            color: 'white !important'
                        }
                    }}
                >
                    <Tab
                        label={t('COMMON.CUSTOMER.PERSONAL_INFO')}
                        value='info'
                        iconPosition='start'
                        icon={
                            <UserCircleIcon
                                size={20}
                                style={{
                                    marginRight: '10px'
                                }}
                            />
                        }
                        sx={{
                            padding: '10px 24px',
                            color: 'var(--label-title-color)',
                            '&: hover': {
                                backgroundColor: 'var(--background-color-item-hover)'
                            },
                            fontWeight: 'bold',
                            textTransform: 'none'
                        }}
                    />
                    <Tab
                        label={t('COMMON.CUSTOMER.ORDER')}
                        value='orders'
                        iconPosition='start'
                        icon={
                            <ShoppingCartIcon
                                size={20}
                                style={{
                                    marginRight: '10px'
                                }}
                            />
                        }
                        sx={{
                            padding: '10px 24px',
                            color: 'var(--label-title-color)',
                            '&: hover': {
                                backgroundColor: 'var(--background-color-item-hover)'
                            },
                            fontWeight: 'bold',
                            textTransform: 'none'
                        }}
                    />
                    {/* <Tab
                        label={t('COMMON.CUSTOMER.STATISTIC')}
                        value='stats'
                        iconPosition='start'
                        icon={
                            <ChartBarIcon
                                size={20}
                                style={{
                                    marginRight: '10px'
                                }}
                            />
                        }
                        sx={{
                            padding: '10px 24px',
                            color: 'var(--label-title-color)',
                            '&: hover': {
                                backgroundColor: 'var(--background-color-item-hover)'
                            },
                            fontWeight: 'bold',
                            textTransform: 'none'
                        }}
                    /> */}
                </Tabs>

                <Box
                    sx={{
                        padding: '24px'
                    }}
                >
                    {activeTab === 'info' && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: '18px',
                                        color: 'var(--text-color)',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {t('COMMON.CUSTOMER.INFO')}
                                </Typography>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '5px',
                                        color: '#0087ff',
                                        cursor: 'pointer',
                                        userSelect: 'none',
                                        '&:hover': {
                                            color: '#0078e3'
                                        }
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: '14px',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        {t('COMMON.CUSTOMER.UPDATE_INFO')}
                                    </Typography>
                                    <ChevronRightIcon style={{ width: 16, height: 16 }} />
                                </Box>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'stretch',
                                    gap: '24px'
                                }}
                            >
                                <Box
                                    sx={{
                                        padding: '24px',
                                        flex: 1,
                                        borderRadius: '12px',
                                        backgroundColor: 'var(--background-color-secondary)',
                                        border: '1px solid var(--border-content)'
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: '16px',
                                            fontWeight: 'bold',
                                            color: 'var(--text-color)',
                                            mb: '10px'
                                        }}
                                    >
                                        {t('COMMON.CUSTOMER.PERSONAL_INFO')}
                                    </Typography>

                                    <TableContainer>
                                        <Table>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell
                                                        sx={{
                                                            color: 'var(--label-title-color)',
                                                            width: '30%',
                                                            fontSize: '14px',
                                                            paddingLeft: 0,
                                                            borderBottom: '1px dashed var(--border-color)'
                                                        }}
                                                    >
                                                        {t('COMMON.CUSTOMER.FULL_NAME')}
                                                    </TableCell>
                                                    <TableCell
                                                        sx={{
                                                            fontSize: '15px',
                                                            color: 'var(--text-color)',
                                                            // fontWeight: 'bold',
                                                            borderBottom: '1px dashed var(--border-color)'
                                                        }}
                                                    >
                                                        {customer.profile.fullName}
                                                    </TableCell>
                                                </TableRow>

                                                <TableRow>
                                                    <TableCell
                                                        sx={{
                                                            color: 'var(--label-title-color)',
                                                            fontSize: '14px',
                                                            paddingLeft: 0,
                                                            borderBottom: '1px dashed var(--border-color)'
                                                        }}
                                                    >
                                                        {t('COMMON.CUSTOMER.USER_NAME')}
                                                    </TableCell>
                                                    <TableCell
                                                        sx={{
                                                            fontSize: '15px',
                                                            color: 'var(--text-color)',
                                                            // fontWeight: 'bold',
                                                            borderBottom: '1px dashed var(--border-color)'
                                                        }}
                                                    >
                                                        {customer.profile.username}
                                                    </TableCell>
                                                </TableRow>

                                                <TableRow>
                                                    <TableCell
                                                        sx={{
                                                            color: 'var(--label-title-color)',
                                                            fontSize: '14px',
                                                            paddingLeft: 0,
                                                            borderBottom: '1px dashed var(--border-color)'
                                                        }}
                                                    >
                                                        {t('COMMON.CUSTOMER.GENDER')}
                                                    </TableCell>
                                                    <TableCell
                                                        sx={{
                                                            fontSize: '15px',
                                                            color: 'var(--text-color)',
                                                            // fontWeight: 'bold',
                                                            borderBottom: '1px dashed var(--border-color)'
                                                        }}
                                                    >
                                                        {customer.profile.gender
                                                            ? t('COMMON.EMPLOYEES.MALE')
                                                            : t('COMMON.EMPLOYEES.FEMALE')}
                                                    </TableCell>
                                                </TableRow>

                                                <TableRow>
                                                    <TableCell
                                                        sx={{
                                                            color: 'var(--label-title-color)',
                                                            fontSize: '14px',
                                                            paddingLeft: 0,
                                                            paddingBottom: 0,
                                                            borderBottom: 'none'
                                                        }}
                                                    >
                                                        {t('COMMON.CUSTOMER.BIRTHDAY')}
                                                    </TableCell>
                                                    <TableCell
                                                        sx={{
                                                            fontSize: '15px',
                                                            color: 'var(--text-color)',
                                                            // fontWeight: 'bold',
                                                            paddingBottom: 0,
                                                            borderBottom: 'none'
                                                        }}
                                                    >
                                                        {formatDate(customer.profile.birthday)}
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Box>

                                <Box
                                    sx={{
                                        padding: '24px',
                                        flex: 1,
                                        borderRadius: '12px',
                                        backgroundColor: 'var(--background-color-secondary)',
                                        border: '1px solid var(--border-content)'
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: '16px',
                                            color: 'var(--text-color)',
                                            fontWeight: 'bold',
                                            mb: '10px'
                                        }}
                                    >
                                        {t('COMMON.CUSTOMER.CONTACT_INFO')}
                                    </Typography>
                                    <TableContainer>
                                        <Table>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell
                                                        sx={{
                                                            width: '30%',
                                                            borderBottom: '1px dashed var(--border-color)',
                                                            color: 'var(--label-title-color)',
                                                            fontSize: '14px',
                                                            paddingLeft: 0
                                                        }}
                                                    >
                                                        {t('COMMON.CUSTOMER.ADDRESS')}
                                                    </TableCell>
                                                    <TableCell
                                                        sx={{
                                                            borderBottom: '1px dashed var(--border-color)'
                                                        }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                color: 'var(--text-color)',
                                                                alignItems: 'center',
                                                                // fontWeight: 'bold',
                                                                fontSize: '15px'
                                                            }}
                                                        >
                                                            <MapPinHouse className='w-5 h-5 mr-3 text-blue-400 flex-shrink-0 mt-0.5' />
                                                            {customer.profile.address}
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>

                                                <TableRow>
                                                    <TableCell
                                                        sx={{
                                                            borderBottom: '1px dashed var(--border-color)',
                                                            color: 'var(--label-title-color)',
                                                            fontSize: '14px',
                                                            paddingLeft: 0
                                                        }}
                                                    >
                                                        {t('COMMON.CUSTOMER.EMAIL')}
                                                    </TableCell>
                                                    <TableCell
                                                        sx={{
                                                            borderBottom: '1px dashed var(--border-color)'
                                                        }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                color: 'var(--text-color)',
                                                                alignItems: 'center',
                                                                // fontWeight: 'bold',
                                                                fontSize: '15px'
                                                            }}
                                                        >
                                                            <MailIcon className='w-5 h-5 mr-3 text-blue-400 flex-shrink-0 mt-0.5' />
                                                            {customer.profile.email}
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>

                                                <TableRow>
                                                    <TableCell
                                                        sx={{
                                                            borderBottom: 'none',
                                                            color: 'var(--label-title-color)',
                                                            fontSize: '14px',
                                                            paddingBottom: 0,
                                                            paddingLeft: 0
                                                        }}
                                                    >
                                                        {t('COMMON.CUSTOMER.PHONE')}
                                                    </TableCell>
                                                    <TableCell
                                                        sx={{
                                                            borderBottom: 'none',
                                                            paddingBottom: 0
                                                        }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                color: 'var(--text-color)',
                                                                alignItems: 'center',
                                                                // fontWeight: 'bold',
                                                                fontSize: '15px'
                                                            }}
                                                        >
                                                            <PhoneIcon className='w-5 h-5 mr-3 text-blue-400 flex-shrink-0 mt-0.5' />
                                                            {customer.profile.phoneNumber}
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Box>
                            </Box>

                            <Box
                                sx={{
                                    borderRadius: '12px',
                                    backgroundColor: 'var(--background-color-secondary)',
                                    overflow: 'hidden'
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: '16px',
                                        color: 'var(--text-color)',
                                        fontWeight: 'bold',
                                        m: '24px 24px 18px 24px'
                                    }}
                                >
                                    {t('COMMON.CUSTOMER.RECENTLY_ACTIVITY')}
                                </Typography>

                                <Box
                                    sx={{
                                        padding: '0 17px 24px 24px',
                                        flex: 1,
                                        maxHeight: '400px',
                                        overflow: 'auto',
                                        scrollbarGutter: 'stable',
                                        '&::-webkit-scrollbar': {
                                            width: '7px',
                                            height: '7px',
                                            backgroundColor: 'var(--background-color)'
                                        },
                                        '&::-webkit-scrollbar-thumb': {
                                            backgroundColor: 'var(--scrollbar-color)',
                                            borderRadius: '10px'
                                        }
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '10px'
                                        }}
                                    >
                                        {recentActivity.map((activity, index) => (
                                            <Box
                                                key={index}
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '25px',
                                                    ':not(:last-child)': {
                                                        pb: '10px',
                                                        borderBottom: '1px dashed var(--border-color)'
                                                    }
                                                }}
                                            >
                                                {activity.type === 'purchase' && (
                                                    <ShoppingBagIcon
                                                        style={{
                                                            width: '20px',
                                                            height: '20px',
                                                            color: '#60a5fa'
                                                        }}
                                                    />
                                                )}
                                                {activity.type === 'coupon' && (
                                                    <GiftIcon
                                                        style={{
                                                            width: '20px',
                                                            height: '20px',
                                                            color: '#60a5fa'
                                                        }}
                                                    />
                                                )}
                                                {activity.type === 'review' && (
                                                    <StarIcon
                                                        style={{
                                                            width: '20px',
                                                            height: '20px',
                                                            color: '#60a5fa'
                                                        }}
                                                    />
                                                )}
                                                {activity.type === 'wishlist' && (
                                                    <HeartIcon
                                                        style={{
                                                            width: '20px',
                                                            height: '20px',
                                                            color: '#60a5fa'
                                                        }}
                                                    />
                                                )}
                                                <Box
                                                    sx={{
                                                        flex: 1
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            fontSize: '15px',
                                                            color: 'var(--text-color)',
                                                            fontWeight: 'bold',
                                                            mb: '5px'
                                                        }}
                                                    >
                                                        {activity.event}
                                                    </Typography>

                                                    <Typography
                                                        sx={{
                                                            fontSize: '14px',
                                                            color: 'var(--label-title-color)'
                                                        }}
                                                    >
                                                        {activity.detail}
                                                    </Typography>
                                                </Box>

                                                <Typography
                                                    sx={{
                                                        fontSize: '14px',
                                                        color: 'var(--label-title-color)'
                                                    }}
                                                >
                                                    {activity.date}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    )}

                    {activeTab === 'orders' && (
                        <Box
                            sx={{
                                display: 'flex',
                                overflowX: 'auto',
                                flexDirection: 'column',
                                gap: '24px'
                            }}
                        >
                            <Grid container spacing='24px'>
                                <Grid
                                    size={4}
                                    sx={{
                                        height: '380px'
                                    }}
                                >
                                    <RateInventoryChart data={customer.orderStatusStats} />
                                </Grid>

                                <Grid size={8}>
                                    <Box
                                        sx={{
                                            borderRadius: '8px',
                                            overflow: 'hidden',
                                            border: '1px solid var(--border-color)'
                                        }}
                                    >
                                        <TableContainer
                                            sx={{
                                                maxHeight: '380px',
                                                '&::-webkit-scrollbar': {
                                                    width: '7px',
                                                    height: '7px',
                                                    backgroundColor: 'var(--background-color)'
                                                },
                                                '&::-webkit-scrollbar-thumb': {
                                                    backgroundColor: 'var(--scrollbar-color)',
                                                    borderRadius: '10px'
                                                },
                                                backgroundColor: 'var(--background-color-item)',
                                                overflow: 'auto'
                                            }}
                                        >
                                            <Table stickyHeader>
                                                <TableHead
                                                    sx={{
                                                        position: 'sticky',
                                                        top: 0,
                                                        zIndex: 1,
                                                        width: '100%'
                                                    }}
                                                >
                                                    <TableRow
                                                        sx={{
                                                            '&:last-child td, &:last-child th': {
                                                                border: 'none'
                                                            }
                                                        }}
                                                    >
                                                        <TableCell
                                                            sx={{
                                                                color: 'var(--label-title-color)',
                                                                fontSize: '14px',
                                                                backgroundColor: 'var(--background-color-table-header)',
                                                                fontWeight: 'bold'
                                                            }}
                                                        >
                                                            {t('COMMON.CUSTOMER.ORDER_ID')}
                                                        </TableCell>
                                                        <TableCell
                                                            sx={{
                                                                backgroundColor: 'var(--background-color-table-header)',
                                                                color: 'var(--label-title-color)',
                                                                fontSize: '14px',
                                                                fontWeight: 'bold'
                                                            }}
                                                        >
                                                            {t('COMMON.CUSTOMER.ORDER_DATE')}
                                                        </TableCell>
                                                        <TableCell
                                                            sx={{
                                                                backgroundColor: 'var(--background-color-table-header)',
                                                                color: 'var(--label-title-color)',
                                                                fontSize: '14px',
                                                                fontWeight: 'bold'
                                                            }}
                                                        >
                                                            {t('COMMON.CUSTOMER.COUNT')}
                                                        </TableCell>
                                                        <TableCell
                                                            sx={{
                                                                backgroundColor: 'var(--background-color-table-header)',
                                                                color: 'var(--label-title-color)',
                                                                fontSize: '14px',
                                                                fontWeight: 'bold',
                                                                textAlign: 'right'
                                                            }}
                                                        >
                                                            {t('COMMON.CUSTOMER.TOTAL')}
                                                        </TableCell>
                                                        <TableCell
                                                            sx={{
                                                                backgroundColor: 'var(--background-color-table-header)',
                                                                color: 'var(--label-title-color)',
                                                                fontSize: '14px',
                                                                textAlign: 'center',
                                                                fontWeight: 'bold'
                                                            }}
                                                        >
                                                            {t('COMMON.CUSTOMER.STATUS')}
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHead>

                                                <TableBody>
                                                    {customer?.recentOrders &&
                                                        customer?.recentOrders.map((order, index) => (
                                                            <TableRow
                                                                key={index}
                                                                sx={{
                                                                    '&:last-child td, &:last-child th': {
                                                                        border: 'none'
                                                                    },
                                                                    transition: 'background-color 60ms ease-in-out',
                                                                    backgroundColor:
                                                                        index % 2 === 1
                                                                            ? 'var(--background-color-table-body)'
                                                                            : 'transparent',
                                                                    '&:hover': {
                                                                        backgroundColor:
                                                                            'var(--hover-color-table-body) !important'
                                                                    }
                                                                }}
                                                            >
                                                                <TableCell
                                                                    sx={{
                                                                        borderBottom: '1px dashed var(--border-color)',
                                                                        fontSize: '15px',
                                                                        color: '#0087ff',
                                                                        fontWeight: 'bold'
                                                                    }}
                                                                    onClick={() =>
                                                                        router.push(`/admin/orders/${order.orderCode}`)
                                                                    }
                                                                >
                                                                    {order.orderCode}
                                                                </TableCell>
                                                                <TableCell
                                                                    sx={{
                                                                        borderBottom: '1px dashed var(--border-color)',
                                                                        color: 'var(--text-color)',
                                                                        fontSize: '15px'
                                                                    }}
                                                                >
                                                                    {order.orderDate}
                                                                </TableCell>
                                                                <TableCell
                                                                    sx={{
                                                                        borderBottom: '1px dashed var(--border-color)',
                                                                        color: 'var(--text-color)',
                                                                        textTransform: 'none',
                                                                        fontSize: '15px'
                                                                    }}
                                                                >
                                                                    {order.productCount} {t('COMMON.CUSTOMER.PRODUCTS')}
                                                                </TableCell>
                                                                <TableCell
                                                                    sx={{
                                                                        borderBottom: '1px dashed var(--border-color)',
                                                                        fontSize: '15px',
                                                                        color: 'var(--text-color)',
                                                                        textAlign: 'right',
                                                                        fontWeight: 'bold'
                                                                    }}
                                                                >
                                                                    {formatCurrency(order.total)}
                                                                </TableCell>
                                                                <TableCell
                                                                    sx={{
                                                                        borderBottom: '1px dashed var(--border-color)',
                                                                        padding: '13px 16px',
                                                                        fontSize: '15px'
                                                                    }}
                                                                >
                                                                    <Box
                                                                        sx={{
                                                                            borderRadius: '9999px',
                                                                            padding: '5px 12px',
                                                                            margin: 'auto',
                                                                            border: getBorderColor(order.status),
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            maxWidth: '110px',
                                                                            minWidth: '100px',
                                                                            justifyContent: 'center',
                                                                            backgroundColor: getStatusBgColor(
                                                                                order.status
                                                                            )
                                                                        }}
                                                                    >
                                                                        <Typography
                                                                            sx={{
                                                                                fontSize: '13px',
                                                                                overflow: 'hidden',
                                                                                color: getStatusTextColor(order.status),
                                                                                width: 'auto',
                                                                                fontWeight: 'bold',
                                                                                display: 'inline-block',
                                                                                textOverflow: 'ellipsis',
                                                                                whiteSpace: 'nowrap'
                                                                            }}
                                                                        >
                                                                            {order.status === 'pending' &&
                                                                                t('COMMON.ORDER.PENDING')}
                                                                            {order.status === 'returned' &&
                                                                                t('COMMON.ORDER.RETURNED')}
                                                                            {order.status === 'processing' &&
                                                                                t('COMMON.ORDER.PROCESSING')}
                                                                            {order.status === 'shipping' &&
                                                                                t('COMMON.ORDER.SHIPPING')}
                                                                            {order.status === 'delivered' &&
                                                                                t('COMMON.ORDER.DELIVERED')}
                                                                            {order.status === 'cancelled' &&
                                                                                t('COMMON.ORDER.CANCELLED')}
                                                                        </Typography>
                                                                    </Box>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Box>
                                </Grid>
                            </Grid>

                            <Grid container columnSpacing='24px'>
                                <Grid
                                    size={8}
                                    sx={{
                                        backgroundColor: 'var(--background-color-secondary)',
                                        borderRadius: '12px',
                                        padding: '20px'
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontWeight: 'bold',
                                            color: 'var(--text-color)',
                                            fontSize: '16px',
                                            mb: '20px'
                                        }}
                                    >
                                        {t('COMMON.CUSTOMER.SHOPPING_TREND')}
                                    </Typography>
                                    <ReactECharts option={option} style={{ height: '265px', width: '100%' }} />
                                </Grid>

                                <Grid
                                    size={4}
                                    sx={{
                                        backgroundColor: 'var(--background-color-secondary)',
                                        borderRadius: '12px',
                                        padding: '20px',
                                        border: '1px solid var(--border-content)'
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            color: 'var(--text-color)',
                                            fontSize: '16px',
                                            fontWeight: 'bold',
                                            mb: '20px'
                                        }}
                                    >
                                        {t('COMMON.CUSTOMER.PAYMENT_METHOD')}
                                    </Typography>

                                    <Paper
                                        sx={{
                                            display: 'flex',
                                            backgroundColor: 'var(--background-color-item)',
                                            borderRadius: '10px',
                                            alignItems: 'center',
                                            padding: '15px 18px',
                                            mb: '18px',
                                            gap: '15px'
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: '40px',
                                                height: '40px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRadius: '8px',
                                                color: '#3b82f6',
                                                backgroundColor: '#d2e4ff'
                                            }}
                                        >
                                            <CreditCardIcon style={{ width: '20px', height: '20px' }} />
                                        </Box>

                                        <Box>
                                            <Typography
                                                sx={{
                                                    fontWeight: 'bold',
                                                    color: 'var(--text-color)',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                VNPAY
                                            </Typography>

                                            <Typography
                                                sx={{
                                                    color: 'var(--label-title-color)',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                {t('COMMON.CUSTOMER.DIGITAL_WALLET')}
                                            </Typography>
                                        </Box>

                                        <Typography
                                            sx={{
                                                fontWeight: 'bold',
                                                color: 'var(--text-color)',
                                                fontSize: '14px',
                                                ml: 'auto'
                                            }}
                                        >
                                            {customer?.paymentStats.vnpay}%
                                        </Typography>
                                    </Paper>

                                    <Paper
                                        sx={{
                                            display: 'flex',
                                            backgroundColor: 'var(--background-color-item)',
                                            borderRadius: '10px',
                                            alignItems: 'center',
                                            padding: '15px 18px',
                                            mb: '18px',
                                            gap: '15px'
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: '40px',
                                                height: '40px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRadius: '8px',
                                                color: '#22c55e',
                                                backgroundColor: '#dcfce7'
                                            }}
                                        >
                                            <CreditCardIcon style={{ width: '20px', height: '20px' }} />
                                        </Box>

                                        <Box>
                                            <Typography
                                                sx={{
                                                    color: 'var(--text-color)',
                                                    fontWeight: 'bold',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                MOMO
                                            </Typography>

                                            <Typography
                                                sx={{
                                                    color: 'var(--label-title-color)',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                {t('COMMON.CUSTOMER.DIGITAL_WALLET')}
                                            </Typography>
                                        </Box>

                                        <Typography
                                            sx={{
                                                color: 'var(--text-color)',
                                                fontWeight: 'bold',
                                                fontSize: '14px',
                                                ml: 'auto'
                                            }}
                                        >
                                            {customer?.paymentStats.momo}%
                                        </Typography>
                                    </Paper>

                                    <Paper
                                        sx={{
                                            display: 'flex',
                                            backgroundColor: 'var(--background-color-item)',
                                            borderRadius: '10px',
                                            alignItems: 'center',
                                            padding: '15px 18px',
                                            gap: '15px'
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: '40px',
                                                height: '40px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRadius: '8px',
                                                color: '#f59e0b',
                                                backgroundColor: '#fef3c7'
                                            }}
                                        >
                                            <CreditCardIcon style={{ width: '20px', height: '20px' }} />
                                        </Box>

                                        <Box>
                                            <Typography
                                                sx={{
                                                    color: 'var(--text-color)',
                                                    fontWeight: 'bold',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                COD
                                            </Typography>

                                            <Typography
                                                sx={{
                                                    color: 'var(--label-title-color)',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                {t('COMMON.CUSTOMER.CASH')}
                                            </Typography>
                                        </Box>

                                        <Typography
                                            sx={{
                                                color: 'var(--text-color)',
                                                fontWeight: 'bold',
                                                fontSize: '14px',
                                                ml: 'auto'
                                            }}
                                        >
                                            {customer?.paymentStats.cod}%
                                        </Typography>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Box>
                    )}

                    {activeTab === 'stats' && (
                        <Grid container spacing='24px'>
                            <Grid
                                size={8}
                                sx={{
                                    height: '400px',
                                    backgroundColor: 'var(--background-color-secondary)',
                                    borderRadius: '10px',
                                    padding: '20px'
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: '16px',
                                        color: 'var(--text-color)',
                                        fontWeight: 'bold',
                                        mb: '10px'
                                    }}
                                >
                                    {t('COMMON.CUSTOMER.AVERAGE_BY_MONTH')}
                                </Typography>

                                <Box
                                    sx={{
                                        height: '320px'
                                    }}
                                >
                                    <Chart />
                                </Box>
                            </Grid>

                            <Grid
                                size={4}
                                sx={{
                                    height: '400px',
                                    backgroundColor: 'var(--background-color-secondary)',
                                    borderRadius: '10px',
                                    padding: '20px'
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        color: 'var(--text-color)',
                                        mb: '20px'
                                    }}
                                >
                                    {t('COMMON.CUSTOMER.ORDER_STATUS_OVERVIEW')}
                                </Typography>

                                <Box
                                    sx={{
                                        height: '310px'
                                    }}
                                >
                                    <OrderStatusChart />
                                </Box>
                            </Grid>

                            <Grid
                                size={12}
                                sx={{
                                    height: '400px',
                                    backgroundColor: 'var(--background-color-secondary)',
                                    borderRadius: '10px',
                                    padding: '20px'
                                }}
                            >
                                <Typography
                                    sx={{
                                        color: 'var(--text-color)',
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        mb: '20px'
                                    }}
                                >
                                    {t('COMMON.CUSTOMER.SHOPPING_TREND_BY_CATEGORY')}
                                </Typography>

                                <Box
                                    sx={{
                                        height: '310px'
                                    }}
                                >
                                    <TrendByCategories />
                                </Box>
                            </Grid>
                        </Grid>
                    )}
                </Box>
            </Paper>

            {/* <Paper
                sx={{
                    borderRadius: '15px',
                    backgroundColor: 'var(--background-color-item)',
                    overflow: 'hidden',
                    gap: '24px',
                    mt: '10px',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <Typography
                    sx={{
                        fontSize: '18px',
                        color: 'var(--text-color)',
                        fontWeight: 'bold'
                    }}
                >
                    {t('COMMON.CUSTOMER.CUSTOMER_NOTES')}
                </Typography>

                <Box
                    sx={{
                        width: '100%',
                        position: 'relative',
                        backgroundColor: 'var(--background-color-item)'
                    }}
                >
                    <textarea
                        placeholder={t('COMMON.CUSTOMER.NOTES_ABOUT_CUSTOMER')}
                        maxLength={1000}
                        style={{
                            width: '100%',
                            minHeight: 200,
                            height: 210,
                            maxHeight: 230,
                            backgroundColor: 'rgba(145, 158, 171, 0.08)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '10px',
                            color: 'var(--text-color)',
                            fontSize: '15px',
                            padding: '15px'
                        }}
                    />
                    <Button
                        sx={{
                            position: 'absolute',
                            bottom: '14px',
                            right: '10px',
                            backgroundColor: '#007bff',
                            borderRadius: '10px',
                            width: '40px',
                            height: '40px',
                            minWidth: 'unset'
                        }}
                    >
                        <PlusIcon style={{ color: '#fff' }} />
                    </Button>
                </Box>

                 <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px',
                        mt: '-5px',
                        width: '100%'
                    }}
                >
                    {customerNotes.map((note, index) => (
                        <Box
                            key={index}
                            sx={{
                                display: 'flex',
                                alignItems: 'top',
                                backgroundColor: 'var(--background-color-secondary)',
                                borderRadius: '10px',
                                padding: '16px 20px',
                                gap: '25px',
                                width: '100%'
                            }}
                        >
                            <Avatar src={note.avatarPath} sx={{ width: 45, height: 45 }} />

                            <Box
                                sx={{
                                    flex: 1
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: '15px',
                                        color: 'var(--text-color)',
                                        fontWeight: 'bold',
                                        mb: '5px'
                                    }}
                                >
                                    {note.fullname}
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: '14px',
                                        color: 'var(--label-title-color)'
                                    }}
                                >
                                    {note.content}
                                </Typography>
                            </Box>

                            <Typography
                                sx={{
                                    fontSize: '14px',
                                    color: 'var(--label-title-color)'
                                }}
                            >
                                {note.date}
                            </Typography>
                        </Box>
                    ))}
                </Box> 
            </Paper> */}
        </Box>
    )
}
