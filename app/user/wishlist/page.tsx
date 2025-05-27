'use client'

import { useState } from 'react'
import { Heart, Trash2, Bell, BellOff, ChevronDown, ChevronUp, ShoppingCart } from 'lucide-react'
import { formatCurrency } from '@/common/format'
import { useTranslation } from 'react-i18next'
import EmptyItem from '@/components/EmptyItem'
import { useRouter } from 'next/navigation'

const products = [
    {
        id: 'P0001',
        productName: 'Bộ điều khiển nhiệt độ Autonics',
        sku: 'CTRL-AUT-TEMP',
        originalPrice: 1200000,
        discountPercentage: 5,
        targetPrice: 250000,
        productVariant: 'TCN4S-24R',
        productImage: 'https://api-prod-minimal-v700.pages.dev/assets/images/cover/cover-12.webp',
        price: 1150000,
        notifications: true,
        quantity: 1
    },
    {
        id: 'P0002',
        productName: 'Cảm biến quang Keyence',
        sku: 'SENSOR-KYC',
        originalPrice: 1000000,
        targetPrice: 250000,
        discountPercentage: 5,
        productVariant: 'Màu xanh',
        productImage: 'https://api-prod-minimal-v700.pages.dev/assets/images/cover/cover-10.webp',
        price: 950000,
        notifications: true,
        quantity: 1
    },
    {
        id: 'P0003',
        productName: 'Biến tần ABB 3.7kW',
        sku: 'VFD-ABB-3K7',
        originalPrice: 6000000,
        discountPercentage: 8,
        targetPrice: 250000,
        productVariant: 'Loại 3.7kW',
        productImage: 'https://api-prod-minimal-v700.pages.dev/assets/images/cover/cover-11.webp',
        price: 5500000,
        notifications: true,
        quantity: 1
    }
]

