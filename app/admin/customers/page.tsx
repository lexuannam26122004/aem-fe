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
import CustomerTable from './CustomerTable'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { debounce } from 'lodash'
import { useCallback } from 'react'
import Loading from '@/components/Loading'
import { CircleAlert, CirclePlus } from 'lucide-react'
import { useSearchCouponQuery, useGetCountTypeQuery } from '@/services/CouponService'
import { ICustomer, ICustomerFilter } from '@/models/Customer'
import dayjs from 'dayjs'
import { DatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { convertToVietnamTime } from '@/common/format'

const customers: ICustomer[] = [
    {
        id: 1,
        fullName: 'Nguyễn Văn An',
        username: 'nguyenvanan',
        email: 'an.nguyen@gmail.com',
        phoneNumber: '0987654321',
        address: '123 Đường Lê Lợi, Quận 1, TP.HCM',
        birthday: '1995-05-12',
        avatarPath: undefined,
        gender: true,
        createdAt: '2024-03-01T10:30:00',
        rank: 'gold',
        lastPurchase: '2024-03-15T14:00:00',
        totalOrders: 15,
        totalSpent: 30000000,
        isActive: true
    },
    {
        id: 2,
        fullName: 'Trần Thị Bích Ngọc',
        username: 'bichngoc',
        email: 'ngoc.tran@gmail.com',
        phoneNumber: '0912345678',
        address: '45 Đường Hoàng Diệu, Đà Nẵng',
        birthday: '1998-09-22',
        avatarPath: undefined,
        gender: true,
        createdAt: '2024-02-10T11:45:00',
        rank: 'silver',
        lastPurchase: '2024-03-18T10:15:00',
        totalOrders: 10,
        totalSpent: 15000000,
        isActive: false
    },
    {
        id: 3,
        fullName: 'Lê Minh Tuấn',
        username: 'leminhtuan',
        email: 'tuan.le@gmail.com',
        phoneNumber: '0978123456',
        address: '90 Đường Phạm Ngũ Lão, Hà Nội',
        birthday: '1990-12-05',
        avatarPath: undefined,
        gender: true,
        createdAt: '2023-12-20T09:00:00',
        rank: 'gold',
        lastPurchase: '2024-03-12T16:20:00',
        totalOrders: 25,
        totalSpent: 50000000,
        isActive: true
    },
    {
        id: 4,
        fullName: 'Phạm Hồng Nhung',
        username: 'hongnhung',
        email: 'nhung.pham@gmail.com',
        phoneNumber: '0934567890',
        address: '12 Đường Trần Phú, Nha Trang',
        birthday: '2000-03-08',
        avatarPath: undefined,
        gender: true,
        createdAt: '2024-01-05T13:15:00',
        rank: 'new',
        lastPurchase: '2024-02-28T11:30:00',
        totalOrders: 3,
        totalSpent: 2000000,
        isActive: false
    },
    {
        id: 5,
        fullName: 'Đặng Quốc Bảo',
        username: 'quocbao',
        email: 'bao.dang@gmail.com',
        phoneNumber: '0965432109',
        address: '78 Đường Nguyễn Huệ, TP.HCM',
        birthday: '1988-07-20',
        avatarPath: undefined,
        gender: true,
        createdAt: '2023-10-15T17:00:00',
        rank: 'gold',
        lastPurchase: '2024-03-10T09:45:00',
        totalOrders: 30,
        totalSpent: 60000000,
        isActive: false
    },
    {
        id: 6,
        fullName: 'Vũ Thị Lan',
        username: 'vuthilan',
        email: 'lan.vu@gmail.com',
        phoneNumber: '0956781234',
        address: '56 Đường Lê Duẩn, Huế',
        birthday: '1997-11-12',
        avatarPath: undefined,
        gender: true,
        createdAt: '2024-02-22T08:30:00',
        rank: 'silver',
        lastPurchase: '2024-03-16T14:50:00',
        totalOrders: 12,
        totalSpent: 18000000,
        isActive: true
    },
    {
        id: 7,
        fullName: 'Trịnh Công Minh',
        username: 'congminh',
        email: 'minh.trinh@gmail.com',
        phoneNumber: '0923456789',
        address: '33 Đường Phan Chu Trinh, Đà Nẵng',
        birthday: '1994-04-25',
        avatarPath: undefined,
        gender: true,
        createdAt: '2024-01-30T12:45:00',
        rank: 'silver',
        lastPurchase: '2024-03-14T17:10:00',
        totalOrders: 20,
        totalSpent: 40000000,
        isActive: false
    },
    {
        id: 8,
        fullName: 'Hoàng Thị Mai',
        username: 'hoangmai',
        email: 'mai.hoang@gmail.com',
        phoneNumber: '0909876543',
        address: '22 Đường Lý Thường Kiệt, Cần Thơ',
        birthday: '1999-06-30',
        avatarPath: undefined,
        gender: true,
        createdAt: '2024-03-01T10:00:00',
        rank: 'new',
        lastPurchase: '2024-03-20T13:30:00',
        totalOrders: 5,
        totalSpent: 7000000,
        isActive: true
    },
    {
        id: 9,
        fullName: 'Ngô Đức Thịnh',
        username: 'ngoducthinh',
        email: 'thinh.ngo@gmail.com',
        phoneNumber: '0943216789',
        address: '67 Đường Bạch Đằng, Hải Phòng',
        birthday: '1985-01-15',
        avatarPath: undefined,
        gender: true,
        createdAt: '2023-09-10T15:00:00',
        rank: 'gold',
        lastPurchase: '2024-03-19T18:00:00',
        totalOrders: 40,
        totalSpent: 80000000,
        isActive: true
    },
    {
        id: 10,
        fullName: 'Lý Thị Thanh',
        username: 'lythithanh',
        email: 'thanh.ly@gmail.com',
        phoneNumber: '0911234567',
        address: '88 Đường Hùng Vương, Hà Nội',
        birthday: '1992-02-18',
        avatarPath: undefined,
        gender: true,
        createdAt: '2024-03-05T14:20:00',
        rank: 'new',
        lastPurchase: '2024-03-21T09:20:00',
        totalOrders: 8,
        totalSpent: 12000000,
        isActive: true
    }
]

function Page() {
    const { t } = useTranslation('common')
    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState('10')
    const [from, setFrom] = useState(1)
    const [to, setTo] = useState(10)
    const [filter, setFilter] = useState<ICustomerFilter>({
        pageSize: 10,
        pageNumber: 1
    })
    const [keyword, setKeyword] = useState('')
    const [open, setOpen] = useState(false)
    useEffect(() => {}, [open])

    const { data: dataResponse, isLoading, isFetching, refetch } = useSearchCouponQuery(filter)

    const { data: countResponse, isLoading: countLoading, refetch: countRefetch } = useGetCountTypeQuery()

    const couponData = dataResponse?.data?.records || (customers as ICustomer[])

    const totalRecords = (dataResponse?.data?.totalRecords as number) || 0

    const countSilver = countResponse?.data.countSilver || 0
    const countGold = countResponse?.data.countGold || 0
    const countNew = countResponse?.data.countNew || 0

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
                        {t('COMMON.CUSTOMER.CUSTOMER')}
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
                                        {t('COMMON.CUSTOMER.ALL_CUSTOMER')}
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
                                            {countGold + countSilver + countNew}
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
                                        {t('COMMON.CUSTOMER.GOLD_CUSTOMER')}
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
                                            {countGold}
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
                                        {t('COMMON.CUSTOMER.SILVER_CUSTOMER')}
                                        <Box
                                            style={{
                                                ...badgeStyle,
                                                backgroundColor:
                                                    currentTab === 2
                                                        ? 'var(--background-color-silver-selected)'
                                                        : 'var(--background-color-silver)',
                                                color:
                                                    currentTab === 2
                                                        ? 'var(--text-color-silver-selected)'
                                                        : 'var(--text-color-silver)'
                                            }}
                                        >
                                            {countSilver}
                                        </Box>
                                    </Box>
                                }
                                value={2}
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
                                        {t('COMMON.CUSTOMER.NEW_CUSTOMER')}
                                        <Box
                                            style={{
                                                ...badgeStyle,
                                                backgroundColor:
                                                    currentTab === 3
                                                        ? 'var(--background-color-success-selected)'
                                                        : 'var(--background-color-success)',
                                                color:
                                                    currentTab === 3
                                                        ? 'var(--text-color-success-selected)'
                                                        : 'var(--text-color-success)'
                                            }}
                                        >
                                            {countNew}
                                        </Box>
                                    </Box>
                                }
                                value={3}
                            />
                        </Tabs>
                    </Box>

                    <Box margin='24px'>
                        <Box
                            sx={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}
                        >
                            <Box
                                sx={{
                                    width: '60%',
                                    height: '51px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '24px'
                                }}
                            >
                                <TextField
                                    id='location-search'
                                    type='search'
                                    placeholder={t('COMMON.CUSTOMER.SEARCH')}
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
                                        width: '255px',
                                        '& .MuiOutlinedInput-root:hover fieldset': {
                                            borderColor: 'var(--field-color-hover)'
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
                                    <InputLabel id='select-label'>{t('COMMON.CUSTOMER.STATUS')}</InputLabel>
                                    <Select
                                        defaultValue='all_customer'
                                        label={t('COMMON.CUSTOMER.STATUS')}
                                        value={
                                            filter.isActive === undefined
                                                ? 'all_customer'
                                                : filter.isActive
                                                ? 'active_customer'
                                                : 'inactive_customer'
                                        }
                                        onChange={e =>
                                            setFilter({
                                                ...filter,
                                                isActive:
                                                    e.target.value === 'all_customer'
                                                        ? undefined
                                                        : e.target.value === 'active_customer'
                                                        ? true
                                                        : false
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
                                            value='all_customer'
                                            sx={{
                                                borderRadius: '6px'
                                            }}
                                        >
                                            {t('COMMON.COUPON.ALL_CUSTOMER')}
                                        </MenuItem>

                                        <MenuItem
                                            value='active_customer'
                                            sx={{
                                                mt: '3px',
                                                borderRadius: '6px'
                                            }}
                                        >
                                            {t('COMMON.CUSTOMER.ACTIVE')}
                                        </MenuItem>

                                        <MenuItem
                                            value='inactive_customer'
                                            sx={{
                                                mt: '3px',
                                                borderRadius: '6px'
                                            }}
                                        >
                                            {t('COMMON.CUSTOMER.INACTIVE')}
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>

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
                        </Box>

                        <Box
                            sx={{
                                mt: '24px',
                                width: '100%',
                                height: '51px',
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
                                    {t('COMMON.CUSTOMER.FILTER_DESC')}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    <CustomerTable data={couponData} refetch={refetchPage} setFilter={setFilter} />

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
