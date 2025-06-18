'use client'

import React from 'react'
import { Truck, Package, NotepadText, Banknote, Star, Printer, Hourglass } from 'lucide-react'
import { IOrderDetail } from '@/models/Order'
import {
    Avatar,
    Box,
    Button,
    Divider,
    FormControl,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    TextField,
    Typography
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import { formatCurrency } from '@/common/format'
import { useGetByIdOrderQuery, useUpdateDeliveryMutation, useUpdateOrderStatusMutation } from '@/services/OrderService'
import { usePathname } from 'next/navigation'
import Loading from '@/components/Loading'
import EmptyState from '@/components/EmptyState'
import SaveAsIcon from '@mui/icons-material/SaveAs'
import { useToast } from '@/hooks/useToast'
import AlertDialog from './AlertDialog'

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

export default function OrderDetailPage() {
    const { t } = useTranslation('common')
    const [shipBy, setShipBy] = React.useState('')
    const toast = useToast()
    const [tempStatus, setTempStatus] = React.useState('')
    const [openDialog, setOpenDialog] = React.useState(false)
    const [speedyDelivery, setSpeedyDelivery] = React.useState('')
    const [trackingCode, setTrackingCode] = React.useState('')
    const [isEditDelivery, setIsEditDelivery] = React.useState(false)
    const [updateOrderStatus] = useUpdateOrderStatusMutation()
    const [updateDelivery] = useUpdateDeliveryMutation()
    const pathName = usePathname()
    const orderId = String(pathName.split('/').pop())
    const { data: orderDetailResponse, isLoading, error: errorOrderDetail, refetch } = useGetByIdOrderQuery(orderId)

    const orderDetail: IOrderDetail = orderDetailResponse?.data

    const handleUpdateDelivery = async () => {
        await updateDelivery({ orderCode: orderId, deliveryInfo: { shipBy, speedyDelivery, trackingCode } })
            .unwrap()
            .then(() => {
                toast('Cập nhật thông tin giao hàng thành công', 'success')
                return refetch()
            })
            .catch(() => {
                toast('Cập nhật thông tin giao hàng thất bại', 'error')
            })
    }

    const handleUpdateOrderStatus = async (dateTime?: string) => {
        await updateOrderStatus({ orderCode: orderId, status: tempStatus, dateTime })
            .unwrap()
            .then(() => {
                toast('Cập nhật trạng thái đơn hàng thành công', 'success')
                setOpenDialog(false)
                return refetch()
            })
            .catch(() => {
                toast('Cập nhật trạng thái đơn hàng thất bại', 'error')
            })
    }

    if (isLoading) {
        return <Loading />
    }

    const step =
        !orderDetail?.paymentTime && orderDetail?.orderStatus === 'pending'
            ? 1
            : !orderDetail?.carrierDeliveryTime
            ? 2
            : !orderDetail?.deliveryTime
            ? 3
            : !orderDetail?.reviewTime
            ? 4
            : 0

    if (errorOrderDetail) {
        return (
            <div className='mt-24'>
                <EmptyState />
            </div>
        )
    }

    return (
        <>
            <Box
                sx={{
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        mb: '24px',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            gap: '25px',
                            alignItems: 'center'
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
                                {t('COMMON.ORDER.ORDER')} #{orderDetail.orderCode}
                            </Typography>
                            <Typography
                                sx={{
                                    color: 'var(--label-title-color)',
                                    fontSize: '15px',
                                    marginLeft: '5px'
                                }}
                            >
                                {new Date(orderDetail.orderDate).toLocaleDateString('vi-VN', {
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
                                borderRadius: '9999px',
                                padding: '7px 15px',
                                border: getBorderColor(orderDetail.orderStatus),
                                display: 'flex',
                                margin: '0 auto',
                                width: '105px',
                                alignItems: 'center',
                                gap: '10px',
                                justifyContent: 'center',
                                backgroundColor: getStatusBgColor(orderDetail.orderStatus)
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: '13px',
                                    overflow: 'hidden',
                                    color: getStatusTextColor(orderDetail.orderStatus),
                                    fontWeight: 'bold',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {orderDetail.orderStatus === 'pending' && t('COMMON.ORDER.PENDING')}
                                {orderDetail.orderStatus === 'returned' && t('COMMON.ORDER.RETURNED')}
                                {orderDetail.orderStatus === 'processing' && t('COMMON.ORDER.PROCESSING')}
                                {orderDetail.orderStatus === 'shipping' && t('COMMON.ORDER.SHIPPING')}
                                {orderDetail.orderStatus === 'delivered' && t('COMMON.ORDER.DELIVERED')}
                                {orderDetail.orderStatus === 'cancelled' && t('COMMON.ORDER.CANCELLED')}
                            </Typography>
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            gap: '20px',
                            alignItems: 'center'
                        }}
                    >
                        <Box
                            sx={{
                                flex: 1
                            }}
                        >
                            <FormControl
                                sx={{
                                    width: '100%',
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
                                    }
                                }}
                            >
                                <Select
                                    value={orderDetail.orderStatus}
                                    onChange={e => {
                                        setOpenDialog(true)
                                        setTempStatus(e.target.value)
                                    }}
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
                                            minWidth: '100px',
                                            color: 'var(--text-color)',
                                            padding: '9px 14px'
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
                                        value='processing'
                                        sx={{
                                            mt: '3px',
                                            borderRadius: '6px'
                                        }}
                                    >
                                        {t('COMMON.ORDER.PROCESSING')}
                                    </MenuItem>

                                    <MenuItem
                                        value='shipping'
                                        sx={{
                                            mt: '3px',
                                            borderRadius: '6px'
                                        }}
                                    >
                                        {t('COMMON.ORDER.SHIPPING')}
                                    </MenuItem>

                                    <MenuItem
                                        value='delivered'
                                        sx={{
                                            mt: '3px',
                                            borderRadius: '6px'
                                        }}
                                    >
                                        {t('COMMON.ORDER.DELIVERED')}
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

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

                        {/* <Button
                            startIcon={<SquareCheckBig size={20} color='var(--text-color-button-cancel)' />}
                            disabled={orderDetail.isConfirmed}
                            sx={{
                                textTransform: 'none',
                                padding: '7px 20px',
                                borderRadius: '10px',
                                ':disabled': {
                                    color: 'var(--text-color-button-cancel)',
                                    opacity: 0.8
                                },
                                fontSize: '15px',
                                fontWeight: 'bold',
                                backgroundColor: 'var(--background-color-button-cancel)',
                                width: 'auto',
                                '&:hover': {
                                    backgroundColor: 'var(--background-color-button-cancel-hover)'
                                },
                                color: 'var(--text-color-button-cancel)'
                            }}
                        >
                            {orderDetail.isConfirmed ? t('COMMON.ORDER.CONFIRMED') : t('COMMON.ORDER.CONFIRM')}
                        </Button> */}
                    </Box>
                </Box>

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: '2fr 1fr',
                        gap: '24px'
                    }}
                >
                    <Box>
                        <Paper
                            sx={{
                                borderRadius: '15px',
                                padding: '24px',
                                backgroundColor: 'var(--background-color-item)'
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography
                                    sx={{
                                        color: 'var(--text-color)',
                                        fontWeight: 'bold',
                                        fontSize: '18px',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                                >
                                    {t('COMMON.ORDER.DETAIL')}
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    width: '100%',
                                    mt: '18px'
                                }}
                            >
                                {orderDetail.items.map((item, index) => {
                                    return (
                                        <Box
                                            key={index}
                                            sx={{
                                                display: 'flex',
                                                width: '100%',
                                                alignItems: 'center',
                                                mt: index !== 0 ? '20px' : 0
                                            }}
                                        >
                                            <Avatar
                                                src={item.image}
                                                sx={{
                                                    width: '60px',
                                                    height: '60px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderRadius: '10px',
                                                    mr: '20px'
                                                }}
                                            />

                                            <Box
                                                sx={{
                                                    width: '60%'
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        color: 'var(--text-color)',
                                                        maxWidth: '100%',
                                                        fontSize: '15px'
                                                    }}
                                                >
                                                    {item.productName}
                                                </Typography>

                                                <Typography
                                                    sx={{
                                                        color: 'var(--label-title-color)',
                                                        mt: '4px',
                                                        fontSize: '13px'
                                                    }}
                                                >
                                                    {item.sku}
                                                </Typography>

                                                <Typography
                                                    sx={{
                                                        color: 'var(--label-title-color)',
                                                        mt: '4px',
                                                        fontSize: '13px'
                                                    }}
                                                >
                                                    {item.variants}
                                                </Typography>
                                            </Box>

                                            <Typography
                                                sx={{
                                                    fontSize: '15px',
                                                    width: '5%',
                                                    textAlign: 'right',
                                                    color: 'var(--text-color)'
                                                }}
                                            >
                                                x{item.quantity}
                                            </Typography>

                                            <Typography
                                                sx={{
                                                    fontWeight: 'bold',
                                                    fontSize: '15px',
                                                    color: 'var(--text-color)',
                                                    marginLeft: 'auto'
                                                }}
                                            >
                                                {formatCurrency(item.price)}
                                            </Typography>
                                        </Box>
                                    )
                                })}
                            </Box>

                            <Divider
                                sx={{
                                    borderColor: 'var(--border-color)',
                                    mt: '24px',
                                    borderWidth: '1px',
                                    mx: '-24px',
                                    borderStyle: 'dashed'
                                }}
                            />

                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '16px',
                                    mt: '24px',
                                    alignItems: 'right'
                                }}
                            >
                                <TableContainer>
                                    <Table>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell
                                                    sx={{
                                                        border: 'none',
                                                        padding: '10px 0',
                                                        textAlign: 'right'
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            fontSize: '15px',
                                                            color: 'var(--label-title-color)'
                                                        }}
                                                    >
                                                        {t('COMMON.ORDER.SUBTOTAL')}
                                                    </Typography>
                                                </TableCell>

                                                <TableCell
                                                    sx={{
                                                        border: 'none',
                                                        padding: '10px 0'
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            fontWeight: 'bold',
                                                            fontSize: '15px',
                                                            color: 'var(--text-color)',
                                                            textAlign: 'right'
                                                        }}
                                                    >
                                                        {formatCurrency(orderDetail.subTotal)}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>

                                            <TableRow>
                                                <TableCell
                                                    sx={{
                                                        border: 'none',
                                                        padding: '10px 0',
                                                        textAlign: 'right'
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            fontSize: '15px',
                                                            color: 'var(--label-title-color)'
                                                        }}
                                                    >
                                                        {t('COMMON.ORDER.SHIPPING_FEE')}
                                                    </Typography>
                                                </TableCell>

                                                <TableCell
                                                    sx={{
                                                        border: 'none',
                                                        padding: '10px 0'
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            fontWeight: 'bold',
                                                            fontSize: '15px',
                                                            color: 'var(--text-color)',
                                                            textAlign: 'right'
                                                        }}
                                                    >
                                                        {formatCurrency(orderDetail.shippingFee)}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>

                                            <TableRow>
                                                <TableCell
                                                    sx={{
                                                        border: 'none',
                                                        padding: '10px 0',
                                                        textAlign: 'right'
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            fontSize: '15px',
                                                            color: 'var(--label-title-color)'
                                                        }}
                                                    >
                                                        {t('COMMON.ORDER.DISCOUNT_SHIPPING_FEE')}
                                                    </Typography>
                                                </TableCell>

                                                <TableCell
                                                    sx={{
                                                        border: 'none',
                                                        padding: '10px 0'
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            fontWeight: 'bold',
                                                            color: '#ff5630',
                                                            fontSize: '15px',
                                                            textAlign: 'right'
                                                        }}
                                                    >
                                                        {orderDetail.discountShippingFee &&
                                                        orderDetail.discountShippingFee >= 0
                                                            ? '-'
                                                            : ''}
                                                        {formatCurrency(orderDetail.discountShippingFee || 0)}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>

                                            <TableRow>
                                                <TableCell
                                                    sx={{
                                                        border: 'none',
                                                        padding: '10px 0',
                                                        textAlign: 'right'
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            fontSize: '15px',
                                                            color: 'var(--label-title-color)'
                                                        }}
                                                    >
                                                        {t('COMMON.ORDER.DISCOUNT_AMOUNT')}
                                                    </Typography>
                                                </TableCell>

                                                <TableCell
                                                    sx={{
                                                        border: 'none',
                                                        padding: '10px 0'
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            fontWeight: 'bold',
                                                            color: '#ff5630',
                                                            fontSize: '15px',
                                                            textAlign: 'right'
                                                        }}
                                                    >
                                                        {orderDetail.discountAmount && orderDetail.discountAmount >= 0
                                                            ? '-'
                                                            : ''}
                                                        {formatCurrency(orderDetail.discountAmount || 0)}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>

                                            <TableRow>
                                                <TableCell
                                                    sx={{
                                                        border: 'none',
                                                        padding: '10px 0',
                                                        textAlign: 'right'
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            fontSize: '15px',
                                                            color: 'var(--label-title-color)'
                                                        }}
                                                    >
                                                        {t('COMMON.ORDER.TAXES')}
                                                    </Typography>
                                                </TableCell>

                                                <TableCell
                                                    sx={{
                                                        border: 'none',
                                                        padding: '10px 0'
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            fontWeight: 'bold',
                                                            fontSize: '15px',
                                                            color: 'var(--text-color)',
                                                            textAlign: 'right'
                                                        }}
                                                    >
                                                        {formatCurrency(orderDetail.taxes || 0)}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>

                                            <TableRow>
                                                <TableCell
                                                    sx={{
                                                        border: 'none',
                                                        padding: '10px 0 0',
                                                        textAlign: 'right'
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            fontSize: '18px',
                                                            fontWeight: 'bold',
                                                            color: 'var(--text-color)'
                                                        }}
                                                    >
                                                        {t('COMMON.ORDER.TOTAL')}
                                                    </Typography>
                                                </TableCell>

                                                <TableCell
                                                    sx={{
                                                        border: 'none',
                                                        padding: '10px 0 0'
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            fontWeight: 'bold',
                                                            fontSize: '18px',
                                                            color: 'var(--text-color)',
                                                            textAlign: 'right'
                                                        }}
                                                    >
                                                        {formatCurrency(orderDetail.totalAmount)}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>

                            {orderDetail.customerNote && (
                                <Box
                                    sx={{
                                        mt: '24px',
                                        backgroundColor: 'var(--background-color-secondary)',
                                        borderRadius: '6px',
                                        padding: '10px 15px',
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
                                        {orderDetail.customerNote}
                                    </Typography>
                                </Box>
                            )}
                        </Paper>

                        <Paper
                            sx={{
                                mt: '24px',
                                borderRadius: '15px',
                                width: '100%',
                                padding: '24px',
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
                                {t('COMMON.ORDER.HISTORY')}
                            </Typography>

                            <Box
                                sx={{
                                    display: 'flex',
                                    width: '100%',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <Box
                                    sx={{
                                        width: '58%'
                                    }}
                                >
                                    {orderDetail.histories.map((history, index) => {
                                        return (
                                            <Box
                                                key={index}
                                                sx={{
                                                    mt: '20px',
                                                    display: 'flex',
                                                    gap: '20px'
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        mt: '4px',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            width: '13px',
                                                            mb: 'auto',
                                                            height: '13px',
                                                            borderRadius: '50%',
                                                            backgroundColor: 'var(--primary-color)'
                                                        }}
                                                    ></Box>

                                                    {index !== orderDetail.histories.length - 1 && (
                                                        <Box sx={{ flexGrow: 1 }}>
                                                            <Divider
                                                                orientation='vertical'
                                                                sx={{
                                                                    borderColor: 'var(--border-color)',
                                                                    mt: '10px',
                                                                    borderWidth: '1px',
                                                                    height: '110%'
                                                                }}
                                                            />
                                                        </Box>
                                                    )}
                                                </Box>

                                                <Box>
                                                    <Typography
                                                        sx={{
                                                            color: 'var(--text-color)',
                                                            fontSize: '15px',
                                                            fontWeight: 'bold'
                                                        }}
                                                    >
                                                        {history.title}
                                                    </Typography>

                                                    <Typography
                                                        sx={{
                                                            color: 'var(--label-title-color)',
                                                            mt: '3px',
                                                            fontSize: '13px'
                                                        }}
                                                    >
                                                        {new Date(history.time).toLocaleDateString('vi-VN', {
                                                            year: 'numeric',
                                                            month: '2-digit',
                                                            day: '2-digit',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        )
                                    })}
                                </Box>

                                <Box
                                    sx={{
                                        mt: '-25px',
                                        borderRadius: '15px',
                                        width: '38%',
                                        height: 'fit-content',
                                        padding: '5px 20px',
                                        border: '1px dashed var(--border-color)'
                                    }}
                                >
                                    <Box
                                        sx={{
                                            zIndex: 1,
                                            display: 'flex',
                                            height: '80px',
                                            gap: '15px',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                zIndex: 1,
                                                position: 'relative',
                                                flexDirection: 'column',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: '50px',
                                                    height: '50px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderRadius: '50%',
                                                    border: '3px solid var(--primary-color)'
                                                }}
                                            >
                                                <NotepadText color='var(--primary-color)' />
                                            </Box>

                                            <Divider
                                                orientation='vertical'
                                                sx={{
                                                    position: 'absolute',
                                                    borderColor: step < 1 ? '#e0e0e0' : 'var(--primary-color)',
                                                    top: '50px',
                                                    height: '31px',
                                                    borderWidth: '1.5px'
                                                }}
                                            />
                                        </Box>

                                        <Box>
                                            <Typography
                                                sx={{
                                                    color: 'var(--text-color)',
                                                    fontSize: '15px',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                {t('COMMON.ORDER.ORDER_PLACED')}
                                            </Typography>

                                            <Typography
                                                sx={{
                                                    color: 'var(--label-title-color)',
                                                    mt: '3px',
                                                    fontSize: '13px'
                                                }}
                                            >
                                                {new Date(orderDetail.orderDate).toLocaleDateString('vi-VN', {
                                                    year: 'numeric',
                                                    month: '2-digit',
                                                    day: '2-digit',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box
                                        sx={{
                                            zIndex: 1,
                                            display: 'flex',
                                            height: '80px',
                                            gap: '15px',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                position: 'relative',
                                                flexDirection: 'column',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: '50px',
                                                    height: '50px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    backgroundColor:
                                                        step !== 1 ? 'transparent' : 'var(--primary-color)',
                                                    borderRadius: '50%',
                                                    border:
                                                        step < 1
                                                            ? '3px solid #e0e0e0'
                                                            : '3px solid var(--primary-color)'
                                                }}
                                            >
                                                {orderDetail.paymentMethod !== 'cod' ? (
                                                    <Banknote
                                                        color={
                                                            step === 1
                                                                ? 'white'
                                                                : step < 1
                                                                ? '#e0e0e0'
                                                                : 'var(--primary-color)'
                                                        }
                                                    />
                                                ) : (
                                                    <Hourglass
                                                        color={
                                                            step === 1
                                                                ? 'white'
                                                                : step < 1
                                                                ? '#e0e0e0'
                                                                : 'var(--primary-color)'
                                                        }
                                                    />
                                                )}
                                            </Box>

                                            <Divider
                                                orientation='vertical'
                                                sx={{
                                                    position: 'absolute',
                                                    borderColor: step < 2 ? '#e0e0e0' : 'var(--primary-color)',
                                                    top: '50px',
                                                    height: '31px',
                                                    borderWidth: '1.5px'
                                                }}
                                            />
                                        </Box>

                                        <Box>
                                            <Typography
                                                sx={{
                                                    color: 'var(--text-color)',
                                                    fontSize: '15px',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                {orderDetail.paymentMethod === 'cod'
                                                    ? orderDetail.orderStatus === 'pending'
                                                        ? t('COMMON.ORDER.ORDER_PENDING')
                                                        : t('COMMON.ORDER.CONFIRMED')
                                                    : orderDetail.paymentTime
                                                    ? t('COMMON.ORDER.ORDER_PAID')
                                                    : t('COMMON.ORDER.PENDING_PAYMENT')}
                                            </Typography>

                                            {orderDetail.paymentTime && orderDetail.paymentMethod !== 'cod' && (
                                                <Typography
                                                    sx={{
                                                        color: 'var(--label-title-color)',
                                                        mt: '3px',
                                                        fontSize: '13px'
                                                    }}
                                                >
                                                    {new Date(orderDetail.paymentTime).toLocaleDateString('vi-VN', {
                                                        year: 'numeric',
                                                        month: '2-digit',
                                                        day: '2-digit',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </Typography>
                                            )}

                                            {orderDetail.paymentMethod === 'cod' &&
                                                orderDetail.orderStatus !== 'pending' && (
                                                    <Typography
                                                        sx={{
                                                            color: 'var(--label-title-color)',
                                                            mt: '3px',
                                                            fontSize: '13px'
                                                        }}
                                                    >
                                                        {t('COMMON.ORDER.PROCESSED')}
                                                    </Typography>
                                                )}
                                        </Box>
                                    </Box>

                                    <Box
                                        sx={{
                                            zIndex: 1,
                                            display: 'flex',
                                            height: '80px',
                                            gap: '15px',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                position: 'relative',
                                                flexDirection: 'column',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: '50px',
                                                    height: '50px',
                                                    display: 'flex',
                                                    zIndex: 2,
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    backgroundColor:
                                                        step !== 2 ? 'transparent' : 'var(--primary-color)',
                                                    borderRadius: '50%',
                                                    border:
                                                        step < 2
                                                            ? '3px solid #e0e0e0'
                                                            : '3px solid var(--primary-color)'
                                                }}
                                            >
                                                <Truck
                                                    color={
                                                        step === 2
                                                            ? 'white'
                                                            : step < 2
                                                            ? '#e0e0e0'
                                                            : 'var(--primary-color)'
                                                    }
                                                />
                                            </Box>

                                            <Divider
                                                orientation='vertical'
                                                sx={{
                                                    position: 'absolute',
                                                    borderColor: step < 3 ? '#e0e0e0' : 'var(--primary-color)',
                                                    top: '50px',
                                                    height: '31px',
                                                    borderWidth: '1.5px'
                                                }}
                                            />
                                        </Box>

                                        <Box>
                                            <Typography
                                                sx={{
                                                    color: 'var(--text-color)',
                                                    fontSize: '15px',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                {orderDetail.carrierDeliveryTime
                                                    ? t('COMMON.ORDER.HANDED_TO_CARRIER')
                                                    : t('COMMON.ORDER.SHIPPING')}
                                            </Typography>

                                            {orderDetail.carrierDeliveryTime && (
                                                <Typography
                                                    sx={{
                                                        color: 'var(--label-title-color)',
                                                        mt: '3px',
                                                        fontSize: '13px'
                                                    }}
                                                >
                                                    {new Date(orderDetail.carrierDeliveryTime).toLocaleDateString(
                                                        'vi-VN',
                                                        {
                                                            year: 'numeric',
                                                            month: '2-digit',
                                                            day: '2-digit',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        }
                                                    )}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>

                                    <Box
                                        sx={{
                                            zIndex: 1,
                                            display: 'flex',
                                            height: '80px',
                                            gap: '15px',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                position: 'relative',
                                                flexDirection: 'column',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: '50px',
                                                    height: '50px',
                                                    display: 'flex',
                                                    zIndex: 2,
                                                    alignItems: 'center',
                                                    backgroundColor:
                                                        step !== 3 ? 'transparent' : 'var(--primary-color)',
                                                    justifyContent: 'center',
                                                    borderRadius: '50%',
                                                    border:
                                                        step < 3
                                                            ? '3px solid #e0e0e0'
                                                            : '3px solid var(--primary-color)'
                                                }}
                                            >
                                                <Package
                                                    color={
                                                        step === 3
                                                            ? 'white'
                                                            : step < 3
                                                            ? '#e0e0e0'
                                                            : 'var(--primary-color)'
                                                    }
                                                />
                                            </Box>

                                            <Divider
                                                orientation='vertical'
                                                sx={{
                                                    position: 'absolute',
                                                    borderColor: step < 4 ? '#e0e0e0' : 'var(--primary-color)',
                                                    top: '50px',
                                                    height: '31px',
                                                    borderWidth: '1.5px'
                                                }}
                                            />
                                        </Box>

                                        <Box>
                                            <Typography
                                                sx={{
                                                    color: 'var(--text-color)',
                                                    fontSize: '15px',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                {orderDetail.deliveryTime
                                                    ? t('COMMON.ORDER.ORDER_RECEIVED')
                                                    : t('COMMON.ORDER.AWAITING_DELIVERY')}
                                            </Typography>

                                            {orderDetail.deliveryTime && (
                                                <Typography
                                                    sx={{
                                                        color: 'var(--label-title-color)',
                                                        mt: '3px',
                                                        fontSize: '13px'
                                                    }}
                                                >
                                                    {new Date(orderDetail.deliveryTime).toLocaleDateString('vi-VN', {
                                                        year: 'numeric',
                                                        month: '2-digit',
                                                        day: '2-digit',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>

                                    <Box
                                        sx={{
                                            zIndex: 1,
                                            display: 'flex',
                                            height: '80px',
                                            gap: '15px',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: '50px',
                                                    height: '50px',
                                                    display: 'flex',
                                                    zIndex: 2,
                                                    backgroundColor:
                                                        step !== 4 ? 'transparent' : 'var(--primary-color)',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderRadius: '50%',
                                                    border:
                                                        step < 4
                                                            ? '3px solid #e0e0e0'
                                                            : '3px solid var(--primary-color)'
                                                }}
                                            >
                                                <Star
                                                    color={
                                                        step === 4
                                                            ? 'white'
                                                            : step < 4
                                                            ? '#e0e0e0'
                                                            : 'var(--primary-color)'
                                                    }
                                                />
                                            </Box>
                                        </Box>

                                        <Box>
                                            <Typography
                                                sx={{
                                                    color: 'var(--text-color)',
                                                    fontSize: '15px',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                {orderDetail.reviewTime
                                                    ? t('COMMON.ORDER.ORDER_REVIEWED')
                                                    : t('COMMON.ORDER.REVIEW')}
                                            </Typography>

                                            {orderDetail.reviewTime && (
                                                <Typography
                                                    sx={{
                                                        color: 'var(--label-title-color)',
                                                        mt: '3px',
                                                        fontSize: '13px'
                                                    }}
                                                >
                                                    {new Date(orderDetail.reviewTime).toLocaleDateString('vi-VN', {
                                                        year: 'numeric',
                                                        month: '2-digit',
                                                        day: '2-digit',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Paper>
                    </Box>

                    <Paper
                        sx={{
                            borderRadius: '15px',
                            height: 'fit-content',
                            padding: '24px',
                            backgroundColor: 'var(--background-color-item)'
                        }}
                    >
                        <Box>
                            <Typography
                                sx={{
                                    color: 'var(--text-color)',
                                    fontWeight: 'bold',
                                    fontSize: '18px',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                {t('COMMON.ORDER.CUSTOMER_INFO')}
                            </Typography>

                            <Box
                                sx={{
                                    mt: '24px',
                                    display: 'flex',
                                    gap: '20px'
                                }}
                            >
                                <Avatar
                                    src={orderDetail.avatar}
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
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        {orderDetail.shippingRecipient}
                                    </Typography>

                                    <Typography
                                        sx={{
                                            color: 'var(--label-title-color)',
                                            fontSize: '15px'
                                        }}
                                    >
                                        {orderDetail.shippingEmail}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>

                        <Divider
                            sx={{
                                borderColor: 'var(--border-color)',
                                mt: '24px',
                                mx: '-24px',
                                borderStyle: 'dashed'
                            }}
                        />

                        <Box
                            sx={{
                                mt: '24px'
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    mt: '-7px'
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
                                    {t('COMMON.ORDER.DELIVERY')}
                                </Typography>

                                {isEditDelivery ? (
                                    <SaveAsIcon
                                        sx={{
                                            color: 'var(--label-title-color)',
                                            padding: '8px',
                                            mt: '-3px',
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            cursor: 'pointer',
                                            '&:hover': {
                                                backgroundColor: 'var(--background-color-item-hover)'
                                            }
                                        }}
                                        onClick={() => {
                                            setIsEditDelivery(false)
                                            handleUpdateDelivery()
                                        }}
                                    />
                                ) : (
                                    <EditRoundedIcon
                                        sx={{
                                            color: 'var(--label-title-color)',
                                            padding: '8px',
                                            mt: '-3px',
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            cursor: 'pointer',
                                            '&:hover': {
                                                backgroundColor: 'var(--background-color-item-hover)'
                                            }
                                        }}
                                        onClick={() => setIsEditDelivery(true)}
                                    />
                                )}
                            </Box>

                            <TableContainer>
                                <Table sx={{ mt: '-5px', tableLayout: 'fixed', width: '100%' }}>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell
                                                sx={{
                                                    width: '120px',
                                                    border: 'none',
                                                    padding: '20px 0 10px',
                                                    textAlign: 'left'
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        fontSize: '15px',
                                                        color: 'var(--label-title-color)'
                                                    }}
                                                >
                                                    {t('COMMON.ORDER.SHIP_BY')}
                                                </Typography>
                                            </TableCell>

                                            <TableCell
                                                sx={{
                                                    border: 'none',
                                                    padding: '20px 0 10px'
                                                }}
                                            >
                                                {!isEditDelivery ? (
                                                    <Typography
                                                        sx={{
                                                            fontSize: '15px',
                                                            color: 'var(--text-color)',
                                                            textAlign: 'left'
                                                        }}
                                                    >
                                                        {orderDetail.shipBy}
                                                    </Typography>
                                                ) : (
                                                    <TextField
                                                        value={shipBy}
                                                        onChange={e => setShipBy(e.target.value)}
                                                        variant='outlined'
                                                        size='small'
                                                        sx={{
                                                            width: '100%',
                                                            '& fieldset': {
                                                                borderRadius: '8px',
                                                                color: 'var(--text-color)',
                                                                borderColor: 'var(--border-color)'
                                                            },
                                                            '& .MuiInputBase-root': {
                                                                paddingRight: '8px'
                                                            },
                                                            '& .MuiInputBase-input': {
                                                                paddingRight: '8px',
                                                                color: 'var(--text-color)',
                                                                fontSize: '16px',
                                                                '&::placeholder': {
                                                                    color: 'var(--placeholder-color)',
                                                                    opacity: 1
                                                                }
                                                            },
                                                            '& .MuiOutlinedInput-root:hover fieldset': {
                                                                borderColor: 'var(--field-color-hover)'
                                                            },
                                                            '& .MuiOutlinedInput-root.Mui-error:hover fieldset': {
                                                                borderColor: 'var(--error-color) !important' // Màu lỗi khi hover
                                                            },
                                                            '& .MuiOutlinedInput-root.Mui-error fieldset': {
                                                                borderColor: 'var(--error-color) !important' // Màu lỗi khi hover
                                                            },
                                                            '& .MuiOutlinedInput-root.Mui-focused fieldset': {
                                                                borderColor: 'var(--field-color-selected)'
                                                            },
                                                            '& .MuiInputLabel-root': {
                                                                color: 'var(--placeholder-color)'
                                                            },
                                                            '& .MuiInputLabel-root.Mui-focused': {
                                                                fontWeight: 'bold',
                                                                color: 'var(--field-color-selected)'
                                                            },
                                                            '& .MuiInputLabel-root.Mui-error': {
                                                                color: 'var(--error-color)'
                                                            }
                                                        }}
                                                    />
                                                )}
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell
                                                sx={{
                                                    width: '120px',
                                                    border: 'none',
                                                    padding: '10px 0',
                                                    textAlign: 'left'
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        fontSize: '15px',
                                                        color: 'var(--label-title-color)'
                                                    }}
                                                >
                                                    {t('COMMON.ORDER.SPEEDY')}
                                                </Typography>
                                            </TableCell>

                                            <TableCell
                                                sx={{
                                                    border: 'none',
                                                    padding: '10px 0'
                                                }}
                                            >
                                                {' '}
                                                {isEditDelivery ? (
                                                    <TextField
                                                        value={speedyDelivery}
                                                        onChange={e => setSpeedyDelivery(e.target.value)}
                                                        variant='outlined'
                                                        size='small'
                                                        sx={{
                                                            width: '100%',
                                                            '& fieldset': {
                                                                borderRadius: '8px',
                                                                color: 'var(--text-color)',
                                                                borderColor: 'var(--border-color)'
                                                            },
                                                            '& .MuiInputBase-root': {
                                                                paddingRight: '8px'
                                                            },
                                                            '& .MuiInputBase-input': {
                                                                paddingRight: '8px',
                                                                color: 'var(--text-color)',
                                                                fontSize: '16px',
                                                                '&::placeholder': {
                                                                    color: 'var(--placeholder-color)',
                                                                    opacity: 1
                                                                }
                                                            },
                                                            '& .MuiOutlinedInput-root:hover fieldset': {
                                                                borderColor: 'var(--field-color-hover)'
                                                            },
                                                            '& .MuiOutlinedInput-root.Mui-error:hover fieldset': {
                                                                borderColor: 'var(--error-color) !important' // Màu lỗi khi hover
                                                            },
                                                            '& .MuiOutlinedInput-root.Mui-error fieldset': {
                                                                borderColor: 'var(--error-color) !important' // Màu lỗi khi hover
                                                            },
                                                            '& .MuiOutlinedInput-root.Mui-focused fieldset': {
                                                                borderColor: 'var(--field-color-selected)'
                                                            },
                                                            '& .MuiInputLabel-root': {
                                                                color: 'var(--placeholder-color)'
                                                            },
                                                            '& .MuiInputLabel-root.Mui-focused': {
                                                                fontWeight: 'bold',
                                                                color: 'var(--field-color-selected)'
                                                            },
                                                            '& .MuiInputLabel-root.Mui-error': {
                                                                color: 'var(--error-color)'
                                                            }
                                                        }}
                                                    />
                                                ) : (
                                                    <Typography
                                                        sx={{
                                                            fontSize: '15px',
                                                            color: 'var(--text-color)',
                                                            textAlign: 'left'
                                                        }}
                                                    >
                                                        {orderDetail.speedyDelivery}
                                                    </Typography>
                                                )}
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell
                                                sx={{
                                                    width: '120px',
                                                    border: 'none',
                                                    padding: '10px 0',
                                                    textAlign: 'left'
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        fontSize: '15px',
                                                        color: 'var(--label-title-color)'
                                                    }}
                                                >
                                                    {t('COMMON.ORDER.TRACKING_NO')}
                                                </Typography>
                                            </TableCell>

                                            <TableCell
                                                sx={{
                                                    border: 'none',
                                                    padding: '10px 0'
                                                }}
                                            >
                                                {isEditDelivery ? (
                                                    <TextField
                                                        value={trackingCode}
                                                        onChange={e => setTrackingCode(e.target.value)}
                                                        variant='outlined'
                                                        size='small'
                                                        sx={{
                                                            width: '100%',
                                                            '& fieldset': {
                                                                borderRadius: '8px',
                                                                color: 'var(--text-color)',
                                                                borderColor: 'var(--border-color)'
                                                            },
                                                            '& .MuiInputBase-root': {
                                                                paddingRight: '8px'
                                                            },
                                                            '& .MuiInputBase-input': {
                                                                paddingRight: '8px',
                                                                color: 'var(--text-color)',
                                                                fontSize: '16px',
                                                                '&::placeholder': {
                                                                    color: 'var(--placeholder-color)',
                                                                    opacity: 1
                                                                }
                                                            },
                                                            '& .MuiOutlinedInput-root:hover fieldset': {
                                                                borderColor: 'var(--field-color-hover)'
                                                            },
                                                            '& .MuiOutlinedInput-root.Mui-error:hover fieldset': {
                                                                borderColor: 'var(--error-color) !important' // Màu lỗi khi hover
                                                            },
                                                            '& .MuiOutlinedInput-root.Mui-error fieldset': {
                                                                borderColor: 'var(--error-color) !important' // Màu lỗi khi hover
                                                            },
                                                            '& .MuiOutlinedInput-root.Mui-focused fieldset': {
                                                                borderColor: 'var(--field-color-selected)'
                                                            },
                                                            '& .MuiInputLabel-root': {
                                                                color: 'var(--placeholder-color)'
                                                            },
                                                            '& .MuiInputLabel-root.Mui-focused': {
                                                                fontWeight: 'bold',
                                                                color: 'var(--field-color-selected)'
                                                            },
                                                            '& .MuiInputLabel-root.Mui-error': {
                                                                color: 'var(--error-color)'
                                                            }
                                                        }}
                                                    />
                                                ) : (
                                                    <Typography
                                                        sx={{
                                                            textDecoration: 'underline',
                                                            color: 'var(--text-color)',
                                                            fontSize: '15px',
                                                            textAlign: 'left'
                                                        }}
                                                    >
                                                        {orderDetail.trackingCode}
                                                    </Typography>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>

                        <Divider
                            sx={{
                                borderColor: 'var(--border-color)',
                                mt: '24px',
                                mx: '-24px',
                                borderStyle: 'dashed'
                            }}
                        />

                        <Box
                            sx={{
                                mt: '24px'
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
                                {t('COMMON.ORDER.SHIPPING')}
                            </Typography>

                            <TableContainer>
                                <Table sx={{ tableLayout: 'fixed', width: '100%' }}>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell
                                                sx={{
                                                    width: '120px',
                                                    border: 'none',
                                                    verticalAlign: 'top',
                                                    padding: '20px 0 10px'
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        fontSize: '15px',
                                                        color: 'var(--label-title-color)'
                                                    }}
                                                >
                                                    {t('COMMON.USER.RECIPIENT')}
                                                </Typography>
                                            </TableCell>

                                            <TableCell
                                                sx={{
                                                    border: 'none',
                                                    padding: '20px 0 10px'
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        fontSize: '15px',
                                                        color: 'var(--text-color)',
                                                        textAlign: 'left'
                                                    }}
                                                >
                                                    {orderDetail.shippingRecipient}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell
                                                sx={{
                                                    width: '120px',
                                                    border: 'none',
                                                    padding: '10px 0',
                                                    textAlign: 'left'
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        fontSize: '15px',
                                                        color: 'var(--label-title-color)'
                                                    }}
                                                >
                                                    {t('COMMON.ORDER.PHONE_NUMBER')}
                                                </Typography>
                                            </TableCell>

                                            <TableCell
                                                sx={{
                                                    border: 'none',
                                                    padding: '10px 0'
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        fontSize: '15px',
                                                        color: 'var(--text-color)',
                                                        textAlign: 'left'
                                                    }}
                                                >
                                                    {orderDetail.shippingPhone}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell
                                                sx={{
                                                    width: '120px',
                                                    border: 'none',
                                                    verticalAlign: 'top',
                                                    padding: '10px 0'
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        fontSize: '15px',
                                                        mb: 'auto',
                                                        color: 'var(--label-title-color)'
                                                    }}
                                                >
                                                    {t('COMMON.ORDER.ADDRESS')}
                                                </Typography>
                                            </TableCell>

                                            <TableCell
                                                sx={{
                                                    border: 'none',
                                                    padding: '10px 0'
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        fontSize: '15px',
                                                        color: 'var(--text-color)',
                                                        textAlign: 'left'
                                                    }}
                                                >
                                                    {orderDetail.shippingAddress}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>

                        <Divider
                            sx={{
                                borderColor: 'var(--border-color)',
                                mt: '24px',
                                mx: '-24px',
                                borderStyle: 'dashed'
                            }}
                        />

                        <Box
                            sx={{
                                mt: '24px'
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
                                {t('COMMON.ORDER.PAYMENT')}
                            </Typography>

                            {orderDetail.paymentMethod === 'momo' && (
                                <Box
                                    sx={{
                                        mt: '20px',
                                        display: 'flex',
                                        gap: '20px',
                                        alignItems: 'center',
                                        marginLeft: 'auto'
                                    }}
                                >
                                    <Avatar
                                        src='/images/momo_square_pinkbg.svg'
                                        sx={{
                                            borderRadius: '8px',
                                            width: '40px',
                                            height: '40px'
                                        }}
                                    />

                                    <Box>
                                        <Typography
                                            sx={{
                                                fontSize: '15px',
                                                color: 'var(--text-color)',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {t('COMMON.ORDER.PAY_VIA')} MoMo
                                        </Typography>

                                        <Typography
                                            sx={{
                                                fontSize: '15px',
                                                color: 'var(--label-title-color)'
                                            }}
                                        >
                                            {orderDetail.paymentTime
                                                ? new Date(orderDetail.paymentTime).toLocaleDateString('vi-VN', {
                                                      year: 'numeric',
                                                      month: '2-digit',
                                                      day: '2-digit',
                                                      hour: '2-digit',
                                                      minute: '2-digit'
                                                  })
                                                : t('COMMON.PURCHASE_ORDER.UNPAID')}
                                        </Typography>
                                    </Box>
                                </Box>
                            )}

                            {orderDetail.paymentMethod === 'vnpay' && (
                                <Box
                                    sx={{
                                        mt: '20px',
                                        display: 'flex',
                                        gap: '20px',
                                        alignItems: 'center',
                                        marginLeft: 'auto'
                                    }}
                                >
                                    <Avatar
                                        src='/images/vnpay.svg'
                                        sx={{
                                            borderRadius: '0px',
                                            width: '60px',
                                            height: '10px'
                                        }}
                                    />

                                    <Box>
                                        <Typography
                                            sx={{
                                                fontSize: '15px',
                                                color: 'var(--text-color)',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {t('COMMON.ORDER.PAY_VIA')} VnPay
                                        </Typography>

                                        <Typography
                                            sx={{
                                                fontSize: '15px',
                                                color: 'var(--label-title-color)'
                                            }}
                                        >
                                            {orderDetail.paymentTime
                                                ? new Date(orderDetail.paymentTime).toLocaleDateString('vi-VN', {
                                                      year: 'numeric',
                                                      month: '2-digit',
                                                      day: '2-digit',
                                                      hour: '2-digit',
                                                      minute: '2-digit'
                                                  })
                                                : t('COMMON.PURCHASE_ORDER.UNPAID')}
                                        </Typography>
                                    </Box>
                                </Box>
                            )}

                            {orderDetail.paymentMethod === 'cod' && (
                                <Box
                                    sx={{
                                        mt: '20px',
                                        display: 'flex',
                                        gap: '20px',
                                        alignItems: 'center',
                                        marginLeft: 'auto'
                                    }}
                                >
                                    <Avatar
                                        src='/images/dollar.png'
                                        sx={{
                                            borderRadius: '0px',
                                            width: '40px',
                                            height: '40px'
                                        }}
                                    />

                                    <Box>
                                        <Typography
                                            sx={{
                                                fontSize: '15px',
                                                color: 'var(--text-color)',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {t('COMMON.ORDER.CASH_PAYMENT')}
                                        </Typography>

                                        <Typography
                                            sx={{
                                                fontSize: '15px',
                                                color: 'var(--label-title-color)'
                                            }}
                                        >
                                            {orderDetail.paymentTime
                                                ? new Date(orderDetail.paymentTime).toLocaleDateString('vi-VN', {
                                                      year: 'numeric',
                                                      month: '2-digit',
                                                      day: '2-digit',
                                                      hour: '2-digit',
                                                      minute: '2-digit'
                                                  })
                                                : t('COMMON.ORDER.UNPAID')}
                                        </Typography>
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    </Paper>
                </Box>
            </Box>
            {openDialog && (
                <AlertDialog
                    title={'Xác nhận cập nhật đơn hàng'}
                    isLoading={false} //{isLoadingDelete}
                    content={'Bạn có chắc chắn muốn cập nhật trạng thái đơn hàng này?'}
                    status={tempStatus}
                    open={openDialog}
                    setOpen={() => setOpenDialog(false)}
                    buttonCancel={t('COMMON.ALERT_DIALOG.CANCEL')}
                    buttonConfirm={'Xác nhận'}
                    onConfirm={dateTime => handleUpdateOrderStatus(dateTime)}
                />
            )}
        </>
    )
}
