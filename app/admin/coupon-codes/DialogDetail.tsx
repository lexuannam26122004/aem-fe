import React, { useState } from 'react'

import { TicketIcon, UsersIcon, CalendarIcon, TrendingUpIcon, TagIcon, DiamondMinus, DiamondPlus } from 'lucide-react'
import { ICoupon } from '@/models/Coupon'
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    LinearProgress,
    Paper,
    Tab,
    TableContainer,
    Tabs,
    Typography,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Table
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { formatCurrency, formatDate, formatDivision } from '@/common/format'

interface CouponDetailDialogProps {
    isOpen: boolean
    onClose: () => void
    coupon: ICoupon | null
}

const getCouponOrders = () => {
    const mockOrders = [
        {
            id: 'order1',
            orderCode: 'DH001',
            customerName: 'Nguyễn Văn A',
            orderDate: '2024-03-01',
            totalAmount: 1500000,
            discountAmount: 150000
        },
        {
            id: 'order2',
            orderCode: 'DH002',
            customerName: 'Trần Thị B',
            orderDate: '2024-03-05',
            totalAmount: 2300000,
            discountAmount: 230000
        },
        {
            id: 'order3',
            orderCode: 'DH003',
            customerName: 'Lê Văn C',
            orderDate: '2024-03-10',
            totalAmount: 1800000,
            discountAmount: 180000
        },
        {
            id: 'order4',
            orderCode: 'DH001',
            customerName: 'Nguyễn Văn A',
            orderDate: '2024-03-01',
            totalAmount: 1500000,
            discountAmount: 150000
        },
        {
            id: 'order5',
            orderCode: 'DH002',
            customerName: 'Trần Thị B',
            orderDate: '2024-03-05',
            totalAmount: 2300000,
            discountAmount: 230000
        },
        {
            id: 'order6',
            orderCode: 'DH003',
            customerName: 'Lê Văn C',
            orderDate: '2024-03-10',
            totalAmount: 1800000,
            discountAmount: 180000
        },
        {
            id: 'order7',
            orderCode: 'DH001',
            customerName: 'Nguyễn Văn A',
            orderDate: '2024-03-01',
            totalAmount: 1500000,
            discountAmount: 150000
        },
        {
            id: 'order8',
            orderCode: 'DH002',
            customerName: 'Trần Thị B',
            orderDate: '2024-03-05',
            totalAmount: 2300000,
            discountAmount: 230000
        },
        {
            id: 'order9',
            orderCode: 'DH003',
            customerName: 'Lê Văn C',
            orderDate: '2024-03-10',
            totalAmount: 1800000,
            discountAmount: 180000
        }
    ]

    return mockOrders
}

interface InfoCardProps {
    label: string
    value: string | number
    icon: React.ReactNode
    highlight?: boolean
    warning?: boolean
}

