'use client'

import React, { useEffect, useState } from 'react'
import {
    ShoppingBag,
    CreditCard,
    Edit2,
    Mail,
    MapPin,
    Shield,
    Info,
    Check,
    BadgeCheck,
    HelpingHand,
    User2,
    PhoneCall,
    House,
    Building,
    Tag,
    ChevronRight,
    ShoppingCart,
    Truck,
    Loader2
} from 'lucide-react'
import { formatCurrency } from '@/common/format'
import { useTranslation } from 'react-i18next'
import AddressManager from '@/components/AddressesModal'
import { useCreateVnpayUrlMutation } from '@/services/PaymentService'
import { ICart } from '@/models/Cart'
import { useDispatch, useSelector } from 'react-redux'
import { productSelector } from '@/redux/slices/productSlice'
import { ICustomerAddress } from '@/models/CustomerAddress'
import { useLazyGetDefaultCustomerAddressQuery } from '@/services/CustomerAddressService'
import Loading from '@/components/Loading'
import CouponSelector, { IDisplayCoupon, ISelectedCoupon } from './CouponSelector'
import { useRouter } from 'next/navigation'
import { useCreateOrderMutation } from '@/services/UserOrderService'
import { useGetUserCouponQuery } from '@/services/UserCouponService'
import { IOrderCreate } from '@/models/Order'
import { useToast } from '@/hooks/useToast'
import { useDeleteRangeCartMutation } from '@/services/CartService'
import { useAuthCheck } from '@/hooks/useAuthCheck'
import { removeFromCart } from '@/redux/slices/cartSlice'

const formatDiscount = (coupon: IDisplayCoupon) => {
    if (coupon.discountType === 'percentage') {
        return `${coupon.discountValue}%`
    }
    return `${coupon.discountValue.toLocaleString().replaceAll(',', '.')}đ`
}

