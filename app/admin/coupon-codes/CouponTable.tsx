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
    TableSortLabel
} from '@mui/material'
import { Badge } from '@/components/ui/badge'
import { ClipboardCheck, ClipboardX, Edit, EyeIcon, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import AlertDialog from '@/components/AlertDialog'
import { useChangeIsPartnerSupplierMutation, useChangeStatusSupplierMutation } from '@/services/SupplierService'
import { useToast } from '@/hooks/useToast'
import { ICoupon, ICouponCreate, ICouponFilter } from '@/models/Coupon'
import CouponDetailDialog from './DialogDetail'

function getStatusBgColor(row: ICoupon): string {
    if (isPastDate(row.expiryDate)) {
        return 'var(--background-color-cancel)'
    } else if (row.usageCount === row.usageLimit) {
        return 'var(--background-color-pending)'
    } else {
        return 'var(--background-color-success)'
    }
}

function getBorderColor(row: ICoupon): string {
    if (isPastDate(row.expiryDate)) {
        return '1px solid var(--border-color-cancel)'
    } else if (row.usageCount === row.usageLimit) {
        return '1px solid var(--border-color-pending)'
    } else {
        return '1px solid var(--border-color-success)'
    }
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount).replace('₫', 'VNĐ')
}

const isPastDate = (date: string): boolean => {
    const inputDate = new Date(date)

    if (isNaN(inputDate.getTime())) {
        return false // Trả về false nếu date không hợp lệ
    }

    const currentDate = new Date()

    // Set về đầu ngày để so sánh chính xác
    inputDate.setHours(0, 0, 0, 0)
    currentDate.setHours(0, 0, 0, 0)

    return inputDate < currentDate
}

function getStatusTextColor(row: ICoupon): string {
    if (isPastDate(row.expiryDate)) {
        return 'var(--text-color-cancel)'
    } else if (row.usageCount === row.usageLimit) {
        return 'var(--text-color-pending)'
    } else {
        return 'var(--text-color-success)'
    }
}

interface IProps {
    data: ICoupon[]
    refetch: () => void
    setFilter: React.Dispatch<React.SetStateAction<ICouponFilter>>
}

interface Order {
    id: number
    orderCode: string
    customerName: string
    orderDate: string
    totalAmount: number
    discountAmount: number
    couponCode: string
}

