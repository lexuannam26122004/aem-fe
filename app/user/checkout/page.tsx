'use client'

import React, { useState } from 'react'
import {
    ShoppingBag,
    Trash2,
    CreditCard,
    Edit2,
    Mail,
    MapPin,
    Shield,
    CheckCircle2,
    AlertCircle,
    Info,
    Check,
    BadgeCheck,
    HelpingHand,
    User2,
    PhoneCall,
    House,
    Building
} from 'lucide-react'
import { formatCurrency } from '@/common/format'
import { useTranslation } from 'react-i18next'
import AddressManager from '@/components/AddressesModal'

const CheckoutPage = () => {
    const { t } = useTranslation('common')

    const products = [
        {
            id: 'P0001',
            productName: 'Bộ điều khiển nhiệt độ Autonics',
            sku: 'CTRL-AUT-TEMP',
            originalPrice: 1200000,
            discountPercentage: 5,
            productVariant: 'TCN4S-24R',
            productImage: 'https://api-prod-minimal-v700.pages.dev/assets/images/cover/cover-12.webp',
            price: '1.150.000 VND',
            quantity: 1
        },
        {
            id: 'P0002',
            productName: 'Cảm biến quang Keyence',
            sku: 'SENSOR-KYC',
            originalPrice: 1000000,
            discountPercentage: 5,
            productVariant: 'Màu xanh',
            productImage: 'https://api-prod-minimal-v700.pages.dev/assets/images/cover/cover-10.webp',
            price: '950.000 VND',
            quantity: 1
        },
        {
            id: 'P0003',
            productName: 'Biến tần ABB 3.7kW',
            sku: 'VFD-ABB-3K7',
            originalPrice: 6000000,
            discountPercentage: 8,
            productVariant: 'Loại 3.7kW',
            productImage: 'https://api-prod-minimal-v700.pages.dev/assets/images/cover/cover-11.webp',
            price: '5.500.000 VND',
            quantity: 1
        }
    ]

    // Order summary
    const [summary, setSummary] = useState({
        subTotal: 1190000,
        discountAmount: 50000,
        discountShippingFee: 50000,
        shippingFee: 200000,
        totalAmount: 1290000,
        taxes: 0
    })

    // Shipping address
    const shippingAddress = {
        fullName: 'Nguyễn Văn A',
        phone: '0912345678',
        email: 'nguyenvana@example.com',
        title: 'Nhà riêng',
        address: '123 Đường Nguyễn Huệ',
        district: 'Quận 1',
        city: 'TP. Hồ Chí Minh',
        note: ''
    }

    // Discount codes
    const [appliedDiscounts, setAppliedDiscounts] = useState([
        {
            id: 1,
            code: 'WELCOME20',
            description: 'Giảm 50.000₫ cho đơn hàng đầu tiên',
            amount: 50000
        }
    ])

    const [newDiscountCode, setNewDiscountCode] = useState('')
    const [discountError, setDiscountError] = useState('')
    const [discountSuccess, setDiscountSuccess] = useState('')

    // Payment methods
    const paymentMethods = [
        {
            id: 'cod',
            name: t('COMMON.USER.PAYMENT_COD_NAME'),
            description: t('COMMON.USER.PAYMENT_COD_DESCRIPTION'),
            logo: <img src='/images/dollar.png' className='w-10 h-10' />,
            additionalInfo: t('COMMON.USER.PAYMENT_COD_ADDITIONAL_INFO')
        },
        {
            id: 'vnpay',
            name: t('COMMON.USER.PAYMENT_VNPAY_NAME'),
            description: t('COMMON.USER.PAYMENT_VNPAY_DESCRIPTION'),
            logo: (
                <img src='/images/vnpay.svg' className='w-10 h-10 rounded-[8px] shadow-[0_4px_16px_rgba(0,0,0,0.1)]' />
            ),
            additionalInfo: t('COMMON.USER.PAYMENT_VNPAY_ADDITIONAL_INFO')
        },
        {
            id: 'momo',
            name: t('COMMON.USER.PAYMENT_MOMO_NAME'),
            description: t('COMMON.USER.PAYMENT_MOMO_DESCRIPTION'),
            logo: (
                <img
                    src='/images/momo_square_pinkbg.svg'
                    className='w-10 h-10 rounded-[8px] shadow-[0_4px_16px_rgba(0,0,0,0.1)]'
                />
            ),
            additionalInfo: t('COMMON.USER.PAYMENT_MOMO_ADDITIONAL_INFO')
        }
    ]

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cod')
    const [isOpenModel, setIsOpenModal] = useState(false)

    // Apply discount code
    const handleApplyDiscount = () => {
        if (!newDiscountCode.trim()) {
            setDiscountError(t('COMMON.USER.EMPTY_DISCOUNT_CODE'))
            return
        }

        // Check if code already applied
        if (appliedDiscounts.some(discount => discount.code === newDiscountCode)) {
            setDiscountError(t('COMMON.USER.DISCOUNT_ALREADY_APPLIED'))
            return
        }

        // Simulate API call - in real app would check with backend
        if (newDiscountCode === 'FREESHIP') {
            const newDiscount = {
                id: Date.now(),
                code: 'FREESHIP',
                description: 'Miễn phí vận chuyển',
                amount: 100000
            }

            setAppliedDiscounts([...appliedDiscounts, newDiscount])

            setSummary({
                ...summary,
                discountShippingFee: summary.discountShippingFee + 100000,
                totalAmount: summary.totalAmount - 100000
            })

            setDiscountSuccess(t('COMMON.USER.DISCOUNT_APPLIED_SUCCESS'))
            setDiscountError('')
            setNewDiscountCode('')

            // Clear success message after 3 seconds
            setTimeout(() => {
                setDiscountSuccess('')
            }, 3000)
        } else {
            setDiscountError(t('COMMON.USER.INVALID_DISCOUNT_CODE'))
        }
    }

    const handleRemoveDiscount = (discountId: number) => {
        const discountToRemove = appliedDiscounts.find(d => d.id === discountId)

        setAppliedDiscounts(appliedDiscounts.filter(discount => discount.id !== discountId))

        if (discountToRemove) {
            if (discountToRemove.code === 'WELCOME20') {
                setSummary({
                    ...summary,
                    discountAmount: summary.discountAmount - discountToRemove.amount,
                    totalAmount: summary.totalAmount + discountToRemove.amount
                })
            } else if (discountToRemove.code === 'FREESHIP') {
                setSummary({
                    ...summary,
                    discountShippingFee: summary.discountShippingFee - discountToRemove.amount,
                    totalAmount: summary.totalAmount + discountToRemove.amount
                })
            }
        }
    }

    const handlePaymentMethodChange = (methodId: string) => {
        setSelectedPaymentMethod(methodId)
    }

    const handlePlaceOrder = () => {}

    return (
        <div className='min-h-screen'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex flex-col lg:flex-row gap-6'>
                    {/* Main checkout content */}
                    <div className='w-full lg:w-2/3 space-y-6'>
                        {/* Shipping address */}
                        <div className='rounded-[15px] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.1)] bg-white'>
                            <div className='px-6 h-[66px] flex items-center justify-between border-b border-gray-100'>
                                <div className='flex items-center'>
                                    <MapPin className='w-5 h-5 text-blue-600 mr-3' />
                                    <h2 className='font-bold text-[18px] text-gray-800'>
                                        {t('COMMON.USER.SHIPPING_ADDRESS')}
                                    </h2>
                                </div>

                                <button
                                    onClick={() => {
                                        setIsOpenModal(true)
                                    }}
                                    className='text-blue-600 hover:text-blue-800 flex items-center font-medium px-4 py-2 rounded-[8px] hover:bg-blue-50'
                                >
                                    <Edit2 className='w-4 h-4 mr-2' />
                                    {t('COMMON.USER.CHANGE')}
                                </button>
                            </div>

                            <div className='p-6'>
                                <div className='bg-gray-50 rounded-[15px]'>
                                    <div className='p-6 space-y-3.5'>
                                        <div className='flex items-start'>
                                            <div className='min-w-[140px] text-gray-500'>
                                                {t('COMMON.USER.RECIPIENT')}
                                            </div>
                                            <div className='font-medium text-gray-900 flex items-center'>
                                                <User2 className='w-4 h-4 text-blue-600 mr-3' />
                                                {shippingAddress.fullName}
                                            </div>
                                        </div>

                                        <div className='flex items-start'>
                                            <div className='min-w-[140px] text-gray-500'>{t('COMMON.USER.PHONE')}</div>
                                            <div className='font-medium text-gray-900 flex items-center'>
                                                <PhoneCall className='w-4 h-4 text-blue-600 mr-3' />
                                                {shippingAddress.phone}
                                            </div>
                                        </div>

                                        <div className='flex items-start'>
                                            <div className='min-w-[140px] text-gray-500'>
                                                {t('COMMON.USER.ADDRESS_TITLE')}
                                            </div>
                                            <div className='font-medium text-gray-900 flex items-center'>
                                                <Building className='w-4 h-4 text-blue-600 mr-3' />
                                                {shippingAddress.title}
                                            </div>
                                        </div>

                                        <div className='flex items-start'>
                                            <div className='min-w-[140px] text-gray-500'>{t('COMMON.USER.EMAIL')}</div>
                                            <div className='font-medium text-gray-900 flex items-center'>
                                                <Mail className='w-4 h-4 text-blue-600 mr-3' />
                                                {shippingAddress.email}
                                            </div>
                                        </div>

                                        <div className='flex items-start'>
                                            <div className='min-w-[140px] text-gray-500'>
                                                {t('COMMON.USER.ADDRESS')}
                                            </div>
                                            <div className=''>
                                                <p className='font-medium text-gray-900 flex items-center'>
                                                    <House className='w-4 h-4 text-blue-600 mr-3' />
                                                    {shippingAddress.address}, {shippingAddress.district},{' '}
                                                    {shippingAddress.city}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className='mt-6 bg-blue-50 rounded-lg px-4 py-[13px] border-l-4 border-blue-600 flex gap-2'>
                                    <p className='font-bold text-gray-800 whitespace-nowrap'>
                                        {t('COMMON.PURCHASE_ORDER.NOTES')}:
                                    </p>
                                    <p className='text-gray-800 italic'>
                                        {shippingAddress.note.length ? shippingAddress.note : t('COMMON.USER.EMPTY')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Order items */}
                        <div className='rounded-[15px] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.1)] bg-white'>
                            <div className='px-6 h-[66px] flex items-center border-b border-gray-100'>
                                <ShoppingBag className='w-5 h-5 text-blue-600 mr-3' />
                                <h2 className='font-bold text-[18px] text-gray-800'>
                                    {t('COMMON.USER.ORDER_ITEMS', { count: products.length })}
                                </h2>
                            </div>

                            <div className='overflow-hidden space-y-5 p-6'>
                                {products.map((item, index) => (
                                    <div
                                        key={index}
                                        className='flex items-center gap-4 py-3 px-4 rounded-[12px] bg-gray-50 hover:bg-gray-100 transition-colors justify-between'
                                    >
                                        <div className='flex items-center'>
                                            <img
                                                src={item.productImage}
                                                className='w-[62px] h-[62px] rounded-[10px] border border-gray-200 object-cover'
                                            />
                                            <div className='ml-5 space-y-1'>
                                                <p className='font-medium text-md text-gray-900'>{item.productName}</p>
                                                <p className='text-gray-500 text-sm'>
                                                    SKU: <span className='text-black font-medium ml-1'>{item.sku}</span>
                                                </p>
                                                <p className='text-gray-500 text-sm'>
                                                    {t('COMMON.USER.PRODUCT_VARIANT')}:{' '}
                                                    <span className='text-black font-medium ml-1'>
                                                        {item.productVariant}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className='text-right'>
                                            <div className='flex items-center gap-2'>
                                                <p className='line-through text-gray-400'>
                                                    {formatCurrency(item.originalPrice)}
                                                </p>
                                                <p className='font-medium text-[#3675ff]'>{item.price}</p>
                                            </div>
                                            <p className='text-gray-500 mt-1'>
                                                {t('COMMON.USER.QUANTITY')}: {item.quantity}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className='rounded-[15px] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.1)] bg-white overflow-hidden'>
                            <div className='px-6 h-[66px] border-b border-gray-100 flex items-center'>
                                <CreditCard className='w-5 h-5 text-blue-600 mr-3' />
                                <h2 className='font-bold text-[18px] text-gray-800'>
                                    {t('COMMON.USER.PAYMENT_METHOD')}
                                </h2>
                            </div>

                            <div className='p-6'>
                                <div className='space-y-5'>
                                    {paymentMethods.map(method => (
                                        <div
                                            key={method.id}
                                            className={`group relative rounded-xl transition-all duration-300 ${
                                                selectedPaymentMethod === method.id
                                                    ? 'bg-white shadow-md border-0'
                                                    : 'bg-white shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:shadow'
                                            }`}
                                        >
                                            <div
                                                className='p-5 cursor-pointer'
                                                onClick={() => handlePaymentMethodChange(method.id)}
                                            >
                                                <div className='flex items-center'>
                                                    <div
                                                        className={`w-6 h-6 flex-shrink-0 rounded-full border ${
                                                            selectedPaymentMethod === method.id
                                                                ? 'border-blue-600 bg-blue-600'
                                                                : 'border-gray-300 group-hover:border-blue-400'
                                                        } flex items-center justify-center`}
                                                    >
                                                        {selectedPaymentMethod === method.id && (
                                                            <Check className='w-4 h-4 text-white' />
                                                        )}
                                                    </div>

                                                    <div className='ml-4 bg-white rounded-lg shadow-sm'>
                                                        {method.logo}
                                                    </div>

                                                    <div className='ml-4 flex-grow'>
                                                        <label className='font-medium text-gray-800 block'>
                                                            {method.name}
                                                        </label>
                                                        <p className='text-gray-500 text-sm'>{method.description}</p>
                                                    </div>
                                                </div>

                                                {selectedPaymentMethod === method.id && (
                                                    <div className='mt-4 pl-10'>
                                                        <div className='bg-blue-50 py-3 px-4 rounded-lg border border-blue-100'>
                                                            <div className='flex items-center'>
                                                                <Info className='w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0' />
                                                                <p className='text-gray-700'>{method.additionalInfo}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {selectedPaymentMethod === method.id && (
                                                <div className='absolute inset-0 border-2 border-blue-500 rounded-xl pointer-events-none'></div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order summary */}
                    <div className='w-full lg:w-1/3'>
                        <div className='rounded-[15px] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.1)] bg-white sticky top-6'>
                            <div className='px-6 h-[66px] flex items-center border-b border-gray-100'>
                                <h2 className='font-bold text-[18px] text-gray-800'>
                                    {t('COMMON.USER.ORDER_SUMMARY')}
                                </h2>
                            </div>
                            <div className='p-6'>
                                <div>
                                    <div className='flex flex-col gap-4'>
                                        <div className='flex justify-between'>
                                            <span className='text-gray-600'>
                                                {t('COMMON.USER.SUBTOTAL', { count: products.length })}
                                            </span>
                                            <span className='font-medium'>{formatCurrency(summary.subTotal)}</span>
                                        </div>

                                        <div className='flex justify-between'>
                                            <p className='text-gray-600'>{t('COMMON.ORDER.SHIPPING_FEE')}</p>
                                            <p className='font-medium'>{formatCurrency(summary.shippingFee)}</p>
                                        </div>

                                        <div className='flex justify-between'>
                                            <p className='text-gray-600'>{t('COMMON.ORDER.DISCOUNT_SHIPPING_FEE')}</p>
                                            <p className='font-medium text-[#ff5630]'>
                                                {summary.discountShippingFee && summary.discountShippingFee >= 0
                                                    ? '- '
                                                    : ''}
                                                {formatCurrency(summary.discountShippingFee || 0)}
                                            </p>
                                        </div>

                                        <div className='flex justify-between'>
                                            <p className='text-gray-600'>{t('COMMON.ORDER.DISCOUNT_AMOUNT')}</p>
                                            <p className='font-medium text-[#ff5630]'>
                                                {summary.discountAmount && summary.discountAmount >= 0 ? '- ' : ''}
                                                {formatCurrency(summary.discountAmount || 0)}
                                            </p>
                                        </div>

                                        <div className='flex justify-between'>
                                            <p className='text-gray-600'>{t('COMMON.ORDER.TAXES')}</p>
                                            <p className='font-medium'>{formatCurrency(summary.taxes || 0)}</p>
                                        </div>
                                    </div>

                                    <div className='pt-5 mt-4 border-t border-gray-100'>
                                        <div className='flex justify-between items-center'>
                                            <span className='font-medium'>{t('COMMON.USER.TOTAL_AMOUNT')}</span>
                                            <span className='text-xl font-bold text-blue-600'>
                                                {formatCurrency(summary.totalAmount)}
                                            </span>
                                        </div>
                                        <p className='text-sm text-gray-600 mt-1'>{t('COMMON.USER.VAT_INCLUDED')}</p>
                                    </div>
                                </div>

                                <div className='mt-6'>
                                    <label className='block text-sm font-medium text-gray-700 mb-3'>
                                        {t('COMMON.USER.DISCOUNT_CODE')}
                                    </label>
                                    <div className='flex'>
                                        <input
                                            type='text'
                                            onChange={e => setNewDiscountCode(e.target.value)}
                                            className='flex-1 border border-gray-300 rounded-l-lg px-4 py-[11px] focus:ring-blue-500 focus:border-blue-500 outline-none'
                                            placeholder={t('COMMON.USER.ENTER_DISCOUNT_CODE')}
                                        />
                                        <button
                                            className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-[11px] rounded-r-lg font-medium transition'
                                            onClick={handleApplyDiscount}
                                        >
                                            {t('COMMON.USER.APPLY')}
                                        </button>
                                    </div>

                                    {discountError && (
                                        <div className='mt-2 text-red-600 text-sm flex items-center'>
                                            <AlertCircle className='w-4 h-4 mr-1' />
                                            {discountError}
                                        </div>
                                    )}

                                    {discountSuccess && (
                                        <div className='mt-2 text-green-600 text-sm flex items-center'>
                                            <CheckCircle2 className='w-4 h-4 mr-1' />
                                            {discountSuccess}
                                        </div>
                                    )}

                                    {/* Applied discount codes */}
                                    {appliedDiscounts.length > 0 && (
                                        <div className='mt-3 space-y-3'>
                                            {appliedDiscounts.map(discount => (
                                                <div
                                                    key={discount.id}
                                                    className='bg-blue-50 rounded-lg p-4 flex justify-between items-center'
                                                >
                                                    <div>
                                                        <div className='flex items-center'>
                                                            <CheckCircle2 className='w-4 h-4 text-green-600 mr-1.5' />
                                                            <span className='font-medium text-gray-800'>
                                                                {discount.code}
                                                            </span>
                                                        </div>
                                                        <p className='text-sm text-gray-600 mt-1'>
                                                            {discount.description}
                                                        </p>
                                                    </div>

                                                    <button
                                                        className='p-2 bg-red-50 rounded-full text-red-600 hover:bg-red-100 transition-colors'
                                                        onClick={() => handleRemoveDiscount(discount.id)}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className='mt-6'>
                                    <button
                                        onClick={handlePlaceOrder}
                                        className='w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium flex items-center justify-center transition'
                                    >
                                        <CreditCard className='w-5 h-5 mr-2' />
                                        {t('COMMON.USER.PLACE_ORDER')}
                                    </button>
                                </div>

                                <div className='mt-5 text-center'>
                                    <p className='text-md text-gray-600 whitespace-pre-line'>
                                        {t('COMMON.USER.PLACE_ORDER_CONSENT')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='mt-6 rounded-[15px] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.1)] bg-white overflow-hidden'>
                    <div className='bg-gradient-to-r from-blue-600 to-blue-700 p-6'>
                        <h3 className='text-white font-bold text-[18px] text-center mb-6'>
                            {t('COMMON.USER.OUR_PROMISES')}
                        </h3>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                            <div className='bg-white bg-opacity-10 rounded-[12px] p-4 backdrop-blur-sm border border-white border-opacity-20'>
                                <div className='flex items-center'>
                                    <div className='rounded-full bg-white p-3 mr-4'>
                                        <BadgeCheck className='h-5 w-5 text-blue-600' />
                                    </div>
                                    <div>
                                        <p className='text-white font-medium text-[16px]'>
                                            {t('COMMON.USER.AUTHENTIC_GUARANTEE')}
                                        </p>
                                        <p className='text-white text-opacity-80 text-md mt-1'>
                                            {t('COMMON.USER.AUTHENTIC_GUARANTEE_DESC')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className='bg-white bg-opacity-10 rounded-[12px] p-4 backdrop-blur-sm border border-white border-opacity-20'>
                                <div className='flex items-center'>
                                    <div className='rounded-full bg-white p-3 mr-4'>
                                        <HelpingHand className='h-5 w-5 text-blue-600' />
                                    </div>
                                    <div>
                                        <p className='text-white font-medium text-[16px]'>
                                            {t('COMMON.USER.TECH_SUPPORT')}
                                        </p>
                                        <p className='text-white text-opacity-80 text-md mt-1'>
                                            {t('COMMON.USER.TECH_SUPPORT_DESC')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className='bg-white bg-opacity-10 rounded-[12px] p-4 backdrop-blur-sm border border-white border-opacity-20'>
                                <div className='flex items-center'>
                                    <div className='rounded-full bg-white p-3 mr-4'>
                                        <Shield className='h-5 w-5 text-blue-600' />
                                    </div>
                                    <div>
                                        <p className='text-white font-medium text-[16px]'>
                                            {t('COMMON.USER.SECURE_CHECKOUT')}
                                        </p>
                                        <p className='text-white text-opacity-80 text-md mt-1'>
                                            {t('COMMON.USER.SECURE_CHECKOUT_DESC')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AddressManager isOpen={isOpenModel} onClose={() => setIsOpenModal(false)} />
        </div>
    )
}

export default CheckoutPage
