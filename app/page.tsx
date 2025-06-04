'use client'

import { useState, useEffect, useRef } from 'react'
import {
    ChevronRight,
    ChevronLeft,
    ShoppingCart,
    ChevronUp,
    Heart,
    Search,
    Menu,
    X,
    Mail,
    Phone,
    MapPin,
    ArrowRight,
    Star
} from 'lucide-react'

import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import TwitterIcon from '@mui/icons-material/Twitter'
import GitHubIcon from '@mui/icons-material/GitHub'
import { useRouter } from 'next/navigation'

// Custom hook for intersection observer (animation on scroll)
function useIntersectionObserver(options = {}): [React.RefObject<HTMLDivElement>, boolean] {
    const ref = useRef<HTMLDivElement>(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            setIsVisible(entry.isIntersecting)
        }, options)

        const currentRef = ref.current
        if (currentRef) {
            observer.observe(currentRef)
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef)
            }
        }
    }, [options])

    return [ref as React.RefObject<HTMLDivElement>, isVisible]
}

// Header Component
const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header
            className={`fixed w-full z-50 transition-all duration-200 ${
                isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4 text-white'
            }`}
        >
            <div className='container mx-auto px-4 flex justify-between items-center'>
                <a className='flex items-center' href='#'>
                    <h1 className='text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                        SHOPFINITY
                    </h1>
                </a>

                <nav className='hidden md:flex space-x-8'>
                    <a href='/user' className='font-medium hover:text-blue-600 transition-colors'>
                        Trang chủ
                    </a>
                    <a href='#product' className='font-medium hover:text-blue-600 transition-colors'>
                        Sản phẩm
                    </a>
                    <a href='#intro' className='font-medium hover:text-blue-600 transition-colors'>
                        Giới thiệu
                    </a>
                    <a href='#blog' className='font-medium hover:text-blue-600 transition-colors'>
                        Tin tức
                    </a>
                    <a href='#contact' className='font-medium hover:text-blue-600 transition-colors'>
                        Liên hệ
                    </a>
                </nav>

                <div className='hidden md:flex items-center space-x-4'>
                    <button className='p-2 hover:text-blue-600 transition-colors'>
                        <Search size={20} />
                    </button>
                    {/* <button className='p-2 hover:text-blue-600 transition-colors relative'>
                        <Heart size={20} />
                        <span className='bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center absolute -top-1 -right-1'>
                            2
                        </span>
                    </button>
                    <button className='p-2 hover:text-blue-600 transition-colors relative'>
                        <ShoppingCart size={20} />
                        <span className='bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center absolute -top-1 -right-1'>
                            3
                        </span>
                    </button> */}
                    <button
                        onClick={() => router.push('/login')}
                        className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors'
                    >
                        Đăng nhập
                    </button>
                </div>

                <button className='md:hidden' onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className='md:hidden bg-white shadow-lg absolute top-full left-0 w-full'>
                    <div className='container mx-auto px-4 py-4'>
                        <nav className='flex flex-col space-y-4'>
                            <a href='#' className='font-medium hover:text-blue-600 transition-colors'>
                                Trang chủ
                            </a>
                            <a href='#' className='font-medium hover:text-blue-600 transition-colors'>
                                Sản phẩm
                            </a>
                            <a href='#' className='font-medium hover:text-blue-600 transition-colors'>
                                Giới thiệu
                            </a>
                            <a href='#' className='font-medium hover:text-blue-600 transition-colors'>
                                Tin tức
                            </a>
                            <a href='#' className='font-medium hover:text-blue-600 transition-colors'>
                                Liên hệ
                            </a>
                        </nav>
                        <div className='flex justify-between mt-4 pt-4 border-t'>
                            <button className='flex items-center space-x-1 text-gray-700'>
                                <Search size={18} />
                                <span>Tìm kiếm</span>
                            </button>
                            <button className='flex items-center space-x-1 text-gray-700'>
                                <Heart size={18} />
                                <span>Yêu thích</span>
                            </button>
                            <button className='flex items-center space-x-1 text-gray-700'>
                                <ShoppingCart size={18} />
                                <span>Giỏ hàng</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}

