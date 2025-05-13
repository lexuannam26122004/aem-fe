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
import { BadgeCheckIcon, CheckCircleIcon, Edit, EyeIcon, StarIcon, Trash2, XCircleIcon } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import AlertDialog from '@/components/AlertDialog'
import { useToast } from '@/hooks/useToast'
import { IOrder, IOrderFilter } from '@/models/Order'
import { formatCurrency } from '@/common/format'

function getStatusBgColor(status: string): string {
    if (status === 'cancelled') {
        return 'var(--background-color-cancel-selected)'
    } else if (status === 'delivered') {
        return 'var(--background-color-success-selected)'
    } else if (status === 'pending') {
        return 'var(--background-color-pending-selected)'
    } else if (status === 'returned') {
        return 'var(--background-color-silver-selected)'
    } else if (status === 'processing') {
        return 'var(--background-color-pink-selected)'
    } else {
        return 'var(--background-color-blue-selected)'
    }
}

function getBorderColor(status: string): string {
    if (status === 'cancelled') {
        return 'var(--border-color-cancel-selected)'
    } else if (status === 'delivered') {
        return 'var(--border-color-success-selected)'
    } else if (status === 'pending') {
        return 'var(--border-color-pending-selected)'
    } else if (status === 'returned') {
        return 'var(--border-color-silver-selected)'
    } else if (status === 'processing') {
        return 'var(--border-color-pink-selected)'
    } else {
        return 'var(--border-color-blue-selected)'
    }
}

function getStatusTextColor(status: string): string {
    if (status === 'cancelled') {
        return 'var(--text-color-cancel-selected)'
    } else if (status === 'delivered') {
        return 'var(--text-color-success-selected)'
    } else if (status === 'pending') {
        return 'var(--text-color-pending-selected)'
    } else if (status === 'returned') {
        return 'var(--text-color-silver-selected)'
    } else if (status === 'processing') {
        return 'var(--text-color-pink-selected)'
    } else {
        return 'var(--text-color-blue-selected)'
    }
}

const avatars = [
    'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-1.webp',
    'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-2.webp',
    'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-3.webp',
    'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-4.webp',
    'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-5.webp',
    'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-6.webp',
    'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-7.webp',
    'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-8.webp',
    'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-9.webp',
    'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-10.webp',
    'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-11.webp',
    'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-12.webp',
    'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-13.webp',
    'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-14.webp',
    'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-15.webp',
    'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-16.webp',
    'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-17.webp',
    'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-18.webp',
    'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-19.webp'
]

interface IProps {
    data: IOrder[]
    refetch: () => void
    setFilter: React.Dispatch<React.SetStateAction<IOrderFilter>>
}

