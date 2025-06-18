'use client'

import { MapPin, Phone, Mail } from 'lucide-react'
import { ReactNode, useEffect, useState } from 'react'
import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import TwitterIcon from '@mui/icons-material/Twitter'
import GitHubIcon from '@mui/icons-material/GitHub'
import UserHeader from './UserHeader'
import MainLoader from './MainLoader'
import { useGetCartCountQuery } from '@/services/CartService'
import { useGetFavoriteCountQuery } from '@/services/FavoriteService'
import { useDispatch, useSelector } from 'react-redux'
import { clearUser, setCartCount, setFavoriteCount } from '@/redux/slices/userSlice'
import { useAuthCheck } from '@/hooks/useAuthCheck'
import { cartSelector } from '@/redux/slices/cartSlice'
import ModernChatbot from './ModernChatbot'
import { usePathname } from 'next/navigation'

export default function MainLayout({ children }: { children: ReactNode }) {
    const { isAuthenticated, isAuthChecked } = useAuthCheck()
    const [isOpenChatbot, setIsOpenChatbot] = useState(false)

    const { data: cartCountResponse, isLoading: isCartCountLoading } = useGetCartCountQuery(undefined, {
        skip: !isAuthenticated
    })
    const { data: favoriteCountResponse, isLoading: isFavoriteCountLoading } = useGetFavoriteCountQuery(undefined, {
        skip: !isAuthenticated
    })

    const carts = useSelector(cartSelector)?.carts || []

    const pathname = usePathname()

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [pathname])

    const [showScrollTop, setShowScrollTop] = useState(false)
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY
            setShowScrollTop(scrollPosition > 300)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const dispatch = useDispatch()

    useEffect(() => {
        if (!isAuthenticated && isAuthChecked) {
            dispatch(clearUser())
        }
    }, [isAuthenticated, isAuthChecked, dispatch])

    useEffect(() => {
        if (favoriteCountResponse) {
            dispatch(setFavoriteCount(favoriteCountResponse.data))
        }
    }, [favoriteCountResponse])

    useEffect(() => {
        if (cartCountResponse) {
            dispatch(setCartCount(cartCountResponse.data))
        }
    }, [cartCountResponse])

    useEffect(() => {
        if (carts.length >= 0) {
            dispatch(setCartCount(carts.length))
        }
    }, [carts.length, dispatch])

    if (!isAuthChecked) return <MainLoader />

    if (isAuthenticated && (isCartCountLoading || isFavoriteCountLoading)) {
        return <MainLoader />
    }

    return (
        <div className='min-h-screen flex flex-col'>
            <UserHeader />

            {/* Main Content */}
            <main className='flex-grow mt-8' style={{ minHeight: 'calc(100vh - 180px)' }}>
                {children}

                {!isOpenChatbot && (
                    <div className='fixed right-6 bottom-6 z-50 flex flex-col gap-4'>
                        {/* Scroll to top button - Uses useState to track scroll position */}
                        {showScrollTop && (
                            <button
                                className='bg-gradient-to-r from-indigo-500 to-violet-500 text-white p-3 rounded-full shadow-[0_4px_20px_rgba(99,102,241,0.3)] hover:shadow-[0_6px_24px_rgba(99,102,241,0.4)] transition-all duration-300 group relative animate-fadeIn'
                                onClick={() => {
                                    window.scrollTo({ top: 0, behavior: 'smooth' })
                                }}
                                aria-label='Lên đầu trang'
                            >
                                <div className='absolute inset-0 rounded-full bg-gradient-to-r from-violet-400 to-indigo-400 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300 -z-10'></div>
                                <svg
                                    className='w-5 h-5'
                                    viewBox='0 0 24 24'
                                    fill='none'
                                    xmlns='http://www.w3.org/2000/svg'
                                >
                                    <path
                                        d='M12 19V5M12 5L5 12M12 5L19 12'
                                        stroke='currentColor'
                                        strokeWidth='2'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                    />
                                </svg>
                                <div className='absolute -left-3 transform -translate-x-full -translate-y-1/2 top-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 origin-right scale-90 group-hover:scale-100 pointer-events-none'>
                                    <div className='flex items-center'>
                                        <div className='bg-violet-100 text-violet-600 text-xs font-medium px-3 py-2 rounded-lg shadow-lg mr-2 whitespace-nowrap'>
                                            Lên đầu trang
                                            <div className='absolute w-2 h-2 bg-violet-500 top-1/2 -right-[6px] transform rotate-45 -translate-y-1/2'></div>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        )}

                        {/* Chatbot button */}
                        <button
                            onClick={() => setIsOpenChatbot(!isOpenChatbot)}
                            className='bg-gradient-to-r from-blue-600 to-blue-500 text-white p-3 rounded-full shadow-[0_4px_20px_rgba(59,130,246,0.3)] hover:shadow-[0_6px_24px_rgba(59,130,246,0.4)] transition-all duration-300 group relative'
                            aria-label='Chat với bot tư vấn'
                        >
                            <div className='absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300 -z-10'></div>
                            <div className='absolute -right-0.5 -top-0.5 w-3 h-3'>
                                <span className='absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping'></span>
                                <span className='relative inline-flex rounded-full h-3 w-3 bg-gradient-to-r from-red-500 to-pink-500'></span>
                            </div>
                            <svg className='w-5 h-5' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                <path
                                    d='M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22Z'
                                    stroke='currentColor'
                                    strokeWidth='2'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                />
                                <path d='M8 12H8.01' stroke='currentColor' strokeWidth='2' strokeLinecap='round' />
                                <path d='M12 12H12.01' stroke='currentColor' strokeWidth='2' strokeLinecap='round' />
                                <path d='M16 12H16.01' stroke='currentColor' strokeWidth='2' strokeLinecap='round' />
                            </svg>
                            <div className='absolute -left-3 transform -translate-x-full -translate-y-1/2 top-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 origin-right scale-90 group-hover:scale-100 pointer-events-none'>
                                <div className='flex items-center'>
                                    <div className='bg-blue-100 text-blue-600 text-xs font-medium px-3 py-2 rounded-lg shadow-lg mr-2 whitespace-nowrap'>
                                        Chat với chuyên viên
                                        <div className='absolute w-2 h-2 bg-blue-500 top-1/2 -right-[6px] transform rotate-45 -translate-y-1/2'></div>
                                    </div>
                                </div>
                            </div>
                        </button>

                        {/* Zalo button */}
                        <a
                            href='https://zalo.me/0833367548' // Thay bằng số Zalo của bạn
                            target='_blank'
                            rel='noopener noreferrer'
                            className='bg-[#028fe3] text-white p-1 flex items-center rounded-full shadow-[0_4px_20px_rgba(16,185,129,0.3)] hover:shadow-[0_6px_24px_rgba(16,185,129,0.4)] transition-all duration-300 group relative'
                            aria-label='Liên hệ qua Zalo'
                        >
                            <div className='absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300 -z-10'></div>

                            <img src='/images/zalo_icon.png' className='w-9 h-9 object-cover' />

                            <div className='absolute -left-3 transform -translate-x-full -translate-y-1/2 top-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 origin-right scale-90 group-hover:scale-100 pointer-events-none'>
                                <div className='flex items-center'>
                                    <div className='bg-cyan-50 text-blue-400 text-xs font-medium px-3 py-2 rounded-lg shadow-lg mr-2 whitespace-nowrap'>
                                        Chat Zalo
                                        <div className='absolute w-2 h-2 bg-blue-400 top-1/2 -right-[6px] transform rotate-45 -translate-y-1/2'></div>
                                    </div>
                                </div>
                            </div>
                        </a>

                        {/* Call button */}
                        <a
                            href='tel:0833367548'
                            className='bg-gradient-to-r from-green-500 to-emerald-400 text-white p-3 rounded-full shadow-[0_4px_20px_rgba(16,185,129,0.3)] hover:shadow-[0_6px_24px_rgba(16,185,129,0.4)] transition-all duration-300 group relative'
                            aria-label='Gọi điện tư vấn'
                        >
                            <div className='absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 to-green-400 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300 -z-10'></div>
                            <svg className='w-5 h-5' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                <path
                                    d='M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7294C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1468 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3147 6.72533 15.2662 5.18999 12.85C3.49997 10.2412 2.44824 7.27099 2.11999 4.18002C2.09494 3.90363 2.12781 3.62456 2.21643 3.3616C2.30506 3.09864 2.44756 2.85679 2.63476 2.65172C2.82196 2.44665 3.0498 2.28281 3.30379 2.17062C3.55777 2.05843 3.83233 2.00036 4.10999 2.00002H7.10999C7.5953 1.99538 8.06579 2.16723 8.43376 2.48363C8.80173 2.80003 9.04207 3.23864 9.10999 3.72002C9.2341 4.68008 9.47141 5.62274 9.81999 6.53002C9.94454 6.88805 9.97366 7.27598 9.90433 7.65126C9.83501 8.02654 9.67042 8.37278 9.41999 8.65002L8.20999 9.86002C9.6624 12.3392 11.6608 14.3376 14.14 15.79L15.35 14.58C15.6272 14.3296 15.9735 14.165 16.3487 14.0957C16.724 14.0263 17.1119 14.0555 17.47 14.18C18.3773 14.5286 19.3199 14.7659 20.28 14.89C20.7657 14.9585 21.2074 15.2032 21.5238 15.5775C21.8401 15.9518 22.0086 16.4296 22 16.92Z'
                                    stroke='currentColor'
                                    strokeWidth='2'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                />
                            </svg>
                            <div className='absolute -left-3 transform -translate-x-full -translate-y-1/2 top-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 origin-right scale-90 group-hover:scale-100 pointer-events-none'>
                                <div className='flex items-center'>
                                    <div className='bg-green-100 text-green-600 text-xs font-medium px-3 py-2 rounded-lg shadow-lg mr-2 whitespace-nowrap'>
                                        0833 367 548
                                        <div className='absolute w-2 h-2 bg-green-500 top-1/2 -right-[6px] transform rotate-45 -translate-y-1/2'></div>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>
                )}

                <style jsx global>{`
                    @keyframes fadeIn {
                        from {
                            opacity: 0;
                            transform: translateY(20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    .animate-fadeIn {
                        animation: fadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                    }
                    @keyframes ping {
                        75%,
                        100% {
                            transform: scale(1.5);
                            opacity: 0;
                        }
                    }
                    .animate-ping {
                        animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
                    }
                `}</style>

                <ModernChatbot isOpen={isOpenChatbot} onClose={() => setIsOpenChatbot(false)} />
            </main>

            {/* Footer */}
            <footer className='bg-white text-gray-800 border-t-[3px] border-t-[#3675ff] pt-12 mt-8 pb-8'>
                <div className='container max-w-7xl mx-auto sm:px-6 lg:px-8 px-4'>
                    <div className='flex justify-between'>
                        <div className='mr-0 w-[350px]'>
                            <h1 className='text-2xl w-fit font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                                SHOPFINITY
                            </h1>

                            <p className='text-gray-700 mb-6'>
                                Nhà cung cấp thiết bị điện tử và giải pháp tự động hóa hàng đầu Việt Nam. Chúng tôi mang
                                đến những sản phẩm chất lượng cao và dịch vụ hoàn hảo.
                            </p>
                            <div className='flex space-x-4'>
                                <a
                                    href='#'
                                    className='bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors w-[40px] h-[40px] flex items-center justify-center rounded-full'
                                >
                                    <FacebookIcon
                                        sx={{
                                            maxWidth: 24,
                                            maxHeight: 24
                                        }}
                                    />
                                </a>
                                <a
                                    href='#'
                                    className='bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors w-[40px] h-[40px] flex items-center justify-center rounded-full'
                                >
                                    <TwitterIcon
                                        sx={{
                                            maxWidth: 24,
                                            maxHeight: 24
                                        }}
                                    />
                                </a>
                                <a
                                    href='#'
                                    className='bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors w-[40px] h-[40px] flex items-center justify-center rounded-full'
                                >
                                    <InstagramIcon
                                        sx={{
                                            maxWidth: 24,
                                            maxHeight: 24
                                        }}
                                    />
                                </a>
                                <a
                                    href='#'
                                    className='bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors w-[40px] h-[40px] flex items-center justify-center rounded-full'
                                >
                                    <GitHubIcon
                                        sx={{
                                            maxWidth: 24,
                                            maxHeight: 24
                                        }}
                                    />
                                </a>
                            </div>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-3 mb-12'>
                            <div>
                                <h3 className='text-lg font-semibold mb-6'>Liên kết nhanh</h3>
                                <ul className='space-y-3'>
                                    <li>
                                        <a href='#' className='text-gray-700 hover:text-[#3675FF] transition-colors'>
                                            Trang chủ
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href='#intro'
                                            className='text-gray-700 hover:text-[#3675FF] transition-colors'
                                        >
                                            Về chúng tôi
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href='#product'
                                            className='text-gray-700 hover:text-[#3675FF] transition-colors'
                                        >
                                            Sản phẩm
                                        </a>
                                    </li>
                                    {/* <li>
                                    <a href='#' className='text-gray-700 hover:text-[#3675FF] transition-colors'>
                                        Dịch vụ
                                    </a>
                                </li> */}
                                    <li>
                                        <a
                                            href='#blog'
                                            className='text-gray-700 hover:text-[#3675FF] transition-colors'
                                        >
                                            Tin tức
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href='#contact'
                                            className='text-gray-700 hover:text-[#3675FF] transition-colors'
                                        >
                                            Liên hệ
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h3 className='text-lg font-semibold mb-6'>Danh mục sản phẩm</h3>
                                <ul className='space-y-3'>
                                    <li>
                                        <a href='#' className='text-gray-700 hover:text-[#3675FF] transition-colors'>
                                            Thiết bị thông minh
                                        </a>
                                    </li>
                                    <li>
                                        <a href='#' className='text-gray-700 hover:text-[#3675FF] transition-colors'>
                                            Thiết bị điện tử
                                        </a>
                                    </li>
                                    <li>
                                        <a href='#' className='text-gray-700 hover:text-[#3675FF] transition-colors'>
                                            Giải pháp tự động
                                        </a>
                                    </li>
                                    <li>
                                        <a href='#' className='text-gray-700 hover:text-[#3675FF] transition-colors'>
                                            An ninh thông minh
                                        </a>
                                    </li>
                                    <li>
                                        <a href='#' className='text-gray-700 hover:text-[#3675FF] transition-colors'>
                                            Phụ kiện
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h3 className='text-lg font-semibold mb-6'>Thông tin liên hệ</h3>
                                <ul className='space-y-4'>
                                    <li className='flex items-start space-x-4'>
                                        <MapPin size={20} className='text-[#3675FF] flex-shrink-0 mt-1' />
                                        <span className='text-gray-700 max-w-[220px]'>
                                            111A/1, đường số 38, Hiệp Bình Chánh, Thủ Đức, TP.HCM
                                        </span>
                                    </li>
                                    <li className='flex items-center space-x-4'>
                                        <Phone size={20} className='text-[#3675FF] flex-shrink-0' />
                                        <span className='text-gray-700'>0123 456 789</span>
                                    </li>
                                    <li className='flex items-center space-x-4'>
                                        <Mail size={20} className='text-[#3675FF] flex-shrink-0' />
                                        <span className='text-gray-700'>info@shopfinity.com</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className='pt-8 border-t border-gray-200 text-center text-gray-700'>
                        <p>&copy; 2025 SHOPFINITY E-COMMERCE. Tất cả quyền được bảo lưu.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
