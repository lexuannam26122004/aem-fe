'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    Search,
    Filter,
    Clock,
    Package,
    Truck,
    MessageSquare,
    ExternalLink,
    ShoppingBag,
    Briefcase
} from 'lucide-react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useTranslation } from 'react-i18next'
import { useSearchOrderQuery } from '@/services/UserOrderService'
import { formatCurrency, formatDate, formatTime } from '@/common/format'
import { IUserOrderFilter, IUserOrderGetAll } from '@/models/Order'
import Loading from '@/components/Loading'
import { debounce } from 'lodash'
import EmptyItem from '@/components/EmptyItem'

const ORDER_STATUSES = ['pending', 'processing', 'shipping', 'delivered', 'cancelled', 'returned']

export default function UserOrders() {
    const { t } = useTranslation('common')
    const router = useRouter()

    const [orders, setOrders] = useState<IUserOrderGetAll[]>([])
    const [hasMore, setHasMore] = useState(true)
    const [isFilterOpen, setIsFilterOpen] = useState(false)

    const [filter, setFilter] = useState<IUserOrderFilter>({
        pageSize: 10,
        pageNumber: 1,
        status: undefined
    })

    const {
        data: orderData,
        isLoading,
        refetch
    } = useSearchOrderQuery(filter, {
        refetchOnMountOrArgChange: true
    })

    useEffect(() => {
        refetch()
    }, [filter])

    useEffect(() => {
        if (orderData?.data?.records) {
            const newOrders = orderData.data.records
            setOrders(prev => (filter.pageNumber === 1 ? newOrders : [...prev, ...newOrders]))
            setHasMore(newOrders.length >= 10)
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

    const handleChangeTab = (tab?: string) => {
        setFilter({
            ...filter,
            status: tab,
            pageNumber: 1
        })
        setOrders([])
    }

    const debouncedSetFilter = useCallback(
        debounce(value => {
            setOrders([])
            setFilter({
                ...filter,
                pageNumber: 1,
                orderCode: value
            })
        }, 100),
        []
    )

    const handleSearchKeyword = (value: string) => {
        debouncedSetFilter(value)
    }

    if (isLoading && filter.pageNumber === 1) return <Loading />

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
                    <div className='relative w-full sm:max-w-xs'>
                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                            <Search className='h-5 w-5 text-gray-400' />
                        </div>
                        <input
                            type='text'
                            onChange={e => handleSearchKeyword(e.target.value.trim())}
                            className='pl-10 w-full sm:w-[400px] border border-gray-300 rounded-lg py-3 outline-none focus:ring-blue-500 focus:border-blue-500'
                            placeholder={t('COMMON.USER.SEARCH_ORDER_PLACEHOLDER')}
                        />
                    </div>

                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className='px-6 py-3 bg-white border border-[#3675ff] text-[#3675ff] rounded-lg hover:bg-blue-50 transition flex items-center font-medium'
                    >
                        <Filter className='h-5 w-5 mr-2' />
                        {t('COMMON.USER.FILTER')}
                    </button>
                </div>

                {/* Status Tabs */}
                {isFilterOpen && (
                    <div className='mb-6 bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-3'>
                        <button
                            onClick={() => handleChangeTab(undefined)}
                            className={`px-5 py-2.5 rounded-lg text-base font-medium ${
                                !filter.status
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {t('COMMON.ORDER.ALL')}
                        </button>
                        {ORDER_STATUSES.map(stt => (
                            <button
                                key={stt}
                                onClick={() => handleChangeTab(stt)}
                                className={`px-5 py-2.5 rounded-lg text-base font-medium ${
                                    filter.status === stt
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {t(`COMMON.ORDER.${stt.toUpperCase()}`)}
                            </button>
                        ))}
                    </div>
                )}

                {/* No orders */}
                {orders.length === 0 ? (
                    <EmptyItem
                        icon={<Briefcase className='w-10 h-10 text-blue-600' />}
                        title={t('COMMON.USER.ORDER_EMPTY')}
                        description={t('COMMON.USER.ORDER_EMPTY_MESSAGE')}
                        buttonText={t('COMMON.USER.SHOP_NOW')}
                        onClick={() => router.push('/products')}
                    />
                ) : (
                    <InfiniteScroll
                        dataLength={orders.length}
                        style={{ overflow: 'visible' }}
                        next={() => setFilter({ ...filter, pageNumber: filter.pageNumber + 1 })}
                        hasMore={hasMore}
                        loader={<Loading />}
                    >
                        <div className='space-y-6'>
                            {orders.map(order => {
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
                                                onClick={() => router.push(`orders/${order.orderCode}`)}
                                                className='btn-primary'
                                            >
                                                <ShoppingBag className='w-4 h-4' />
                                                <span>{t('COMMON.USER.BUY_AGAIN')}</span>
                                            </button>
                                            <button
                                                onClick={() => router.push(`orders/${order.orderCode}`)}
                                                className='btn-primary'
                                            >
                                                <ExternalLink className='w-4 h-4' />
                                                <span>{t('COMMON.USER.VIEW_DETAILS')}</span>
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </InfiniteScroll>
                )}
            </div>
        </div>
    )
}
