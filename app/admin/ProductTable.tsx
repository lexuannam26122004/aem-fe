'use client'

import {
    Box,
    Typography,
    Tooltip,
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
import { Badge } from '@/components/ui/badge'
import { Edit, EyeIcon, StarIcon, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import { Button, Divider, Paper, Tab, Tabs } from '@mui/material'
import { useToast } from '@/hooks/useToast'
import { IProduct, IProductCreate, IProductFilter } from '@/models/Product'

const badgeStyle: React.CSSProperties = {
    fontSize: '12px',
    height: '24px',
    minWidth: '24px',
    borderRadius: '6px',
    padding: '0px 7px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
}

function getStatusBgColor(row: IProduct): string {
    if (row.stockQuantity === 0) {
        return 'var(--background-color-cancel)'
    } else if (row.stockQuantity <= row.minStockThreshold) {
        return 'var(--background-color-pending)'
    } else {
        return 'var(--background-color-success)'
    }
}

function getBorderColor(row: IProduct): string {
    if (row.stockQuantity === 0) {
        return '1px solid var(--border-color-cancel)'
    } else if (row.stockQuantity <= row.minStockThreshold) {
        return '1px solid var(--border-color-pending)'
    } else {
        return '1px solid var(--border-color-success)'
    }
}

function getStatusTextColor(row: IProduct): string {
    if (row.stockQuantity === 0) {
        return 'var(--text-color-cancel)'
    } else if (row.stockQuantity <= row.minStockThreshold) {
        return 'var(--text-color-pending)'
    } else {
        return 'var(--text-color-success)'
    }
}

const responseData = {
    data: {
        outOfStock: 3,
        lowStock: 7
    }
}

const data: IProduct[] = [
    {
        id: 1,
        serialNumber: 'SN-001',
        images: ['https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-1.webp'],
        discountRate: 10,
        discountPrice: 900000,
        price: 1000000,
        description: 'Máy đo nhiệt độ công nghiệp chính xác cao',
        productName: 'Cảm biến nhiệt độ PT100',
        categoryName: 'Cảm biến',
        supplierName: 'SensorTech VN',
        unit: 'cái',
        warrantyPeriod: 12,
        stockQuantity: 50,
        soldCount: 120,
        rating: 4.5,
        createdAt: '2024-09-01T10:00:00Z',
        createdBy: 'admin',
        minStockThreshold: 10
    },
    {
        id: 2,
        serialNumber: 'SN-002',
        images: ['https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-2.webp'],
        discountRate: 5,
        discountPrice: 1900000,
        price: 2000000,
        description: 'Bộ điều khiển lập trình PLC Siemens S7-1200',
        productName: 'PLC Siemens S7-1200',
        categoryName: 'PLC',
        supplierName: 'Siemens Vietnam',
        unit: 'bộ',
        warrantyPeriod: 24,
        stockQuantity: 20,
        soldCount: 75,
        rating: 4.7,
        createdAt: '2024-09-05T09:00:00Z',
        createdBy: 'admin',
        minStockThreshold: 10
    },
    {
        id: 3,
        serialNumber: 'SN-003',
        images: ['https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-3.webp'],
        discountRate: 15,
        discountPrice: 850000,
        price: 1000000,
        description: 'Cảm biến tiệm cận loại NPN 12V',
        productName: 'Cảm biến tiệm cận Omron',
        categoryName: 'Cảm biến',
        supplierName: 'Omron',
        unit: 'cái',
        warrantyPeriod: 18,
        stockQuantity: 100,
        soldCount: 230,
        rating: 4.2,
        createdAt: '2024-08-21T14:30:00Z',
        createdBy: 'admin',
        minStockThreshold: 10
    },
    {
        id: 4,
        serialNumber: 'SN-004',
        images: ['https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-4.webp'],
        discountRate: 20,
        discountPrice: 400000,
        price: 500000,
        description: 'Relay trung gian 8 chân',
        productName: 'Relay trung gian IDEC',
        categoryName: 'Relay',
        supplierName: 'IDEC Japan',
        unit: 'cái',
        warrantyPeriod: 6,
        stockQuantity: 200,
        soldCount: 310,
        rating: 4.1,
        createdAt: '2024-08-11T08:00:00Z',
        createdBy: 'admin',
        minStockThreshold: 10
    },
    {
        id: 5,
        serialNumber: 'SN-005',
        images: ['https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-5.webp'],
        discountRate: 0,
        discountPrice: 1500000,
        price: 1500000,
        description: 'Biến tần 1 pha vào 3 pha ra',
        productName: 'Biến tần Delta VFD007EL21A',
        categoryName: 'Biến tần',
        supplierName: 'Delta Electronics',
        unit: 'cái',
        warrantyPeriod: 24,
        stockQuantity: 30,
        soldCount: 60,
        rating: 4.6,
        createdAt: '2024-07-30T16:00:00Z',
        createdBy: 'admin',
        minStockThreshold: 10
    },
    {
        id: 6,
        serialNumber: 'SN-006',
        images: ['https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-6.webp'],
        discountRate: 25,
        discountPrice: 2300000,
        price: 2500000,
        description: 'Màn hình HMI 7 inch cảm ứng',
        productName: 'HMI Weintek MT8071iE',
        categoryName: 'HMI',
        supplierName: 'Weintek',
        unit: 'cái',
        warrantyPeriod: 12,
        stockQuantity: 40,
        soldCount: 90,
        rating: 4.3,
        createdAt: '2024-08-15T10:15:00Z',
        createdBy: 'admin',
        minStockThreshold: 10
    },
    {
        id: 7,
        serialNumber: 'SN-007',
        images: ['https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-7.webp'],
        discountRate: 12,
        discountPrice: 1320000,
        price: 1500000,
        description: 'Module mở rộng I/O cho PLC',
        productName: 'I/O Module Siemens SM1223',
        categoryName: 'PLC',
        supplierName: 'Siemens Vietnam',
        unit: 'cái',
        warrantyPeriod: 12,
        stockQuantity: 25,
        soldCount: 50,
        rating: 4.4,
        createdAt: '2024-09-08T11:00:00Z',
        createdBy: 'admin',
        minStockThreshold: 10
    },
    {
        id: 8,
        serialNumber: 'SN-008',
        images: ['https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-8.webp'],
        discountRate: 18,
        discountPrice: 820000,
        price: 1000000,
        description: 'Cảm biến áp suất 4-20mA',
        productName: 'Cảm biến áp suất WIKA',
        categoryName: 'Cảm biến',
        supplierName: 'WIKA Germany',
        unit: 'cái',
        warrantyPeriod: 24,
        stockQuantity: 60,
        soldCount: 110,
        rating: 4.6,
        createdAt: '2024-08-18T13:20:00Z',
        createdBy: 'admin',
        minStockThreshold: 10
    },
    {
        id: 9,
        serialNumber: 'SN-009',
        images: ['https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-9.webp'],
        discountRate: 25,
        discountPrice: 750000,
        price: 1000000,
        description: 'Timer đa năng đa chế độ',
        productName: 'Timer Omron H3CR-A8',
        categoryName: 'Timer',
        supplierName: 'Omron',
        unit: 'cái',
        warrantyPeriod: 12,
        stockQuantity: 80,
        soldCount: 200,
        rating: 4.5,
        createdAt: '2024-08-12T15:00:00Z',
        createdBy: 'admin',
        minStockThreshold: 10
    },
    {
        id: 10,
        serialNumber: 'SN-010',
        images: ['https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-10.webp'],
        discountRate: 10,
        discountPrice: 1800000,
        price: 2000000,
        description: 'Cảm biến khoảng cách siêu âm',
        productName: 'Cảm biến siêu âm Pepperl+Fuchs',
        categoryName: 'Cảm biến',
        supplierName: 'Pepperl+Fuchs',
        unit: 'cái',
        warrantyPeriod: 18,
        stockQuantity: 45,
        soldCount: 95,
        rating: 4.3,
        createdAt: '2024-09-10T09:00:00Z',
        createdBy: 'admin',
        minStockThreshold: 10
    }
]

function DataTable() {
    const { t } = useTranslation('common')
    const [order, setOrder] = useState<'asc' | 'desc'>('asc')
    const [orderBy, setOrderBy] = useState<string>('')
    const [currentTab, setCurrentTab] = useState(0)
    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState('10')
    const [from, setFrom] = useState(1)
    const [to, setTo] = useState(10)
    const [filter, setFilter] = useState<IProductFilter>({
        pageSize: 10,
        pageNumber: 1
    })

    const lowStock = responseData?.data.lowStock
    const outOfStock = responseData?.data.outOfStock
    const totalRecords = data.length

    const handleChangeTabs = (newValue: number) => {
        setCurrentTab(newValue)
        if (newValue !== undefined) {
            setFilter(prev => ({
                ...prev,
                status: newValue === 0 ? undefined : newValue === 1 ? 'low_stock' : 'out_of_stock'
            }))
        } else {
            setFilter(prev => ({
                ...prev,
                status: undefined
            }))
        }
    }

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
                {t('COMMON.PURCHASE_ORDER.PURCHASE_ORDER_LIST')}
            </Typography>

            <Divider
                sx={{
                    borderColor: 'var(--border-color)',
                    borderStyle: 'dashed'
                }}
            />

            <Box>
                <Tabs
                    value={currentTab}
                    onChange={(e, newValue) => handleChangeTabs(newValue)}
                    variant='scrollable'
                    scrollButtons={false}
                    sx={{
                        overflowX: 'auto',
                        '& .MuiTabs-flexContainer': {
                            flexWrap: 'nowrap'
                        },
                        '&::-webkit-scrollbar': {
                            height: '6px'
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: '#ccc',
                            borderRadius: '4px'
                        },
                        position: 'relative',
                        '::after': {
                            content: '""',
                            display: 'block',
                            width: '100%',
                            bottom: '0',
                            zIndex: 0,
                            borderRadius: '1px',
                            left: '0',
                            position: 'absolute',
                            height: '2px',
                            backgroundColor: 'var(--border-tab)'
                        }
                    }}
                    slotProps={{
                        indicator: {
                            sx: {
                                zIndex: 1,
                                background: 'linear-gradient(to right,rgb(103, 255, 164),rgb(255, 182, 127))',
                                height: '2px',
                                borderRadius: '1px'
                            }
                        }
                    }}
                >
                    <Tab
                        sx={{
                            textTransform: 'none',
                            color: 'var(--label-title-color)',
                            fontWeight: '600',
                            paddingLeft: '25px',
                            paddingRight: '20px',
                            paddingBottom: '14px',
                            '&.Mui-selected': {
                                color: 'var(--text-color)'
                            }
                        }}
                        label={
                            <Box style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {t('COMMON.ORDER.ALL')}
                                <Box
                                    style={{
                                        ...badgeStyle,
                                        backgroundColor: 'var(--background-color-all-selected)',
                                        color: 'var(--text-color-all-selected)'
                                    }}
                                >
                                    {lowStock + outOfStock}
                                </Box>
                            </Box>
                        }
                        value={0}
                    />

                    <Tab
                        sx={{
                            textTransform: 'none',
                            color: 'var(--label-title-color)',
                            fontWeight: '600',
                            paddingBottom: '14px',
                            '&.Mui-selected': {
                                color: 'var(--text-color)',
                                fontWeight: '600'
                            }
                        }}
                        label={
                            <Box style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {t('COMMON.PRODUCT.LOW_STOCK')}
                                <Box
                                    style={{
                                        ...badgeStyle,
                                        backgroundColor:
                                            currentTab === 1
                                                ? 'var(--background-color-pending-selected)'
                                                : 'var(--background-color-pending)',
                                        color:
                                            currentTab === 1
                                                ? 'var(--text-color-pending-selected)'
                                                : 'var(--text-color-pending)'
                                    }}
                                >
                                    {lowStock}
                                </Box>
                            </Box>
                        }
                        value={1}
                    />

                    <Tab
                        sx={{
                            textTransform: 'none',
                            color: 'var(--label-title-color)',
                            paddingBottom: '14px',
                            fontWeight: '600',
                            '&.Mui-selected': {
                                color: 'var(--text-color)',
                                fontWeight: '600'
                            }
                        }}
                        label={
                            <Box style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {t('COMMON.PRODUCT.OUT_OF_STOCK')}
                                <Box
                                    style={{
                                        ...badgeStyle,
                                        backgroundColor:
                                            currentTab === 2
                                                ? 'var(--background-color-cancel-selected)'
                                                : 'var(--background-color-cancel)',
                                        color:
                                            currentTab === 2
                                                ? 'var(--text-color-cancel-selected)'
                                                : 'var(--text-color-cancel)'
                                    }}
                                >
                                    {outOfStock}
                                </Box>
                            </Box>
                        }
                        value={2}
                    />
                </Tabs>
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
                                backgroundColor: 'var(--background-color-table-header)',
                                '&:last-child td, &:last-child th': {
                                    border: 'none'
                                },
                                width: '100%'
                            }}
                        >
                            <TableCell
                                sx={{
                                    backgroundColor: 'var(--header-table)',
                                    borderColor: 'var(--border-color)',
                                    padding: '16px 30px 16px 24px'
                                }}
                            >
                                <TableSortLabel
                                    active={'ProductName' === orderBy}
                                    direction={orderBy === 'ProductName' ? order : 'asc'}
                                    onClick={() => handleSort('ProductName')}
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
                                            maxWidth: '300px',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {t('COMMON.PRODUCT.PRODUCT_NAME')}
                                    </Typography>
                                </TableSortLabel>
                            </TableCell>

                            <TableCell
                                sx={{
                                    backgroundColor: 'var(--header-table)',
                                    borderColor: 'var(--border-color)'
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontWeight: 'bold',
                                        color: 'var(--text-color)',
                                        fontSize: '15px',
                                        maxWidth: '280px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {t('COMMON.PRODUCT.UNIT')}
                                </Typography>
                            </TableCell>

                            <TableCell
                                sx={{
                                    backgroundColor: 'var(--header-table)',
                                    borderColor: 'var(--border-color)'
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontWeight: 'bold',
                                        color: 'var(--text-color)',
                                        fontSize: '15px',
                                        textAlign: 'center',
                                        maxWidth: '280px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {t('COMMON.PRODUCT.COUNT')}
                                </Typography>
                            </TableCell>

                            <TableCell
                                sx={{
                                    backgroundColor: 'var(--header-table)',
                                    borderColor: 'var(--border-color)',
                                    padding: '16px 50px'
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontWeight: 'bold',
                                        color: 'var(--text-color)',
                                        fontSize: '15px',
                                        textAlign: 'center',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {t('COMMON.PRODUCT.STATUS')}
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {data &&
                            data.map((row: IProduct, index: number) => (
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
                                            padding: '14px 24px'
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '16px'
                                            }}
                                        >
                                            <Avatar
                                                src={row.images[0]}
                                                sx={{
                                                    width: '60px',
                                                    height: '60px',
                                                    borderRadius: '8px'
                                                }}
                                            />
                                            <Box
                                                display='flex'
                                                alignItems='left'
                                                sx={{
                                                    gap: '2px',
                                                    flexDirection: 'column'
                                                }}
                                            >
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
                                                    {row.productName}
                                                </Typography>

                                                <Typography
                                                    sx={{
                                                        color: 'var(--label-title-color)',
                                                        fontSize: '13px',
                                                        maxWidth: '280px',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    }}
                                                >
                                                    {t('COMMON.PRODUCT.SERIAL_NUMBER')}
                                                    {': '}
                                                    {row.serialNumber}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>

                                    <TableCell sx={{ borderColor: 'var(--border-color)', borderStyle: 'dashed' }}>
                                        <Typography
                                            sx={{
                                                color: 'var(--text-color)',
                                                fontSize: '15px',
                                                maxWidth: '200px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {row.unit}
                                        </Typography>
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            borderColor: 'var(--border-color)',
                                            borderStyle: 'dashed',
                                            padding: '16px 30px'
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                color: 'var(--label-title-color)',
                                                fontSize: '13px',
                                                maxWidth: '200px',
                                                overflow: 'hidden',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '10px',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {t('COMMON.PRODUCT.STOCK') + ': '}
                                            <Typography
                                                sx={{
                                                    fontWeight: 'bold',
                                                    color: 'var(--text-color)',
                                                    fontSize: '15px'
                                                }}
                                            >
                                                {row.stockQuantity}
                                            </Typography>
                                        </Box>

                                        <Box
                                            sx={{
                                                mt: '3px',
                                                color: 'var(--label-title-color)',
                                                fontSize: '13px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                maxWidth: '200px',
                                                gap: '10px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {t('COMMON.PRODUCT.SOLD') + ': '}
                                            <Typography
                                                sx={{
                                                    fontWeight: 'bold',
                                                    color: 'var(--text-color)',
                                                    fontSize: '15px'
                                                }}
                                            >
                                                {row.soldCount}
                                            </Typography>
                                        </Box>
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            borderStyle: 'dashed',
                                            borderColor: 'var(--border-color)'
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                borderRadius: '9999px',
                                                padding: '7px 15px',
                                                border: getBorderColor(row),
                                                display: 'flex',
                                                maxWidth: '130px',
                                                minWidth: '120px',
                                                justifyContent: 'center',
                                                backgroundColor: getStatusBgColor(row)
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    fontSize: '13px',
                                                    overflow: 'hidden',
                                                    color: getStatusTextColor(row),
                                                    width: 'auto',
                                                    fontWeight: 'bold',
                                                    display: 'inline-block',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {row.minStockThreshold < row.stockQuantity
                                                    ? t('COMMON.PRODUCT.IN_STOCK')
                                                    : row.stockQuantity === 0
                                                    ? t('COMMON.PRODUCT.OUT_OF_STOCK')
                                                    : t('COMMON.PRODUCT.LOW_STOCK')}
                                            </Typography>
                                        </Box>
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

export default DataTable
