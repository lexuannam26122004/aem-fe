'use client'

import { Avatar, Box, Typography } from '@mui/material'
import { Flame, ScanBarcode, StarIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { keyframes } from '@emotion/react'

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

function getStatusBgColor(status: string): string {
    if (status === 'out_of_stock') {
        return 'var(--background-color-cancel)'
    } else if (status === 'low_stock') {
        return 'var(--background-color-pending)'
    } else {
        return 'var(--background-color-success)'
    }
}

function getBorderColor(status: string): string {
    if (status === 'out_of_stock') {
        return '1px solid var(--border-color-cancel)'
    } else if (status === 'low_stock') {
        return '1px solid var(--border-color-pending)'
    } else {
        return '1px solid var(--border-color-success)'
    }
}

function getStatusTextColor(status: string): string {
    if (status === 'out_of_stock') {
        return 'var(--text-color-cancel)'
    } else if (status === 'low_stock') {
        return 'var(--text-color-pending)'
    } else {
        return 'var(--text-color-success)'
    }
}

interface ITopProduct {
    productName: string
    sku: string
    soldCount: number
    rating: number
    status: string
    image: string
}

interface TopProductsProps {
    data: ITopProduct[]
}

export function TopProducts({ data }: TopProductsProps) {
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
                    key={index}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mt: index === 0 ? '0' : '24px',
                        gap: '16px'
                    }}
                >
                    <Avatar
                        src={item.image}
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
                                    border: getBorderColor(item.status),
                                    display: 'flex',
                                    justifyContent: 'center',
                                    backgroundColor: getStatusBgColor(item.status)
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: '13px',
                                        overflow: 'hidden',
                                        color: getStatusTextColor(item.status),
                                        width: 'auto',
                                        fontWeight: 'bold',
                                        display: 'inline-block',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {item.status === 'in_stock'
                                        ? t('COMMON.PRODUCT.IN_STOCK')
                                        : item.status === 'out_of_stock'
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
                                        maxWidth: '260px',
                                        mt: '2px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {item.sku}
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
