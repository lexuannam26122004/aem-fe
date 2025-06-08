'use client'

import { Home, XCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Page() {
    const router = useRouter()
    return (
        <div className='max-w-3xl py-12 mx-auto'>
            {/* Main Result Card */}
            <div className='rounded-[15px] relative px-8 py-10 text-center overflow-hidden w-full shadow-[0_4px_16px_rgba(0,0,0,0.1)] bg-[var(--background-color-item)]'>
                <div
                    className={`w-[85px] h-[85px] relative mb-6 mx-auto rounded-full flex items-center justify-center bg-gradient-to-br from-red-100 to-red-200 shadow-lg`}
                >
                    <XCircle className='w-[45px] h-[45px] text-red-600' />
                </div>
                <h2 className='text-[22px] font-bold mb-4 text-black'>Có lỗi xảy ra</h2>
                <p className='text-gray-600 mb-8'>Không thể xử lý thông tin thanh toán</p>
                <button
                    onClick={() => router.push('/user')}
                    className='group bg-gradient-to-r mx-auto from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform shadow-lg flex items-center justify-center space-x-3'
                >
                    <Home className='w-5 h-5 transition-transform' />
                    <span>Về trang chủ</span>
                </button>
            </div>
        </div>
    )
}
