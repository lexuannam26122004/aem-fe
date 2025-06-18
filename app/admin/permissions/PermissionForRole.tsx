import { IAspNetRoleGetAll, IAspNetRoleUpdate } from '@/models/AspNetRole'
import { useState, useMemo, useCallback, useEffect } from 'react'
import Loading from '@/components/Loading'
import { useDeleteRoleMutation, useGetAllRolesQuery } from '@/services/AspNetRoleService'
import {
    Button,
    Paper,
    Table,
    TableCell,
    TableBody,
    Box,
    TextField,
    InputAdornment,
    MenuItem,
    Select,
    Pagination,
    SelectChangeEvent,
    Tooltip
} from '@mui/material'
import { TableSortLabel, Typography, TableContainer, TableHead, TableRow } from '@mui/material'
import sortTable, { getComparator } from '@/common/sortTable'
import { useTranslation } from 'react-i18next'
import PermissionForRoleModal from './PermissionForRoleModal'
import { CirclePlus, Edit, EyeIcon, SearchIcon, Trash2 } from 'lucide-react'
import { IFilterRole } from '@/models/TablePermissionModel'
import { debounce } from 'lodash'
import DialogCreate from './RoleCreate'
import DialogUpdate from './RoleUpdate'
import { useToast } from '@/hooks/useToast'
import UserAlertDialog from '@/components/UserAlertDialog'

