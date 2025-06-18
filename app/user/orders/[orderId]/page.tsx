'use client'

import React from 'react'
import { Truck, Package, NotepadText, Banknote, Star, Clock, CreditCard, Hourglass } from 'lucide-react'
import { IOrderDetail } from '@/models/Order'
import { useTranslation } from 'react-i18next'
import { formatCurrency } from '@/common/format'
import { useGetByIdOrderQuery } from '@/services/UserOrderService'
import { usePathname, useRouter } from 'next/navigation'
import Loading from '@/components/Loading'
import EmptyState from '@/components/ObjectEmptyState'
import { useSelector } from 'react-redux'
import { userSelector } from '@/redux/slices/userSlice'
import ForbiddenAccess from '@/components/ForbiddenAccess'
import { useToast } from '@/hooks/useToast'
import { useCreateVnpayUrlMutation } from '@/services/PaymentService'

function getStatusBgColor(status: string): string {
    if (status === 'cancelled') {
        return 'var(--background-color-cancel-selected)'
    } else if (status === 'delivered') {
        return 'var(--background-color-success-selected)'
    } else if (status === 'pending') {
        return 'var(--background-color-pending-selected)'
    } else if (status === 'returned') {
        return 'var(--background-color-silver-selected)'
    } else if (status === 'processing') {
        return 'var(--background-color-pink-selected)'
    } else {
        return 'var(--background-color-blue-selected)'
    }
}

function getBorderColor(status: string): string {
    if (status === 'cancelled') {
        return 'var(--border-color-cancel-selected)'
    } else if (status === 'delivered') {
        return 'var(--border-color-success-selected)'
    } else if (status === 'pending') {
        return 'var(--border-color-pending-selected)'
    } else if (status === 'returned') {
        return 'var(--border-color-silver-selected)'
    } else if (status === 'processing') {
        return 'var(--border-color-pink-selected)'
    } else {
        return 'var(--border-color-blue-selected)'
    }
}

function getStatusTextColor(status: string): string {
    if (status === 'cancelled') {
        return 'var(--text-color-cancel-selected)'
    } else if (status === 'delivered') {
        return 'var(--text-color-success-selected)'
    } else if (status === 'pending') {
        return 'var(--text-color-pending-selected)'
    } else if (status === 'returned') {
        return 'var(--text-color-silver-selected)'
    } else if (status === 'processing') {
        return 'var(--text-color-pink-selected)'
    } else {
        return 'var(--text-color-blue-selected)'
    }
}

