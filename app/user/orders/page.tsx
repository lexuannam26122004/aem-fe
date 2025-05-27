// pages/orders.jsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Filter, Clock, Package, Truck, MessageSquare, ExternalLink, ShoppingBag } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import { formatCurrency } from '@/common/format'

export default function UserOrders() {
    const { t } = useTranslation('common')
    const [activeTab, setActiveTab] = useState('all')
    const router = useRouter()
    const [isFilterOpen, setIsFilterOpen] = useState(false)

    const orders = [
        {
            id: 'DH2025051601',
            status: 'pending',
            total: '1.200.000 VND',
            date: '16/05/2025',
            time: '9:00',
            items: [
                {
                    id: 'P0001',
                    productName: 'HMI Weintek 7 inch',
                    sku: 'HMI-WEI-7',
                    productVariant: 'MT8071iE',
                    originalPrice: 4500000,
                    discountPercentage: 18,
                    productImage: 'https://api-prod-minimal-v700.pages.dev/assets/images/cover/cover-9.webp',
                    price: '3.800.000 VND',
                    quantity: 1
                },
                {
                    id: 'P0002',
                    productName: 'Nguồn tổ ong 24V 5A',
                    sku: 'PSU-24V5A',
                    originalPrice: 13200000,
                    discountPercentage: 10,
                    productVariant: 'Loại A',
                    productImage: 'https://api-prod-minimal-v700.pages.dev/assets/images/cover/cover-8.webp',
                    price: '1.200.000 VND',
                    quantity: 1
                }
            ],
            shipping: {
                method: 'GHN',
                speed: 'Standard',
                fee: '50.000 VND',
                discount: '0 VND',
                tracking: 'GHNTRACK001'
            },
            payment: {
                method: 'MoMo',
                time: '9:00 16/05/2025'
            },
            discount: '0 VND',
            taxes: '0 VND',
            subtotal: '1.200.000 VND',
            timeline: [
                {
                    status: 'Đơn hàng đã được tạo',
                    time: '9:00 16/05/2025',
                    completed: true
                }
            ],
            notes: ''
        },
        {
            id: 'DH2025051602',
            status: 'processing',
            total: '3.800.000 VND',
            date: '16/05/2025',
            time: '10:00',
            items: [
                {
                    id: 'P0001',
                    productName: 'HMI Weintek 7 inch',
                    sku: 'HMI-WEI-7',
                    originalPrice: 4000000,
                    discountPercentage: 10,
                    productVariant: 'MT8071iE',
                    productImage: 'https://api-prod-minimal-v700.pages.dev/assets/images/cover/cover-9.webp',
                    price: '3.800.000 VND',
                    quantity: 1
                }
            ],
            shipping: {
                method: 'GHN',
                speed: 'Standard',
                fee: '50.000 VND',
                discount: '0 VND',
                tracking: 'GHNTRACK002'
            },
            payment: {
                method: 'MoMo',
                time: '10:00 16/05/2025'
            },
            discount: '0 VND',
            taxes: '0 VND',
            subtotal: '3.800.000 VND',
            timeline: [
                {
                    status: 'Đơn hàng đã được tạo',
                    time: '10:00 16/05/2025',
                    completed: true
                }
            ],
            notes: ''
        },
        {
            id: 'DH2025051603',
            status: 'shipping',
            total: '950.000 VND',
            date: '16/05/2025',
            time: '11:00',
            items: [
                {
                    id: 'P0001',
                    productName: 'Cảm biến quang Keyence',
                    sku: 'SENSOR-KYC',
                    originalPrice: 1000000,
                    discountPercentage: 5,
                    productVariant: 'Màu xanh',
                    productImage: 'https://api-prod-minimal-v700.pages.dev/assets/images/cover/cover-10.webp',
                    price: '950.000 VND',
                    quantity: 1
                }
            ],
            shipping: {
                method: 'GHN',
                speed: 'Standard',
                fee: '50.000 VND',
                discount: '0 VND',
                tracking: 'GHNTRACK003'
            },
            payment: {
                method: 'MoMo',
                time: '11:00 16/05/2025'
            },
            discount: '0 VND',
            taxes: '0 VND',
            subtotal: '950.000 VND',
            timeline: [
                {
                    status: 'Đơn hàng đã được tạo',
                    time: '11:00 16/05/2025',
                    completed: true
                }
            ],
            notes: ''
        },
        {
            id: 'DH2025051604',
            status: 'delivered',
            total: '5.500.000 VND',
            date: '16/05/2025',
            time: '12:00',
            items: [
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
            ],
            shipping: {
                method: 'GHN',
                speed: 'Standard',
                fee: '50.000 VND',
                discount: '0 VND',
                tracking: 'GHNTRACK004'
            },
            payment: {
                method: 'MoMo',
                time: '12:00 16/05/2025'
            },
            discount: '0 VND',
            taxes: '0 VND',
            subtotal: '5.500.000 VND',
            timeline: [
                {
                    status: 'Đơn hàng đã được tạo',
                    time: '12:00 16/05/2025',
                    completed: true
                }
            ],
            notes: ''
        },
        {
            id: 'DH2025051605',
            status: 'cancelled',
            total: '1.150.000 VND',
            date: '16/05/2025',
            time: '13:00',
            items: [
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
                }
            ],
            shipping: {
                method: 'GHN',
                speed: 'Standard',
                fee: '50.000 VND',
                discount: '0 VND',
                tracking: 'GHNTRACK005'
            },
            payment: {
                method: 'MoMo',
                time: '13:00 16/05/2025'
            },
            discount: '0 VND',
            taxes: '0 VND',
            subtotal: '1.150.000 VND',
            timeline: [
                {
                    status: 'Đơn hàng đã được tạo',
                    time: '13:00 16/05/2025',
                    completed: true
                }
            ],
            notes: ''
        },
        {
            id: 'DH2025051606',
            status: 'returned',
            total: '1.000.000 VND',
            date: '16/05/2025',
            time: '14:00',
            items: [
                {
                    id: 'P0001',
                    productName: 'Chuột không dây Logitech MX Master 3',
                    sku: 'MS-LOG-MX3',
                    originalPrice: 2000000,
                    discountPercentage: 50,
                    productVariant: 'Màu xám',
                    productImage: 'https://api-prod-minimal-v700.pages.dev/assets/images/cover/cover-13.webp',
                    price: '1.000.000 VND',
                    quantity: 1
                }
            ],
            shipping: {
                method: 'GHN',
                speed: 'Standard',
                fee: '50.000 VND',
                discount: '0 VND',
                tracking: 'GHNTRACK006'
            },
            payment: {
                method: 'MoMo',
                time: '14:00 16/05/2025'
            },
            discount: '0 VND',
            taxes: '0 VND',
            subtotal: '1.000.000 VND',
            timeline: [
                {
                    status: 'Đơn hàng đã được tạo',
                    time: '14:00 16/05/2025',
                    completed: true
                }
            ],
            notes: 'Sản phẩm bị lỗi nên đã hoàn trả'
        }
    ]

    const getStatusDetails = (status: string) => {
        switch (status) {
            case 'processing':
                return {
                    label: t('COMMON.ORDER.PROCESSING'),
                    textColor: '#ffffff',
                    bgColor: '#f32160' // Hồng đậm tươi (rose-pink)
                }
            case 'pending':
                return {
                    label: t('COMMON.ORDER.PENDING'),
                    textColor: '#ffffff',
                    bgColor: '#ff9800' // Cam tươi
                }
            case 'shipping':
                return {
                    label: t('COMMON.ORDER.SHIPPING'),
                    textColor: '#ffffff',
                    bgColor: '#03a9f4' // Xanh dương tươi
                }
            case 'delivered':
                return {
                    label: t('COMMON.ORDER.DELIVERED'),
                    textColor: '#ffffff',
                    bgColor: '#15cf23' // Xanh lá tươi
                }
            case 'cancelled':
                return {
                    label: t('COMMON.ORDER.CANCELLED'),
                    textColor: '#ffffff',
                    bgColor: '#ff5630' // Đỏ tươi
                }
            default:
                return {
                    label: t('COMMON.ORDER.RETURNED'),
                    textColor: '#ffffff',
                    bgColor: '#607d8b' // Xám xanh đẹp
                }
        }
    }

    const filteredOrders = activeTab === 'all' ? orders : orders.filter(order => order.status === activeTab)

    return (
        <div className='min-h-screen'>
            {/* Main content */}
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                {/* Search and filter */}
                <div className='flex flex-col md:flex-row md:items-center justify-between gap-5 mb-6'>
                    <div className='relative w-full sm:w-auto sm:max-w-xs'>
                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                            <Search className='h-5 w-5 text-gray-400' />
                        </div>
                        <input
                            type='text'
                            className='pl-10 w-full sm:w-[400px] border border-gray-300 rounded-lg py-3 outline-none focus:ring-blue-500 focus:border-blue-500'
                            placeholder={t('COMMON.USER.SEARCH_ORDER_PLACEHOLDER')}
                        />
                    </div>

                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className='px-6 py-3 bg-white border border-[#3675ff] font-medium text-[#3675ff] rounded-lg hover:bg-blue-50 transition-colors flex items-center'
                    >
                        <Filter className='h-5 w-5 mr-2' />
                        {t('COMMON.USER.FILTER')}
                    </button>
                </div>

                {isFilterOpen && (
                    <div className='mb-6 bg-white p-5 rounded-xl shadow-sm border border-gray-100'>
                        <button
                            className={`px-5 py-2.5 text-base font-medium rounded-lg whitespace-nowrap mr-5
            ${activeTab === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            onClick={() => setActiveTab('all')}
                        >
                            {t('COMMON.ORDER.ALL')}
                        </button>
                        <button
                            className={`px-5 py-2.5 text-base font-medium rounded-lg whitespace-nowrap mr-5
            ${activeTab === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            onClick={() => setActiveTab('pending')}
                        >
                            {t('COMMON.ORDER.PENDING')}
                        </button>
                        <button
                            className={`px-5 py-2.5 text-base font-medium rounded-lg whitespace-nowrap mr-5
            ${activeTab === 'processing' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            onClick={() => setActiveTab('processing')}
                        >
                            {t('COMMON.ORDER.PROCESSING')}
                        </button>
                        <button
                            className={`px-5 py-2.5 text-base font-medium rounded-lg whitespace-nowrap mr-5
            ${activeTab === 'shipping' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            onClick={() => setActiveTab('shipping')}
                        >
                            {t('COMMON.ORDER.SHIPPING')}
                        </button>
                        <button
                            className={`px-5 py-2.5 text-base font-medium rounded-lg whitespace-nowrap mr-5
            ${activeTab === 'delivered' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            onClick={() => setActiveTab('delivered')}
                        >
                            {t('COMMON.ORDER.DELIVERED')}
                        </button>
                        <button
                            className={`px-5 py-2.5 text-base font-medium rounded-lg whitespace-nowrap mr-5
            ${activeTab === 'cancelled' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            onClick={() => setActiveTab('cancelled')}
                        >
                            {t('COMMON.ORDER.CANCELLED')}
                        </button>
                        <button
                            className={`px-5 py-2.5 text-base font-medium rounded-lg whitespace-nowrap 
            ${activeTab === 'returned' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            onClick={() => setActiveTab('returned')}
                        >
                            {t('COMMON.ORDER.RETURNED')}
                        </button>
                    </div>
                )}

                {/* Orders list */}
                {filteredOrders.length === 0 ? (
                    <div className='text-center py-16 bg-white rounded-lg shadow'>
                        <Package className='mx-auto h-16 w-16 text-gray-400' />
                        <h3 className='mt-2 text-xl font-medium text-gray-900'>{t('COMMON.USER.ORDER_EMPTY')}</h3>
                        <p className='mt-1 text-lg text-gray-500'>{t('COMMON.USER.ORDER_EMPTY_MESSAGE')}</p>
                        <div className='mt-6'>
                            <Link
                                href='/products'
                                className='text-center inline-flex items-center px-5 py-2.5 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700'
                            >
                                {t('COMMON.USER.SHOP_NOW')}
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className='space-y-6'>
                        {filteredOrders.map(order => {
                            const statusDetails = getStatusDetails(order.status)

                            return (
                                <div
                                    key={order.id}
                                    className='bg-white rounded-[12px] shadow-[0_4px_16px_rgba(0,0,0,0.1)] overflow-hidden'
                                >
                                    {/* Order header */}
                                    <div className='px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between bg-[rgba(59,130,246,0.08)]'>
                                        <div className='flex items-center space-x-5'>
                                            <div className='flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white'>
                                                <Package className='w-6 h-6' />
                                            </div>
                                            <div>
                                                <div className='flex items-center'>
                                                    <h3 className='text-[18px] font-bold text-gray-800'>
                                                        {t('COMMON.ORDER.ORDER')} #{order.id}
                                                    </h3>
                                                    <span
                                                        className='ml-5 px-4 py-1.5 rounded-full text-base font-[600] shadow-sm text-[13px]'
                                                        style={{
                                                            backgroundColor: statusDetails.bgColor,
                                                            color: statusDetails.textColor
                                                        }}
                                                    >
                                                        {statusDetails.label}
                                                    </span>
                                                </div>
                                                <div className='mt-1.5 sm:flex sm:items-center text-base text-gray-500'>
                                                    <div className='mr-6 flex items-center'>
                                                        <Clock className='inline-block h-5 w-5 mr-2' />
                                                        {order.time} {order.date}
                                                    </div>
                                                    {order.shipping.tracking && (
                                                        <div className='flex items-center mt-2 sm:mt-0'>
                                                            <Truck className='inline-block h-5 w-5 mr-2' />
                                                            {order.shipping.tracking}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className='flex items-center mt-4 sm:mt-0'>
                                            <div className='text-right'>
                                                <p className='text-base font-medium'>{t('COMMON.USER.TOTAL_AMOUNT')}</p>
                                                <p className='text-[18px] mt-1.5 font-bold text-[#3675ff]'>
                                                    {order.total}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='text-base'>
                                        {/* Product list */}
                                        <div className='p-6'>
                                            <p className='font-bold text-[18px] text-gray-700'>
                                                {t('COMMON.USER.PRODUCT_DETAILS')}
                                            </p>

                                            <div className='overflow-hidden space-y-5 mt-5'>
                                                {order.items.map((item, index) => (
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
                                                                <p className='font-medium text-md text-gray-900'>
                                                                    {item.productName}
                                                                </p>
                                                                <p className='text-gray-500 text-sm'>
                                                                    SKU:{' '}
                                                                    <span className='text-black font-medium ml-1'>
                                                                        {item.sku}
                                                                    </span>
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
                                                                <p className='font-medium text-gray-900'>
                                                                    {item.price}
                                                                </p>
                                                            </div>
                                                            <p className='text-gray-500 mt-1'>
                                                                {t('COMMON.USER.QUANTITY')}: {item.quantity}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Action buttons */}
                                        <div className='p-6 flex flex-wrap gap-5 justify-end border-t border-gray-200'>
                                            <button className='px-6 py-3 rounded-lg border border-gray-300 font-medium text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition'>
                                                <MessageSquare className='w-4 h-4' />
                                                <span>{t('COMMON.USER.CONTACT_SUPPORT')}</span>
                                            </button>
                                            <button
                                                onClick={() => router.push(`orders/${order.id}`)}
                                                className='px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 flex items-center gap-2 transition'
                                            >
                                                <ShoppingBag className='w-4 h-4' />
                                                <span>{t('COMMON.USER.BUY_AGAIN')}</span>
                                            </button>
                                            <button
                                                onClick={() => router.push(`orders/${order.id}`)}
                                                className='px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 flex items-center gap-2 transition'
                                            >
                                                <ExternalLink className='w-4 h-4' />
                                                <span>{t('COMMON.USER.VIEW_DETAILS')}</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
