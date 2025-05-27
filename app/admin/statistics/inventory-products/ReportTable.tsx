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
    SelectChangeEvent
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Divider, Paper } from '@mui/material'
import dayjs from 'dayjs'
import { DatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { convertToVietnamTime, formatCurrency, formatDate } from '@/common/format'
import { CircleAlert, Download } from 'lucide-react'
import { ISupplierReportFilter, ISupplierReports } from '@/models/SupplierReports'

const orderReportData: ISupplierReports[] = [
    {
        avatarPath: 'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-1.webp',
        supplierPhone: '0901234567',
        supplierName: 'Cty ABC',
        totalImportValue: 690848640,
        importReceiptCount: 16,
        importedProductCount: 3981,
        importedSKUCount: 67,
        averageUnitPrice: 174105,
        lastImportDate: '05/05/2025',
        importValueContributionRate: 35.43
    },
    {
        avatarPath: 'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-2.webp',
        supplierPhone: '0901234567',
        supplierName: 'Cty Minh Phát',
        totalImportValue: 675464900,
        importReceiptCount: 22,
        importedProductCount: 3682,
        importedSKUCount: 51,
        averageUnitPrice: 183850,
        lastImportDate: '11/06/2025',
        importValueContributionRate: 34.64
    },
    {
        avatarPath: 'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-3.webp',
        supplierPhone: '0901234567',
        supplierName: 'Cty Tâm An',
        totalImportValue: 510465780,
        importReceiptCount: 10,
        importedProductCount: 2972,
        importedSKUCount: 33,
        averageUnitPrice: 171874,
        lastImportDate: '11/05/2025',
        importValueContributionRate: 26.18
    },
    {
        avatarPath: 'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-4.webp',
        supplierPhone: '0901234567',
        supplierName: 'Cty Hòa Bình',
        totalImportValue: 607998636,
        importReceiptCount: 18,
        importedProductCount: 3478,
        importedSKUCount: 35,
        averageUnitPrice: 175014,
        lastImportDate: '05/05/2025',
        importValueContributionRate: 31.18
    },
    {
        avatarPath: 'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-5.webp',
        supplierPhone: '0901234567',
        supplierName: 'Cty Đại Lợi',
        totalImportValue: 343662480,
        importReceiptCount: 21,
        importedProductCount: 1900,
        importedSKUCount: 69,
        averageUnitPrice: 181832,
        lastImportDate: '10/05/2025',
        importValueContributionRate: 17.62
    },
    {
        avatarPath: 'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-6.webp',
        supplierPhone: '0901234567',
        supplierName: 'Cty Nam Việt',
        totalImportValue: 466205070,
        importReceiptCount: 10,
        importedProductCount: 2371,
        importedSKUCount: 37,
        averageUnitPrice: 196711,
        lastImportDate: '07/05/2025',
        importValueContributionRate: 23.91
    },
    {
        avatarPath: 'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-7.webp',
        supplierPhone: '0901234567',
        supplierName: 'Cty Việt Á',
        totalImportValue: 432588600,
        importReceiptCount: 23,
        importedProductCount: 2780,
        importedSKUCount: 70,
        averageUnitPrice: 156735,
        lastImportDate: '08/05/2025',
        importValueContributionRate: 22.18
    },
    {
        avatarPath: 'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-8.webp',
        supplierPhone: '0901234567',
        supplierName: 'Cty Phương Đông',
        totalImportValue: 331459578,
        importReceiptCount: 9,
        importedProductCount: 1822,
        importedSKUCount: 33,
        averageUnitPrice: 182321,
        lastImportDate: '07/05/2025',
        importValueContributionRate: 17.0
    },
    {
        avatarPath: 'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-9.webp',
        supplierPhone: '0901234567',
        supplierName: 'Cty Ánh Dương',
        totalImportValue: 467704950,
        importReceiptCount: 25,
        importedProductCount: 2855,
        importedSKUCount: 42,
        averageUnitPrice: 164107,
        lastImportDate: '05/05/2025',
        importValueContributionRate: 23.98
    },
    {
        avatarPath: 'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-10.webp',
        supplierPhone: '0901234567',
        supplierName: 'Cty Ngọc Linh',
        totalImportValue: 562786992,
        importReceiptCount: 9,
        importedProductCount: 3120,
        importedSKUCount: 67,
        averageUnitPrice: 180728,
        lastImportDate: '05/05/2025',
        importValueContributionRate: 28.86
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
    const [filter, setFilter] = useState<ISupplierReportFilter>({
        pageSize: 10,
        pageNumber: 1,
        fromDate: dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
        toDate: dayjs().format('YYYY-MM-DD')
    })

    const totalRecords = orderReportData.length

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
        if (/*!isFetching && */ orderReportData) {
            const from = (page - 1) * Number(rowsPerPage) + Math.min(1, orderReportData?.length)
            setFrom(from)

            const to = Math.min(orderReportData?.length + (page - 1) * Number(rowsPerPage), totalRecords)
            setTo(to)
        }
    }, [, /*isFetching*/ orderReportData, page, rowsPerPage])

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
                {t('COMMON.ORDER_REPORTS.ORDER_REPORTS')}
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

                    <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <CircleAlert size={18} color={'var(--label-title-color)'} />
                        <Typography sx={{ color: 'var(--label-title-color)', fontSize: '14px', mt: '1px' }}>
                            {t('COMMON.INVENTORY_PRODUCTS_REPORTS.FILTER_DESC')}
                        </Typography>
                    </Box>
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
                                    active={'SupplierName' === orderBy}
                                    direction={orderBy === 'SupplierName' ? order : 'asc'}
                                    onClick={() => handleSort('SupplierName')}
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
                                        {t('COMMON.INVENTORY_PRODUCTS_REPORTS.SUPPLIER_NAME')}
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
                                    active={'TotalImportValue' === orderBy}
                                    direction={orderBy === 'TotalImportValue' ? order : 'asc'}
                                    onClick={() => handleSort('TotalImportValue')}
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
                                        {t('COMMON.INVENTORY_PRODUCTS_REPORTS.TOTAL_IMPORT_VALUE')}
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
                                    {t('COMMON.INVENTORY_PRODUCTS_REPORTS.IMPORT_RECEIPT_COUNT')}
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
                                    {t('COMMON.INVENTORY_PRODUCTS_REPORTS.IMPORTED_PRODUCT_COUNT')}
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
                                    {t('COMMON.INVENTORY_PRODUCTS_REPORTS.IMPORTED_SKU_COUNT')}
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
                                    {t('COMMON.INVENTORY_PRODUCTS_REPORTS.AVERAGE_UNIT_PRICE')}
                                </Typography>
                            </TableCell>

                            <TableCell
                                sx={{
                                    backgroundColor: 'var(--background-color-table-header)',
                                    borderColor: 'var(--border-color)'
                                }}
                            >
                                <TableSortLabel
                                    active={'LastImportDate' === orderBy}
                                    direction={orderBy === 'LastImportDate' ? order : 'asc'}
                                    onClick={() => handleSort('LastImportDate')}
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
                                        {t('COMMON.INVENTORY_PRODUCTS_REPORTS.LAST_IMPORT_DATE')}
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
                                    active={'ImportValueContributionRate' === orderBy}
                                    direction={orderBy === 'ImportValueContributionRate' ? order : 'asc'}
                                    onClick={() => handleSort('ImportValueContributionRate')}
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
                                        {t('COMMON.INVENTORY_PRODUCTS_REPORTS.IMPORT_VALUE_CONTRIBUTION_RATE')}
                                    </Typography>
                                </TableSortLabel>
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {orderReportData &&
                            orderReportData.map((row: ISupplierReports, index: number) => (
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
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: '16px 30px 16px 24px'
                                        }}
                                    >
                                        <Avatar
                                            src={row.avatarPath}
                                            sx={{
                                                width: '40px',
                                                height: '40px',
                                                marginRight: '14px'
                                            }}
                                        />
                                        <Box>
                                            <Typography
                                                sx={{
                                                    fontSize: '15px',
                                                    maxWidth: '280px',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                    fontWeight: 'bold',
                                                    color: 'var(--primary-color)'
                                                }}
                                            >
                                                {row.supplierName}
                                            </Typography>

                                            <Typography
                                                sx={{
                                                    mt: '2px',
                                                    color: 'var(--label-title-color)',
                                                    fontSize: '13px',
                                                    maxWidth: '280px',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {row.supplierPhone}
                                            </Typography>
                                        </Box>
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
                                            {formatCurrency(row.totalImportValue)}
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
                                            {row.importReceiptCount}
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
                                            {row.importedProductCount}
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
                                            {row.importedSKUCount}
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
                                            {formatCurrency(row.averageUnitPrice)}
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
                                            {formatDate(row.lastImportDate)}
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
                                                ml: '-25px',
                                                textAlign: 'center',
                                                fontWeight: 'bold',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                color: 'var(--report-text-color)'
                                            }}
                                        >
                                            {row.importValueContributionRate}%
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
