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
    Divider
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import SearchIcon from '@mui/icons-material/Search'
import OrderTable from './OrderTable'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { debounce } from 'lodash'
import { useCallback } from 'react'
import Loading from '@/components/Loading'
import { useSearchOrderQuery, useGetCountTypeQuery } from '@/services/OrderService'
import { IOrder, IOrderFilter } from '@/models/Order'
import dayjs from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers'
import { convertToVietnamTime } from '@/common/format'

function Page() {
    const { t } = useTranslation('common')
    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState('10')
    const [from, setFrom] = useState(1)
    const [to, setTo] = useState(10)
    const [filter, setFilter] = useState<IOrderFilter>({
        pageSize: 10,
        pageNumber: 1,
        fromDate: dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
        toDate: dayjs().format('YYYY-MM-DD')
    })
    const [keyword, setKeyword] = useState('')

    const { data: dataResponse, isLoading, isFetching, refetch } = useSearchOrderQuery(filter)

    const { data: countResponse, isLoading: isCountLoading, refetch: countRefetch } = useGetCountTypeQuery()

    const orderData = dataResponse?.data?.records as IOrder[]

    const totalRecords = (dataResponse?.data?.totalRecords as number) || 0

    const pendingCount = countResponse?.data.pendingCount || 0
    const processingCount = countResponse?.data.processingCount || 0
    const shippingCount = countResponse?.data.shippingCount || 0
    const deliveredCount = countResponse?.data.deliveredCount || 0
    const cancelledCount = countResponse?.data.cancelledCount || 0
    const returnedCount = countResponse?.data.returnedCount || 0

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
        if (!isFetching && orderData) {
            const from = (page - 1) * Number(rowsPerPage) + Math.min(1, orderData?.length)
            setFrom(from)

            const to = Math.min(orderData?.length + (page - 1) * Number(rowsPerPage), totalRecords)
            setTo(to)
        }
    }, [isFetching, orderData, page, rowsPerPage])

    useEffect(() => {
        refetch()
    }, [filter])

    const [currentTab, setCurrentTab] = useState(0)

    const handleChangeTabs = (newValue: number) => {
        setCurrentTab(newValue)
        if (newValue !== undefined) {
            setFilter(prev => ({
                ...prev,
                orderStatus:
                    newValue === 0
                        ? undefined
                        : newValue === 1
                        ? 'pending'
                        : newValue === 2
                        ? 'processing'
                        : newValue === 3
                        ? 'shipping'
                        : newValue === 4
                        ? 'delivered'
                        : newValue === 5
                        ? 'cancelled'
                        : 'returned'
            }))
        } else {
            setFilter(prev => ({
                ...prev,
                orderStatus: undefined
            }))
        }
    }

    useEffect(() => {}, [open])

    if (isLoading || isCountLoading) {
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
                        {t('COMMON.ORDER.ORDER_LIST')}
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
                                            {cancelledCount +
                                                deliveredCount +
                                                returnedCount +
                                                pendingCount +
                                                processingCount +
                                                shippingCount}
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
                                        {t('COMMON.ORDER.PENDING')}
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
                                            {pendingCount}
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
                                        {t('COMMON.ORDER.PROCESSING')}
                                        <Box
                                            style={{
                                                ...badgeStyle,
                                                backgroundColor:
                                                    currentTab === 2
                                                        ? 'var(--background-color-pink-selected)'
                                                        : 'var(--background-color-pink)',
                                                color:
                                                    currentTab === 2
                                                        ? 'var(--text-color-pink-selected)'
                                                        : 'var(--text-color-pink)'
                                            }}
                                        >
                                            {processingCount}
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
                                    paddingBottom: '14px',
                                    '&.Mui-selected': {
                                        color: 'var(--text-color)',
                                        fontWeight: '600'
                                    }
                                }}
                                label={
                                    <Box style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {t('COMMON.ORDER.SHIPPING')}
                                        <Box
                                            style={{
                                                ...badgeStyle,
                                                backgroundColor:
                                                    currentTab === 3
                                                        ? 'var(--background-color-blue-selected)'
                                                        : 'var(--background-color-blue)',
                                                color:
                                                    currentTab === 3
                                                        ? 'var(--text-color-blue-selected)'
                                                        : 'var(--text-color-blue)'
                                            }}
                                        >
                                            {shippingCount}
                                        </Box>
                                    </Box>
                                }
                                value={3}
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
                                        {t('COMMON.ORDER.DELIVERED')}
                                        <Box
                                            style={{
                                                ...badgeStyle,
                                                backgroundColor:
                                                    currentTab === 4
                                                        ? 'var(--background-color-success-selected)'
                                                        : 'var(--background-color-success)',
                                                color:
                                                    currentTab === 4
                                                        ? 'var(--text-color-success-selected)'
                                                        : 'var(--text-color-success)'
                                            }}
                                        >
                                            {deliveredCount}
                                        </Box>
                                    </Box>
                                }
                                value={4}
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
                                        {t('COMMON.ORDER.CANCELLED')}
                                        <Box
                                            style={{
                                                ...badgeStyle,
                                                backgroundColor:
                                                    currentTab === 5
                                                        ? 'var(--background-color-cancel-selected)'
                                                        : 'var(--background-color-cancel)',
                                                color:
                                                    currentTab === 5
                                                        ? 'var(--text-color-cancel-selected)'
                                                        : 'var(--text-color-cancel)'
                                            }}
                                        >
                                            {cancelledCount}
                                        </Box>
                                    </Box>
                                }
                                value={5}
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
                                        {t('COMMON.ORDER.RETURNED')}
                                        <Box
                                            style={{
                                                ...badgeStyle,
                                                backgroundColor:
                                                    currentTab === 6
                                                        ? 'var(--background-color-silver-selected)'
                                                        : 'var(--background-color-silver)',
                                                color:
                                                    currentTab === 6
                                                        ? 'var(--text-color-silver-selected)'
                                                        : 'var(--text-color-silver)'
                                            }}
                                        >
                                            {returnedCount}
                                        </Box>
                                    </Box>
                                }
                                value={6}
                            />
                        </Tabs>
                    </Box>

                    <Box display='flex' alignItems='center' gap='24px' margin='24px'>
                        <Box sx={{ position: 'relative', flex: 1, height: '51px', display: 'flex', gap: '20px' }}>
                            <TextField
                                id='location-search'
                                type='search'
                                placeholder={t('COMMON.ORDER.SEARCH')}
                                variant='outlined'
                                required
                                value={keyword}
                                onChange={e => handleSearchKeyword(e.target.value)}
                                sx={{
                                    color: 'var(--text-color)',
                                    padding: '0px',
                                    width: '45%',
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
                    </Box>

                    <OrderTable data={orderData} refetch={refetchPage} setFilter={setFilter} />

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
