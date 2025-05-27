'use client'

import { ICustomer } from '@/models/Customer'
import { Avatar, Box, Typography } from '@mui/material'
import { BadgeCheckIcon, PhoneCall, ShoppingBag, StarIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { keyframes } from '@emotion/react'

const data: ICustomer[] = [
    {
        id: 1,
        username: 'johndoe',
        fullName: 'Lê Xuân Nam',
        email: 'johndoe@example.com',
        phoneNumber: '0987654321',
        address: '123 Đường ABC, Quận 1, TP.HCM',
        birthday: '1990-01-01',
        gender: true,
        avatarPath: 'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-1.webp',
        createdAt: '2023-03-01T10:00:00Z',
        rank: 'Gold',
        lastPurchase: '2025-04-10T14:30:00Z',
        totalOrders: 15,
        totalSpent: 35000000,
        isActive: true
    },
    {
        id: 2,
        username: 'janesmith',
        fullName: 'Vũ Thị Yến Nhi',
        email: 'jane.smith@example.com',
        phoneNumber: '0912345678',
        address: '456 Đường XYZ, Quận 3, Hà Nội',
        birthday: '1985-05-15',
        gender: false,
        avatarPath: 'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-12.webp',
        createdAt: '2022-08-12T09:15:00Z',
        rank: 'Platinum',
        lastPurchase: '2025-03-25T16:20:00Z',
        totalOrders: 30,
        totalSpent: 82000000,
        isActive: true
    },
    {
        id: 3,
        username: 'lequang',
        fullName: 'Lê Thị Tuyết Phương',
        email: 'lequang@example.com',
        phoneNumber: '0909123456',
        address: '789 Lý Thường Kiệt, Đà Nẵng',
        birthday: '1992-07-20',
        gender: true,
        avatarPath: 'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-16.webp',
        createdAt: '2024-01-05T12:00:00Z',
        rank: 'Silver',
        lastPurchase: '2025-04-05T10:45:00Z',
        totalOrders: 8,
        totalSpent: 18000000,
        isActive: true
    },
    {
        id: 4,
        username: 'ngothao',
        fullName: 'Ngô Thảo',
        email: 'ngothao@example.com',
        phoneNumber: '0932456789',
        address: '321 Nguyễn Huệ, Huế',
        birthday: '1995-11-30',
        gender: false,
        avatarPath: 'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-7.webp',
        createdAt: '2021-10-21T08:00:00Z',
        rank: 'Gold',
        lastPurchase: '2025-02-15T13:10:00Z',
        totalOrders: 20,
        totalSpent: 46000000,
        isActive: false
    },
    {
        id: 5,
        username: 'phamminh',
        fullName: 'Phạm Minh',
        email: 'phamminh@example.com',
        phoneNumber: '0968123456',
        address: '654 Lê Duẩn, Hải Phòng',
        birthday: '1988-03-10',
        gender: true,
        avatarPath: 'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-7.webp',
        createdAt: '2023-05-10T11:30:00Z',
        rank: 'Bronze',
        lastPurchase: '2025-05-01T09:50:00Z',
        totalOrders: 5,
        totalSpent: 9200000,
        isActive: true
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

export function TopCustomers() {
    const { t } = useTranslation('common')

    const getRankBadge = (rank: string) => {
        switch (rank) {
            case 'gold':
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
            case 'silver':
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
                        src={item.avatarPath}
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
