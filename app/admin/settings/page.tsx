'use client'

import React, { useState } from 'react'
import {
    CreditCardIcon,
    PhoneIcon,
    MapPinHouse,
    Mail,
    Newspaper,
    MessageCircle,
    Package,
    Info,
    MonitorCog,
    Store,
    SaveIcon
} from 'lucide-react'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { Box, Button, Paper, TextField, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { FiFacebook, FiGlobe, FiInstagram, FiKey, FiRefreshCw, FiTruck } from 'react-icons/fi'

// Định nghĩa kiểu dữ liệu
interface ShopSettings {
    email: {
        address: string
        password: string
        smtpServer: string
        senderName: string
    }
    shop: {
        name: string
        logo: string
        favicon: string
        phone: string
        address: string
        socialLinks: {
            facebook: string
            zalo: string
            instagram: string
        }
        shippingPolicy: string
        returnPolicy: string
        description: string
    }
    payment: {
        methods: string[]
    }
}

export default function Page() {
    const { t } = useTranslation('common')

    const [settings, setSettings] = useState<ShopSettings>({
        email: {
            address: 'info@shopfinity.com',
            password: '********', // để fake, bạn có thể bỏ hoặc mã hóa
            smtpServer: 'smtp.shopfinity.com',
            senderName: 'Shopfinity Team'
        },
        shop: {
            name: 'Shopfinity',
            logo: '/assets/logo.png', // giả định file ảnh đã upload
            favicon: '/assets/favicon.ico', // giả định favicon đã setup
            phone: '0123 456 789',
            address: '111A/1, đường số 38, Hiệp Bình Chánh, Thủ Đức, TP.HCM',
            socialLinks: {
                facebook: 'https://facebook.com/shopfinityvn',
                zalo: 'https://zalo.me/1234567890',
                instagram: 'https://instagram.com/shopfinity.vn'
            },
            shippingPolicy: 'Miễn phí vận chuyển cho đơn hàng trên 500.000đ. Thời gian giao hàng từ 2-5 ngày làm việc.',
            returnPolicy: 'Đổi trả trong vòng 7 ngày kể từ ngày nhận hàng nếu sản phẩm bị lỗi do nhà sản xuất.',
            description:
                'Nhà cung cấp thiết bị điện tử và giải pháp tự động hóa hàng đầu Việt Nam. Chúng tôi mang đến những sản phẩm chất lượng cao và dịch vụ hoàn hảo.'
        },
        payment: {
            methods: ['cod', 'vnpay']
        }
    })

    return (
        <Box
            sx={{
                maxWidth: '1200px',
                margin: '0 auto',
                backgroundColor: 'var(--background-color-component)',
                borderRadius: '0 0 15px 15px',
                mt: '20px',
                mb: '20px'
            }}
        >
            <Box
                sx={{
                    padding: '30px',
                    backgroundImage: 'linear-gradient(90deg, #2563eb 0%, #4f46e5 100%)'
                }}
            >
                <Typography
                    sx={{
                        fontSize: '22px',
                        color: 'white',
                        fontWeight: 'bold'
                    }}
                >
                    {t('COMMON.STORE_SETTINGS.TITLE')}
                </Typography>

                <Typography
                    sx={{
                        fontSize: '15px',
                        mt: '5px',
                        color: '#e8e8e8'
                    }}
                >
                    {t('COMMON.STORE_SETTINGS.DESCRIPTION')}
                </Typography>
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    padding: '30px',
                    flexDirection: 'column',
                    gap: '24px'
                }}
            >
                <Paper
                    sx={{
                        borderRadius: '15px',
                        padding: '24px',
                        backgroundColor: 'var(--background-color-item)'
                    }}
                >
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}
                        >
                            <Typography
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    fontSize: '18px',
                                    gap: '8px',
                                    color: 'var(--text-color)',
                                    fontWeight: 'bold'
                                }}
                            >
                                <Newspaper
                                    size={18}
                                    style={{
                                        color: 'var(--primary-color)'
                                    }}
                                />
                                {t('COMMON.STORE_INFO.BASE_INFO')}
                            </Typography>
                        </Box>

                        <Box>
                            <Typography
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    fontSize: '14px',
                                    mb: '5px',
                                    gap: '8px',
                                    color: 'var(--text-color)',
                                    fontWeight: 'bold'
                                }}
                            >
                                <Store
                                    size={14}
                                    style={{
                                        color: 'var(--primary-color)'
                                    }}
                                />
                                {t('COMMON.EMAIL_SETTINGS.STORE_NAME')}
                            </Typography>
                            <TextField
                                variant='outlined'
                                value={settings.shop.name}
                                placeholder={t('COMMON.EMAIL_SETTINGS.STORE_DISPLAY_NAME')}
                                sx={{
                                    width: '100%',
                                    '& fieldset': {
                                        borderRadius: '8px',
                                        color: 'var(--text-color)',
                                        borderColor: 'var(--border-color)'
                                    },
                                    '& .MuiInputBase-root': {
                                        paddingRight: '3px'
                                    },
                                    '& .MuiInputBase-input': {
                                        paddingRight: '8px',
                                        py: '14px',
                                        color: 'var(--text-color)',
                                        fontSize: '15px',
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
                                onChange={e => {
                                    setSettings({ ...settings, shop: { ...settings.shop, name: e.target.value } })
                                }}
                            />
                        </Box>

                        <Box>
                            <Typography
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    fontSize: '14px',
                                    mb: '5px',
                                    gap: '8px',
                                    color: 'var(--text-color)',
                                    fontWeight: 'bold'
                                }}
                            >
                                <PhoneIcon
                                    size={14}
                                    style={{
                                        color: 'var(--primary-color)'
                                    }}
                                />
                                {t('COMMON.CUSTOMER.PHONE')}
                            </Typography>

                            <TextField
                                variant='outlined'
                                placeholder='0987654321'
                                sx={{
                                    width: '100%',
                                    '& fieldset': {
                                        borderRadius: '8px',
                                        color: 'var(--text-color)',
                                        borderColor: 'var(--border-color)'
                                    },
                                    '& .MuiInputBase-root': {
                                        paddingRight: '3px'
                                    },
                                    '& .MuiInputBase-input': {
                                        paddingRight: '8px',
                                        py: '14px',
                                        color: 'var(--text-color)',
                                        fontSize: '15px',
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
                                value={settings.shop.phone}
                                onChange={e => {
                                    setSettings({ ...settings, shop: { ...settings.shop, phone: e.target.value } })
                                }}
                            />
                        </Box>

                        <Box>
                            <Typography
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    fontSize: '14px',
                                    mb: '5px',
                                    gap: '8px',
                                    color: 'var(--text-color)',
                                    fontWeight: 'bold'
                                }}
                            >
                                <MapPinHouse
                                    size={14}
                                    style={{
                                        color: 'var(--primary-color)'
                                    }}
                                />
                                {t('COMMON.CUSTOMER.ADDRESS')}
                            </Typography>
                            <TextField
                                variant='outlined'
                                placeholder={t('COMMON.EMAIL_SETTINGS.STORE_ADDRESS')}
                                sx={{
                                    width: '100%',
                                    '& fieldset': {
                                        borderRadius: '8px',
                                        color: 'var(--text-color)',
                                        borderColor: 'var(--border-color)'
                                    },
                                    '& .MuiInputBase-root': {
                                        paddingRight: '3px'
                                    },
                                    '& .MuiInputBase-input': {
                                        paddingRight: '8px',
                                        py: '14px',
                                        color: 'var(--text-color)',
                                        fontSize: '15px',
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
                                value={settings.shop.address}
                                onChange={e => {
                                    setSettings({ ...settings, shop: { ...settings.shop, address: e.target.value } })
                                }}
                            />
                        </Box>
                    </Box>
                </Paper>

                <Paper
                    sx={{
                        borderRadius: '15px',
                        padding: '24px',
                        backgroundColor: 'var(--background-color-item)'
                    }}
                >
                    <Typography
                        sx={{
                            display: 'flex',
                            mb: '15px',
                            alignItems: 'center',
                            fontSize: '18px',
                            gap: '8px',
                            color: 'var(--text-color)',
                            fontWeight: 'bold'
                        }}
                    >
                        <FiGlobe
                            size={18}
                            style={{
                                color: 'var(--primary-color)'
                            }}
                        />
                        {t('COMMON.SOCIAL_LINKS.SOCIAL_LINKS')}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: '24px' }}>
                        <Box
                            sx={{
                                flex: 1
                            }}
                        >
                            <Typography
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    fontSize: '14px',
                                    mb: '5px',
                                    gap: '8px',
                                    color: 'var(--text-color)',
                                    fontWeight: 'bold'
                                }}
                            >
                                <FiFacebook
                                    size={14}
                                    style={{
                                        color: 'var(--primary-color)'
                                    }}
                                />
                                {'Facebook'}
                            </Typography>

                            <TextField
                                variant='outlined'
                                placeholder='facebook.com/your-page'
                                sx={{
                                    width: '100%',
                                    '& fieldset': {
                                        borderRadius: '8px',
                                        color: 'var(--text-color)',
                                        borderColor: 'var(--border-color)'
                                    },
                                    '& .MuiInputBase-root': {
                                        paddingRight: '3px'
                                    },
                                    '& .MuiInputBase-input': {
                                        paddingRight: '8px',
                                        py: '14px',
                                        color: 'var(--text-color)',
                                        fontSize: '15px',
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
                                value={settings.shop.socialLinks.facebook}
                                onChange={e => {
                                    setSettings({
                                        ...settings,
                                        shop: {
                                            ...settings.shop,
                                            socialLinks: { ...settings.shop.socialLinks, facebook: e.target.value }
                                        }
                                    })
                                }}
                            />
                        </Box>

                        <Box
                            sx={{
                                flex: 1
                            }}
                        >
                            <Typography
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    fontSize: '14px',
                                    mb: '5px',
                                    gap: '8px',
                                    color: 'var(--text-color)',
                                    fontWeight: 'bold'
                                }}
                            >
                                <MessageCircle
                                    size={14}
                                    style={{
                                        color: 'var(--primary-color)'
                                    }}
                                />
                                {'Zalo'}
                            </Typography>

                            <TextField
                                variant='outlined'
                                placeholder='zalo.me/your-id'
                                sx={{
                                    width: '100%',
                                    '& fieldset': {
                                        borderRadius: '8px',
                                        color: 'var(--text-color)',
                                        borderColor: 'var(--border-color)'
                                    },
                                    '& .MuiInputBase-root': {
                                        paddingRight: '3px'
                                    },
                                    '& .MuiInputBase-input': {
                                        paddingRight: '8px',
                                        py: '14px',
                                        color: 'var(--text-color)',
                                        fontSize: '15px',
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
                                value={settings.shop.socialLinks.zalo}
                                onChange={e => {
                                    setSettings({
                                        ...settings,
                                        shop: {
                                            ...settings.shop,
                                            socialLinks: { ...settings.shop.socialLinks, zalo: e.target.value }
                                        }
                                    })
                                }}
                            />
                        </Box>

                        <Box
                            sx={{
                                flex: 1
                            }}
                        >
                            <Typography
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    fontSize: '14px',
                                    mb: '5px',
                                    gap: '8px',
                                    color: 'var(--text-color)',
                                    fontWeight: 'bold'
                                }}
                            >
                                <FiInstagram
                                    size={14}
                                    style={{
                                        color: 'var(--primary-color)'
                                    }}
                                />
                                {'Instagram'}
                            </Typography>
                            <TextField
                                variant='outlined'
                                placeholder='instagram.com/your-account'
                                sx={{
                                    width: '100%',
                                    '& fieldset': {
                                        borderRadius: '8px',
                                        color: 'var(--text-color)',
                                        borderColor: 'var(--border-color)'
                                    },
                                    '& .MuiInputBase-root': {
                                        paddingRight: '3px'
                                    },
                                    '& .MuiInputBase-input': {
                                        paddingRight: '8px',
                                        py: '14px',
                                        color: 'var(--text-color)',
                                        fontSize: '15px',
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
                                value={settings.shop.socialLinks.instagram}
                                onChange={e => {
                                    setSettings({
                                        ...settings,
                                        shop: {
                                            ...settings.shop,
                                            socialLinks: { ...settings.shop.socialLinks, instagram: e.target.value }
                                        }
                                    })
                                }}
                            />
                        </Box>
                    </Box>
                </Paper>

                <Paper
                    sx={{
                        borderRadius: '15px',
                        padding: '24px',
                        backgroundColor: 'var(--background-color-item)'
                    }}
                >
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}
                        >
                            <Typography
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    fontSize: '18px',
                                    gap: '8px',
                                    color: 'var(--text-color)',
                                    fontWeight: 'bold'
                                }}
                            >
                                <Package
                                    size={18}
                                    style={{
                                        color: 'var(--primary-color)'
                                    }}
                                />
                                {t('COMMON.STORE_POLICY.STORE_POLICY')}
                            </Typography>
                        </Box>

                        <Box>
                            <Typography
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    fontSize: '14px',
                                    mb: '5px',
                                    gap: '8px',
                                    color: 'var(--text-color)',
                                    fontWeight: 'bold'
                                }}
                            >
                                <Newspaper
                                    size={14}
                                    style={{
                                        color: 'var(--primary-color)'
                                    }}
                                />
                                {t('COMMON.STORE_POLICY.STORE_DESCRIPTION')}
                            </Typography>
                            <TextField
                                variant='outlined'
                                placeholder={t('COMMON.STORE_POLICY.ABOUT_STORE')}
                                multiline
                                minRows={3}
                                maxRows={5}
                                sx={{
                                    width: '100%',
                                    '& fieldset': {
                                        borderRadius: '8px',
                                        color: 'var(--text-color)',
                                        borderColor: 'var(--border-color)'
                                    },
                                    '& .MuiInputBase-root': {
                                        padding: '0 3px 0 14px'
                                    },
                                    '& .MuiInputBase-input': {
                                        paddingRight: '8px',
                                        py: '14px',
                                        color: 'var(--text-color)',
                                        fontSize: '15px',
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
                                value={settings.shop.description}
                                onChange={e => {
                                    setSettings({
                                        ...settings,
                                        shop: { ...settings.shop, description: e.target.value }
                                    })
                                }}
                            />
                        </Box>

                        <Box>
                            <Typography
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    fontSize: '14px',
                                    mb: '5px',
                                    gap: '8px',
                                    color: 'var(--text-color)',
                                    fontWeight: 'bold'
                                }}
                            >
                                <FiTruck
                                    size={14}
                                    style={{
                                        color: 'var(--primary-color)'
                                    }}
                                />
                                {t('COMMON.SHIPPING_POLICY.SHIPPING_POLICY')}
                            </Typography>

                            <TextField
                                variant='outlined'
                                placeholder={t('COMMON.SHIPPING_POLICY.DELIVERY_TIME')}
                                multiline
                                minRows={3}
                                maxRows={5}
                                sx={{
                                    width: '100%',
                                    '& fieldset': {
                                        borderRadius: '8px',
                                        color: 'var(--text-color)',
                                        borderColor: 'var(--border-color)'
                                    },
                                    '& .MuiInputBase-root': {
                                        padding: '0 3px 0 14px'
                                    },
                                    '& .MuiInputBase-input': {
                                        paddingRight: '8px',
                                        py: '14px',
                                        color: 'var(--text-color)',
                                        fontSize: '15px',
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
                                value={settings.shop.shippingPolicy}
                                onChange={e => {
                                    setSettings({
                                        ...settings,
                                        shop: { ...settings.shop, shippingPolicy: e.target.value }
                                    })
                                }}
                            />
                        </Box>

                        <Box>
                            <Typography
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    fontSize: '14px',
                                    mb: '5px',
                                    gap: '8px',
                                    color: 'var(--text-color)',
                                    fontWeight: 'bold'
                                }}
                            >
                                <FiRefreshCw
                                    size={14}
                                    style={{
                                        color: 'var(--primary-color)'
                                    }}
                                />
                                {t('COMMON.RETURN_POLICY.RETURN_POLICY')}
                            </Typography>
                            <TextField
                                variant='outlined'
                                placeholder={t('COMMON.RETURN_POLICY.RETURN_RULES')}
                                multiline
                                minRows={3}
                                maxRows={5}
                                sx={{
                                    width: '100%',
                                    '& fieldset': {
                                        borderRadius: '8px',
                                        color: 'var(--text-color)',
                                        borderColor: 'var(--border-color)'
                                    },
                                    '& .MuiInputBase-root': {
                                        padding: '0 3px 0 14px'
                                    },
                                    '& .MuiInputBase-input': {
                                        paddingRight: '8px',
                                        py: '14px',
                                        color: 'var(--text-color)',
                                        fontSize: '15px',
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
                                value={settings.shop.returnPolicy}
                                onChange={e => {
                                    setSettings({
                                        ...settings,
                                        shop: { ...settings.shop, returnPolicy: e.target.value }
                                    })
                                }}
                            />
                        </Box>
                    </Box>
                </Paper>

                <Paper
                    sx={{
                        borderRadius: '15px',
                        padding: '24px',
                        backgroundColor: 'var(--background-color-item)'
                    }}
                >
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <Typography
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                fontSize: '18px',
                                gap: '8px',
                                color: 'var(--text-color)',
                                fontWeight: 'bold'
                            }}
                        >
                            <Mail
                                size={18}
                                style={{
                                    color: 'var(--primary-color)'
                                }}
                            />
                            {t('COMMON.EMAIL_SETTINGS.EMAIL_SETTINGS')}
                        </Typography>

                        <Box
                            sx={{
                                borderRadius: '8px',
                                borderLeft: '4px solid var(--primary-color)',
                                backgroundColor: '#e6f2fe',
                                display: 'flex',
                                gap: '10px',
                                alignItems: 'center',
                                padding: '16px'
                            }}
                        >
                            <Info
                                size={17}
                                style={{
                                    color: 'var(--primary-color)'
                                }}
                            />
                            <Typography
                                sx={{
                                    color: 'var(--primary-color)',
                                    fontSize: '14px'
                                }}
                            >
                                {t('COMMON.EMAIL_SETTINGS.EMAIL_DESCRIPTION')}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', gap: '24px' }}>
                            <Box
                                sx={{
                                    flex: 1
                                }}
                            >
                                <Typography
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        fontSize: '14px',
                                        mb: '5px',
                                        gap: '8px',
                                        color: 'var(--text-color)',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    <MonitorCog
                                        size={14}
                                        style={{
                                            color: 'var(--primary-color)'
                                        }}
                                    />
                                    {t('COMMON.EMAIL_SETTINGS.EMAIL_ADDRESS')}
                                </Typography>

                                <TextField
                                    variant='outlined'
                                    placeholder='example@domain.com'
                                    sx={{
                                        width: '100%',
                                        '& fieldset': {
                                            borderRadius: '8px',
                                            color: 'var(--text-color)',
                                            borderColor: 'var(--border-color)'
                                        },
                                        '& .MuiInputBase-root': {
                                            paddingRight: '3px'
                                        },
                                        '& .MuiInputBase-input': {
                                            paddingRight: '8px',
                                            py: '14px',
                                            color: 'var(--text-color)',
                                            fontSize: '15px',
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
                                    value={settings.email.address}
                                    onChange={e => {
                                        setSettings({
                                            ...settings,
                                            email: { ...settings.email, address: e.target.value }
                                        })
                                    }}
                                />

                                <Typography
                                    sx={{
                                        fontSize: '12px',
                                        color: 'var(--label-title-color)',
                                        mt: '4px'
                                    }}
                                >
                                    {t('COMMON.EMAIL_SETTINGS.EMAIL_USAGE')}
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    flex: 1
                                }}
                            >
                                <Typography
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        fontSize: '14px',
                                        mb: '5px',
                                        gap: '8px',
                                        color: 'var(--text-color)',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    <Info
                                        size={14}
                                        style={{
                                            color: 'var(--primary-color)'
                                        }}
                                    />
                                    {t('COMMON.EMAIL_SETTINGS.SENDER_NAME')}
                                </Typography>

                                <TextField
                                    variant='outlined'
                                    placeholder={t('COMMON.EMAIL_SETTINGS.STORE_DISPLAY_NAME')}
                                    sx={{
                                        width: '100%',
                                        '& fieldset': {
                                            borderRadius: '8px',
                                            color: 'var(--text-color)',
                                            borderColor: 'var(--border-color)'
                                        },
                                        '& .MuiInputBase-root': {
                                            paddingRight: '3px'
                                        },
                                        '& .MuiInputBase-input': {
                                            paddingRight: '8px',
                                            py: '14px',
                                            color: 'var(--text-color)',
                                            fontSize: '15px',
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
                                    value={settings.email.senderName}
                                    onChange={e => {
                                        setSettings({
                                            ...settings,
                                            email: { ...settings.email, senderName: e.target.value }
                                        })
                                    }}
                                />

                                <Typography
                                    sx={{
                                        fontSize: '12px',
                                        color: 'var(--label-title-color)',
                                        mt: '4px'
                                    }}
                                >
                                    {t('COMMON.EMAIL_SETTINGS.SENDER_DISPLAY')}
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', gap: '24px' }}>
                            <Box
                                sx={{
                                    flex: 1
                                }}
                            >
                                <Typography
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        fontSize: '14px',
                                        mb: '5px',
                                        gap: '8px',
                                        color: 'var(--text-color)',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    <FiKey
                                        size={14}
                                        style={{
                                            color: 'var(--primary-color)'
                                        }}
                                    />
                                    {t('COMMON.EMAIL_SETTINGS.EMAIL_PASSWORD')}
                                </Typography>

                                <TextField
                                    variant='outlined'
                                    type='password'
                                    placeholder='••••••••'
                                    sx={{
                                        width: '100%',
                                        '& fieldset': {
                                            borderRadius: '8px',
                                            color: 'var(--text-color)',
                                            borderColor: 'var(--border-color)'
                                        },
                                        '& .MuiInputBase-root': {
                                            paddingRight: '3px'
                                        },
                                        '& .MuiInputBase-input': {
                                            paddingRight: '8px',
                                            py: '14px',
                                            color: 'var(--text-color)',
                                            fontSize: '15px',
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
                                    value={settings.email.password}
                                    onChange={e => {
                                        setSettings({
                                            ...settings,
                                            email: { ...settings.email, password: e.target.value }
                                        })
                                    }}
                                />

                                <Typography
                                    sx={{
                                        fontSize: '12px',
                                        color: 'var(--label-title-color)',
                                        mt: '4px'
                                    }}
                                >
                                    {t('COMMON.EMAIL_SETTINGS.EMAIL_PASSWORD_DESC')}
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    flex: 1
                                }}
                            >
                                <Typography
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        fontSize: '14px',
                                        mb: '5px',
                                        gap: '8px',
                                        color: 'var(--text-color)',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    <FiGlobe
                                        size={14}
                                        style={{
                                            color: 'var(--primary-color)'
                                        }}
                                    />
                                    {t('COMMON.EMAIL_SETTINGS.SMTP_SERVER')}
                                </Typography>

                                <TextField
                                    variant='outlined'
                                    placeholder='smtp.domain.com'
                                    sx={{
                                        width: '100%',
                                        '& fieldset': {
                                            borderRadius: '8px',
                                            color: 'var(--text-color)',
                                            borderColor: 'var(--border-color)'
                                        },
                                        '& .MuiInputBase-root': {
                                            paddingRight: '3px'
                                        },
                                        '& .MuiInputBase-input': {
                                            paddingRight: '8px',
                                            py: '14px',
                                            color: 'var(--text-color)',
                                            fontSize: '15px',
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
                                    value={settings.email.smtpServer}
                                    onChange={e => {
                                        setSettings({
                                            ...settings,
                                            email: { ...settings.email, smtpServer: e.target.value }
                                        })
                                    }}
                                />

                                <Typography
                                    sx={{
                                        fontSize: '12px',
                                        color: 'var(--label-title-color)',
                                        mt: '4px'
                                    }}
                                >
                                    {t('COMMON.EMAIL_SETTINGS.SMTP_DESC')}
                                </Typography>
                            </Box>
                        </Box>

                        <Button
                            startIcon={<FiRefreshCw />}
                            sx={{
                                display: 'flex',
                                width: 'max-content',
                                textAlign: 'center',
                                alignItems: 'center',
                                gap: '3px',
                                backgroundColor: 'var(--background-color-button-save)',
                                '&:hover': {
                                    backgroundColor: 'var(--background-color-button-save-hover)'
                                },
                                color: 'var(--text-color-button-save)',
                                justifyContent: 'center',
                                padding: '10px 20px',
                                mt: '2px',
                                fontSize: '15px',
                                borderRadius: '8px',
                                fontWeight: 'bold',
                                textTransform: 'none'
                            }}
                        >
                            {t('COMMON.EMAIL_SETTINGS.CHECK_CONNECTION')}
                        </Button>
                    </Box>
                </Paper>

                <Paper
                    sx={{
                        borderRadius: '15px',
                        padding: '24px',
                        backgroundColor: 'var(--background-color-item)'
                    }}
                >
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <Typography
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                fontSize: '18px',
                                gap: '8px',
                                color: 'var(--text-color)',
                                fontWeight: 'bold'
                            }}
                        >
                            <CreditCardIcon
                                size={18}
                                style={{
                                    color: 'var(--primary-color)'
                                }}
                            />
                            {t('COMMON.CUSTOMER.PAYMENT_METHOD')}
                        </Typography>

                        <Box
                            sx={{
                                display: 'flex',
                                gap: '24px',
                                alignItems: 'center'
                            }}
                        >
                            <Box
                                sx={{
                                    border: settings.payment.methods.includes('vnpay')
                                        ? '2px solid var(--primary-color)'
                                        : '2px solid var(--border-color)',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        backgroundColor: 'var(--background-color-item-hover)',
                                        borderColor: settings.payment.methods.includes('vnpay')
                                            ? 'var(--primary-color)'
                                            : 'var(--background-color-item-hover)'
                                    },
                                    flex: 1,
                                    display: 'flex',
                                    backgroundColor: settings.payment.methods.includes('vnpay')
                                        ? 'var(--background-color-item-selected)'
                                        : 'var(--background-color-item)',
                                    borderRadius: '10px',
                                    alignItems: 'center',
                                    padding: '15px 18px',
                                    gap: '15px',
                                    position: 'relative'
                                }}
                                onClick={() =>
                                    setSettings({
                                        ...settings,
                                        payment: {
                                            methods: settings.payment.methods.includes('vnpay')
                                                ? settings.payment.methods.filter(x => x !== 'vnpay')
                                                : [...settings.payment.methods, 'vnpay']
                                        }
                                    })
                                }
                            >
                                <Box
                                    sx={{
                                        width: '40px',
                                        height: '40px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: '8px',
                                        color: '#3b82f6',
                                        backgroundColor: '#d2e4ff'
                                    }}
                                >
                                    <CreditCardIcon style={{ width: '20px', height: '20px' }} />
                                </Box>

                                <Box>
                                    <Typography
                                        sx={{
                                            fontWeight: 'bold',
                                            color: 'var(--text-color)',
                                            fontSize: '14px'
                                        }}
                                    >
                                        VNPAY
                                    </Typography>

                                    <Typography
                                        sx={{
                                            color: 'var(--label-title-color)',
                                            fontSize: '14px'
                                        }}
                                    >
                                        {t('COMMON.CUSTOMER.DIGITAL_WALLET')}
                                    </Typography>
                                </Box>

                                {settings.payment.methods.includes('vnpay') && (
                                    <CheckCircleIcon
                                        sx={{
                                            color: 'var(--primary-color)',
                                            marginLeft: 'auto',
                                            width: '26px',
                                            height: '26px'
                                        }}
                                    />
                                )}
                            </Box>

                            <Box
                                sx={{
                                    border: settings.payment.methods.includes('momo')
                                        ? '2px solid var(--primary-color)'
                                        : '2px solid var(--border-color)',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        backgroundColor: 'var(--background-color-item-hover)',
                                        borderColor: settings.payment.methods.includes('momo')
                                            ? 'var(--primary-color)'
                                            : 'var(--background-color-item-hover)'
                                    },
                                    flex: 1,
                                    display: 'flex',
                                    backgroundColor: settings.payment.methods.includes('momo')
                                        ? 'var(--background-color-item-selected)'
                                        : 'var(--background-color-item)',
                                    borderRadius: '10px',
                                    alignItems: 'center',
                                    padding: '15px 18px',
                                    gap: '15px',
                                    position: 'relative'
                                }}
                                onClick={() =>
                                    setSettings({
                                        ...settings,
                                        payment: {
                                            methods: settings.payment.methods.includes('momo')
                                                ? settings.payment.methods.filter(x => x !== 'momo')
                                                : [...settings.payment.methods, 'momo']
                                        }
                                    })
                                }
                            >
                                <Box
                                    sx={{
                                        width: '40px',
                                        height: '40px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: '8px',
                                        color: '#22c55e',
                                        backgroundColor: '#dcfce7'
                                    }}
                                >
                                    <CreditCardIcon style={{ width: '20px', height: '20px' }} />
                                </Box>

                                <Box>
                                    <Typography
                                        sx={{
                                            color: 'var(--text-color)',
                                            fontWeight: 'bold',
                                            fontSize: '14px'
                                        }}
                                    >
                                        MOMO
                                    </Typography>

                                    <Typography
                                        sx={{
                                            color: 'var(--label-title-color)',
                                            fontSize: '14px'
                                        }}
                                    >
                                        {t('COMMON.CUSTOMER.DIGITAL_WALLET')}
                                    </Typography>
                                </Box>

                                {settings.payment.methods.includes('momo') && (
                                    <CheckCircleIcon
                                        sx={{
                                            color: 'var(--primary-color)',
                                            marginLeft: 'auto',
                                            width: '26px',
                                            height: '26px'
                                        }}
                                    />
                                )}
                            </Box>

                            <Box
                                sx={{
                                    border: settings.payment.methods.includes('cod')
                                        ? '2px solid var(--primary-color)'
                                        : '2px solid var(--border-color)',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        backgroundColor: 'var(--background-color-item-hover)',
                                        borderColor: settings.payment.methods.includes('cod')
                                            ? 'var(--primary-color)'
                                            : 'var(--background-color-item-hover)'
                                    },
                                    flex: 1,
                                    display: 'flex',
                                    backgroundColor: settings.payment.methods.includes('cod')
                                        ? 'var(--background-color-item-selected)'
                                        : 'var(--background-color-item)',
                                    borderRadius: '10px',
                                    alignItems: 'center',
                                    padding: '15px 18px',
                                    gap: '15px',
                                    position: 'relative'
                                }}
                                onClick={() =>
                                    setSettings({
                                        ...settings,
                                        payment: {
                                            methods: settings.payment.methods.includes('cod')
                                                ? settings.payment.methods.filter(x => x !== 'cod')
                                                : [...settings.payment.methods, 'cod']
                                        }
                                    })
                                }
                            >
                                <Box
                                    sx={{
                                        width: '40px',
                                        height: '40px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: '8px',
                                        color: '#f59e0b',
                                        backgroundColor: '#fffedd'
                                    }}
                                >
                                    <CreditCardIcon style={{ width: '20px', height: '20px' }} />
                                </Box>

                                <Box>
                                    <Typography
                                        sx={{
                                            color: 'var(--text-color)',
                                            fontWeight: 'bold',
                                            fontSize: '14px'
                                        }}
                                    >
                                        COD
                                    </Typography>

                                    <Typography
                                        sx={{
                                            color: 'var(--label-title-color)',
                                            fontSize: '14px'
                                        }}
                                    >
                                        {t('COMMON.CUSTOMER.CASH')}
                                    </Typography>
                                </Box>

                                {settings.payment.methods.includes('cod') && (
                                    <CheckCircleIcon
                                        sx={{
                                            color: 'var(--primary-color)',
                                            marginLeft: 'auto',
                                            width: '26px',
                                            height: '26px'
                                        }}
                                    />
                                )}
                            </Box>
                        </Box>

                        <Box
                            sx={{
                                borderRadius: '8px',
                                mt: '5px',
                                borderLeft: '4px solid #f6bf01',
                                backgroundColor: '#fffedd',
                                display: 'flex',
                                gap: '10px',
                                alignItems: 'center',
                                padding: '16px'
                            }}
                        >
                            <Info size={17} color='#f6bf01' />
                            <Typography
                                sx={{
                                    color: '#f6bf01',
                                    fontSize: '14px'
                                }}
                            >
                                {t('COMMON.PAYMENT_SETTINGS.ONLINE_PAYMENT_INFO')}
                            </Typography>
                        </Box>
                    </Box>
                </Paper>

                <Button
                    variant='contained'
                    startIcon={<SaveIcon />}
                    sx={{
                        mt: '10px',
                        ml: 'auto',
                        height: '51px',
                        backgroundColor: 'var(--background-color-button-save)',
                        width: 'auto',
                        padding: '0px 30px',
                        '&:hover': {
                            backgroundColor: 'var(--background-color-button-save-hover)'
                        },
                        color: 'var(--text-color-button-save)',
                        fontSize: '15px',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap',
                        textTransform: 'none'
                    }}
                    onClick={() => {}}
                >
                    {t('COMMON.SAVE_SETTINGS')}
                </Button>
            </Box>
        </Box>
    )
}
