'use client'

import { IProduct } from '@/models/Product'
import { Avatar, Box, Typography } from '@mui/material'
import { Barcode, Flame, ScanBarcode, ShoppingBag, StarIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { keyframes } from '@emotion/react'

const data: IProduct[] = [
    {
        id: 1,
        serialNumber: 'SN-001',
        images: ['https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-1.webp'],
        discountRate: 10,
        discountPrice: 900000,
        price: 1000000,
        description: 'Máy đo nhiệt độ công nghiệp chính xác cao',
        productName: 'Cảm biến nhiệt độ PT100',
        categoryName: 'Cảm biến',
        supplierName: 'SensorTech VN',
        unit: 'cái',
        warrantyPeriod: 12,
        stockQuantity: 50,
        soldCount: 120,
        rating: 4.5,
        createdAt: '2024-09-01T10:00:00Z',
        createdBy: 'admin',
        minStockThreshold: 10
    },
    {
        id: 2,
        serialNumber: 'SN-002',
        images: ['https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-2.webp'],
        discountRate: 5,
        discountPrice: 1900000,
        price: 2000000,
        description: 'Bộ điều khiển lập trình PLC Siemens S7-1200',
        productName: 'PLC Siemens S7-1200',
        categoryName: 'PLC',
        supplierName: 'Siemens Vietnam',
        unit: 'bộ',
        warrantyPeriod: 24,
        stockQuantity: 20,
        soldCount: 75,
        rating: 4.7,
        createdAt: '2024-09-05T09:00:00Z',
        createdBy: 'admin',
        minStockThreshold: 10
    },
    {
        id: 3,
        serialNumber: 'SN-003',
        images: ['https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-3.webp'],
        discountRate: 15,
        discountPrice: 850000,
        price: 1000000,
        description: 'Cảm biến tiệm cận loại NPN 12V',
        productName: 'Cảm biến tiệm cận Omron',
        categoryName: 'Cảm biến',
        supplierName: 'Omron',
        unit: 'cái',
        warrantyPeriod: 18,
        stockQuantity: 100,
        soldCount: 230,
        rating: 4.2,
        createdAt: '2024-08-21T14:30:00Z',
        createdBy: 'admin',
        minStockThreshold: 10
    },
    {
        id: 4,
        serialNumber: 'SN-004',
        images: ['https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-4.webp'],
        discountRate: 20,
        discountPrice: 400000,
        price: 500000,
        description: 'Relay trung gian 8 chân',
        productName: 'Relay trung gian IDEC',
        categoryName: 'Relay',
        supplierName: 'IDEC Japan',
        unit: 'cái',
        warrantyPeriod: 6,
        stockQuantity: 200,
        soldCount: 310,
        rating: 4.1,
        createdAt: '2024-08-11T08:00:00Z',
        createdBy: 'admin',
        minStockThreshold: 10
    },
    {
        id: 5,
        serialNumber: 'SN-005',
        images: ['https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-5.webp'],
        discountRate: 0,
        discountPrice: 1500000,
        price: 1500000,
        description: 'Biến tần 1 pha vào 3 pha ra',
        productName: 'Biến tần Delta VFD007EL21A',
        categoryName: 'Biến tần',
        supplierName: 'Delta Electronics',
        unit: 'cái',
        warrantyPeriod: 24,
        stockQuantity: 30,
        soldCount: 60,
        rating: 4.6,
        createdAt: '2024-07-30T16:00:00Z',
        createdBy: 'admin',
        minStockThreshold: 10
    }
]

const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.3);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`

function getStatusBgColor(row: IProduct): string {
    if (row.stockQuantity === 0) {
        return 'var(--background-color-cancel)'
    } else if (row.stockQuantity <= row.minStockThreshold) {
        return 'var(--background-color-pending)'
    } else {
        return 'var(--background-color-success)'
    }
}

function getBorderColor(row: IProduct): string {
    if (row.stockQuantity === 0) {
        return '1px solid var(--border-color-cancel)'
    } else if (row.stockQuantity <= row.minStockThreshold) {
        return '1px solid var(--border-color-pending)'
    } else {
        return '1px solid var(--border-color-success)'
    }
}

function getStatusTextColor(row: IProduct): string {
    if (row.stockQuantity === 0) {
        return 'var(--text-color-cancel)'
    } else if (row.stockQuantity <= row.minStockThreshold) {
        return 'var(--text-color-pending)'
    } else {
        return 'var(--text-color-success)'
    }
}

export function TopProducts() {
    const { t } = useTranslation('common')
    return (
        <>
            <Typography
                sx={{
                    color: 'var(--text-color)',
                    fontWeight: 'bold',
                    fontSize: '18px',
                    mb: '24px',
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                {t('COMMON.HOME.TOP_PRODUCTS')}
            </Typography>

            {data.map((item, index) => (
                <Box
                    key={item.id}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mt: index === 0 ? '0' : '24px',
                        gap: '16px'
                    }}
                >
                    <Avatar
                        src={item.images[0]}
                        sx={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '8px'
                        }}
                    />

                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', mb: '4px' }}>
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
                                {item.productName}
                            </Typography>

                            <Box
                                sx={{
                                    borderRadius: '6px',
                                    padding: '3px 7px',
                                    border: getBorderColor(item),
                                    display: 'flex',
                                    justifyContent: 'center',
                                    backgroundColor: getStatusBgColor(item)
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: '13px',
                                        overflow: 'hidden',
                                        color: getStatusTextColor(item),
                                        width: 'auto',
                                        fontWeight: 'bold',
                                        display: 'inline-block',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {item.minStockThreshold < item.stockQuantity
                                        ? t('COMMON.PRODUCT.IN_STOCK')
                                        : item.stockQuantity === 0
                                        ? t('COMMON.PRODUCT.OUT_OF_STOCK')
                                        : t('COMMON.PRODUCT.LOW_STOCK')}
                                </Typography>
                            </Box>
                        </Box>

                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '15px'
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px'
                                }}
                            >
                                <ScanBarcode size={16} color='var(--label-title-color)' />

                                <Typography
                                    sx={{
                                        color: 'var(--text-color)',
                                        fontSize: '13px',
                                        maxWidth: '280px',
                                        mt: '2px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {item.serialNumber}
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px'
                                }}
                            >
                                <Flame size={16} color='var(--error-color)' fill='var(--error-color)' />

                                <Typography
                                    sx={{
                                        fontSize: '13px',
                                        textTransform: 'lowercase',
                                        mt: '2px',
                                        color: 'var(--text-color)'
                                    }}
                                >
                                    {item.soldCount} {t('COMMON.PRODUCT.SOLD')}
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px'
                                }}
                            >
                                <StarIcon size={16} color='#ffb81e' fill='#ffb81e' />

                                <Typography
                                    sx={{
                                        mt: '2px',
                                        fontSize: '13px',
                                        color: 'var(--text-color)'
                                    }}
                                >
                                    {item.rating}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            ml: 'auto',
                            padding: '10px',
                            backgroundColor:
                                index === 0
                                    ? 'rgba(12, 104, 233, 0.08)'
                                    : index === 1
                                    ? 'rgba(0, 184, 217, 0.08)'
                                    : 'rgba(255, 86, 48, 0.08)',
                            borderRadius: '50%',
                            animation: index === 0 ? `${pulse} 1.5s infinite` : 'none'
                        }}
                    >
                        {index === 0 && (
                            <Avatar
                                src='/images/first.svg'
                                style={{
                                    width: '24px',
                                    height: '24px'
                                }}
                            />
                        )}

                        {index === 1 && (
                            <Avatar
                                src='/images/second.svg'
                                style={{
                                    width: '24px',
                                    height: '24px'
                                }}
                            />
                        )}

                        {index >= 2 && (
                            <Avatar
                                src='/images/third.svg'
                                style={{
                                    width: '24px',
                                    height: '24px'
                                }}
                            />
                        )}
                    </Box>
                </Box>
            ))}
        </>
    )
}
