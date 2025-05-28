'use client'

import React from 'react'
import { Package, ShoppingCart, Grid3X3, Search, Home } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function EmptyState({
    title = 'Không tìm thấy dữ liệu',
    desc = 'Hiện tại chưa có thông tin nào được tìm thấy',
    type = 'default'
}) {
    // Chọn icon phù hợp dựa trên type
    const getIcon = () => {
        const iconProps = { size: 80, strokeWidth: 1.5 }

        switch (type) {
            case 'category':
                return <Grid3X3 {...iconProps} />
            case 'product':
                return <Package {...iconProps} />
            case 'cart':
                return <ShoppingCart {...iconProps} />
            case 'search':
                return <Search {...iconProps} />
            default:
                return <Package {...iconProps} />
        }
    }
    const router = useRouter()

    const onButtonClick = () => {
        router.push('/user')
    }

    return (
        <div className='flex max-w-7xl mx-auto flex-col items-center justify-center min-h-[400px] p-8 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-md border border-blue-200/50'>
            {/* Animated Icon Container */}
            <div className='relative mb-8'>
                <div className='absolute inset-0 bg-blue-500/20 rounded-full animate-ping'></div>
                <div className='relative bg-gradient-to-br from-blue-500 to-indigo-600 p-6 rounded-full shadow-xl'>
                    <div className='text-white'>{getIcon()}</div>
                </div>
            </div>

            {/* Content */}
            <div className='text-center max-w-md'>
                <h3 className='text-2xl font-bold text-gray-800 mb-3 tracking-tight'>{title}</h3>

                <p className='text-gray-600 mb-8 leading-relaxed'>{desc}</p>

                {/* Action Button */}
                <button
                    onClick={onButtonClick}
                    className='group relative inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300/50'
                >
                    <Home size={20} />
                    Về trang chủ
                    {/* Button shine effect */}
                    <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700'></div>
                </button>
            </div>

            {/* Decorative elements */}
            <div className='absolute top-4 right-4 w-16 h-16 bg-blue-300/30 rounded-full blur-xl'></div>
            <div className='absolute bottom-4 left-4 w-20 h-20 bg-indigo-300/30 rounded-full blur-xl'></div>
        </div>
    )
}
