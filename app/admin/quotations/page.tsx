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
import QuotationTable from './QuotationTable'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { debounce } from 'lodash'
import { useCallback } from 'react'
import Loading from '@/components/Loading'
import { CirclePlus } from 'lucide-react'
import { useSearchQuotationQuery, useGetCountTypeQuery } from '@/services/QuotationService'
import { IQuotation, IQuotationFilter } from '@/models/Quotation'
import dayjs from 'dayjs'
import { DatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { convertToVietnamTime } from '@/common/format'

const quotations: IQuotation[] = [
    {
        id: 'f11edc73-e3c0-4fb5-bdbb-f2b2d00fa427',
        quotationCode: 'Q-3979',
        assigneeName: 'Nguyen Van A',
        assigneeId: 'EM0001',
        customerName: 'Nguyen Van A',
        customerEmail: 'nguyenvana@gmail.com',
        customerAvatarPath: undefined,
        phone: '+84588519564',
        itemCount: 1,
        requestedDate: '2025-04-16T05:10:06.541Z',
        status: 'cancelled',
        createdAt: '2025-04-16T05:10:06.541Z',
        updatedAt: '2025-04-18T05:10:06.541Z'
    },
    {
        id: 'af456d01-0729-42d6-8ff3-17d822e473ca',
        quotationCode: 'Q-7037',
        assigneeName: 'Nguyen Van A',
        assigneeId: 'EM0001',
        customerName: 'Tran Thi B',
        customerEmail: 'tranthib@outlook.com',
        customerAvatarPath: undefined,
        phone: '+84837246368',
        itemCount: 5,
        requestedDate: '2025-04-10T05:10:06.542Z',
        status: 'pending',
        createdAt: '2025-04-08T05:10:06.542Z',
        updatedAt: '2025-04-11T05:10:06.542Z'
    },
    {
        id: 'cf86982b-d8a7-44dc-bdf2-ff41f3ce6a3c',
        quotationCode: 'Q-6163',
        assigneeName: 'Nguyen Van A',
        assigneeId: 'EM0001',
        customerName: 'Le Van C',
        customerEmail: 'levanc@yahoo.com',
        customerAvatarPath: undefined,
        phone: '+84772756015',
        itemCount: 10,
        requestedDate: '2025-04-06T05:10:06.542Z',
        status: 'completed',
        createdAt: '2025-04-05T05:10:06.542Z',
        updatedAt: '2025-04-06T05:10:06.542Z'
    },
    {
        id: '32c50e69-3c00-4909-a96b-70000ef47c07',
        quotationCode: 'Q-6480',
        assigneeName: 'Nguyen Van A',
        assigneeId: 'EM0001',
        customerName: 'Pham Thi D',
        customerEmail: 'phamthid@gmail.com',
        customerAvatarPath: undefined,
        phone: '+84540287703',
        itemCount: 5,
        requestedDate: '2025-04-09T05:10:06.542Z',
        status: 'pending',
        createdAt: '2025-04-07T05:10:06.542Z',
        updatedAt: '2025-04-09T05:10:06.542Z'
    },
    {
        id: '30060350-9bc0-4ae1-a5db-85c74c1be71b',
        quotationCode: 'Q-4365',
        assigneeName: 'Nguyen Van A',
        assigneeId: 'EM0001',
        customerName: 'Hoang Van E',
        customerEmail: 'hoangvane@yahoo.com',
        customerAvatarPath: undefined,
        phone: '+84960418945',
        itemCount: 5,
        requestedDate: '2025-04-04T05:10:06.542Z',
        status: 'pending',
        createdAt: '2025-04-02T05:10:06.542Z',
        updatedAt: '2025-04-07T05:10:06.542Z'
    },
    {
        id: '2b7e3057-12d9-46b2-8f3b-f49c2d00b859',
        quotationCode: 'Q-5129',
        assigneeName: 'Nguyen Van A',
        assigneeId: 'EM0001',
        customerName: 'Dang Thi F',
        customerEmail: 'dangthif@gmail.com',
        customerAvatarPath: undefined,
        phone: '+84972615289',
        itemCount: 8,
        requestedDate: '2025-04-12T05:10:06.542Z',
        status: 'processing',
        createdAt: '2025-04-10T05:10:06.542Z',
        updatedAt: '2025-04-14T05:10:06.542Z'
    },
    {
        id: '5a9cf0cb-65d4-46fb-b4fa-569e46c9dbef',
        quotationCode: 'Q-2845',
        assigneeName: 'Nguyen Van A',
        assigneeId: 'EM0001',
        customerName: 'Bui Van G',
        customerEmail: 'buivang@yahoo.com',
        customerAvatarPath: undefined,
        phone: '+84788845219',
        itemCount: 2,
        requestedDate: '2025-04-07T05:10:06.542Z',
        status: 'completed',
        createdAt: '2025-04-05T05:10:06.542Z',
        updatedAt: '2025-04-08T05:10:06.542Z'
    },
    {
        id: '3fa3c2d0-3897-4ef4-8c10-b508d2d2f3ab',
        quotationCode: 'Q-1257',
        assigneeName: 'Nguyen Van A',
        assigneeId: 'EM0001',
        customerName: 'Do Thi H',
        customerEmail: 'dothih@gmail.com',
        customerAvatarPath: undefined,
        phone: '+84919284572',
        itemCount: 6,
        requestedDate: '2025-04-11T05:10:06.542Z',
        status: 'pending',
        createdAt: '2025-04-09T05:10:06.542Z',
        updatedAt: '2025-04-12T05:10:06.542Z'
    },
    {
        id: '04b17a2e-c9b8-46aa-90f3-5ed7e5c4e7e3',
        quotationCode: 'Q-5932',
        assigneeName: 'Nguyen Van A',
        assigneeId: 'EM0001',
        customerName: 'Vo Van I',
        customerEmail: 'vovani@outlook.com',
        customerAvatarPath: undefined,
        phone: '+84872615023',
        itemCount: 9,
        requestedDate: '2025-04-08T05:10:06.542Z',
        status: 'processing',
        createdAt: '2025-04-06T05:10:06.542Z',
        updatedAt: '2025-04-09T05:10:06.542Z'
    },
    {
        id: '9f44570a-8c4a-45f2-823c-967b9fd9f572',
        quotationCode: 'Q-1983',
        assigneeName: 'Nguyen Van A',
        assigneeId: 'EM0001',
        customerName: 'Nguyen Thi J',
        customerEmail: 'nguyenthij@gmail.com',
        customerAvatarPath: undefined,
        phone: '+84919846273',
        itemCount: 4,
        requestedDate: '2025-04-14T05:10:06.542Z',
        status: 'cancelled',
        createdAt: '2025-04-12T05:10:06.542Z',
        updatedAt: '2025-04-16T05:10:06.542Z'
    }
]

function Page() {
    const { t } = useTranslation('common')
    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState('10')
    const [from, setFrom] = useState(1)
    const [to, setTo] = useState(10)
    const [filter, setFilter] = useState<IQuotationFilter>({
        pageSize: 10,
        pageNumber: 1,
        fromDate: dayjs().format('YYYY-MM-DD'),
        toDate: dayjs().format('YYYY-MM-DD')
    })
    const [keyword, setKeyword] = useState('')
    const [open, setOpen] = useState(false)
    useEffect(() => {}, [open])

    const { data: dataResponse, isLoading, isFetching, refetch } = useSearchQuotationQuery(filter)

    const { data: countResponse, isLoading: isCountLoading, refetch: countRefetch } = useGetCountTypeQuery()

    const quotationData = dataResponse?.data?.records || (quotations as IQuotation[])

    const totalRecords = (dataResponse?.data?.totalRecords as number) || 0

    const countPending = countResponse?.data.countPending || 0
    const countProcessing = countResponse?.data.countProcessing || 0
    const countCompleted = countResponse?.data.countCompleted || 0
    const countCancelled = countResponse?.data.countCancelled || 0

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
        if (!isFetching && quotationData) {
            const from = (page - 1) * Number(rowsPerPage) + Math.min(1, quotationData?.length)
            setFrom(from)

            const to = Math.min(quotationData?.length + (page - 1) * Number(rowsPerPage), totalRecords)
            setTo(to)
        }
    }, [isFetching, quotationData, page, rowsPerPage])

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
                        {t('COMMON.QUOTATION.QUOTATION_LIST')}
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
                                            {countCancelled + countPending + countCompleted + countProcessing}
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
                                            {countPending}
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
                                                        ? 'var(--background-color-blue-selected)'
                                                        : 'var(--background-color-blue)',
                                                color:
                                                    currentTab === 2
                                                        ? 'var(--text-color-blue-selected)'
                                                        : 'var(--text-color-blue)'
                                            }}
                                        >
                                            {countProcessing}
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
                                        {t('COMMON.QUOTATION.COMPLETED')}
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
                                            {countCompleted}
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
                                        {t('COMMON.ORDER.CANCELLED')}
                                        <Box
                                            style={{
                                                ...badgeStyle,
                                                backgroundColor:
                                                    currentTab === 4
                                                        ? 'var(--background-color-cancel-selected)'
                                                        : 'var(--background-color-cancel)',
                                                color:
                                                    currentTab === 4
                                                        ? 'var(--text-color-cancel-selected)'
                                                        : 'var(--text-color-cancel)'
                                            }}
                                        >
                                            {countCancelled}
                                        </Box>
                                    </Box>
                                }
                                value={4}
                            />
                        </Tabs>
                    </Box>

                    <Box display='flex' alignItems='center' gap='24px' margin='24px'>
                        <Box sx={{ position: 'relative', flex: 1, height: '51px', display: 'flex', gap: '20px' }}>
                            <TextField
                                id='location-search'
                                type='search'
                                placeholder={t('COMMON.QUOTATION.SEARCH')}
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

                    <QuotationTable data={quotationData} refetch={refetchPage} setFilter={setFilter} />

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
