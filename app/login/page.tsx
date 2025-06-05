'use client'

import React, { useEffect, useState } from 'react'
import { Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react'
import { useToast } from '@/hooks/useToast'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { clearUserInfo, setUserInfo } from '@/redux/slices/userSlice'

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [isSubmit, setIsSubmit] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    })
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast()
    const dispatch = useDispatch()

    useEffect(() => {
        sessionStorage.removeItem('auth_token')
        dispatch(clearUserInfo())
    }, [])

    const handleInputChange = e => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmit(true)

        if (formData.email === '' || formData.password === '') {
            return
        }

        setIsLoading(true)

        const loginData = {
            email: formData.email,
            password: formData.password
        }

        try {
            const response = await fetch('https://localhost:44381/api/user/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json-patch+json'
                },
                body: JSON.stringify(loginData)
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Đăng nhập thất bại')
            }

            const token = data?.data?.auth_token
            if (!token) {
                throw new Error('Token không tồn tại trong phản hồi')
            }

            sessionStorage.setItem('auth_token', token)

            // Gọi API getMe trực tiếp bằng fetch
            const meResponse = await fetch('https://localhost:44381/api/user/auth/me', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const meData = await meResponse.json()

            if (!meResponse.ok) {
                throw new Error('Lấy thông tin người dùng thất bại')
            }
            dispatch(setUserInfo(meData.data))

            toast('Đăng nhập thành công!', 'success')
            router.push('/user')
        } catch (error: any) {
            toast(error.message || 'Có lỗi xảy ra', 'error')
            console.error('Login error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4'>
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

            <div className='w-full max-w-md'>
                {/* Main Login Card */}
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
                            <h1 className='text-2xl font-bold text-white mb-2'>Chào mừng trở lại!</h1>
                            <p className='text-blue-100'>Đăng nhập để tiếp tục trải nghiệm</p>
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
                        <div>
                            <div className='flex items-center justify-center mb-4'>
                                <span className='text-2xl font-bold mx-auto bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                                    SHOPFINITY
                                </span>
                            </div>

                            <div className='space-y-6'>
                                {/* Email Field */}
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        Tên đăng nhập / Email
                                    </label>
                                    <div className='relative'>
                                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                            <Mail
                                                size={18}
                                                className={`${
                                                    isSubmit && !formData.email ? 'text-red-500' : 'text-gray-400'
                                                }`}
                                            />
                                        </div>
                                        <input
                                            type='email'
                                            name='email'
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className={`w-full pl-10 pr-4 py-3 border rounded-lg bg-gray-50 outline-none
                                                            ${
                                                                isSubmit && !formData.email
                                                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                                                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                                            }`}
                                            placeholder='example@email.com'
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>Mật khẩu</label>
                                    <div className='relative'>
                                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                            <Lock
                                                size={18}
                                                className={`${
                                                    isSubmit && !formData.password ? 'text-red-500' : 'text-gray-400'
                                                }`}
                                            />
                                        </div>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name='password'
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            className={`w-full pl-10 pr-4 py-3 border rounded-lg bg-gray-50 outline-none
                                                            ${
                                                                isSubmit && !formData.password
                                                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                                                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                                            }`}
                                            placeholder='Nhập mật khẩu'
                                            required
                                        />
                                        <button
                                            type='button'
                                            onClick={() => setShowPassword(!showPassword)}
                                            className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors'
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Remember Me & Forgot Password */}
                                <div className='flex items-center justify-between'>
                                    <label className='flex items-center'>
                                        <input
                                            type='checkbox'
                                            name='rememberMe'
                                            checked={formData.rememberMe}
                                            onChange={handleInputChange}
                                            className='w-4 h-4 rounded-[10px] border-[#d1e0ff] accent-[#3675ff] rounded focus:ring-red-500'
                                        />
                                        <span className='ml-2 text-sm text-gray-600'>Ghi nhớ đăng nhập</span>
                                    </label>
                                    <button
                                        type='button'
                                        className='text-sm text-blue-600 hover:text-blue-700 font-medium'
                                    >
                                        Quên mật khẩu?
                                    </button>
                                </div>

                                {/* Login Button */}
                                <button
                                    type='button'
                                    onClick={handleSubmit}
                                    disabled={isLoading}
                                    className='w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center group disabled:opacity-70 disabled:cursor-not-allowed'
                                >
                                    {isLoading ? (
                                        <div className='flex items-center'>
                                            <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2'></div>
                                            Đang đăng nhập...
                                        </div>
                                    ) : (
                                        <div className='flex items-center'>
                                            Đăng nhập
                                            <ArrowRight
                                                size={18}
                                                className='ml-2 group-hover:translate-x-1 transition-transform'
                                            />
                                        </div>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Divider */}
                        {/* <div className='my-6 flex items-center'>
                            <div className='flex-1 border-t border-gray-300'></div>
                            <span className='px-4 text-sm text-gray-500 bg-white'>hoặc</span>
                            <div className='flex-1 border-t border-gray-300'></div>
                        </div> */}

                        {/* Social Login */}
                        {/* <div className='grid grid-cols-2 gap-3'>
                            <button className='flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors'>
                                <svg className='w-5 h-5 mr-2' viewBox='0 0 24 24'>
                                    <path
                                        fill='#4285F4'
                                        d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                                    />
                                    <path
                                        fill='#34A853'
                                        d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                                    />
                                    <path
                                        fill='#FBBC05'
                                        d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                                    />
                                    <path
                                        fill='#EA4335'
                                        d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                                    />
                                </svg>
                                Google
                            </button>
                            <button className='flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors'>
                                <svg className='w-5 h-5 mr-2' fill='#1877F2' viewBox='0 0 24 24'>
                                    <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' />
                                </svg>
                                Facebook
                            </button>
                        </div> */}

                        {/* Sign Up Link */}
                        <div className='mt-6 text-center'>
                            <p className='text-sm text-gray-600'>
                                Chưa có tài khoản?{' '}
                                <button
                                    onClick={() => router.push('/register')}
                                    className='text-blue-600 ml-1 hover:text-blue-700 font-medium'
                                >
                                    Đăng ký ngay
                                </button>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className='text-center mt-6'>
                    <p className='text-sm text-gray-500'>
                        Bằng việc đăng nhập, bạn đồng ý với{' '}
                        <button className='text-blue-600 hover:underline'>Điều khoản dịch vụ</button> và{' '}
                        <button className='text-blue-600 hover:underline'>Chính sách bảo mật</button>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
