import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, User, Heart, ShoppingCart, Menu, X, ChevronDown, Phone, Mail, MapPin, Bell, LogIn } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelector } from 'react-redux'
import { userSelector } from '@/redux/slices/userSlice'
import UserAvatarMenu from './UserAvatarMenu'
import { usePathname } from 'next/navigation'

const Logo = () => {
    return (
        <div>
            <span className='text-2xl w-fit font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                SHOPFINITY
            </span>
        </div>
    )
}

const categories = [
    { name: 'Điện thoại & Máy tính bảng', href: '/category/phones-tablets' },
    { name: 'Laptop & Máy tính', href: '/category/laptops-computers' },
    { name: 'Thiết bị điện tử', href: '/category/electronics' },
    { name: 'Phụ kiện công nghệ', href: '/category/accessories' },
    { name: 'Thiết bị thông minh', href: '/category/smart-devices' },
    { name: 'Máy ảnh & Quay phim', href: '/category/cameras' },
    { name: 'Gaming & Giải trí', href: '/category/gaming' }
]

const UserHeader = () => {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [isCategoryOpen, setIsCategoryOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [isSearchFocused, setIsSearchFocused] = useState(false)
    const user = useSelector(userSelector)
    const pathName = usePathname()

    const toggleMenu = () => {
        setIsOpen(!isOpen)
    }

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true)
            } else {
                setIsScrolled(false)
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    return (
        <>
            {/* Top Bar */}
            <div className='bg-gradient-to-r from-blue-800 to-blue-600 text-white py-2.5 text-sm hidden md:block'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center'>
                    <div className='flex items-center space-x-6'>
                        <div className='flex items-center space-x-2'>
                            <Phone size={14} />
                            <span>1900 1234</span>
                        </div>
                        <div className='flex items-center space-x-2'>
                            <Mail size={14} />
                            <span>support@shopfinity.vn</span>
                        </div>
                    </div>
                    <div className='flex items-center space-x-6'>
                        <Link
                            href='/notifications'
                            className='flex items-center space-x-2 hover:text-blue-200 transition-colors'
                        >
                            <Bell size={14} />
                            <span>Thông báo</span>
                        </Link>
                        <Link
                            href='/#contact'
                            className='flex items-center space-x-2 hover:text-blue-200 transition-colors'
                        >
                            <MapPin size={14} />
                            <span>Liên hệ</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <header
                className={`sticky top-0 px-4 z-50 w-full transition-all duration-300 ${
                    isScrolled
                        ? 'shadow-lg bg-white backdrop-blur-lg bg-opacity-95'
                        : 'shadow-sm bg-white backdrop-blur-lg bg-opacity-95'
                }`}
            >
                <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                    {/* Desktop Header */}
                    <div className='h-20 flex items-center justify-between'>
                        {/* Logo */}
                        <div className='flex items-center'>
                            <Link href='/' className='flex items-center'>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                                >
                                    <Logo />
                                </motion.div>
                            </Link>
                        </div>

                        {/* Search Bar */}
                        <div className='hidden md:flex flex-1 max-w-xl mx-8 relative'>
                            <div
                                className={`flex w-full items-center overflow-hidden rounded-full border transition-all duration-300 ${
                                    isSearchFocused
                                        ? 'border-blue-500 ring-2 ring-blue-100'
                                        : 'border-gray-300 hover:border-gray-400'
                                }`}
                            >
                                <input
                                    type='text'
                                    placeholder='Tìm kiếm sản phẩm...'
                                    className='w-full py-3 pl-5 pr-12 rounded-full focus:outline-none bg-transparent'
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    onFocus={() => setIsSearchFocused(true)}
                                    onBlur={() => setIsSearchFocused(false)}
                                />
                                <button className='absolute right-4 text-gray-500 hover:text-blue-600 transition-colors'>
                                    <Search size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Right Navigation */}
                        <div className='flex items-center space-x-1 md:space-x-6'>
                            <div className='hidden md:flex items-center'>
                                <Link
                                    href='/user/wishlist'
                                    className={`flex flex-col items-center px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all relative ${
                                        pathName.includes('user/wishlist')
                                            ? 'bg-blue-50 text-blue-600'
                                            : 'text-gray-700'
                                    }`}
                                >
                                    <Heart size={22} strokeWidth={1.5} />
                                    {user.cartCount > 0 && (
                                        <motion.span
                                            className='absolute -top-0 -right-0 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'
                                            initial={{ scale: 0.8 }}
                                            animate={{ scale: 1 }}
                                            transition={{
                                                type: 'spring',
                                                stiffness: 500,
                                                damping: 10
                                            }}
                                        >
                                            {user.favoriteCount}
                                        </motion.span>
                                    )}
                                    <span className='text-xs mt-1 font-medium'>Yêu thích</span>
                                </Link>
                                <Link
                                    href='/user/cart'
                                    className={`ml-2 flex flex-col items-center px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all relative ${
                                        pathName.includes('user/cart') ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                                    }`}
                                >
                                    <ShoppingCart size={22} strokeWidth={1.5} />
                                    {user.cartCount > 0 && (
                                        <motion.span
                                            className='absolute -top-0 -right-0 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'
                                            initial={{ scale: 0.8 }}
                                            animate={{ scale: 1 }}
                                            transition={{
                                                type: 'spring',
                                                stiffness: 500,
                                                damping: 10
                                            }}
                                        >
                                            {user.cartCount}
                                        </motion.span>
                                    )}
                                    <span className='text-xs mt-1 font-medium'>Giỏ hàng</span>
                                </Link>
                                {!user.isAuthenticated ? (
                                    <Link
                                        href='/login'
                                        className='ml-4 flex items-center bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-6 py-3 rounded-full transition-all'
                                    >
                                        <LogIn size={18} className='mr-2' />
                                        <span className='font-medium'>Đăng nhập</span>
                                    </Link>
                                ) : (
                                    <div className='ml-4 relative'>
                                        <UserAvatarMenu />
                                    </div>
                                )}
                            </div>

                            {/* Mobile Menu Button */}
                            <button
                                className='md:hidden p-2 rounded-full text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all'
                                onClick={toggleMenu}
                            >
                                {isOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>

                    {/* Category Navigation */}
                    <nav className='hidden md:block pb-[11px]'>
                        <div className='flex items-center h-12 bg-gradient-to-r from-blue-100 to-transparent'>
                            {/* Categories Dropdown */}
                            <div className='relative group'>
                                <button
                                    className='flex items-center space-x-2 text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 px-5 font-medium transition-all'
                                    style={{ height: '48px' }}
                                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                                >
                                    <Menu size={18} />
                                    <span>Danh mục sản phẩm</span>
                                    <ChevronDown
                                        size={16}
                                        className='transform group-hover:rotate-180 transition-transform duration-300'
                                    />
                                </button>
                                <div className='absolute left-0 top-full w-64 bg-white shadow-xl rounded-b-lg rounded-tr-lg z-50 opacity-0 invisible transform -translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300'>
                                    <div className='p-1'>
                                        {categories.map((category, index) => (
                                            <Link
                                                key={index}
                                                href={category.href}
                                                className='flex px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors'
                                            >
                                                {category.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Main Navigation */}
                            <div className='flex items-center ml-6 space-x-6 b'>
                                <Link
                                    href='/user'
                                    className='font-medium hover:text-blue-600 transition-colors px-4 py-2 rounded-[8px] hover:bg-blue-100'
                                >
                                    Trang chủ
                                </Link>

                                <Link
                                    href='/user/products'
                                    className='font-medium hover:text-blue-600 transition-colors px-4 py-2 rounded-[8px] hover:bg-blue-100'
                                >
                                    Sản phẩm
                                </Link>

                                <Link
                                    href='/user/#flash-sale'
                                    className='font-medium hover:text-blue-600 transition-colors px-4 py-2 rounded-[8px] hover:bg-blue-100 transition-colors relative group'
                                >
                                    <span className='group-hover:text-blue-600 transition-colors'>Flash Sale</span>
                                    <span className='absolute -top-0 -right-4 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded'>
                                        HOT
                                    </span>
                                </Link>

                                <Link
                                    href='/#intro'
                                    className='font-medium hover:text-blue-600 transition-colors px-4 py-2 rounded-[8px] hover:bg-blue-100'
                                >
                                    Về chúng tôi
                                </Link>

                                {/* <Link
                                    href='/#blog'
                                    className='font-medium hover:text-blue-600 transition-colors px-4 py-2 rounded-[8px] hover:bg-blue-100'
                                >
                                    Tin tức
                                </Link> */}

                                <Link
                                    href='/#contact'
                                    className='font-medium hover:text-blue-600 transition-colors px-4 py-2 rounded-[8px] hover:bg-blue-100'
                                >
                                    Liên hệ
                                </Link>
                            </div>
                        </div>
                    </nav>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            className='md:hidden bg-white border-t border-gray-200 shadow-xl'
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className='p-4'>
                                <div className='relative mb-4'>
                                    <input
                                        type='text'
                                        placeholder='Tìm kiếm sản phẩm...'
                                        className='w-full py-2.5 pl-4 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400'
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                    />
                                    <button className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600'>
                                        <Search size={20} />
                                    </button>
                                </div>

                                <div className='border-t border-gray-200 pt-4 space-y-1'>
                                    <Link
                                        href='/'
                                        className='block py-2.5 text-gray-700 hover:text-blue-600 font-medium hover:bg-blue-50 rounded-lg px-3 transition-colors'
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Trang chủ
                                    </Link>
                                    <div className='py-1'>
                                        <button
                                            className='flex items-center justify-between w-full text-gray-700 font-medium py-2.5 hover:bg-blue-50 hover:text-blue-600 rounded-lg px-3 transition-colors'
                                            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                                        >
                                            <span>Danh mục sản phẩm</span>
                                            <ChevronDown
                                                size={16}
                                                className={`transform transition-transform ${
                                                    isCategoryOpen ? 'rotate-180' : ''
                                                }`}
                                            />
                                        </button>
                                        <AnimatePresence>
                                            {isCategoryOpen && (
                                                <motion.div
                                                    className='pl-4 mt-1 border-l-2 border-blue-100 ml-3'
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    {categories.map((category, index) => (
                                                        <Link
                                                            key={index}
                                                            href={category.href}
                                                            className='block py-2 px-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors'
                                                            onClick={() => setIsOpen(false)}
                                                        >
                                                            {category.name}
                                                        </Link>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                    <Link
                                        href='/products'
                                        className='block py-2.5 text-gray-700 hover:text-blue-600 font-medium hover:bg-blue-50 rounded-lg px-3 transition-colors'
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Sản phẩm mới
                                    </Link>
                                    <Link
                                        href='/flash-sale'
                                        className='block py-2.5 text-gray-700 hover:text-blue-600 font-medium hover:bg-blue-50 rounded-lg px-3 transition-colors relative'
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Flash Sale
                                        <span className='ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded'>
                                            HOT
                                        </span>
                                    </Link>
                                    <Link
                                        href='/solutions'
                                        className='block py-2.5 text-gray-700 hover:text-blue-600 font-medium hover:bg-blue-50 rounded-lg px-3 transition-colors'
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Giải pháp
                                    </Link>
                                    <Link
                                        href='/technical'
                                        className='block py-2.5 text-gray-700 hover:text-blue-600 font-medium hover:bg-blue-50 rounded-lg px-3 transition-colors'
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Kỹ thuật
                                    </Link>
                                    <Link
                                        href='/about'
                                        className='block py-2.5 text-gray-700 hover:text-blue-600 font-medium hover:bg-blue-50 rounded-lg px-3 transition-colors'
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Về chúng tôi
                                    </Link>
                                </div>

                                <div className='mt-6 pt-4 border-t border-gray-200 grid grid-cols-2 gap-4'>
                                    <Link
                                        href='/account'
                                        className='flex items-center justify-center space-x-2 text-gray-700 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 py-3 rounded-lg transition-colors'
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <User size={20} />
                                        <span>Tài khoản</span>
                                    </Link>
                                    <Link
                                        href='/wishlist'
                                        className='flex items-center justify-center space-x-2 text-gray-700 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 py-3 rounded-lg transition-colors'
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <Heart size={20} />
                                        <span>Yêu thích</span>
                                    </Link>
                                </div>

                                <div className='mt-4 grid grid-cols-2 gap-4'>
                                    <Link
                                        href='/cart'
                                        className='flex items-center justify-center space-x-2 text-gray-700 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 py-3 rounded-lg transition-colors relative'
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <ShoppingCart size={20} />
                                        <span className='absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>
                                            3
                                        </span>
                                        <span>Giỏ hàng</span>
                                    </Link>
                                    <Link
                                        href='/login'
                                        className='flex items-center justify-center space-x-2 text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 py-3 rounded-lg transition-colors'
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <LogIn size={20} />
                                        <span>Đăng nhập</span>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>
        </>
    )
}

export default UserHeader
