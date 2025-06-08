import React, { useState } from 'react'
import { Search, Truck, ShoppingCart, Clock, X, Gift } from 'lucide-react'
import { ICoupon } from '@/models/Coupon'
import { formatDate } from '@/common/format'

export interface IDisplayCoupon extends ICoupon {
    title: string
    couponType: 'product' | 'shipping'
    isUsed: boolean
}

export interface ISelectedCoupon {
    productCoupon?: IDisplayCoupon
    shippingCoupon?: IDisplayCoupon
}

export interface CouponSelectorProps {
    coupons: IDisplayCoupon[]
    selectedCoupons: ISelectedCoupon
    onCouponSelect: (coupon: IDisplayCoupon) => void
    onCouponRemove: (type: 'product' | 'shipping') => void
    orderValue: number
    isModalOpen: boolean
    setIsModalOpen: () => void
}

const CouponSelector: React.FC<CouponSelectorProps> = ({
    coupons,
    selectedCoupons,
    onCouponSelect,
    onCouponRemove,
    orderValue,
    isModalOpen,
    setIsModalOpen
}) => {
    const [searchTerm, setSearchTerm] = useState('')

    // Filter and separate coupons
    const availableCoupons = coupons.filter(
        coupon =>
            !coupon.isUsed &&
            orderValue >= coupon.minimumOrderValue &&
            (coupon.couponCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                coupon.title.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    const productCoupons = availableCoupons.filter(c => c.couponType === 'product')
    const shippingCoupons = availableCoupons.filter(c => c.couponType === 'shipping')

    const formatDiscount = (coupon: IDisplayCoupon) => {
        if (coupon.discountType === 'percentage') {
            return `${coupon.discountValue}%`
        }
        return `${coupon.discountValue.toLocaleString()}đ`
    }

    const formatCurrency = (amount: number) => {
        return amount.toLocaleString().replaceAll(',', '.') + 'đ'
    }

    const isCouponSelected = (coupon: IDisplayCoupon) => {
        return (
            (coupon.couponType === 'product' && selectedCoupons.productCoupon?.id === coupon.id) ||
            (coupon.couponType === 'shipping' && selectedCoupons.shippingCoupon?.id === coupon.id)
        )
    }

    const handleSelectCoupon = (coupon: IDisplayCoupon) => {
        onCouponSelect(coupon)
    }

    return (
        <div>
            {isModalOpen && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                    <div className='bg-white rounded-xl shadow-xl w-full flex flex-col max-w-[80w] md:max-w-lg max-h-[80vh] overflow-y-hidden'>
                        <div className='sticky top-0 bg-white z-10 px-6 py-4 border-b flex items-center justify-between'>
                            <div className='flex items-center gap-4'>
                                <div className='w-10 h-10 bg-blue-50 rounded-md flex items-center justify-center'>
                                    <Gift className='w-6 h-6 text-blue-600' />
                                </div>
                                <div>
                                    <h2 className='font-semibold text-gray-800'>Chọn mã giảm giá</h2>
                                    <p className='text-sm text-gray-500'>Đơn hàng: {formatCurrency(orderValue)}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsModalOpen()}
                                className='text-gray-500 hover:text-gray-700 p-1.5 w-fit h-fit rounded-full hover:bg-gray-100'
                            >
                                <X size={20} />
                            </button>
                        </div>
                        {/* Search */}
                        <div className='px-6 py-4 border-b border-gray-100'>
                            <div className='relative'>
                                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
                                <input
                                    type='text'
                                    placeholder='Tìm kiếm mã giảm giá...'
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className='w-full pl-9 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none text-sm'
                                />
                            </div>
                        </div>
                        {/* Content */}
                        <div className='flex-1 overflow-y-auto'>
                            {/* Product Coupons */}
                            {productCoupons.length > 0 && (
                                <div className='px-6 py-6 border-b border-gray-100'>
                                    <div className='flex items-center gap-2 mb-5'>
                                        <ShoppingCart className='w-4 h-4 text-green-600' />
                                        <h3 className='font-medium text-gray-800 text-sm'>Mã giảm giá sản phẩm</h3>
                                        <span className='px-1.5 py-0.5 bg-green-100 text-green-600 text-xs rounded'>
                                            {productCoupons.length}
                                        </span>
                                    </div>
                                    <div className='space-y-5'>
                                        {productCoupons.map(coupon => (
                                            <CouponCard
                                                key={coupon.id}
                                                coupon={coupon}
                                                formatDiscount={formatDiscount}
                                                formatCurrency={formatCurrency}
                                                isSelected={isCouponSelected(coupon)}
                                                onSelect={() => handleSelectCoupon(coupon)}
                                                onRemove={() => onCouponRemove('product')}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {shippingCoupons.length > 0 && (
                                <div className='p-6'>
                                    <div className='flex items-center gap-2 mb-5'>
                                        <Truck className='w-4 h-4 text-blue-600' />
                                        <h3 className='font-medium text-gray-800 text-sm'>Mã giảm phí vận chuyển</h3>
                                        <span className='px-1.5 py-0.5 bg-blue-100 text-blue-600 text-xs rounded'>
                                            {shippingCoupons.length}
                                        </span>
                                    </div>
                                    <div className='space-y-5'>
                                        {shippingCoupons.map(coupon => (
                                            <CouponCard
                                                key={coupon.id}
                                                coupon={coupon}
                                                formatDiscount={formatDiscount}
                                                formatCurrency={formatCurrency}
                                                isSelected={isCouponSelected(coupon)}
                                                onSelect={() => handleSelectCoupon(coupon)}
                                                onRemove={() => onCouponRemove('shipping')}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* No Coupons */}
                            {productCoupons.length === 0 && shippingCoupons.length === 0 && (
                                <div className='p-8 text-center'>
                                    <div className='w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-3'>
                                        <Search className='w-6 h-6 text-blue-500' />
                                    </div>
                                    <div className='font-medium mb-1 text-gray-800'>Không tìm thấy mã giảm giá</div>
                                    <div className='text-sm text-gray-400'>
                                        Thử từ khóa khác hoặc kiểm tra điều kiện áp dụng
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

const CouponCard: React.FC<{
    coupon: IDisplayCoupon
    formatDiscount: (coupon: IDisplayCoupon) => string
    formatCurrency: (amount: number) => string
    isSelected: boolean
    onSelect: () => void
    onRemove: () => void
}> = ({ coupon, formatDiscount, formatCurrency, isSelected, onSelect, onRemove }) => {
    const isProduct = coupon.couponType === 'product'

    return (
        <div
            className={`relative border rounded-lg p-4 group cursor-pointer ${
                isSelected
                    ? isProduct
                        ? 'border-green-200 bg-green-50'
                        : 'border-blue-200 bg-blue-50'
                    : isProduct
                    ? 'hover:bg-green-50 hover:border-green-200 bg-white'
                    : 'hover:bg-blue-50 hover:border-blue-200 bg-white'
            }`}
            onClick={() => {
                if (isSelected === false) onSelect()
            }}
        >
            <div className='flex items-center justify-between mb-2'>
                <div className='flex items-center gap-3'>
                    <div
                        className={`w-8 h-8 rounded flex items-center justify-center ${
                            isSelected
                                ? isProduct
                                    ? 'bg-green-100'
                                    : 'bg-blue-100'
                                : isProduct
                                ? 'bg-green-50 group-hover:bg-green-100'
                                : 'bg-blue-50 group-hover:bg-blue-100'
                        }`}
                    >
                        {isProduct ? (
                            <ShoppingCart className='w-4 h-4 text-green-600' />
                        ) : (
                            <Truck className='w-4 h-4 text-blue-600' />
                        )}
                    </div>
                    <div>
                        <div className='font-semibold text-gray-900 text-sm'>{coupon.couponCode}</div>
                        <div className={`text-xs ${isProduct ? 'text-green-600' : 'text-blue-600'}`}>
                            {coupon.title}
                        </div>
                    </div>
                </div>

                <div className={`px-2 py-1 rounded-md ${isProduct ? 'bg-green-100' : 'bg-blue-100'}`}>
                    <div
                        className={`font-semibold text-sm flex items-center gap-1 ${
                            isProduct ? 'text-green-700' : 'text-blue-700'
                        }`}
                    >
                        {formatDiscount(coupon)}
                    </div>
                </div>
            </div>

            {/* Details in compact format */}
            <div className='flex items-center justify-between text-sm text-gray-400 mb-1'>
                <div className='flex items-center gap-2'>
                    <p className='min-w-[85px]'>Đơn tối thiểu: </p>
                    <p className='text-black'>{formatCurrency(coupon.minimumOrderValue)}</p>
                </div>
                <span className='flex items-center gap-2'>
                    <Clock className='w-4 h-4' />
                    <p className='text-black'>{formatDate(coupon.expiryDate)}</p>
                </span>
            </div>

            <div className='flex items-center justify-between text-sm text-gray-400'>
                <div className='flex items-center gap-2'>
                    <p className='min-w-[85px]'>Giảm tối đa: </p>
                    <p className='text-black'>{formatCurrency(coupon.maximumDiscount)}</p>
                </div>
                <p className='text-black ml-auto'>Còn {coupon.usageLimit - coupon.usageCount} lượt sử dụng</p>
            </div>

            {isSelected && (
                <div
                    className={`flex items-center justify-between rounded-md mt-2 p-2 text-xs ${
                        isProduct ? 'bg-green-100' : 'bg-blue-100'
                    }`}
                >
                    <div
                        className={`font-medium flex items-center gap-1.5 ${
                            isProduct ? 'text-green-700' : 'text-blue-700'
                        }`}
                    >
                        <div
                            className={`mt-[1px] w-3 h-3 rounded-full flex items-center justify-center ${
                                isProduct ? 'bg-green-500' : 'bg-blue-500'
                            }`}
                        >
                            <div className='w-1.5 h-1.5 bg-white rounded-full'></div>
                        </div>
                        Đã chọn
                    </div>
                    <button
                        onClick={e => {
                            e.stopPropagation()
                            onRemove()
                        }}
                        className='text-red-500 hover:text-red-700 font-medium px-2 py-0.5 rounded'
                    >
                        Bỏ chọn
                    </button>
                </div>
            )}
        </div>
    )
}

export default CouponSelector
