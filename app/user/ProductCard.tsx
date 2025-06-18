'use client'

import React from 'react'
import { Star, Zap, Flame } from 'lucide-react'
import { formatCurrency } from '@/common/format'
import { IProductSearch } from '@/models/Product'
import { Tooltip } from '@mui/material'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { addProductId, productCompareSelector, setProductIds } from '@/redux/slices/productCompareSlice'
import { useToast } from '@/hooks/useToast'
import { isArray } from 'lodash'

interface IProductCardProps {
    product: IProductSearch
    isHotSale?: boolean
}

const ProductCard = ({ product, isHotSale = false }: IProductCardProps) => {
    const router = useRouter()

    // const buttons = [
    //     {
    //         id: 'wishlist',
    //         tooltip: t('COMMON.USER.FAVORITE'),
    //         icon: Heart,
    //         onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
    //             e.stopPropagation()
    //             setIsWishlisted(!isWishlisted)
    //         },
    //         className: isWishlisted
    //             ? 'bg-pink-600 text-white shadow-md'
    //             : 'bg-white/90 text-gray-500 hover:bg-pink-100 hover:text-pink-600 hover:shadow-md',
    //         iconClassName: isWishlisted ? 'fill-current' : ''
    //     },
    //     {
    //         id: 'add-to-cart',
    //         tooltip: t('COMMON.USER.ADD_TO_CART'),
    //         icon: ShoppingBag,

    //         onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
    //             e.stopPropagation()
    //         },
    //         className: 'bg-white/90 text-gray-500 hover:bg-blue-100 hover:text-blue-600 hover:shadow-md'
    //     },
    //     {
    //         id: 'shop-now',
    //         tooltip: t('COMMON.USER.SHOP_NOW'),
    //         icon: ShoppingCart,

    //         onClick: (e: React.MouseEvent<HTMLButtonElement>) => e.stopPropagation(),
    //         className: 'bg-white/90 text-gray-500 hover:bg-emerald-100 hover:text-emerald-600 hover:shadow-md'
    //     }
    // ]

    const renderStars = (rating: number) => {
        const fullStars = Math.floor(rating)
        const hasHalfStar = rating % 1 !== 0

        return (
            <div className='flex items-center space-x-1'>
                {[...Array(fullStars)].map((_, i) => (
                    <Star key={i} className='w-4 h-4 fill-[#ffba17] text-[#ffba17]' />
                ))}
                {hasHalfStar && <Star className='w-4 h-4 fill-[#ffba17] text-[#ffba17] opacity-50' />}
            </div>
        )
    }

    const dispatch = useDispatch()
    const compareIds = useSelector(productCompareSelector) || []
    const toast = useToast()

    const handleCompare = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()

        console.log('handleCompare', product.id, compareIds)

        if (isArray(compareIds) && compareIds.includes(product.id)) {
            toast('Sản phẩm đã có trong danh sách so sánh', 'info')
            return
        }

        if (isArray(compareIds) && compareIds.length >= 2) {
            toast('Chỉ có thể so sánh tối đa 2 sản phẩm', 'error')
            return
        }

        if (compareIds.length === 0) {
            dispatch(setProductIds([product.id]))
            toast('Đã thêm vào danh sách so sánh', 'success')
            return
        }

        dispatch(addProductId(product.id))
        toast('Đã thêm vào danh sách so sánh', 'success')
    }

    const buttonClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation()
        router.push(`/user/products/${product.id}`)
    }

    return (
        <div
            key={product.id}
            onClick={buttonClick}
            className={`group relative ${
                isHotSale ? 'rounded-[18px] rounded-b-[18px]' : 'rounded-[15px] rounded-b-[18px]'
            } overflow-hidden w-full shadow-[0_4px_16px_rgba(0,0,0,0.1)] bg-white hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer`}
        >
            {/* Gradient Border Effect */}
            <div
                className={`absolute inset-0 bg-gradient-to-r ${
                    isHotSale ? 'from-orange-500 via-red-500 to-yellow-400' : 'from-blue-500 via-cyan-500 to-teal-500'
                } opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-0.5 rounded-[17.5px]`}
            >
                <div className='w-full h-full bg-white rounded-2xl'></div>
            </div>

            {/* Hot Label */}
            {product.discountRate >= 20 && (
                <div
                    style={{ transform: 'rotate(35deg)' }}
                    className='absolute top-[19px] z-50 right-[5px] bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center space-x-1'
                >
                    <Zap className='w-3 h-3' />
                    <span>HOT</span>
                </div>
            )}

            {/* Content */}
            <div className='relative h-[100%] z-10 p-4 flex flex-col'>
                {/* Image Section */}
                <div
                    className='relative mb-4 overflow-hidden rounded-xl'
                    // onMouseEnter={() => setIsHovered(true)}
                    // onMouseLeave={() => setIsHovered(false)}
                >
                    <div className='aspect-square bg-gradient-to-br from-blue-50 to-cyan-50 p-[15px]'>
                        <img
                            src={product.image}
                            alt={product.productName}
                            className='w-full h-full object-cover rounded-lg transition-all duration-500 transform group-hover:scale-110'
                        />
                    </div>

                    {/* Overlay Elements */}
                    <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl'></div>

                    {/* Discount Badge */}
                    {product.discountRate > 0 && (
                        <div className='absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center space-x-1 shadow-lg'>
                            <Flame className='w-4 h-4' />
                            <span>-{product.discountRate}%</span>
                        </div>
                    )}

                    {/* Quick Actions */}
                    <div className='absolute bottom-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0'>
                        {/* {buttons.map(button => (
                            <Tooltip key={button.id} title={button.tooltip} arrow placement='top'>
                                <button
                                    onClick={button.onClick}
                                    className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${button.className}`}
                                >
                                    {React.createElement(button.icon, {
                                        className: `w-5 h-5 ${button.iconClassName || ''}`.trim()
                                    })}
                                </button>
                            </Tooltip>
                        ))} */}

                        <Tooltip title='So sánh sản phẩm' arrow placement='top'>
                            <button
                                onClick={handleCompare}
                                className='p-2 rounded-full backdrop-blur-sm transition-all duration-300 bg-white/90 text-gray-500 hover:bg-purple-100 hover:text-purple-600 hover:shadow-md'
                            >
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    className='w-5 h-5'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    stroke='currentColor'
                                >
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth={2}
                                        d='M10 3H5a2 2 0 00-2 2v14a2 2 0 002 2h5m4-18h5a2 2 0 012 2v14a2 2 0 01-2 2h-5M12 8v8'
                                    />
                                </svg>
                            </button>
                        </Tooltip>
                    </div>
                </div>

                <div className='flex-1 flex flex-col justify-between'>
                    {/* Category */}
                    <div className='space-y-2.5'>
                        <div className='flex items-center justify-between'>
                            <span className='text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full'>
                                {product.brand}
                            </span>

                            <div className={`px-3 py-1.5 bg-green-500 rounded-lg text-xs text-white font-medium`}>
                                Còn hàng
                            </div>
                        </div>

                        <h3 className='font-bold text-gray-900 text-md leading-tight line-clamp-2'>
                            {product.productName}
                        </h3>

                        <div className='space-y-1'>
                            <div className='space-x-2'>
                                <span className='text-md font-bold text-blue-600'>
                                    {formatCurrency(product.discountPrice)}
                                </span>

                                {product.discountRate > 0 && (
                                    <span className='text-sm text-gray-500 line-through'>
                                        {formatCurrency(product.price)}
                                    </span>
                                )}
                            </div>
                        </div>

                        {product.discountRate > 0 && (
                            <div className='text-sm text-green-600 font-medium'>
                                Tiết kiệm {formatCurrency(product.price - product.discountPrice)}
                            </div>
                        )}
                    </div>

                    {/* Rating & Sold Count */}
                    <div className='flex items-center justify-between mt-2.5'>
                        <div className='flex items-center space-x-2'>
                            {renderStars(product.rating)}
                            <span className='text-sm font-semibold text-gray-700'>{product.rating}</span>
                        </div>
                        <span className='text-sm text-gray-700'>
                            {product.soldCount.toLocaleString('vi-VN')} đã bán
                        </span>
                    </div>
                </div>
            </div>

            {/* Shine Effect */}
            <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out'></div>
        </div>
    )
}

export default ProductCard
