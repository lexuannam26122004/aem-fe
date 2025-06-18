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
    Avatar
} from '@mui/material'
import { CheckCircleIcon, ClipboardCheck, ClipboardX, Edit, EyeIcon, Trash2, XCircleIcon } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import AlertDialog from '@/components/AlertDialog'
import { useChangeIsPartnerSupplierMutation, useChangeStatusSupplierMutation } from '@/services/SupplierService'
import { useToast } from '@/hooks/useToast'
import { ISupplier, ISupplierFilter } from '@/models/Supplier'
import DetailModal from './DetailModal'

function getStatusBgColor(status: boolean): string {
    if (status === false) {
        return 'var(--background-color-cancel)'
    } else {
        return 'var(--background-color-success)'
    }
}

function getStatusTextColor(status: boolean): string {
    if (status === false) {
        return 'var(--text-color-cancel)'
    } else {
        return 'var(--text-color-success)'
    }
}

function getBorderColor(status: boolean): string {
    if (!status) {
        return '1px solid var(--border-color-cancel)'
    } else {
        return '1px solid var(--border-color-success)'
    }
}

interface IProps {
    supplierData: ISupplier[]
    refetch: () => void
    setFilter: React.Dispatch<React.SetStateAction<ISupplierFilter>>
}

function DataTable({ supplierData, setFilter, refetch }: IProps) {
    const { t } = useTranslation('common')
    const router = useRouter()
    const toast = useToast()
    const [order, setOrder] = useState<'asc' | 'desc'>('asc')
    const [orderBy, setOrderBy] = useState<string>('')
    const [openDialog, setOpenDialog] = useState(false)
    const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null)
    const [selectedChangeId, setSelectedChangeId] = useState<number | null>(null)
    const [typeAlert, setTypeAlert] = useState<number | null>(null)
    const [changeStatusSupplierMutation, { isLoading: isLoadingDelete }] = useChangeStatusSupplierMutation()
    const [changePartner, { isLoading: isLoadingChange }] = useChangeIsPartnerSupplierMutation()
    const [selectedSupplier, setSelectedSupplier] = useState<ISupplier | null>(null)

    const handleButtonUpdateClick = (id: number) => {
        router.push(`/admin/suppliers/update?id=${id}`)
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

    const handleDeleteClick = async (id: number) => {
        setTypeAlert(0)
        setSelectedDeleteId(id)
        setOpenDialog(true)
    }

    const handlePartnerClick = (id: number) => {
        setTypeAlert(1)
        setSelectedChangeId(id)
        setOpenDialog(true)
    }

    const handleClickDetail = (row: ISupplier) => {
        setSelectedSupplier(row)
    }

    const handleChangePartner = async () => {
        if (selectedChangeId) {
            try {
                await changePartner(selectedChangeId).unwrap()
                refetch()
                toast(t('COMMON.SUPPLIERS.UPDATE_PARTNER_SUCCESS'), 'success')
            } catch {
                toast(t('COMMON.SUPPLIERS.UPDATE_PARTNER_FAIL'), 'error')
            }
        }
        setOpenDialog(false)
        setSelectedChangeId(null)
        setTypeAlert(null)
    }

    const handleDeleteSupplier = async () => {
        if (selectedDeleteId) {
            try {
                await changeStatusSupplierMutation(selectedDeleteId).unwrap()
                refetch()
                toast(t('COMMON.SUPPLIERS.DELETE_SUPPLIER_SUCCESS'), 'success')
            } catch {
                toast(t('COMMON.SUPPLIERS.DELETE_SUPPLIER_FAIL'), 'error')
            }
        }
        setOpenDialog(false)
        setSelectedDeleteId(null)
        setSelectedSupplier(null)
        setTypeAlert(null)
    }

    return (
        <>
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
                                            maxWidth: '300px',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {t('COMMON.SUPPLIERS.SUPPLIER_NAME')}
                                    </Typography>
                                </TableSortLabel>
                            </TableCell>

                            <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                <TableSortLabel
                                    active={'ContactName' === orderBy}
                                    direction={orderBy === 'ContactName' ? order : 'asc'}
                                    onClick={() => handleSort('ContactName')}
                                    sx={{
                                        '& .MuiTableSortLabel-icon': {
                                            color: 'var(--text-color) !important'
                                        },
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center'
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
                                        {t('COMMON.SUPPLIERS.CONTACT_NAME')}
                                    </Typography>
                                </TableSortLabel>
                            </TableCell>

                            <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                <TableSortLabel
                                    active={'Email' === orderBy}
                                    direction={orderBy === 'Email' ? order : 'asc'}
                                    onClick={() => handleSort('Email')}
                                    sx={{
                                        '& .MuiTableSortLabel-icon': {
                                            color: 'var(--text-color) !important'
                                        },
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center'
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
                                            ml: '8px',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {t('COMMON.SUPPLIERS.EMAIL')}
                                    </Typography>
                                </TableSortLabel>
                            </TableCell>

                            <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                <TableSortLabel
                                    active={'PhoneNumber' === orderBy}
                                    direction={orderBy === 'PhoneNumber' ? order : 'asc'}
                                    onClick={() => handleSort('PhoneNumber')}
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
                                            maxWidth: '400px',
                                            fontSize: '15px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {t('COMMON.SUPPLIERS.PHONE')}
                                    </Typography>
                                </TableSortLabel>
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
                                    {t('COMMON.SUPPLIERS.STATUS')}
                                </Typography>
                            </TableCell>

                            <TableCell sx={{ borderColor: 'var(--border-color)', padding: '16px 50px' }}>
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
                        {supplierData &&
                            supplierData.map((row: ISupplier, index: number) => (
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
                                            {row.supplierName}
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
                                            {row.contactName}
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
                                            {row.email}
                                        </Typography>
                                    </TableCell>

                                    <TableCell sx={{ borderColor: 'var(--border-color)', borderStyle: 'dashed' }}>
                                        <Typography
                                            sx={{
                                                color: 'var(--text-color)',
                                                fontSize: '15px',
                                                maxWidth: '280px',
                                                overflow: 'hidden',
                                                marginLeft: '40px',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {row.phoneNumber}
                                        </Typography>
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            borderStyle: 'dashed',
                                            borderColor: 'var(--border-color)',
                                            padding: '11px'
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                borderRadius: '9999px',
                                                padding: '7px 15px',
                                                border: getBorderColor(row.isPartner),
                                                display: 'flex',
                                                maxWidth: '200px',
                                                alignItems: 'center',
                                                gap: '10px',
                                                justifyContent: 'center',
                                                backgroundColor: getStatusBgColor(row.isPartner)
                                            }}
                                        >
                                            {row.isPartner ? (
                                                <CheckCircleIcon
                                                    style={{
                                                        width: 16,
                                                        height: 16,
                                                        marginRight: 1,
                                                        color: getStatusTextColor(row.isPartner)
                                                    }}
                                                />
                                            ) : (
                                                <XCircleIcon
                                                    style={{
                                                        width: 16,
                                                        height: 16,
                                                        marginRight: 1,
                                                        color: getStatusTextColor(row.isPartner)
                                                    }}
                                                />
                                            )}
                                            <Typography
                                                sx={{
                                                    fontSize: '13px',
                                                    overflow: 'hidden',
                                                    color: getStatusTextColor(row.isPartner),
                                                    width: 'auto',
                                                    fontWeight: 'bold',
                                                    display: 'inline-block',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {row.isPartner
                                                    ? t('COMMON.SUPPLIERS.PARTNER')
                                                    : t('COMMON.SUPPLIERS.NOT_PARTNER')}
                                            </Typography>
                                        </Box>
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            padding: '0px 25px 0px',
                                            borderColor: 'var(--border-color)',
                                            width: '146px',
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
                                                    onClick={() => handleClickDetail(row)}
                                                >
                                                    <EyeIcon size={16} color='#2563eb' />
                                                </Box>
                                            </Tooltip>

                                            {row.isPartner ? (
                                                <Tooltip title={t('COMMON.SUPPLIERS.PARTNER')}>
                                                    <Box
                                                        display='flex'
                                                        alignItems='center'
                                                        justifyContent='center'
                                                        sx={{
                                                            padding: '8px 12px',
                                                            cursor: 'pointer',
                                                            borderRadius: '8px',
                                                            backgroundColor: '#eafff5',
                                                            border: '1px solid #bcffe3',
                                                            '&:hover': {
                                                                backgroundColor: '#e0fff0',
                                                                borderColor: '#b2ffdf'
                                                            }
                                                        }}
                                                        onClick={() => handlePartnerClick(row.id)}
                                                    >
                                                        <ClipboardCheck size={16} color='#4eeaa9' />
                                                    </Box>
                                                </Tooltip>
                                            ) : (
                                                <Tooltip title={t('COMMON.SUPPLIERS.NOT_PARTNER')}>
                                                    <Box
                                                        display='flex'
                                                        alignItems='center'
                                                        justifyContent='center'
                                                        sx={{
                                                            padding: '8px 12px',
                                                            cursor: 'pointer',
                                                            borderRadius: '8px',
                                                            backgroundColor: '#ffe1ed',
                                                            border: '1px solid #ff9ed1c9',
                                                            '&:hover': {
                                                                backgroundColor: '#ffdae9',
                                                                borderColor: '#ff0085c9'
                                                            }
                                                        }}
                                                        onClick={() => handlePartnerClick(row.id)}
                                                    >
                                                        <ClipboardX size={16} color='#ff0085c9' />
                                                    </Box>
                                                </Tooltip>
                                            )}

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
                                                    onClick={() => handleButtonUpdateClick(row.id)}
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
                                                    onClick={() => handleDeleteClick(row.id)}
                                                >
                                                    <Trash2 size={16} color='#dc2626' />
                                                </Box>
                                            </Tooltip>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {typeAlert === 0 && (
                <AlertDialog
                    title={t('COMMON.ALERT_DIALOG.CONFIRM')}
                    isLoading={isLoadingDelete}
                    content={t('COMMON.ALERT_DIALOG.CONFIRM_DELETE')}
                    type='warning'
                    open={openDialog}
                    setOpen={setOpenDialog}
                    buttonCancel={t('COMMON.ALERT_DIALOG.CANCEL')}
                    buttonConfirm={t('COMMON.ALERT_DIALOG.DELETE')}
                    onConfirm={() => handleDeleteSupplier()}
                />
            )}

            {typeAlert === 1 && (
                <AlertDialog
                    title={t('COMMON.ALERT_DIALOG.CONFIRM')}
                    isLoading={isLoadingChange}
                    content={t('COMMON.SUPPLIERS.CONFIRM_UPDATE_PARTNER')}
                    type='warning'
                    open={openDialog}
                    setOpen={setOpenDialog}
                    buttonCancel={t('COMMON.ALERT_DIALOG.CANCEL')}
                    buttonConfirm={t('COMMON.ALERT_DIALOG.OK')}
                    onConfirm={() => handleChangePartner()}
                />
            )}

            {selectedSupplier && (
                <DetailModal
                    open={selectedSupplier !== null}
                    handleToggle={() => setSelectedSupplier(null)}
                    supplier={selectedSupplier}
                    handleDelete={() => handleDeleteClick(selectedSupplier.id)}
                />
            )}
        </>
    )
}

export default DataTable