function DataTable({ data, setFilter, refetch }: IProps) {
    const { t } = useTranslation('common')
    const router = useRouter()
    const toast = useToast()
    const [order, setOrder] = useState<'asc' | 'desc'>('asc')
    const [orderBy, setOrderBy] = useState<string>('')
    const [openDialog, setOpenDialog] = useState(false)
    const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null)
    const [selectedChangeId, setSelectedChangeId] = useState<number | null>(null)
    const [typeAlert, setTypeAlert] = useState<number | null>(null)

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

    const handleDeleteSupplier = async () => {
        if (selectedDeleteId) {
            try {
                // await changeStatusSupplierMutation(selectedDeleteId).unwrap()
                refetch()
                toast(t('COMMON.SUPPLIERS.DELETE_SUPPLIER_SUCCESS'), 'success')
            } catch (error) {
                toast(t('COMMON.SUPPLIERS.DELETE_SUPPLIER_FAIL'), 'error')
            }
        }
        setOpenDialog(false)
        setSelectedDeleteId(null)
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
                                            maxWidth: '300px',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {t('COMMON.ORDER.ORDER_CODE')}
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
                                        maxWidth: '280px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {t('COMMON.ORDER.CUSTOMER')}
                                </Typography>
                            </TableCell>

                            <TableCell sx={{ padding: '16px 30px 16px 16px' }}>
                                <TableSortLabel
                                    active={'OrderDate' === orderBy}
                                    direction={orderBy === 'OrderDate' ? order : 'asc'}
                                    onClick={() => handleSort('OrderDate')}
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
                                        {t('COMMON.ORDER.ORDER_DATE')}
                                    </Typography>
                                </TableSortLabel>
                            </TableCell>

                            <TableCell sx={{ borderColor: 'var(--border-color)' }}>
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
                                    {t('COMMON.ORDER.ITEMS')}
                                </Typography>
                            </TableCell>

                            <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                <Typography
                                    sx={{
                                        fontWeight: 'bold',
                                        color: 'var(--text-color)',
                                        fontSize: '15px',
                                        maxWidth: '280px',
                                        minWidth: '120px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {t('COMMON.ORDER.TOTAL')}
                                </Typography>
                            </TableCell>

                            <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                <Typography
                                    sx={{
                                        fontWeight: 'bold',
                                        color: 'var(--text-color)',
                                        fontSize: '15px',
                                        maxWidth: '280px',
                                        minWidth: '120px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {t('COMMON.ORDER.PAYMENT_METHOD')}
                                </Typography>
                            </TableCell>

                            <TableCell sx={{ padding: '16px 50px' }}>
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
                                    {t('COMMON.ORDER.STATUS')}
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
                        {data &&
                            data.map((row: IOrder, index: number) => (
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
                                                maxWidth: '280px',
                                                overflow: 'hidden',
                                                fontWeight: 'bold',
                                                textDecoration: 'underline',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => {
                                                router.push(`/admin/orders/detail?id=${row.id}`)
                                            }}
                                        >
                                            #{row.orderCode}
                                        </Typography>
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            borderColor: 'var(--border-color)',
                                            paddingRight: '24px',
                                            borderStyle: 'dashed'
                                        }}
                                    >
                                        <Box display='flex' alignItems='center' gap='15px'>
                                            <Avatar
                                                sx={{
                                                    width: '40px',
                                                    height: '40px',
                                                    borderRadius: '50%'
                                                }}
                                                src={row.avatarPath || avatars[index]}
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
                                                        color: 'var(--text-color)'
                                                    }}
                                                >
                                                    {row.customerName}
                                                </Typography>

                                                <Typography
                                                    sx={{
                                                        color: 'var(--label-title-color)',
                                                        fontSize: '12px',
                                                        maxWidth: '280px',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    }}
                                                >
                                                    {row.customerPhone}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            borderColor: 'var(--border-color)',
                                            borderStyle: 'dashed'
                                        }}
                                    >
                                        <Box>
                                            <Typography
                                                sx={{
                                                    color: 'var(--text-color)',
                                                    fontSize: '15px'
                                                }}
                                            >
                                                {new Date(row.orderDate).toLocaleDateString('vi-VN', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric'
                                                })}
                                            </Typography>

                                            <Typography
                                                sx={{
                                                    color: 'var(--label-title-color)',
                                                    fontSize: '12px'
                                                }}
                                            >
                                                {new Date(row.orderDate).toLocaleString('vi-VN', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    hour12: false
                                                })}
                                            </Typography>
                                        </Box>
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
                                            {row.itemCount}
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
                                            {formatCurrency(row.totalAmount)}
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
                                            {row.paymentMethod}
                                        </Typography>
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
                                                border: getBorderColor(row.orderStatus),
                                                display: 'flex',
                                                margin: '0 auto',
                                                width: '105px',
                                                alignItems: 'center',
                                                gap: '10px',
                                                justifyContent: 'center',
                                                backgroundColor: getStatusBgColor(row.orderStatus)
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    fontSize: '13px',
                                                    overflow: 'hidden',
                                                    color: getStatusTextColor(row.orderStatus),
                                                    fontWeight: 'bold',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {row.orderStatus === 'pending' && t('COMMON.ORDER.PENDING')}
                                                {row.orderStatus === 'returned' && t('COMMON.ORDER.RETURNED')}
                                                {row.orderStatus === 'processing' && t('COMMON.ORDER.PROCESSING')}
                                                {row.orderStatus === 'shipping' && t('COMMON.ORDER.SHIPPING')}
                                                {row.orderStatus === 'delivered' && t('COMMON.ORDER.DELIVERED')}
                                                {row.orderStatus === 'cancelled' && t('COMMON.ORDER.CANCELLED')}
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
                                                    onClick={() => {
                                                        router.push(`/admin/orders/detail?id=${row.id}`)
                                                    }}
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

            {/* {typeAlert === 0 && (
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
            )} */}
        </>
    )
}

export default DataTable
