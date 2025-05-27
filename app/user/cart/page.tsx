'use client'

import React, { useState, useEffect } from 'react'
import {
    Trash2,
    Plus,
    Minus,
    CreditCard,
    ShoppingCart,
    ArrowLeftToLine,
    Heart,
    AlertCircle,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Zap
} from 'lucide-react'
import { formatCurrency } from '@/common/format'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import EmptyItem from '@/components/EmptyItem'
import { IProduct } from '@/models/Product'
import ProductCard from '../ProductCard'

const generateProducts = (): IProduct[] => {
    const covers = [
        'https://api-prod-minimal-v700.pages.dev/assets/images/cover/cover-1.webp',
        'https://api-prod-minimal-v700.pages.dev/assets/images/cover/cover-2.webp',
        'https://api-prod-minimal-v700.pages.dev/assets/images/cover/cover-3.webp',
        'https://api-prod-minimal-v700.pages.dev/assets/images/cover/cover-4.webp',
        'https://api-prod-minimal-v700.pages.dev/assets/images/cover/cover-5.webp'
    ]

    const productNames = [
        'Siemens S7-1200 PLC',
        'Cảm biến quang Omron E3Z',
        'Biến tần ABB ACS580',
        'HMI Weintek MT8071iE',
        'Động cơ servo Mitsubishi MR-J4',
        'Module mở rộng Phoenix Contact',
        'Robot SCARA Epson T6',
        'Cảm biến áp suất IFM',
        'Bộ điều khiển nhiệt độ Autonics',
        'Rơ-le thời gian Carlo Gavazzi',
        'Máy đo lưu lượng Endress+Hauser',
        'Cáp truyền thông Profinet',
        'Màn hình công nghiệp Advantech',
        'Mô-đun Analog Delta DVP',
        'Thiết bị IoT Gateway Moxa',
        'Camera công nghiệp Cognex',
        'Cảm biến độ rung SKF',
        'Cảm biến nhiệt Honeywell',
        'Bộ mã hóa vòng quay Sick',
        'Thiết bị an toàn Pilz'
    ]

    const categories = [
        'PLC',
        'Sensor',
        'Drive',
        'HMI',
        'Servo',
        'Module',
        'Robot',
        'Automation',
        'Temperature',
        'Timer'
    ]
    const suppliers = [
        'Siemens',
        'Omron',
        'ABB',
        'Weintek',
        'Mitsubishi',
        'Phoenix',
        'Epson',
        'IFM',
        'Autonics',
        'Pilz'
    ]
    const units = ['cái', 'bộ', 'chiếc', 'hộp']

    const products: IProduct[] = []

    for (let i = 0; i < 20; i++) {
        const price = Math.floor(Math.random() * 90_000_000) + 1_000_000
        const discountRate = Math.floor(Math.random() * 30) + 5
        const discountPrice = discountRate > 0 ? Math.floor(price * (1 - discountRate / 100)) : price

        products.push({
            id: i + 1,
            serialNumber: `SN-${100000 + i}`,
            discountRate,
            discountPrice,
            price,
            images: [covers[i % covers.length]],
            description: `Mô tả chi tiết cho sản phẩm ${productNames[i]}.`,
            productName: productNames[i],
            categoryName: categories[i % categories.length],
            supplierName: suppliers[i % suppliers.length],
            unit: units[i % units.length],
            warrantyPeriod: Math.floor(Math.random() * 36) + 12, // 12 - 48 tháng
            stockQuantity: Math.floor(Math.random() * 50) + 10,
            soldCount: Math.floor(Math.random() * 500),
            minStockThreshold: Math.floor(Math.random() * 10) + 5,
            rating: parseFloat((Math.random() * 2 + 3).toFixed(1)), // 3.0 - 5.0
            createdAt: new Date(Date.now() - Math.random() * 3_600_000_000).toISOString(), // trong quá khứ
            createdBy: 'admin'
        })
    }

    return products
}

