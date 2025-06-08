'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
    Trash2,
    Plus,
    Minus,
    CreditCard,
    ShoppingCart,
    ArrowLeftToLine,
    Heart,
    ChevronLeft,
    ChevronRight,
    Zap
} from 'lucide-react'
import { formatCurrency } from '@/common/format'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import EmptyItem from '@/components/EmptyItem'
import { IProductSearch } from '@/models/Product'
import ProductCard from '../ProductCard'
import { useSearchProductQuery } from '@/services/ProductService'
import { useDeleteCartMutation, useLazySearchCartQuery, useUpdateCartQuantityMutation } from '@/services/CartService'
import { ICart } from '@/models/Cart'
import Loading from '@/components/Loading'
import { useDeleteFavoriteMutation } from '@/services/FavoriteService'
import FavoriteFormModal from '@/components/FavoriteFormModal'
import { debounce } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { setProducts } from '@/redux/slices/productSlice'
import { useAuthCheck } from '@/hooks/useAuthCheck'
import { cartSelector, removeFromCart } from '@/redux/slices/cartSlice'

const CartPage = () => {
    const { t } = useTranslation('common')
    const [carts, setCarts] = useState<ICart[]>([])
    const router = useRouter()
    const [selectedFavorite, setSelectedFavorite] = useState<ICart | null>(null)
    const [showEmptyState, setShowEmptyState] = useState(false)
    const [summary, setSummary] = useState({
        subTotal: 0,
        totalAmount: 0,
        taxes: 0
    })
    const { isAuthenticated, isAuthChecked } = useAuthCheck()
    const dispatch = useDispatch()

    const { data: flashSaleResponse, isLoading: isLoadingResponseFlashSale } = useSearchProductQuery({
        pageSize: 8,
        pageNumber: 1,
        typeSection: 'hot_sale'
    })

    const [triggerSearch, { isFetching: isLoadingResponseCart }] = useLazySearchCartQuery()

    const cartData = useSelector(cartSelector).carts || []

    useEffect(() => {
        if (isAuthChecked && !isAuthenticated) {
            setCarts(cartData)
        }

        if (isAuthChecked && isAuthenticated) {
            triggerSearch()
                .unwrap()
                .then(data => {
                    setCarts(data.data)
                    setShowEmptyState(data.data.length === 0)
                })
                .catch(() => {
                    setCarts([])
                    setShowEmptyState(true)
                })
        }
    }, [isAuthChecked, isAuthenticated])

    const productsFlashSale = Array.isArray(flashSaleResponse?.data.records)
        ? (flashSaleResponse?.data.records as IProductSearch[])
        : []

    const [deleteFavorite] = useDeleteFavoriteMutation()
    const [deleteCard] = useDeleteCartMutation()
    const [changeQuantity] = useUpdateCartQuantityMutation()

    useEffect(() => {
        calculateSummary()
    }, [carts])

    const calculateSummary = () => {
        const selectedItems = carts.filter(item => item.isSelected)
        dispatch(setProducts(selectedItems))
        const subTotal = selectedItems.reduce((total, item) => {
            return total + item.discountPrice * item.quantity
        }, 0)
        const taxes = subTotal * 0.1

        setSummary({
            ...summary,
            subTotal,
            taxes,
            totalAmount: subTotal + taxes
        })
    }

    const debouncedChangeQuantity = useRef(
        debounce((fn, id: number, quantity: number, snapshot) => {
            fn({ id, quantity })
                .unwrap()
                .catch(() => {
                    setCarts(snapshot)
                })
        }, 0)
    ).current

    const handleQuantityChange = (id: number, newQuantity: number) => {
        if (newQuantity < 1) return
        const snapshot = carts.map(item => ({ ...item }))

        setCarts(carts.map(item => (item.id === id ? { ...item, quantity: newQuantity } : item)))

        debouncedChangeQuantity(changeQuantity, id, newQuantity, snapshot)
    }

    useEffect(() => {
        return () => {
            debouncedChangeQuantity.cancel() // cleanup nếu component unmount
        }
    }, [])

    const handleRemoveItem = (id: number) => {
        const snapshot = carts.map(item => ({ ...item }))
        setCarts(carts.filter(item => item.id !== id))
        deleteCard(id)
            .unwrap()
            .catch(() => setCarts(snapshot))
    }

    const handleRemoveItemUnAuth = (item: ICart) => {
        dispatch(removeFromCart({ id: item.id }))
    }

    const handleUpdateFavorite = (id: number) => {
        const snapshot = carts.map(item => ({ ...item }))
        const item = snapshot.find(item => item.id === id)
        if (item.isFavorite) {
            setCarts(prevCart => prevCart.map(item => (item.id === id ? { ...item, isFavorite: false } : item)))
            deleteFavorite(item.favoriteId)
                .unwrap()
                .catch(() => setCarts(snapshot)) // Rollback on error
        } else {
            setSelectedFavorite(item)
        }
    }

    const handleSelectItem = (id: number) => {
        setCarts(carts.map(item => (item.id === id ? { ...item, isSelected: !item.isSelected } : item)))
    }

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked
        setCarts(carts.map(item => ({ ...item, isSelected: isChecked })))
    }

    const allSelected = carts.length > 0 && carts.every(item => item.isSelected)
    const selectedCount = carts.filter(item => item.isSelected).length

    useEffect(() => {
        if (selectedCount === 0) {
            setSummary({
                subTotal: 0,
                taxes: 0,
                totalAmount: 0
            })
        }
    }, [selectedCount])

    if (isLoadingResponseCart || isLoadingResponseFlashSale) {
        return <Loading />
    }

    return (
        <div className='min-h-screen'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                {!showEmptyState ? (
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
                                                    {t('COMMON.USER.SELECT_ALL', { count: carts.length })}
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
                                        {carts.map(item => (
                                            <div
                                                key={item.id}
                                                className={`p-6 transition-colors ${
                                                    item.isSelected ? 'bg-blue-50/30' : ''
                                                }`}
                                            >
                                                <div className='flex'>
                                                    {/* Checkbox */}
                                                    <div className='flex items-start pt-1'>
                                                        <input
                                                            type='checkbox'
                                                            checked={item.isSelected}
                                                            onChange={() => handleSelectItem(item.id)}
                                                            className='w-4 h-4 rounded-[10px] border-[#d1e0ff] accent-[#3675ff] text-[#3675ff] cursor-pointer'
                                                        />
                                                    </div>

                                                    {/* Product Image */}
                                                    <div className='ml-4 flex-shrink-0'>
                                                        <div className='relative'>
                                                            <img
                                                                src={item.image}
                                                                className='w-[70px] h-[70px] rounded-[10px] border border-gray-200 object-cover'
                                                                alt={item.productName}
                                                            />
                                                            {item.discountRate > 0 && (
                                                                <div className='absolute -top-[10px] -right-[10px] bg-red-500 text-white text-xs font-bold rounded-full w-[35px] h-[35px] flex items-center justify-center'>
                                                                    -{item.discountRate}%
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Product Details */}
                                                    <div className='ml-5 flex-grow'>
                                                        <div className='flex flex-col sm:flex-row sm:justify-between sm:items-start'>
                                                            <div className='space-y-1'>
                                                                <p className='font-medium text-md text-gray-900'>
                                                                    {item.productName}
                                                                </p>
                                                                <p className='text-gray-500 text-sm'>SKU: {item.sku}</p>
                                                                <p className='text-black text-sm'>{item.variants}</p>
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
                                                                        {formatCurrency(item.discountPrice)}
                                                                    </p>
                                                                    {item.originalPrice &&
                                                                        item.discountPrice < item.originalPrice && (
                                                                            <p className='line-through text-gray-400'>
                                                                                {formatCurrency(item.originalPrice)}
                                                                            </p>
                                                                        )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className='flex items-center gap-4 justify-end mt-3 sm:mt-0'>
                                                    <button
                                                        className='p-2 bg-red-50 rounded-full text-red-600 hover:bg-red-100 transition-colors'
                                                        onClick={() =>
                                                            isAuthChecked && !isAuthenticated
                                                                ? handleRemoveItemUnAuth(item)
                                                                : handleRemoveItem(item.id)
                                                        }
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>

                                                    {!(isAuthChecked && !isAuthenticated) && (
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
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <ProductHotSale products={productsFlashSale} title='Hot Sales' />
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
                    <div className='mt-8'>
                        <EmptyItem
                            icon={<ShoppingCart className='w-10 h-10 text-blue-600' />}
                            title={t('COMMON.USER.CART_EMPTY_TITLE')}
                            description={t('COMMON.USER.CART_EMPTY_DESCRIPTION')}
                            buttonText={t('COMMON.USER.CONTINUE_SHOPPING')}
                            onClick={() => router.push('/')}
                        />
                    </div>
                )}

                {selectedFavorite && (
                    <FavoriteFormModal
                        isOpen={!!selectedFavorite}
                        onClose={() => setSelectedFavorite(null)}
                        productId={Number(selectedFavorite.productId) || 0}
                        variants={selectedFavorite?.selections}
                        productName={selectedFavorite.productName}
                        currentPrice={selectedFavorite.discountPrice}
                        onChange={() => {
                            setCarts(prevCart =>
                                prevCart.map(item =>
                                    item.id === selectedFavorite.id ? { ...item, isFavorite: true } : item
                                )
                            )
                        }}
                    />
                )}
            </div>
        </div>
    )
}

const ProductHotSale = ({ title, products }: ProductHotSaleProps) => {
    const [currentPage, setCurrentPage] = useState(0)
    const [currentIndex, setCurrentIndex] = useState(0)
    const totalPages = Math.min(Math.floor(products.length - 1), 10)

    const nextPage = () => {
        if (currentPage + 1 >= totalPages) {
            return
        }
        setCurrentIndex(prev => prev + 1)
        setCurrentPage(prev => prev + 1)
    }

    const setPage = (page: number) => {
        setCurrentIndex(page * 2)
        setCurrentPage(page)
    }

    const prevPage = () => {
        setCurrentIndex(prev => Math.max(prev - 1, 0))
        setCurrentPage(prev => Math.max(prev - 1, 0))
    }

    const currentProducts = products.slice(currentIndex, Math.min(currentIndex + 2, 8))

    return (
        <div id='flash-sale' className='mt-6 rounded-xl overflow-hidden relative'>
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
            <div className='relative z-10 px-8 py-6 text-white'>
                {/* Header with enhanced hot label */}
                <div className='flex items-center mt-1 justify-center mb-6'>
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
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-14 px-4'>
                    {currentProducts.map((product, index) => (
                        <ProductCard key={index} product={product} isHotSale={true} />
                    ))}
                </div>

                {/* Navigation buttons */}
                <button
                    onClick={prevPage}
                    className='absolute left-0 top-1/2 -translate-y-1/2 bg-blue-200 bg-opacity-20 hover:bg-opacity-30 text-white pr-2 pl-1 py-2 rounded-r-lg shadow-lg backdrop-blur-sm transition-all border border-white border-opacity-30'
                    aria-label='Previous page'
                >
                    <ChevronLeft size={24} />
                </button>

                <button
                    onClick={nextPage}
                    className='absolute right-0 top-1/2 -translate-y-1/2 bg-blue-200 bg-opacity-20 hover:bg-opacity-30 text-white pr-1 pl-2 py-2 rounded-l-lg shadow-lg backdrop-blur-sm transition-all border border-white border-opacity-30'
                    aria-label='Next page'
                >
                    <ChevronRight size={24} />
                </button>

                {/* Page indicators */}
                {totalPages > 1 && (
                    <div className='flex justify-center mt-8 space-x-2 pb-2'>
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

type ProductHotSaleProps = {
    title: string
    products: IProductSearch[]
    viewAll?: boolean
}

export default CartPage
