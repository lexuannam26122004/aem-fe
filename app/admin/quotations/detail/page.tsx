'use client'

import React from 'react'
import { Truck, Package, NotepadText, Banknote, Star, Printer, BadgeCheck, Check, SquareCheckBig } from 'lucide-react'
import { IQuotationDetail } from '@/models/Quotation'
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

function getStatusBgColor(status: string): string {
    if (status === 'cancelled') {
        return 'var(--background-color-cancel)'
    } else if (status === 'completed') {
        return 'var(--background-color-success)'
    } else if (status === 'pending') {
        return 'var(--background-color-pending)'
    } else {
        return 'var(--background-color-pink)'
    }
}

function getBorderColor(status: string): string {
    if (status === 'cancelled') {
        return 'var(--border-color-cancel)'
    } else if (status === 'completed') {
        return 'var(--border-color-success)'
    } else if (status === 'pending') {
        return 'var(--border-color-pending)'
    } else {
        return 'var(--border-color-pink)'
    }
}

function getStatusTextColor(status: string): string {
    if (status === 'cancelled') {
        return 'var(--text-color-cancel)'
    } else if (status === 'completed') {
        return 'var(--text-color-success)'
    } else if (status === 'pending') {
        return 'var(--text-color-pending)'
    } else {
        return 'var(--text-color-pink)'
    }
}

