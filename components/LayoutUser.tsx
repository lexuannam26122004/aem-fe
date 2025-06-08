'use client'

import { MapPin, Phone, Mail } from 'lucide-react'
import { ReactNode, useEffect } from 'react'
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

export default function MainLayout({ children }: { children: ReactNode }) {
    const { isAuthenticated, isAuthChecked } = useAuthCheck()

    const { data: cartCountResponse, isLoading: isCartCountLoading } = useGetCartCountQuery(undefined, {
        skip: !isAuthenticated
    })
    const { data: favoriteCountResponse, isLoading: isFavoriteCountLoading } = useGetFavoriteCountQuery(undefined, {
        skip: !isAuthenticated
    })
    const carts = useSelector(cartSelector)?.carts || []

    const dispatch = useDispatch()

    useEffect(() => {
        if (!isAuthenticated && isAuthChecked) {
            dispatch(clearUser())
        }
    }, [isAuthenticated, isAuthChecked, dispatch])

    useEffect(() => {
        if (cartCountResponse) {
            dispatch(setCartCount(cartCountResponse.data))
        }
    }, [cartCountResponse])

    useEffect(() => {
        if (carts.length > 0) {
            dispatch(setCartCount(carts.length))
        }
    }, [carts.length, dispatch])

    useEffect(() => {
        if (favoriteCountResponse) {
            dispatch(setFavoriteCount(favoriteCountResponse.data))
        }
    }, [favoriteCountResponse])

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
