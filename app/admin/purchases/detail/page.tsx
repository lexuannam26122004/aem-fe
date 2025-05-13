'use client'

import React from 'react'
import { Printer, SquareCheckBig } from 'lucide-react'
import NoteIcon from '@mui/icons-material/Note'
import {
    Avatar,
    Box,
    Button,
    Divider,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Typography
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import { formatCurrency } from '@/common/format'
import { IPurchaseOrderDetail } from '@/models/PurchaseOrder'
import EmptyState from '@/components/EmptyState'

function getStatusBgColor(status: string): string {
    if (status === 'unpaid') {
        return 'var(--background-color-cancel)'
    } else {
        return 'var(--background-color-success)'
    }
}

function getBorderColor(status: string): string {
    if (status === 'unpaid') {
        return 'var(--border-color-cancel)'
    } else {
        return 'var(--border-color-success)'
    }
}

function getStatusTextColor(status: string): string {
    if (status === 'cancelled') {
        return 'var(--text-color-cancel)'
    } else {
        return 'var(--text-color-success)'
    }
}

export default function OrderDetailPage() {
    const { t } = useTranslation('common')

    const orderDetail: IPurchaseOrderDetail = {
        id: 1,
        supplierAvatarPath: 'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-19.webp',
        purchaseCode: 'PO-20250427-001',
        supplierName: 'Công ty TNHH ABC',
        supplierPhone: '+84 912 345 678',
        receivedBy: 'Lê Xuân Nam',
        employeeAvatarPath: 'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-1.webp',
        supplierEmail: 'contact@abccompany.vn',
        supplierAddress: '123 Đường Lê Lợi, Quận 1, TP.HCM, Việt Nam',
        itemCount: 2,
        purchaseDate: '2025-04-25T08:00:00Z',
        receivedPhone: '+84 854 382 342',
        receivedTime: '2025-04-26T14:00:00Z',
        receivedId: 'EM-1234',
        totalAmount: 10800000,
        discountAmount: 300000,
        paymentStatus: 'paid',
        paymentTime: '2025-04-26T15:00:00Z',
        notes: 'Đã giao đủ hàng, chất lượng tốt.',
        createdAt: '2025-04-25T07:30:00Z',
        createdBy: 'admin',
        shippingFee: 200000,
        subTotal: 10000000,
        supplierTaxID: '123456789',
        discountShippingFee: 50000,
        paymentMethod: 'cod',
        taxes: 800000,
        itemList: [
            {
                id: 1,
                productId: '1001',
                productName: 'Máy in Canon LBP2900',
                productImage: 'https://api-prod-minimal-v700.pages.dev/assets/images/cover/cover-15.webp',
                quantity: 2,
                purchasePrice: 3500000,
                subtotal: 7000000,
                taxAmount: 700000,
                discountType: 1,
                discountValue: 100000,
                sku: 'PRN-CANON-2900'
            },
            {
                id: 2,
                productId: '1002',
                productName: 'Giấy in A4 Double A 80gsm',
                productImage: 'https://api-prod-minimal-v700.pages.dev/assets/images/cover/cover-12.webp',
                quantity: 5,
                purchasePrice: 600000,
                subtotal: 3000000,
                taxAmount: 300000,
                discountType: 2,
                discountValue: 5,
                sku: 'PAP-DOUBLEA-A4'
            }
        ]
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
                            {t('COMMON.ORDER.ORDER')} #{orderDetail.purchaseCode}
                        </Typography>

                        <Typography
                            sx={{
                                color: 'var(--label-title-color)',
                                fontSize: '15px',
                                marginLeft: '5px'
                            }}
                        >
                            {new Date(orderDetail.purchaseDate).toLocaleDateString('vi-VN', {
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
                            border: getBorderColor(orderDetail.paymentStatus),
                            display: 'flex',
                            margin: '0 auto',
                            width: 'fit-content',
                            alignItems: 'center',
                            gap: '10px',
                            justifyContent: 'center',
                            backgroundColor: getStatusBgColor(orderDetail.paymentStatus)
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: '13px',
                                overflow: 'hidden',
                                color: getStatusTextColor(orderDetail.paymentStatus),
                                fontWeight: 'bold',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {orderDetail.paymentStatus === 'paid' && t('COMMON.PURCHASE_ORDER.PAID')}
                            {orderDetail.paymentStatus === 'unpaid' && t('COMMON.PURCHASE_ORDER.UNPAID')}
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
                        <Box
                            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: '-7px' }}
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
                                {t('COMMON.ORDER.DETAIL')}
                            </Typography>

                            <EditRoundedIcon
                                sx={{
                                    color: 'var(--label-title-color)',
                                    padding: '8px',
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        backgroundColor: 'var(--background-color-item-hover)'
                                    }
                                }}
                            />
                        </Box>

                        <Box
                            sx={{
                                width: '100%',
                                mt: '18px'
                            }}
                        >
                            {orderDetail.itemList.map((item, index) => {
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
                                            src={item.productImage}
                                            sx={{
                                                width: '50px',
                                                height: '50px',
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
                                                    fontSize: '15px'
                                                }}
                                            >
                                                {item.sku}
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
                                            {formatCurrency(item.subtotal)}
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
                                                        orderDetail.discountShippingFee >= 0 &&
                                                        '- '}
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
                                                    {orderDetail.discountAmount &&
                                                        orderDetail.discountAmount >= 0 &&
                                                        '- '}
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

                        {orderDetail.notes && (
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
                                    {orderDetail.notes}
                                </Typography>
                            </Box>
                        )}
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
                            {t('COMMON.PURCHASE_ORDER.SUPPLIER_INFO')}
                        </Typography>

                        <Box
                            sx={{
                                mt: '24px',
                                display: 'flex',
                                gap: '20px'
                            }}
                        >
                            <Avatar
                                src={orderDetail.supplierAvatarPath}
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
                                    {orderDetail.supplierName}
                                </Typography>

                                <Typography
                                    sx={{
                                        color: 'var(--label-title-color)',
                                        fontSize: '15px'
                                    }}
                                >
                                    {orderDetail.supplierEmail}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Box>
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
                                                    mb: 'auto',
                                                    color: 'var(--label-title-color)'
                                                }}
                                            >
                                                {t('COMMON.PURCHASE_ORDER.ADDRESS')}
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
                                                {orderDetail.supplierAddress}
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
                                                {t('COMMON.PURCHASE_ORDER.PHONE')}
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
                                                {orderDetail.supplierPhone}
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
                                                {t('COMMON.PURCHASE_ORDER.TAX_CODE')}
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
                                                {orderDetail.supplierTaxID}
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
                            mt: '10px',
                            mx: '-24px',
                            borderStyle: 'dashed'
                        }}
                    />

                    <Box sx={{ mt: '24px' }}>
                        <Typography
                            sx={{
                                color: 'var(--text-color)',
                                fontWeight: 'bold',
                                fontSize: '18px',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            {t('COMMON.PURCHASE_ORDER.RECEIVED_BY')}
                        </Typography>

                        {orderDetail.receivedBy ? (
                            <Box>
                                <Box
                                    sx={{
                                        mt: '24px',
                                        display: 'flex',
                                        gap: '20px'
                                    }}
                                >
                                    <Avatar
                                        src={orderDetail.employeeAvatarPath}
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
                                            {orderDetail.receivedBy}
                                        </Typography>

                                        <Typography
                                            sx={{
                                                color: 'var(--label-title-color)',
                                                fontSize: '15px'
                                            }}
                                        >
                                            {orderDetail.receivedId}
                                        </Typography>
                                    </Box>
                                </Box>

                                {orderDetail.receivedTime && (
                                    <Box>
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
                                                                    mb: 'auto',
                                                                    color: 'var(--label-title-color)'
                                                                }}
                                                            >
                                                                {t('COMMON.PURCHASE_ORDER.RECEIVED_TIME')}
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
                                                                {new Date(orderDetail.receivedTime).toLocaleDateString(
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
                                                                {t('COMMON.PURCHASE_ORDER.PHONE')}
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
                                                                {orderDetail.receivedPhone}
                                                            </Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
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
                    </Box>

                    <Divider
                        sx={{
                            borderColor: 'var(--border-color)',
                            mt: '15px',
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
                                            : t('COMMON.ORDER.UNPAID')}
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
                                            : t('COMMON.ORDER.UNPAID')}
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
    )
}