// Dữ liệu mẫu
const dummyOrders: Order[] = [
    {
        id: 1,
        orderCode: 'ORD12345',
        customerName: 'Nguyễn Văn A',
        orderDate: '2025-03-10',
        totalAmount: 450000,
        discountAmount: 67500,
        couponCode: 'SUMMER2025'
    },
    {
        id: 2,
        orderCode: 'ORD12346',
        customerName: 'Trần Thị B',
        orderDate: '2025-03-08',
        totalAmount: 550000,
        discountAmount: 50000,
        couponCode: 'WELCOME50K'
    },
    {
        id: 3,
        orderCode: 'ORD12347',
        customerName: 'Lê Văn C',
        orderDate: '2025-03-07',
        totalAmount: 320000,
        discountAmount: 80000,
        couponCode: 'NEWYEAR25'
    }
]

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
    const [changeStatusSupplierMutation, { isLoading: isLoadingDelete }] = useChangeStatusSupplierMutation()
    const [changePartner, { isLoading: isLoadingChange }] = useChangeIsPartnerSupplierMutation()
    const [coupon, setCoupon] = useState<ICoupon | null>(null)
    const [orders, setOrders] = useState<Order[]>(dummyOrders)

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

    // Tìm đơn hàng liên quan đến mã giảm giá
    const getCouponOrders = (couponCode: string) => {
        return orders.filter(order => order.couponCode === couponCode)
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

    const handleClickDetail = (row: ICoupon) => {
        setCoupon(row)
    }

    const handleChangePartner = async () => {
        if (selectedChangeId) {
            try {
                await changePartner(selectedChangeId).unwrap()
                refetch()
                toast(t('COMMON.SUPPLIERS.UPDATE_PARTNER_SUCCESS'), 'success')
            } catch (error) {
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
            } catch (error) {
                toast(t('COMMON.SUPPLIERS.DELETE_SUPPLIER_FAIL'), 'error')
            }
        }
        setOpenDialog(false)
        setSelectedDeleteId(null)
        setCoupon(null)
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
                                        {t('COMMON.COUPON.COUPON_CODE')}
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
                                    {t('COMMON.COUPON.DISCOUNT_TYPE')}
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
                                    {t('COMMON.COUPON.DISCOUNT_VALUE')}
                                </Typography>
                            </TableCell>

                            <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                <TableSortLabel
                                    active={'MaximumDiscount' === orderBy}
                                    direction={orderBy === 'MaximumDiscount' ? order : 'asc'}
                                    onClick={() => handleSort('MaximumDiscount')}
                                    sx={{
                                        '& .MuiTableSortLabel-icon': {
                                            color: 'var(--text-color) !important'
                                        },
                                        display: 'flex',
                                        justifyContent: 'left',
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
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {t('COMMON.COUPON.MAXIMUM_DISCOUNT')}
                                    </Typography>
                                </TableSortLabel>
                            </TableCell>

                            <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                <TableSortLabel
                                    active={'MinimumOrderValue' === orderBy}
                                    direction={orderBy === 'MinimumOrderValue' ? order : 'asc'}
                                    onClick={() => handleSort('MinimumOrderValue')}
                                    sx={{
                                        '& .MuiTableSortLabel-icon': {
                                            color: 'var(--text-color) !important'
                                        },
                                        display: 'flex',
                                        justifyContent: 'left',
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
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {t('COMMON.COUPON.MINIMUM_ORDER_VALUE')}
                                    </Typography>
                                </TableSortLabel>
                            </TableCell>

                            <TableCell sx={{ borderColor: 'var(--border-color)', padding: '16px 30px 16px 16px' }}>
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
                                        {t('COMMON.COUPON.EXPIRED')}
                                    </Typography>
                                </TableSortLabel>
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
                                    {t('COMMON.COUPON.STATUS')}
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
                        {data &&
                            data.map((row: ICoupon, index: number) => (
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
                                                {row.couponCode}
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
                                                {t('COMMON.COUPON.START_DATE')}
                                                {': '}
                                                {new Date(row.activationDate).toLocaleDateString('vi-VN')}
                                            </Typography>
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
                                                fontSize: '15px',
                                                maxWidth: '280px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {row.discountType === 'percentage' ? (
                                                <Badge
                                                    style={{
                                                        backgroundColor: 'var(--discount-color-type-percentage)',
                                                        color: 'var(--discount-text-color-type-percentage)',
                                                        border: '1px solid var(--discount-border-color-type-percentage)',
                                                        padding: '8px 12px',
                                                        fontSize: '13px'
                                                    }}
                                                >
                                                    {t('COMMON.COUPON.PERCENTAGE')}
                                                </Badge>
                                            ) : (
                                                <Badge
                                                    style={{
                                                        backgroundColor: 'var(--discount-color-type-fixed)',
                                                        color: 'var(--discount-text-color-type-fixed)',
                                                        border: '1px solid var(--discount-border-color-type-fixed)',
                                                        padding: '8px 12px',
                                                        fontSize: '13px'
                                                    }}
                                                >
                                                    {t('COMMON.COUPON.FIXED_AMOUNT')}
                                                </Badge>
                                            )}
                                        </Box>
                                    </TableCell>

                                    <TableCell sx={{ borderColor: 'var(--border-color)', borderStyle: 'dashed' }}>
                                        {row.discountType === 'percentage' ? (
                                            <Typography
                                                sx={{
                                                    color: 'var(--discount-color-percentage)',
                                                    fontSize: '15px',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                {row.discountValue}%
                                            </Typography>
                                        ) : (
                                            <Typography
                                                sx={{
                                                    color: 'var(--discount-color-fixed)',
                                                    fontSize: '15px',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                {formatCurrency(row.discountValue)}
                                            </Typography>
                                        )}
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
                                            {formatCurrency(row.minimumOrderValue)}
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
                                            {formatCurrency(row.maximumDiscount)}
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
                                        {new Date(row.expiryDate).toLocaleDateString('vi-VN', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric'
                                        })}
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            borderStyle: 'dashed',
                                            borderColor: 'var(--border-color)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                borderRadius: '9999px',
                                                padding: '7px 15px',
                                                border: getBorderColor(row),
                                                display: 'flex',
                                                maxWidth: '130px',
                                                minWidth: '120px',
                                                justifyContent: 'center',
                                                backgroundColor: getStatusBgColor(row)
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    fontSize: '13px',
                                                    overflow: 'hidden',
                                                    color: getStatusTextColor(row),
                                                    width: 'auto',
                                                    fontWeight: 'bold',
                                                    display: 'inline-block',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {row.usageCount === row.usageLimit
                                                    ? t('COMMON.COUPON.LIMIT_REACHED')
                                                    : isPastDate(row.expiryDate)
                                                    ? t('COMMON.COUPON.EXPIRED')
                                                    : t('COMMON.COUPON.ACTIVE')}
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

            {coupon && <CouponDetailDialog isOpen={coupon !== null} onClose={() => setCoupon(null)} coupon={coupon} />}
        </>
    )
}

export default DataTable
