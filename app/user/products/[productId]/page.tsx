'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
    Star,
    Wifi,
    Zap,
    Shield,
    Smartphone,
    ShoppingBag,
    ShoppingCart,
    Flame,
    Heart,
    ThumbsUp,
    ThumbsDown,
    FileText,
    ArrowRight,
    Loader2
} from 'lucide-react'
import ImageGallery from '@/components/ImageGallery'
import ImageGalleryThumbnail from '@/components/ImageGalleryThumbnail'
import { useTranslation } from 'react-i18next'
import { formatCurrency, formatDate, formatTime } from '@/common/format'
import EnhancedPagination from '@/components/EnhancedPagination'
import ProductCard from '../../ProductCard'
import { IProductGetById, IProductSearch } from '@/models/Product'
import { useGetByIdProductQuery, useSearchProductQuery } from '@/services/ProductService'
import { usePathname } from 'next/navigation'
import Loading from '@/components/Loading'
import ObjectEmptyState from '@/components/ObjectEmptyState'
import { useDeleteFavoriteMutation, useGetFavoriteCountByProductQuery } from '@/services/FavoriteService'
import FavoriteFormModal from '@/components/FavoriteFormModal'
import { useGetReviewByProductIdQuery } from '@/services/ReviewService'
import { useCreateInteractiveReviewMutation } from '@/services/InteractiveReviewService'
import ProjectFormModal from '@/components/ProjectFormModal'
import { useCreateCartMutation } from '@/services/CartService'
import { ICartCreate, ICartItem } from '@/models/Cart'
import { useToast } from '@/hooks/useToast'

type ProductHotSaleProps = {
    title: string
    products: IProductSearch[]
    viewAll?: boolean
}