const CheckoutPage = () => {
    const { t } = useTranslation('common')
    const [createVnpayUrl] = useCreateVnpayUrlMutation()
    const [typeNote, setTypeNote] = useState('info')
    const [customerNote, setCustomerNote] = useState('')
    const products: ICart[] = useSelector(productSelector).products || []
    const [shippingAddress, setShippingAddress] = useState<ICustomerAddress>({
        recipient: '',
        phone: '',
        email: '',
        address: '',
        district: '',
        city: '',
        title: '',
        isDefault: false
    })
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmit, setIsSubmit] = useState(false)
    const [selectedCoupons, setSelectedCoupons] = useState<ISelectedCoupon>({})
    const { isAuthChecked, isAuthenticated } = useAuthCheck()
    const dispatch = useDispatch()
    const router = useRouter()
    const toast = useToast()

    const { data: couponsData, isLoading: isCouponsLoading } = useGetUserCouponQuery()
    const availableCoupons: IDisplayCoupon[] = couponsData?.data || []

    const handleCouponSelect = (coupon: IDisplayCoupon) => {
        setSelectedCoupons(prev => ({
            ...prev,
            [coupon.couponType === 'product' ? 'productCoupon' : 'shippingCoupon']: coupon
        }))

        setSummary(prev => {
            if (coupon.couponType === 'product') {
                const discountAmount =
                    coupon.discountType === 'fixed'
                        ? coupon.discountValue
                        : (prev.subTotal * coupon.discountValue) / 100

                const maxDiscount = Math.min(discountAmount, coupon.maximumDiscount || 0, prev.subTotal)

                return {
                    ...prev,
                    totalAmount: prev.totalAmount + prev.discountAmount - maxDiscount,
                    discountAmount: maxDiscount
                }
            } else {
                const discountShippingFee =
                    coupon.discountType === 'fixed'
                        ? coupon.discountValue
                        : (prev.shippingFee * coupon.discountValue) / 100

                const maxDiscount = Math.min(discountShippingFee, coupon.maximumDiscount || 0, prev.shippingFee)

                return {
                    ...prev,
                    totalAmount: prev.totalAmount + prev.discountShippingFee - maxDiscount,
                    discountShippingFee: maxDiscount
                }
            }
        })
    }

    const handleCouponRemove = (type: 'product' | 'shipping') => {
        setSelectedCoupons(prev => ({
            ...prev,
            [type === 'product' ? 'productCoupon' : 'shippingCoupon']: undefined
        }))

        setSummary(prev => {
            if (type === 'product') {
                return {
                    ...prev,
                    discountAmount: 0,
                    totalAmount: prev.totalAmount + prev.discountAmount
                }
            } else {
                return {
                    ...prev,
                    discountShippingFee: 0,
                    totalAmount: prev.totalAmount + prev.discountShippingFee
                }
            }
        })
    }

    const [triggerAddressDefault, { isLoading: isAddressDefaultLoading }] = useLazyGetDefaultCustomerAddressQuery()

    const [createOrder] = useCreateOrderMutation()
    const [deleteRangeCart] = useDeleteRangeCartMutation()

    useEffect(() => {
        if (isAuthChecked && isAuthenticated) {
            triggerAddressDefault()
                .unwrap()
                .then(data => {
                    setShippingAddress(data.data)
                })
                .catch(() => {
                    setShippingAddress(null)
                })
        }
    }, [isAuthChecked, isAuthenticated])

    const [summary, setSummary] = useState(() => {
        const subTotal = products.reduce((total, item) => total + item.discountPrice * item.quantity, 0)
        const shippingFee = 30000
        const discountAmount = 0
        const discountShippingFee = 0
        const taxes = subTotal * 0.1
        const totalAmount = subTotal + shippingFee - discountAmount - discountShippingFee + taxes

        return {
            subTotal,
            shippingFee,
            discountAmount,
            discountShippingFee,
            taxes,
            totalAmount
        }
    })

    const [formErrors, setFormErrors] = useState({
        recipient: '',
        phone: '',
        email: '',
        address: '',
        district: '',
        city: ''
    })

    const paymentMethods = [
        {
            id: 'cod',
            name: t('COMMON.USER.PAYMENT_COD_NAME'),
            description: t('COMMON.USER.PAYMENT_COD_DESCRIPTION'),
            logo: <img src='/images/dollar.png' className='w-10 h-10' />,
            additionalInfo: t('COMMON.USER.PAYMENT_COD_ADDITIONAL_INFO')
        },
        {
            id: 'vnpay',
            name: t('COMMON.USER.PAYMENT_VNPAY_NAME'),
            description: t('COMMON.USER.PAYMENT_VNPAY_DESCRIPTION'),
            logo: (
                <img src='/images/vnpay.svg' className='w-10 h-10 rounded-[8px] shadow-[0_4px_16px_rgba(0,0,0,0.1)]' />
            ),
            additionalInfo: t('COMMON.USER.PAYMENT_VNPAY_ADDITIONAL_INFO')
        },
        {
            id: 'momo',
            name: t('COMMON.USER.PAYMENT_MOMO_NAME'),
            description: t('COMMON.USER.PAYMENT_MOMO_DESCRIPTION'),
            logo: (
                <img
                    src='/images/momo_square_pinkbg.svg'
                    className='w-10 h-10 rounded-[8px] shadow-[0_4px_16px_rgba(0,0,0,0.1)]'
                />
            ),
            additionalInfo: t('COMMON.USER.PAYMENT_MOMO_ADDITIONAL_INFO')
        }
    ]

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cod')
    const [isOpenModel, setIsOpenModal] = useState(false)

    const handlePaymentMethodChange = (methodId: string) => {
        setSelectedPaymentMethod(methodId)
    }

    const hasSelectedCoupons = selectedCoupons.productCoupon || selectedCoupons.shippingCoupon
    const selectedCount = (selectedCoupons.productCoupon ? 1 : 0) + (selectedCoupons.shippingCoupon ? 1 : 0)

    const checkValidation = () => {
        const errors = {
            recipient: '',
            phone: '',
            email: '',
            address: '',
            district: '',
            city: ''
        }

        if (!shippingAddress.recipient) {
            errors.recipient = 'Vui lòng nhập họ tên người nhận'
        }

        if (!shippingAddress.email.trim()) {
            errors.email = 'Vui lòng nhập email'
        } else if (!/\S+@\S+\.\S+/.test(shippingAddress.email)) {
            errors.email = 'Email không hợp lệ'
        }

        if (!shippingAddress.phone.trim()) {
            errors.phone = 'Vui lòng nhập số điện thoại'
        } else if (!/^\d{10,11}$/.test(shippingAddress.phone.replace(/\s/g, ''))) {
            errors.phone = 'Số điện thoại không hợp lệ'
        }

        if (!shippingAddress.address) {
            errors.address = 'Vui lòng nhập địa chỉ'
        }

        if (!shippingAddress.district) {
            errors.district = 'Vui lòng nhập quận/huyện'
        }

        if (!shippingAddress.city) {
            errors.city = 'Vui lòng nhập thành phố/tỉnh'
        }

        setFormErrors(errors)
        return Object.values(errors).every(val => val === '')
    }

    useEffect(() => {
        if (!isSubmit) {
            return
        }
        if (!shippingAddress.email.trim()) {
            setFormErrors(prev => ({ ...prev, email: 'Vui lòng nhập email' }))
        } else if (!/\S+@\S+\.\S+/.test(shippingAddress.email)) {
            setFormErrors(prev => ({ ...prev, email: 'Email không hợp lệ' }))
        } else {
            setFormErrors(prev => ({ ...prev, email: '' }))
        }
    }, [shippingAddress.email])

    useEffect(() => {
        if (!isSubmit) {
            return
        }
        if (!shippingAddress.phone.trim()) {
            setFormErrors(prev => ({ ...prev, phone: 'Vui lòng nhập số điện thoại' }))
        } else if (!/^\d{10,11}$/.test(shippingAddress.phone.replace(/\s/g, ''))) {
            setFormErrors(prev => ({ ...prev, phone: 'Số điện thoại không hợp lệ' }))
        } else {
            setFormErrors(prev => ({ ...prev, phone: '' }))
        }
    }, [shippingAddress.phone])

    useEffect(() => {
        if (!isSubmit) {
            return
        }
        if (!shippingAddress.recipient) {
            setFormErrors(prev => ({ ...prev, recipient: 'Vui lòng nhập họ tên người nhận' }))
        } else {
            setFormErrors(prev => ({ ...prev, recipient: '' }))
        }
    }, [shippingAddress.recipient])

    useEffect(() => {
        if (!isSubmit) {
            return
        }
        if (!shippingAddress.address) {
            setFormErrors(prev => ({ ...prev, address: 'Vui lòng nhập địa chỉ' }))
        } else {
            setFormErrors(prev => ({ ...prev, address: '' }))
        }
    }, [shippingAddress.address])

    useEffect(() => {
        if (!isSubmit) {
            return
        }
        if (!shippingAddress.district) {
            setFormErrors(prev => ({ ...prev, district: 'Vui lòng nhập quận/huyện' }))
        } else {
            setFormErrors(prev => ({ ...prev, district: '' }))
        }
    }, [shippingAddress.district])

    useEffect(() => {
        if (!isSubmit) {
            return
        }
        if (!shippingAddress.city) {
            setFormErrors(prev => ({ ...prev, city: 'Vui lòng nhập thành phố/tỉnh' }))
        } else {
            setFormErrors(prev => ({ ...prev, city: '' }))
        }
    }, [shippingAddress.city])

    const handlePlaceOrder = async () => {
        setIsSubmit(true)

        if (!checkValidation()) {
            return
        }

        setIsLoading(true)
        const order: IOrderCreate = {
            customerNote,
            shippingRecipient: shippingAddress.recipient,
            shippingPhone: shippingAddress.phone,
            shippingEmail: shippingAddress.email,
            shippingAddress: shippingAddress.address,
            shippingDistrict: shippingAddress.district,
            shippingCity: shippingAddress.city,
            clientIpAddress: typeof window !== 'undefined' ? window.location.hostname : '',
            items: products.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.discountPrice,
                discountPrice: item.discountPrice,
                selections: item.selections.map(selection => ({
                    optionId: selection.optionId,
                    optionValueId: selection.optionValueId
                }))
            })),
            paymentMethod: selectedPaymentMethod,
            subTotal: summary.subTotal,
            discountAmount: summary.discountAmount,
            discountShippingFee: summary.discountShippingFee,
            shippingFee: summary.shippingFee,
            taxes: summary.taxes,
            couponIds: Object.values(selectedCoupons)
                .filter(Boolean)
                .map(coupon => coupon.id)
        }

        let orderCode: string | undefined

        try {
            const res = await createOrder(order).unwrap()
            if (res?.data) {
                orderCode = res.data
            }
            try {
                if (isAuthenticated) {
                    await deleteRangeCart(products.map(item => item.id)).unwrap()
                } else {
                    products.forEach(x => dispatch(removeFromCart({ id: x.id })))
                }
            } catch {}
        } catch (err) {
            toast(err?.data?.detail, 'error')
        }

        if (!orderCode) {
            setIsLoading(false)
            return
        }

        if (selectedPaymentMethod === 'vnpay') {
            try {
                const res = await createVnpayUrl({
                    orderCode: orderCode,
                    amount: Math.ceil(summary.totalAmount)
                }).unwrap()

                if (res.paymentUrl) {
                    router.push(res.paymentUrl)
                }
            } catch (err) {
                toast(err?.data?.detail, 'error')
            } finally {
                setIsLoading(false)
            }
        } else if (selectedPaymentMethod === 'cod') {
            toast(t('COMMON.USER.ORDER_PLACED_SUCCESS'), 'success')
            router.push('/user/orders')
            setIsLoading(false)
        } else {
            toast(t('COMMON.USER.PAYMENT_METHOD_NOT_SUPPORTED'), 'error')
            setIsLoading(false)
        }

        setIsSubmit(false)
    }

    if (isAddressDefaultLoading || isCouponsLoading) {
        return <Loading />
    }

    return (
        <div className='min-h-screen'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex flex-col lg:flex-row gap-6'>
                    <div className='w-full lg:w-2/3 space-y-6'>
                        {!isAuthenticated ? (
                            <div className='rounded-[15px] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.1)] bg-white'>
                                <div className='px-6 h-[66px] flex items-center justify-between border-b border-gray-100'>
                                    <div className='flex items-center'>
                                        <MapPin className='w-5 h-5 text-blue-600 mr-3' />
                                        <h2 className='font-bold text-[18px] text-gray-800'>
                                            {t('COMMON.USER.SHIPPING_ADDRESS')}
                                        </h2>
                                    </div>
                                </div>
                                <div className='p-6 space-y-4'>
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                                                {t('COMMON.USER.FULL_NAME')} *
                                            </label>
                                            <div className='relative'>
                                                <input
                                                    type='text'
                                                    value={shippingAddress?.recipient || ''}
                                                    onChange={e =>
                                                        setShippingAddress({
                                                            ...shippingAddress,
                                                            recipient: e.target.value
                                                        })
                                                    }
                                                    className={`w-full border ${
                                                        formErrors.recipient ? 'border-red-500' : 'border-gray-300'
                                                    } rounded-lg pl-4 pr-10 py-3 focus:ring-blue-500 focus:border-blue-500 outline-none`}
                                                    placeholder={t('COMMON.USER.ENTER_FULL_NAME')}
                                                />
                                                <User2 className='w-5 h-5 text-blue-600 absolute right-3 top-1/2 transform -translate-y-1/2' />
                                            </div>
                                            {formErrors.recipient && (
                                                <p className='mt-1 text-sm text-red-600'>{formErrors.recipient}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                                                {t('COMMON.USER.PHONE')} *
                                            </label>
                                            <div className='relative'>
                                                <input
                                                    type='tel'
                                                    value={shippingAddress?.phone || ''}
                                                    onChange={e =>
                                                        setShippingAddress({
                                                            ...shippingAddress,
                                                            phone: e.target.value
                                                        })
                                                    }
                                                    className={`w-full border ${
                                                        formErrors.phone ? 'border-red-500' : 'border-gray-300'
                                                    } rounded-lg pl-4 pr-10 py-3 focus:ring-blue-500 focus:border-blue-500 outline-none`}
                                                    placeholder={t('COMMON.USER.ENTER_PHONE')}
                                                />
                                                <PhoneCall className='w-5 h-5 text-blue-600 absolute right-3 top-1/2 transform -translate-y-1/2' />
                                            </div>
                                            {formErrors.phone && (
                                                <p className='mt-1 text-sm text-red-600'>{formErrors.phone}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                                                {t('COMMON.USER.EMAIL')} *
                                            </label>
                                            <div className='relative'>
                                                <input
                                                    type='email'
                                                    value={shippingAddress.email}
                                                    onChange={e =>
                                                        setShippingAddress({
                                                            ...shippingAddress,
                                                            email: e.target.value
                                                        })
                                                    }
                                                    className={`w-full border ${
                                                        formErrors.email ? 'border-red-500' : 'border-gray-300'
                                                    } rounded-lg pl-4 pr-10 py-3 focus:ring-blue-500 focus:border-blue-500 outline-none`}
                                                    placeholder={t('COMMON.USER.ENTER_EMAIL')}
                                                />
                                                <Mail className='w-5 h-5 text-blue-600 absolute right-3 top-1/2 transform -translate-y-1/2' />
                                            </div>
                                            {formErrors.email && (
                                                <p className='mt-1 text-sm text-red-600'>{formErrors.email}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                                                {t('COMMON.USER.ADDRESS_TITLE')}
                                            </label>
                                            <input
                                                type='text'
                                                value={shippingAddress.title}
                                                onChange={e =>
                                                    setShippingAddress({ ...shippingAddress, title: e.target.value })
                                                }
                                                className='w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500'
                                                placeholder='Văn phòng, Nhà riêng, Kho hàng...'
                                            />
                                        </div>
                                    </div>

                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                                                {t('COMMON.USER.ADDRESS')} *
                                            </label>
                                            <div className='relative'>
                                                <input
                                                    type='text'
                                                    value={shippingAddress.address}
                                                    onChange={e =>
                                                        setShippingAddress({
                                                            ...shippingAddress,
                                                            address: e.target.value
                                                        })
                                                    }
                                                    className={`w-full border ${
                                                        formErrors.address ? 'border-red-500' : 'border-gray-300'
                                                    } rounded-lg pl-4 pr-10 py-3 focus:ring-blue-500 focus:border-blue-500 outline-none`}
                                                    placeholder={t('COMMON.USER.ENTER_ADDRESS')}
                                                />
                                                <House className='w-5 h-5 text-blue-600 absolute right-3 top-1/2 transform -translate-y-1/2' />
                                            </div>
                                            {formErrors.address && (
                                                <p className='mt-1 text-sm text-red-600'>{formErrors.address}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                                                {t('COMMON.USER.DISTRICT')} *
                                            </label>
                                            <input
                                                type='text'
                                                value={shippingAddress.district}
                                                onChange={e =>
                                                    setShippingAddress({ ...shippingAddress, district: e.target.value })
                                                }
                                                className={`w-full border ${
                                                    formErrors.district ? 'border-red-500' : 'border-gray-300'
                                                } rounded-lg px-4 py-3 focus:ring-blue-500 focus:border-blue-500 outline-none`}
                                                placeholder={t('COMMON.USER.ENTER_DISTRICT')}
                                            />
                                            {formErrors.district && (
                                                <p className='mt-1 text-sm text-red-600'>{formErrors.district}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 md:items-center'>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                                                {t('COMMON.USER.CITY')} *
                                            </label>
                                            <input
                                                type='text'
                                                value={shippingAddress.city}
                                                onChange={e =>
                                                    setShippingAddress({ ...shippingAddress, city: e.target.value })
                                                }
                                                className={`w-full border ${
                                                    formErrors.city ? 'border-red-500' : 'border-gray-300'
                                                } rounded-lg px-4 py-3 focus:ring-blue-500 focus:border-blue-500 outline-none`}
                                                placeholder={t('COMMON.USER.ENTER_CITY')}
                                            />
                                            {formErrors.city && (
                                                <p className='mt-1 text-sm text-red-600'>{formErrors.city}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className='rounded-[15px] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.1)] bg-white'>
                                <div className='px-6 h-[66px] flex items-center justify-between border-b border-gray-100'>
                                    <div className='flex items-center'>
                                        <MapPin className='w-5 h-5 text-blue-600 mr-3' />
                                        <h2 className='font-bold text-[18px] text-gray-800'>
                                            {t('COMMON.USER.SHIPPING_ADDRESS')}
                                        </h2>
                                    </div>

                                    <button
                                        onClick={() => {
                                            setIsOpenModal(true)
                                        }}
                                        className='text-blue-600 hover:text-blue-800 flex items-center font-medium px-4 py-2 rounded-[8px] hover:bg-blue-50'
                                    >
                                        <Edit2 className='w-4 h-4 mr-2' />
                                        {t('COMMON.USER.CHANGE')}
                                    </button>
                                </div>

                                <div className='p-6'>
                                    <div className='bg-gray-50 rounded-[15px]'>
                                        <div className='p-6 space-y-3.5'>
                                            <div className='flex items-start'>
                                                <div className='min-w-[140px] text-gray-500'>
                                                    {t('COMMON.USER.RECIPIENT')}
                                                </div>
                                                <div className='font-medium text-gray-900 flex items-center'>
                                                    <User2 className='w-4 h-4 text-blue-600 mr-3' />
                                                    {shippingAddress.recipient}
                                                </div>
                                            </div>

                                            <div className='flex items-start'>
                                                <div className='min-w-[140px] text-gray-500'>
                                                    {t('COMMON.USER.PHONE')}
                                                </div>
                                                <div className='font-medium text-gray-900 flex items-center'>
                                                    <PhoneCall className='w-4 h-4 text-blue-600 mr-3' />
                                                    {shippingAddress.phone}
                                                </div>
                                            </div>

                                            <div className='flex items-start'>
                                                <div className='min-w-[140px] text-gray-500'>
                                                    {t('COMMON.USER.ADDRESS_TITLE')}
                                                </div>
                                                <div className='font-medium text-gray-900 flex items-center'>
                                                    <Building className='w-4 h-4 text-blue-600 mr-3' />
                                                    {shippingAddress.title}
                                                </div>
                                            </div>

                                            <div className='flex items-start'>
                                                <div className='min-w-[140px] text-gray-500'>
                                                    {t('COMMON.USER.EMAIL')}
                                                </div>
                                                <div className='font-medium text-gray-900 flex items-center'>
                                                    <Mail className='w-4 h-4 text-blue-600 mr-3' />
                                                    {shippingAddress.email}
                                                </div>
                                            </div>

                                            <div className='flex items-start'>
                                                <div className='min-w-[140px] text-gray-500'>
                                                    {t('COMMON.USER.ADDRESS')}
                                                </div>
                                                <div className=''>
                                                    <p className='font-medium text-gray-900 flex items-center'>
                                                        <House className='w-4 h-4 text-blue-600 mr-3' />
                                                        {shippingAddress.address}, {shippingAddress.district},{' '}
                                                        {shippingAddress.city}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {typeNote === 'info' ? (
                                        <div className='mt-6 bg-blue-50 flex justify-between items-center gap-2 rounded-lg pl-4 pr-3 py-[11px] border-l-4 border-blue-600'>
                                            <div className='flex items-center overflow-hidden gap-3'>
                                                <p className='font-bold text-gray-800 whitespace-nowrap'>
                                                    {t('COMMON.PURCHASE_ORDER.NOTES')}:
                                                </p>
                                                <p className='text-gray-800 italic'>
                                                    {customerNote.length ? customerNote : t('COMMON.USER.EMPTY')}
                                                </p>
                                            </div>

                                            <button
                                                className='p-2 rounded-full text-blue-600 hover:bg-blue-100'
                                                onClick={() => setTypeNote(prev => (prev === 'info' ? 'edit' : 'info'))}
                                            >
                                                <Edit2 className='w-4 h-4' />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className='mt-6 bg-gray-50 rounded-lg p-4'>
                                            <label className='block font-bold text-black mb-3'>
                                                {t('COMMON.PURCHASE_ORDER.NOTES')}
                                            </label>
                                            <div className='space-y-3'>
                                                <textarea
                                                    value={customerNote}
                                                    onChange={e => setCustomerNote(e.target.value)}
                                                    className='w-full bg-white border-0 rounded-lg px-4 py-3 focus:ring-blue-500 outline-none resize-none transition-all shadow-[0_4px_16px_rgba(0,0,0,0.1)]'
                                                    placeholder='Nhập ghi chú cho đơn hàng...'
                                                    rows={3}
                                                />
                                                <div className='flex justify-end'>
                                                    <button
                                                        className='px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2'
                                                        onClick={() => setTypeNote('info')}
                                                    >
                                                        <Check className='w-4 h-4' />
                                                        {t('COMMON.USER.SAVE')}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Order items */}
                        <div className='rounded-[15px] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.1)] bg-white'>
                            <div className='px-6 h-[66px] flex items-center border-b border-gray-100'>
                                <ShoppingBag className='w-5 h-5 text-blue-600 mr-3' />
                                <h2 className='font-bold text-[18px] text-gray-800'>
                                    {t('COMMON.USER.ORDER_ITEMS', { count: products.length })}
                                </h2>
                            </div>

                            <div className='overflow-hidden space-y-5 p-6'>
                                {products.map((item, index) => (
                                    <div
                                        key={index}
                                        className='flex items-center gap-4 py-3 px-4 rounded-[12px] bg-gray-50 hover:bg-gray-100 transition-colors justify-between'
                                    >
                                        <div className='flex items-center'>
                                            <div className='flex-shrink-0'>
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
                                            <div className='space-y-1 ml-5'>
                                                <p className='font-medium text-md text-gray-900'>{item.productName}</p>
                                                <p className='text-gray-500 text-sm'>SKU: {item.sku}</p>
                                                <p className='text-black text-sm'>{item.variants}</p>
                                            </div>
                                        </div>
                                        <div className='text-right'>
                                            <div className='flex items-center gap-2'>
                                                {item.discountPrice < item.originalPrice && (
                                                    <p className='line-through text-gray-400'>
                                                        {formatCurrency(item.originalPrice)}
                                                    </p>
                                                )}
                                                <p className='font-medium text-[#3675ff]'>
                                                    {formatCurrency(item.discountPrice)}
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

                        <div className='rounded-[15px] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.1)] bg-white overflow-hidden'>
                            <div className='px-6 h-[66px] border-b border-gray-100 flex items-center'>
                                <CreditCard className='w-5 h-5 text-blue-600 mr-3' />
                                <h2 className='font-bold text-[18px] text-gray-800'>
                                    {t('COMMON.USER.PAYMENT_METHOD')}
                                </h2>
                            </div>

                            <div className='p-6'>
                                <div className='space-y-5'>
                                    {paymentMethods.map(method => {
                                        const cursor = method.name === 'MoMo' ? 'cursor-not-allowed' : 'cursor-pointer'
                                        const hoverBorder =
                                            method.name === 'MoMo'
                                                ? 'group-hover:border-gray-300'
                                                : 'group-hover:border-blue-400'

                                        return (
                                            <div
                                                key={method.id}
                                                className={`group relative rounded-xl transition-all duration-300 ${
                                                    selectedPaymentMethod === method.id
                                                        ? 'bg-white shadow-md border-0'
                                                        : 'bg-white shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:shadow'
                                                }`}
                                            >
                                                <div
                                                    className={`p-5 ${cursor}`}
                                                    onClick={() => {
                                                        if (method.name !== 'MoMo') handlePaymentMethodChange(method.id)
                                                    }}
                                                >
                                                    <div className='flex items-center'>
                                                        <div
                                                            className={`w-6 h-6 flex-shrink-0 rounded-full border ${
                                                                selectedPaymentMethod === method.id
                                                                    ? 'border-blue-600 bg-blue-600'
                                                                    : `border-gray-300 ${hoverBorder}`
                                                            } flex items-center justify-center`}
                                                        >
                                                            {selectedPaymentMethod === method.id && (
                                                                <Check className='w-4 h-4 text-white' />
                                                            )}
                                                        </div>

                                                        <div className='ml-4 bg-white rounded-lg shadow-sm'>
                                                            {method.logo}
                                                        </div>

                                                        <div className='ml-4 flex-grow'>
                                                            <label className='font-medium text-gray-800 cursor-pointer'>
                                                                {method.name}
                                                                {method.name == 'MoMo' && (
                                                                    <span className='ml-2 italic text-red-500'>
                                                                        (Chưa hỗ trợ)
                                                                    </span>
                                                                )}
                                                            </label>
                                                            <p className='text-gray-500 text-sm'>
                                                                {method.description}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {selectedPaymentMethod === method.id && (
                                                        <div className='mt-4 pl-10'>
                                                            <div className='bg-blue-50 py-3 px-4 rounded-lg border border-blue-100'>
                                                                <div className='flex items-center'>
                                                                    <Info className='w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0' />
                                                                    <p className='text-gray-700'>
                                                                        {method.additionalInfo}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {selectedPaymentMethod === method.id && (
                                                    <div className='absolute inset-0 border-2 border-blue-500 rounded-xl pointer-events-none'></div>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order summary */}
                    <div className='w-full lg:w-1/3'>
                        <div className='rounded-[15px] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.1)] bg-white sticky top-6'>
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
                                                {t('COMMON.USER.SUBTOTAL', { count: products.length })}
                                            </span>
                                            <span className='font-medium'>{formatCurrency(summary.subTotal)}</span>
                                        </div>

                                        <div className='flex justify-between'>
                                            <p className='text-gray-600'>{t('COMMON.ORDER.SHIPPING_FEE')}</p>
                                            <p className='font-medium'>{formatCurrency(summary.shippingFee)}</p>
                                        </div>

                                        <div className='flex justify-between'>
                                            <p className='text-gray-600'>{t('COMMON.ORDER.DISCOUNT_SHIPPING_FEE')}</p>
                                            <p className='font-medium text-[#ff5630]'>
                                                {summary.discountShippingFee && summary.discountShippingFee >= 0
                                                    ? '-'
                                                    : ''}
                                                {formatCurrency(summary.discountShippingFee || 0)}
                                            </p>
                                        </div>

                                        <div className='flex justify-between'>
                                            <p className='text-gray-600'>{t('COMMON.ORDER.DISCOUNT_AMOUNT')}</p>
                                            <p className='font-medium text-[#ff5630]'>
                                                {summary.discountAmount && summary.discountAmount >= 0 ? '-' : ''}
                                                {formatCurrency(summary.discountAmount || 0)}
                                            </p>
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
                                        <p className='text-sm text-gray-600 mt-1'>{t('COMMON.USER.VAT_INCLUDED')}</p>
                                    </div>
                                </div>

                                <div className='mt-6'>
                                    <div
                                        className='bg-white border border-blue-100 rounded-lg cursor-pointer hover:border-blue-300 hover:shadow-sm'
                                        onClick={() => setIsModalOpen(true)}
                                    >
                                        <div className='flex items-center justify-between p-4'>
                                            <div className='flex items-center gap-4'>
                                                <div className='w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center'>
                                                    <Tag className='w-5 h-5 text-blue-600' />
                                                </div>
                                                <div>
                                                    <div className='font-medium text-gray-800 text-sm'>Mã giảm giá</div>
                                                    <div className='text-xs text-blue-600 mt-[1px]'>
                                                        {hasSelectedCoupons
                                                            ? `${selectedCount} mã đã chọn`
                                                            : 'Chọn mã giảm giá'}
                                                    </div>
                                                </div>
                                            </div>
                                            <ChevronRight className='w-4 h-4 text-gray-400' />
                                        </div>

                                        {hasSelectedCoupons && (
                                            <div className='px-4 pb-4 space-y-3'>
                                                {selectedCoupons.productCoupon && (
                                                    <div className='flex items-center justify-between bg-green-50 border border-green-100 rounded-md py-3 px-4'>
                                                        <div className='flex items-center gap-4'>
                                                            <ShoppingCart className='w-5 h-5 text-green-600' />
                                                            <div>
                                                                <div className='font-medium text-green-700 text-sm'>
                                                                    {selectedCoupons.productCoupon.couponCode}
                                                                </div>
                                                                <div className='text-xs text-green-600 mt-[2px]'>
                                                                    Giảm {formatDiscount(selectedCoupons.productCoupon)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {selectedCoupons.shippingCoupon && (
                                                    <div className='flex items-center justify-between bg-blue-50 border border-blue-100 rounded-md py-3 px-4'>
                                                        <div className='flex items-center gap-4'>
                                                            <Truck className='w-5 h-5 text-blue-600' />
                                                            <div>
                                                                <div className='font-medium text-blue-700 text-sm'>
                                                                    {selectedCoupons.shippingCoupon.couponCode}
                                                                </div>
                                                                <div className='text-xs text-blue-600 mt-[2px]'>
                                                                    Giảm{' '}
                                                                    {formatDiscount(selectedCoupons.shippingCoupon)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className='mt-6'>
                                    <button
                                        disabled={isLoading}
                                        onClick={handlePlaceOrder}
                                        className='w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium flex items-center justify-center transition'
                                    >
                                        {isLoading ? (
                                            <Loader2 className='animate-spin w-5 h-5 mr-2' />
                                        ) : (
                                            <CreditCard className='w-5 h-5 mr-2' />
                                        )}

                                        {t('COMMON.USER.PLACE_ORDER')}
                                    </button>
                                </div>

                                <div className='text-center mt-5'>
                                    <p className='text-sm text-gray-500'>
                                        Bằng việc đăng nhập, bạn đồng ý với{' '}
                                        <button className='text-blue-600 hover:underline'>Điều khoản dịch vụ</button> và{' '}
                                        <button className='text-blue-600 hover:underline'>Chính sách bảo mật</button>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='mt-6 rounded-[15px] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.1)] bg-white overflow-hidden'>
                    <div className='bg-gradient-to-r from-blue-600 to-blue-700 p-6'>
                        <h3 className='text-white font-bold text-[18px] text-center mb-6'>
                            {t('COMMON.USER.OUR_PROMISES')}
                        </h3>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                            <div className='bg-white bg-opacity-10 rounded-[12px] p-4 backdrop-blur-sm border border-white border-opacity-20'>
                                <div className='flex items-center'>
                                    <div className='rounded-full bg-white p-3 mr-4'>
                                        <BadgeCheck className='h-5 w-5 text-blue-600' />
                                    </div>
                                    <div>
                                        <p className='text-white font-medium text-[16px]'>
                                            {t('COMMON.USER.AUTHENTIC_GUARANTEE')}
                                        </p>
                                        <p className='text-white text-opacity-80 text-md mt-1'>
                                            {t('COMMON.USER.AUTHENTIC_GUARANTEE_DESC')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className='bg-white bg-opacity-10 rounded-[12px] p-4 backdrop-blur-sm border border-white border-opacity-20'>
                                <div className='flex items-center'>
                                    <div className='rounded-full bg-white p-3 mr-4'>
                                        <HelpingHand className='h-5 w-5 text-blue-600' />
                                    </div>
                                    <div>
                                        <p className='text-white font-medium text-[16px]'>
                                            {t('COMMON.USER.TECH_SUPPORT')}
                                        </p>
                                        <p className='text-white text-opacity-80 text-md mt-1'>
                                            {t('COMMON.USER.TECH_SUPPORT_DESC')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className='bg-white bg-opacity-10 rounded-[12px] p-4 backdrop-blur-sm border border-white border-opacity-20'>
                                <div className='flex items-center'>
                                    <div className='rounded-full bg-white p-3 mr-4'>
                                        <Shield className='h-5 w-5 text-blue-600' />
                                    </div>
                                    <div>
                                        <p className='text-white font-medium text-[16px]'>
                                            {t('COMMON.USER.SECURE_CHECKOUT')}
                                        </p>
                                        <p className='text-white text-opacity-80 text-md mt-1'>
                                            {t('COMMON.USER.SECURE_CHECKOUT_DESC')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AddressManager isOpen={isOpenModel} onClose={() => setIsOpenModal(false)} />

            <CouponSelector
                isModalOpen={isModalOpen}
                setIsModalOpen={() => setIsModalOpen(false)}
                coupons={availableCoupons}
                selectedCoupons={selectedCoupons}
                onCouponSelect={handleCouponSelect}
                onCouponRemove={handleCouponRemove}
                orderValue={summary.subTotal}
            />
        </div>
    )
}

export default CheckoutPage
