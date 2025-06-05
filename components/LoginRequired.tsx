'use client'
import React from 'react'
import { Lock, Heart, FolderOpen, User, LogIn, ShoppingBag, FileText } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface LoginRequiredProps {
    type?: 'favorites' | 'projects' | 'profile' | 'orders' | 'quote' | 'general'
    customTitle?: string
    customDescription?: string
}

export default function LoginRequired(props: LoginRequiredProps) {
    const { type = 'general', customTitle, customDescription } = props
    const router = useRouter()

    const getContent = () => {
        switch (type) {
            case 'favorites':
                return {
                    icon: <Heart className='w-8 h-8 text-blue-600' />,
                    title: 'Xem danh sách yêu thích',
                    description: 'Đăng nhập để xem và quản lý các mục yêu thích của bạn'
                }
            case 'projects':
                return {
                    icon: <FolderOpen className='w-8 h-8 text-blue-600' />,
                    title: 'Xem dự án cá nhân',
                    description: 'Đăng nhập để truy cập và quản lý các dự án của bạn'
                }
            case 'profile':
                return {
                    icon: <User className='w-8 h-8 text-blue-600' />,
                    title: 'Xem thông tin cá nhân',
                    description: 'Đăng nhập để xem và chỉnh sửa thông tin tài khoản của bạn'
                }
            case 'orders':
                return {
                    icon: <ShoppingBag className='w-8 h-8 text-blue-600' />,
                    title: 'Xem đơn hàng của bạn',
                    description: 'Đăng nhập để theo dõi và quản lý các đơn hàng đã đặt'
                }
            case 'quote':
                return {
                    icon: <FileText className='w-8 h-8 text-blue-600' />,
                    title: 'Xem báo giá của bạn',
                    description: 'Đăng nhập để xem lại các báo giá đã yêu cầu và lưu trữ'
                }
            default:
                return {
                    icon: <Lock className='w-8 h-8 text-blue-600' />,
                    title: 'Yêu cầu đăng nhập',
                    description: 'Bạn cần đăng nhập để truy cập nội dung này'
                }
        }
    }

    const content = getContent()
    const finalTitle = customTitle || content.title
    const finalDescription = customDescription || content.description

    return (
        <div className='rounded-[15px] mx-auto overflow-hidden w-[55%] shadow-[0_4px_16px_rgba(0,0,0,0.1)] bg-white'>
            <div className='py-12 px-6 text-center'>
                <div className='mb-5 inline-flex p-4 bg-blue-50 rounded-full'>{content.icon}</div>
                <h3 className='text-xl font-medium text-gray-800 mb-3'>{finalTitle}</h3>
                <p className='text-gray-500 mx-auto mb-6 max-w-md'>{finalDescription}</p>
                <button
                    className='inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm'
                    onClick={() => router.push('/login')}
                >
                    <LogIn className='w-4 h-4' />
                    Đăng nhập ngay
                </button>
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
    )
}
