'use client'

import { useEffect, useState } from 'react'
import { Heart, Trash2, Bell, BellOff, ChevronDown, ChevronUp, ShoppingCart, Loader2 } from 'lucide-react'
import { formatCurrency } from '@/common/format'
import { useTranslation } from 'react-i18next'
import EmptyItem from '@/components/EmptyItem'
import { useRouter } from 'next/navigation'
import {
    useDeleteFavoriteMutation,
    useSearchFavoriteQuery,
    useUpdateExpectedPriceMutation,
    useUpdateNotifyMutation
} from '@/services/FavoriteService'
import Loading from '@/components/Loading'
import { IFavorite } from '@/models/Favorite'
import { useToast } from '@/hooks/useToast'
import { ICartCreate } from '@/models/Cart'
import { useCreateCartMutation } from '@/services/CartService'

export default function WishlistComponent() {
    const { t } = useTranslation('common')
    const router = useRouter()
    const [items, setItems] = useState<IFavorite[]>([])
    const [expandedItem, setExpandedItem] = useState<number | null>(null)
    const [showEmptyState, setShowEmptyState] = useState(false)
    const {
        data: favoriteResponse,
        isLoading: isFavoriteLoading,
        isFetching: isFavoriteFetching
    } = useSearchFavoriteQuery(undefined, {
        refetchOnMountOrArgChange: true
    })
    const [updateNotify] = useUpdateNotifyMutation()
    const [updateExpectedPrice] = useUpdateExpectedPriceMutation()
    const [removeFavorite, { isLoading: isRemoveFavoriteLoading, originalArgs }] = useDeleteFavoriteMutation()
    const toast = useToast()
    const [createCart, { isLoading }] = useCreateCartMutation()

    useEffect(() => {
        if (favoriteResponse && favoriteResponse.data && favoriteResponse.data.records) {
            setItems(favoriteResponse.data.records)
            setShowEmptyState(favoriteResponse.data.records.length === 0)
        }
    }, [favoriteResponse])

    const toggleExpand = (id: number) => {
        setExpandedItem(expandedItem === id ? null : id)
    }

    const toggleNotification = (id: number) => {
        const snapshot = items.map(item => ({ ...item }))

        setItems(items.map(item => (item.id === id ? { ...item, isNotify: !item.isNotify } : item)))
        updateNotify(id)
            .unwrap()
            .catch(() => {
                setItems(snapshot)
            })
    }

    const removeItem = (id: number) => {
        const snapshot = items.map(item => ({ ...item }))

        removeFavorite(id)
            .unwrap()
            .then(() => {
                setItems(items.filter(item => item.id !== id))
                if (items.length <= 1) {
                    setShowEmptyState(true)
                }
                toast('Xóa sản phẩm khỏi danh sách yêu thích thành công!', 'success')
            })
            .catch(() => {
                setItems(snapshot)
                if (snapshot.length >= 1) {
                    setShowEmptyState(false)
                }
            })
    }

    const changeTargetPrice = (id: number, price: number) => {
        setItems(items.map(item => (item.id === id ? { ...item, expectedPrice: price } : item)))
    }

    const updateTargetPrice = (id: number, price: number) => {
        const snapshot = items.map(item => ({ ...item }))

        updateExpectedPrice({ id: id, expectedPrice: price })
            .unwrap()
            .then(() => {
                toast('Cập nhật giá mong đợi thành công!', 'success')
            })
            .catch(() => {
                toast('Cập nhật giá mong đợi thất bại!', 'error')
                setItems(snapshot)
            })
    }

    const handleAddToCart = (item: IFavorite) => {
        const cart: ICartCreate = {
            productId: item.productId,
            quantity: 1,
            selections: item.favoriteItems
        }

        createCart(cart)
            .unwrap()
            .then(() => toast('Thêm vào giỏ hàng thành công!', 'success'))
            .catch(() => toast('Thêm vào giỏ hàng thất bại!', 'error'))
    }

    if (isFavoriteLoading) {
        return <Loading />
    }

    return (
        <div className='max-w-7xl mx-auto sm:px-6 lg:px-8'>
            {showEmptyState ? (
                <EmptyItem
                    icon={<Heart className='w-10 h-10 text-blue-600' />}
                    title={t('COMMON.USER.FAVORITE_LIST_EMPTY')}
                    description={t('COMMON.USER.FAVORITE_LIST_NO_ITEMS')}
                    buttonText={t('COMMON.USER.CONTINUE_SHOPPING')}
                    onClick={() => router.push('/')}
                />
            ) : (
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
                                                src={item.image}
                                                className='w-[75px] h-[75px] rounded-[10px] border border-gray-200 object-cover'
                                                alt={item.productName}
                                            />
                                            {item.discountRate > 0 && (
                                                <div className='absolute -top-[10px] -right-[10px] bg-red-500 text-white text-xs font-bold rounded-full w-[35px] h-[35px] flex items-center justify-center'>
                                                    -{item.discountRate}%
                                                </div>
                                            )}
                                        </div>

                                        <div className='ml-5 space-y-1'>
                                            <p className='font-medium text-md text-gray-900'>{item.productName}</p>
                                            <p className='text-gray-500 text-sm'>SKU: {item.sku}</p>
                                            <p className='text-black text-sm'>{item.variants}</p>
                                        </div>
                                    </div>

                                    <div className='text-right flex flex-col items-end'>
                                        {item.discountRate > 0 ? (
                                            <div className='flex items-center gap-4'>
                                                <p className='line-through text-gray-400'>
                                                    {formatCurrency(item.originalPrice)}
                                                </p>
                                                <p className='font-medium text-[#3675ff]'>
                                                    {formatCurrency(item.discountPrice)}
                                                </p>
                                            </div>
                                        ) : (
                                            <p className='font-semibold text-gray-900'>
                                                {formatCurrency(item.originalPrice)}
                                            </p>
                                        )}

                                        <div className='flex mt-4 space-x-4'>
                                            <button
                                                className='p-2 bg-blue-50 rounded-full text-blue-600 hover:bg-blue-100 transition-colors'
                                                onClick={() => toggleNotification(item.id)}
                                            >
                                                {item.isNotify ? <Bell size={18} /> : <BellOff size={18} />}
                                            </button>

                                            <button
                                                disabled={isRemoveFavoriteLoading}
                                                className='p-2 bg-red-50 rounded-full text-red-600 hover:bg-red-100 transition-colors'
                                                onClick={() => removeItem(item.id)}
                                            >
                                                {(isFavoriteFetching || isRemoveFavoriteLoading) &&
                                                originalArgs == item.id ? (
                                                    <Loader2 className='animate-spin' size={18} />
                                                ) : (
                                                    <Trash2 size={18} />
                                                )}
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
                                            <div className='flex justify-between'>
                                                <div>
                                                    <label className='font-medium text-gray-700 block mb-2'>
                                                        {t('COMMON.USER.DESIRED_PRICE')}
                                                    </label>
                                                    <div className='flex items-center'>
                                                        <input
                                                            type='number'
                                                            value={item.expectedPrice || ''}
                                                            onChange={e =>
                                                                changeTargetPrice(item.id, parseInt(e.target.value))
                                                            }
                                                            className='p-2 border border-gray-300 rounded-lg mr-2 w-32'
                                                        />
                                                        <span className='text-gray-500'>VND</span>

                                                        <button
                                                            onClick={() =>
                                                                updateTargetPrice(item.id, item.expectedPrice)
                                                            }
                                                            className='ml-4 px-4 py-1.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors'
                                                        >
                                                            Lưu
                                                        </button>
                                                    </div>
                                                    <p className='text-sm text-blue-600 mt-2'>
                                                        {item.isNotify
                                                            ? t('COMMON.USER.NOTIFICATION_WHEN_PRICE_REDUCED')
                                                            : t('COMMON.USER.ENABLE_NOTIFICATION')}
                                                    </p>
                                                </div>
                                                <button
                                                    disabled={isLoading}
                                                    onClick={() => handleAddToCart(item)}
                                                    className='px-6 mt-auto py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center'
                                                >
                                                    {isLoading ? (
                                                        <Loader2 className='animate-spin mr-2' size={16} />
                                                    ) : (
                                                        <ShoppingCart size={16} className='mr-2' />
                                                    )}
                                                    {t('COMMON.USER.ADD_TO_CART')}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
