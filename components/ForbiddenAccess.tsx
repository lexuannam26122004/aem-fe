'use client'
import React from 'react'
import { Shield, Heart, FolderOpen, User, ShoppingBag, FileText, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface AccessDeniedProps {
    type?: 'favorites' | 'projects' | 'profile' | 'orders' | 'quote' | 'general'
    customTitle?: string
    customDescription?: string
}

export default function AccessDenied(props: AccessDeniedProps) {
    const { type = 'general', customTitle, customDescription } = props
    const router = useRouter()

    const getContent = () => {
        switch (type) {
            case 'favorites':
                return {
                    icon: <Heart className='w-8 h-8 text-amber-600' />,
                    title: 'Không thể truy cập danh sách yêu thích',
                    description:
                        'Bạn không có quyền xem danh sách yêu thích này. Vui lòng liên hệ quản trị viên nếu bạn cho rằng đây là lỗi.'
                }
            case 'projects':
                return {
                    icon: <FolderOpen className='w-8 h-8 text-amber-600' />,
                    title: 'Không thể truy cập dự án',
                    description:
                        'Bạn không có quyền xem danh sách dự án này. Vui lòng liên hệ quản trị viên nếu bạn cho rằng đây là lỗi.'
                }
            case 'profile':
                return {
                    icon: <User className='w-8 h-8 text-amber-600' />,
                    title: 'Không thể xem thông tin cá nhân',
                    description:
                        'Bạn không có quyền xem thông tin cá nhân của người dùng khác. Chỉ có thể xem thông tin của chính mình.'
                }
            case 'orders':
                return {
                    icon: <ShoppingBag className='w-8 h-8 text-red-600' />,
                    title: 'Không thể truy cập đơn hàng',
                    description: 'Bạn không có quyền xem đơn hàng này. Chỉ có thể xem các đơn hàng của chính mình.'
                }
            case 'quote':
                return {
                    icon: <FileText className='w-8 h-8 text-amber-600' />,
                    title: 'Không thể truy cập báo giá',
                    description: 'Bạn không có quyền xem báo giá này. Chỉ có thể xem các báo giá của bạn.'
                }
            default:
                return {
                    icon: <Shield className='w-8 h-8 text-red-600' />,
                    title: 'Truy cập bị cấm',
                    description:
                        'Bạn không có quyền truy cập vào nội dung này. Vui lòng kiểm tra lại quyền hạn hoặc liên hệ quản trị viên.'
                }
        }
    }

    const content = getContent()
    const finalTitle = customTitle || content.title
    const finalDescription = customDescription || content.description

    const styles = {
        bgColor: 'bg-red-50',
        borderColor: 'border-red-100',
        iconColor: 'text-red-600',
        titleColor: 'text-red-700',
        buttonBg: 'bg-red-600 hover:bg-red-700'
    }

    return (
        <div
            className={`rounded-[15px] mt-12 mx-auto overflow-hidden w-[55%] shadow-[0_4px_16px_rgba(0,0,0,0.1)] bg-white border ${styles.borderColor}`}
        >
            <div className='py-12 px-6 text-center'>
                <div className={`mb-5 inline-flex p-4 ${styles.bgColor} rounded-full`}>
                    {React.cloneElement(content.icon, { className: `w-8 h-8 ${styles.iconColor}` })}
                </div>
                <h3 className={`text-xl font-medium ${styles.titleColor} mb-4`}>{finalTitle}</h3>
                <p className='text-gray-600 mx-auto mb-6 max-w-lg'>{finalDescription}</p>

                <div className='flex flex-col sm:flex-row gap-6 justify-center items-center'>
                    <button
                        className={`inline-flex items-center gap-2 px-6 py-3 ${styles.buttonBg} text-white font-medium rounded-lg transition-colors duration-200 shadow-sm`}
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className='w-4 h-4' />
                        Quay lại
                    </button>
                    <button
                        className='inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200'
                        onClick={() => router.push('/user')}
                    >
                        Về trang chủ
                    </button>
                </div>

                <div className='mt-6 text-center'>
                    <p className='text-sm text-gray-600'>
                        Cần hỗ trợ?{' '}
                        <button
                            onClick={() => router.push('/#contact')}
                            className={`${styles.iconColor} ml-1 hover:underline font-medium`}
                        >
                            Liên hệ quản trị viên
                        </button>
                    </p>
                </div>
            </div>
        </div>
    )
}