export default function quotationDetailPage() {
    const { t } = useTranslation('common')

    const quotationDetail: IQuotationDetail = {
        id: '91374246-e15a-46f5-988b-63f7645f4c0c',
        quotationCode: 'Q-7890',
        customerName: 'John Doe',
        customerEmail: 'johndoe@example.com',
        customerAvatarPath: '/avatars/john_doe.png',
        assigneeName: 'Jane Smith',
        assigneePhone: '+84987654321',
        assigneeId: 'EMP001',
        customerIp: '192.217.234.11',
        assigneeAvatarPath: '/avatars/jane_smith.png',
        phone: '+84912345678',
        itemCount: 2,
        validityDate: '2025-05-28T07:46:23.944Z',
        requestedDate: '2025-04-28T07:46:23.944Z',
        status: 'pending',
        createdAt: '2025-04-28T07:46:23.944Z',
        updatedAt: '2025-04-28T07:46:23.944Z',
        issuedDate: '2025-04-28T08:00:00.000Z',
        itemList: [
            {
                id: 1,
                productName: 'Laptop Dell XPS 13',
                productImage: '/products/laptop_dell_xps13.png',
                productId: 'PROD001',
                sku: 'SKU001',
                quantity: 1
            },
            {
                id: 2,
                productName: 'Logitech MX Master 3S Mouse',
                productImage: '/products/mx_master_3s.png',
                productId: 'PROD002',
                sku: 'SKU002',
                quantity: 2
            }
        ],
        notes: 'Khách yêu cầu báo giá kèm thời gian giao hàng dự kiến.',
        receiveAddress: '123 Đường ABC, Quận 1, TP. Hồ Chí Minh'
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
                            {t('COMMON.QUOTATION.QUOTATION')} #{quotationDetail.quotationCode}
                        </Typography>
                        <Typography
                            sx={{
                                color: 'var(--label-title-color)',
                                fontSize: '15px',
                                marginLeft: '5px'
                            }}
                        >
                            {new Date(quotationDetail.requestedDate).toLocaleDateString('vi-VN', {
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
                            border: getBorderColor(quotationDetail.status),
                            display: 'flex',
                            margin: '0 auto',
                            width: '105px',
                            alignItems: 'center',
                            gap: '10px',
                            justifyContent: 'center',
                            backgroundColor: getStatusBgColor(quotationDetail.status)
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: '13px',
                                overflow: 'hidden',
                                color: getStatusTextColor(quotationDetail.status),
                                fontWeight: 'bold',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {quotationDetail.status === 'pending' && t('COMMON.ORDER.PENDING')}
                            {quotationDetail.status === 'processing' && t('COMMON.ORDER.PROCESSING')}
                            {quotationDetail.status === 'completed' && t('COMMON.QUOTATION.COMPLETED')}
                            {quotationDetail.status === 'cancelled' && t('COMMON.ORDER.CANCELLED')}
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
                        </Box>

                        <Box
                            sx={{
                                width: '100%',
                                mt: '18px'
                            }}
                        >
                            {quotationDetail.itemList.map((item, index) => {
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
                                                justifyContent: 'space-between',
                                                borderRadius: '10px',
                                                mr: '20px'
                                            }}
                                        />

                                        <Box
                                            sx={{
                                                flex: 1
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
                                                mr: '5px',
                                                width: '5%',
                                                textAlign: 'right',
                                                color: 'var(--text-color)'
                                            }}
                                        >
                                            x{item.quantity}
                                        </Typography>
                                    </Box>
                                )
                            })}
                        </Box>

                        {quotationDetail.notes && (
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
                                    {quotationDetail.notes}
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
                                src={quotationDetail.customerAvatarPath}
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
                                    {quotationDetail.customerName}
                                </Typography>

                                <Typography
                                    sx={{
                                        color: 'var(--label-title-color)',
                                        fontSize: '15px'
                                    }}
                                >
                                    {quotationDetail.customerEmail}
                                </Typography>

                                <Typography
                                    sx={{
                                        color: 'var(--label-title-color)',
                                        fontSize: '15px'
                                    }}
                                >
                                    {quotationDetail.phone}
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
                            {t('COMMON.QUOTATION.ASSIGNEE_INFO')}
                        </Typography>

                        {quotationDetail.assigneeId ? (
                            <Box>
                                <Box
                                    sx={{
                                        mt: '24px',
                                        display: 'flex',
                                        gap: '20px'
                                    }}
                                >
                                    <Avatar
                                        src={quotationDetail.assigneeAvatarPath}
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
                                            {quotationDetail.assigneeName}
                                        </Typography>

                                        <Typography
                                            sx={{
                                                color: 'var(--label-title-color)',
                                                fontSize: '15px'
                                            }}
                                        >
                                            {quotationDetail.assigneeId}
                                        </Typography>
                                    </Box>
                                </Box>

                                {quotationDetail.issuedDate && quotationDetail.validityDate && (
                                    <Box>
                                        <TableContainer>
                                            <Table sx={{ tableLayout: 'fixed', width: '100%' }}>
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell
                                                            sx={{
                                                                width: '130px',
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
                                                                {t('COMMON.QUOTATION.ISSUED_DATE')}
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
                                                                {new Date(
                                                                    quotationDetail.issuedDate
                                                                ).toLocaleDateString('vi-VN', {
                                                                    year: 'numeric',
                                                                    month: '2-digit',
                                                                    day: '2-digit',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                            </Typography>
                                                        </TableCell>
                                                    </TableRow>

                                                    <TableRow>
                                                        <TableCell
                                                            sx={{
                                                                width: '130px',
                                                                border: 'none',
                                                                verticalAlign: 'top',
                                                                padding: '10px 0 10px'
                                                            }}
                                                        >
                                                            <Typography
                                                                sx={{
                                                                    fontSize: '15px',
                                                                    mb: 'auto',
                                                                    color: 'var(--label-title-color)'
                                                                }}
                                                            >
                                                                {t('COMMON.QUOTATION.QUOTATION_VALIDITY')}
                                                            </Typography>
                                                        </TableCell>

                                                        <TableCell
                                                            sx={{
                                                                border: 'none',
                                                                padding: '10px 0 10px'
                                                            }}
                                                        >
                                                            <Typography
                                                                sx={{
                                                                    fontSize: '15px',
                                                                    color: 'var(--text-color)',
                                                                    textAlign: 'left'
                                                                }}
                                                            >
                                                                {new Date(
                                                                    quotationDetail.validityDate
                                                                ).toLocaleDateString('vi-VN', {
                                                                    year: 'numeric',
                                                                    month: '2-digit',
                                                                    day: '2-digit',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                            </Typography>
                                                        </TableCell>
                                                    </TableRow>

                                                    <TableRow>
                                                        <TableCell
                                                            sx={{
                                                                width: '130px',
                                                                border: 'none',
                                                                padding: '10px 0 0',
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
                                                                padding: '10px 0 0'
                                                            }}
                                                        >
                                                            <Typography
                                                                sx={{
                                                                    fontSize: '15px',
                                                                    color: 'var(--text-color)',
                                                                    textAlign: 'left'
                                                                }}
                                                            >
                                                                {quotationDetail.assigneePhone}
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
                </Paper>
            </Box>
        </Box>
    )
}
