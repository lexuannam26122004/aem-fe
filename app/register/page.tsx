'use client'

import React, { useState } from 'react'
import { Eye, EyeOff, Lock, Mail, User2, PhoneCall, House, ArrowRight, Loader2, CalendarDays } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCreateUserMutation } from '@/services/UserService'
import { useToast } from '@/hooks/useToast'

const RegisterPage = () => {
    const [showPassword, setShowPassword] = useState(false)
    // const [isSubmit, setIsSubmit] = useState(false)
    const router = useRouter()
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        username: '',
        password: '',
        title: '',
        birthday: '',
        address: '',
        district: '',
        city: '',
        agreeTerms: false
    })
    const [formErrors, setFormErrors] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        username: '',
        password: '',
        birthday: '',
        address: '',
        district: '',
        city: '',
        agreeTerms: ''
    })
    const toast = useToast()

    const [register, { isLoading }] = useCreateUserMutation()

    const handleInputChange = e => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))

        // Clear error when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }))
        }
    }

    const validateForm = () => {
        const errors: typeof formErrors = {
            fullName: '',
            email: '',
            phoneNumber: '',
            birthday: '',
            username: '',
            password: '',
            address: '',
            district: '',
            city: '',
            agreeTerms: ''
        }

        if (!formData.fullName.trim()) {
            errors.fullName = 'Vui lòng nhập họ tên'
        }

        if (!formData.email.trim()) {
            errors.email = 'Vui lòng nhập email'
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email không hợp lệ'
        }

        if (!formData.phoneNumber.trim()) {
            errors.phoneNumber = 'Vui lòng nhập số điện thoại'
        } else if (!/^\d{10,11}$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
            errors.phoneNumber = 'Số điện thoại không hợp lệ'
        }

        if (!formData.username.trim()) {
            errors.username = 'Vui lòng nhập tên đăng nhập'
        } else if (formData.username.length < 3) {
            errors.username = 'Tên đăng nhập phải có ít nhất 3 ký tự'
        }

        if (!formData.password.trim()) {
            errors.password = 'Vui lòng nhập mật khẩu'
        } else if (formData.password.length < 6) {
            errors.password = 'Mật khẩu phải có ít nhất 6 ký tự'
        }

        if (!formData.address.trim()) {
            errors.address = 'Vui lòng nhập địa chỉ'
        }

        if (!formData.birthday.trim()) {
            errors.address = 'Vui lòng chọn ngày sinh'
        } else if (new Date(formData.birthday) > new Date()) {
            errors.birthday = 'Ngày sinh không hợp lệ'
        }

        if (!formData.district.trim()) {
            errors.district = 'Vui lòng nhập quận/huyện'
        }

        if (!formData.city.trim()) {
            errors.city = 'Vui lòng nhập thành phố'
        }

        if (!formData.agreeTerms) {
            errors.agreeTerms = 'Vui lòng đồng ý với điều khoản dịch vụ'
        }

        setFormErrors(errors)
        return Object.values(errors).every(error => error === '')
    }

    const handleSubmit = async e => {
        e.preventDefault()
        // setIsSubmit(true)

        if (!validateForm()) {
            return
        }
        register(formData)
            .unwrap()
            .then(() => {
                toast('Đăng ký thành công! Hãy đăng nhập để tiếp tục.', 'success')
                router.push('/login')
            })
            .catch(error => {
                toast(error?.data?.detail, 'error')
                console.error('Registration failed:', error)
            })
        // setIsSubmit(false)
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-8'>
            {/* Floating shapes for decoration */}
            <div className='absolute top-10 left-10 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse'></div>
            <div
                className='absolute top-32 right-20 w-24 h-24 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse'
                style={{ animationDelay: '2s' }}
            ></div>
            <div
                className='absolute bottom-20 left-32 w-28 h-28 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse'
                style={{ animationDelay: '4s' }}
            ></div>

            <div className='w-full max-w-4xl'>
                {/* Main Register Card */}
                <div className='bg-white rounded-[20px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden backdrop-blur-sm border border-white/20'>
                    {/* Header with gradient */}
                    <div className='relative bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-center'>
                        <div className='absolute inset-0 bg-gradient-to-r from-blue-600/90 to-indigo-600/90'></div>
                        <div className='relative z-10'>
                            <div className='w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm'>
                                <img
                                    src='https://assets.minimals.cc/public/assets/icons/platforms/ic-jwt.svg'
                                    className='w-16 h-16 animate-spin-slow'
                                />
                            </div>
                            <h1 className='text-2xl font-bold text-white mb-2'>Tạo tài khoản mới</h1>
                            <p className='text-blue-100'>Đăng ký để bắt đầu trải nghiệm</p>
                        </div>

                        {/* Decorative wave */}
                        <div className='absolute bottom-0 left-0 right-0'>
                            <svg viewBox='0 0 1000 100' className='w-full h-8 fill-white'>
                                <defs>
                                    <linearGradient id='waveGradient' x1='0%' y1='0%' x2='100%' y2='0%'>
                                        <stop offset='0%' stopColor='#ffffff' stopOpacity='0.8' />
                                        <stop offset='50%' stopColor='#ffffff' stopOpacity='1' />
                                        <stop offset='100%' stopColor='#ffffff' stopOpacity='0.8' />
                                    </linearGradient>
                                </defs>
                                <path
                                    d='M0,50 C150,100 350,0 500,50 C650,100 850,0 1000,50 L1000,100 L0,100 Z'
                                    fill='url(#waveGradient)'
                                ></path>
                            </svg>
                        </div>
                    </div>

                    {/* Form Content */}
                    <div className='px-8 py-6'>
                        <div className='flex items-center justify-center mb-6'>
                            <span className='text-2xl font-bold mx-auto bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                                SHOPFINITY
                            </span>
                        </div>

                        <form onSubmit={handleSubmit} className='space-y-6'>
                            {/* Personal Information Section */}
                            <div className='bg-gray-50 rounded-lg p-6'>
                                <h3 className='text-lg font-semibold text-gray-800 mb-4'>Thông tin cá nhân</h3>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                    {/* Full Name */}
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                                            Họ và tên *
                                        </label>
                                        <div className='relative'>
                                            <input
                                                type='text'
                                                name='fullName'
                                                value={formData.fullName}
                                                onChange={handleInputChange}
                                                className={`w-full border ${
                                                    formErrors.fullName ? 'border-red-500' : 'border-gray-300'
                                                } rounded-lg pl-4 pr-10 py-3 focus:ring-blue-500 focus:border-blue-500 outline-none`}
                                                placeholder='Nhập họ và tên'
                                            />
                                            <User2 className='w-5 h-5 text-blue-600 absolute right-3 top-1/2 transform -translate-y-1/2' />
                                        </div>
                                        {formErrors.fullName && (
                                            <p className='mt-1 text-sm text-red-600'>{formErrors.fullName}</p>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-1'>Email *</label>
                                        <div className='relative'>
                                            <input
                                                name='email'
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className={`w-full border ${
                                                    formErrors.email ? 'border-red-500' : 'border-gray-300'
                                                } rounded-lg pl-4 pr-10 py-3 focus:ring-blue-500 focus:border-blue-500 outline-none`}
                                                placeholder='example@email.com'
                                            />
                                            <Mail className='w-5 h-5 text-blue-600 absolute right-3 top-1/2 transform -translate-y-1/2' />
                                        </div>
                                        {formErrors.email && (
                                            <p className='mt-1 text-sm text-red-600'>{formErrors.email}</p>
                                        )}
                                    </div>

                                    {/* Phone Number */}
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                                            Số điện thoại *
                                        </label>
                                        <div className='relative'>
                                            <input
                                                type='tel'
                                                name='phoneNumber'
                                                value={formData.phoneNumber}
                                                onChange={handleInputChange}
                                                className={`w-full border ${
                                                    formErrors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                                                } rounded-lg pl-4 pr-10 py-3 focus:ring-blue-500 focus:border-blue-500 outline-none`}
                                                placeholder='0123456789'
                                            />
                                            <PhoneCall className='w-5 h-5 text-blue-600 absolute right-3 top-1/2 transform -translate-y-1/2' />
                                        </div>
                                        {formErrors.phoneNumber && (
                                            <p className='mt-1 text-sm text-red-600'>{formErrors.phoneNumber}</p>
                                        )}
                                    </div>

                                    {/* Phone Number */}
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                                            Ngày sinh *
                                        </label>
                                        <div className='relative'>
                                            <input
                                                type='date'
                                                name='birthday'
                                                value={formData.birthday}
                                                onChange={handleInputChange}
                                                className={`w-full border ${
                                                    formErrors.birthday ? 'border-red-500' : 'border-gray-300'
                                                } rounded-lg pl-4 pr-10 py-3 focus:ring-blue-500 focus:border-blue-500 outline-none`}
                                                placeholder='0123456789'
                                            />
                                            <CalendarDays className='w-5 h-5 text-blue-600 absolute right-3 top-1/2 transform -translate-y-1/2' />
                                        </div>
                                        {formErrors.birthday && (
                                            <p className='mt-1 text-sm text-red-600'>{formErrors.birthday}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Account Information Section */}
                            <div className='bg-gray-50 rounded-lg p-6'>
                                <h3 className='text-lg font-semibold text-gray-800 mb-4'>Thông tin tài khoản</h3>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                    {/* Username */}
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                                            Tên đăng nhập *
                                        </label>
                                        <div className='relative'>
                                            <input
                                                type='text'
                                                name='username'
                                                value={formData.username}
                                                onChange={handleInputChange}
                                                className={`w-full border ${
                                                    formErrors.username ? 'border-red-500' : 'border-gray-300'
                                                } rounded-lg pl-4 pr-10 py-3 focus:ring-blue-500 focus:border-blue-500 outline-none`}
                                                placeholder='Nhập tên đăng nhập'
                                            />
                                            <User2 className='w-5 h-5 text-blue-600 absolute right-3 top-1/2 transform -translate-y-1/2' />
                                        </div>
                                        {formErrors.username && (
                                            <p className='mt-1 text-sm text-red-600'>{formErrors.username}</p>
                                        )}
                                    </div>

                                    {/* Password */}
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                                            Mật khẩu *
                                        </label>
                                        <div className='relative'>
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                name='password'
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                className={`w-full border ${
                                                    formErrors.password ? 'border-red-500' : 'border-gray-300'
                                                } rounded-lg pl-10 pr-12 py-3 focus:ring-blue-500 focus:border-blue-500 outline-none`}
                                                placeholder='Nhập mật khẩu'
                                            />
                                            <Lock className='w-5 h-5 text-blue-600 absolute left-3 top-1/2 transform -translate-y-1/2' />
                                            <button
                                                type='button'
                                                onClick={() => setShowPassword(!showPassword)}
                                                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                        {formErrors.password && (
                                            <p className='mt-1 text-sm text-red-600'>{formErrors.password}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Address Information Section */}
                            <div className='bg-gray-50 rounded-lg p-6'>
                                <h3 className='text-lg font-semibold text-gray-800 mb-4'>Thông tin địa chỉ</h3>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                    {/* Title */}
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                                            Tiêu đề địa chỉ
                                        </label>
                                        <input
                                            type='text'
                                            name='title'
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            className='w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none'
                                            placeholder='Ví dụ: Nhà riêng, văn phòng...'
                                        />
                                    </div>

                                    {/* Address */}
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                                            Địa chỉ *
                                        </label>
                                        <div className='relative'>
                                            <input
                                                type='text'
                                                name='address'
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                className={`w-full border ${
                                                    formErrors.address ? 'border-red-500' : 'border-gray-300'
                                                } rounded-lg pl-4 pr-10 py-3 focus:ring-blue-500 focus:border-blue-500 outline-none`}
                                                placeholder='Nhập địa chỉ chi tiết'
                                            />
                                            <House className='w-5 h-5 text-blue-600 absolute right-3 top-1/2 transform -translate-y-1/2' />
                                        </div>
                                        {formErrors.address && (
                                            <p className='mt-1 text-sm text-red-600'>{formErrors.address}</p>
                                        )}
                                    </div>

                                    {/* District */}
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                                            Quận/Huyện *
                                        </label>
                                        <input
                                            type='text'
                                            name='district'
                                            value={formData.district}
                                            onChange={handleInputChange}
                                            className={`w-full border ${
                                                formErrors.district ? 'border-red-500' : 'border-gray-300'
                                            } rounded-lg px-4 py-3 focus:ring-blue-500 focus:border-blue-500 outline-none`}
                                            placeholder='Nhập quận/huyện'
                                        />
                                        {formErrors.district && (
                                            <p className='mt-1 text-sm text-red-600'>{formErrors.district}</p>
                                        )}
                                    </div>

                                    {/* City */}
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                                            Thành phố *
                                        </label>
                                        <input
                                            type='text'
                                            name='city'
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className={`w-full border ${
                                                formErrors.city ? 'border-red-500' : 'border-gray-300'
                                            } rounded-lg px-4 py-3 focus:ring-blue-500 focus:border-blue-500 outline-none`}
                                            placeholder='Nhập thành phố'
                                        />
                                        {formErrors.city && (
                                            <p className='mt-1 text-sm text-red-600'>{formErrors.city}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Terms Agreement */}
                            <div className='flex items-start'>
                                <input
                                    type='checkbox'
                                    name='agreeTerms'
                                    checked={formData.agreeTerms}
                                    onChange={handleInputChange}
                                    className='w-4 h-4 rounded border-gray-300 cursor-pointer accent-blue-600 mt-1'
                                />
                                <div className='ml-3'>
                                    <label className='text-sm text-gray-600'>
                                        Tôi đồng ý với{' '}
                                        <button type='button' className='text-blue-600 hover:underline font-medium'>
                                            Điều khoản dịch vụ
                                        </button>{' '}
                                        và{' '}
                                        <button type='button' className='text-blue-600 hover:underline font-medium'>
                                            Chính sách bảo mật
                                        </button>
                                    </label>
                                    {formErrors.agreeTerms && (
                                        <p className='mt-1 text-sm text-red-600'>{formErrors.agreeTerms}</p>
                                    )}
                                </div>
                            </div>

                            {/* Register Button */}
                            <button
                                type='submit'
                                disabled={isLoading}
                                className='w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center group disabled:opacity-70 disabled:cursor-not-allowed'
                            >
                                <div className='flex items-center'>
                                    Đăng ký tài khoản
                                    {isLoading ? (
                                        <Loader2 className='ml-2 animate-spin' size={18} />
                                    ) : (
                                        <ArrowRight
                                            size={18}
                                            className='ml-2 group-hover:translate-x-1 transition-transform'
                                        />
                                    )}
                                </div>
                            </button>
                        </form>

                        {/* Login Link */}
                        <div className='mt-6 text-center'>
                            <p className='text-sm text-gray-600'>
                                Đã có tài khoản?{' '}
                                <button
                                    onClick={() => router.push('/login')}
                                    className='text-blue-600 hover:text-blue-700 font-medium'
                                >
                                    Đăng nhập ngay
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage
