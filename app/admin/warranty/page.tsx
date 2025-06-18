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
    Button
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import SearchIcon from '@mui/icons-material/Search'
import { useRouter } from 'next/navigation'
import WarrantyTable from './WarrantyTable'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { debounce } from 'lodash'
import { useCallback } from 'react'
import Loading from '@/components/Loading'
import { CirclePlus } from 'lucide-react'
import { useSearchCouponQuery, useGetCountTypeQuery } from '@/services/CouponService'
import { IWarranty, IWarrantyFilter } from '@/models/Warranty'
import dayjs from 'dayjs'
import { DatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { convertToVietnamTime } from '@/common/format'

const warranties: IWarranty[] = [
    {
        id: '1',
        orderId: '101',
        productId: '1001',
        warrantyStart: '2024-01-01',
        warrantyEnd: '2026-01-01',
        description: 'Bảo hành sản phẩm A',
        serialNumber: 'SN1001',
        avatarPath: null,
        fullName: 'Nguyễn Văn A',
        phoneNumber: '0901234567',
        createdBy: '2024-01-01',
        productName: 'Sản phẩm A'
    },
    {
        id: '2',
        orderId: '102',
        productId: '1002',
        warrantyStart: '2023-06-15',
        warrantyEnd: '2025-06-15',
        description: 'Bảo hành sản phẩm B',
        serialNumber: 'SN1002',
        avatarPath: null,
        fullName: 'Trần Thị B',
        phoneNumber: '0912345678',
        createdBy: '2023-06-15',
        productName: 'Sản phẩm B'
    },
    {
        id: '3',
        orderId: '103',
        productId: '1003',
        warrantyStart: '2022-12-10',
        warrantyEnd: '2024-12-10',
        description: 'Bảo hành sản phẩm C',
        serialNumber: 'SN1003',
        avatarPath: null,
        fullName: 'Lê Văn C',
        phoneNumber: '0923456789',
        createdBy: '2022-12-10',
        productName: 'Sản phẩm C'
    },
    {
        id: '4',
        orderId: '104',
        productId: '1004',
        warrantyStart: '2023-03-05',
        warrantyEnd: '2025-03-05',
        description: 'Bảo hành sản phẩm D',
        serialNumber: 'SN1004',
        avatarPath: null,
        fullName: 'Phạm Thị D',
        phoneNumber: '0934567890',
        createdBy: '2023-03-05',
        productName: 'Sản phẩm D'
    },
    {
        id: '5',
        orderId: '105',
        productId: '1005',
        warrantyStart: '2021-09-20',
        warrantyEnd: '2023-09-20',
        description: 'Bảo hành sản phẩm E',
        serialNumber: 'SN1005',
        avatarPath: null,
        fullName: 'Đỗ Văn E',
        phoneNumber: '0945678901',
        createdBy: '2021-09-20',
        productName: 'Sản phẩm E'
    },
    {
        id: '6',
        orderId: '106',
        productId: '1006',
        warrantyStart: '2024-02-01',
        warrantyEnd: '2026-02-01',
        description: 'Bảo hành sản phẩm F',
        serialNumber: 'SN1006',
        avatarPath: null,
        fullName: 'Ngô Thị F',
        phoneNumber: '0956789012',
        createdBy: '2024-02-01',
        productName: 'Sản phẩm F'
    },
    {
        id: '7',
        orderId: '107',
        productId: '1007',
        warrantyStart: '2022-11-11',
        warrantyEnd: '2024-11-11',
        description: 'Bảo hành sản phẩm G',
        serialNumber: 'SN1007',
        avatarPath: null,
        fullName: 'Bùi Văn G',
        phoneNumber: '0967890123',
        createdBy: '2022-11-11',
        productName: 'Sản phẩm G'
    },
    {
        id: '8',
        orderId: '108',
        productId: '1008',
        warrantyStart: '2023-07-07',
        warrantyEnd: '2025-07-07',
        description: 'Bảo hành sản phẩm H',
        serialNumber: 'SN1008',
        avatarPath: null,
        fullName: 'Hoàng Thị H',
        phoneNumber: '0978901234',
        createdBy: '2023-07-07',
        productName: 'Sản phẩm H'
    },
    {
        id: '9',
        orderId: '109',
        productId: '1009',
        warrantyStart: '2021-12-01',
        warrantyEnd: '2023-12-01',
        description: 'Bảo hành sản phẩm I',
        serialNumber: 'SN1009',
        avatarPath: null,
        fullName: 'Vũ Văn I',
        phoneNumber: '0989012345',
        createdBy: '2021-12-01',
        productName: 'Sản phẩm I'
    },
    {
        id: '10',
        orderId: '110',
        productId: '1010',
        warrantyStart: '2023-04-25',
        warrantyEnd: '2025-04-25',
        description: 'Bảo hành sản phẩm J',
        serialNumber: 'SN1010',
        avatarPath: null,
        fullName: 'Lý Thị J',
        phoneNumber: '0990123456',
        createdBy: '2023-04-25',
        productName: 'Sản phẩm J'
    }
]

function Page() {
    const router = useRouter()
    const { t } = useTranslation('common')
    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState('10')
    const [from, setFrom] = useState(1)
    const [to, setTo] = useState(10)
    const [filter, setFilter] = useState<IWarrantyFilter>({
        pageSize: 10,
        pageNumber: 1,
        fromDate: dayjs().format('YYYY-MM-DD'),
        toDate: dayjs().format('YYYY-MM-DD')
    })
    const [keyword, setKeyword] = useState('')

    const { data: dataResponse, isLoading, isFetching, refetch } = useSearchCouponQuery(filter)

    const { data: countResponse, isLoading: countLoading, refetch: countRefetch } = useGetCountTypeQuery()

    const couponData = dataResponse?.data?.records || (warranties as IWarranty[])

    const totalRecords = (dataResponse?.data?.totalRecords as number) || 0

    const countSuccessful = countResponse?.data.countSuccessful || 7
    const countFailed = countResponse?.data.countFailed || 3

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
        countRefetch()
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
        if (!isFetching && couponData) {
            const from = (page - 1) * Number(rowsPerPage) + Math.min(1, couponData?.length)
            setFrom(from)

            const to = Math.min(couponData?.length + (page - 1) * Number(rowsPerPage), totalRecords)
            setTo(to)
        }
    }, [isFetching, couponData, page, rowsPerPage])

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

    if (isLoading || countLoading) {
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
                        {t('COMMON.WARRANTY.TITLE')}
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
                                    paddingRight: '20px',
                                    '&.Mui-selected': {
                                        color: 'var(--text-color)'
                                    }
                                }}
                                label={
                                    <Box style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {t('COMMON.WARRANTY.ALL')}
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
                                            {countSuccessful + countFailed}
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
                                    '&.Mui-selected': {
                                        color: 'var(--text-color)',
                                        fontWeight: '600'
                                    }
                                }}
                                label={
                                    <Box style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {t('COMMON.WARRANTY.IN_WARRANTY')}
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
                                            {countSuccessful}
                                        </Box>
                                    </Box>
                                }
                                value={1}
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
                                        {t('COMMON.WARRANTY.OUT_OF_WARRANTY')}
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
                                            {countFailed}
                                        </Box>
                                    </Box>
                                }
                                value={2}
                            />
                        </Tabs>
                    </Box>

                    <Box display='flex' alignItems='center' gap='24px' margin='24px'>
                        <Box
                            sx={{ position: 'relative', width: '450px', height: '51px', display: 'flex', gap: '20px' }}
                        >
                            <TextField
                                id='location-search'
                                type='search'
                                placeholder={t('COMMON.WARRANTY.SEARCH')}
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
                        </Box>

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
                            onClick={() => router.push('/admin/suppliers/create')}
                        >
                            {t('COMMON.BUTTON.CREATE')}
                        </Button>
                    </Box>

                    <WarrantyTable data={warranties} refetch={refetchPage} setFilter={setFilter} />

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
        </>
    )
}

export default Page
