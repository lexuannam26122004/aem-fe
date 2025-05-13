'use client'
import {
    Box,
    Select,
    Pagination,
    Typography,
    MenuItem,
    SelectChangeEvent,
    Paper,
    InputLabel,
    FormControl,
    TextField,
    InputAdornment,
    Button,
    Divider
} from '@mui/material'
import { useEffect, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import SearchIcon from '@mui/icons-material/Search'
import { useRouter } from 'next/navigation'
import TableSupplier from './TableSupplier'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { debounce } from 'lodash'
import { useCallback } from 'react'
// import { useGetAllDisciplinesQuery } from '@/services/DisciplineService'
import Loading from '@/components/Loading'
import { CirclePlus } from 'lucide-react'
import { useSearchSupplierQuery } from '@/services/SupplierService'
import { IFilter } from '@/models/Common'
import { ISupplier } from '@/models/Supplier'
import { useGetCountPartnerQuery } from '@/services/SupplierService'

function Page() {
    const router = useRouter()
    const { t } = useTranslation('common')
    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState('10')
    const [from, setFrom] = useState(1)
    const [to, setTo] = useState(10)
    const [filter, setFilter] = useState<IFilter>({
        pageSize: 10,
        pageNumber: 1
    })
    const [keyword, setKeyword] = useState('')

    const { data: dataResponse, isLoading, isFetching, refetch } = useSearchSupplierQuery(filter)

    const { data: countResponse, isLoading: countLoading, refetch: countRefetch } = useGetCountPartnerQuery()

    const supplierData = dataResponse?.data?.records as ISupplier[]

    const totalRecords = (dataResponse?.data?.totalRecords as number) || 0

    const countPartner = countResponse?.data.countPartner || 0
    const countNotPartner = countResponse?.data.countNotPartner || 0

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
        if (!isFetching && supplierData) {
            const from = (page - 1) * Number(rowsPerPage) + Math.min(1, supplierData?.length)
            setFrom(from)

            const to = Math.min(supplierData?.length + (page - 1) * Number(rowsPerPage), totalRecords)
            setTo(to)
        }
    }, [isFetching, supplierData, page, rowsPerPage])

    useEffect(() => {
        refetch()
    }, [filter])

    const [currentTab, setCurrentTab] = useState(0)

    const handleChangeTabs = (newValue: number) => {
        setCurrentTab(newValue)
        if (newValue === 1) {
            setFilter(prev => ({
                ...prev,
                isPartner: true
            }))
        } else if (newValue === 2) {
            setFilter(prev => ({
                ...prev,
                isPartner: false
            }))
        } else {
            setFilter(prev => ({
                ...prev,
                isPartner: undefined
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
                    {t('COMMON.SUPPLIERS.TITLE')}
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
                                paddingRight: '25px',
                                '&.Mui-selected': {
                                    color: 'var(--text-color)',
                                    fontWeight: '600'
                                }
                            }}
                            label={
                                <Box style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {t('COMMON.SUPPLIERS.ALL')}
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
                                        {countPartner + countNotPartner}
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
                                    {t('COMMON.SUPPLIERS.PARTNER')}
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
                                        {countPartner}
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
                                    {t('COMMON.SUPPLIERS.NOT_PARTNER')}
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
                                        {countNotPartner}
                                    </Box>
                                </Box>
                            }
                            value={2}
                        />
                    </Tabs>
                </Box>

                <Box display='flex' alignItems='center' gap='24px' margin='24px 24px'>
                    <Box sx={{ position: 'relative', width: '50%', height: '55px' }}>
                        <TextField
                            id='location-search'
                            type='search'
                            placeholder={t('COMMON.SUPPLIERS.SEARCH')}
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
                                    padding: '15px 0px',
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
                                                    zIndex: 100
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
                        onClick={() => router.push('/admin/suppliers/create')}
                    >
                        {t('COMMON.BUTTON.CREATE')}
                    </Button>
                    {/* )} */}
                </Box>

                <TableSupplier supplierData={supplierData} refetch={refetchPage} setFilter={setFilter} />

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
                                    borderColor: 'var(--hover-field-color)'
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'var(--selected-field-color)'
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
                                        backgroundColor: 'var(--background-item)',
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

export default Page
