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
import { BadgeCheckIcon, CheckCircleIcon, EyeIcon, StarIcon, Trash2, XCircleIcon } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import AlertDialog from '@/components/AlertDialog'
import { ICustomer, ICustomerFilter } from '@/models/Customer'
import { formatCurrency } from '@/common/format'

function getStatusBgColor(status: boolean): string {
    if (!status) {
        return 'var(--background-color-cancel)'
    } else {
        return 'var(--background-color-success)'
    }
}

function getBorderColor(status: boolean): string {
    if (!status) {
        return '1px solid var(--border-color-cancel)'
    } else {
        return '1px solid var(--border-color-success)'
    }
}

function getStatusTextColor(status: boolean): string {
    if (!status) {
        return 'var(--text-color-cancel)'
    } else {
        return 'var(--text-color-success)'
    }
}
interface IProps {
    data: ICustomer[]
    refetch: () => void
    setFilter: React.Dispatch<React.SetStateAction<ICustomerFilter>>
}

function DataTable({ data, setFilter }: IProps) {
    const { t } = useTranslation('common')
    const router = useRouter()
    const [order, setOrder] = useState<'asc' | 'desc'>('asc')
    const [orderBy, setOrderBy] = useState<string>('')
    const [openDialog, setOpenDialog] = useState(false)
    const [typeAlert, setTypeAlert] = useState<number | null>(null)

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

    const handleDeleteClick = async () => {
        setTypeAlert(0)
        setOpenDialog(true)
    }

    const getRankBadge = (rank: string) => {
        switch (rank) {
            case 'gold':
                return (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            whiteSpace: 'nowrap',
                            gap: '5px',
                            padding: '8px 14px',
                            color: 'white',
                            fontSize: '13px',
                            borderRadius: '9999px',
                            fontWeight: 'bold',
                            backgroundColor: 'var(--background-color-pending-selected)'
                        }}
                    >
                        <StarIcon
                            style={{
                                width: '17px',
                                height: '17px',
                                marginRight: '8px'
                            }}
                        />
                        {t('COMMON.CUSTOMER.GOLD_CUSTOMER')}
                    </Box>
                )
            case 'silver':
                return (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '8px 14px',
                            color: '#fff',
                            whiteSpace: 'nowrap',
                            fontSize: '13px',
                            borderRadius: '9999px',
                            fontWeight: 'bold',
                            backgroundColor: 'var(--background-color-silver-selected)'
                        }}
                    >
                        <StarIcon
                            style={{
                                width: '17px',
                                height: '17px',
                                marginRight: '8px'
                            }}
                        />
                        {t('COMMON.CUSTOMER.SILVER_CUSTOMER')}
                    </Box>
                )
            default:
                return (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '8px 14px',
                            color: 'white',
                            fontSize: '13px',
                            whiteSpace: 'nowrap',
                            borderRadius: '9999px',
                            fontWeight: 'bold',
                            backgroundColor: 'var(--background-color-success-selected)'
                        }}
                    >
                        <BadgeCheckIcon
                            style={{
                                width: '17px',
                                height: '17px',
                                marginRight: '8px'
                            }}
                        />
                        {t('COMMON.CUSTOMER.NEW_CUSTOMER')}
                    </Box>
                )
        }
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
                            <TableCell sx={{ padding: '16px 30px 16px 24px' }}>
                                <TableSortLabel
                                    active={'CouponCode' === orderBy}
                                    direction={orderBy === 'CouponCode' ? order : 'asc'}
                                    onClick={() => handleSort('CouponCode')}
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
                                        {t('COMMON.CUSTOMER.FULL_NAME')}
                                    </Typography>
                                </TableSortLabel>
                            </TableCell>

                            <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                <Typography
                                    sx={{
                                        fontWeight: 'bold',
                                        color: 'var(--text-color)',
                                        fontSize: '15px',
                                        minWidth: '120px',
                                        maxWidth: '280px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {t('COMMON.CUSTOMER.PHONE')}
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
                                    {t('COMMON.CUSTOMER.EMAIL')}
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
                                    {t('COMMON.CUSTOMER.BIRTHDAY')}
                                </Typography>
                            </TableCell>

                            <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                <TableSortLabel
                                    active={'TotalSpent' === orderBy}
                                    direction={orderBy === 'TotalSpent' ? order : 'asc'}
                                    onClick={() => handleSort('TotalSpent')}
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
                                        {t('COMMON.CUSTOMER.TOTAL_SPENT')}
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
                                    {t('COMMON.CUSTOMER.RANK')}
                                </Typography>
                            </TableCell>

                            <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                <Typography
                                    sx={{
                                        fontWeight: 'bold',
                                        color: 'var(--text-color)',
                                        fontSize: '15px',
                                        minWidth: '70px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {t('COMMON.CUSTOMER.GENDER')}
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
                                    {t('COMMON.CUSTOMER.ADDRESS')}
                                </Typography>
                            </TableCell>

                            <TableCell sx={{ padding: '16px 30px 16px 16px' }}>
                                <TableSortLabel
                                    active={'ExpiryDate' === orderBy}
                                    direction={orderBy === 'ExpiryDate' ? order : 'asc'}
                                    onClick={() => handleSort('ExpiryDate')}
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
                                        {t('COMMON.CUSTOMER.CREATED_AT')}
                                    </Typography>
                                </TableSortLabel>
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
                                    {t('COMMON.COUPON.STATUS')}
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
                            data.map((row: ICustomer, index: number) => (
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
                                        <Box display='flex' alignItems='center' gap='10px'>
                                            <Avatar
                                                sx={{
                                                    width: '40px',
                                                    height: '40px',
                                                    borderRadius: '50%'
                                                }}
                                                src={row.avatar}
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
                                                        color: 'var(--primary-color)'
                                                    }}
                                                >
                                                    {row.fullName}
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
                                                    {row.username}
                                                </Typography>
                                            </Box>
                                        </Box>
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
                                            {row.phoneNumber}
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

                                    <TableCell
                                        sx={{
                                            borderColor: 'var(--border-color)',
                                            borderStyle: 'dashed',
                                            color: 'var(--text-color)',
                                            fontSize: '15px'
                                        }}
                                    >
                                        {new Date(row.birthday).toLocaleDateString('vi-VN', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric'
                                        })}
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            borderColor: 'var(--border-color)',
                                            borderStyle: 'dashed',
                                            pr: '24px'
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontSize: '15px',
                                                overflow: 'hidden',
                                                fontWeight: 'bold',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                color: '#00B85E'
                                            }}
                                        >
                                            {formatCurrency(row.totalSpent)}
                                        </Typography>
                                    </TableCell>

                                    <TableCell sx={{ borderColor: 'var(--border-color)', borderStyle: 'dashed' }}>
                                        {getRankBadge(row.rank)}
                                    </TableCell>

                                    <TableCell sx={{ borderColor: 'var(--border-color)', borderStyle: 'dashed' }}>
                                        <Typography
                                            sx={{
                                                color: 'var(--text-color)',
                                                fontSize: '15px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {row.gender ? t('COMMON.MALE') : t('COMMON.FEMALE')}
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
                                            {row.address}
                                        </Typography>
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            borderColor: 'var(--border-color)',
                                            borderStyle: 'dashed',
                                            color: 'var(--text-color)',
                                            fontSize: '15px'
                                        }}
                                    >
                                        {new Date(row.createdAt).toLocaleDateString('vi-VN', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric'
                                        })}
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
                                                display: 'flex',
                                                margin: '0 auto',
                                                maxWidth: '170px',
                                                alignItems: 'center',
                                                gap: '10px',
                                                justifyContent: 'center',
                                                border: getBorderColor(row.isActive),
                                                backgroundColor: getStatusBgColor(row.isActive)
                                            }}
                                        >
                                            {row.isActive ? (
                                                <CheckCircleIcon
                                                    style={{
                                                        width: 16,
                                                        height: 16,
                                                        marginRight: 1,
                                                        color: getStatusTextColor(row.isActive)
                                                    }}
                                                />
                                            ) : (
                                                <XCircleIcon
                                                    style={{
                                                        width: 16,
                                                        height: 16,
                                                        marginRight: 1,
                                                        color: getStatusTextColor(row.isActive)
                                                    }}
                                                />
                                            )}
                                            <Typography
                                                sx={{
                                                    fontSize: '13px',
                                                    overflow: 'hidden',
                                                    color: getStatusTextColor(row.isActive),
                                                    width: 'auto',
                                                    fontWeight: 'bold',
                                                    display: 'inline-block',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {row.isActive
                                                    ? t('COMMON.CUSTOMER.ACTIVE')
                                                    : t('COMMON.CUSTOMER.INACTIVE')}
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
                                                        router.push(`/admin/customers/detail?id=${row.id}`)
                                                    }}
                                                >
                                                    <EyeIcon size={16} color='#2563eb' />
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
                                                    onClick={() => handleDeleteClick()}
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
                    isLoading={false}
                    content={t('COMMON.ALERT_DIALOG.CONFIRM_DELETE')}
                    type='warning'
                    open={openDialog}
                    setOpen={setOpenDialog}
                    buttonCancel={t('COMMON.ALERT_DIALOG.CANCEL')}
                    buttonConfirm={t('COMMON.ALERT_DIALOG.DELETE')}
                    onConfirm={() => handleDeleteClick()}
                />
            )}
        </>
    )
}

export default DataTable
