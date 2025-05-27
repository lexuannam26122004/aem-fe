'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Search, ChevronDown, Filter, ArrowRight, ChevronLeft, ChevronRight, Zap } from 'lucide-react'
import Banner from './Banner'
import ProductCard from './ProductCard'
import { IProduct } from '@/models/Product'
import EmptyItem from '@/components/EmptyItem'
import EnhancedPagination from '@/components/EnhancedPagination'

// Dữ liệu mẫu
const CATEGORIES = [
    { id: 'all', name: 'Tất cả' },
    { id: 'plc', name: 'PLC & HMI' },
    { id: 'sensors', name: 'Cảm biến' },
    { id: 'motors', name: 'Động cơ & Biến tần' },
    { id: 'robotics', name: 'Robot công nghiệp' },
    { id: 'iot', name: 'IoT & Truyền thông' },
    { id: 'software', name: 'Phần mềm SCADA' }
]

const BRANDS = ['Siemens', 'ABB', 'Schneider', 'Mitsubishi', 'Omron', 'Delta', 'Allen Bradley']

const PRICE_RANGE = [
    { value: '0-1', label: 'Dưới 1 triệu' },
    { value: '1-5', label: '1 - 5 triệu' },
    { value: '5-10', label: '5 - 10 triệu' },
    { value: '10-50', label: '10 - 50 triệu' },
    { value: '50+', label: 'Trên 50 triệu' }
]

// Dữ liệu sản phẩm mẫu
const generateProducts = (): IProduct[] => {
    const covers = [
        'https://api-prod-minimal-v700.pages.dev/assets/images/cover/cover-1.webp',
        'https://api-prod-minimal-v700.pages.dev/assets/images/cover/cover-2.webp',
        'https://api-prod-minimal-v700.pages.dev/assets/images/cover/cover-3.webp',
        'https://api-prod-minimal-v700.pages.dev/assets/images/cover/cover-4.webp',
        'https://api-prod-minimal-v700.pages.dev/assets/images/cover/cover-5.webp'
    ]

    const productNames = [
        'Siemens S7-1200 PLC',
        'Cảm biến quang Omron E3Z',
        'Biến tần ABB ACS580',
        'HMI Weintek MT8071iE',
        'Động cơ servo Mitsubishi MR-J4',
        'Module mở rộng Phoenix Contact',
        'Robot SCARA Epson T6',
        'Cảm biến áp suất IFM',
        'Bộ điều khiển nhiệt độ Autonics',
        'Rơ-le thời gian Carlo Gavazzi',
        'Máy đo lưu lượng Endress+Hauser',
        'Cáp truyền thông Profinet',
        'Màn hình công nghiệp Advantech',
        'Mô-đun Analog Delta DVP',
        'Thiết bị IoT Gateway Moxa',
        'Camera công nghiệp Cognex',
        'Cảm biến độ rung SKF',
        'Cảm biến nhiệt Honeywell',
        'Bộ mã hóa vòng quay Sick',
        'Thiết bị an toàn Pilz'
    ]

    const categories = [
        'PLC',
        'Sensor',
        'Drive',
        'HMI',
        'Servo',
        'Module',
        'Robot',
        'Automation',
        'Temperature',
        'Timer'
    ]
    const suppliers = [
        'Siemens',
        'Omron',
        'ABB',
        'Weintek',
        'Mitsubishi',
        'Phoenix',
        'Epson',
        'IFM',
        'Autonics',
        'Pilz'
    ]
    const units = ['cái', 'bộ', 'chiếc', 'hộp']

    const products: IProduct[] = []

    for (let i = 0; i < 20; i++) {
        const price = Math.floor(Math.random() * 90_000_000) + 1_000_000
        const discountRate = Math.floor(Math.random() * 30) + 5
        const discountPrice = discountRate > 0 ? Math.floor(price * (1 - discountRate / 100)) : price

        products.push({
            id: i + 1,
            serialNumber: `SN-${100000 + i}`,
            discountRate,
            discountPrice,
            price,
            images: [covers[i % covers.length]],
            description: `Mô tả chi tiết cho sản phẩm ${productNames[i]}.`,
            productName: productNames[i],
            categoryName: categories[i % categories.length],
            supplierName: suppliers[i % suppliers.length],
            unit: units[i % units.length],
            warrantyPeriod: Math.floor(Math.random() * 36) + 12, // 12 - 48 tháng
            stockQuantity: Math.floor(Math.random() * 50) + 10,
            soldCount: Math.floor(Math.random() * 500),
            minStockThreshold: Math.floor(Math.random() * 10) + 5,
            rating: parseFloat((Math.random() * 2 + 3).toFixed(1)), // 3.0 - 5.0
            createdAt: new Date(Date.now() - Math.random() * 3_600_000_000).toISOString(), // trong quá khứ
            createdBy: 'admin'
        })
    }

    return products
}

