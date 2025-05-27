'use client'

import { Box } from '@mui/material'
import { BadgeCheckIcon, StarIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface Props {
    customerRank: string
    padding?: string
    iconSize?: number
    fontSize?: string
}

export default function GetStyleCustomer({ customerRank, padding, iconSize, fontSize }: Props) {
    const { t } = useTranslation('common')

    padding = padding || '5px 14px'
    iconSize = iconSize || 16
    fontSize = fontSize || '13px'

    switch (customerRank) {
        case 'gold':
            return (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: padding,
                        color: 'white',
                        fontSize: fontSize,
                        justifyContent: 'center',
                        borderRadius: '9999px',
                        fontWeight: 'bold',
                        backgroundColor: '#ffcb2e'
                    }}
                >
                    <StarIcon className='mr-1' size={iconSize} />
                    {t('COMMON.CUSTOMER.GOLD_CUSTOMER')}
                </Box>
            )
        case 'silver':
            return (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        justifyContent: 'center',
                        padding: padding,
                        color: '#2d2d2d',
                        fontSize: fontSize,
                        borderRadius: '9999px',
                        fontWeight: 'bold',
                        backgroundColor: '#e9e9e9'
                    }}
                >
                    <StarIcon className='mr-1' size={iconSize} />
                    {t('COMMON.CUSTOMER.SILVER_CUSTOMER')}
                </Box>
            )
        default:
            return (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '5px',
                        padding: padding,
                        color: 'white',
                        fontSize: fontSize,
                        borderRadius: '9999px',
                        fontWeight: 'bold',
                        backgroundColor: '#4ade80'
                    }}
                >
                    <BadgeCheckIcon className='mr-1' size={iconSize} />
                    {t('COMMON.CUSTOMER.NEW_CUSTOMER')}
                </Box>
            )
    }
}