const CartPage = () => {
    const { t } = useTranslation('common')
    const [cart, setCart] = useState([
        {
            id: 1,
            productName: 'Áo thun nam basic',
            productImage: 'https://api-prod-minimal-v700.pages.dev/assets/images/cover/cover-9.webp',
            price: '320.000₫',
            originalPrice: '400.000₫',
            priceValue: 320000,
            sku: 'AT-001',
            isFavorite: false,
            productVariant: 'Trắng / L',
            quantity: 2,
            selected: false
        },
        {
            id: 2,
            productName: 'Quần jean nam slim fit Quần jean nam slim fit Quần jean nam slim fit Quần jean nam slim fit',
            productImage: 'https://api-prod-minimal-v700.pages.dev/assets/images/cover/cover-19.webp',
            price: '550.000₫',
            originalPrice: '650.000₫',
            priceValue: 550000,
            sku: 'QJ-023',
            isFavorite: true,
            productVariant: 'Xanh đậm / 32',
            quantity: 1,
            selected: false
        },
        {
            id: 3,
            productName: 'Giày thể thao nữ',
            productImage: 'https://api-prod-minimal-v700.pages.dev/assets/images/cover/cover-7.webp',
            price: '890.000₫',
            originalPrice: '1.200.000₫',
            priceValue: 890000,
            sku: 'GT-045',
            isFavorite: false,
            productVariant: 'Trắng / 38',
            quantity: 1,
            selected: false
        }
    ])
    const [discountError, setDiscountError] = useState('')
    const [discountSuccess, setDiscountSuccess] = useState('')
    const [newDiscountCode, setNewDiscountCode] = useState('')
    const router = useRouter()
    const [appliedDiscounts, setAppliedDiscounts] = useState([
        {
            id: 1,
            code: 'WELCOME20',
            description: 'Giảm 50.000₫ cho đơn hàng đầu tiên',
            amount: 50000
        }
    ])

    const handleRemoveDiscount = (discountId: number) => {
        const discountToRemove = appliedDiscounts.find(d => d.id === discountId)

        setAppliedDiscounts(appliedDiscounts.filter(discount => discount.id !== discountId))

        // Update summary
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

    const handleApplyDiscount = () => {
        if (!newDiscountCode.trim()) {
            setDiscountError(t('COMMON.USER.EMPTY_DISCOUNT_CODE'))
            return
        }

        if (appliedDiscounts.some(discount => discount.code === newDiscountCode)) {
            setDiscountError(t('COMMON.USER.DISCOUNT_ALREADY_APPLIED'))
            return
        }

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

            setTimeout(() => {
                setDiscountSuccess('')
            }, 3000)
        } else {
            setDiscountError(t('COMMON.USER.INVALID_DISCOUNT_CODE'))
        }
    }

    const [summary, setSummary] = useState({
        subTotal: 0,
        discountAmount: 50000,
        discountShippingFee: 50000,
        shippingFee: 200000,
        totalAmount: 0,
        taxes: 0
    })

    // Đề xuất sản phẩm
    const suggestedProducts = generateProducts().slice(0, 8)

    useEffect(() => {
        calculateSummary()
    }, [cart])

    const calculateSummary = () => {
        const selectedItems = cart.filter(item => item.selected)
        const subTotal = selectedItems.reduce((total, item) => {
            return total + item.priceValue * item.quantity
        }, 0)

        setSummary({
            ...summary,
            subTotal,
            totalAmount:
                subTotal + summary.shippingFee - summary.discountAmount - summary.discountShippingFee + summary.taxes
        })
    }

    const handleQuantityChange = (id: number, newQuantity: number) => {
        if (newQuantity < 1) return

        setCart(cart.map(item => (item.id === id ? { ...item, quantity: newQuantity } : item)))
    }

    const handleRemoveItem = (id: number) => {
        setCart(cart.filter(item => item.id !== id))
    }

    const handleUpdateFavorite = (id: number) => {
        setCart(prevCart => prevCart.map(item => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item)))
    }

    const handleSelectItem = (id: number) => {
        setCart(cart.map(item => (item.id === id ? { ...item, selected: !item.selected } : item)))
    }

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked
        setCart(cart.map(item => ({ ...item, selected: isChecked })))
    }

    const allSelected = cart.length > 0 && cart.every(item => item.selected)
    const selectedCount = cart.filter(item => item.selected).length

    useEffect(() => {
        if (selectedCount === 0) {
            setSummary({
                subTotal: 0,
                shippingFee: 0,
                discountAmount: 0,
                discountShippingFee: 0,
                taxes: 0,
                totalAmount: 0
            })
        }
    }, [selectedCount])

    return (
        <div className='min-h-screen'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                {cart.length > 0 ? (
                    <div className='flex flex-col lg:flex-row gap-6'>
                        {/* Main cart content */}
                        <div className='w-full lg:w-2/3'>
                            {/* Cart items */}
                            <div className='flex-grow'>
                                <div className='rounded-[15px] overflow-hidden w-full shadow-[0_4px_16px_rgba(0,0,0,0.1)] bg-[var(--background-color-item)]'>
                                    {/* Header */}
                                    <div className='px-6 border-b border-gray-100'>
                                        <div className='flex h-[65px] items-center justify-between'>
                                            <div className='flex items-center'>
                                                <input
                                                    type='checkbox'
                                                    checked={allSelected}
                                                    onChange={handleSelectAll}
                                                    className='w-4 h-4 rounded-[10px] border-[#d1e0ff] accent-[#3675ff] text-[#3675ff] cursor-pointer'
                                                />
                                                <span className='ml-4 font-medium text-gray-800'>
                                                    {t('COMMON.USER.SELECT_ALL', { count: cart.length })}
                                                </span>
                                            </div>
                                            <div className='text-gray-600 flex items-center'>
                                                <span className='font-medium text-gray-900'>
                                                    {t('COMMON.USER.SElECTED')}
                                                    <span className='font-medium text-[#3675ff] ml-2'>
                                                        {selectedCount}
                                                    </span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Cart Items */}
                                    <div className='divide-y divide-gray-100'>
                                        {cart.map(item => (
                                            <div
                                                key={item.id}
                                                className={`p-6 transition-colors ${
                                                    item.selected ? 'bg-blue-50/30' : ''
                                                }`}
                                            >
                                                <div className='flex'>
                                                    {/* Checkbox */}
                                                    <div className='flex items-start pt-1'>
                                                        <input
                                                            type='checkbox'
                                                            checked={item.selected}
                                                            onChange={() => handleSelectItem(item.id)}
                                                            className='w-4 h-4 rounded-[10px] border-[#d1e0ff] accent-[#3675ff] text-[#3675ff] cursor-pointer'
                                                        />
                                                    </div>

                                                    {/* Product Image */}
                                                    <div className='ml-4 flex-shrink-0'>
                                                        <div className='relative group'>
                                                            <img
                                                                src={item.productImage}
                                                                alt={item.productName}
                                                                className='w-[65px] h-[65px] rounded-[10px] border border-gray-200 object-cover'
                                                            />
                                                            <button className='absolute top-2 right-2 bg-white/80 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white'>
                                                                <Heart className='w-4 h-4 text-gray-600' />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Product Details */}
                                                    <div className='ml-5 flex-grow'>
                                                        <div className='flex flex-col sm:flex-row sm:justify-between sm:items-start'>
                                                            <div className='space-y-0.5'>
                                                                <p className='font-medium text-md text-gray-900'>
                                                                    {item.productName}
                                                                </p>
                                                                <p className='text-gray-500 text-sm'>SKU: {item.sku}</p>
                                                                <p className='text-gray-500 text-sm'>
                                                                    {t('COMMON.USER.PRODUCT_VARIANT')}:{' '}
                                                                    {item.productVariant}
                                                                </p>
                                                            </div>

                                                            <div className='flex items-center justify-between mt-3 sm:ml-3 sm:mt-0'>
                                                                {/* Quantity Control */}
                                                                <div className='flex items-center border border-gray-200 rounded-lg shadow-sm overflow-hidden mr-4 sm:mr-6'>
                                                                    <button
                                                                        onClick={() =>
                                                                            handleQuantityChange(
                                                                                item.id,
                                                                                item.quantity - 1
                                                                            )
                                                                        }
                                                                        className='px-3 py-3 text-gray-600 hover:bg-gray-100 transition-colors'
                                                                    >
                                                                        <Minus className='w-3.5 h-3.5' />
                                                                    </button>
                                                                    <span className='px-3 py-1.5 text-gray-800 min-w-[40px] text-center font-medium'>
                                                                        {item.quantity}
                                                                    </span>
                                                                    <button
                                                                        onClick={() =>
                                                                            handleQuantityChange(
                                                                                item.id,
                                                                                item.quantity + 1
                                                                            )
                                                                        }
                                                                        className='px-3 py-3 text-gray-600 hover:bg-gray-100 transition-colors'
                                                                    >
                                                                        <Plus className='w-3.5 h-3.5' />
                                                                    </button>
                                                                </div>

                                                                {/* Price */}
                                                                <div className='text-right min-w-[120px]'>
                                                                    <p className='font-medium text-blue-600'>
                                                                        {item.price}
                                                                    </p>
                                                                    {item.originalPrice && (
                                                                        <p className='line-through text-gray-400'>
                                                                            {item.originalPrice}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className='flex items-center space-x-4 justify-end mt-3 sm:mt-0'>
                                                    <button
                                                        className='p-2 bg-red-50 rounded-full text-red-600 hover:bg-red-100 transition-colors'
                                                        onClick={() => handleRemoveItem(item.id)}
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>

                                                    <button
                                                        className='p-2 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors'
                                                        onClick={() => handleUpdateFavorite(item.id)}
                                                    >
                                                        <Heart
                                                            size={18}
                                                            fill={item.isFavorite ? '#3675ff' : 'transparent'}
                                                            color='#3675ff'
                                                        />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <ProductHotSale products={suggestedProducts} title='Hot Sales' />
                        </div>

                        {/* Order summary */}
                        <div className='w-full lg:w-1/3'>
                            <div className='rounded-[15px] overflow-hidden w-full shadow-[0_4px_16px_rgba(0,0,0,0.1)] bg-[var(--background-color-item)] sticky top-6'>
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
                                                    {t('COMMON.USER.SUBTOTAL', { count: selectedCount })}
                                                </span>
                                                <span className='font-medium'>{formatCurrency(summary.subTotal)}</span>
                                            </div>

                                            <div className='flex justify-between'>
                                                <p className='text-gray-600'>{t('COMMON.ORDER.SHIPPING_FEE')}</p>
                                                <p className='font-medium'>{formatCurrency(summary.shippingFee)}</p>
                                            </div>

                                            <div className='flex justify-between'>
                                                <p className='text-gray-600'>
                                                    {t('COMMON.ORDER.DISCOUNT_SHIPPING_FEE')}
                                                </p>
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
                                            <p className='text-sm text-gray-600 mt-1'>
                                                {t('COMMON.USER.VAT_INCLUDED')}
                                            </p>
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
                                            className='w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium flex items-center justify-center transition'
                                            onClick={() => router.push('/user/checkout')}
                                        >
                                            <CreditCard className='w-5 h-5 mr-2' />
                                            {t('COMMON.USER.CHECKOUT')}
                                        </button>
                                    </div>

                                    <div className='mt-6 text-center'>
                                        <button className='text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center mx-auto'>
                                            <ArrowLeftToLine className='w-5 h-5 mr-1.5 pt-[2px]' />
                                            {t('COMMON.USER.CONTINUE_SHOPPING')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <EmptyItem
                        icon={<ShoppingCart className='w-10 h-10 text-blue-600' />}
                        title={t('COMMON.USER.CART_EMPTY_TITLE')}
                        description={t('COMMON.USER.CART_EMPTY_DESCRIPTION')}
                        buttonText={t('COMMON.USER.CONTINUE_SHOPPING')}
                        onClick={() => router.push('/')}
                    />
                )}
            </div>
        </div>
    )
}

type ProductHotSaleProps = {
    title: string
    products: IProduct[]
    viewAll?: boolean
}

const ProductHotSale = ({ title, products }: ProductHotSaleProps) => {
    const [currentPage, setCurrentPage] = useState(0)
    const [currentIndex, setCurrentIndex] = useState(0)
    products = products.slice(0, 19)
    const totalPages = Math.min(Math.floor((products.length - 1) / 2), 10)

    const nextPage = () => {
        if (currentPage + 1 >= totalPages) {
            return
        }
        setCurrentIndex(prev => prev + 2)
        setCurrentPage(prev => prev + 1)
    }

    const setPage = (page: number) => {
        setCurrentIndex(page * 2)
        setCurrentPage(page)
    }

    const prevPage = () => {
        setCurrentIndex(prev => Math.max(prev - 2, 0))
        setCurrentPage(prev => Math.max(prev - 1, 0))
    }

    console.log('currentIndex', currentIndex)
    console.log('currentPage', currentPage)
    console.log('totalPages', totalPages)

    const currentProducts = products.slice(currentIndex, Math.min(currentIndex + 2, 20))

    return (
        <div className='rounded-[15px] mt-6 overflow-hidden relative'>
            {/* Simplified enhanced background */}
            <div className='absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-500 to-blue-400'>
                {/* Simplified pattern - just using background dots */}
                <div
                    className='absolute inset-0 opacity-20'
                    style={{
                        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
                        backgroundSize: '20px 20px'
                    }}
                ></div>

                {/* Animated pulsing circles */}
                <div className='absolute top-0 right-0 w-80 h-80 bg-blue-300 rounded-full opacity-20 -translate-y-1/2 translate-x-1/3 blur-xl'></div>
                <div className='absolute bottom-0 left-0 w-64 h-64 bg-blue-200 rounded-full opacity-20 translate-y-1/3 -translate-x-1/4 blur-lg'></div>
                <div className='absolute top-1/3 left-1/4 w-32 h-32 bg-white rounded-full opacity-10 blur-md'></div>
                <div className='absolute bottom-1/4 right-1/4 w-40 h-40 bg-blue-100 rounded-full opacity-15 blur-md'></div>

                {/* Light beams */}
                <div className='absolute top-0 left-1/2 w-1/3 h-full bg-gradient-to-b from-blue-100 to-transparent opacity-10'></div>
                <div className='absolute top-0 right-1/4 w-1/4 h-full bg-gradient-to-b from-white to-transparent opacity-5'></div>
            </div>

            {/* Content container */}
            <div className='relative z-10 p-6 text-white'>
                {/* Header with enhanced hot label */}
                <div className='flex items-center justify-center mb-6'>
                    <div className='relative'>
                        <h2 className='text-3xl font-extrabold text-white tracking-wide text-center px-4'>
                            {title.toUpperCase()}
                        </h2>
                        <div className='absolute -top-2 -right-[76px] flex items-center justify-center'>
                            <div className='relative animate-pulse'>
                                <div className='absolute inset-0 bg-red-500 rounded-lg blur'></div>
                                <div className='relative bg-gradient-to-r from-red-600 to-red-500 text-white font-black py-1 px-3 rounded-lg flex items-center border border-red-400 shadow-lg'>
                                    <Zap size={18} className='mr-1' />
                                    <span>HOT</span>
                                </div>
                            </div>
                        </div>
                        <div className='h-1 w-36 bg-gradient-to-r from-transparent via-white to-transparent rounded-full mx-auto mt-3 opacity-70'></div>
                    </div>
                </div>

                {/* Product grid */}
                <div className='rounded-[15px] overflow-hidden bg-white shadow-lg bg-opacity-10 p-10 mx-4 backdrop-blur-sm'>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                        {currentProducts.map((product, index) => (
                            <ProductCard key={index} product={product} isHotSale={true} />
                        ))}
                    </div>
                </div>

                {/* Navigation buttons */}
                <button
                    onClick={prevPage}
                    className='absolute left-0 top-1/2 -translate-y-1/2 bg-white bg-opacity-10 hover:bg-opacity-20 text-white pr-2 pl-1 py-2 rounded-r-lg shadow-lg backdrop-blur-sm transition-all border border-white border-opacity-30'
                    aria-label='Previous page'
                >
                    <ChevronLeft size={24} />
                </button>

                <button
                    onClick={nextPage}
                    className='absolute right-0 top-1/2 -translate-y-1/2 bg-white bg-opacity-10 hover:bg-opacity-20 text-white pr-1 pl-2 py-2 rounded-l-lg shadow-lg backdrop-blur-sm transition-all border border-white border-opacity-30'
                    aria-label='Next page'
                >
                    <ChevronRight size={24} />
                </button>

                {/* Page indicators */}
                {totalPages > 1 && (
                    <div className='flex justify-center mt-6 space-x-2'>
                        {Array.from({ length: totalPages }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setPage(index)}
                                className={`w-2 h-2 rounded-full transition-all ${
                                    currentPage === index
                                        ? 'bg-white w-6'
                                        : 'bg-white bg-opacity-50 hover:bg-opacity-70'
                                }`}
                                aria-label={`Go to page ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default CartPage
