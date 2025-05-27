'use client'
import {
    Box,
    Select,
    Pagination,
    Typography,
    MenuItem,
    SelectChangeEvent,
    Paper,
    TextField,
    InputAdornment,
    Divider,
    FormControl,
    InputLabel,
    Button
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import SearchIcon from '@mui/icons-material/Search'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { debounce } from 'lodash'
import { useCallback } from 'react'
import Loading from '@/components/Loading'
import { CirclePlus } from 'lucide-react'
import { useSearchProductQuery } from '@/services/ProductService'
import { IProduct, IProductFilter } from '@/models/Product'
import ProductTable from './ProductTable'

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    }
}

const products: IProduct[] = [
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

function Page() {
    const { t } = useTranslation('common')
    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState('10')
    const [from, setFrom] = useState(1)
    const [to, setTo] = useState(10)
    const [filter, setFilter] = useState<IProductFilter>({
        pageSize: 10,
        pageNumber: 1
    })
    const [keyword, setKeyword] = useState('')
    const [open, setOpen] = useState(false)
    useEffect(() => {}, [open])

    const { data: dataResponse, isLoading, isFetching, refetch } = useSearchProductQuery(filter)

    // const { data: countResponse, isLoading: countLoading, refetch: countRefetch } = useGetCountTypeQuery()

    const productData = dataResponse?.data?.records || (products as IProduct[])

    const totalRecords = (dataResponse?.data?.totalRecords as number) || 0

    const countOK = productData?.data?.countOK || 0
    const countExpired = productData?.data?.countExpired || 0
    const countLimit = productData?.data?.countLimit || 0

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

    const refetchPage = () => {
        refetch()
        // countRefetch()
    }

    const debouncedSetFilter = useCallback(
        debounce(value => {
            setFilter(prev => ({
                ...prev,
                keyword: value,
                pageNumber: 1
            }))
        }, 100),
        []
    )

    const handleSearchKeyword = (value: string) => {
        setPage(1)
        setKeyword(value)
        debouncedSetFilter(value)
    }

    useEffect(() => {
        if (!isFetching && productData) {
            const from = (page - 1) * Number(rowsPerPage) + Math.min(1, productData?.length)
            setFrom(from)

            const to = Math.min(productData?.length + (page - 1) * Number(rowsPerPage), totalRecords)
            setTo(to)
        }
    }, [isFetching, productData, page, rowsPerPage])

    useEffect(() => {
        refetch()
    }, [filter])

    const [currentTab, setCurrentTab] = useState(0)

    const handleChangeTabs = (newValue: number) => {
        setCurrentTab(newValue)
        if (newValue !== undefined) {
            setFilter(prev => ({
                ...prev,
                isType: newValue
            }))
        } else {
            setFilter(prev => ({
                ...prev,
                isType: undefined
            }))
        }
    }

    if (isLoading /*|| countLoading*/) {
        return <Loading />
    }

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

    const categories = [
        { name: 'Điện thoại', id: 1 },
        { name: 'Máy tính', id: 2 },
        { name: 'Tivi', id: 3 },
        { name: 'Tai nghe', id: 4 },
        { name: 'Máy nghe nhạc', id: 5 }
    ]

    return (
        <>
            <Box
                sx={{
                    mt: '24px'
                }}
            >
                <Paper
                    sx={{
                        width: '100%',
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
                        {t('COMMON.PRODUCT.PRODUCT')}
                    </Typography>

                    <Divider
                        sx={{
                            borderColor: 'var(--border-color)'
                        }}
                    />

                    <Box>
                        <Tabs
                            value={currentTab}
                            onChange={(event, newValue) => handleChangeTabs(newValue)}
                            aria-label='basic tabs example'
                            slotProps={{
                                indicator: {
                                    sx: {
                                        background: 'linear-gradient(to right,rgb(103, 255, 164),rgb(255, 182, 127))', // Màu của thanh indicator
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
                                    paddingRight: '25px',
                                    '&.Mui-selected': {
                                        color: 'var(--text-color)',
                                        fontWeight: '600'
                                    }
                                }}
                                label={
                                    <Box style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {t('COMMON.PRODUCT.ALL')}
                                        <Box
                                            style={{
                                                ...badgeStyle,
                                                backgroundColor:
                                                    currentTab === 0
                                                        ? 'var(--background-color-all-selected)'
                                                        : 'var(--background-color-all)',
                                                color:
                                                    currentTab === 0
                                                        ? 'var(--text-color-all-selected)'
                                                        : 'var(--text-color-all)'
                                            }}
                                        >
                                            {countExpired + countOK + countLimit}
                                        </Box>
                                    </Box>
                                }
                                {...a11yProps(0)}
                            />
                            <Tab
                                sx={{
                                    textTransform: 'none',
                                    color: 'var(--label-title-color)',
                                    fontWeight: '600',
                                    '&.Mui-selected': {
                                        color: 'var(--text-color)',
                                        fontWeight: '600'
                                    }
                                }}
                                label={
                                    <Box style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {t('COMMON.PRODUCT.IN_STOCK')}
                                        <Box
                                            style={{
                                                ...badgeStyle,
                                                backgroundColor:
                                                    currentTab === 1
                                                        ? 'var(--background-color-success-selected)'
                                                        : 'var(--background-color-success)',
                                                color:
                                                    currentTab === 1
                                                        ? 'var(--text-color-success-selected)'
                                                        : 'var(--text-color-success)'
                                            }}
                                        >
                                            {countOK}
                                        </Box>
                                    </Box>
                                }
                                {...a11yProps(1)}
                            />
                            <Tab
                                sx={{
                                    textTransform: 'none',
                                    color: 'var(--label-title-color)',
                                    fontWeight: '600',
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
                                                    currentTab === 2
                                                        ? 'var(--background-color-pending-selected)'
                                                        : 'var(--background-color-pending)',
                                                color:
                                                    currentTab === 2
                                                        ? 'var(--text-color-pending-selected)'
                                                        : 'var(--text-color-pending)'
                                            }}
                                        >
                                            {countLimit}
                                        </Box>
                                    </Box>
                                }
                                {...a11yProps(2)}
                            />
                            <Tab
                                sx={{
                                    textTransform: 'none',
                                    color: 'var(--label-title-color)',
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
                                                    currentTab === 3
                                                        ? 'var(--background-color-cancel-selected)'
                                                        : 'var(--background-color-cancel)',
                                                color:
                                                    currentTab === 3
                                                        ? 'var(--text-color-cancel-selected)'
                                                        : 'var(--text-color-cancel)'
                                            }}
                                        >
                                            {countExpired}
                                        </Box>
                                    </Box>
                                }
                                {...a11yProps(3)}
                            />
                        </Tabs>
                    </Box>

                    <Box display='flex' alignItems='center' gap='24px' margin='24px'>
                        <Box sx={{ position: 'relative', width: '70%', height: '51px', display: 'flex', gap: '20px' }}>
                            <TextField
                                id='location-search'
                                type='search'
                                placeholder={t('COMMON.PRODUCT.SEARCH')}
                                variant='outlined'
                                required
                                value={keyword}
                                onChange={e => handleSearchKeyword(e.target.value)}
                                sx={{
                                    color: 'var(--text-color)',
                                    padding: '0px',
                                    width: '100%',
                                    '& fieldset': {
                                        borderRadius: '10px',
                                        borderColor: 'var(--border-color)'
                                    },
                                    '& .MuiInputBase-root': { paddingLeft: '0px', paddingRight: '12px' },
                                    '& .MuiInputBase-input': {
                                        padding: '14.7px 0px',
                                        color: 'var(--text-color)',
                                        fontSize: '15px',
                                        '&::placeholder': {
                                            color: 'var(--placeholder-color)',
                                            opacity: 1
                                        }
                                    },
                                    '& .MuiOutlinedInput-root:hover fieldset': {
                                        borderColor: 'var(--field-color-hover)'
                                    },
                                    '& .MuiOutlinedInput-root.Mui-focused fieldset': {
                                        borderColor: 'var(--field-color-selected)',
                                        borderWidth: '2px'
                                    }
                                }}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment
                                                position='start'
                                                sx={{
                                                    mr: 0
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        height: '100%',
                                                        color: '#a5bed4',
                                                        padding: '10.5px',
                                                        zIndex: 1
                                                    }}
                                                >
                                                    <SearchIcon />
                                                </Box>
                                            </InputAdornment>
                                        )
                                    }
                                }}
                            />

                            <FormControl
                                sx={{
                                    width: '45%',
                                    '& .MuiOutlinedInput-root:hover fieldset': {
                                        borderColor: 'var(--field-color-hover)' // Màu hover khi không lỗi
                                    },
                                    '& .MuiOutlinedInput-root.Mui-error:hover fieldset': {
                                        borderColor: 'var(--error-color)' // Màu hover khi lỗi
                                    },
                                    '& .MuiOutlinedInput-root.Mui-error fieldset': {
                                        borderColor: 'var(--error-color)' // Màu viền khi lỗi
                                    },
                                    '& .MuiOutlinedInput-root.Mui-focused fieldset': {
                                        border: '2px solid var(--field-color-selected)' // Màu viền khi focus
                                    },
                                    '& .MuiOutlinedInput-root.Mui-error.Mui-focused fieldset': {
                                        borderColor: 'var(--error-color)' // Màu viền khi lỗi và focus
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: 'var(--label-title-color)' // Label mặc định
                                    },
                                    '&:hover .MuiInputLabel-root': {
                                        color: 'var(--field-color-selected)' // Thay đổi màu label khi hover vào input
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        fontWeight: 'bold',
                                        color: 'var(--field-color-selected)' // Label khi focus
                                    }
                                }}
                            >
                                <InputLabel id='select-label'>{t('COMMON.PRODUCT.CATEGORY')}</InputLabel>
                                <Select
                                    defaultValue='0'
                                    label={t('COMMON.PRODUCT.CATEGORY')}
                                    value={filter.categoryId !== undefined ? String(filter.categoryId) : '0'}
                                    onChange={e =>
                                        setFilter({
                                            ...filter,
                                            categoryId: Number(e.target.value)
                                        })
                                    }
                                    sx={{
                                        width: '100%',
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
                                            padding: '14px 14px'
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
                                                    '&:hover': {
                                                        backgroundColor: 'var(--background-color-item-hover)'
                                                    },
                                                    '&.Mui-selected': {
                                                        backgroundColor: 'var(--background-color-item-selected)',
                                                        '&:hover': {
                                                            backgroundColor: 'var(--background-color-item-hover)'
                                                        }
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
                                        value={'0'}
                                        sx={{
                                            borderRadius: '6px'
                                        }}
                                    >
                                        {t('COMMON.PRODUCT.ALL')}
                                    </MenuItem>
                                    {categories.map((item, index) => (
                                        <MenuItem
                                            key={index}
                                            value={String(item.id)}
                                            sx={{
                                                mt: '4px',
                                                borderRadius: '6px'
                                            }}
                                        >
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>

                        {/* {menuLeft['Discipline'].IsAllowCreate && ( */}
                        <Button
                            variant='contained'
                            startIcon={<CirclePlus />}
                            sx={{
                                ml: 'auto',
                                height: '51px',
                                backgroundColor: 'var(--background-color-button-save)',
                                width: 'auto',
                                padding: '0px 30px',
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
                            onClick={() => setOpen(true)}
                        >
                            {t('COMMON.BUTTON.CREATE')}
                        </Button>
                        {/* )} */}
                    </Box>

                    <ProductTable data={productData} refetch={refetchPage} setFilter={setFilter} />

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
            </Box>

            {/* <Dialog open={open} onOpenChange={() => setOpen(!open)}>
                <DialogContent className='max-w-4xl p-0 bg-white dark:bg-gray-900 shadow-2xl border-0'>
                    <DialogHeader className='py-5 px-6 bg-gray-100 rounded-t-lg'>
                        <DialogTitle className='text-xl font-bold text-gray-900 dark:text-gray-100'>
                            Thêm mã giảm giá mới
                        </DialogTitle>
                        <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                            Điền thông tin chi tiết cho mã giảm giá của bạn
                        </p>
                    </DialogHeader>

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                            maxHeight: '70vh',
                            padding: '2px 17px 5px 24px',
                            scrollbarGutter: 'stable',
                            '&::-webkit-scrollbar': {
                                width: '7px',
                                height: '7px',
                                backgroundColor: 'var(--background-color)'
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: 'var(--scrollbar-color)',
                                borderRadius: '10px'
                            },
                            overflowY: 'auto'
                        }}
                    >
                        <div className='grid grid-cols-2 gap-x-6 gap-y-4'>
                            <div className='flex flex-col space-y-2'>
                                <Label
                                    htmlFor='couponCode'
                                    className='font-medium text-gray-900 dark:text-gray-200 text-[15px]'
                                >
                                    Mã giảm giá
                                </Label>
                                <Input
                                    id='couponCode'
                                    className='rounded-md border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 text-[15px] h-11'
                                    placeholder='Nhập mã giảm giá'
                                    value={newCoupon.couponCode}
                                    onChange={e => setNewCoupon({ ...newCoupon, couponCode: e.target.value })}
                                />
                            </div>

                            <div className='flex flex-col space-y-2'>
                                <Label
                                    htmlFor='discountType'
                                    className='font-medium text-gray-900 dark:text-gray-200 text-[15px]'
                                >
                                    Loại giảm giá
                                </Label>
                                <SelectX
                                    value={newCoupon.discountType}
                                    onValueChange={value =>
                                        setNewCoupon({ ...newCoupon, discountType: (value as 'percentage') || 'fixed' })
                                    }
                                >
                                    <SelectTrigger className='w-full rounded-md border-gray-300 dark:border-gray-700 text-[15px] h-11'>
                                        <SelectValue placeholder='Chọn loại giảm giá' />
                                    </SelectTrigger>
                                    <SelectContent className='bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md'>
                                        <SelectItem value='percentage'>Phần trăm</SelectItem>
                                        <SelectItem value='fixed'>Số tiền cố định</SelectItem>
                                    </SelectContent>
                                </SelectX>
                            </div>

                            <div className='flex flex-col space-y-2'>
                                <Label
                                    htmlFor='discountValue'
                                    className='font-medium text-gray-900 dark:text-gray-200 text-[15px]'
                                >
                                    Giá trị giảm giá
                                </Label>
                                <Input
                                    id='discountValue'
                                    type='number'
                                    className='rounded-md border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 text-[15px] h-11'
                                    placeholder={
                                        newCoupon.discountType === 'percentage'
                                            ? 'Nhập % giảm giá'
                                            : 'Nhập số tiền giảm'
                                    }
                                    value={newCoupon.discountValue}
                                    onChange={e =>
                                        setNewCoupon({ ...newCoupon, discountValue: parseFloat(e.target.value) })
                                    }
                                />
                            </div>

                            <div className='flex flex-col space-y-2'>
                                <Label
                                    htmlFor='maximumDiscount'
                                    className='font-medium text-gray-900 dark:text-gray-200 text-[15px]'
                                >
                                    Giảm giá tối đa
                                </Label>
                                <Input
                                    id='maximumDiscount'
                                    type='number'
                                    className='rounded-md border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 text-[15px] h-11'
                                    placeholder='Nhập số tiền giảm tối đa'
                                    value={newCoupon.maximumDiscount}
                                    onChange={e =>
                                        setNewCoupon({ ...newCoupon, maximumDiscount: parseFloat(e.target.value) })
                                    }
                                />
                            </div>

                            <div className='flex flex-col space-y-2'>
                                <Label
                                    htmlFor='minimumOrderValue'
                                    className='font-medium text-gray-900 dark:text-gray-200 text-[15px]'
                                >
                                    Giá trị đơn hàng tối thiểu
                                </Label>
                                <Input
                                    id='minimumOrderValue'
                                    type='number'
                                    className='rounded-md border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 !text-[15px] h-11'
                                    placeholder='Nhập giá trị tối thiểu'
                                    value={newCoupon.minimumOrderValue}
                                    onChange={e =>
                                        setNewCoupon({ ...newCoupon, minimumOrderValue: parseFloat(e.target.value) })
                                    }
                                />
                            </div>

                            <div className='flex flex-col space-y-2'>
                                <Label
                                    htmlFor='usageLimit'
                                    className='font-medium text-gray-900 dark:text-gray-200 text-[15px]'
                                >
                                    Giới hạn sử dụng
                                </Label>
                                <Input
                                    id='usageLimit'
                                    type='number'
                                    className='rounded-md border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 !text-[15px] h-11'
                                    placeholder='Nhập số lần sử dụng tối đa'
                                    value={newCoupon.usageLimit}
                                    onChange={e => setNewCoupon({ ...newCoupon, usageLimit: parseInt(e.target.value) })}
                                />
                            </div>

                            <div className='flex flex-col space-y-2'>
                                <Label
                                    htmlFor='activationDate'
                                    className='font-medium text-gray-900 dark:text-gray-200 text-[15px]'
                                >
                                    Ngày kích hoạt
                                </Label>
                                <Input
                                    id='activationDate'
                                    type='date'
                                    className='rounded-md border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 text-[15px] h-11'
                                    value={
                                        newCoupon.activationDate
                                            ? new Date(newCoupon.activationDate).toISOString().split('T')[0]
                                            : ''
                                    }
                                    onChange={e =>
                                        setNewCoupon({ ...newCoupon, activationDate: new Date(e.target.value) })
                                    }
                                />
                            </div>

                            <div className='flex flex-col space-y-2'>
                                <Label
                                    htmlFor='expiryDate'
                                    className='font-medium text-gray-900 dark:text-gray-200 text-[15px]'
                                >
                                    Ngày hết hạn
                                </Label>
                                <Input
                                    id='expiryDate'
                                    type='date'
                                    className='rounded-md border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 text-[15px] h-11'
                                    value={
                                        newCoupon.expiryDate
                                            ? new Date(newCoupon.expiryDate).toISOString().split('T')[0]
                                            : ''
                                    }
                                    onChange={e => setNewCoupon({ ...newCoupon, expiryDate: new Date(e.target.value) })}
                                />
                            </div>
                        </div>
                    </Box>

                    <DialogFooter className='p-6 flex gap-4 bg-gray-100 rounded-b-lg'>
                        <ButtonX
                            variant='outline'
                            onClick={() => setOpen(false)}
                            className='flex-1 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 
                       hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-[15px] h-11'
                        >
                            Hủy
                        </ButtonX>
                        <ButtonX
                            onClick={handleAddCoupon}
                            className='flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors text-[15px] h-11'
                        >
                            Thêm mã giảm giá
                        </ButtonX>
                    </DialogFooter>
                </DialogContent>
            </Dialog> */}

            {/* <DialogCreate open={open} handleClose={() => setOpen(!open)} /> */}
        </>
    )
}

export default Page