const CouponDetailDialog: React.FC<CouponDetailDialogProps> = ({ isOpen, onClose, coupon }) => {
    const { t } = useTranslation('common')
    const [tab, setTab] = useState('info')

    if (!coupon) return null

    const isExpired = new Date(coupon.expiryDate) < new Date()

    const isLimited = coupon.usageLimit && coupon.usageLimit === coupon.usageCount

    const couponOrders = getCouponOrders()

    const average = 12312313

    const InfoCard: React.FC<InfoCardProps> = ({ label, value, icon, highlight = false }) => {
        return (
            <Paper
                sx={{
                    padding: '15px',
                    flex: 1,
                    width: '100%',
                    borderRadius: '8px',
                    backgroundColor: 'var(--background-color-item)'
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        gap: '10px',
                        alignItems: 'center'
                    }}
                >
                    {icon}
                    <Typography
                        sx={{
                            fontSize: '13px',
                            color: 'var(--label-title-color)'
                        }}
                    >
                        {label}
                    </Typography>
                </Box>

                <Typography
                    sx={{
                        fontSize: '15px',
                        fontWeight: 'bold',
                        color: highlight ? '#0099ff' : 'var(--text-color)',
                        marginTop: '7px'
                    }}
                >
                    {value}
                </Typography>
            </Paper>
        )
    }

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            maxWidth='md'
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: '12px'
                    }
                }
            }}
            sx={{
                '& .MuiDialog-paper': {
                    width: '55vw !important'
                },
                '& .MuiBackdrop-root': {
                    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Đậm hơn mặc định (0.5)
                    backdropFilter: 'blur(7px)' // Làm mờ mạnh hơn
                }
            }}
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                    alignItems: 'center', // Fix Box bị kéo giãn
                    justifyContent: 'space-between',
                    padding: '24px',
                    backgroundImage: 'linear-gradient(90deg, #2563eb 0%, #4f46e5 100%)'
                }}
            >
                <Box>
                    <Typography
                        sx={{
                            fontSize: '15px',
                            fontWeight: '600',
                            color: '#deeafd'
                        }}
                    >
                        {t('COMMON.COUPON.TITLE')}
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: '22px',
                            color: 'white',
                            fontWeight: 'bold'
                        }}
                    >
                        {coupon.couponCode}
                    </Typography>

                    <Box
                        sx={{
                            display: 'flex',
                            gap: '10px',
                            mt: '5px',
                            alignItems: 'center'
                        }}
                    >
                        <Typography
                            sx={{
                                borderRadius: '9999px',
                                backgroundColor: '#4779cc',
                                color: '#a6ffd8',
                                fontSize: '13px',
                                fontWeight: 'bold',
                                padding: '6px 14px'
                            }}
                        >
                            {t('COMMON.COUPON.DISCOUNT')}{' '}
                            {coupon.discountType === 'fixed'
                                ? formatCurrency(coupon.discountValue)
                                : coupon.discountValue + '%'}
                        </Typography>

                        <Typography
                            sx={{
                                color: 'white',
                                fontSize: '15px'
                            }}
                        >
                            {t('COMMON.COUPON.MINIMUM')} {formatCurrency(coupon.minimumOrderValue)}
                        </Typography>
                    </Box>
                </Box>

                <TagIcon
                    size={90}
                    color='#5e5be8'
                    style={{
                        opacity: 0.6,
                        position: 'absolute',
                        top: '20px',
                        right: '150px'
                    }}
                />

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px',
                        marginBottom: 'auto',
                        justifyContent: 'center',
                        padding: '5px 10px',
                        borderRadius: '8px',
                        backgroundColor: '#5d5df4'
                    }}
                >
                    <Typography
                        sx={{
                            color: 'white',
                            fontSize: '14px'
                        }}
                    >
                        {t('COMMON.COUPON.CREATED_BY')}:
                    </Typography>
                    <Typography
                        sx={{
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: 'bold'
                        }}
                    >
                        {coupon.createdBy}
                    </Typography>
                </Box>
            </DialogTitle>

            <DialogContent
                sx={{
                    backgroundColor: 'var(--background-color)',
                    overflow: 'hidden'
                }}
            >
                <Tabs
                    value={tab}
                    onChange={(e, newValue) => setTab(newValue)}
                    sx={{
                        margin: '12px 0px',
                        width: 'fit-content',
                        backgroundColor: 'var(--background-color-component)',
                        height: '42px',
                        minHeight: '42px',
                        borderRadius: '10px',
                        '& .MuiTabs-indicator': { display: 'none' }
                    }}
                >
                    <Tab
                        label={t('COMMON.INFORMATION')}
                        value='info'
                        icon={<TicketIcon size={17} />}
                        iconPosition='start'
                        sx={{
                            display: 'flex',
                            height: '42px',
                            minHeight: '42px',
                            color: 'var(--text-color)',
                            padding: '0px 20px',
                            fontWeight: 'bold',
                            borderRadius: '10px',
                            textTransform: 'none',
                            border: '2px solid transparent',
                            '&.Mui-selected': {
                                backgroundColor: 'var(--background-color)',
                                color: 'var(--text-color)',
                                border: '2px solid var(--border-color)'
                            }
                        }}
                    />
                    <Tab
                        label={t('COMMON.STATISTICS')}
                        value='statistic'
                        icon={<TrendingUpIcon size={17} />}
                        iconPosition='start'
                        sx={{
                            display: 'flex',
                            height: '42px',
                            minHeight: '42px',
                            borderRadius: '10px',
                            color: 'var(--text-color)',
                            fontWeight: 'bold',
                            padding: '0px 20px',
                            textTransform: 'none',
                            border: '2px solid transparent',
                            '&.Mui-selected': {
                                backgroundColor: 'var(--background-color)',
                                color: 'var(--text-color)',
                                border: '2px solid var(--border-color)'
                            }
                        }}
                    />
                    <Tab
                        label={t('COMMON.COUPON.ORDERS')}
                        value='orders'
                        icon={<UsersIcon size={17} />}
                        iconPosition='start'
                        sx={{
                            display: 'flex',
                            height: '42px',
                            minHeight: '42px',
                            padding: '0px 20px',
                            color: 'var(--text-color)',
                            fontWeight: 'bold',
                            borderRadius: '10px',
                            textTransform: 'none',
                            border: '2px solid transparent',
                            '&.Mui-selected': {
                                backgroundColor: 'var(--background-color)',
                                color: 'var(--text-color)',
                                border: '2px solid var(--border-color)'
                            }
                        }}
                    />
                </Tabs>

                <Divider
                    sx={{
                        width: 'full-width',
                        margin: '0 -24px',
                        borderColor: 'var(--border-color)'
                    }}
                />

                {tab === 'info' && (
                    <Box
                        sx={{
                            display: 'flex',
                            gap: '16px',
                            paddingTop: '20px',
                            width: '100%',
                            flexDirection: 'column'
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                width: '100%',
                                gap: '16px'
                            }}
                        >
                            <InfoCard
                                label={t('COMMON.COUPON.DISCOUNT_TYPE')}
                                value={
                                    coupon.discountType === 'fixed'
                                        ? t('COMMON.COUPON.FIXED_AMOUNT') + ' (VND)'
                                        : t('COMMON.COUPON.PERCENTAGE') + ' (%)'
                                }
                                icon={<TagIcon size={18} color='#728096' />}
                            />

                            <InfoCard
                                label={t('COMMON.COUPON.DISCOUNT_VALUE')}
                                value={
                                    coupon.discountType === 'fixed'
                                        ? formatCurrency(coupon.discountValue)
                                        : coupon.discountValue + '%'
                                }
                                highlight={true}
                                icon={<TagIcon size={18} color='#728096' />}
                            />
                        </Box>

                        <Box
                            sx={{
                                display: 'flex',
                                width: '100%',
                                gap: '16px'
                            }}
                        >
                            <InfoCard
                                label={t('COMMON.COUPON.MAXIMUM_DISCOUNT')}
                                value={formatCurrency(coupon.maximumDiscount)}
                                icon={<DiamondPlus size={18} color='#728096' />}
                            />

                            <InfoCard
                                label={t('COMMON.COUPON.MINIMUM_ORDER_VALUE')}
                                value={formatCurrency(coupon.minimumOrderValue)}
                                icon={<DiamondMinus size={18} color='#728096' />}
                            />
                        </Box>

                        <Box
                            sx={{
                                display: 'flex',
                                width: '100%',
                                gap: '16px'
                            }}
                        >
                            <InfoCard
                                label={t('COMMON.COUPON.START_DATE')}
                                value={formatDate(coupon.activationDate)}
                                icon={<CalendarIcon size={18} color='#728096' />}
                            />

                            <InfoCard
                                label={t('COMMON.COUPON.END_DATE')}
                                value={formatDate(coupon.expiryDate)}
                                icon={<CalendarIcon size={18} color='#728096' />}
                            />
                        </Box>
                    </Box>
                )}

                {tab === 'statistic' && (
                    <Box
                        sx={{
                            display: 'flex',
                            gap: '20px',
                            paddingTop: '24px',
                            width: '100%'
                        }}
                    >
                        <Paper
                            sx={{
                                padding: '15px 20px',
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                backgroundColor: 'var(--background-color-item)',
                                gap: '6px',
                                borderRadius: '10px'
                            }}
                        >
                            <Typography
                                sx={{
                                    fontWeight: 'bold',
                                    fontSize: '15px',
                                    color: 'var(--text-color)'
                                }}
                            >
                                {t('COMMON.COUPON.USAGE_STATUS')}
                            </Typography>

                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: '8px',
                                    alignItems: 'center'
                                }}
                            >
                                <Typography
                                    sx={{
                                        color: 'var(--text-color)',
                                        fontWeight: 'bold',
                                        fontSize: '30px'
                                    }}
                                >
                                    {coupon.usageCount}
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: '15px',
                                        color: 'var(--label-title-color)',
                                        mt: '7px'
                                    }}
                                >
                                    / {coupon.usageLimit ? coupon.usageLimit : '∞'}
                                </Typography>
                            </Box>

                            <LinearProgress
                                variant='determinate'
                                value={(coupon.usageCount / coupon.usageLimit) * 100} // Giá trị % (thay đổi theo nhu cầu)
                                sx={{
                                    height: 10, // Độ cao của thanh
                                    borderRadius: '10px',
                                    backgroundColor: '#f1f5f9', // Màu nền của thanh progress
                                    '& .MuiLinearProgress-bar': {
                                        borderRadius: '10px',
                                        backgroundColor: '#4285F4' // Màu xanh của thanh progress
                                    }
                                }}
                            />

                            <Box
                                sx={{
                                    display: 'flex',
                                    mt: '5px',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: '15px',
                                        color: 'var(--label-title-color)'
                                    }}
                                >
                                    {formatDivision(coupon.usageCount, coupon.usageLimit)}% {t('COMMON.COUPON.USED')}
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: '15px',
                                        color: 'var(--label-title-color)'
                                    }}
                                >
                                    {coupon.usageLimit - coupon.usageCount} {t('COMMON.COUPON.REMAINING_USES')}
                                </Typography>
                            </Box>
                        </Paper>

                        <Paper
                            sx={{
                                padding: '20px',
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                backgroundColor: 'var(--background-color-item)',
                                gap: '10px',
                                borderRadius: '10px'
                            }}
                        >
                            <Typography
                                sx={{
                                    fontWeight: 'bold',
                                    fontSize: '15px',
                                    color: 'var(--text-color)'
                                }}
                            >
                                {t('COMMON.COUPON.TOTAL_DISCOUNT')}
                            </Typography>

                            <Typography
                                sx={{
                                    fontWeight: 'bold',
                                    color: 'var(--text-color)',
                                    fontSize: '30px'
                                }}
                            >
                                {formatCurrency(coupon.discountValue)}
                            </Typography>

                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px'
                                }}
                            >
                                <UsersIcon size={16} color='var(--label-title-color)' />
                                <Typography
                                    sx={{
                                        fontSize: '15px',
                                        color: 'var(--label-title-color)'
                                    }}
                                >
                                    {t('COMMON.COUPON.AVERAGE', { 0: formatCurrency(average) })}
                                </Typography>
                            </Box>
                        </Paper>
                    </Box>
                )}

                {tab === 'orders' && (
                    <Box
                        sx={{
                            pt: '20px'
                        }}
                    >
                        <Box
                            sx={{
                                borderRadius: '8px',
                                border: '1px solid var(--border-color)',
                                overflow: 'hidden'
                            }}
                        >
                            <TableContainer
                                sx={{
                                    maxHeight: '295px',
                                    '&::-webkit-scrollbar': {
                                        width: '7px',
                                        height: '7px',
                                        backgroundColor: 'var(--background-color)'
                                    },
                                    '&::-webkit-scrollbar-thumb': {
                                        backgroundColor: 'var(--scrollbar-color)',
                                        borderRadius: '10px'
                                    },
                                    backgroundColor: 'var(--background-color)',
                                    overflow: 'auto'
                                }}
                            >
                                <Table stickyHeader>
                                    <TableHead
                                        sx={{
                                            position: 'sticky',
                                            top: 0,
                                            zIndex: 1,
                                            width: '100%'
                                        }}
                                    >
                                        <TableRow
                                            sx={{
                                                backgroundColor: 'var(--background-color-table-header)',
                                                '&:last-child td, &:last-child th': {
                                                    border: 'none'
                                                },
                                                width: '100%'
                                            }}
                                        >
                                            <TableCell
                                                sx={{
                                                    padding: '14px 16px',
                                                    fontWeight: 'bold',
                                                    borderRight: 'none',
                                                    backgroundColor: 'var(--header-table)',
                                                    color: 'var(--text-color)',
                                                    border: 'none'
                                                }}
                                            >
                                                {t('COMMON.COUPON.ORDER_CODE')}
                                            </TableCell>

                                            <TableCell
                                                sx={{
                                                    padding: '14px 16px',
                                                    fontWeight: 'bold',
                                                    backgroundColor: 'var(--header-table)',
                                                    color: 'var(--text-color)',
                                                    border: 'none'
                                                }}
                                            >
                                                {t('COMMON.COUPON.CUSTOMER')}
                                            </TableCell>

                                            <TableCell
                                                sx={{
                                                    padding: '14px 16px',
                                                    fontWeight: 'bold',
                                                    backgroundColor: 'var(--header-table)',
                                                    color: 'var(--text-color)',
                                                    border: 'none'
                                                }}
                                            >
                                                {t('COMMON.COUPON.ORDER_DATE')}
                                            </TableCell>

                                            <TableCell
                                                sx={{
                                                    padding: '14px 16px',
                                                    fontWeight: 'bold',
                                                    textAlign: 'right',
                                                    backgroundColor: 'var(--header-table)',
                                                    color: 'var(--text-color)',
                                                    border: 'none'
                                                }}
                                            >
                                                {t('COMMON.COUPON.ORDER_TOTAL')}
                                            </TableCell>

                                            <TableCell
                                                sx={{
                                                    padding: '14px 16px',
                                                    fontWeight: 'bold',
                                                    textAlign: 'right',
                                                    backgroundColor: 'var(--header-table)',
                                                    color: 'var(--text-color)',
                                                    border: 'none'
                                                }}
                                            >
                                                {t('COMMON.COUPON.DISCOUNTED')}
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {couponOrders.length > 0 ? (
                                            couponOrders.map((order, index) => (
                                                <TableRow
                                                    key={index}
                                                    sx={{
                                                        '&:last-child td, &:last-child th': {
                                                            border: 'none'
                                                        },
                                                        transition: 'background-color 60ms ease-in-out',
                                                        backgroundColor:
                                                            index % 2 === 1
                                                                ? 'var(--background-color-table-body)'
                                                                : 'transparent',
                                                        '&:hover': {
                                                            backgroundColor: 'var(--hover-color-table-body) !important'
                                                        }
                                                    }}
                                                >
                                                    <TableCell
                                                        sx={{
                                                            borderColor: 'var(--border-color)',
                                                            padding: '12px 16px',
                                                            fontWeight: 'bold',
                                                            color: '#2865eb'
                                                        }}
                                                    >
                                                        {order.orderCode}
                                                    </TableCell>
                                                    <TableCell
                                                        sx={{
                                                            borderColor: 'var(--border-color)',
                                                            color: 'var(--text-color)',
                                                            padding: '12px 16px'
                                                        }}
                                                    >
                                                        {order.customerName}
                                                    </TableCell>
                                                    <TableCell
                                                        sx={{
                                                            borderColor: 'var(--border-color)',
                                                            color: 'var(--text-color)',
                                                            padding: '12px 16px'
                                                        }}
                                                    >
                                                        {new Date(order.orderDate).toLocaleDateString('vi-VN', {
                                                            day: '2-digit',
                                                            month: '2-digit',
                                                            year: 'numeric'
                                                        })}
                                                    </TableCell>
                                                    <TableCell
                                                        sx={{
                                                            borderColor: 'var(--border-color)',
                                                            color: 'var(--text-color)',
                                                            padding: '12px 16px',
                                                            textAlign: 'right'
                                                        }}
                                                    >
                                                        {formatCurrency(order.totalAmount)}
                                                    </TableCell>
                                                    <TableCell
                                                        sx={{
                                                            borderColor: 'var(--border-color)',
                                                            padding: '12px 16px',
                                                            fontWeight: 'bold',
                                                            textAlign: 'right',
                                                            color: '#16a34a'
                                                        }}
                                                    >
                                                        -{formatCurrency(order.discountAmount)}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={5} className='h-32 text-center text-slate-500'>
                                                    <div className='flex flex-col items-center justify-center'>
                                                        <div className='rounded-full bg-slate-100 dark:bg-slate-800 p-3 mb-3'>
                                                            <TicketIcon size={24} className='text-slate-400' />
                                                        </div>
                                                        <p>Chưa có đơn hàng nào sử dụng mã giảm giá này</p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>

                        {couponOrders.length > 0 && (
                            <Typography
                                sx={{
                                    mt: '15px',
                                    color: 'var(--label-title-color)',
                                    textAlign: 'right',
                                    fontSize: '14px'
                                }}
                            >
                                Hiển thị tất cả {couponOrders.length} đơn hàng
                            </Typography>
                        )}
                    </Box>
                )}
            </DialogContent>

            <DialogActions
                sx={{
                    padding: '18px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    borderTop: '1px solid var(--border-color)',
                    backgroundColor: 'var(--background-color)',
                    justifyContent: 'space-between'
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        gap: '10px',
                        ml: '4px',
                        alignItems: 'center'
                    }}
                >
                    <Box
                        sx={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: isExpired ? '#e82323' : isLimited ? '#ff9e22' : 'var(--active-color)'
                        }}
                    />
                    <Typography
                        sx={{
                            fontSize: '15px',
                            color: isExpired ? '#e82323' : isLimited ? '#ff9e22' : 'var(--active-color)'
                        }}
                    >
                        {!isExpired
                            ? !isLimited
                                ? t('COMMON.COUPON.COUPON_ACTIVATING')
                                : t('COMMON.COUPON.COUPON_LIMIT_REACHED')
                            : t('COMMON.COUPON.COUPON_EXPIRED')}
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        gap: '20px'
                    }}
                >
                    <Button
                        variant='contained'
                        sx={{
                            backgroundColor: 'var(--background-color-button-save)',
                            width: 'auto',
                            padding: '6px 30px',
                            fontSize: '16px',
                            '&:hover': {
                                backgroundColor: 'var(--background-color-button-save-hover)'
                            },
                            borderRadius: '8px',
                            color: 'var(--text-color-button-save)',
                            fontWeight: 'bold',
                            whiteSpace: 'nowrap',
                            textTransform: 'none'
                        }}
                    >
                        {t('COMMON.BUTTON.UPDATE')}
                    </Button>

                    <Button
                        variant='contained'
                        sx={{
                            backgroundColor: 'var(--background-color-button-cancel)',
                            width: 'auto',
                            fontSize: '16px',
                            '&:hover': {
                                backgroundColor: 'var(--background-color-button-cancel-hover)'
                            },
                            borderRadius: '8px',
                            padding: '6px 30px',
                            fontWeight: 'bold',
                            whiteSpace: 'nowrap',
                            color: 'var(--text-color-button-cancel)',
                            textTransform: 'none'
                        }}
                        onClick={onClose}
                    >
                        {t('COMMON.BUTTON.CLOSE')}
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    )
}

export default CouponDetailDialog
