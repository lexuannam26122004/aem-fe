'use client'

import { Avatar, Box, Typography } from '@mui/material'
import { PackagePlus, ScanBarcode, StarIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { keyframes } from '@emotion/react'
import { ITopPurchasesProducts } from '@/models/SupplierReports'

const data: ITopPurchasesProducts[] = [
    {
        id: 1,
        serialNumber: 'SN-001',
        images: ['https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-1.webp'],
        description: 'Máy đo nhiệt độ công nghiệp chính xác cao',
        productName: 'Cảm biến nhiệt độ PT100',
        warrantyPeriod: 12,
        stockQuantity: 50,
        purchasedCount: 155,
        minStockThreshold: 10,
        rating: 4.5,
        warrantyCount: 23,
        warrantyRate: 0.19
    },
    {
        id: 2,
        serialNumber: 'SN-002',
        images: ['https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-2.webp'],
        description: 'Bộ điều khiển lập trình PLC Siemens S7-1200',
        productName: 'PLC Siemens S7-1200',
        warrantyPeriod: 24,
        stockQuantity: 20,
        purchasedCount: 75,
        minStockThreshold: 10,
        rating: 4.7,
        warrantyCount: 2,
        warrantyRate: 0.03
    },
    {
        id: 3,
        serialNumber: 'SN-003',
        images: ['https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-3.webp'],
        description: 'Cảm biến tiệm cận loại NPN 12V',
        productName: 'Cảm biến tiệm cận Omron',
        warrantyPeriod: 18,
        stockQuantity: 100,
        purchasedCount: 230,
        minStockThreshold: 10,
        rating: 4.2,
        warrantyCount: 30,
        warrantyRate: 0.13
    },
    {
        id: 4,
        serialNumber: 'SN-004',
        images: ['https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-4.webp'],
        description: 'Relay trung gian 8 chân',
        productName: 'Relay trung gian IDEC',
        warrantyPeriod: 6,
        stockQuantity: 200,
        purchasedCount: 310,
        minStockThreshold: 10,
        rating: 4.1,
        warrantyCount: 31,
        warrantyRate: 0.1
    },
    {
        id: 5,
        serialNumber: 'SN-005',
        images: ['https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-5.webp'],
        description: 'Biến tần 1 pha vào 3 pha ra',
        productName: 'Biến tần Delta VFD007EL21A - 1 pha vào, 3 pha ra',
        warrantyPeriod: 24,
        stockQuantity: 30,
        purchasedCount: 60,
        minStockThreshold: 10,
        rating: 4.6,
        warrantyCount: 5,
        warrantyRate: 0.08
    },
    {
        id: 6,
        serialNumber: 'SN-006',
        images: ['https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-6.webp'],
        description: 'Cầu chì bảo vệ mạch điện công nghiệp',
        productName: 'Cầu chì Bussmann 10A 500V',
        warrantyPeriod: 12,
        stockQuantity: 100,
        purchasedCount: 90,
        minStockThreshold: 20,
        rating: 4.4,
        warrantyCount: 13,
        warrantyRate: 0.14
    },
    {
        id: 7,
        serialNumber: 'SN-007',
        images: ['https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-7.webp'],
        description: 'Khởi động từ dùng cho điều khiển động cơ',
        productName: 'Khởi động từ Schneider LC1D09',
        warrantyPeriod: 18,
        stockQuantity: 60,
        purchasedCount: 150,
        minStockThreshold: 15,
        rating: 4.5,
        warrantyCount: 21,
        warrantyRate: 0.14
    },
    {
        id: 8,
        serialNumber: 'SN-008',
        images: ['https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-8.webp'],
        description: 'Bộ nguồn chuyển mạch 24V dùng cho tủ điện',
        productName: 'Nguồn tổ ong Mean Well 24V 10A',
        warrantyPeriod: 24,
        stockQuantity: 40,
        purchasedCount: 85,
        minStockThreshold: 10,
        rating: 4.3,
        warrantyCount: 8,
        warrantyRate: 0.09
    },
    {
        id: 9,
        serialNumber: 'SN-009',
        images: ['https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-9.webp'],
        description: 'Công tắc hành trình cơ học loại thường mở',
        productName: 'Công tắc hành trình Omron Z-15GQ22',
        warrantyPeriod: 12,
        stockQuantity: 120,
        purchasedCount: 140,
        minStockThreshold: 20,
        rating: 4.2,
        warrantyCount: 20,
        warrantyRate: 0.14
    },
    {
        id: 10,
        serialNumber: 'SN-010',
        images: ['https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-10.webp'],
        description: 'Máy đóng cắt dùng cho hệ thống tủ điện hạ thế',
        productName: 'MCB ABB S203-C32 3P 32A',
        warrantyPeriod: 24,
        stockQuantity: 25,
        purchasedCount: 55,
        minStockThreshold: 5,
        rating: 4.6,
        warrantyCount: 9,
        warrantyRate: 0.16
    },
    {
        id: 11,
        serialNumber: 'SN-0011',
        images: ['https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-11.webp'],
        description: 'Máy đo nhiệt độ công nghiệp chính xác cao',
        productName: 'Cảm biến nhiệt độ PT100',
        warrantyPeriod: 12,
        stockQuantity: 50,
        purchasedCount: 120,
        minStockThreshold: 10,
        rating: 4.5,
        warrantyCount: 23,
        warrantyRate: 0.19
    },
    {
        id: 12,
        serialNumber: 'SN-0012',
        images: ['https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-12.webp'],
        description: 'Bộ điều khiển lập trình PLC Siemens S7-1200',
        productName: 'PLC Siemens S7-1200',
        warrantyPeriod: 24,
        stockQuantity: 20,
        purchasedCount: 75,
        minStockThreshold: 10,
        rating: 4.7,
        warrantyCount: 2,
        warrantyRate: 0.03
    },
    {
        id: 13,
        serialNumber: 'SN-0013',
        images: ['https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-13.webp'],
        description: 'Cảm biến tiệm cận loại NPN 12V',
        productName: 'Cảm biến tiệm cận Omron',
        warrantyPeriod: 18,
        stockQuantity: 100,
        purchasedCount: 230,
        minStockThreshold: 10,
        rating: 4.2,
        warrantyCount: 30,
        warrantyRate: 0.13
    },
    {
        id: 14,
        serialNumber: 'SN-0014',
        images: ['https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-14.webp'],
        description: 'Relay trung gian 8 chân',
        productName: 'Relay trung gian IDEC',
        warrantyPeriod: 6,
        stockQuantity: 200,
        purchasedCount: 310,
        minStockThreshold: 10,
        rating: 4.1,
        warrantyCount: 31,
        warrantyRate: 0.1
    },
    {
        id: 15,
        serialNumber: 'SN-0015',
        images: ['https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-15.webp'],
        description: 'Biến tần 1 pha vào 3 pha ra',
        productName: 'Biến tần Delta VFD007EL21A - 1 pha vào, 3 pha ra',
        warrantyPeriod: 24,
        stockQuantity: 30,
        purchasedCount: 60,
        minStockThreshold: 10,
        rating: 4.6,
        warrantyCount: 5,
        warrantyRate: 0.08
    },
    {
        id: 16,
        serialNumber: 'SN-0016',
        images: ['https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-16.webp'],
        description: 'Cầu chì bảo vệ mạch điện công nghiệp',
        productName: 'Cầu chì Bussmann 10A 500V',
        warrantyPeriod: 12,
        stockQuantity: 100,
        purchasedCount: 90,
        minStockThreshold: 20,
        rating: 4.4,
        warrantyCount: 13,
        warrantyRate: 0.14
    },
    {
        id: 17,
        serialNumber: 'SN-0017',
        images: ['https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-17.webp'],
        description: 'Khởi động từ dùng cho điều khiển động cơ',
        productName: 'Khởi động từ Schneider LC1D09',
        warrantyPeriod: 18,
        stockQuantity: 60,
        purchasedCount: 150,
        minStockThreshold: 15,
        rating: 4.5,
        warrantyCount: 21,
        warrantyRate: 0.14
    },
    {
        id: 18,
        serialNumber: 'SN-0018',
        images: ['https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-18.webp'],
        description: 'Bộ nguồn chuyển mạch 24V dùng cho tủ điện',
        productName: 'Nguồn tổ ong Mean Well 24V 10A',
        warrantyPeriod: 24,
        stockQuantity: 40,
        purchasedCount: 85,
        minStockThreshold: 10,
        rating: 4.3,
        warrantyCount: 8,
        warrantyRate: 0.09
    },
    {
        id: 19,
        serialNumber: 'SN-0019',
        images: ['https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-19.webp'],
        description: 'Công tắc hành trình cơ học loại thường mở',
        productName: 'Công tắc hành trình Omron Z-15GQ22',
        warrantyPeriod: 12,
        stockQuantity: 120,
        purchasedCount: 140,
        minStockThreshold: 20,
        rating: 4.2,
        warrantyCount: 20,
        warrantyRate: 0.14
    },
    {
        id: 20,
        serialNumber: 'SN-020',
        images: ['https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-20.webp'],
        description: 'Máy đóng cắt dùng cho hệ thống tủ điện hạ thế',
        productName: 'MCB ABB S203-C32 3P 32A',
        warrantyPeriod: 24,
        stockQuantity: 25,
        purchasedCount: 55,
        minStockThreshold: 5,
        rating: 4.6,
        warrantyCount: 9,
        warrantyRate: 0.16
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

function getStatusBgColor(row: ITopPurchasesProducts): string {
    if (row.stockQuantity === 0) {
        return 'var(--background-color-cancel)'
    } else if (row.stockQuantity <= row.minStockThreshold) {
        return 'var(--background-color-pending)'
    } else {
        return 'var(--background-color-success)'
    }
}

function getBorderColor(row: ITopPurchasesProducts): string {
    if (row.stockQuantity === 0) {
        return '1px solid var(--border-color-cancel)'
    } else if (row.stockQuantity <= row.minStockThreshold) {
        return '1px solid var(--border-color-pending)'
    } else {
        return '1px solid var(--border-color-success)'
    }
}

function getStatusTextColor(row: ITopPurchasesProducts): string {
    if (row.stockQuantity === 0) {
        return 'var(--text-color-cancel)'
    } else if (row.stockQuantity <= row.minStockThreshold) {
        return 'var(--text-color-pending)'
    } else {
        return 'var(--text-color-success)'
    }
}

export default function TopPurchasedProducts() {
    const { t } = useTranslation('common')
    return (
        <Box
            sx={{
                height: '100%',
                paddingBottom: '10px',
                borderRadius: '15px',
                boxShadow: 'var(--box-shadow-paper)',
                backgroundColor: 'var(--background-color-item)'
            }}
        >
            <Typography
                sx={{
                    color: 'var(--text-color)',
                    fontWeight: 'bold',
                    fontSize: '18px',
                    padding: '24px',
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                {t('COMMON.INVENTORY_PRODUCTS_REPORTS.TOP_20_MOST_PURCHASED_PRODUCTS')}
            </Typography>

            <Box
                sx={{
                    overflowY: 'auto',
                    height: '700px',
                    scrollbarGutter: 'stable both-edges',
                    padding: '0 17px 14px',
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
                                        maxWidth: '260px',
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
                                    <PackagePlus size={16} color='#00B85E' />

                                    <Typography
                                        sx={{
                                            fontSize: '13px',
                                            textTransform: 'lowercase',
                                            mt: '2px',
                                            color: 'var(--text-color)'
                                        }}
                                    >
                                        {item.purchasedCount} {t('COMMON.INVENTORY_PRODUCTS_REPORTS.IMPORT_COUNT')}
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
            </Box>
        </Box>
    )
}