// Hero Section Component
const HeroSection = () => {
    const [currentSlide, setCurrentSlide] = useState(0)
    const slides = [
        {
            image: 'https://api-prod-minimal-v700.pages.dev/assets/images/cover/cover-1.webp',
            title: 'Thiết bị điện tử hiện đại',
            subtitle: 'Nâng tầm không gian sống của bạn',
            cta: 'Khám phá ngay'
        },
        {
            image: 'https://api-prod-minimal-v700.pages.dev/assets/images/cover/cover-2.webp',
            title: 'Giải pháp thông minh',
            subtitle: 'Tự động hóa cho mọi nhu cầu',
            cta: 'Xem sản phẩm'
        },
        {
            image: 'https://api-prod-minimal-v700.pages.dev/assets/images/cover/cover-3.webp',
            title: 'Công nghệ đỉnh cao',
            subtitle: 'Dẫn đầu xu hướng tương lai',
            cta: 'Tìm hiểu thêm'
        }
    ]

    const nextSlide = () => {
        setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1))
    }

    const prevSlide = () => {
        setCurrentSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1))
    }

    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide()
        }, 5000)
        return () => clearInterval(timer)
    }, [])

    return (
        <div className='relative h-screen overflow-hidden'>
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 h-full w-full transition-opacity duration-1000 ${
                        currentSlide === index ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                    <div className='absolute inset-0 bg-black/50 z-10'></div>
                    <img src={slide.image} alt={slide.title} className='object-cover w-full h-full' />
                    <div className='absolute inset-0 z-20 flex items-center justify-center'>
                        <div className='text-center max-w-3xl px-4'>
                            <h1 className='text-4xl md:text-6xl font-bold text-white mb-4 animate-fadeDown'>
                                {slide.title}
                            </h1>
                            <p className='text-xl md:text-2xl text-white mb-8 animate-fadeUp'>{slide.subtitle}</p>
                            <button className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 animate-fadeIn'>
                                {slide.cta}
                            </button>
                        </div>
                    </div>
                </div>
            ))}

            <button
                onClick={prevSlide}
                className='absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 rounded-full p-2 backdrop-blur-sm transition-all'
            >
                <ChevronLeft size={24} className='text-white' />
            </button>

            <button
                onClick={nextSlide}
                className='absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 rounded-full p-2 backdrop-blur-sm transition-all'
            >
                <ChevronRight size={24} className='text-white' />
            </button>

            <div className='absolute bottom-6 left-0 right-0 z-30 flex justify-center space-x-2'>
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`transition-all duration-300 focus:outline-none ${
                            currentSlide === index
                                ? 'w-8 h-3 bg-blue-600 rounded-full'
                                : 'w-3 h-3 bg-gray-300 rounded-full hover:bg-blue-300'
                        }`}
                        aria-label={`View testimonial ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    )
}

// Featured Categories Component
const FeaturedCategories = () => {
    const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 })

    const categories = [
        {
            name: 'Thiết Bị Nhà Thông Minh',
            image: 'https://api-prod-minimal-v700.pages.dev/assets/images/cover/cover-9.webp',
            count: '42 sản phẩm'
        },
        {
            name: 'Thiết Bị An Ninh',
            image: 'https://api-prod-minimal-v700.pages.dev/assets/images/cover/cover-10.webp',
            count: '38 sản phẩm'
        },
        {
            name: 'Thiết Bị Tự Động Hóa',
            image: 'https://api-prod-minimal-v700.pages.dev/assets/images/cover/cover-11.webp',
            count: '25 sản phẩm'
        }
    ]

    return (
        <section id='product' data-animate='true' className='py-16 px-4 container mx-auto'>
            <div className='text-center mb-12'>
                <h2
                    className={`text-3xl font-bold text-gray-800 mb-4 transition-all duration-700 ${
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                >
                    Danh Mục Sản Phẩm
                </h2>
                <p
                    className={`text-gray-600 max-w-2xl mx-auto transition-all duration-700 delay-300 text-[16px] ${
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                >
                    Khám phá đa dạng các sản phẩm công nghệ và tự động hóa chất lượng cao
                </p>
            </div>

            <div ref={ref} className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                {categories.map((category, index) => (
                    <div
                        key={index}
                        className={`group relative h-72 rounded-lg overflow-hidden shadow-lg transition-all duration-700 delay-${
                            index * 200
                        } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                    >
                        <img
                            src={category.image}
                            alt={category.name}
                            className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
                        />
                        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6'>
                            <h3 className='text-xl font-semibold text-white mb-2'>{category.name}</h3>
                            <p className='text-white/80 mb-4 text-[16px]'>{category.count}</p>
                            <a
                                href='#'
                                className='inline-flex items-center text-white font-medium group-hover:text-blue-300 transition-colors text-[16px]'
                            >
                                Xem Danh Mục{' '}
                                <ArrowRight size={16} className='ml-2 transition-transform group-hover:translate-x-1' />
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

// Best Selling Products Component
const BestSellingProducts = () => {
    const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 })

    const products = [
        {
            id: 1,
            name: 'Smart Home Hub Pro',
            image: 'https://api-prod-minimal-v700.pages.dev/assets/images/cover/cover-8.webp',
            price: 1990000,
            oldPrice: 2490000,
            rating: 4.8,
            reviews: 124,
            isNew: true
        },
        {
            id: 2,
            name: 'Camera An Ninh 360°',
            image: 'https://api-prod-minimal-v700.pages.dev/assets/images/cover/cover-9.webp',
            price: 890000,
            oldPrice: 1190000,
            rating: 4.7,
            reviews: 89,
            isSale: true
        },
        {
            id: 3,
            name: 'Bộ Điều Khiển Thông Minh',
            image: 'https://api-prod-minimal-v700.pages.dev/assets/images/cover/cover-10.webp',
            price: 1490000,
            rating: 4.9,
            reviews: 56
        },
        {
            id: 4,
            name: 'Robot Hút Bụi AI',
            image: 'https://api-prod-minimal-v700.pages.dev/assets/images/cover/cover-11.webp',
            price: 8900000,
            oldPrice: 9900000,
            rating: 4.6,
            reviews: 212,
            isSale: true
        }
    ]

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0
        }).format(price)
    }

    return (
        <section className='py-16'>
            <div className='container mx-auto px-4'>
                <div className='flex justify-between items-center mb-12'>
                    <div>
                        <h2 className='text-3xl font-bold'>Sản phẩm bán chạy</h2>
                        <p className='text-gray-600 mt-2 text-[16px]'>Những sản phẩm được khách hàng yêu thích nhất</p>
                    </div>
                    <a
                        href='#'
                        className='hidden md:flex items-center space-x-2 text-blue-600 font-medium hover:text-blue-700 text-[16px]'
                    >
                        <span>Xem tất cả</span>
                        <ArrowRight size={16} />
                    </a>
                </div>

                <div ref={ref} className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
                    {products.map((product, index) => (
                        <div
                            key={product.id}
                            className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-700 transform ${
                                isVisible
                                    ? `opacity-100 translate-y-0 delay-${index * 100}`
                                    : 'opacity-0 translate-y-12'
                            } hover:shadow-lg group`}
                        >
                            <div className='relative overflow-hidden h-64'>
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                                />
                                {product.isNew && (
                                    <span className='absolute top-2 left-2 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-md'>
                                        Mới
                                    </span>
                                )}
                                {product.isSale && (
                                    <span className='absolute top-2 left-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-md'>
                                        Giảm giá
                                    </span>
                                )}
                                <div className='absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2'>
                                    <button className='bg-white p-3 rounded-full hover:bg-blue-600 hover:text-white transition-colors'>
                                        <ShoppingCart size={18} />
                                    </button>
                                    <button className='bg-white p-3 rounded-full hover:bg-blue-600 hover:text-white transition-colors'>
                                        <Heart size={18} />
                                    </button>
                                    <button className='bg-white p-3 rounded-full hover:bg-blue-600 hover:text-white transition-colors'>
                                        <Search size={18} />
                                    </button>
                                </div>
                            </div>
                            <div className='p-4'>
                                <h3 className='font-medium text-lg mb-2'>{product.name}</h3>
                                <div className='flex items-center mb-2'>
                                    <div className='flex text-yellow-400 mr-2'>
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={16}
                                                fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                                                className={i < Math.floor(product.rating) ? '' : 'text-gray-300'}
                                            />
                                        ))}
                                    </div>
                                    <span className='text-sm text-gray-600'>({product.reviews})</span>
                                </div>
                                <div className='flex items-center justify-between'>
                                    <div className='flex items-center space-x-2'>
                                        <span className='font-bold text-blue-600'>{formatPrice(product.price)}</span>
                                        {product.oldPrice && (
                                            <span className='text-gray-400 line-through text-sm'>
                                                {formatPrice(product.oldPrice)}
                                            </span>
                                        )}
                                    </div>
                                    <button className='text-blue-600 hover:text-blue-700'>
                                        <ShoppingCart size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className='mt-8 flex justify-center md:hidden'>
                    <a href='#' className='flex items-center space-x-2 text-blue-600 font-medium hover:text-blue-700'>
                        <span>Xem tất cả sản phẩm</span>
                        <ArrowRight size={16} />
                    </a>
                </div>
            </div>
        </section>
    )
}

// Special Offer Component
const SpecialOffer = () => {
    const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 })
    const [timeLeft, setTimeLeft] = useState({
        days: 3,
        hours: 8,
        minutes: 45,
        seconds: 30
    })

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                let { days, hours, minutes, seconds } = prev
                seconds--

                if (seconds < 0) {
                    seconds = 59
                    minutes--
                }

                if (minutes < 0) {
                    minutes = 59
                    hours--
                }

                if (hours < 0) {
                    hours = 23
                    days--
                }

                if (days < 0) {
                    clearInterval(timer)
                    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
                }

                return { days, hours, minutes, seconds }
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    return (
        <section
            ref={ref}
            className={`bg-gradient-to-r from-blue-800 to-purple-800 py-20 text-white transition-all duration-1000 transform ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            } relative overflow-hidden`}
        >
            {/* Decorative elements */}
            <div className='absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-white/10 to-transparent'></div>
            <div className='absolute -top-12 -right-12 w-48 h-48 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 blur-xl'></div>
            <div className='absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-gradient-to-tr from-blue-500/20 to-cyan-500/20 blur-xl'></div>

            <div className="absolute inset-0 bg-[url('/api/placeholder/1600/800')] bg-cover bg-center opacity-5 mix-blend-overlay"></div>

            <div className='container mx-auto px-4 relative z-10'>
                <div className='flex flex-col lg:flex-row items-center justify-between gap-12'>
                    <div className='lg:w-1/2'>
                        <div className='inline-block px-4 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6'>
                            Chỉ trong thời gian giới hạn
                        </div>
                        <h2 className='text-4xl lg:text-5xl font-bold mb-6 leading-tight'>
                            <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200'>
                                Ưu đãi đặc biệt
                            </span>
                            <br />
                        </h2>

                        <p className='text-xl text-blue-100 mb-8 leading-relaxed'>
                            Giảm giá <span className='font-bold text-yellow-300'>40%</span> cho bộ sản phẩm nhà thông
                            minh hoàn chỉnh. Nâng cấp không gian sống của bạn ngay hôm nay!
                        </p>

                        <div className='flex flex-wrap gap-4 mb-10'>
                            <div className='bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center min-w-24 shadow-lg border border-white/10'>
                                <div className='text-4xl font-bold text-white'>
                                    {String(timeLeft.days).padStart(2, '0')}
                                </div>
                                <div className='text-sm font-medium text-blue-100 uppercase tracking-wider'>Ngày</div>
                            </div>
                            <div className='bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center min-w-24 shadow-lg border border-white/10'>
                                <div className='text-4xl font-bold text-white'>
                                    {String(timeLeft.hours).padStart(2, '0')}
                                </div>
                                <div className='text-sm font-medium text-blue-100 uppercase tracking-wider'>Giờ</div>
                            </div>
                            <div className='bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center min-w-24 shadow-lg border border-white/10'>
                                <div className='text-4xl font-bold text-white'>
                                    {String(timeLeft.minutes).padStart(2, '0')}
                                </div>
                                <div className='text-sm font-medium text-blue-100 uppercase tracking-wider'>Phút</div>
                            </div>
                            <div className='bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center min-w-24 shadow-lg border border-white/10'>
                                <div className='text-4xl font-bold text-white'>
                                    {String(timeLeft.seconds).padStart(2, '0')}
                                </div>
                                <div className='text-sm font-medium text-blue-100 uppercase tracking-wider'>Giây</div>
                            </div>
                        </div>

                        <div className='flex flex-wrap gap-4 items-center'>
                            <button className='bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-800 px-8 py-4 rounded-full font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl'>
                                Mua ngay
                            </button>
                            <button className='bg-transparent border border-white/30 hover:bg-white/10 px-8 py-4 rounded-full font-medium transition-all duration-300'>
                                Tìm hiểu thêm
                            </button>
                        </div>
                    </div>

                    <div className='lg:w-1/2 relative'>
                        <div className='p-2 bg-gradient-to-br from-white/30 to-white/5 rounded-2xl backdrop-blur-sm border border-white/10 shadow-2xl'>
                            <img
                                src='https://api-prod-minimal-v700.pages.dev/assets/images/cover/cover-3.webp'
                                alt='Smart Home Package'
                                className='rounded-xl shadow-xl w-full object-cover'
                            />
                        </div>

                        <div className='absolute -bottom-6 -right-6 bg-gradient-to-br from-red-500 to-red-600 text-white font-bold p-6 rounded-full shadow-lg animate-pulse flex items-center justify-center'>
                            <div className='absolute inset-0 rounded-full border-4 border-red-200 border-dashed animate-spin'></div>
                            <span className='text-2xl'>-40%</span>
                        </div>

                        <div className='absolute -top-6 -left-6 bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 shadow-lg'>
                            <div className='flex items-center gap-2'>
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    className='h-5 w-5 text-yellow-300'
                                    viewBox='0 0 20 20'
                                    fill='currentColor'
                                >
                                    <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                                </svg>
                                <span className='font-bold'>Bán chạy nhất</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

// Features Component
const Features = () => {
    const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 })

    const features = [
        {
            icon: <ShoppingCart size={32} />,
            title: 'Giao hàng nhanh chóng',
            description: 'Giao hàng trong vòng 24 giờ cho khu vực nội thành'
        },
        {
            icon: <Heart size={32} />,
            title: 'Sản phẩm chất lượng',
            description: 'Các sản phẩm nhập khẩu chính hãng 100%'
        },
        {
            icon: <Phone size={32} />,
            title: 'Hỗ trợ 24/7',
            description: 'Đội ngũ tư vấn và hỗ trợ kỹ thuật luôn sẵn sàng'
        },
        {
            icon: <Mail size={32} />,
            title: 'Bảo hành toàn diện',
            description: 'Bảo hành lên đến 5 năm cho tất cả sản phẩm'
        }
    ]

    return (
        <section className='py-16 bg-gray-50'>
            <div className='container mx-auto px-4'>
                <div ref={ref} className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={`bg-white p-6 rounded-xl shadow-sm flex flex-col items-center text-center transition-all duration-700 transform ${
                                isVisible
                                    ? `opacity-100 translate-y-0 delay-${index * 100}`
                                    : 'opacity-0 translate-y-12'
                            } hover:shadow-md hover:-translate-y-2`}
                        >
                            <div className='bg-blue-100 text-blue-600 p-3 rounded-full mb-4'>{feature.icon}</div>
                            <h3 className='text-xl font-semibold mb-2'>{feature.title}</h3>
                            <p className='text-gray-600'>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

// Testimonials Component
const Testimonials = () => {
    const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 })
    const [activeTestimonial, setActiveTestimonial] = useState(0)

    const testimonials = [
        {
            name: 'Nguyễn Văn A',
            role: 'Giám đốc công ty ABC',
            image: 'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-1.webp',
            content:
                'Tôi đã trang bị toàn bộ văn phòng với các thiết bị thông minh từ Shopfinity. Hiệu quả làm việc tăng đáng kể và tiết kiệm được nhiều chi phí điện năng.'
        },
        {
            name: 'Trần Thị B',
            role: 'Kiến trúc sư',
            image: 'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-2.webp',
            content:
                'Các sản phẩm tự động hóa của Shopfinity giúp tôi thiết kế những ngôi nhà thông minh hiện đại mà khách hàng rất hài lòng. Chất lượng sản phẩm luôn ổn định.'
        },
        {
            name: 'Lê Văn C',
            role: 'Chủ căn hộ thông minh',
            image: 'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-3.webp',
            content:
                'Tôi hoàn toàn hài lòng với hệ thống nhà thông minh từ Shopfinity. Giờ đây tôi có thể điều khiển mọi thiết bị trong nhà chỉ bằng giọng nói hoặc điện thoại.'
        }
    ]

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveTestimonial(prev => (prev === testimonials.length - 1 ? 0 : prev + 1))
        }, 5000)
        return () => clearInterval(interval)
    }, [testimonials.length])

    return (
        <section id='intro' className='relative py-20 bg-gradient-to-b from-blue-50 to-white overflow-hidden'>
            {/* Background Elements */}
            <div className='absolute top-0 left-0 w-32 h-32 bg-blue-100 rounded-full opacity-60 -translate-x-1/2 -translate-y-1/2 blur-2xl' />
            <div className='absolute bottom-0 right-0 w-48 h-48 bg-indigo-100 rounded-full opacity-60 translate-x-1/4 translate-y-1/4 blur-2xl' />

            <div className='container mx-auto px-4 relative z-10'>
                {/* Section Header */}
                <div
                    className={`transition-all duration-700 transform ${
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                >
                    <h2 className='text-3xl md:text-4xl font-bold text-center mb-3'>
                        <span className='bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'>
                            Khách hàng nói gì về chúng tôi
                        </span>
                    </h2>

                    <div className='flex justify-center mb-8'>
                        <p className='text-gray-600 text-center max-w-2xl font-medium text-[16px]'>
                            Trải nghiệm hài lòng từ khách hàng là niềm tự hào của Shopfinity
                        </p>
                    </div>
                </div>

                {/* Testimonial Cards */}
                <div ref={ref} className='max-w-4xl mx-auto'>
                    <div className='relative h-[250px]'>
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={index}
                                className={`absolute inset-0 transition-all duration-700 transform 
                                    ${
                                        activeTestimonial === index
                                            ? 'opacity-100 scale-100 z-10'
                                            : index ===
                                              (activeTestimonial === 0
                                                  ? testimonials.length - 1
                                                  : activeTestimonial - 1)
                                            ? 'opacity-0 -translate-x-full scale-95 z-0'
                                            : 'opacity-0 translate-x-full scale-95 z-0'
                                    }`}
                            >
                                <div className='bg-white rounded-2xl shadow-xl p-6 md:p-10 h-full border border-gray-100'>
                                    <div className='flex items-center mb-6 justify-left'>
                                        <div className='relative mr-6'>
                                            <img
                                                src={testimonial.image}
                                                alt={testimonial.name}
                                                className='w-20 h-20 rounded-full object-cover border-4 border-white shadow-md'
                                            />
                                            <div className='absolute -bottom-[5px] -right-[0px] bg-blue-500 rounded-full p-1'>
                                                <svg
                                                    className='w-4 h-4 text-white'
                                                    fill='none'
                                                    viewBox='0 0 24 24'
                                                    stroke='currentColor'
                                                >
                                                    <path
                                                        strokeLinecap='round'
                                                        strokeLinejoin='round'
                                                        strokeWidth={2}
                                                        d='M5 13l4 4L19 7'
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className='text-xl font-bold text-gray-800'>{testimonial.name}</h3>
                                            <p className='text-blue-600 font-medium'>{testimonial.role}</p>

                                            {/* Star Rating */}
                                            <div className='flex mt-0.5'>
                                                {[...Array(5)].map((_, i) => (
                                                    <svg
                                                        key={i}
                                                        className='w-5 h-5 text-yellow-400'
                                                        fill='currentColor'
                                                        viewBox='0 0 20 20'
                                                    >
                                                        <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                                                    </svg>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className='relative'>
                                        <svg
                                            className='absolute top-7 left-1 w-12 h-12 text-blue-100 -mt-6 -ml-2'
                                            fill='currentColor'
                                            viewBox='0 0 32 32'
                                        >
                                            <path d='M9.352 4C4.582 4 0.7 7.882 0.7 12.652C0.7 17.422 4.582 21.304 9.352 21.304C14.122 21.304 18.004 17.422 18.004 12.652L18.004 9.878C18.004 5.108 21.886 1.226 26.656 1.226L28.043 1.226C28.573 1.226 29.004 1.657 29.004 2.187L29.004 6.13C29.004 6.66 28.573 7.091 28.043 7.091L26.656 7.091C24.65 7.091 23.017 8.724 23.017 10.73L23.017 12.652C23.017 20.186 16.886 26.316 9.352 26.316C1.818 26.316 -0.313 20.186 -0.313 12.652C-0.313 5.118 1.818 -0.013 9.352 -0.013L10.739 -0.013C11.269 -0.013 11.7 0.418 11.7 0.948L11.7 4.891C11.7 5.421 11.269 5.852 10.739 5.852L9.352 5.852C7.346 5.852 5.713 7.485 5.713 9.491L5.713 11.413C5.713 13.419 7.346 15.052 9.352 15.052C11.358 15.052 12.991 13.419 12.991 11.413L12.991 4.891C12.991 4.361 13.422 3.93 13.952 3.93L17.895 3.93C18.425 3.93 18.856 4.361 18.856 4.891L18.856 6.278C18.856 11.048 14.974 14.93 10.204 14.93L10.204 14.93C5.434 14.93 1.552 11.048 1.552 6.278L1.552 4.891C1.552 4.361 1.983 3.93 2.513 3.93L6.456 3.93C6.986 3.93 7.417 4.361 7.417 4.891L7.417 4.891C7.417 5.421 6.986 5.852 6.456 5.852L4.109 5.852L4.109 6.278C4.109 9.641 6.841 12.373 10.204 12.373L10.204 12.373C13.567 12.373 16.3 9.641 16.3 6.278L16.3 6.278L16.3 6.252L15.269 6.252C14.739 6.252 14.308 5.821 14.308 5.291L14.308 5.291C14.308 4.761 14.739 4.33 15.269 4.33L16.3 4.33L16.3 4.304C16.3 4.221 16.296 4.139 16.287 4.058L13.952 4.058L13.952 11.413C13.952 14.776 11.22 17.508 7.857 17.508C4.494 17.508 1.761 14.776 1.761 11.413L1.761 9.491C1.761 6.128 4.494 3.396 7.857 3.396L9.352 3.396L9.352 4.013L9.352 4Z'></path>
                                        </svg>
                                        <p className='text-gray-700 text-lg leading-relaxed italic pt-0 ml-[50px]'>
                                            “{testimonial.content}”
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Navigation Dots */}
                    <div className='flex justify-center mt-8 space-x-3'>
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveTestimonial(index)}
                                className={`transition-all duration-300 focus:outline-none ${
                                    activeTestimonial === index
                                        ? 'w-8 h-3 bg-blue-600 rounded-full'
                                        : 'w-3 h-3 bg-gray-300 rounded-full hover:bg-blue-300'
                                }`}
                                aria-label={`View testimonial ${index + 1}`}
                            />
                        ))}
                    </div>

                    {/* Navigation Arrows */}
                    <div className='hidden md:flex justify-between items-center mt-6'>
                        <button
                            onClick={() =>
                                setActiveTestimonial(prev => (prev === 0 ? testimonials.length - 1 : prev - 1))
                            }
                            className='p-2 rounded-full bg-white shadow-md hover:bg-blue-50 transition-colors duration-300 focus:outline-none'
                            aria-label='Previous testimonial'
                        >
                            <svg
                                className='w-6 h-6 text-blue-600'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    d='M15 19l-7-7 7-7'
                                />
                            </svg>
                        </button>
                        <button
                            onClick={() =>
                                setActiveTestimonial(prev => (prev === testimonials.length - 1 ? 0 : prev + 1))
                            }
                            className='p-2 rounded-full bg-white shadow-md hover:bg-blue-50 transition-colors duration-300 focus:outline-none'
                            aria-label='Next testimonial'
                        >
                            <svg
                                className='w-6 h-6 text-blue-600'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                            >
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 5l7 7-7 7' />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}

// Newsletter Component
const Newsletter = () => {
    const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 })
    const [email, setEmail] = useState('')
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (email) {
            setIsSubmitted(true)
            setTimeout(() => {
                setIsSubmitted(false)
                setEmail('')
            }, 3000)
        }
    }

    return (
        <section
            ref={ref}
            className={`relative py-14 bg-blue-700 text-white transition-all duration-1000 transform ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
        >
            <div className='absolute inset-0 bg-blue-600 z-[-1]'>
                <div className="absolute inset-0 bg-[url('https://api-prod-minimal-v700.pages.dev/assets/images/cover/cover-2.webp')] opacity-20 mix-blend-overlay bg-cover bg-center"></div>
            </div>
            <div className='container mx-auto px-4'>
                <div className='max-w-2xl mx-auto text-center'>
                    <h2 className='text-3xl font-bold mb-4'>Đăng ký nhận tin</h2>
                    <p className='text-blue-100 mb-8 text-[16px]'>
                        Nhận thông tin mới nhất về sản phẩm và khuyến mãi đặc biệt từ SHOPFINITY
                    </p>

                    <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
                        <input
                            type='email'
                            placeholder='Nhập email của bạn'
                            className='flex-1 py-3 px-4 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300'
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                        <button
                            type='submit'
                            className='bg-white text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium transition-colors'
                        >
                            {isSubmitted ? 'Đã đăng ký ✓' : 'Đăng ký'}
                        </button>
                    </form>

                    <p className='mt-6 text-sm text-blue-100'>
                        Chúng tôi cam kết không gửi spam và bảo mật thông tin của bạn
                    </p>
                </div>
            </div>
        </section>
    )
}

// Brands Component
const Brands = () => {
    const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 })

    const brands = [
        'images/abb-logo.jfif',
        'images/Mitsubishi Electric.jfif',
        'images/Newsroom.jfif',
        'images/Omron.jfif',
        'images/Schneider Electric.jfif',
        'images/siemen.jfif'
    ]

    return (
        <section className='pt-[48px] pb-14 bg-gray-50'>
            <div className='container mx-auto px-4'>
                <h2 className='text-3xl font-bold text-center mb-8 text-gray-700'>Đối tác của chúng tôi</h2>

                <div
                    ref={ref}
                    className={`flex flex-wrap justify-center items-center gap-8 md:gap-16 transition-all duration-1000 ${
                        isVisible ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                    {brands.map((brand, index) => (
                        <div
                            key={index}
                            className='transition-all cursor-pointer duration-300 transform hover:scale-110 flex items-center justify-center'
                        >
                            <div className='w-[150px] h-[100px] overflow-hidden bg-white rounded-lg shadow-sm flex items-center justify-center'>
                                <img
                                    src={brand}
                                    alt={brand}
                                    className={
                                        `max-w-[120px] max-h-[80px] object-contain ` +
                                        (brand === 'images/Newsroom.jfif' || brand == 'images/Schneider Electric.jfif'
                                            ? 'scale-[1.3]'
                                            : 'scale-[1]')
                                    }
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

// Blog Posts Component
const BlogPosts = () => {
    const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 })

    const posts = [
        {
            title: 'Xu hướng nhà thông minh năm 2025',
            excerpt: 'Khám phá những xu hướng mới nhất về thiết bị thông minh và tự động hóa trong năm 2025.',
            image: 'https://api-prod-minimal-v700.pages.dev/assets/images/cover/cover-12.webp',
            date: '15/04/2025',
            author: {
                name: 'Nguyễn Văn A',
                avatar: 'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-1.webp'
            }
        },
        {
            title: '5 thiết bị tự động hóa cần có trong mọi văn phòng',
            excerpt: 'Những thiết bị tự động hóa giúp tăng năng suất và hiệu quả làm việc cho văn phòng hiện đại.',
            image: 'https://api-prod-minimal-v700.pages.dev/assets/images/cover/cover-13.webp',
            date: '08/04/2025',
            author: {
                name: 'Trần Thị B',
                avatar: 'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-2.webp'
            }
        },
        {
            title: 'Cách tiết kiệm điện với nhà thông minh',
            excerpt:
                'Hướng dẫn chi tiết cách sử dụng thiết bị thông minh để tối ưu hóa việc sử dụng năng lượng trong gia đình.',
            image: 'https://api-prod-minimal-v700.pages.dev/assets/images/cover/cover-14.webp',
            date: '01/04/2025',
            author: {
                name: 'Lê Văn C',
                avatar: 'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-3.webp'
            }
        }
    ]

    return (
        <section className='py-16' id='blog'>
            <div className='container mx-auto px-4'>
                <div className='flex justify-between items-center mb-12'>
                    <div>
                        <h2 className='text-3xl font-bold'>Tin tức & Bài viết</h2>
                        <p className='text-gray-600 mt-2 text-[16px]'>Cập nhật kiến thức mới nhất về công nghệ</p>
                    </div>
                    <a
                        href='#'
                        className='hidden md:flex items-center space-x-2 text-blue-600 text-[16px] font-medium hover:text-blue-700'
                    >
                        <span>Xem tất cả bài viết</span>
                        <ArrowRight size={16} />
                    </a>
                </div>

                <div ref={ref} className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                    {posts.map((post, index) => (
                        <div
                            key={index}
                            className={`bg-white rounded-xl shadow-md overflow-hidden transition-all flex flex-col duration-300 transform ${
                                isVisible
                                    ? `opacity-100 translate-y-0 delay-${index * 100}`
                                    : 'opacity-0 translate-y-12'
                            } hover:shadow-xl group`}
                        >
                            <div className='relative overflow-hidden h-48'>
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                                />
                                <div className='absolute bottom-0 left-0 bg-gradient-to-t from-black/70 to-transparent w-full h-1/2'></div>
                                <div className='absolute bottom-4 left-4 text-white'>
                                    <span className='text-sm'>{post.date}</span>
                                </div>
                            </div>
                            <div className='p-6 flex flex-col flex-1'>
                                <div className='flex items-center mb-4'>
                                    <img
                                        src={post.author.avatar}
                                        alt={post.author.name}
                                        className='w-10 h-10 rounded-full mr-3 object-cover'
                                    />
                                    <span className='text-sm text-gray-600 text-[15px] font-bold'>
                                        {post.author.name}
                                    </span>
                                </div>
                                <h3 className='font-semibold text-xl mb-2 group-hover:text-blue-600 transition-colors'>
                                    {post.title}
                                </h3>
                                <p className='text-gray-600 mb-4 line-clamp-2'>{post.excerpt}</p>
                                <a
                                    href='#'
                                    style={{
                                        marginTop: 'auto'
                                    }}
                                    className='text-blue-600 mt-auto font-medium flex items-center space-x-1 group-hover:space-x-2 transition-all'
                                >
                                    <span>Đọc tiếp</span>
                                    <ArrowRight size={16} className='group-hover:translate-x-1 transition-transform' />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                <div className='mt-8 flex justify-center md:hidden'>
                    <a href='#' className='flex items-center space-x-2 text-blue-600 font-medium hover:text-blue-700'>
                        <span>Xem tất cả bài viết</span>
                        <ArrowRight size={16} />
                    </a>
                </div>
            </div>
        </section>
    )
}

// Contact & Map Component
const ContactMap = () => {
    const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 })

    return (
        <section className='py-16 bg-gray-50' id='contact'>
            <div className='container mx-auto px-4'>
                <h2 className='text-3xl font-bold text-center mb-12'>Liên hệ với chúng tôi</h2>

                <div
                    ref={ref}
                    className={`grid grid-cols-1 lg:grid-cols-2 gap-8 transition-all duration-1000 transform ${
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                    }`}
                >
                    <div className='bg-white rounded-xl shadow-md overflow-hidden'>
                        <div className='p-8'>
                            <h3 className='text-2xl font-semibold mb-6'>Gửi tin nhắn cho chúng tôi</h3>

                            <form>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                                    <div>
                                        <label className='block text-gray-700 mb-2'>Họ và tên</label>
                                        <input
                                            type='text'
                                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                            placeholder='Nhập họ và tên'
                                        />
                                    </div>
                                    <div>
                                        <label className='block text-gray-700 mb-2'>Email</label>
                                        <input
                                            type='email'
                                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                            placeholder='Nhập địa chỉ email'
                                        />
                                    </div>
                                </div>

                                <div className='mb-6'>
                                    <label className='block text-gray-700 mb-2'>Tiêu đề</label>
                                    <input
                                        type='text'
                                        className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                        placeholder='Nhập tiêu đề'
                                    />
                                </div>

                                <div className='mb-6'>
                                    <label className='block text-gray-700 mb-2'>Nội dung</label>
                                    <textarea
                                        className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32'
                                        placeholder='Nhập nội dung tin nhắn'
                                    ></textarea>
                                </div>

                                <button
                                    type='submit'
                                    className='bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors w-full'
                                >
                                    Gửi tin nhắn
                                </button>
                            </form>

                            {/* <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-8'>
                                <div className='flex items-start space-x-3'>
                                    <div className='bg-blue-100 text-blue-600 p-2 rounded-full'>
                                        <Phone size={20} />
                                    </div>
                                    <div>
                                        <h4 className='font-medium'>Điện thoại</h4>
                                        <p className='text-gray-600'>0123 456 789</p>
                                    </div>
                                </div>

                                <div className='flex items-start space-x-3'>
                                    <div className='bg-blue-100 text-blue-600 p-2 rounded-full'>
                                        <Mail size={20} />
                                    </div>
                                    <div>
                                        <h4 className='font-medium'>Email</h4>
                                        <p className='text-gray-600'>info@shopfinity.com</p>
                                    </div>
                                </div>

                                <div className='flex items-start space-x-3'>
                                    <div className='bg-blue-100 text-blue-600 p-2 rounded-full'>
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <h4 className='font-medium'>Địa chỉ</h4>
                                        <p className='text-gray-600'>123 Đường ABC, Quận XYZ, Hà Nội</p>
                                    </div>
                                </div>
                            </div> */}
                        </div>
                    </div>

                    <div className='bg-gray-200 rounded-xl shadow-md overflow-hidden h-full'>
                        <iframe
                            src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.6056899727582!2d106.73131493886945!3d10.841457461835278!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317527cff6555285%3A0x4a52356377b7c2b6!2zMTExQSDEkC4gMzgsIEtodSBQaOG7kSA4LCBUaOG7pyDEkOG7qWMsIEjhu5MgQ2jDrSBNaW5oLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1745250780675!5m2!1svi!2s'
                            width='100%'
                            height='100%'
                            style={{ border: 0 }}
                            allowFullScreen
                            loading='lazy'
                            referrerPolicy='no-referrer-when-downgrade'
                        ></iframe>
                    </div>
                </div>
            </div>
        </section>
    )
}

// Footer Component
const Footer = () => {
    return (
        <footer className='bg-gray-900 text-white pt-16 pb-8'>
            <div className='container mx-auto px-4'>
                <div className='flex justify-between'>
                    <div className='mr-0 w-[350px]'>
                        <h1 className='text-2xl w-fit font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                            SHOPFINITY
                        </h1>

                        <p className='text-gray-400 mb-6'>
                            Nhà cung cấp thiết bị điện tử và giải pháp tự động hóa hàng đầu Việt Nam. Chúng tôi mang đến
                            những sản phẩm chất lượng cao và dịch vụ hoàn hảo.
                        </p>
                        <div className='flex space-x-4'>
                            <a
                                href='#'
                                className='bg-gray-800 hover:bg-blue-600 transition-colors w-[40px] h-[40px] flex items-center justify-center rounded-full'
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
                                className='bg-gray-800 hover:bg-blue-600 transition-colors w-[40px] h-[40px] flex items-center justify-center rounded-full'
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
                                className='bg-gray-800 hover:bg-blue-600 transition-colors w-[40px] h-[40px] flex items-center justify-center rounded-full'
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
                                className='bg-gray-800 hover:bg-blue-600 transition-colors w-[40px] h-[40px] flex items-center justify-center rounded-full'
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
                                    <a href='#' className='text-gray-400 hover:text-white transition-colors'>
                                        Trang chủ
                                    </a>
                                </li>
                                <li>
                                    <a href='#intro' className='text-gray-400 hover:text-white transition-colors'>
                                        Về chúng tôi
                                    </a>
                                </li>
                                <li>
                                    <a href='#product' className='text-gray-400 hover:text-white transition-colors'>
                                        Sản phẩm
                                    </a>
                                </li>
                                {/* <li>
                                    <a href='#' className='text-gray-400 hover:text-white transition-colors'>
                                        Dịch vụ
                                    </a>
                                </li> */}
                                <li>
                                    <a href='#blog' className='text-gray-400 hover:text-white transition-colors'>
                                        Tin tức
                                    </a>
                                </li>
                                <li>
                                    <a href='#contact' className='text-gray-400 hover:text-white transition-colors'>
                                        Liên hệ
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className='text-lg font-semibold mb-6'>Danh mục sản phẩm</h3>
                            <ul className='space-y-3'>
                                <li>
                                    <a href='#' className='text-gray-400 hover:text-white transition-colors'>
                                        Thiết bị thông minh
                                    </a>
                                </li>
                                <li>
                                    <a href='#' className='text-gray-400 hover:text-white transition-colors'>
                                        Thiết bị điện tử
                                    </a>
                                </li>
                                <li>
                                    <a href='#' className='text-gray-400 hover:text-white transition-colors'>
                                        Giải pháp tự động
                                    </a>
                                </li>
                                <li>
                                    <a href='#' className='text-gray-400 hover:text-white transition-colors'>
                                        An ninh thông minh
                                    </a>
                                </li>
                                <li>
                                    <a href='#' className='text-gray-400 hover:text-white transition-colors'>
                                        Phụ kiện
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className='text-lg font-semibold mb-6'>Thông tin liên hệ</h3>
                            <ul className='space-y-4'>
                                <li className='flex items-start space-x-4'>
                                    <MapPin size={20} className='text-blue-400 flex-shrink-0 mt-1' />
                                    <span className='text-gray-400 max-w-[220px]'>
                                        111A/1, đường số 38, Hiệp Bình Chánh, Thủ Đức, TP.HCM
                                    </span>
                                </li>
                                <li className='flex items-center space-x-4'>
                                    <Phone size={20} className='text-blue-400 flex-shrink-0' />
                                    <span className='text-gray-400'>0123 456 789</span>
                                </li>
                                <li className='flex items-center space-x-4'>
                                    <Mail size={20} className='text-blue-400 flex-shrink-0' />
                                    <span className='text-gray-400'>info@shopfinity.com</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className='pt-8 border-t border-gray-800 text-center text-gray-500'>
                    <p>&copy; 2025 SHOPFINITY E-COMMERCE. Tất cả quyền được bảo lưu.</p>
                </div>
            </div>
        </footer>
    )
}

const FloatButtons = () => {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true)
            } else {
                setIsVisible(false)
            }
        }

        window.addEventListener('scroll', toggleVisibility)
        return () => window.removeEventListener('scroll', toggleVisibility)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }

    return (
        <>
            <div className='fixed bottom-6 right-6 z-40 flex flex-col space-y-4'>
                <button className='bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors'>
                    <ShoppingCart size={24} />
                </button>

                {isVisible && (
                    <button
                        onClick={scrollToTop}
                        className='bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition-colors animate-fadeIn'
                    >
                        <ChevronUp size={24} />
                    </button>
                )}
            </div>
        </>
    )
}

// CSS for custom animations
const CustomStyles = () => {
    return (
        <style jsx>{`
            @keyframes fadeIn {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }

            @keyframes fadeUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes fadeDown {
                from {
                    opacity: 0;
                    transform: translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .animate-fadeIn {
                animation: fadeIn 1s ease forwards;
            }

            .animate-fadeUp {
                animation: fadeUp 1s ease forwards;
                animation-delay: 0.3s;
                opacity: 0;
            }

            .animate-fadeDown {
                animation: fadeDown 1s ease forwards;
                animation-delay: 0.2s;
                opacity: 0;
            }
        `}</style>
    )
}

// Main App Component
export default function ShopfinityLandingPage() {
    return (
        <div className='min-h-screen bg-white'>
            <CustomStyles />
            <Header />
            <HeroSection />
            <FeaturedCategories />
            <BestSellingProducts />
            <SpecialOffer />
            <Features />
            <Testimonials />
            <Newsletter />
            <Brands />
            <BlogPosts />
            <ContactMap />
            <Footer />
            <FloatButtons />
        </div>
    )
}
