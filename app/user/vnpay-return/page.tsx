'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle, XCircle, Home, ShoppingBag, Receipt, CreditCard, Calendar, Building } from 'lucide-react'

export default function VnpayReturn() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [paymentData, setPaymentData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            const responseCode = searchParams.get('vnp_ResponseCode')
            const orderId = searchParams.get('vnp_TxnRef')
            const amount = searchParams.get('vnp_Amount')
            const bankCode = searchParams.get('vnp_BankCode')
            const payDate = searchParams.get('vnp_PayDate')
            const transactionNo = searchParams.get('vnp_TransactionNo')

            setPaymentData({
                responseCode,
                orderId,
                amount: amount ? (parseInt(amount) / 100).toLocaleString('vi-VN') : null,
                bankCode,
                payDate: payDate ? formatPayDate(payDate) : null,
                transactionNo,
                isSuccess: responseCode === '00'
            })
            setIsLoading(false)
        }, 1500)

        return () => clearTimeout(timer)
    }, [searchParams])

    const formatPayDate = dateStr => {
        if (!dateStr || dateStr.length !== 14) return null
        const year = dateStr.substring(0, 4)
        const month = dateStr.substring(4, 6)
        const day = dateStr.substring(6, 8)
        const hour = dateStr.substring(8, 10)
        const minute = dateStr.substring(10, 12)
        return `${day}/${month}/${year} ${hour}:${minute}`
    }

    const getStatusMessage = code => {
        const messages = {
            '00': 'Giao dịch đã được xử lý thành công',
            '07': 'Trừ tiền thành công nhưng giao dịch bị nghi ngờ',
            '09': 'Thẻ/Tài khoản chưa đăng ký dịch vụ InternetBanking',
            '10': 'Xác thực thông tin không đúng quá 3 lần',
            '11': 'Đã hết hạn chờ thanh toán',
            '12': 'Thẻ/Tài khoản bị khóa',
            '13': 'Sai mật khẩu xác thực giao dịch (OTP)',
            '24': 'Khách hàng hủy giao dịch',
            '51': 'Tài khoản không đủ số dư',
            '65': 'Vượt quá hạn mức giao dịch trong ngày',
            '75': 'Ngân hàng thanh toán đang bảo trì',
            '79': 'Nhập sai mật khẩu thanh toán quá số lần quy định'
        }
        return messages[code] || 'Giao dịch không thành công'
    }

    if (isLoading) {
        return (
            <div className='bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4'>
                <div className='bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-12 max-w-md w-full text-center'>
                    <div className='relative w-16 h-16 mx-auto mb-6'>
                        <div className='absolute inset-0 rounded-full border-4 border-blue-100'></div>
                        <div className='absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin'></div>
                        <div className='absolute inset-2 rounded-full border-2 border-transparent border-t-blue-400 animate-spin animate-reverse'></div>
                    </div>
                    <h2 className='text-xl font-bold text-gray-900 mb-3'>Đang xử lý kết quả</h2>
                    <p className='text-gray-600'>Vui lòng chờ trong giây lát...</p>
                    <div className='flex justify-center space-x-1 mt-6'>
                        <div className='w-2 h-2 bg-blue-400 rounded-full animate-bounce'></div>
                        <div
                            className='w-2 h-2 bg-blue-400 rounded-full animate-bounce'
                            style={{ animationDelay: '0.1s' }}
                        ></div>
                        <div
                            className='w-2 h-2 bg-blue-400 rounded-full animate-bounce'
                            style={{ animationDelay: '0.2s' }}
                        ></div>
                    </div>
                </div>
            </div>
        )
    }

    if (!paymentData) {
        return (
            <div className='bg-gradient-to-br from-slate-50 via-red-50 to-rose-100 flex items-center justify-center p-4'>
                <div className='bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-12 max-w-md w-full text-center'>
                    <div className='w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6'>
                        <XCircle className='w-10 h-10 text-red-600' />
                    </div>
                    <h2 className='text-xl font-bold text-gray-900 mb-3'>Có lỗi xảy ra</h2>
                    <p className='text-gray-600 mb-8'>Không thể xử lý thông tin thanh toán</p>
                    <button
                        onClick={() => router.push('/')}
                        className='w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl'
                    >
                        Về trang chủ
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div>
            <div className='max-w-3xl mx-auto'>
                {/* Main Result Card */}
                <div className='rounded-[15px] overflow-hidden w-full shadow-[0_4px_16px_rgba(0,0,0,0.1)] bg-[var(--background-color-item)]'>
                    {/* Hero Section */}
                    <div className='relative px-8 py-10 text-center'>
                        {/* Background Pattern */}
                        <div className='absolute inset-0 opacity-5'>
                            <div className='absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full transform translate-x-16 -translate-y-16'></div>
                            <div className='absolute bottom-0 left-0 w-24 h-24 bg-purple-500 rounded-full transform -translate-x-12 translate-y-12'></div>
                        </div>

                        {/* Status Icon */}
                        <div className='relative mb-8'>
                            <div
                                className={`w-[85px] h-[85px] mx-auto rounded-full flex items-center justify-center ${
                                    paymentData.isSuccess
                                        ? 'bg-gradient-to-br from-emerald-100 to-emerald-200'
                                        : 'bg-gradient-to-br from-red-100 to-red-200'
                                } shadow-lg`}
                            >
                                {paymentData.isSuccess ? (
                                    <CheckCircle className='w-[45px] h-[45px] text-emerald-600' />
                                ) : (
                                    <XCircle className='w-[45px] h-[45px] text-red-600' />
                                )}
                            </div>
                            {paymentData.isSuccess && (
                                <div className='absolute inset-0 rounded-full border-4 border-emerald-200 animate-ping'></div>
                            )}
                        </div>

                        {/* VNPay Brand */}
                        <div className='flex items-center justify-center mb-6'>
                            <div className='bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl px-6 py-3 font-bold text-lg shadow-lg'>
                                VNPAY
                            </div>
                        </div>

                        {/* Status Title */}
                        <h1
                            className={`text-[26px] font-bold mb-4 ${
                                paymentData.isSuccess ? 'text-emerald-500' : 'text-red-500'
                            }`}
                        >
                            {paymentData.isSuccess ? 'Thanh toán thành công!' : 'Thanh toán thất bại'}
                        </h1>

                        {/* Status Message */}
                        <p className='text-gray-600 text-md max-w-2xl mx-auto leading-relaxed'>
                            {getStatusMessage(paymentData.responseCode)}
                        </p>

                        {/* Amount Display */}
                        {paymentData.amount && (
                            <div className='inline-block mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 shadow-sm'>
                                <div className='text-sm text-blue-600 mb-2 font-medium flex items-center justify-center'>
                                    <CreditCard className='w-6 h-6 mr-3' />
                                    Số tiền thanh toán
                                </div>
                                <div className='text-3xl font-bold text-blue-700'>{paymentData.amount} VNĐ</div>
                            </div>
                        )}
                    </div>

                    {/* Transaction Details */}
                    {(paymentData.orderId ||
                        paymentData.transactionNo ||
                        paymentData.bankCode ||
                        paymentData.payDate) && (
                        <div className='bg-gradient-to-r from-gray-50 to-blue-50 px-8 py-8 border-t border-gray-100'>
                            <h3 className='text-lg font-bold text-gray-900 mb-7 flex items-center'>
                                <Receipt className='w-5 h-5 mr-3 text-blue-600' />
                                Chi tiết giao dịch
                            </h3>

                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                {paymentData.orderId && (
                                    <div className='bg-white rounded-xl p-4 shadow-sm border border-gray-100'>
                                        <div className='flex items-center justify-between'>
                                            <div>
                                                <div className='text-sm text-gray-500 mb-1 font-medium'>
                                                    Mã đơn hàng
                                                </div>
                                                <div className='font-bold text-gray-900'>{paymentData.orderId}</div>
                                            </div>
                                            <div className='w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center'>
                                                <ShoppingBag className='w-5 h-5 text-blue-600' />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {paymentData.transactionNo && (
                                    <div className='bg-white rounded-xl p-4 shadow-sm border border-gray-100'>
                                        <div className='flex items-center justify-between'>
                                            <div>
                                                <div className='text-sm text-gray-500 mb-1 font-medium'>
                                                    Mã giao dịch
                                                </div>
                                                <div className='font-bold text-gray-900'>
                                                    {paymentData.transactionNo}
                                                </div>
                                            </div>
                                            <div className='w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center'>
                                                <Receipt className='w-5 h-5 text-purple-600' />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {paymentData.bankCode && (
                                    <div className='bg-white rounded-xl p-4 shadow-sm border border-gray-100'>
                                        <div className='flex items-center justify-between'>
                                            <div>
                                                <div className='text-sm text-gray-500 mb-1 font-medium'>Ngân hàng</div>
                                                <div className='font-bold text-gray-900'>{paymentData.bankCode}</div>
                                            </div>
                                            <div className='w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center'>
                                                <Building className='w-5 h-5 text-green-600' />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {paymentData.payDate && (
                                    <div className='bg-white rounded-xl p-4 shadow-sm border border-gray-100'>
                                        <div className='flex items-center justify-between'>
                                            <div>
                                                <div className='text-sm text-gray-500 mb-1 font-medium'>Thời gian</div>
                                                <div className='font-bold text-gray-900'>{paymentData.payDate}</div>
                                            </div>
                                            <div className='w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center'>
                                                <Calendar className='w-5 h-5 text-orange-600' />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className='p-8 bg-white'>
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-md mx-auto'>
                            <button
                                onClick={() => router.push('/user')}
                                className='group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform shadow-lg flex items-center justify-center space-x-3'
                            >
                                <Home className='w-5 h-5 transition-transform' />
                                <span>Về trang chủ</span>
                            </button>

                            <button
                                onClick={() => router.push('/user/orders')}
                                className='group bg-white hover:bg-blue-50 text-blue-600 px-6 py-3 rounded-xl font-semibold transform border border-blue-500 shadow-sm flex items-center justify-center space-x-3'
                            >
                                <ShoppingBag className='w-5 h-5 transition-transform' />
                                <span>Đơn hàng của tôi</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
