'use client'

import { useEffect, useState } from 'react'
import { Heart, Bell, X, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { IFavoriteCreate, IFavoriteItem } from '@/models/Favorite'
import { useCreateFavoriteMutation } from '@/services/FavoriteService'
import { useToast } from '@/hooks/useToast'

interface FavoriteFormModalProps {
    isOpen: boolean
    onClose: () => void
    productId: number
    variants: IFavoriteItem[]
    productName: string
    currentPrice: number
    onChange?: () => void
}

export default function FavoriteFormModal({
    isOpen,
    onClose,
    productId,
    variants,
    productName,
    currentPrice,
    onChange
}: FavoriteFormModalProps) {
    const [isNotify, setIsNotify] = useState(false)
    const [expectedPrice, setExpectedPrice] = useState('')
    const { t } = useTranslation('common')
    const [addFavorite, { isLoading, isSuccess, isError }] = useCreateFavoriteMutation()
    const toast = useToast()

    const handleSubmit = () => {
        const favoriteData: IFavoriteCreate = {
            productId,
            isNotify,
            favoriteItems: variants,
            expectedPrice: expectedPrice ? Number(expectedPrice) : undefined
        }
        addFavorite(favoriteData)
    }

    useEffect(() => {
        if (isSuccess) {
            toast('Thêm vào yêu thích thành công', 'success')
            if (onChange) {
                onChange()
            }
            closeModal()
        }
        if (isError) {
            toast('Thêm vào yêu thích thất bại', 'error')
        }
    }, [isSuccess, isError])

    const closeModal = () => {
        onClose()
        setIsNotify(false)
        setExpectedPrice('')
    }

    if (!isOpen) return null

    return (
        <div>
            <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                <div className='bg-white rounded-xl shadow-xl w-full max-w-md mx-4'>
                    {/* Header */}
                    <div className='px-6 py-4 border-b flex items-center justify-between'>
                        <h2 className='font-bold text-[18px] text-gray-800 flex items-center'>
                            <Heart size={20} className='w-5 h-5 text-red-500 mr-3' />
                            Thêm vào yêu thích
                        </h2>
                        <button
                            onClick={closeModal}
                            disabled={isLoading}
                            className='text-gray-500 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className='p-6 space-y-6'>
                        {/* Product Info */}
                        <div className='bg-gray-50 rounded-lg p-4'>
                            <h3 className='font-medium text-gray-900 mb-2'>{productName}</h3>
                            <p className='text-blue-600 font-semibold'>
                                Giá hiện tại: {currentPrice.toLocaleString()} VND
                            </p>
                        </div>

                        {/* Notification Toggle */}
                        <div className='space-y-3'>
                            <div className='flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-100'>
                                <div className='flex items-center'>
                                    <Bell className='w-5 h-5 text-blue-600 mr-3' />
                                    <span className='text-gray-700 font-medium'>Bật thông báo về giá</span>
                                </div>
                                <label className='flex items-center cursor-pointer'>
                                    <input
                                        type='checkbox'
                                        checked={isNotify}
                                        onChange={e => setIsNotify(e.target.checked)}
                                        disabled={isLoading}
                                        className='w-5 h-5 cursor-pointer rounded-[4px] border border-blue-400 accent-[#3675ff] rounded disabled:opacity-50 disabled:cursor-not-allowed'
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Expected Price */}
                        <div className='space-y-3'>
                            <label className='block text-sm font-medium text-gray-700'>Giá mong muốn (tùy chọn)</label>
                            <div className='relative'>
                                <input
                                    type='number'
                                    value={expectedPrice}
                                    onChange={e => setExpectedPrice(e.target.value)}
                                    disabled={isLoading}
                                    className='w-full border border-gray-300 rounded-lg pl-4 pr-16 py-3 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50'
                                    placeholder='Nhập giá mong muốn'
                                />
                                <span className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm'>
                                    VND
                                </span>
                            </div>
                            <p className='text-sm text-blue-500'>
                                {isNotify
                                    ? t('COMMON.USER.NOTIFICATION_WHEN_PRICE_REDUCED')
                                    : t('COMMON.USER.ENABLE_NOTIFICATION')}
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className='px-6 py-4 border-t flex justify-end space-x-4'>
                        <button
                            onClick={closeModal}
                            disabled={isLoading}
                            className='px-6 py-2 font-medium border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className='px-6 py-2 font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-500'
                        >
                            {isLoading ? (
                                <Loader2 size={16} className='mr-2 animate-spin' />
                            ) : (
                                <Heart size={16} className='mr-2' />
                            )}
                            Thêm vào yêu thích
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