export default function PermissionForRole() {
    const { t } = useTranslation('common')
    const [order, setOrder] = useState<'asc' | 'desc'>('asc')
    const [orderBy, setOrderBy] = useState<string>('')
    const [roleSelected, setRoleSelected] = useState<IAspNetRoleGetAll | null>(null)
    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState('5')
    const [from, setFrom] = useState(1)
    const [isOpenCreate, setIsOpenCreate] = useState(false)
    const [roleUpdate, setRoleUpdate] = useState<IAspNetRoleUpdate | null>(null)
    const [deleteRole] = useDeleteRoleMutation()
    const [keyword, setKeyword] = useState('')
    const [to, setTo] = useState(5)
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [filter, setFilter] = useState<IFilterRole>({
        pageSize: 5,
        pageNumber: 1
    })
    const toast = useToast()
    const { data: roleResponse, isLoading, isFetching, refetch } = useGetAllRolesQuery(filter)

    useEffect(() => {
        refetch()
    }, [filter])

    const roleData = (roleResponse?.data?.records as IAspNetRoleGetAll[]) || []
    const totalRecords = roleResponse?.data?.totalRecords || 0

    useEffect(() => {
        if (!isFetching && roleResponse?.data) {
            const from = (page - 1) * Number(rowsPerPage) + Math.min(1, roleData.length)
            setFrom(from)

            const to = Math.min(roleData.length + (page - 1) * Number(rowsPerPage), totalRecords)
            setTo(to)
        }
    }, [isFetching, roleResponse, page, rowsPerPage])

    const comparator = useMemo(() => getComparator(order, orderBy), [order, orderBy])
    const sortedRecords = useMemo(() => sortTable(roleData, comparator), [roleData, comparator]) as IAspNetRoleGetAll[]

    const handleSort = (property: string) => {
        setOrder(order === 'asc' ? 'desc' : 'asc')
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

    const handleDeleteClick = async (id: string) => {
        try {
            await deleteRole(id).unwrap()
            refetch()
            toast(t('COMMON.ROLES.REMOVE_ROLE_SUCCESS'), 'success')
        } catch (error) {
            toast(error.data?.detail, 'error')
        } finally {
            setDeleteId(null)
        }
    }

    const handleSearchKeyword = (value: string) => {
        setPage(1)
        setKeyword(value)
        debouncedSetFilter(value)
    }

    const handleOpenModal = useCallback(
        (data: IAspNetRoleGetAll | null) => {
            setRoleSelected(data)
        },
        [roleSelected]
    )

    if (isLoading) {
        return <Loading />
    }

    return (
        <Paper
            elevation={0}
            sx={{
                boxShadow: 'var(--box-shadow-paper)',
                width: '100%',
                overflow: 'hidden',
                borderRadius: '20px',
                backgroundColor: 'var(--background-color-item)'
            }}
        >
            <Typography
                sx={{
                    userSelect: 'none',
                    color: 'var(--text-color)',
                    fontWeight: 'bold',
                    fontSize: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '24px 24px 15px'
                }}
            >
                {t('COMMON.PERMISSION.TITLE')}
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0px 24px 24px',
                    flexWrap: 'wrap'
                }}
            >
                <Box sx={{ position: 'relative', width: '40%', minWidth: '400px', height: '51px' }}>
                    <TextField
                        id='location-search'
                        type='search'
                        placeholder={t('COMMON.PERMISSION.SEARCH')}
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
                                padding: '14px 0px',
                                color: 'var(--text-color)',
                                fontSize: '16px',
                                '&::placeholder': {
                                    color: 'var(--placeholder-color)',
                                    opacity: 1
                                }
                            },
                            '& .MuiOutlinedInput-root:hover fieldset': {
                                borderColor: 'var(--hover-field-color)'
                            },
                            '& .MuiOutlinedInput-root.Mui-focused fieldset': {
                                borderColor: 'var(--selected-field-color)'
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
                    onClick={() => setIsOpenCreate(true)}
                >
                    {t('COMMON.BUTTON.CREATE')}
                </Button>
            </Box>
            <TableContainer
                sx={{
                    maxHeight: '80vh',
                    overflow: 'auto',
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
                            <TableCell sx={{ padding: '16px 0px 16px 24px' }}>
                                <TableSortLabel
                                    active={'OrderCode' === orderBy}
                                    direction={orderBy === 'OrderCode' ? order : 'asc'}
                                    onClick={() => handleSort('OrderCode')}
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
                                        {t('COMMON.PERMISSION.ROLE_NAME')}
                                    </Typography>
                                </TableSortLabel>
                            </TableCell>

                            <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                <Typography
                                    sx={{
                                        fontWeight: 'bold',
                                        color: 'var(--text-color)',
                                        fontSize: '15px',
                                        textAlign: 'left',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {t('COMMON.PERMISSION.ROLE_DESCRIPTION')}
                                </Typography>
                            </TableCell>

                            <TableCell sx={{ padding: '16px 50px' }}>
                                <Typography
                                    sx={{
                                        fontWeight: 'bold',
                                        color: 'var(--text-color)',
                                        fontSize: '15px',
                                        overflow: 'hidden',
                                        textAlign: 'center',
                                        maxWidth: '280px',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {t('COMMON.SUPPLIERS.ACTIONS')}
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedRecords.map((row, index) => {
                            return (
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
                                            padding: '0 24px'
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                color: 'var(--primary-color)',
                                                fontSize: '15px',
                                                overflow: 'hidden',
                                                fontWeight: 'bold',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {row.name}
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
                                                color: 'var(--text-color)',
                                                fontSize: '15px'
                                            }}
                                        >
                                            {row.description}
                                        </Typography>
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            padding: '0px 25px 0px',
                                            borderColor: 'var(--border-color)',
                                            maxWidth: '146px',
                                            borderStyle: 'dashed'
                                        }}
                                    >
                                        <Box display='flex' alignItems='center' justifyContent='center' gap='10px'>
                                            <Tooltip title={t('COMMON.BUTTON.DETAIL')}>
                                                <Box
                                                    display='flex'
                                                    alignItems='center'
                                                    justifyContent='center'
                                                    sx={{
                                                        padding: '8px 12px',
                                                        cursor: 'pointer',
                                                        borderRadius: '8px',
                                                        backgroundColor: 'var(--background-color-button-view)',
                                                        border: '1px solid #bfdbfe',
                                                        '&:hover': {
                                                            backgroundColor: 'var(--hover-color-button-view)',
                                                            borderColor: '#96c5ff'
                                                        }
                                                    }}
                                                    onClick={() => handleOpenModal(row)}
                                                >
                                                    <EyeIcon size={16} color='#2563eb' />
                                                </Box>
                                            </Tooltip>

                                            <Tooltip title={t('COMMON.BUTTON.UPDATE')}>
                                                <Box
                                                    display='flex'
                                                    alignItems='center'
                                                    justifyContent='center'
                                                    sx={{
                                                        padding: '8px 12px',
                                                        cursor: 'pointer',
                                                        borderRadius: '8px',
                                                        backgroundColor: 'var(--background-color-button-edit)',
                                                        border: '1px solid #fde68a',
                                                        '&:hover': {
                                                            backgroundColor: 'var(--hover-color-button-edit)',
                                                            borderColor: '#fadc5e'
                                                        }
                                                    }}
                                                    onClick={() =>
                                                        setRoleUpdate({
                                                            id: row.id,
                                                            name: row.name,
                                                            description: row.description || '',
                                                            isActive: row.isActive || false
                                                        })
                                                    }
                                                >
                                                    <Edit size={16} color='#d97706' />
                                                </Box>
                                            </Tooltip>

                                            <Tooltip title={t('COMMON.BUTTON.DELETE')}>
                                                <Box
                                                    display='flex'
                                                    alignItems='center'
                                                    justifyContent='center'
                                                    sx={{
                                                        padding: '8px 12px',
                                                        cursor: 'pointer',
                                                        borderRadius: '8px',
                                                        backgroundColor: 'var(--background-color-button-delete)',
                                                        border: '1px solid #fecaca',
                                                        '&:hover': {
                                                            backgroundColor: 'var(--hover-color-button-delete)',
                                                            borderColor: '#fba5a5'
                                                        }
                                                    }}
                                                    onClick={() => setDeleteId(row.id)}
                                                >
                                                    <Trash2 size={16} color='#dc2626' />
                                                </Box>
                                            </Tooltip>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
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

            {roleSelected && (
                <PermissionForRoleModal
                    data={roleSelected}
                    open={!!roleSelected}
                    onClose={() => setRoleSelected(null)}
                />
            )}

            {isOpenCreate && <DialogCreate open={isOpenCreate} handleClose={() => setIsOpenCreate(false)} />}

            {roleUpdate && (
                <DialogUpdate
                    open={roleUpdate !== null}
                    handleClose={() => setRoleUpdate(null)}
                    name={roleUpdate.name}
                    id={roleUpdate.id}
                    description={roleUpdate.description}
                    isActive={roleUpdate.isActive}
                />
            )}

            {deleteId && (
                <UserAlertDialog
                    open={!!deleteId}
                    setOpen={() => setDeleteId(null)}
                    title={t('COMMON.ROLES.REMOVE_ROLE')}
                    alertText={t('COMMON.ROLES.REMOVE_ROLE_CONFIRM')}
                    onConfirm={() => handleDeleteClick(deleteId)}
                />
            )}
        </Paper>
    )
}