export default function OrderDetailPage() {
    const { t } = useTranslation('common')
    const pathName = usePathname()
    const router = useRouter()
    const toast = useToast()
    const orderId = String(pathName.split('/').pop())
    const [createVnpayUrl] = useCreateVnpayUrlMutation()

    const { data: orderDetailResponse, isLoading, error: errorOrderDetail } = useGetByIdOrderQuery(orderId)

    const orderDetail: IOrderDetail = orderDetailResponse?.data

    const user = useSelector(userSelector).userInfo

    const step =
        !orderDetail?.paymentTime && orderDetail?.orderStatus === 'pending'
            ? 1
            : !orderDetail?.carrierDeliveryTime
            ? 2
            : !orderDetail?.deliveryTime
            ? 3
            : !orderDetail?.reviewTime
            ? 4
            : 0

    if (
        errorOrderDetail &&
        typeof errorOrderDetail === 'object' &&
        'status' in errorOrderDetail &&
        errorOrderDetail.status === 403
    ) {
        return <ForbiddenAccess type='orders' />
    }

    const handleCheckoutVnPay = async () => {
        try {
            const res = await createVnpayUrl({
                orderCode: orderId,
                amount: Math.ceil(orderDetail.totalAmount)
            }).unwrap()

            if (res.paymentUrl) {
                router.push(res.paymentUrl)
            }
        } catch (err) {
            toast(err?.data?.detail, 'error')
        }
    }

    if (isLoading) {
        return <Loading />
    }

    return (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            {!orderDetail ? (
                <EmptyState />
            ) : (
                <div>
                    <div className='flex items-center justify-between mb-6'>
                        <div className='flex items-center gap-5'>
                            <div className='flex items-center space-x-5'>
                                <div className='flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white'>
                                    <Package className='w-6 h-6' />
                                </div>
                                <div>
                                    <h3 className='text-xl font-bold text-gray-800 ml-[5px]'>
                                        {t('COMMON.ORDER.ORDER')}{' '}
                                        <span className='underline'>#{orderDetail.orderCode}</span>
                                    </h3>
                                    <div className='mr-6 flex items-center text-gray-500 ml-[5px] mt-2.5'>
                                        <Clock className='inline-block h-5 w-5 mr-2' />
                                        <p className='text-[15px]'>
                                            {new Date(orderDetail.orderDate).toLocaleDateString('vi-VN', {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div
                                className='ml-5 px-4 py-1.5 rounded-full shadow-sm'
                                style={{
                                    border: getBorderColor(orderDetail.orderStatus),
                                    backgroundColor: getStatusBgColor(orderDetail.orderStatus)
                                }}
                            >
                                <span
                                    className='text-base font-[600] text-[13px] text-ellipsis whitespace-nowrap overflow-hidden'
                                    style={{ color: getStatusTextColor(orderDetail.orderStatus) }}
                                >
                                    {orderDetail.orderStatus === 'pending' && t('COMMON.ORDER.PENDING')}
                                    {orderDetail.orderStatus === 'returned' && t('COMMON.ORDER.RETURNED')}
                                    {orderDetail.orderStatus === 'processing' && t('COMMON.ORDER.PROCESSING')}
                                    {orderDetail.orderStatus === 'shipping' && t('COMMON.ORDER.SHIPPING')}
                                    {orderDetail.orderStatus === 'delivered' && t('COMMON.ORDER.DELIVERED')}
                                    {orderDetail.orderStatus === 'cancelled' && t('COMMON.ORDER.CANCELLED')}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className='space-y-6'>
                        <div className='mt-6 rounded-[15px] w-full p-6 shadow-[0_4px_16px_rgba(0,0,0,0.1)] bg-[var(--background-color-item)]'>
                            <div className='w-fill flex flex-col md:flex-row gap-6'>
                                {/* Order history timeline */}
                                <div className='order-2 md:order-1 w-full md:w-2/3'>
                                    <p className='text-[18px] font-bold text-gray-800 flex items-center'>
                                        {t('COMMON.ORDER.HISTORY')}
                                    </p>

                                    {orderDetail.histories.map((history, index) => (
                                        <div key={index} className='flex gap-4 mt-5'>
                                            <div className='flex flex-col items-center relative'>
                                                <div className='w-[13px] mt-[5.5px] h-[13px] rounded-full bg-[var(--primary-color)] z-10'></div>

                                                {index !== orderDetail.histories.length - 1 && (
                                                    <div className='absolute top-[22px] h-[100%] border-l border-gray-300 z-0'></div>
                                                )}
                                            </div>

                                            <div>
                                                <p className='font-bold text-gray-800'>{history.title}</p>
                                                <p className='text-sm text-gray-500 mt-1'>
                                                    {new Date(history.time).toLocaleDateString('vi-VN', {
                                                        year: 'numeric',
                                                        month: '2-digit',
                                                        day: '2-digit',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Step progress block */}
                                <div className='order-1 md:order-2 w-full md:w-1/3 rounded-[15px] px-5 py-[5px] border border-dashed border-gray-200 h-fit'>
                                    {[0, 1, 2, 3, 4].map(stepIndex => {
                                        const isActive = step === stepIndex
                                        console.log('step', step, 'stepIndex', stepIndex)
                                        const isCompleted = step > stepIndex
                                        const iconColor = isActive
                                            ? 'white'
                                            : isCompleted
                                            ? 'var(--primary-color)'
                                            : '#e0e0e0'
                                        const bgColor = isActive ? 'bg-[var(--primary-color)]' : 'bg-transparent'
                                        const borderStyle =
                                            isCompleted || isActive
                                                ? `border-[3px] border-[var(--primary-color)]`
                                                : `border-[3px] border-[#e0e0e0]`
                                        const stepData = [
                                            {
                                                icon: <NotepadText color={iconColor} />,
                                                label: t('COMMON.ORDER.ORDER_PLACED'),
                                                time: orderDetail.orderDate
                                            },
                                            {
                                                icon:
                                                    orderDetail.paymentMethod !== 'cod' ? (
                                                        <Banknote color={iconColor} />
                                                    ) : (
                                                        <Hourglass color={iconColor} />
                                                    ),
                                                label:
                                                    orderDetail.paymentMethod === 'cod'
                                                        ? orderDetail.orderStatus === 'pending'
                                                            ? t('COMMON.ORDER.ORDER_PENDING')
                                                            : t('COMMON.ORDER.PROCESSED')
                                                        : orderDetail.paymentTime
                                                        ? t('COMMON.ORDER.ORDER_PAID')
                                                        : t('COMMON.ORDER.PENDING_PAYMENT'),
                                                time: orderDetail.paymentTime
                                            },
                                            {
                                                icon: <Truck color={iconColor} />,
                                                label: orderDetail.carrierDeliveryTime
                                                    ? t('COMMON.ORDER.HANDED_TO_CARRIER')
                                                    : t('COMMON.ORDER.SHIPPING'),
                                                time: orderDetail.carrierDeliveryTime
                                            },
                                            {
                                                icon: <Package color={iconColor} />,
                                                label: orderDetail.deliveryTime
                                                    ? t('COMMON.ORDER.ORDER_RECEIVED')
                                                    : t('COMMON.ORDER.AWAITING_DELIVERY'),
                                                time: orderDetail.deliveryTime
                                            },
                                            {
                                                icon: <Star color={iconColor} />,
                                                label: orderDetail.reviewTime
                                                    ? t('COMMON.ORDER.ORDER_REVIEWED')
                                                    : t('COMMON.ORDER.REVIEW'),
                                                time: orderDetail.reviewTime
                                            }
                                        ][stepIndex]

                                        return (
                                            <div key={stepIndex} className='flex items-center h-[80px] gap-4 z-[1]'>
                                                <div className='flex flex-col items-center relative'>
                                                    <div
                                                        className={`w-[50px] h-[50px] flex items-center justify-center rounded-full ${bgColor} ${borderStyle}`}
                                                    >
                                                        {stepData.icon}
                                                    </div>
                                                    {stepIndex < 4 && (
                                                        <div
                                                            className='absolute top-[50px] h-[31px] border-l border-[1.5px]'
                                                            style={{
                                                                borderColor:
                                                                    step > stepIndex
                                                                        ? 'var(--primary-color)'
                                                                        : '#e0e0e0'
                                                            }}
                                                        ></div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className='font-bold text-gray-800'>{stepData.label}</p>
                                                    {stepData.time && (
                                                        <p className='text-sm text-gray-500 mt-1'>
                                                            {new Date(stepData.time).toLocaleDateString('vi-VN', {
                                                                year: 'numeric',
                                                                month: '2-digit',
                                                                day: '2-digit',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col md:flex-row gap-6'>
                            <div className='order-2 md:order-1 w-full md:w-2/3 h-fit bg-white rounded-[15px] shadow-[0_4px_16px_rgba(0,0,0,0.1)]'>
                                <div className='px-6 h-[66px] flex items-center border-b border-gray-100'>
                                    <h2 className='font-bold text-[18px] text-gray-800'>
                                        {t('COMMON.USER.PRODUCT_DETAILS')}
                                    </h2>
                                </div>
                                <div className='p-6'>
                                    <div className='w-full'>
                                        {orderDetail.items.map((item, index) => (
                                            <div
                                                key={index}
                                                className={`flex items-center justify-between gap-6 ${
                                                    index !== 0 ? 'mt-5' : '-mt-1'
                                                }`}
                                            >
                                                <div className='flex items-center'>
                                                    <img
                                                        src={item.image}
                                                        className='w-[62px] h-[62px] rounded-[10px] border border-gray-200 object-cover'
                                                    />
                                                    <div className='ml-5 space-y-1'>
                                                        <p className='font-medium text-md text-gray-900'>
                                                            {item.productName}
                                                        </p>
                                                        <p className='text-gray-500 text-sm'>SKU: {item.sku}</p>
                                                        <p className='text-gray-800'>{item.variants}</p>
                                                    </div>
                                                </div>
                                                <div className='text-right'>
                                                    <p className='font-medium text-gray-900'>
                                                        {formatCurrency(item.price)}
                                                    </p>
                                                    <p className='text-gray-800 mt-1'>
                                                        {t('COMMON.USER.QUANTITY')}: {item.quantity}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className='border-t border-dashed border-gray-200 mt-6 -mx-6'></div>

                                    <div className='flex flex-col gap-4 mt-6'>
                                        <div className='flex justify-between'>
                                            <p className='text-gray-500'>{t('COMMON.ORDER.SUBTOTAL')}</p>
                                            <p className='font-bold text-gray-800'>
                                                {formatCurrency(orderDetail.subTotal)}
                                            </p>
                                        </div>

                                        <div className='flex justify-between'>
                                            <p className='text-gray-500'>{t('COMMON.ORDER.SHIPPING_FEE')}</p>
                                            <p className='font-bold text-gray-800'>
                                                {formatCurrency(orderDetail.shippingFee)}
                                            </p>
                                        </div>

                                        <div className='flex justify-between'>
                                            <p className='text-gray-500'>{t('COMMON.ORDER.DISCOUNT_SHIPPING_FEE')}</p>
                                            <p className='font-bold text-[#ff5630]'>
                                                {orderDetail.discountShippingFee && orderDetail.discountShippingFee >= 0
                                                    ? '- '
                                                    : ''}
                                                {formatCurrency(orderDetail.discountShippingFee || 0)}
                                            </p>
                                        </div>

                                        <div className='flex justify-between'>
                                            <p className='text-gray-500'>{t('COMMON.ORDER.DISCOUNT_AMOUNT')}</p>
                                            <p className='font-bold text-[#ff5630]'>
                                                {orderDetail.discountAmount && orderDetail.discountAmount >= 0
                                                    ? '- '
                                                    : ''}
                                                {formatCurrency(orderDetail.discountAmount || 0)}
                                            </p>
                                        </div>

                                        <div className='flex justify-between'>
                                            <p className='text-gray-500'>{t('COMMON.ORDER.TAXES')}</p>
                                            <p className='font-bold text-gray-800'>
                                                {formatCurrency(orderDetail.taxes || 0)}
                                            </p>
                                        </div>

                                        <div className='flex justify-between pt-2'>
                                            <p className='text-[18px] font-bold text-gray-800'>
                                                {t('COMMON.ORDER.TOTAL')}
                                            </p>
                                            <p className='text-[18px] font-bold text-[#3675ff]'>
                                                {formatCurrency(orderDetail.totalAmount)}
                                            </p>
                                        </div>
                                    </div>

                                    {orderDetail.customerNote && (
                                        <div className='mt-6 bg-blue-50 rounded-lg px-4 py-[13px] border-l-4 border-blue-600 flex gap-2'>
                                            <p className='font-bold text-gray-800 whitespace-nowrap'>
                                                {t('COMMON.PURCHASE_ORDER.NOTES')}:
                                            </p>
                                            <p className='text-gray-800 italic'>{orderDetail.customerNote}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className='order-1 md:order-2 w-full md:w-1/3 h-fit rounded-[15px] shadow-[0_4px_16px_rgba(0,0,0,0.1)] bg-[var(--background-color-item)] p-6 h-fit'>
                                {/* CUSTOMER INFO */}
                                {user && (
                                    <>
                                        <p className='text-[18px] font-bold text-[var(--text-color)] flex items-center'>
                                            {t('COMMON.ORDER.CUSTOMER_INFO')}
                                        </p>

                                        <div className='my-6 flex items-center gap-5'>
                                            <img
                                                src={user?.avatar || '/images/account.png'}
                                                className='w-[50px] h-[50px] rounded-full object-cover'
                                                alt='Avatar'
                                            />

                                            <div className='flex flex-col gap-[4px]'>
                                                <p className='font-bold text-[var(--text-color)]'>{user?.fullName}</p>
                                                <p className='text-[var(--label-title-color)]'>{user?.email}</p>
                                            </div>
                                        </div>
                                        <div className='border-b border-dashed border-[var(--border-color)] mb-6 -mx-6' />
                                    </>
                                )}

                                {/* DELIVERY */}
                                {(orderDetail.shipBy || orderDetail.speedyDelivery || orderDetail.trackingCode) && (
                                    <>
                                        <div className='mb-6'>
                                            <p className='text-[18px] font-bold text-[var(--text-color)] flex items-center'>
                                                {t('COMMON.ORDER.DELIVERY')}
                                            </p>

                                            <div className='w-full mt-4'>
                                                {orderDetail.shipBy && (
                                                    <div className='flex'>
                                                        <div className='w-[120px] py-2 pr-2 text-left'>
                                                            <p className='text-[var(--label-title-color)]'>
                                                                {t('COMMON.ORDER.SHIP_BY')}
                                                            </p>
                                                        </div>
                                                        <div className='flex-1'>
                                                            <p className='text-[var(--text-color)] py-2 text-left'>
                                                                {orderDetail.shipBy}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {orderDetail.speedyDelivery && (
                                                    <div className='flex'>
                                                        <div className='w-[120px] py-2 pr-2 text-left'>
                                                            <p className='text-[var(--label-title-color)]'>
                                                                {t('COMMON.ORDER.SPEEDY')}
                                                            </p>
                                                        </div>
                                                        <div className='flex-1 py-2'>
                                                            <p className='text-[var(--text-color)] text-left'>
                                                                {orderDetail.speedyDelivery}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {orderDetail.trackingCode && (
                                                    <div className='flex'>
                                                        <div className='w-[120px] py-2 pr-2 text-left'>
                                                            <p className='text-[var(--label-title-color)]'>
                                                                {t('COMMON.ORDER.TRACKING_NO')}
                                                            </p>
                                                        </div>
                                                        <div className='flex-1 py-2'>
                                                            <p className='text-[var(--text-color)] underline text-left'>
                                                                {orderDetail.trackingCode}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className='border-t border-dashed border-[var(--border-color)] mb-6 -mx-6'></div>
                                    </>
                                )}

                                {/* SHIPPING */}
                                <div className='mb-6'>
                                    <p className='text-[18px] font-bold text-[var(--text-color)] flex items-center'>
                                        {t('COMMON.ORDER.SHIPPING')}
                                    </p>

                                    <div className='w-full mt-4'>
                                        <div className='flex'>
                                            <div className='w-[120px] py-2 pr-2 text-left align-top'>
                                                <p className='text-[15px] text-[var(--label-title-color)]'>
                                                    {t('COMMON.USER.RECIPIENT')}
                                                </p>
                                            </div>
                                            <div className='flex-1 py-2'>
                                                <p className='text-[15px] text-[var(--text-color)] text-left'>
                                                    {orderDetail.shippingRecipient}
                                                </p>
                                            </div>
                                        </div>

                                        <div className='flex'>
                                            <div className='w-[120px] py-2 pr-2 text-left'>
                                                <p className='text-[15px] text-[var(--label-title-color)]'>
                                                    {t('COMMON.ORDER.PHONE_NUMBER')}
                                                </p>
                                            </div>
                                            <div className='flex-1 py-2'>
                                                <p className='text-[15px] text-[var(--text-color)] text-left'>
                                                    {orderDetail.shippingPhone}
                                                </p>
                                            </div>
                                        </div>

                                        <div className='flex'>
                                            <div className='w-[120px] py-2 pr-2 text-left align-top'>
                                                <p className='text-[15px] text-[var(--label-title-color)]'>
                                                    {t('COMMON.ORDER.ADDRESS')}
                                                </p>
                                            </div>
                                            <div className='flex-1 pt-2'>
                                                <p className='text-[15px] text-[var(--text-color)] text-left'>
                                                    {orderDetail.shippingAddress +
                                                        ', ' +
                                                        orderDetail.shippingDistrict +
                                                        ', ' +
                                                        orderDetail.shippingCity}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className='border-t border-dashed border-[var(--border-color)] -mx-6'></div>

                                {/* PAYMENT */}
                                <div className='mt-6'>
                                    <p className='text-[18px] font-bold text-[var(--text-color)] flex items-center'>
                                        {t('COMMON.ORDER.PAYMENT')}
                                    </p>

                                    {orderDetail.paymentMethod === 'momo' && (
                                        <div className='mt-5 flex items-center gap-5 ml-auto'>
                                            <img
                                                src='/images/momo_square_pinkbg.svg'
                                                className='w-10 h-10 rounded-[8px]'
                                            />
                                            <div>
                                                <p className='text-[15px] font-bold text-[var(--text-color)]'>
                                                    {t('COMMON.ORDER.PAY_VIA')} MoMo
                                                </p>
                                                <p className='text-[15px] text-[var(--label-title-color)]'>
                                                    {orderDetail.paymentTime
                                                        ? new Date(orderDetail.paymentTime).toLocaleDateString(
                                                              'vi-VN',
                                                              {
                                                                  year: 'numeric',
                                                                  month: '2-digit',
                                                                  day: '2-digit',
                                                                  hour: '2-digit',
                                                                  minute: '2-digit'
                                                              }
                                                          )
                                                        : t('COMMON.PURCHASE_ORDER.UNPAID')}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {orderDetail.paymentMethod === 'vnpay' && (
                                        <div>
                                            <div className='mt-5 flex items-center gap-5 ml-auto'>
                                                <div className='bg-white rounded-lg shadow-sm'>
                                                    <img
                                                        src='/images/vnpay.svg'
                                                        className='w-16 h-12 px-1 rounded-[8px] shadow-[0_4px_16px_rgba(0,0,0,0.1)]'
                                                    />
                                                </div>
                                                <div>
                                                    <p className='text-[15px] font-bold text-[var(--text-color)]'>
                                                        {t('COMMON.ORDER.PAY_VIA')} VnPay
                                                    </p>
                                                    <p className='text-[15px] text-[var(--label-title-color)]'>
                                                        {orderDetail.paymentTime
                                                            ? new Date(orderDetail.paymentTime).toLocaleDateString(
                                                                  'vi-VN',
                                                                  {
                                                                      year: 'numeric',
                                                                      month: '2-digit',
                                                                      day: '2-digit',
                                                                      hour: '2-digit',
                                                                      minute: '2-digit'
                                                                  }
                                                              )
                                                            : t('COMMON.PURCHASE_ORDER.UNPAID')}
                                                    </p>
                                                </div>
                                            </div>

                                            {!orderDetail.paymentTime && (
                                                <button
                                                    onClick={handleCheckoutVnPay}
                                                    className='w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium flex items-center justify-center transition'
                                                >
                                                    <CreditCard className='w-5 h-5 mr-2' />
                                                    Thực hiện thanh toán
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    {orderDetail.paymentMethod === 'cod' && (
                                        <div className='mt-5 flex items-center gap-5 ml-auto'>
                                            <img src='/images/dollar.png' className='w-10 h-10' />
                                            <div>
                                                <p className='text-[15px] font-bold text-[var(--text-color)]'>
                                                    {t('COMMON.ORDER.CASH_PAYMENT')}
                                                </p>
                                                <p className='text-[15px] text-[var(--label-title-color)]'>
                                                    {orderDetail.paymentTime
                                                        ? new Date(orderDetail.paymentTime).toLocaleDateString(
                                                              'vi-VN',
                                                              {
                                                                  year: 'numeric',
                                                                  month: '2-digit',
                                                                  day: '2-digit',
                                                                  hour: '2-digit',
                                                                  minute: '2-digit'
                                                              }
                                                          )
                                                        : t('COMMON.ORDER.UNPAID')}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
