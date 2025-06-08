'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Clock, Package, Truck, MessageSquare, ExternalLink, ShoppingBag, Briefcase } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { formatCurrency, formatDate, formatTime } from '@/common/format'
import { IUserOrderGetAll } from '@/models/Order'
import EmptyItem from '@/components/EmptyItem'
import { useLazySearchByOrderCodeQuery } from '@/services/UserOrderService'

export default function UserOrderContent() {
    const { t } = useTranslation('common')
    const router = useRouter()
    const [searchKeyword, setSearchKeyword] = useState<string>('')
    const [order, setOrder] = useState<IUserOrderGetAll | undefined>(undefined)
    const [showEmptyState, setShowEmptyState] = useState(true)

    const [triggerSearch, { data: orderData, isFetching }] = useLazySearchByOrderCodeQuery()

    useEffect(() => {
        if (orderData && orderData.data) {
            setOrder(orderData.data)
            setShowEmptyState(false)
        }
    }, [orderData])

    const getStatusDetails = (status: string) => {
        const statusMap = {
            processing: { label: t('COMMON.ORDER.PROCESSING'), bgColor: '#f32160' },
            pending: { label: t('COMMON.ORDER.PENDING'), bgColor: '#ff9800' },
            shipping: { label: t('COMMON.ORDER.SHIPPING'), bgColor: '#03a9f4' },
            delivered: { label: t('COMMON.ORDER.DELIVERED'), bgColor: '#15cf23' },
            cancelled: { label: t('COMMON.ORDER.CANCELLED'), bgColor: '#ff5630' },
            returned: { label: t('COMMON.ORDER.RETURNED'), bgColor: '#607d8b' }
        }
        return {
            ...(statusMap[status] || statusMap['returned']),
            textColor: '#fff'
        }
    }

    return (
        <div className='min-h-screen'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='mb-6'>
                    <h1 className='text-2xl font-bold text-gray-900'>Lịch sử mua hàng</h1>
                    <p className='text-gray-600 mt-1'>
                        Xem lại các đơn hàng bạn đã đặt và theo dõi tình trạng giao hàng.
                    </p>
                </div>

                {/* Search & Filter */}
                <div className='flex flex-col md:flex-row md:items-center justify-between gap-5 mb-6'>
                    <div className='relative w-full sm:max-w-lg'>
                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                            <Search className='h-5 w-5 text-gray-400' />
                        </div>
                        <input
                            type='text'
                            value={searchKeyword || ''}
                            onChange={e => setSearchKeyword(e.target.value.trim())}
                            className='pl-10 w-full border border-gray-300 rounded-lg py-3 pr-[105px] outline-none focus:ring-blue-500 focus:border-blue-500'
                            placeholder={t('COMMON.USER.SEARCH_ORDER_PLACEHOLDER')}
                        />
                        <button
                            onClick={() => triggerSearch(searchKeyword)}
                            className='absolute inset-y-0 bg-blue-600 text-white font-medium rounded-tr-lg rounded-br-lg px-4 right-0 top-0'
                        >
                            Tìm kiếm
                        </button>
                    </div>
                </div>

                {/* No orders */}
                {isFetching ? (
                    <div className='flex items-center justify-center p-20'>
                        <div className='rounded-[15px] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.1)] bg-white p-12 max-w-md w-full text-center'>
                            <div className='relative w-16 h-16 mx-auto mb-6'>
                                <div className='absolute inset-0 rounded-full border-4 border-blue-100'></div>
                                <div className='absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin'></div>
                                <div className='absolute inset-2 rounded-full border-2 border-transparent border-t-blue-400 animate-spin animate-reverse'></div>
                            </div>
                            <h2 className='text-xl font-bold text-gray-900 mb-3'>Đang xử lý</h2>
                            <p className='text-gray-600'>Vui lòng chờ trong giây lát...</p>
                            <div className='flex justify-center space-x-1 mt-6'>
                                <div className='w-2 h-2 bg-blue-400 rounded-full animate-bounce'></div>
                                <div
                                    className='w-2 h-2 bg-blue-400 rounded-full animate-bounce'
                                    style={{ animationDelay: '0.1s' }}
                                ></div>
                                <div
                                    className='w-2 h-2 bg-blue-400 rounded-full animate-bounce'
                                    style={{ animationDelay: '0.2s' }}
                                ></div>
                            </div>
                        </div>
                    </div>
                ) : showEmptyState ? (
                    <EmptyItem
                        icon={<Briefcase className='w-10 h-10 text-blue-600' />}
                        title={t('COMMON.USER.ORDER_EMPTY')}
                        description={t('COMMON.USER.ORDER_EMPTY_MESSAGE')}
                        buttonText={t('COMMON.USER.SHOP_NOW')}
                        onClick={() => router.push('/products')}
                    />
                ) : (
                    <div className='space-y-6'>
                        {order &&
                            (() => {
                                const statusDetails = getStatusDetails(order.orderStatus)
                                return (
                                    <div key={order.id} className='bg-white rounded-[12px] shadow overflow-hidden'>
                                        {/* Header */}
                                        <div className='px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between bg-[rgba(59,130,246,0.08)]'>
                                            <div className='flex items-center space-x-5'>
                                                <div className='w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white'>
                                                    <Package className='w-6 h-6' />
                                                </div>
                                                <div>
                                                    <div className='flex items-center'>
                                                        <h3 className='text-[18px] font-bold text-gray-800'>
                                                            {t('COMMON.ORDER.ORDER')} #{order.orderCode}
                                                        </h3>
                                                        <span
                                                            className='ml-5 px-4 py-1.5 rounded-full text-[13px] font-semibold shadow-sm'
                                                            style={{
                                                                backgroundColor: statusDetails.bgColor,
                                                                color: statusDetails.textColor
                                                            }}
                                                        >
                                                            {statusDetails.label}
                                                        </span>
                                                    </div>
                                                    <div className='mt-1.5 flex flex-wrap items-center text-base text-gray-500 gap-4'>
                                                        <div className='flex items-center'>
                                                            <Clock className='h-5 w-5 mr-2' />
                                                            {formatTime(order.orderDate)} {formatDate(order.orderDate)}
                                                        </div>
                                                        {order.trackingCode && (
                                                            <div className='flex items-center'>
                                                                <Truck className='h-5 w-5 mr-2' />
                                                                {order.trackingCode}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='mt-4 sm:mt-0 text-right'>
                                                <p className='text-base font-medium'>{t('COMMON.USER.TOTAL_AMOUNT')}</p>
                                                <p className='text-[18px] mt-1.5 font-bold text-[#3675ff]'>
                                                    {formatCurrency(order.totalAmount)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Product List */}
                                        <div className='p-6'>
                                            <p className='font-bold text-[18px] text-gray-700 mb-5'>
                                                {t('COMMON.USER.PRODUCT_DETAILS')}
                                            </p>
                                            <div className='space-y-5'>
                                                {order.items?.map((item, index) => (
                                                    <div
                                                        key={index}
                                                        className='flex items-center gap-4 py-3 px-4 bg-gray-50 hover:bg-gray-100 rounded-[12px] justify-between'
                                                    >
                                                        <div className='flex items-center'>
                                                            <img
                                                                src={item.image || '/placeholder.jpg'}
                                                                alt={item.productName}
                                                                className='w-[62px] h-[62px] rounded-[10px] border border-gray-200 object-cover'
                                                            />
                                                            <div className='ml-5 space-y-1'>
                                                                <p className='text-md font-medium text-gray-900'>
                                                                    {item.productName}
                                                                </p>
                                                                <p className='text-sm text-gray-500'>SKU: {item.sku}</p>
                                                                <p className='text-sm text-gray-800'>{item.variants}</p>
                                                            </div>
                                                        </div>
                                                        <div className='text-right'>
                                                            <div className='flex items-center gap-2'>
                                                                <p className='line-through text-gray-400'>
                                                                    {formatCurrency(item.price)}
                                                                </p>
                                                                <p className='text-blue-600 font-medium'>
                                                                    {formatCurrency(item.discountPrice)}
                                                                </p>
                                                            </div>
                                                            <p className='text-sm text-gray-800 mt-1'>
                                                                {t('COMMON.USER.QUANTITY')}: {item.quantity}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className='p-6 flex flex-wrap gap-5 justify-end border-t border-gray-200'>
                                            <button className='btn-outline'>
                                                <MessageSquare className='w-4 h-4' />
                                                <span>{t('COMMON.USER.CONTACT_SUPPORT')}</span>
                                            </button>
                                            <button
                                                onClick={() => router.push(`/user/orders/${order.orderCode}`)}
                                                className='btn-primary'
                                            >
                                                <ShoppingBag className='w-4 h-4' />
                                                <span>{t('COMMON.USER.BUY_AGAIN')}</span>
                                            </button>
                                            <button
                                                onClick={() => router.push(`/user/orders/${order.orderCode}`)}
                                                className='btn-primary'
                                            >
                                                <ExternalLink className='w-4 h-4' />
                                                <span>{t('COMMON.USER.VIEW_DETAILS')}</span>
                                            </button>
                                        </div>
                                    </div>
                                )
                            })()}
                    </div>
                )}
            </div>
        </div>
    )
}
