import { useState, useEffect, useMemo } from 'react'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

export default function EnhancedPagination({
    totalItems = 100, // Tổng số items
    itemsPerPage = 10, // Số items trên mỗi trang
    currentPage = 1, // Trang hiện tại
    onPageChange = (number: number) => {
        console.log(`Chuyển đến trang ${number}`)
    }, // Callback khi thay đổi trang
    siblingCount = 1, // Số trang hiển thị bên cạnh trang hiện tại
    showFirstLast = true, // Hiển thị nút trang đầu/cuối
    className = '' // Custom className
}) {
    // Tính tổng số trang
    const totalPages = Math.ceil(totalItems / itemsPerPage)

    // Demo state - xóa khi triển khai thực tế
    const [page, setPage] = useState(currentPage)

    useEffect(() => {
        setPage(currentPage)
    }, [currentPage])

    // Hàm xử lý thay đổi trang (demo)
    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return
        setPage(newPage)
        onPageChange(newPage)
    }

    // Tạo mảng các trang sẽ hiển thị
    const paginationRange = useMemo(() => {
        // Tính toán phạm vi trang hiện thị
        const totalPageNumbers = siblingCount * 2 + 3 // siblings + current + first + last

        // Nếu số trang ít hơn tổng số nút sẽ hiển thị, hiển thị tất cả
        if (totalPageNumbers >= totalPages) {
            return Array.from({ length: totalPages }, (_, i) => i + 1)
        }

        // Tính toán trang trái cùng và phải cùng sẽ hiển thị
        const leftSiblingIndex = Math.max(page - siblingCount, 1)
        const rightSiblingIndex = Math.min(page + siblingCount, totalPages)

        // Xác định xem có cần hiển thị dấu "..." hay không
        const shouldShowLeftDots = leftSiblingIndex > 2
        const shouldShowRightDots = rightSiblingIndex < totalPages - 1

        // Xây dựng mảng hiển thị
        const result = []

        // Luôn hiển thị trang 1
        if (shouldShowLeftDots) {
            result.push(1)
            if (leftSiblingIndex > 2) {
                result.push('LEFT_DOTS')
            }
        }

        // Thêm các trang xung quanh trang hiện tại
        for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
            result.push(i)
        }

        // Luôn hiển thị trang cuối
        if (shouldShowRightDots) {
            if (rightSiblingIndex < totalPages - 1) {
                result.push('RIGHT_DOTS')
            }
            if (rightSiblingIndex !== totalPages) {
                result.push(totalPages)
            }
        }

        return result
    }, [page, totalPages, siblingCount])

    // Styles cho các nút
    const btnBaseStyle =
        'flex items-center justify-center min-w-[40px] h-10 px-3 rounded-md transition-colors duration-200'
    const btnActiveStyle = 'bg-blue-600 text-white hover:bg-blue-700'
    const btnInactiveStyle = 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    const btnDisabledStyle = 'bg-gray-100 text-gray-400 cursor-not-allowed'

    if (totalPages <= 1) return null

    return (
        <div className={`flex justify-center ${className}`}>
            <nav className='flex items-center space-x-1.5' aria-label='Phân trang'>
                {/* Nút trang đầu tiên */}
                {showFirstLast && (
                    <button
                        onClick={() => handlePageChange(1)}
                        disabled={page === 1}
                        className={`${btnBaseStyle} ${page === 1 ? btnDisabledStyle : btnInactiveStyle}`}
                        aria-label='Trang đầu tiên'
                    >
                        <ChevronsLeft size={18} />
                    </button>
                )}

                {/* Nút trang trước */}
                <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className={`${btnBaseStyle} ${page === 1 ? btnDisabledStyle : btnInactiveStyle}`}
                    aria-label='Trang trước'
                >
                    <ChevronLeft size={18} />
                </button>

                {/* Các số trang */}
                {paginationRange.map((pageNumber, idx) => {
                    if (pageNumber === 'LEFT_DOTS' || pageNumber === 'RIGHT_DOTS') {
                        return (
                            <span key={`dots-${idx}`} className='flex items-center justify-center px-3 h-10'>
                                &hellip;
                            </span>
                        )
                    }

                    return (
                        <button
                            key={pageNumber}
                            onClick={() => {
                                if (typeof pageNumber === 'number') {
                                    handlePageChange(pageNumber)
                                }
                            }}
                            className={`${btnBaseStyle} ${pageNumber === page ? btnActiveStyle : btnInactiveStyle}`}
                            aria-current={pageNumber === page ? 'page' : undefined}
                        >
                            {pageNumber}
                        </button>
                    )
                })}

                {/* Nút trang sau */}
                <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className={`${btnBaseStyle} ${page === totalPages ? btnDisabledStyle : btnInactiveStyle}`}
                    aria-label='Trang sau'
                >
                    <ChevronRight size={18} />
                </button>

                {/* Nút trang cuối */}
                {showFirstLast && (
                    <button
                        onClick={() => handlePageChange(totalPages)}
                        disabled={page === totalPages}
                        className={`${btnBaseStyle} ${page === totalPages ? btnDisabledStyle : btnInactiveStyle}`}
                        aria-label='Trang cuối'
                    >
                        <ChevronsRight size={18} />
                    </button>
                )}
            </nav>
        </div>
    )
}
