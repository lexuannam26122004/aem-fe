'use client'

import { IProduct } from '@/models/Product'
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import ProductCard from './ProductCard'

type ProductHotSaleProps = {
    title: string
    products: IProduct[]
    viewAll?: boolean
}

const ProductHotSale = ({ title, products }: ProductHotSaleProps) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isAnimating, setIsAnimating] = useState(false)
    const [startX, setStartX] = useState(0)
    const [isDragging, setIsDragging] = useState(false)
    const [dragOffset, setDragOffset] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)

    const itemsPerView = 4
    const slideBy = 2

    // Xử lý sự kiện nhấn ngoài khi đang kéo
    useEffect(() => {
        const handleMouseUp = () => {
            if (isDragging) {
                handleDragEnd()
            }
        }

        document.addEventListener('mouseup', handleMouseUp)
        document.addEventListener('touchend', handleMouseUp)

        return () => {
            document.removeEventListener('mouseup', handleMouseUp)
            document.removeEventListener('touchend', handleMouseUp)
        }
    }, [isDragging])

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const handleTransitionEnd = () => {
            setIsAnimating(false)
            setDragOffset(0)
        }

        container.addEventListener('transitionend', handleTransitionEnd)
        // Backup timer để đảm bảo isAnimating sẽ được reset
        const timeout = setTimeout(() => setIsAnimating(false), 600)

        return () => {
            container.removeEventListener('transitionend', handleTransitionEnd)
            clearTimeout(timeout)
        }
    }, [currentIndex])

    if (!Array.isArray(products) || products.length === 0) {
        return (
            <div className='text-center text-white p-6'>
                <p>Không có sản phẩm nào để hiển thị.</p>
            </div>
        )
    }

    const minProducts = itemsPerView * 2
    const multiplier = Math.ceil(minProducts / products.length)
    const safeProducts = Array(multiplier).fill(products).flat().slice(0, 20) // giới hạn tối đa 20 phần tử

    const totalItems = safeProducts.length
    const totalPages = Math.ceil((totalItems - itemsPerView) / slideBy) + 1

    // Tính toán độ rộng của mỗi item
    const itemWidth = 100 / itemsPerView
    const containerWidth = (totalItems * 100) / itemsPerView

    const nextSlide = () => {
        if (isAnimating) return
        setIsAnimating(true)
        // Đảm bảo không vượt quá giới hạn tối đa
        const nextIndex = Math.min(currentIndex + slideBy, totalItems - itemsPerView)
        setCurrentIndex(nextIndex)
    }

    const prevSlide = () => {
        if (isAnimating) return
        setIsAnimating(true)
        // Đảm bảo không giảm dưới 0
        const prevIndex = Math.max(currentIndex - slideBy, 0)
        setCurrentIndex(prevIndex)
    }

    const goToPage = (pageIndex: number) => {
        if (isAnimating) return
        setIsAnimating(true)
        const newIndex = Math.min(pageIndex * slideBy, totalItems - itemsPerView)
        setCurrentIndex(newIndex)
    }

    const handleDragStart = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        // Hỗ trợ cả touch event và mouse event
        const clientX = e.type.includes('touch')
            ? (e as React.TouchEvent<HTMLDivElement>).touches[0].clientX
            : (e as React.MouseEvent<HTMLDivElement>).clientX
        setStartX(clientX)
        setIsDragging(true)
        setDragOffset(0)
    }

    const handleDragMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        if (!isDragging) return

        // Ngăn không cho trang cuộn khi đang kéo carousel
        e.preventDefault()

        // Hỗ trợ cả touch event và mouse event
        const clientX = e.type.includes('touch')
            ? (e as React.TouchEvent<HTMLDivElement>).touches[0].clientX
            : (e as React.MouseEvent<HTMLDivElement>).clientX
        const container = containerRef.current
        if (!container) return

        const containerWidth = container.offsetWidth
        const delta = clientX - startX

        // Tính toán offset dựa trên chiều rộng container
        const offsetPercent = (delta / containerWidth) * 100
        setDragOffset(offsetPercent)
    }

    const handleDragEnd = () => {
        if (!isDragging) return
        setIsDragging(false)

        // Xác định hướng và mức độ kéo
        const threshold = 10 // Ngưỡng % cần kéo để chuyển slide

        if (dragOffset > threshold) {
            prevSlide()
        } else if (dragOffset < -threshold) {
            nextSlide()
        } else {
            // Reset lại vị trí nếu kéo không đủ ngưỡng
            setDragOffset(0)
        }
    }

    const currentPage = Math.floor(currentIndex / slideBy) % totalPages

    // Tính toán transform cho container
    const getTransformValue = () => {
        const baseTransform = -(currentIndex * itemWidth)
        const dragAdjustment = isDragging ? dragOffset : 0
        return `translateX(${baseTransform + dragAdjustment}%)`
    }

    return (
        <div className='rounded-xl overflow-hidden relative'>
            {/* Background effects */}
            <div className='absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-500 to-blue-400'>
                <div
                    className='absolute inset-0 opacity-20'
                    style={{
                        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
                        backgroundSize: '20px 20px'
                    }}
                />
                <div className='absolute top-0 right-0 w-80 h-80 bg-blue-300 rounded-full opacity-20 -translate-y-1/2 translate-x-1/3 blur-xl'></div>
                <div className='absolute bottom-0 left-0 w-64 h-64 bg-blue-200 rounded-full opacity-20 translate-y-1/3 -translate-x-1/4 blur-lg'></div>
                <div className='absolute top-1/3 left-1/4 w-32 h-32 bg-white rounded-full opacity-10 blur-md'></div>
                <div className='absolute bottom-1/4 right-1/4 w-40 h-40 bg-blue-100 rounded-full opacity-15 blur-md'></div>
            </div>

            {/* Content */}
            <div className='relative z-30 p-6 text-white'>
                <div className='flex items-center justify-center mb-6'>
                    <div className='relative'>
                        <h2 className='text-3xl font-extrabold text-white tracking-wide text-center px-4'>
                            {title.toUpperCase()}
                        </h2>
                        <div className='absolute -top-2 -right-[76px]'>
                            <div className='relative'>
                                <div className='absolute inset-0 bg-red-500 rounded-lg blur animate-pulse'></div>
                                <div className='relative bg-gradient-to-r from-red-600 to-red-500 text-white font-black py-1 px-3 rounded-lg flex items-center border border-red-400 shadow-lg'>
                                    <Zap size={18} className='mr-1 animate-pulse' />
                                    <span>HOT</span>
                                </div>
                            </div>
                        </div>
                        <div className='h-1 w-36 bg-gradient-to-r from-transparent via-white to-transparent rounded-full mx-auto mt-3 opacity-70'></div>
                    </div>
                </div>

                <div
                    className='overflow-hidden cursor-grab'
                    onMouseDown={handleDragStart}
                    onTouchStart={handleDragStart}
                    onMouseMove={handleDragMove}
                    onTouchMove={handleDragMove}
                    onMouseUp={handleDragEnd}
                    onTouchEnd={handleDragEnd}
                >
                    <div
                        ref={containerRef}
                        className={`grid ${
                            isAnimating || isDragging ? '' : 'transition-transform duration-500 ease-out'
                        }`}
                        style={{
                            transform: getTransformValue(),
                            width: `${containerWidth}%`,
                            gridTemplateColumns: `repeat(${totalItems}, minmax(0, 1fr))`,
                            cursor: isDragging ? 'grabbing' : 'grab',
                            transition: isDragging ? 'none' : 'transform 500ms ease-out'
                        }}
                    >
                        {safeProducts.map((product, index) => (
                            <div key={index} className='px-3' style={{ width: `${100 / totalItems}%` }}>
                                1234123412341234214314123
                                <ProductCard product={product} isHotSale={true} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Navigation buttons */}
                <button
                    onClick={prevSlide}
                    disabled={isAnimating || currentIndex === 0}
                    className='absolute left-0 top-1/2 -translate-y-1/2 bg-blue-600 bg-opacity-20 hover:bg-opacity-40 text-white pr-2 pl-1 py-2 rounded-r-lg shadow-lg backdrop-blur-sm transition-all border border-white border-opacity-30 disabled:opacity-50 disabled:cursor-not-allowed z-40'
                >
                    <ChevronLeft size={24} />
                </button>
                <button
                    onClick={nextSlide}
                    disabled={isAnimating || currentIndex >= totalItems - itemsPerView}
                    className='absolute right-0 top-1/2 -translate-y-1/2 bg-blue-600 bg-opacity-20 hover:bg-opacity-40 text-white pr-1 pl-2 py-2 rounded-l-lg shadow-lg backdrop-blur-sm transition-all border border-white border-opacity-30 disabled:opacity-50 disabled:cursor-not-allowed z-40'
                >
                    <ChevronRight size={24} />
                </button>

                {/* Dots */}
                {totalPages > 1 && (
                    <div className='flex justify-center mt-6 space-x-2'>
                        {Array.from({ length: totalPages }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToPage(index)}
                                className={`w-2 h-2 rounded-full transition-all ${
                                    currentPage === index
                                        ? 'bg-white w-6'
                                        : 'bg-white bg-opacity-50 hover:bg-opacity-70'
                                }`}
                                disabled={isAnimating}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProductHotSale
