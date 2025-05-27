'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { Printer, Mail, PhoneCall } from 'lucide-react'
import { IInventoryDetail, IInventoryFilter, IInventoryItemList } from '@/models/Inventory'
import SearchIcon from '@mui/icons-material/Search'
import {
    Avatar,
    Box,
    Button,
    Paper,
    Table,
    SelectChangeEvent,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Typography,
    Select,
    MenuItem,
    Pagination,
    TextField,
    InputAdornment,
    FormControl,
    InputLabel
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import dayjs from 'dayjs'
import { useGetCountTypeQuery } from '@/services/InventoryService'
import { debounce } from 'lodash'

function getStatusBgColor(status: string): string {
    if (status === 'outOfStock') {
        return 'var(--background-color-cancel)'
    } else if (status === 'inStock') {
        return 'var(--background-color-success)'
    } else {
        return 'var(--background-color-pending)'
    }
}

function getBorderColor(status: string): string {
    if (status === 'outOfStock') {
        return 'var(--border-color-cancel)'
    } else if (status === 'inStock') {
        return 'var(--border-color-success)'
    } else {
        return 'var(--border-color-pending)'
    }
}

function getStatusTextColor(status: string): string {
    if (status === 'outOfStock') {
        return 'var(--text-color-cancel)'
    } else if (status === 'inStock') {
        return 'var(--text-color-success)'
    } else {
        return 'var(--text-color-pending)'
    }
}

export default function InventoryDetailPage() {
    const { t } = useTranslation('common')

    const { data: countResponse } = useGetCountTypeQuery()
    const countInStock = countResponse?.data.countInStock || 0
    const countOutOfStock = countResponse?.data.countOutOfStock || 0
    const countLowStock = countResponse?.data.countLowStock || 0
    const [order, setOrder] = useState<'asc' | 'desc'>('asc')
    const [orderBy, setOrderBy] = useState<string>('')

    const inventoryDetail: IInventoryDetail = {
        id: 1,
        assigneeName: 'John Doe',
        assigneeEmail: 'johndoe@gmail.com',
        assigneeId: 'EMP001',
        assigneeAvatarPath: '/avatars/john_doe.png',
        assigneePhone: '+84123456789',
        notes: 'Kiểm kho định kỳ tháng 4.',
        lastStockUpdate: '2025-04-27T09:30:00Z',
        itemList: [
            {
                id: 1,
                productName: 'Laptop Dell XPS 13 Laptop Dell XPS 13 Laptop Dell XPS 13 Laptop Dell XPS 13',
                productImage: '/products/laptop_dell_xps13.png',
                productUnit: 'cái',
                realQuantity: 58,
                systemQuantity: 60,
                notes: 'Thiếu 2 cái',
                categoryName: 'Laptop',
                stockDifference: -2,
                sku: 'SKU-001',
                stockStatus: 'inStock'
            },
            {
                id: 2,
                productName: 'iPhone 15 Pro',
                productImage: '/products/iphone_15_pro.png',
                productUnit: 'chiếc',
                realQuantity: 102,
                systemQuantity: 102,
                categoryName: 'Điện thoại',
                notes: 'Đầy đủ hàng',
                stockDifference: 0,
                sku: 'SKU-002',
                stockStatus: 'inStock'
            },
            {
                id: 3,
                productName: 'Sony WH-1000XM5',
                productUnit: 'thiết bị',
                productImage: '/products/sony_wh1000xm5.png',
                realQuantity: 25,
                categoryName: 'Tivi',
                notes: 'Dư 3 cái',
                systemQuantity: 2,
                stockDifference: 3,
                sku: 'SKU-003',
                stockStatus: 'lowStock'
            }
        ],
        itemCount: 3
    }

    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState('10')
    const [from, setFrom] = useState(1)
    const [to, setTo] = useState(10)
    const [filter, setFilter] = useState<IInventoryFilter>({
        pageSize: 10,
        pageNumber: 1,
        fromDate: dayjs().format('YYYY-MM-DD'),
        toDate: dayjs().format('YYYY-MM-DD')
    })
    const [keyword, setKeyword] = useState('')

    useEffect(() => {}, [setFrom, setTo])

    const totalRecords = (inventoryDetail.itemCount as number) || 0
    const inventoryData = inventoryDetail.itemList

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

    // useEffect(() => {
    //     if (!isFetching && inventoryData) {
    //         const from = (page - 1) * Number(rowsPerPage) + Math.min(1, inventoryData?.length)
    //         setFrom(from)

    //         const to = Math.min(inventoryData?.length + (page - 1) * Number(rowsPerPage), totalRecords)
    //         setTo(to)
    //     }
    // }, [isFetching, inventoryData, page, rowsPerPage])

    useEffect(() => {
        // refetch()
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

    const categories = [
        { name: 'Điện thoại', id: 1 },
        { name: 'Máy tính', id: 2 },
        { name: 'Tivi', id: 3 },
        { name: 'Tai nghe', id: 4 },
        { name: 'Máy nghe nhạc', id: 5 }
    ]

    // if (isLoading || isCountLoading) {
    //     return <Loading />
    // }

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
        <Box
            sx={{
                maxWidth: '1200px',
                margin: '0 auto'
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: '24px'
                }}
            >
                <Box>
                    <Typography
                        sx={{
                            color: 'var(--text-color)',
                            fontWeight: 'bold',
                            fontSize: '20px',
                            marginLeft: '5px'
                        }}
                    >
                        {t('COMMON.INVENTORY.INVENTORY')}
                    </Typography>

                    <Typography
                        sx={{
                            color: 'var(--label-title-color)',
                            fontSize: '15px',
                            marginLeft: '5px'
                        }}
                    >
                        {new Date(inventoryDetail.lastStockUpdate).toLocaleDateString('vi-VN', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        gap: '20px',
                        alignItems: 'center'
                    }}
                >
                    <Button
                        startIcon={<Printer size={20} color='var(--text-color-button-save)' />}
                        sx={{
                            textTransform: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '7px 20px',
                            borderRadius: '10px',
                            fontSize: '15px',
                            fontWeight: 'bold',
                            backgroundColor: 'var(--background-color-button-save)',
                            width: 'auto',
                            '&:hover': {
                                backgroundColor: 'var(--background-color-button-save-hover)'
                            },
                            color: 'var(--text-color-button-save)'
                        }}
                    >
                        {t('COMMON.BUTTON.PRINT')}
                    </Button>
                </Box>
            </Box>

            <Paper
                sx={{
                    borderRadius: '15px',
                    height: 'fit-content',
                    padding: '24px',
                    mb: '24px',
                    backgroundColor: 'var(--background-color-item)'
                }}
            >
                <Typography
                    sx={{
                        color: 'var(--text-color)',
                        fontWeight: 'bold',
                        fontSize: '18px',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    {t('COMMON.QUOTATION.ASSIGNEE_INFO')}
                </Typography>

                {inventoryDetail.assigneeId ? (
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '200px', mt: '24px' }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: '20px'
                                }}
                            >
                                <Avatar
                                    src={inventoryDetail.assigneeAvatarPath}
                                    sx={{
                                        width: '50px',
                                        height: '50px'
                                    }}
                                />

                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '4px'
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            color: 'var(--text-color)',
                                            fontSize: '15px',
                                            maxWidth: '200px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        {inventoryDetail.assigneeName}
                                    </Typography>

                                    <Typography
                                        sx={{
                                            color: 'var(--label-title-color)',
                                            fontSize: '15px'
                                        }}
                                    >
                                        {inventoryDetail.assigneeId}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        gap: '15px',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Mail size={18} color='var(--label-title-color)' />

                                    <Typography
                                        sx={{
                                            color: 'var(--text-color)',
                                            fontSize: '15px'
                                        }}
                                    >
                                        {inventoryDetail.assigneeEmail}
                                    </Typography>
                                </Box>

                                <Box
                                    sx={{
                                        display: 'flex',
                                        mt: '4px',
                                        gap: '15px',
                                        alignItems: 'center'
                                    }}
                                >
                                    <PhoneCall size={18} color='var(--label-title-color)' />

                                    <Typography
                                        sx={{
                                            color: 'var(--text-color)',
                                            fontSize: '15px'
                                        }}
                                    >
                                        {inventoryDetail.assigneePhone}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>

                        {inventoryDetail.notes && (
                            <Box
                                sx={{
                                    mt: '24px',
                                    backgroundColor: 'var(--background-color-secondary)',
                                    borderRadius: '6px',
                                    padding: '12px 15px',
                                    borderLeft: '4px solid var(--primary-color)',
                                    display: 'flex',
                                    gap: '10px'
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: '14px',
                                        fontWeight: 'bold',
                                        color: 'var(--text-color)'
                                    }}
                                >
                                    {t('COMMON.PURCHASE_ORDER.NOTES')}:
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: '14px',
                                        color: 'var(--text-color)'
                                    }}
                                >
                                    {inventoryDetail.notes}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                ) : (
                    <Typography
                        sx={{
                            color: 'var(--label-title-color)',
                            fontSize: '15px',
                            textAlign: 'center',
                            mt: '12px'
                        }}
                    >
                        {t('COMMON.PURCHASE_ORDER.NOT_YET_RECEIVED')}
                    </Typography>
                )}
            </Paper>

            <Paper
                sx={{
                    borderRadius: '15px',
                    backgroundColor: 'var(--background-color-item)'
                }}
            >
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
                                    {countInStock + countOutOfStock + countLowStock}
                                </Box>
                            </Box>
                        }
                        value={0}
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
                                {t('COMMON.INVENTORY.IN_STOCK')}
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
                                    {countInStock}
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
                            paddingBottom: '14px',
                            '&.Mui-selected': {
                                color: 'var(--text-color)',
                                fontWeight: '600'
                            }
                        }}
                        label={
                            <Box style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {t('COMMON.INVENTORY.OUT_OF_STOCK')}
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
                                    {countLowStock}
                                </Box>
                            </Box>
                        }
                        value={2}
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
                                {t('COMMON.INVENTORY.LOW_STOCK')}
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
                                    {countOutOfStock}
                                </Box>
                            </Box>
                        }
                        value={3}
                    />
                </Tabs>

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
                </Box>

                <TableContainer
                    sx={{
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
                    <Table>
                        <TableHead>
                            <TableRow
                                sx={{
                                    backgroundColor: 'var(--background-color-table-header)',
                                    '&:last-child td, &:last-child th': {
                                        border: 'none'
                                    }
                                }}
                            >
                                <TableCell sx={{ borderColor: 'var(--border-color)', padding: '16px 30px 16px 24px' }}>
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
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {t('COMMON.PRODUCT.PRODUCT_NAME')}
                                        </Typography>
                                    </TableSortLabel>
                                </TableCell>

                                <TableCell sx={{ borderColor: 'var(--border-color)' }}>
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
                                        {t('COMMON.PRODUCT.CATEGORY')}
                                    </Typography>
                                </TableCell>

                                <TableCell sx={{ borderColor: 'var(--border-color)' }}>
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

                                <TableCell sx={{ borderColor: 'var(--border-color)' }}>
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
                                        {t('COMMON.INVENTORY.REAL_QUANTITY')}
                                    </Typography>
                                </TableCell>

                                <TableCell sx={{ borderColor: 'var(--border-color)' }}>
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
                                        {t('COMMON.INVENTORY.DIFFERENCE')}
                                    </Typography>
                                </TableCell>

                                <TableCell sx={{ borderColor: 'var(--border-color)' }}>
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
                                        {t('COMMON.INVENTORY.NOTES')}
                                    </Typography>
                                </TableCell>

                                <TableCell sx={{ borderColor: 'var(--border-color)', padding: '16px 50px' }}>
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
                            {inventoryData &&
                                inventoryData.map((row: IInventoryItemList, index: number) => (
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
                                                maxWidth: '500px',
                                                padding: '14px 24px'
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    width: '100%',
                                                    alignItems: 'center',
                                                    gap: '16px'
                                                }}
                                            >
                                                <Avatar
                                                    src={row.productImage}
                                                    sx={{
                                                        width: '50px',
                                                        height: '50px',
                                                        borderRadius: '10px'
                                                    }}
                                                />
                                                <Box
                                                    flex={1}
                                                    display='flex'
                                                    alignItems='left'
                                                    sx={{
                                                        gap: '2px',
                                                        overflow: 'hidden',
                                                        flexDirection: 'column'
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            fontSize: '15px',
                                                            overflow: 'hidden',
                                                            maxWidth: '100%',
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
                                                        {row.sku}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>

                                        <TableCell
                                            sx={{
                                                borderColor: 'var(--border-color)',
                                                borderStyle: 'dashed',
                                                padding: '14px 16px'
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    color: 'var(--text-color)',
                                                    fontSize: '15px',
                                                    maxWidth: '280px',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {row.categoryName}
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
                                                {row.productUnit}
                                            </Typography>
                                        </TableCell>

                                        <TableCell sx={{ borderColor: 'var(--border-color)', borderStyle: 'dashed' }}>
                                            <Typography
                                                sx={{
                                                    color: 'var(--text-color)',
                                                    fontSize: '15px',
                                                    textAlign: 'center',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {row.realQuantity}
                                            </Typography>
                                        </TableCell>

                                        <TableCell sx={{ borderColor: 'var(--border-color)', borderStyle: 'dashed' }}>
                                            <Typography
                                                sx={{
                                                    color: 'var(--text-color)',
                                                    fontSize: '15px',
                                                    textAlign: 'center',
                                                    fontWeight: 'bold',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {row.stockDifference}
                                            </Typography>
                                        </TableCell>

                                        <TableCell sx={{ borderColor: 'var(--border-color)', borderStyle: 'dashed' }}>
                                            <Typography
                                                sx={{
                                                    color: 'var(--text-color)',
                                                    fontSize: '15px',
                                                    maxWidth: '280px',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {row.notes}
                                            </Typography>
                                        </TableCell>

                                        <TableCell
                                            sx={{
                                                borderStyle: 'dashed',
                                                paddingRight: '24px',
                                                borderColor: 'var(--border-color)'
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    borderRadius: '9999px',
                                                    padding: '7px 15px',
                                                    border: getBorderColor(row.stockStatus),
                                                    display: 'flex',
                                                    maxWidth: '130px',
                                                    minWidth: '120px',
                                                    justifyContent: 'center',
                                                    backgroundColor: getStatusBgColor(row.stockStatus)
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        fontSize: '13px',
                                                        overflow: 'hidden',
                                                        color: getStatusTextColor(row.stockStatus),
                                                        width: 'auto',
                                                        fontWeight: 'bold',
                                                        display: 'inline-block',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    }}
                                                >
                                                    {row.stockStatus === 'inStock'
                                                        ? t('COMMON.PRODUCT.IN_STOCK')
                                                        : row.stockStatus === 'lowStock'
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
        </Box>
    )
}
