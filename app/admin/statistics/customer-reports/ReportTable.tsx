'use client'

import {
    Box,
    Typography,
    TableRow,
    TableBody,
    Table,
    TableCell,
    TableHead,
    TableContainer,
    TableSortLabel,
    Avatar,
    Select,
    MenuItem,
    Pagination,
    SelectChangeEvent,
    FormControl,
    InputLabel
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Divider, Paper, Tab, Tabs } from '@mui/material'
import dayjs from 'dayjs'
import { DatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { convertToVietnamTime, formatCurrency } from '@/common/format'
import { Download } from 'lucide-react'
import { ICustomerReportFilter, ICustomerReports } from '@/models/CustomerReports'

const customerReportData: ICustomerReports[] = [
    {
        date: '05/05/2025',
        customerCount: 105,
        newCustomerCount: 35,
        returningCustomerCount: 70,
        returningRate: 66.7,
        repeatCustomerCount: 15,
        newCustomerRate: 33.3,
        sameDayRepeatRate: 10,
        orderCount: 130,
        averageOrderPerCustomer: 1.24,
        revenue: 104500000,
        averageSpendPerCustomer: 995238,
        averageSpendPerOrder: 803846
    },
    {
        date: '06/05/2025',
        customerCount: 112,
        newCustomerCount: 40,
        returningCustomerCount: 72,
        returningRate: 64.3,
        repeatCustomerCount: 18,
        newCustomerRate: 35.7,
        sameDayRepeatRate: 8.9,
        orderCount: 145,
        averageOrderPerCustomer: 1.29,
        revenue: 110200000,
        averageSpendPerCustomer: 983929,
        averageSpendPerOrder: 760000
    },
    {
        date: '07/05/2025',
        customerCount: 98,
        newCustomerCount: 30,
        returningCustomerCount: 68,
        returningRate: 69.4,
        repeatCustomerCount: 12,
        newCustomerRate: 30.6,
        sameDayRepeatRate: 6.1,
        orderCount: 120,
        averageOrderPerCustomer: 1.22,
        revenue: 94500000,
        averageSpendPerCustomer: 964286,
        averageSpendPerOrder: 787500
    },
    {
        date: '08/05/2025',
        customerCount: 123,
        newCustomerCount: 50,
        returningCustomerCount: 73,
        returningRate: 59.3,
        repeatCustomerCount: 20,
        newCustomerRate: 40.7,
        sameDayRepeatRate: 11.4,
        orderCount: 160,
        averageOrderPerCustomer: 1.3,
        revenue: 125000000,
        averageSpendPerCustomer: 1016260,
        averageSpendPerOrder: 781250
    },
    {
        date: '09/05/2025',
        customerCount: 90,
        newCustomerCount: 20,
        returningCustomerCount: 70,
        returningRate: 77.8,
        repeatCustomerCount: 22,
        newCustomerRate: 22.2,
        sameDayRepeatRate: 14,
        orderCount: 115,
        averageOrderPerCustomer: 1.28,
        revenue: 91500000,
        averageSpendPerCustomer: 1016667,
        averageSpendPerOrder: 795652
    },
    {
        date: '10/05/2025',
        customerCount: 87,
        newCustomerCount: 33,
        returningCustomerCount: 54,
        returningRate: 62.1,
        repeatCustomerCount: 13,
        newCustomerRate: 37.9,
        sameDayRepeatRate: 9.2,
        orderCount: 108,
        averageOrderPerCustomer: 1.24,
        revenue: 83000000,
        averageSpendPerCustomer: 954023,
        averageSpendPerOrder: 768519
    },
    {
        date: '11/05/2025',
        customerCount: 100,
        newCustomerCount: 36,
        returningCustomerCount: 64,
        returningRate: 64,
        repeatCustomerCount: 16,
        newCustomerRate: 36,
        sameDayRepeatRate: 10,
        orderCount: 125,
        averageOrderPerCustomer: 1.25,
        revenue: 97000000,
        averageSpendPerCustomer: 970000,
        averageSpendPerOrder: 776000
    },
    {
        date: '12/05/2025',
        customerCount: 115,
        newCustomerCount: 45,
        returningCustomerCount: 70,
        returningRate: 60.9,
        repeatCustomerCount: 19,
        newCustomerRate: 39.1,
        sameDayRepeatRate: 9.6,
        orderCount: 140,
        averageOrderPerCustomer: 1.22,
        revenue: 112000000,
        averageSpendPerCustomer: 973913,
        averageSpendPerOrder: 800000
    },
    {
        date: '13/05/2025',
        customerCount: 109,
        newCustomerCount: 38,
        returningCustomerCount: 71,
        returningRate: 65.1,
        repeatCustomerCount: 17,
        newCustomerRate: 34.9,
        sameDayRepeatRate: 10.1,
        orderCount: 135,
        averageOrderPerCustomer: 1.24,
        revenue: 105000000,
        averageSpendPerCustomer: 963303,
        averageSpendPerOrder: 777778
    },
    {
        date: '14/05/2025',
        customerCount: 120,
        newCustomerCount: 40,
        returningCustomerCount: 80,
        returningRate: 66.7,
        repeatCustomerCount: 20,
        newCustomerRate: 33.3,
        sameDayRepeatRate: 10,
        orderCount: 150,
        averageOrderPerCustomer: 1.25,
        revenue: 120000000,
        averageSpendPerCustomer: 1000000,
        averageSpendPerOrder: 800000
    }
]

function ReportTable() {
    const { t } = useTranslation('common')
    const [order, setOrder] = useState<'asc' | 'desc'>('asc')
    const [orderBy, setOrderBy] = useState<string>('')
    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState('10')
    const [from, setFrom] = useState(1)
    const [to, setTo] = useState(10)
    const [filter, setFilter] = useState<ICustomerReportFilter>({
        pageSize: 10,
        pageNumber: 1,
        fromDate: dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
        toDate: dayjs().format('YYYY-MM-DD')
    })

    const totalRecords = customerReportData.length

    const handleSort = (property: string) => {
        setFilter(prev => ({
            ...prev,
            sortBy: property,
            isDesc: orderBy === property && order === 'asc' ? true : false
        }))
        if (orderBy === property) {
            setOrder(order === 'asc' ? 'desc' : 'asc')
        } else {
            setOrder('asc')
        }
        setOrderBy(property)
    }

    useEffect(() => {
        if (/*!isFetching && */ customerReportData) {
            const from = (page - 1) * Number(rowsPerPage) + Math.min(1, customerReportData?.length)
            setFrom(from)

            const to = Math.min(customerReportData?.length + (page - 1) * Number(rowsPerPage), totalRecords)
            setTo(to)
        }
    }, [, /*isFetching*/ customerReportData, page, rowsPerPage])

    const handleChangePage = (event: React.ChangeEvent<unknown>, newPage: number) => {
        setPage(newPage)
        setFilter(prev => {
            return {
                ...prev,
                pageNumber: newPage
            }
        })
    }

    const handleChangeRowsPerPage = (event: SelectChangeEvent) => {
        setPage(1)
        setRowsPerPage(event.target.value as string)
        setFilter(prev => {
            return {
                ...prev,
                pageSize: Number(event.target.value),
                pageNumber: 1
            }
        })
    }

    return (
        <Paper
            elevation={0}
            sx={{
                width: '100%',
                boxShadow: 'var(--box-shadow-paper)',
                overflow: 'hidden',
                borderRadius: '20px',
                backgroundColor: 'var(--background-color-item)'
            }}
        >
            <Typography
                sx={{
                    color: 'var(--text-color)',
                    fontWeight: 'bold',
                    fontSize: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '20px 24px'
                }}
            >
                {t('COMMON.CUSTOMER_REPORTS.CUSTOMER_REPORTS')}
            </Typography>

            <Divider
                sx={{
                    borderColor: 'var(--border-color)',
                    borderStyle: 'dashed'
                }}
            />

            <Box
                sx={{
                    margin: '24px 24px 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '24px'
                    }}
                >
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label={t('COMMON.ACTIVITY_LOG.FROM_DATE')}
                            value={dayjs(filter.fromDate)}
                            onChange={value => {
                                setFilter({
                                    ...filter,
                                    fromDate: convertToVietnamTime(value?.toDate() || new Date())
                                })
                                setPage(1)
                            }}
                            sx={{
                                width: '170px',
                                '& .MuiInputBase-root': {
                                    color: 'var(--text-color)'
                                },
                                '& .MuiInputBase-input': {
                                    padding: '14px 0 14px 14px !important'
                                },
                                '& .MuiInputLabel-root': {
                                    color: 'var(--label-title-color)'
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderRadius: '8px',
                                    borderColor: 'var(--border-color)'
                                },
                                '& .MuiSvgIcon-root': {
                                    color: 'var(--label-title-color)' // Màu của icon (lịch)
                                },
                                '& .MuiOutlinedInput-root': {
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'var(--field-hover-color)' // Màu viền khi hover
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'var(--field-selected-color) !important' // Màu viền khi focus, thêm !important để ghi đè
                                    }
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: 'var(--field-color-selected)',
                                    fontWeight: 'bold'
                                }
                            }}
                        />
                    </LocalizationProvider>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label={t('COMMON.ACTIVITY_LOG.TO_DATE')}
                            value={dayjs(filter.toDate)}
                            onChange={value => {
                                setFilter({
                                    ...filter,
                                    toDate: convertToVietnamTime(value?.toDate() || new Date())
                                })
                                setPage(1)
                            }}
                            sx={{
                                width: '170px',
                                '& .MuiInputBase-root': {
                                    color: 'var(--text-color)'
                                },
                                '& .MuiInputBase-input': {
                                    padding: '14px 0 14px 14px !important'
                                },
                                '& .MuiInputLabel-root': {
                                    color: 'var(--label-title-color)'
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderRadius: '8px',
                                    borderColor: 'var(--border-color)'
                                },
                                '& .MuiSvgIcon-root': {
                                    color: 'var(--label-title-color)' // Màu của icon (lịch)
                                },
                                '& .MuiOutlinedInput-root': {
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'var(--field-color-hover)' // Màu viền khi hover
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'var(--field-color-selected) !important' // Màu viền khi focus, thêm !important để ghi đè
                                    }
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: 'var(--field-color-selected)',
                                    fontWeight: 'bold'
                                }
                            }}
                        />
                    </LocalizationProvider>
                </Box>

                <Button
                    startIcon={<Download />}
                    sx={{
                        height: '51px',
                        backgroundColor: 'var(--background-color-button-save)',
                        width: 'auto',
                        padding: '0px 25px',
                        '&:hover': {
                            backgroundColor: 'var(--background-color-button-save-hover)'
                        },
                        color: 'var(--text-color-button-save)',
                        fontSize: '15px',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap',
                        textTransform: 'none'
                    }}
                >
                    {t('COMMON.BUTTON.EXPORT')}
                </Button>
            </Box>

            <TableContainer
                sx={{
                    mt: '24px',
                    maxHeight: '400px',
                    '&::-webkit-scrollbar': {
                        width: '7px',
                        height: '7px'
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: 'var(--scrollbar-color)',
                        borderRadius: '10px'
                    },
                    '&::-webkit-scrollbar-corner': {
                        backgroundColor: 'var(--scrollbar-color)'
                    }
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
                                },
                                width: '100%'
                            }}
                        >
                            <TableCell
                                sx={{
                                    backgroundColor: 'var(--background-color-table-header)',
                                    borderColor: 'var(--border-color)',
                                    padding: '16px 24px'
                                }}
                            >
                                <TableSortLabel
                                    active={'Date' === orderBy}
                                    direction={orderBy === 'Date' ? order : 'asc'}
                                    onClick={() => handleSort('Date')}
                                    sx={{
                                        '& .MuiTableSortLabel-icon': {
                                            color: 'var(--text-color) !important'
                                        }
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontWeight: 'bold',
                                            color: 'var(--text-color)',
                                            fontSize: '15px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {t('COMMON.REVENUE.DATE')}
                                    </Typography>
                                </TableSortLabel>
                            </TableCell>

                            <TableCell
                                sx={{
                                    backgroundColor: 'var(--background-color-table-header)',
                                    borderColor: 'var(--border-color)'
                                }}
                            >
                                <TableSortLabel
                                    active={'CustomerCount' === orderBy}
                                    direction={orderBy === 'CustomerCount' ? order : 'asc'}
                                    onClick={() => handleSort('CustomerCount')}
                                    sx={{
                                        '& .MuiTableSortLabel-icon': {
                                            color: 'var(--text-color) !important'
                                        }
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontWeight: 'bold',
                                            color: 'var(--text-color)',
                                            fontSize: '15px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {t('COMMON.CUSTOMER_REPORTS.TOTAL_CUSTOMERS')}
                                    </Typography>
                                </TableSortLabel>
                            </TableCell>

                            <TableCell
                                sx={{
                                    backgroundColor: 'var(--background-color-table-header)',
                                    borderColor: 'var(--border-color)'
                                }}
                            >
                                <TableSortLabel
                                    active={'NewCustomerCount' === orderBy}
                                    direction={orderBy === 'NewCustomerCount' ? order : 'asc'}
                                    onClick={() => handleSort('NewCustomerCount')}
                                    sx={{
                                        '& .MuiTableSortLabel-icon': {
                                            color: 'var(--text-color) !important'
                                        }
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontWeight: 'bold',
                                            color: 'var(--text-color)',
                                            fontSize: '15px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {t('COMMON.CUSTOMER_REPORTS.NEW_CUSTOMER_COUNT')}
                                    </Typography>
                                </TableSortLabel>
                            </TableCell>

                            <TableCell
                                sx={{
                                    backgroundColor: 'var(--background-color-table-header)',
                                    borderColor: 'var(--border-color)'
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontWeight: 'bold',
                                        color: 'var(--text-color)',
                                        fontSize: '15px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {t('COMMON.CUSTOMER_REPORTS.RETURNING_CUSTOMER_COUNT')}
                                </Typography>
                            </TableCell>

                            <TableCell
                                sx={{
                                    backgroundColor: 'var(--background-color-table-header)',
                                    borderColor: 'var(--border-color)'
                                }}
                            >
                                <TableSortLabel
                                    active={'ReturningRate' === orderBy}
                                    direction={orderBy === 'ReturningRate' ? order : 'asc'}
                                    onClick={() => handleSort('ReturningRate')}
                                    sx={{
                                        '& .MuiTableSortLabel-icon': {
                                            color: 'var(--text-color) !important'
                                        }
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontWeight: 'bold',
                                            color: 'var(--text-color)',
                                            fontSize: '15px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {t('COMMON.CUSTOMER_REPORTS.RETURNING_RATE')}
                                    </Typography>
                                </TableSortLabel>
                            </TableCell>

                            <TableCell
                                sx={{
                                    backgroundColor: 'var(--background-color-table-header)',
                                    borderColor: 'var(--border-color)'
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontWeight: 'bold',
                                        color: 'var(--text-color)',
                                        fontSize: '15px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {t('COMMON.CUSTOMER_REPORTS.REPEAT_CUSTOMER_COUNT')}
                                </Typography>
                            </TableCell>

                            <TableCell
                                sx={{
                                    backgroundColor: 'var(--background-color-table-header)',
                                    borderColor: 'var(--border-color)'
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontWeight: 'bold',
                                        color: 'var(--text-color)',
                                        fontSize: '15px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {t('COMMON.CUSTOMER_REPORTS.NEW_CUSTOMER_RATE')}
                                </Typography>
                            </TableCell>

                            <TableCell
                                sx={{
                                    backgroundColor: 'var(--background-color-table-header)',
                                    borderColor: 'var(--border-color)'
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontWeight: 'bold',
                                        color: 'var(--text-color)',
                                        fontSize: '15px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {t('COMMON.CUSTOMER_REPORTS.SAME_DAY_REPEAT_RATE')}
                                </Typography>
                            </TableCell>

                            <TableCell
                                sx={{
                                    backgroundColor: 'var(--background-color-table-header)',
                                    borderColor: 'var(--border-color)'
                                }}
                            >
                                <TableSortLabel
                                    active={'OrderCount' === orderBy}
                                    direction={orderBy === 'OrderCount' ? order : 'asc'}
                                    onClick={() => handleSort('OrderCount')}
                                    sx={{
                                        '& .MuiTableSortLabel-icon': {
                                            color: 'var(--text-color) !important'
                                        }
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontWeight: 'bold',
                                            color: 'var(--text-color)',
                                            fontSize: '15px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {t('COMMON.CUSTOMER_REPORTS.ORDER_COUNT')}
                                    </Typography>
                                </TableSortLabel>
                            </TableCell>

                            <TableCell
                                sx={{
                                    backgroundColor: 'var(--background-color-table-header)',
                                    borderColor: 'var(--border-color)'
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontWeight: 'bold',
                                        color: 'var(--text-color)',
                                        fontSize: '15px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {t('COMMON.CUSTOMER_REPORTS.AVERAGE_ORDER_PER_CUSTOMER')}
                                </Typography>
                            </TableCell>

                            <TableCell
                                sx={{
                                    backgroundColor: 'var(--background-color-table-header)',
                                    borderColor: 'var(--border-color)'
                                }}
                            >
                                <TableSortLabel
                                    active={'Revenue' === orderBy}
                                    direction={orderBy === 'Revenue' ? order : 'asc'}
                                    onClick={() => handleSort('Revenue')}
                                    sx={{
                                        '& .MuiTableSortLabel-icon': {
                                            color: 'var(--text-color) !important'
                                        }
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontWeight: 'bold',
                                            color: 'var(--text-color)',
                                            fontSize: '15px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {t('COMMON.CUSTOMER_REPORTS.REVENUE')}
                                    </Typography>
                                </TableSortLabel>
                            </TableCell>

                            <TableCell
                                sx={{
                                    backgroundColor: 'var(--background-color-table-header)',
                                    borderColor: 'var(--border-color)'
                                }}
                            >
                                <TableSortLabel
                                    active={'AverageSpendPerCustomer' === orderBy}
                                    direction={orderBy === 'AverageSpendPerCustomer' ? order : 'asc'}
                                    onClick={() => handleSort('AverageSpendPerCustomer')}
                                    sx={{
                                        '& .MuiTableSortLabel-icon': {
                                            color: 'var(--text-color) !important'
                                        }
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontWeight: 'bold',
                                            color: 'var(--text-color)',
                                            fontSize: '15px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {t('COMMON.CUSTOMER_REPORTS.AVERAGE_SPEND_PER_CUSTOMER')}
                                    </Typography>
                                </TableSortLabel>
                            </TableCell>

                            <TableCell
                                sx={{
                                    backgroundColor: 'var(--background-color-table-header)',
                                    borderColor: 'var(--border-color)'
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontWeight: 'bold',
                                        color: 'var(--text-color)',
                                        fontSize: '15px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {t('COMMON.CUSTOMER_REPORTS.AVERAGE_SPEND_PER_ORDER')}
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {customerReportData &&
                            customerReportData.map((row: ICustomerReports, index: number) => (
                                <TableRow
                                    key={index}
                                    sx={{
                                        '&:last-child td, &:last-child th': {
                                            border: 'none'
                                        },
                                        transition: 'background-color 60ms ease-in-out',
                                        backgroundColor:
                                            index % 2 === 1 ? 'var(--background-color-table-body)' : 'transparent',
                                        '&:hover': {
                                            backgroundColor: 'var(--hover-color-table-body) !important'
                                        }
                                    }}
                                >
                                    <TableCell
                                        sx={{
                                            borderColor: 'var(--border-color)',
                                            borderStyle: 'dashed',
                                            pl: '24px'
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontSize: '15px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                fontWeight: 'bold',
                                                color: 'var(--primary-color)'
                                            }}
                                        >
                                            {row.date}
                                        </Typography>
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            borderColor: 'var(--border-color)',
                                            borderStyle: 'dashed'
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontSize: '15px',
                                                overflow: 'hidden',
                                                fontWeight: 'bold',
                                                textAlign: 'center',
                                                ml: '-25px',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                color: '#00B85E'
                                            }}
                                        >
                                            {row.customerCount}
                                        </Typography>
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            borderColor: 'var(--border-color)',
                                            borderStyle: 'dashed'
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontSize: '15px',
                                                overflow: 'hidden',
                                                textAlign: 'center',
                                                ml: '-25px',
                                                fontWeight: 'bold',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                color: 'var(--report-text-color)'
                                            }}
                                        >
                                            {row.newCustomerCount}
                                        </Typography>
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            borderColor: 'var(--border-color)',
                                            borderStyle: 'dashed'
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontSize: '15px',
                                                overflow: 'hidden',
                                                textAlign: 'center',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                color: 'var(--text-color)'
                                            }}
                                        >
                                            {row.returningCustomerCount}
                                        </Typography>
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            borderColor: 'var(--border-color)',
                                            borderStyle: 'dashed'
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontSize: '15px',
                                                overflow: 'hidden',
                                                textAlign: 'center',
                                                ml: '-25px',
                                                fontWeight: 'bold',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                color: 'var(--report-text-color)'
                                            }}
                                        >
                                            {row.returningRate}%
                                        </Typography>
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            borderColor: 'var(--border-color)',
                                            borderStyle: 'dashed'
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontSize: '15px',
                                                overflow: 'hidden',
                                                textAlign: 'center',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                color: 'var(--text-color)'
                                            }}
                                        >
                                            {row.repeatCustomerCount}
                                        </Typography>
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            borderColor: 'var(--border-color)',
                                            borderStyle: 'dashed'
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontSize: '15px',
                                                overflow: 'hidden',
                                                textAlign: 'center',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                color: 'var(--text-color)'
                                            }}
                                        >
                                            {row.newCustomerRate}%
                                        </Typography>
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            borderColor: 'var(--border-color)',
                                            borderStyle: 'dashed'
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontSize: '15px',
                                                overflow: 'hidden',
                                                textAlign: 'center',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                color: 'var(--text-color)'
                                            }}
                                        >
                                            {row.sameDayRepeatRate}%
                                        </Typography>
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            borderColor: 'var(--border-color)',
                                            borderStyle: 'dashed'
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontSize: '15px',
                                                overflow: 'hidden',
                                                textAlign: 'center',
                                                ml: '-25px',
                                                fontWeight: 'bold',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                color: 'var(--report-text-color)'
                                            }}
                                        >
                                            {row.orderCount}
                                        </Typography>
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            borderColor: 'var(--border-color)',
                                            borderStyle: 'dashed'
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontSize: '15px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                textAlign: 'center',
                                                ml: '-25px',
                                                whiteSpace: 'nowrap',
                                                color: 'var(--text-color)'
                                            }}
                                        >
                                            {row.averageOrderPerCustomer}
                                        </Typography>
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            borderColor: 'var(--border-color)',
                                            borderStyle: 'dashed',
                                            pr: '24px'
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontSize: '15px',
                                                overflow: 'hidden',
                                                fontWeight: 'bold',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                color: '#00B85E'
                                            }}
                                        >
                                            {formatCurrency(row.revenue)}
                                        </Typography>
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            borderColor: 'var(--border-color)',
                                            borderStyle: 'dashed'
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontSize: '15px',
                                                overflow: 'hidden',
                                                fontWeight: 'bold',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                color: 'var(--report-text-color)'
                                            }}
                                        >
                                            {formatCurrency(row.averageSpendPerCustomer)}
                                        </Typography>
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            borderColor: 'var(--border-color)',
                                            borderStyle: 'dashed'
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontSize: '15px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                color: 'var(--text-color)'
                                            }}
                                        >
                                            {formatCurrency(row.averageSpendPerOrder)}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box display='flex' alignItems='center' justifyContent='space-between' padding='24px'>
                <Box display='flex' alignItems='center'>
                    <Typography sx={{ mr: '10px', color: 'var(--text-color)', fontSize: '15px' }}>
                        {t('COMMON.PAGINATION.ROWS_PER_PAGE')}
                    </Typography>
                    <Select
                        id='select'
                        sx={{
                            width: '71px',
                            padding: '5px',
                            borderRadius: '8px',
                            color: 'var(--text-color)',
                            '& .MuiSelect-icon': {
                                color: 'var(--text-color)'
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'var(--border-color)'
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'var(--field-color-hover)'
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'var(--field-color-selected)'
                            },
                            '& .MuiSelect-select': {
                                padding: '6px 32px 6px 10px'
                            }
                        }}
                        value={rowsPerPage}
                        defaultValue='10'
                        onChange={handleChangeRowsPerPage}
                        MenuProps={{
                            PaperProps: {
                                elevation: 0,
                                sx: {
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '8px',
                                    backgroundColor: 'var(--background-color-item)',
                                    '& .MuiList-root': {
                                        borderRadius: '0px',
                                        backgroundImage:
                                            'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSJ1cmwoI3BhaW50MF9yYWRpYWxfMjc0OV8xNDUxODYpIiBmaWxsLW9wYWNpdHk9IjAuMTIiLz4KPGRlZnM+CjxyYWRpYWxHcmFkaWVudCBpZD0icGFpbnQwX3JhZGlhbF8yNzQ5XzE0NTE4NiIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgxMjAgMS44MTgxMmUtMDUpIHJvdGF0ZSgtNDUpIHNjYWxlKDEyMy4yNSkiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMDBCOEQ5Ii8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzAwQjhEOSIgc3RvcC1vcGFjaXR5PSIwIi8+CjwvcmFkaWFsR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+Cg==), url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSJ1cmwoI3BhaW50MF9yYWRpYWxfMjc0OV8xNDUxODcpIiBmaWxsLW9wYWNpdHk9IjAuMTIiLz4KPGRlZnM+CjxyYWRpYWxHcmFkaWVudCBpZD0icGFpbnQwX3JhZGlhbF8yNzQ5XzE0NTE4NyIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIDEyMCkgcm90YXRlKDEzNSkgc2NhbGUoMTIzLjI1KSI+CjxzdG9wIHN0b3AtY29sb3I9IiNGRjU2MzAiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjRkY1NjMwIiBzdG9wLW9wYWNpdHk9IjAiLz4KPC9yYWRpYWxHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K)',
                                        backgroundPosition: 'top right, bottom left',
                                        backgroundSize: '50%, 50%',
                                        backgroundRepeat: 'no-repeat',
                                        backdropFilter: 'blur(20px)',
                                        backgroundColor: 'var(--background-color-item)',
                                        padding: '5px',
                                        '& .MuiMenuItem-root': {
                                            color: 'var(--text-color)',
                                            borderRadius: '6px',
                                            '&:hover': {
                                                backgroundColor: 'var(--background-color-item-hover) !important'
                                            },
                                            '&.Mui-selected': {
                                                backgroundColor: 'var(--background-color-item-selected)'
                                            }
                                        }
                                    }
                                }
                            }
                        }}
                    >
                        <MenuItem sx={{ marginBottom: '3px' }} value={5}>
                            5
                        </MenuItem>
                        <MenuItem sx={{ marginBottom: '3px' }} value={10}>
                            10
                        </MenuItem>
                        <MenuItem sx={{ marginBottom: '3px' }} value={20}>
                            20
                        </MenuItem>
                        <MenuItem sx={{ marginBottom: '3px' }} value={30}>
                            30
                        </MenuItem>
                        <MenuItem value={40}>40</MenuItem>
                    </Select>
                    <Typography sx={{ ml: '30px', color: 'var(--text-color)', fontSize: '15px' }}>
                        {t('COMMON.PAGINATION.FROM_TO', { from, to, totalRecords })}
                    </Typography>
                </Box>

                <Pagination
                    count={Math.ceil(totalRecords / (rowsPerPage ? Number(rowsPerPage) : 1))}
                    page={page}
                    onChange={handleChangePage}
                    boundaryCount={2}
                    siblingCount={0}
                    variant='outlined'
                    sx={{
                        color: 'var(--text-color)',
                        borderColor: 'var(--border-color)',
                        '& .MuiPaginationItem-root': {
                            color: 'var(--text-color)',
                            borderColor: 'var(--border-color)',
                            '&.Mui-selected': {
                                backgroundColor: 'var(--background-color-item-selected) ',
                                borderColor: 'var(--background-color-item-selected) ',
                                color: 'var(--text-color)'
                            },
                            '&:hover': {
                                backgroundColor: 'var(--background-color-item-hover) !important',
                                borderColor: 'var(--background-color-item-hover) !important'
                            }
                        }
                    }}
                    color='primary'
                />
            </Box>
        </Paper>
    )
}

export default ReportTable
