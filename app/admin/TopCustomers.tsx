'use client'

import { ICustomer } from '@/models/Customer'
import { Avatar, Box, Typography } from '@mui/material'
import { BadgeCheckIcon, PhoneCall, ShoppingBag, StarIcon } from 'lucide-react'
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
interface ITopCustomersProps {
    data: ICustomer[]
}

export function TopCustomers({ data }: ITopCustomersProps) {
    const { t } = useTranslation('common')

    const getRankBadge = (rank: string) => {
        switch (rank) {
            case 'gold_customer':
                return (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            whiteSpace: 'nowrap',
                            padding: '4px 8px',
                            color: 'white',
                            fontSize: '13px',
                            borderRadius: '6px',
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
            case 'silver_customer':
                return (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '4px 8px',
                            color: '#fff',
                            whiteSpace: 'nowrap',
                            fontSize: '13px',
                            borderRadius: '6px',
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
                            padding: '4px 8px',
                            color: 'white',
                            fontSize: '13px',
                            whiteSpace: 'nowrap',
                            borderRadius: '6px',
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
                {t('COMMON.HOME.TOP_CUSTOMERS')}
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
                        src={item.avatar}
                        sx={{
                            width: '48px',
                            height: '48px'
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
                                {item.fullName}
                            </Typography>

                            {getRankBadge(item.rank.toLowerCase())}
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
                                <PhoneCall size={16} color='var(--label-title-color)' />

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
                                    {item.phoneNumber}
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px'
                                }}
                            >
                                <ShoppingBag size={16} color='var(--primary-color)' />

                                <Typography
                                    sx={{
                                        fontSize: '13px',
                                        textTransform: 'lowercase',
                                        mt: '2px',
                                        color: 'var(--text-color)'
                                    }}
                                >
                                    {item.totalOrders} {t('COMMON.CUSTOMER.ORDER')}
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