const ProductDetail = () => {
    const { t } = useTranslation('common')
    const [activeTab, setActiveTab] = useState('info')
    const [pageNumber, setPageNumber] = useState(1)
    const pathName = usePathname()
    const productId = pathName.split('/').pop()
    const [copied, setCopied] = useState(false)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)
    const [isShowProjectModal, setIsShowProjectModal] = useState(false)
    const [isShowFavoriteModal, setIsShowFavoriteModal] = useState(false)
    const [reviews, setReviews] = useState([])
    const [favoriteCount, setFavoriteCount] = useState({ isFavorite: false, count: 0 })
    const [selectedOptions, setSelectedOptions] = useState({} as Record<number, number>)

    const {
        data: reviewsResponse,
        isLoading: isReviewsLoading,
        refetch: reviewRefetch
    } = useGetReviewByProductIdQuery({
        productId: Number(productId),
        pageNumber: pageNumber
    })
    const { data: productResponse, isLoading: isProductLoading } = useGetByIdProductQuery(Number(productId))
    const [createCart, { isLoading: isAddCartLoading }] = useCreateCartMutation()

    const { data: dataResponseFlashSale, isLoading: isLoadingResponseFlashSale } = useSearchProductQuery({
        pageSize: 6,
        pageNumber: 1,
        typeSection: 'hot_sale'
    })

    const [deleteFavorite] = useDeleteFavoriteMutation()

    const [createInteractiveReview] = useCreateInteractiveReviewMutation()

    const {
        data: favoriteCountResponse,
        isLoading: isFavoriteCountLoading,
        refetch: refetchFavoriteCount
    } = useGetFavoriteCountByProductQuery(Number(productId))

    const rating = reviewsResponse?.data?.summary?.rating || 5
    const oneStarCount = reviewsResponse?.data?.summary?.oneStarCount || 0
    const twoStarCount = reviewsResponse?.data?.summary?.twoStarCount || 0
    const threeStarCount = reviewsResponse?.data?.summary?.threeStarCount || 0
    const fourStarCount = reviewsResponse?.data?.summary?.fourStarCount || 0
    const fiveStarCount = reviewsResponse?.data?.summary?.fiveStarCount || 0
    const reviewCount = reviewsResponse?.data?.summary?.reviewCount || 0
    const reviewData = useMemo(() => {
        return reviewsResponse?.data?.summary?.reviews || []
    }, [reviewsResponse])
    const favoriteCountData = useMemo(() => {
        return favoriteCountResponse?.data || { isFavorite: false, count: 0 }
    }, [favoriteCountResponse])
    const product = productResponse?.data as IProductGetById
    const productsFlashSale = (dataResponseFlashSale?.data?.records as IProductSearch[]) || []
    const toast = useToast()

    const handleOptionChange = (optionId: number, valueId: number) => {
        setSelectedOptions(prev => ({
            ...prev,
            [optionId]: valueId
        }))
    }

    useEffect(() => {
        const newReviews = reviewData

        const isEqual = JSON.stringify(reviews) === JSON.stringify(newReviews)

        if (!isEqual) {
            setReviews(newReviews)
        }
    }, [reviewData])

    useEffect(() => {
        if (product && product.variants) {
            const acc: Record<number, number> = {}
            product.variants.forEach(variant => {
                variant.options.forEach(option => {
                    if (option.values.length > 0) {
                        acc[option.id] = option.values[0].id
                    }
                })
            })
            setSelectedOptions(acc)
        }
    }, [product])

    useEffect(() => {
        const newCount = favoriteCountData || { isFavorite: false, count: 0 }

        const isEqual = JSON.stringify(favoriteCount) === JSON.stringify(newCount)

        if (!isEqual) {
            setFavoriteCount(newCount)
        }
    }, [favoriteCountData])

    const ProductSection = ({ title, products, viewAll = false }: ProductHotSaleProps) => {
        return (
            <div>
                <div className='flex justify-between items-center mb-6'>
                    <h2 className='text-xl font-bold text-gray-800'>{title}</h2>
                    {viewAll && (
                        <button className='text-blue-600 flex items-center hover:text-blue-800'>
                            {t('COMMON.USER.SEE_ALL')} <ArrowRight size={16} className='ml-1' />
                        </button>
                    )}
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                    {products.slice(0, 4).map((product, index) => (
                        <ProductCard product={product} key={index} />
                    ))}
                </div>
            </div>
        )
    }

    const features = [
        { icon: Wifi, title: 'WiFi 6 Support', desc: 'Ultra-fast connectivity' },
        { icon: Zap, title: 'Smart AI', desc: 'Intelligent automation' },
        { icon: Shield, title: 'Bank-level Security', desc: '256-bit encryption' },
        { icon: Smartphone, title: 'Mobile Control', desc: 'iOS & Android apps' }
    ]

    const renderStars = (rating: number, size = 'w-[18px] h-[18px]', spacing = 'space-x-1') => {
        const fullStars = Math.floor(rating)
        const hasHalfStar = rating % 1 !== 0

        return (
            <div className={`flex items-center ${spacing}`}>
                {[...Array(fullStars)].map((_, i) => (
                    <Star key={i} className={`${size} fill-[#ffba17] text-[#ffba17]`} />
                ))}
                {hasHalfStar && <Star className={`${size} fill-[#ffba17] text-[#ffba17] opacity-50`} />}
            </div>
        )
    }

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href)
            setCopied(true)

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }

            timeoutRef.current = setTimeout(() => {
                setCopied(false)
            }, 2000)
        } catch {}
    }

    const handleAddToCart = (productId: number, selections: ICartItem[]) => {
        const cart: ICartCreate = {
            productId: productId,
            quantity: 1,
            selections: selections
        }

        createCart(cart)
            .unwrap()
            .then(() => toast('Thêm vào giỏ hàng thành công!', 'success'))
            .catch(() => toast('Thêm vào giỏ hàng thất bại!', 'error'))
    }

    useEffect(() => {
        reviewRefetch()
    }, [pageNumber])

    const handleFavorite = async () => {
        const snapshot = { ...favoriteCount }

        if (favoriteCount.isFavorite) {
            setFavoriteCount(prev => ({ ...prev, isFavorite: false, count: prev.count - 1 }))

            try {
                await deleteFavorite(Number(productId)).unwrap()
            } catch {
                setFavoriteCount(snapshot) // rollback nếu lỗi
            }
        } else {
            setIsShowFavoriteModal(true)
        }
    }

    const handleLikeDislike = (reviewId: number, type: 'like' | 'dislike') => {
        const snapshot = reviews.map(item => ({ ...item }))

        const updated = reviews.map(review => {
            if (review.id !== reviewId) return review

            const isLiked = review.interactionType === 'like'
            const isDisliked = review.interactionType === 'dislike'

            let newInteractionType: 'like' | 'dislike' | null = review.interactionType

            if (type === review.interactionType) {
                newInteractionType = null
            } else {
                newInteractionType = type
            }

            return {
                ...review,
                interactionType: newInteractionType,
                likes:
                    type === 'like'
                        ? review.likes + (isLiked ? -1 : isDisliked ? 1 : 1)
                        : review.likes - (isLiked ? 1 : 0),
                dislikes:
                    type === 'dislike'
                        ? review.dislikes + (isDisliked ? -1 : isLiked ? 1 : 1)
                        : review.dislikes - (isDisliked ? 1 : 0)
            }
        })

        setReviews(updated)

        createInteractiveReview({
            reviewId,
            interactionType: type
        })
            .unwrap()
            .catch(() => {
                setReviews(snapshot)
            })
    }

    if (isProductLoading || isLoadingResponseFlashSale || isFavoriteCountLoading || isReviewsLoading) {
        return <Loading />
    }

    return (
        <div className='max-w-7xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8'>
            {product ? (
                <div>
                    <div className='flex flex-col lg:flex-row gap-12'>
                        {/* Product Images */}
                        <div className='flex-1 max-w-lg'>
                            <ImageGallery images={product.images} />
                            <div className='flex items-center gap-5 mt-6'>
                                <button
                                    onClick={() => setIsShowProjectModal(true)}
                                    className='group flex items-center gap-2 px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-all duration-300 hover:shadow-md'
                                >
                                    <svg
                                        className='w-[18px] h-[18px] group-hover:scale-110 transition-transform'
                                        fill='none'
                                        viewBox='0 0 24 24'
                                        stroke='currentColor'
                                    >
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            strokeWidth={2}
                                            d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
                                        />
                                    </svg>
                                    <span className='font-medium text-sm'>{t('COMMON.USER.ADD_TO_PROJECT')}</span>
                                </button>

                                <div className='relative'>
                                    <button
                                        onClick={handleCopyLink}
                                        className='group flex items-center gap-2 px-4 py-3 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition-all duration-300 hover:shadow-md'
                                    >
                                        <svg
                                            className='w-[18px] h-[18px] group-hover:scale-110 transition-transform'
                                            fill='none'
                                            viewBox='0 0 24 24'
                                            stroke='currentColor'
                                        >
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                strokeWidth={2}
                                                d='M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z'
                                            />
                                        </svg>
                                        <span className='font-medium text-sm'>{t('COMMON.USER.SHARE')}</span>
                                    </button>

                                    {copied && (
                                        <div className='absolute top-full mt-2 left-1/2 whitespace-nowrap -translate-x-1/2 px-3 py-2 text-xs bg-green-50 text-green-600 rounded shadow'>
                                            Đã sao chép liên kết!
                                        </div>
                                    )}
                                </div>

                                <button
                                    className={`group flex items-center ${
                                        favoriteCount.isFavorite ? 'bg-[#e94c4c] text-white' : 'text-[#f11212]'
                                    } gap-2 px-4 py-[11px] border border-[#f11212] rounded-lg transition-all duration-300 hover:shadow-md`}
                                    onClick={handleFavorite}
                                >
                                    <Heart
                                        size={18}
                                        className={`group-hover:scale-110 ${
                                            !favoriteCount.isFavorite
                                                ? 'text-[#f11212] fill-[#f11212]'
                                                : 'text-white fill-white'
                                        } transition-transform`}
                                    />
                                    <span className='font-medium text-sm'>{t('COMMON.USER.FAVORITE')}</span>
                                </button>
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className='flex-1 space-y-6'>
                            {/* Title & Stock Status */}
                            <div className='space-y-5 pb-5 border-b border-gray-200'>
                                <h1 className='text-3xl font-bold text-gray-900'>{product.productName}</h1>
                                <div className='flex items-center gap-3'>
                                    <span className='inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-green-100 text-green-500'>
                                        <div className='w-2 h-2 bg-green-400 rounded-full mr-2'></div>
                                        {t('COMMON.PRODUCT.IN_STOCK')}
                                    </span>
                                    <span className='text-gray-500'>{t('COMMON.USER.READY_TO_SHIP')}</span>
                                </div>

                                {/* Rating & Reviews */}
                                <div className='flex items-center gap-6'>
                                    <div className='flex items-center space-x-2'>
                                        {renderStars(product.rating)}
                                        <span className='text-sm font-semibold text-gray-700'>{product.rating}</span>
                                    </div>

                                    <div className='w-px h-4 bg-gray-300'></div>

                                    <div className='flex items-center gap-2 text-sm text-gray-600'>
                                        <Heart size={18} color='#f11212' fill='#f11212' />
                                        <span className='font-semibold text-gray-700'>{favoriteCount.count}</span>
                                    </div>

                                    <div className='w-px h-4 bg-gray-300'></div>

                                    <div className='flex items-center gap-6 text-sm text-gray-700'>
                                        <div className='flex items-center gap-1.5'>
                                            <span className='font-medium'>{product.reviewCount}</span>
                                            <span>{t('COMMON.PRODUCT.REVIEWS')}</span>
                                        </div>
                                        <div className='w-px h-4 bg-gray-300'></div>
                                        <div className='flex items-center gap-1.5'>
                                            <span className='font-medium'>{product.soldCount}</span>
                                            <span>{t('COMMON.PRODUCT.SOLD')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Price */}
                            <div className='bg-blue-50 rounded-lg p-6'>
                                <div className='flex items-center gap-5'>
                                    <div className='text-3xl font-bold text-blue-600'>
                                        {formatCurrency(product.discountPrice)}
                                    </div>
                                    <div className='text-lg text-gray-500 line-through'>
                                        {formatCurrency(product.price)}
                                    </div>
                                    <div className='bg-gradient-to-r from-red-500 to-pink-500 text-white animate-pulse px-3.5 py-1.5 rounded-full text-sm font-bold flex items-center space-x-1.5 shadow-lg'>
                                        <Flame className='w-4 h-4' />
                                        <span>-{product.discountRate}%</span>
                                    </div>
                                </div>
                                <div className='flex items-center gap-5 mt-2'>
                                    <div className='text-green-500 font-medium'>
                                        {t('COMMON.USER.ECONOMICAL')} {formatCurrency(product.saveAmount)}
                                    </div>
                                    <p className='text-gray-600'>{t('COMMON.USER.SPECIAL_LAUNCH_PRICE')}</p>
                                </div>
                            </div>

                            {/* Description */}
                            <p className='text-[#6b7280] leading-relaxed'>{product.description}</p>

                            {/* Key Features */}
                            <div className='grid grid-cols-2 gap-4'>
                                {features.map((feature, index) => (
                                    <div
                                        key={index}
                                        className='flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500 transition-colors'
                                    >
                                        <div className='w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center'>
                                            <feature.icon size={20} className='text-blue-600' />
                                        </div>
                                        <div>
                                            <div className='font-medium text-gray-900 text-sm'>{feature.title}</div>
                                            <div className='text-xs text-gray-600'>{feature.desc}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Connectivity Options */}
                            {product.variants &&
                                product.variants.length > 0 &&
                                product.variants.map((variant, index) => (
                                    <div className='space-y-4' key={index}>
                                        {variant.options.map((option, optionIdx) => (
                                            <React.Fragment key={optionIdx}>
                                                <h3 className='font-semibold text-gray-900'>{option.optionName}</h3>
                                                <div className='flex flex-wrap gap-4'>
                                                    {!option.isHasImage
                                                        ? option.values.map((value, valueIdx) => (
                                                              <button
                                                                  key={valueIdx}
                                                                  onClick={() =>
                                                                      handleOptionChange(option.id, value.id)
                                                                  }
                                                                  className={`px-4 py-2.5 rounded-lg border-[1px] font-medium ${
                                                                      selectedOptions[option.id] === value.id
                                                                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                                                                          : 'border-gray-200 hover:border-blue-500 text-gray-700'
                                                                  }`}
                                                              >
                                                                  {value.value}
                                                              </button>
                                                          ))
                                                        : option.values.map((value, valueIdx) => (
                                                              <button
                                                                  key={valueIdx}
                                                                  onClick={() =>
                                                                      handleOptionChange(option.id, value.id)
                                                                  }
                                                                  className={`flex items-center gap-4 p-3 rounded-xl border-[1px] transition-all duration-100 text-left ${
                                                                      selectedOptions[option.id] === value.id
                                                                          ? 'border-blue-500 bg-blue-50'
                                                                          : 'border-gray-200 hover:border-blue-500 bg-white'
                                                                  }`}
                                                              >
                                                                  {value.image && (
                                                                      <img
                                                                          src={value.image}
                                                                          alt={value.value}
                                                                          className='w-10 h-10 rounded-lg object-cover bg-gray-100'
                                                                      />
                                                                  )}
                                                                  <div className='flex-1'>
                                                                      <div className='font-medium text-gray-900'>
                                                                          {value.value}
                                                                      </div>
                                                                  </div>
                                                                  {selectedOptions[option.id] === value.id && (
                                                                      <div className='ml-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center'>
                                                                          <div className='w-2 h-2 bg-white rounded-full'></div>
                                                                      </div>
                                                                  )}
                                                              </button>
                                                          ))}
                                                </div>
                                            </React.Fragment>
                                        ))}
                                    </div>
                                ))}

                            {/* Action Buttons */}
                            <div className='flex gap-6 py-2'>
                                <button
                                    onClick={() =>
                                        handleAddToCart(
                                            product.id,
                                            Object.entries(selectedOptions).map(([optionId, optionValueId]) => ({
                                                optionId: Number(optionId),
                                                optionValueId
                                            }))
                                        )
                                    }
                                    className='flex-1 flex items-center justify-center border border-[1px] border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 px-6 rounded-lg transition-colors duration-300'
                                >
                                    {isAddCartLoading ? (
                                        <Loader2 size={18} className='inline-block mr-2 animate-spin' />
                                    ) : (
                                        <ShoppingBag size={18} className='inline-block mr-2' />
                                    )}
                                    {t('COMMON.USER.ADD_TO_CART')}
                                </button>

                                <button className='flex-1 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300'>
                                    <ShoppingCart size={18} className='inline-block mr-2' />
                                    {t('COMMON.USER.BUY_NOW')}
                                </button>
                            </div>

                            {/* Additional Info */}
                            {/* <div className='bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-2xl p-6 border border-blue-100/50 shadow-sm'>
                        <h4 className='font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                            <div className='w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center'>
                                <svg className='w-3 h-3 text-white' fill='currentColor' viewBox='0 0 24 24'>
                                    <path d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                                </svg>
                            </div>
                            Premium Benefits
                        </h4>

                        <div className='grid gap-4'>
                            <div className='flex items-start gap-4 p-3 bg-white/70 rounded-xl hover:bg-white/90 transition-colors'>
                                <div className='w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0'>
                                    <Shield size={18} className='text-emerald-600' />
                                </div>
                                <div className='flex-1'>
                                    <div className='font-medium text-gray-900 text-sm'>Extended Warranty</div>
                                    <div className='text-xs text-gray-600 mt-0.5'>
                                        3-year comprehensive coverage with free repairs
                                    </div>
                                </div>
                                <div className='bg-emerald-100 text-emerald-700 px-2 py-1 rounded-lg text-xs font-medium'>
                                    FREE
                                </div>
                            </div>

                            <div className='flex items-start gap-4 p-3 bg-white/70 rounded-xl hover:bg-white/90 transition-colors'>
                                <div className='w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0'>
                                    <svg
                                        className='w-5 h-5 text-blue-600'
                                        fill='none'
                                        viewBox='0 0 24 24'
                                        stroke='currentColor'
                                    >
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            strokeWidth={2}
                                            d='M13 10V3L4 14h7v7l9-11h-7z'
                                        />
                                    </svg>
                                </div>
                                <div className='flex-1'>
                                    <div className='font-medium text-gray-900 text-sm'>Express Delivery</div>
                                    <div className='text-xs text-gray-600 mt-0.5'>
                                        Next-day delivery for orders over $150
                                    </div>
                                </div>
                                <div className='bg-blue-100 text-blue-700 px-2 py-1 rounded-lg text-xs font-medium'>
                                    24H
                                </div>
                            </div>

                            <div className='flex items-start gap-4 p-3 bg-white/70 rounded-xl hover:bg-white/90 transition-colors'>
                                <div className='w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0'>
                                    <svg
                                        className='w-5 h-5 text-purple-600'
                                        fill='none'
                                        viewBox='0 0 24 24'
                                        stroke='currentColor'
                                    >
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            strokeWidth={2}
                                            d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
                                        />
                                    </svg>
                                </div>
                                <div className='flex-1'>
                                    <div className='font-medium text-gray-900 text-sm'>Hassle-Free Returns</div>
                                    <div className='text-xs text-gray-600 mt-0.5'>
                                        60-day return window with prepaid labels
                                    </div>
                                </div>
                                <div className='bg-purple-100 text-purple-700 px-2 py-1 rounded-lg text-xs font-medium'>
                                    60 DAYS
                                </div>
                            </div>

                            <div className='flex items-start gap-4 p-3 bg-white/70 rounded-xl hover:bg-white/90 transition-colors'>
                                <div className='w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0'>
                                    <svg
                                        className='w-5 h-5 text-amber-600'
                                        fill='none'
                                        viewBox='0 0 24 24'
                                        stroke='currentColor'
                                    >
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            strokeWidth={2}
                                            d='M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                                        />
                                    </svg>
                                </div>
                                <div className='flex-1'>
                                    <div className='font-medium text-gray-900 text-sm'>24/7 Tech Support</div>
                                    <div className='text-xs text-gray-600 mt-0.5'>
                                        Expert assistance via chat, call, or video
                                    </div>
                                </div>
                                <div className='bg-amber-100 text-amber-700 px-2 py-1 rounded-lg text-xs font-medium'>
                                    LIVE
                                </div>
                            </div>
                        </div>
                    </div> */}
                        </div>
                    </div>

                    <div className='mt-6 rounded-[15px] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.1)] bg-white'>
                        <div className='flex border-b border-gray-200'>
                            <button
                                onClick={() => setActiveTab('info')}
                                className={`flex items-center gap-3 px-6 py-4 font-semibold transition-all duration-200 ${
                                    activeTab === 'info'
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                                }`}
                            >
                                <FileText className='w-5 h-5' />
                                {t('COMMON.USER.PRODUCT_DESCRIPTION')}
                            </button>
                            <button
                                onClick={() => setActiveTab('reviews')}
                                className={`flex items-center gap-3 px-6 py-4 font-semibold transition-all duration-200 ${
                                    activeTab === 'reviews'
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                                }`}
                            >
                                <Star className='w-5 h-5' />
                                {t('COMMON.USER.CUSTOMER_REVIEWS')}
                            </button>
                        </div>

                        <div>
                            {activeTab === 'info' && (
                                <div
                                    className='max-w-none tinymce'
                                    dangerouslySetInnerHTML={{ __html: product.detailDescription }}
                                />
                            )}

                            {activeTab === 'reviews' && (
                                <div className='space-y-6 p-6'>
                                    {/* Rating Summary */}
                                    <div className='flex flex-col lg:flex-row justify-center items-center gap-8 md:gap-20 py-6'>
                                        {/* Overall Rating */}
                                        <div className='text-center space-y-4'>
                                            <p className='text-lg font-semibold text-gray-700'>
                                                {t('COMMON.USER.AVERAGE_RATING')}
                                            </p>
                                            <div className='text-4xl font-bold text-blue-600'>{rating}/5</div>
                                            {renderStars(rating, 'w-[25px] h-[25px]', 'space-x-2.5')}
                                            <p className='text-sm text-gray-500'>
                                                {t('COMMON.USER.BASED_ON_REVIEWS', {
                                                    count: reviewCount
                                                })}
                                            </p>
                                        </div>

                                        {/* Rating Breakdown */}
                                        <div className='space-y-3 min-w-[350px]'>
                                            <RatingBar
                                                label={'5 ' + t('COMMON.USER.STARS')}
                                                value={fiveStarCount}
                                                total={reviewCount}
                                            />
                                            <RatingBar
                                                label={'4 ' + t('COMMON.USER.STARS')}
                                                value={fourStarCount}
                                                total={reviewCount}
                                            />
                                            <RatingBar
                                                label={'3 ' + t('COMMON.USER.STARS')}
                                                value={threeStarCount}
                                                total={reviewCount}
                                            />
                                            <RatingBar
                                                label={'2 ' + t('COMMON.USER.STARS')}
                                                value={twoStarCount}
                                                total={reviewCount}
                                            />
                                            <RatingBar
                                                label={'1 ' + t('COMMON.USER.STARS')}
                                                value={oneStarCount}
                                                total={reviewCount}
                                            />
                                        </div>
                                    </div>

                                    <hr className='border-gray-300 border-dashed -mx-6' />

                                    {/* Individual Reviews */}
                                    {reviews && reviews.length > 0 ? (
                                        <div className='space-y-8 px-0 md:px-24 pt-6'>
                                            {reviews.map((review, index) => (
                                                <div
                                                    key={index}
                                                    className='flex gap-6 pb-8 border-b border-gray-100 last:border-b-0'
                                                >
                                                    {/* User Info */}
                                                    <div className='flex flex-col items-center space-y-2 max-w-[220px] w-[220px]'>
                                                        <img
                                                            src={review.avatar || '/images/account.png'}
                                                            alt={review.fullName}
                                                            className='w-16 h-16 rounded-full object-cover border-2 border-gray-200'
                                                        />
                                                        <div className='text-center'>
                                                            <p className='font-semibold text-gray-800'>
                                                                {review.fullName}
                                                            </p>
                                                            <p className='text-sm mt-1 text-gray-500'>
                                                                {formatTime(review.reviewDate)}
                                                            </p>
                                                            <p className='text-sm mt-0.5 text-gray-500'>
                                                                {formatDate(review.reviewDate)}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Review Content */}
                                                    <div className='flex-1 space-y-3'>
                                                        <StarRating rating={review.rating} />
                                                        <p className='text-gray-700 leading-relaxed'>
                                                            {review.comment}
                                                        </p>
                                                        {review.images && review.images.length > 0 && (
                                                            <ImageGalleryThumbnail
                                                                images={review.images.map((image, index) => ({
                                                                    id: index,
                                                                    src: image,
                                                                    alt: image.split('/').pop() || 'Image'
                                                                }))}
                                                            />
                                                        )}

                                                        <div className='flex items-center gap-8 pt-1'>
                                                            <button
                                                                onClick={() => handleLikeDislike(review.id, 'like')}
                                                                className='flex items-center hover:scale-105 gap-2 text-green-500 hover:text-green-600 transition-colors'
                                                            >
                                                                <ThumbsUp
                                                                    className={`w-4 h-4 ${
                                                                        review.interactionType === 'like' &&
                                                                        'fill-green-500'
                                                                    }`}
                                                                />
                                                                <span className='text-sm font-medium'>
                                                                    {review.likes}
                                                                </span>
                                                            </button>
                                                            <button
                                                                onClick={() => handleLikeDislike(review.id, 'dislike')}
                                                                className='flex items-center hover:scale-105 gap-2 text-red-500 hover:text-red-600 transition-colors'
                                                            >
                                                                <ThumbsDown
                                                                    className={`w-4 h-4 ${
                                                                        review.interactionType === 'dislike' &&
                                                                        'fill-red-500'
                                                                    }`}
                                                                />
                                                                <span className='text-sm font-medium'>
                                                                    {review.dislikes}
                                                                </span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <ObjectEmptyState isShowButton={false} title='Chưa có bài đánh giá nào' />
                                    )}

                                    <EnhancedPagination
                                        totalItems={reviewsResponse.data.totalRecords}
                                        itemsPerPage={5}
                                        currentPage={pageNumber}
                                        onPageChange={value => setPageNumber(value)}
                                        siblingCount={1}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <ProjectFormModal
                        isOpen={isShowProjectModal}
                        onClose={() => setIsShowProjectModal(false)}
                        productId={Number(productId) || 0}
                        selections={Object.entries(selectedOptions).map(([optionId, optionValueId]) => ({
                            optionId: Number(optionId),
                            optionValueId
                        }))}
                        productName={product.productName}
                        currentPrice={product.price}
                    />

                    <FavoriteFormModal
                        isOpen={isShowFavoriteModal}
                        onClose={() => setIsShowFavoriteModal(false)}
                        productId={Number(productId) || 0}
                        variants={Object.entries(selectedOptions).map(([optionId, optionValueId]) => ({
                            optionId: Number(optionId),
                            optionValueId
                        }))}
                        productName={product.productName}
                        currentPrice={product.price}
                        onChange={() => {
                            setFavoriteCount(prev => ({ ...prev, isFavorite: true, count: prev.count + 1 }))
                            refetchFavoriteCount()
                        }}
                    />
                </div>
            ) : (
                <ObjectEmptyState title='Không tìm thấy sản phẩm' type='product' />
            )}

            <ProductSection title={t('COMMON.USER.RECOMMENDED_PRODUCTS')} products={productsFlashSale} viewAll={true} />
        </div>
    )
}

type RatingBarProps = {
    label: string
    value: number
    total: number
}

const RatingBar = ({ label, value, total }: RatingBarProps) => {
    const valuePercentage = Math.round((value / total) * 100)

    return (
        <div className='flex items-center gap-5'>
            <span className='font-medium text-gray-700 w-12'>{label}</span>
            <div className='flex-1 bg-gray-200 rounded-full h-2 overflow-hidden'>
                <div
                    className='bg-blue-600 h-2 rounded-full transition-all duration-300'
                    style={{ width: `${valuePercentage}%` }}
                />
            </div>
            <span className='text-gray-500 w-8'>{value}</span>
        </div>
    )
}

type StarRatingProps = {
    rating: number
    size?: string
}

const StarRating = ({ rating }: StarRatingProps) => {
    return (
        <div className='flex items-center gap-1'>
            {[...Array(5)].map((_, i) => (
                <Star
                    key={i}
                    className={`w-[18px] h-[18px] ${i < rating ? 'fill-[#ffba17] text-[#ffba17]' : 'text-gray-300'}`}
                />
            ))}
        </div>
    )
}

export default ProductDetail