export default function AutomationShop() {
    const [products, setProducts] = useState<IProduct[]>([])
    const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([])
    const [category, setCategory] = useState('all')
    const [priceRange, setPriceRange] = useState<string[]>([])
    const [brands, setBrands] = useState<string[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
    const [selectedSortOption, setSelectedSortOption] = useState('popular')
    // Add this with other imports and state declarations
    const [showScrollTop, setShowScrollTop] = useState(false)

    // Add this effect to track scroll position
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY
            setShowScrollTop(scrollPosition > 300)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Khởi tạo dữ liệu sản phẩm
    useEffect(() => {
        const data = generateProducts()
        setProducts(data)
        setFilteredProducts(data)
    }, [])

    // Xử lý lọc sản phẩm
    useEffect(() => {
        let result = [...products]

        // Lọc theo danh mục
        if (category !== 'all') {
            result = result.filter(product => product.categoryName === category)
        }

        // Lọc theo giá
        if (priceRange.length > 0) {
            result = result.filter(product => {
                const priceInMillions = product.price / 1000000
                return priceRange.some(range => {
                    if (range === '0-1') return priceInMillions < 1
                    if (range === '1-5') return priceInMillions >= 1 && priceInMillions < 5
                    if (range === '5-10') return priceInMillions >= 5 && priceInMillions < 10
                    if (range === '10-50') return priceInMillions >= 10 && priceInMillions < 50
                    if (range === '50+') return priceInMillions >= 50
                    return false
                })
            })
        }

        // Lọc theo thương hiệu
        if (brands.length > 0) {
            result = result.filter(product => brands.includes(product.supplierName))
        }

        // Lọc theo từ khóa tìm kiếm
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            result = result.filter(
                product =>
                    product.productName.toLowerCase().includes(query) ||
                    product.supplierName.toLowerCase().includes(query) ||
                    product.categoryName.toLowerCase().includes(query)
            )
        }

        // Sắp xếp sản phẩm
        if (selectedSortOption === 'price-asc') {
            result.sort((a, b) => a.price - b.price)
        } else if (selectedSortOption === 'price-desc') {
            result.sort((a, b) => b.price - a.price)
        } else if (selectedSortOption === 'newest') {
            // Giả lập sắp xếp theo mới nhất (trong thực tế sẽ dùng createdAt)
            result.sort((a, b) => b.id - a.id)
        } else {
            // Mặc định: phổ biến (theo rating và số lượng đánh giá)
            result.sort((a, b) => Number(b.rating) * b.rating - Number(a.rating) * a.rating)
        }

        setFilteredProducts(result)
    }, [products, category, priceRange, brands, searchQuery, selectedSortOption])

    // Xử lý thay đổi lọc giá
    const handlePriceChange = (value: string) => {
        if (priceRange.includes(value)) {
            setPriceRange(priceRange.filter(item => item !== value))
        } else {
            setPriceRange([...priceRange, value])
        }
    }

    // Xử lý thay đổi lọc thương hiệu
    const handleBrandChange = (value: string) => {
        if (brands.includes(value)) {
            setBrands(brands.filter(item => item !== value))
        } else {
            setBrands([...brands, value])
        }
    }

    const ProductHotSale = ({ title, products }: ProductHotSaleProps) => {
        const [currentPage, setCurrentPage] = useState(0)
        const [currentIndex, setCurrentIndex] = useState(0)
        products = products.slice(0, 19)
        const totalPages = Math.min(Math.floor((products.length - 1) / 2), 10)

        const nextPage = () => {
            if (currentPage + 1 >= totalPages) {
                return
            }
            setCurrentIndex(prev => prev + 2)
            setCurrentPage(prev => prev + 1)
        }

        const setPage = (page: number) => {
            setCurrentIndex(page * 2)
            setCurrentPage(page)
        }

        const prevPage = () => {
            setCurrentIndex(prev => Math.max(prev - 2, 0))
            setCurrentPage(prev => Math.max(prev - 1, 0))
        }

        const currentProducts = products.slice(currentIndex, Math.min(currentIndex + 4, 20))

        return (
            <div className='rounded-xl overflow-hidden relative'>
                {/* Simplified enhanced background */}
                <div className='absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-500 to-blue-400'>
                    {/* Simplified pattern - just using background dots */}
                    <div
                        className='absolute inset-0 opacity-20'
                        style={{
                            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
                            backgroundSize: '20px 20px'
                        }}
                    ></div>

                    {/* Animated pulsing circles */}
                    <div className='absolute top-0 right-0 w-80 h-80 bg-blue-300 rounded-full opacity-20 -translate-y-1/2 translate-x-1/3 blur-xl'></div>
                    <div className='absolute bottom-0 left-0 w-64 h-64 bg-blue-200 rounded-full opacity-20 translate-y-1/3 -translate-x-1/4 blur-lg'></div>
                    <div className='absolute top-1/3 left-1/4 w-32 h-32 bg-white rounded-full opacity-10 blur-md'></div>
                    <div className='absolute bottom-1/4 right-1/4 w-40 h-40 bg-blue-100 rounded-full opacity-15 blur-md'></div>

                    {/* Light beams */}
                    <div className='absolute top-0 left-1/2 w-1/3 h-full bg-gradient-to-b from-blue-100 to-transparent opacity-10'></div>
                    <div className='absolute top-0 right-1/4 w-1/4 h-full bg-gradient-to-b from-white to-transparent opacity-5'></div>
                </div>

                {/* Content container */}
                <div className='relative z-10 p-4 text-white'>
                    {/* Header with enhanced hot label */}
                    <div className='flex items-center mt-1 justify-center mb-6'>
                        <div className='relative'>
                            <h2 className='text-3xl font-extrabold text-white tracking-wide text-center px-4'>
                                {title.toUpperCase()}
                            </h2>
                            <div className='absolute -top-2 -right-[76px] flex items-center justify-center'>
                                <div className='relative animate-pulse'>
                                    <div className='absolute inset-0 bg-red-500 rounded-lg blur'></div>
                                    <div className='relative bg-gradient-to-r from-red-600 to-red-500 text-white font-black py-1 px-3 rounded-lg flex items-center border border-red-400 shadow-lg'>
                                        <Zap size={18} className='mr-1' />
                                        <span>HOT</span>
                                    </div>
                                </div>
                            </div>
                            <div className='h-1 w-36 bg-gradient-to-r from-transparent via-white to-transparent rounded-full mx-auto mt-3 opacity-70'></div>
                        </div>
                    </div>

                    {/* Product grid */}
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
                        {currentProducts.map((product, index) => (
                            <ProductCard key={index} product={product} isHotSale={true} />
                        ))}
                    </div>

                    {/* Navigation buttons */}
                    <button
                        onClick={prevPage}
                        className='absolute left-0 top-1/2 -translate-y-1/2 bg-blue-600 bg-opacity-20 hover:bg-opacity-40 text-white pr-2 pl-1 py-2 rounded-r-lg shadow-lg backdrop-blur-sm transition-all border border-white border-opacity-30'
                        aria-label='Previous page'
                    >
                        <ChevronLeft size={24} />
                    </button>

                    <button
                        onClick={nextPage}
                        className='absolute right-0 top-1/2 -translate-y-1/2 bg-blue-600 bg-opacity-20 hover:bg-opacity-40 text-white pr-1 pl-2 py-2 rounded-l-lg shadow-lg backdrop-blur-sm transition-all border border-white border-opacity-30'
                        aria-label='Next page'
                    >
                        <ChevronRight size={24} />
                    </button>

                    {/* Page indicators */}
                    {totalPages > 1 && (
                        <div className='flex justify-center mt-6 space-x-2 pb-2'>
                            {Array.from({ length: totalPages }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setPage(index)}
                                    className={`w-2 h-2 rounded-full transition-all ${
                                        currentPage === index
                                            ? 'bg-white w-6'
                                            : 'bg-white bg-opacity-50 hover:bg-opacity-70'
                                    }`}
                                    aria-label={`Go to page ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        )
    }

    type ProductHotSaleProps = {
        title: string
        products: IProduct[]
        viewAll?: boolean
    }

    const ProductSection = ({ title, products, viewAll = false }: ProductHotSaleProps) => {
        return (
            <div>
                <div className='flex justify-between items-center mb-6'>
                    <h2 className='text-xl font-bold text-gray-800'>{title}</h2>
                    {viewAll && (
                        <button className='text-blue-600 flex items-center hover:text-blue-800'>
                            Xem tất cả <ArrowRight size={16} className='ml-1' />
                        </button>
                    )}
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                    {products.slice(0, 4).map((product, index) => (
                        <ProductCard product={product} key={index} />
                    ))}
                </div>
            </div>
        )
    }

    const [availability, setAvailability] = useState('all')
    const [selectedTechFeatures, setSelectedTechFeatures] = useState<string[]>([])
    const [itemsPerPage, setItemsPerPage] = useState(15)
    const [currentPage, setCurrentPage] = useState(1)

    useEffect(() => {}, [setItemsPerPage])

    // Thay đổi trang trong phân trang
    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    // Các hàm xử lý không thay đổi
    const handleResetFilters = () => {
        setSelectedTechFeatures([])
        setSelectedSortOption('popular')
        setAvailability('all')
    }

    return (
        <div className='max-w-7xl mx-auto sm:px-6 space-y-8 lg:px-8'>
            <Banner />

            <ProductSection title='Sản phẩm nổi bật' products={products} viewAll={true} />

            {/* Hot Sales */}
            <ProductHotSale title='Flash Sales' products={products} viewAll={true} />

            {/* Sản phẩm đề xuất */}
            <ProductSection title='Sản phẩm đề xuất' products={products} viewAll={true} />

            {/* Tất cả sản phẩm với bộ lọc */}
            <div className='mt-6'>
                <h2 className='text-xl font-bold text-gray-800 mb-6'>Tất cả sản phẩm</h2>

                <div className='flex flex-col lg:flex-row gap-6'>
                    {/* Mobile filter button */}
                    <div className='lg:hidden mb-4'>
                        <button
                            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                            className='w-full flex items-center font-medium justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg'
                        >
                            <Filter size={18} />
                            {mobileFiltersOpen ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
                        </button>
                    </div>

                    {/* Filters sidebar */}
                    <div className={`lg:w-[calc(25%_-_18px)] ${mobileFiltersOpen ? 'block' : 'hidden'} lg:block`}>
                        <div className='bg-white rounded-[15px] shadow-lg p-6 border border-blue-100'>
                            {/* Header with gradient */}
                            <div className='bg-gradient-to-r from-blue-600 flex items-center to-blue-400 h-[65px] -m-6 mb-6 pl-6 rounded-t-[14px]'>
                                <h2 className='text-white font-bold text-lg'>Bộ lọc sản phẩm</h2>
                            </div>

                            {/* Category filter */}
                            <div className='mb-6'>
                                <div className='flex items-center mb-4'>
                                    <div className='w-1 h-6 bg-blue-500 rounded-full mr-2'></div>
                                    <h3 className='font-bold text-gray-800'>Danh mục sản phẩm</h3>
                                </div>
                                <ul className='space-y-1.5 pl-1'>
                                    {CATEGORIES.map(cat => (
                                        <li key={cat.id}>
                                            <button
                                                className={`w-full text-left py-2 px-3 rounded-lg transition-all duration-200 flex items-center ${
                                                    category === cat.id
                                                        ? 'bg-blue-500 hover:bg-blue-600 text-white font-medium shadow-md'
                                                        : 'hover:bg-blue-50 text-gray-700'
                                                }`}
                                                onClick={() => setCategory(cat.id)}
                                            >
                                                {category === cat.id && (
                                                    <svg
                                                        xmlns='http://www.w3.org/2000/svg'
                                                        className='h-4 w-4 mr-2'
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
                                                )}
                                                {cat.name}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Price filter */}
                            <div className='mb-6'>
                                <div className='flex items-center mb-4'>
                                    <div className='w-1 h-6 bg-blue-500 rounded-full mr-2'></div>
                                    <h3 className='font-bold text-gray-800'>Khoảng giá</h3>
                                </div>
                                <div className='space-y-1.5 pl-1'>
                                    {PRICE_RANGE.map(range => (
                                        <label
                                            key={range.value}
                                            className={`w-full text-left py-2 px-3 cursor-pointer rounded-lg hover:bg-blue-50 transition-all duration-200 flex items-center ${
                                                priceRange.includes(range.value) ? 'bg-blue-100' : ''
                                            }`}
                                        >
                                            <input
                                                type='checkbox'
                                                className='w-[17px] h-[17px] rounded text-blue-600 accent-[#3675ff] focus:ring-blue-400 border-gray-300'
                                                checked={priceRange.includes(range.value)}
                                                onChange={() => handlePriceChange(range.value)}
                                            />
                                            <span className='ml-3 text-gray-700'>{range.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Brand filter */}
                            <div className='mb-6'>
                                <div className='flex items-center mb-4'>
                                    <div className='w-1 h-6 bg-blue-500 rounded-full mr-2'></div>
                                    <h3 className='font-bold text-gray-800'>Thương hiệu</h3>
                                </div>
                                <div className='space-y-1.5 pl-1'>
                                    {BRANDS.map(brand => (
                                        <label
                                            key={brand}
                                            className={`w-full text-left py-2 px-3 cursor-pointer hover:bg-blue-50 rounded-lg transition-all duration-200 flex items-center ${
                                                brands.includes(brand) ? 'bg-blue-100' : ''
                                            }`}
                                        >
                                            <input
                                                type='checkbox'
                                                className='w-[17px] h-[17px] rounded text-blue-600 accent-[#3675ff] focus:ring-blue-400 border-gray-300'
                                                checked={brands.includes(brand)}
                                                onChange={() => handleBrandChange(brand)}
                                            />
                                            <span className='ml-3 text-gray-700'>{brand}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Clear filters button with gradient hover */}
                            <button
                                className='w-full bg-blue-500 text-white py-3 px-6 rounded-lg font-medium transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-400 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                                onClick={() => {
                                    setCategory('all')
                                    setPriceRange([])
                                    setBrands([])
                                    setSearchQuery('')
                                }}
                            >
                                Xóa tất cả bộ lọc
                            </button>
                        </div>
                    </div>

                    {/* Product list */}
                    <div className='flex-1'>
                        {/* Sorting and view options */}
                        <div className='mb-6 bg-white rounded-[15px] shadow-lg border border-blue-100'>
                            {/* Header with gradient - matching the filter style */}
                            <div className='bg-gradient-to-r h-[65px] flex items-center rounded-t-[14px] from-blue-600 to-blue-400 pl-6'>
                                <h2 className='text-white font-bold text-lg flex items-center'>
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        className='h-5 w-5 mr-3'
                                        fill='none'
                                        viewBox='0 0 24 24'
                                        stroke='currentColor'
                                    >
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            strokeWidth={2}
                                            d='M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z'
                                        />
                                    </svg>
                                    Tìm kiếm và Sắp xếp
                                </h2>
                            </div>

                            {/* Controls panel - Thay thế các select boxes bằng components mới */}
                            <div className='p-6 grid grid-cols-1 md:grid-cols-3 gap-6'>
                                {/* Technical Features Filter - Sử dụng component mới */}
                                <TechFeaturesSelect
                                    label='Tính năng nổi bật:'
                                    selectedValues={selectedTechFeatures}
                                    onChange={setSelectedTechFeatures}
                                    options={DROPDOWN_OPTIONS.techFeatures}
                                />

                                {/* Sort options - Sử dụng component mới */}
                                <EnhancedSelect
                                    label='Sắp xếp theo:'
                                    value={selectedSortOption}
                                    onChange={setSelectedSortOption}
                                    options={DROPDOWN_OPTIONS.sort}
                                />

                                {/* Availability filter - Sử dụng component mới */}
                                <EnhancedSelect
                                    label='Tình trạng hàng:'
                                    value={availability}
                                    onChange={setAvailability}
                                    options={DROPDOWN_OPTIONS.availability}
                                />
                            </div>

                            {/* Results summary - Giữ nguyên phần này */}
                            <div className='px-6 py-5 flex items-center justify-between border-t border-blue-100'>
                                <span className='text-gray-700 font-medium text-sm flex items-center'>
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        className='h-4 w-4 mr-2 text-blue-500'
                                        fill='none'
                                        viewBox='0 0 24 24'
                                        stroke='currentColor'
                                    >
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            strokeWidth={2}
                                            d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
                                        />
                                    </svg>
                                    Hiển thị {filteredProducts.length} sản phẩm
                                </span>

                                <button
                                    onClick={handleResetFilters}
                                    className='text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center transition-colors'
                                >
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        className='h-4 w-4 mr-2'
                                        fill='none'
                                        viewBox='0 0 24 24'
                                        stroke='currentColor'
                                    >
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            strokeWidth={2}
                                            d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
                                        />
                                    </svg>
                                    Khôi phục mặc định
                                </button>
                            </div>
                        </div>

                        {/* Product grid/list */}
                        {filteredProducts.length > 0 ? (
                            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                                {filteredProducts.map((product, index) => (
                                    <ProductCard product={product} key={index} />
                                ))}
                            </div>
                        ) : (
                            <EmptyItem
                                title='Không tìm thấy sản phẩm'
                                description='Rất tiếc, chúng tôi không tìm thấy sản phẩm nào phù hợp với bộ lọc của bạn.'
                                buttonText='Xóa bộ lọc'
                                icon={<Search className='w-10 h-10 text-blue-600' />}
                                onClick={() => {
                                    setCategory('all')
                                    setPriceRange([])
                                    setBrands([])
                                    setSearchQuery('')
                                }}
                            />
                        )}

                        {filteredProducts.length > 0 && (
                            <div className='mt-8'>
                                <EnhancedPagination
                                    totalItems={filteredProducts.length}
                                    itemsPerPage={itemsPerPage}
                                    currentPage={currentPage}
                                    onPageChange={handlePageChange}
                                    siblingCount={1}
                                    showFirstLast={true}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick access floating buttons - Premium Design */}
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
                        <svg className='w-5 h-5' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
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
                <button
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
                </button>

                {/* Call button */}
                <button
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
                </button>
            </div>

            {/* Add refined animations */}
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
        </div>
    )
}

const DROPDOWN_OPTIONS = {
    sort: [
        { value: 'popular', label: 'Phổ biến nhất' },
        { value: 'newest', label: 'Mới nhất trước' },
        { value: 'price-asc', label: 'Giá thấp đến cao' },
        { value: 'price-desc', label: 'Giá cao đến thấp' }
    ],
    availability: [
        { value: 'all', label: 'Tất cả sản phẩm' },
        { value: 'in-stock', label: 'Còn hàng' },
        { value: 'out-of-stock', label: 'Hết hàng' },
        { value: 'pre-order', label: 'Đặt trước' }
    ],
    techFeatures: [
        { value: 'ce', label: 'Có chứng nhận CE' },
        { value: 'ip68', label: 'Chống nước IP68' },
        { value: 'rs485', label: 'Giao tiếp RS485' },
        { value: 'modbus', label: 'Hỗ trợ MODBUS' },
        { value: 'safety', label: 'Tiêu chuẩn an toàn SIL' }
    ]
}

const useDropdownState = () => {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement | null>(null)

    const toggleDropdown = useCallback(() => {
        setIsOpen(prev => !prev)
    }, [])

    const closeDropdown = useCallback(() => {
        setIsOpen(false)
    }, [])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                closeDropdown()
            }
        }

        // Only add listener when dropdown is open
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
            return () => document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen, closeDropdown])

    return { isOpen, toggleDropdown, closeDropdown, dropdownRef }
}

type EnhancedSelectProps = {
    label: string
    value: string
    onChange: (value: string) => void
    options: { value: string; label: string; icon?: string }[]
    type?: string
}

export const EnhancedSelect = ({ label, value, onChange, options }: EnhancedSelectProps) => {
    const { isOpen, toggleDropdown, closeDropdown, dropdownRef } = useDropdownState()

    // Find the currently selected option
    const selectedOption = options.find(opt => opt.value === value)

    const handleChange = (newValue: string) => {
        onChange(newValue)
        closeDropdown()
    }

    return (
        <div className='w-full'>
            <label className='text-gray-700 font-medium mb-1 block text-sm'>{label}</label>
            <div className='relative' ref={dropdownRef}>
                <div
                    onClick={toggleDropdown}
                    className={`w-full bg-white border rounded-lg py-2.5 px-4 flex justify-between items-center cursor-pointer transition-all ${
                        isOpen ? 'border-blue-500 shadow-md' : 'border-blue-100 hover:bg-blue-50'
                    }`}
                >
                    <div className='flex items-center'>
                        {selectedOption?.icon && <span className='mr-2'>{selectedOption.icon}</span>}
                        <span className='text-gray-700'>{selectedOption?.label || 'Chọn một option'}</span>
                    </div>
                    <ChevronDown
                        className={`text-blue-500 w-5 h-5 transition-transform duration-200 ${
                            isOpen ? 'transform rotate-180' : ''
                        }`}
                    />
                </div>

                {isOpen && (
                    <div
                        className='absolute mt-1 w-full space-y-1 p-2 bg-white border border-blue-100 rounded-lg shadow-lg z-10 max-h-60 overflow-auto'
                        style={{ animation: 'fadeIn 150ms ease-out' }}
                    >
                        {options.map(option => (
                            <div
                                key={option.value}
                                onClick={() => handleChange(option.value)}
                                className={`px-4 py-2.5 rounded-md flex items-center cursor-pointer transition-colors hover:bg-blue-50 ${
                                    value === option.value ? 'bg-blue-100/60 text-blue-600' : 'text-gray-700'
                                }`}
                            >
                                {option.icon && <span className='mr-3 text-lg'>{option.icon}</span>}
                                <span>{option.label}</span>
                            </div>
                        ))}
                    </div>
                )}

                <select className='sr-only' value={value} onChange={e => onChange(e.target.value)} aria-hidden='true'>
                    {options.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    )
}

type TechFeaturesSelectProps = {
    label: string
    selectedValues: string[]
    onChange: (values: string[]) => void
    options: { value: string; label: string; icon?: string }[]
}

export const TechFeaturesSelect = ({ label, selectedValues = [], onChange, options }: TechFeaturesSelectProps) => {
    const { isOpen, toggleDropdown, dropdownRef } = useDropdownState()

    const handleChange = (feature: string) => {
        const newSelection = selectedValues.includes(feature)
            ? selectedValues.filter(f => f !== feature)
            : [...selectedValues, feature]
        onChange(newSelection)
    }

    return (
        <div className='w-full'>
            <label className='text-gray-700 font-medium mb-1 block text-sm'>{label}</label>
            <div className='relative' ref={dropdownRef}>
                <button
                    onClick={toggleDropdown}
                    className={`w-full bg-white border rounded-lg py-2.5 px-4 text-left text-gray-700 flex items-center justify-between transition-all hover:bg-blue-50 ${
                        isOpen ? 'border-blue-500 shadow-md' : 'border-blue-100'
                    }`}
                >
                    <span>
                        {selectedValues.length > 0
                            ? `${selectedValues.length} tính năng đã chọn`
                            : 'Lọc theo tiêu chuẩn kỹ thuật'}
                    </span>
                    <ChevronDown
                        className={`text-blue-500 w-5 h-5 transition-transform duration-200 ${
                            isOpen ? 'transform rotate-180' : ''
                        }`}
                    />
                </button>

                {isOpen && (
                    <div
                        className='absolute z-10 w-full mt-1 rounded-lg shadow-lg p-2 border border-blue-100 bg-white'
                        style={{ animation: 'fadeIn 150ms ease-out' }}
                    >
                        <div className='space-y-1'>
                            {options.map(option => (
                                <label
                                    key={option.value}
                                    className='flex items-center px-4 py-2.5 hover:bg-blue-50 rounded-md cursor-pointer transition-all'
                                >
                                    <input
                                        type='checkbox'
                                        className='w-4 h-4 rounded text-blue-600 accent-[#3675ff] focus:ring-blue-400 border-gray-300'
                                        checked={selectedValues.includes(option.value)}
                                        onChange={() => handleChange(option.value)}
                                    />
                                    <div className='ml-2 flex items-center'>
                                        {option.icon && <span className='mr-2'>{option.icon}</span>}
                                        <span className='text-gray-700'>{option.label}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
