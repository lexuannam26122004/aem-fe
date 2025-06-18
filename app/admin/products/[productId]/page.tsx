'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Star, Wifi, Zap, Shield, Smartphone, Flame, Heart, ThumbsUp, ThumbsDown, FileText } from 'lucide-react'
import ImageGallery from '@/components/ImageGallery'
import ImageGalleryThumbnail from '@/components/ImageGalleryThumbnail'
import { useTranslation } from 'react-i18next'
import { formatCurrency, formatDate, formatTime } from '@/common/format'
import EnhancedPagination from '@/components/EnhancedPagination'
import { IProductGetById } from '@/models/Product'
import { useGetByIdProductQuery } from '@/services/UserProductService'
import { usePathname } from 'next/navigation'
import Loading from '@/components/Loading'
import ObjectEmptyState from '@/components/ObjectEmptyState'
import { useGetFavoriteCountByProductQuery } from '@/services/FavoriteService'
import { useGetReviewByProductIdQuery } from '@/services/ReviewService'

const ProductDetail = () => {
    const { t } = useTranslation('common')
    const [activeTab, setActiveTab] = useState('info')
    const [pageNumber, setPageNumber] = useState(1)
    const pathName = usePathname()
    const productId = pathName.split('/').pop()
    const [copied, setCopied] = useState(false)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)
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

    const { data: favoriteCountResponse, isLoading: isFavoriteCountLoading } = useGetFavoriteCountByProductQuery(
        Number(productId)
    )

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

    useEffect(() => {
        reviewRefetch()
    }, [pageNumber])

    if (isProductLoading || isFavoriteCountLoading || isReviewsLoading) {
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
                                    <div className='text-3xl font-bold italic text-blue-600'>
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
                                                            <button className='flex items-center hover:scale-105 gap-2 text-green-500 hover:text-green-600 transition-colors'>
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
                                                            <button className='flex items-center hover:scale-105 gap-2 text-red-500 hover:text-red-600 transition-colors'>
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
                </div>
            ) : (
                <ObjectEmptyState title='Không tìm thấy sản phẩm' type='product' />
            )}
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