export default function WishlistComponent() {
    const { t } = useTranslation('common')
    const router = useRouter()
    const [items, setItems] = useState(products)
    const [expandedItem, setExpandedItem] = useState<string | null>(null)
    const [showEmptyState, setShowEmptyState] = useState(false)

    const toggleExpand = (id: string) => {
        setExpandedItem(expandedItem === id ? null : id)
    }

    const toggleNotification = (id: string) => {
        setItems(items.map(item => (item.id === id ? { ...item, notifications: !item.notifications } : item)))
    }

    const removeItem = (id: string) => {
        setItems(items.filter(item => item.id !== id))
        if (items.length <= 1) {
            setShowEmptyState(true)
        }
    }

    const updateTargetPrice = (id: string, price: number) => {
        setItems(items.map(item => (item.id === id ? { ...item, targetPrice: price } : item)))
    }

    if (showEmptyState || items.length === 0) {
        return (
            <EmptyItem
                icon={<Heart className='w-10 h-10 text-blue-600' />}
                title={t('COMMON.USER.FAVORITE_LIST_EMPTY')}
                description={t('COMMON.USER.FAVORITE_LIST_NO_ITEMS')}
                buttonText={t('COMMON.USER.CONTINUE_SHOPPING')}
                onClick={() => router.push('/')}
            />
        )
    }

    return (
        <div className='max-w-7xl mx-auto sm:px-6 lg:px-8'>
            <div className='rounded-[15px] overflow-hidden w-full shadow-[0_4px_16px_rgba(0,0,0,0.1)] bg-[var(--background-color-item)]'>
                <div className='px-6 border-b flex items-center border-gray-100 h-[66px]'>
                    <h2 className='font-bold text-[18px] text-gray-800 flex items-center'>
                        <Heart size={20} className='w-5 h-5 text-blue-600 mr-3' color='#3675ff' />
                        {t('COMMON.USER.YOUR_FAVORITE_LIST')}
                        <span className='ml-3 px-2 py-0.5 bg-blue-100 text-blue-700 text-sm rounded-full'>
                            {items.length}
                        </span>
                    </h2>
                </div>

                <div className='divide-y divide-gray-100'>
                    {items.map(item => (
                        <div key={item.id} className='p-6 hover:bg-blue-50/30 transition-colors'>
                            <div className='flex items-start justify-between'>
                                <div className='flex items-start'>
                                    <div className='relative'>
                                        <img
                                            src={item.productImage}
                                            className='w-[75px] h-[75px] rounded-[10px] border border-gray-200 object-cover'
                                            alt={item.productName}
                                        />
                                        {item.discountPercentage > 0 && (
                                            <div className='absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center'>
                                                -{item.discountPercentage}%
                                            </div>
                                        )}
                                    </div>

                                    <div className='ml-5 space-y-1'>
                                        <p className='font-medium text-md text-gray-900'>{item.productName}</p>
                                        <p className='text-gray-500 text-sm'>
                                            SKU: <span className='text-black font-medium ml-1'>{item.sku}</span>
                                        </p>
                                        <p className='text-gray-500 text-sm'>
                                            {t('COMMON.USER.PRODUCT_VARIANT')}:{' '}
                                            <span className='text-black font-medium ml-1'>{item.productVariant}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className='text-right flex flex-col items-end'>
                                    {item.discountPercentage > 0 ? (
                                        <div className='flex items-center gap-4'>
                                            <p className='line-through text-gray-400'>
                                                {formatCurrency(item.originalPrice)}
                                            </p>
                                            <p className='font-medium text-[#3675ff]'>{formatCurrency(item.price)}</p>
                                        </div>
                                    ) : (
                                        <p className='font-semibold text-gray-900'>{formatCurrency(item.price)}</p>
                                    )}

                                    <div className='flex mt-4 space-x-4'>
                                        <button
                                            className='p-2 bg-blue-50 rounded-full text-blue-600 hover:bg-blue-100 transition-colors'
                                            onClick={() => toggleNotification(item.id)}
                                        >
                                            {item.notifications ? <Bell size={18} /> : <BellOff size={18} />}
                                        </button>

                                        <button
                                            className='p-2 bg-red-50 rounded-full text-red-600 hover:bg-red-100 transition-colors'
                                            onClick={() => removeItem(item.id)}
                                        >
                                            <Trash2 size={18} />
                                        </button>

                                        <button
                                            className='p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors'
                                            onClick={() => toggleExpand(item.id)}
                                        >
                                            {expandedItem === item.id ? (
                                                <ChevronUp size={18} />
                                            ) : (
                                                <ChevronDown size={18} />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Phần mở rộng */}
                            {expandedItem === item.id && (
                                <div className='mt-6 bg-blue-50 p-6 rounded-lg border border-blue-100'>
                                    <div className='flex flex-col space-y-4'>
                                        <div>
                                            <label className='font-medium text-gray-700 block mb-2'>
                                                {t('COMMON.USER.DESIRED_PRICE')}
                                            </label>
                                            <div className='flex items-center'>
                                                <input
                                                    type='number'
                                                    value={item.targetPrice}
                                                    onChange={e => updateTargetPrice(item.id, parseInt(e.target.value))}
                                                    className='p-2 border border-gray-300 rounded-lg mr-2 w-32'
                                                />
                                                <span className='text-gray-500'>VND</span>
                                            </div>
                                            <p className='text-sm text-blue-600 mt-2'>
                                                {item.notifications
                                                    ? t('COMMON.USER.NOTIFICATION_WHEN_PRICE_REDUCED')
                                                    : t('COMMON.USER.ENABLE_NOTIFICATION')}
                                            </p>
                                        </div>

                                        <div className='flex justify-between pt-2'>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className='px-4 py-2 bg-white border border-[#3675ff] font-medium text-[#3675ff] rounded-lg hover:bg-blue-50 transition-colors flex items-center'
                                            >
                                                <Heart size={16} className='mr-2' fill='#3675ff' />
                                                {t('COMMON.USER.UNFOLLOW')}
                                            </button>
                                            <button className='px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center'>
                                                <ShoppingCart size={16} className='mr-2' />
                                                {t('COMMON.USER.ADD_TO_CART')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className='px-6 py-5 bg-gray-50 rounded-b-xl border-t border-gray-100'>
                    <div className='flex justify-between items-center'>
                        <span className='text-gray-500 lowercase'>
                            {items.length} {t('COMMON.USER.PRODUCT')}
                        </span>
                        <button className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center'>
                            <ShoppingCart size={16} className='mr-2' />
                            {t('COMMON.USER.ADD_ALL_TO_CART')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
