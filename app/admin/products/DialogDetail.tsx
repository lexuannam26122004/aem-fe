import React, { useState } from 'react'
import {
    ArrowLeft,
    Edit,
    ChevronRight,
    Star,
    Package,
    DollarSign,
    ShoppingCart,
    Trash2,
    AlertTriangle
} from 'lucide-react'

export interface IProduct {
    id: number
    serialNumber: string
    discountRate: number
    discountPrice: number
    price: number
    images: string[]
    description: string
    productName: string
    categoryName: string
    supplierName: string
    unit: string
    warrantyPeriod: number
    stockQuantity: number
    soldCount: number
    minStockThreshold: number
    rating: number
    createdAt: string
    createdBy: string
    status?: 'active' | 'inactive' // Field bổ sung
    sku?: string // Field bổ sung
    specifications?: Record<string, string> // Field bổ sung
}

interface Props {
    product: IProduct
    onClose: () => void
    isOpen: boolean
}

const ProductDetail = ({ product: productX }: Props) => {
    // Dữ liệu mẫu để hiển thị
    const product: IProduct = {
        id: 12345,
        serialNumber: 'PRD-78945-XYZ',
        discountRate: 15,
        discountPrice: 850000,
        price: 1000000,
        images: [
            'https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-1.webp',
            'https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-3.webp',
            'https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-5.webp',
            'https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-7.webp'
        ],
        description:
            'Sản phẩm cao cấp với thiết kế hiện đại, bền bỉ và tiết kiệm năng lượng. Phù hợp với mọi không gian sử dụng và mang lại trải nghiệm tuyệt vời cho người dùng.',
        productName: 'Laptop ProBook X5',
        categoryName: 'Laptop & Máy tính',
        supplierName: 'Tech Solutions Ltd.',
        unit: 'Chiếc',
        warrantyPeriod: 24,
        stockQuantity: 45,
        soldCount: 256,
        minStockThreshold: 10,
        rating: 4.7,
        createdAt: '2024-03-15T08:30:00Z',
        createdBy: 'admin@example.com',
        status: 'active',
        sku: 'LPB-X5-2024',
        specifications: {
            CPU: 'Intel Core i7-12700H',
            RAM: '16GB DDR5',
            'Ổ cứng': '512GB NVMe SSD',
            'Màn hình': '15.6 inch FHD IPS',
            'Card đồ họa': 'NVIDIA RTX 3050Ti 4GB'
        }
    }

    const [selectedImage, setSelectedImage] = useState(0)
    const [activeTab, setActiveTab] = useState('details')

    console.log('ProductDetail', productX)

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date)
    }

    return (
        <div className='bg-gray-50 min-h-screen'>
            {/* Header */}
            <header className='bg-white shadow'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center'>
                            <button className='mr-4 text-gray-600 hover:text-blue-600 transition-colors'>
                                <ArrowLeft size={20} />
                            </button>
                            <div>
                                <h1 className='text-2xl font-semibold text-gray-900'>Chi tiết sản phẩm</h1>
                                <div className='flex items-center text-sm text-gray-500 mt-1'>
                                    <span>Sản phẩm</span>
                                    <ChevronRight size={16} className='mx-1' />
                                    <span>{product.categoryName}</span>
                                    <ChevronRight size={16} className='mx-1' />
                                    <span className='font-medium text-blue-600'>{product.productName}</span>
                                </div>
                            </div>
                        </div>
                        <div className='flex space-x-3'>
                            <button className='px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'>
                                <Trash2 size={16} className='inline-block mr-2' />
                                Xóa
                            </button>
                            <button className='px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'>
                                <Edit size={16} className='inline-block mr-2' />
                                Chỉnh sửa
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                <div className='bg-white shadow rounded-lg overflow-hidden'>
                    {/* Trạng thái sản phẩm và ID */}
                    <div className='px-6 py-4 border-b border-gray-200 flex justify-between items-center'>
                        <div className='flex items-center space-x-4'>
                            <div
                                className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    product.status === 'active'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                }`}
                            >
                                {product.status === 'active' ? 'Đang hoạt động' : 'Không hoạt động'}
                            </div>
                            <div className='text-sm text-gray-500'>
                                ID: <span className='font-medium'>{product.id}</span>
                            </div>
                            <div className='text-sm text-gray-500'>
                                SKU: <span className='font-medium'>{product.sku}</span>
                            </div>
                            <div className='text-sm text-gray-500'>
                                Serial: <span className='font-medium'>{product.serialNumber}</span>
                            </div>
                        </div>
                        <div className='text-sm text-gray-500'>
                            Ngày tạo: <span className='font-medium'>{formatDate(product.createdAt)}</span> bởi{' '}
                            <span className='font-medium'>{product.createdBy}</span>
                        </div>
                    </div>

                    {/* Nội dung chính */}
                    <div className='grid grid-cols-3 gap-6 p-6'>
                        {/* Hình ảnh sản phẩm */}
                        <div className='col-span-1'>
                            <div className='mb-4 border border-gray-200 rounded-lg overflow-hidden'>
                                <div className='aspect-w-1 aspect-h-1 w-full bg-gray-100'>
                                    <img
                                        src={product.images[selectedImage]}
                                        alt={product.productName}
                                        className='object-cover w-full h-72'
                                    />
                                </div>
                            </div>
                            <div className='grid grid-cols-4 gap-2'>
                                {product.images.map((image, index) => (
                                    <div
                                        key={index}
                                        className={`cursor-pointer border-2 rounded overflow-hidden ${
                                            selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                                        }`}
                                        onClick={() => setSelectedImage(index)}
                                    >
                                        <img
                                            src={image}
                                            alt={`${product.productName} thumbnail ${index + 1}`}
                                            className='object-cover w-full h-16'
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Thông tin sản phẩm */}
                        <div className='col-span-2'>
                            <div className='flex justify-between items-start mb-6'>
                                <h2 className='text-2xl font-bold text-gray-900'>{product.productName}</h2>
                                <div className='flex items-center'>
                                    <Star size={18} className='text-yellow-400 fill-current' />
                                    <span className='ml-1 text-gray-900 font-medium'>{product.rating}</span>
                                    <span className='mx-1 text-gray-500'>•</span>
                                    <span className='text-gray-500'>{product.soldCount} đã bán</span>
                                </div>
                            </div>

                            <div className='flex gap-8 mb-6'>
                                <div className='flex-1'>
                                    <div className='bg-blue-50 p-4 rounded-lg'>
                                        <h3 className='text-sm font-medium text-gray-500 mb-2'>Thông tin giá</h3>
                                        <div className='flex justify-between items-center mb-2'>
                                            <span className='text-gray-600'>Giá gốc:</span>
                                            <span className='text-lg font-medium text-gray-600'>
                                                {formatCurrency(product.price)}
                                            </span>
                                        </div>
                                        <div className='flex justify-between items-center mb-2'>
                                            <span className='text-gray-600'>Chiết khấu:</span>
                                            <span className='text-lg font-medium text-red-600'>
                                                {product.discountRate}%
                                            </span>
                                        </div>
                                        <div className='flex justify-between items-center pt-2 border-t border-blue-100'>
                                            <span className='font-medium text-gray-900'>Giá bán:</span>
                                            <span className='text-xl font-bold text-blue-700'>
                                                {formatCurrency(product.discountPrice)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className='flex-1'>
                                    <div className='bg-gray-50 p-4 rounded-lg'>
                                        <h3 className='text-sm font-medium text-gray-500 mb-2'>Thông tin kho</h3>
                                        <div className='flex justify-between items-center mb-2'>
                                            <span className='text-gray-600'>Tồn kho:</span>
                                            <div className='flex items-center'>
                                                <span
                                                    className={`text-lg font-medium ${
                                                        product.stockQuantity <= product.minStockThreshold
                                                            ? 'text-red-600'
                                                            : 'text-green-600'
                                                    }`}
                                                >
                                                    {product.stockQuantity}
                                                </span>
                                                <span className='text-gray-600 ml-1'>{product.unit}</span>
                                            </div>
                                        </div>
                                        <div className='flex justify-between items-center mb-2'>
                                            <span className='text-gray-600'>Ngưỡng tối thiểu:</span>
                                            <span className='text-lg font-medium text-gray-600'>
                                                {product.minStockThreshold} {product.unit}
                                            </span>
                                        </div>
                                        {product.stockQuantity <= product.minStockThreshold && (
                                            <div className='flex items-center pt-2 border-t border-gray-200 text-red-600'>
                                                <AlertTriangle size={16} className='mr-1' />
                                                <span className='text-sm font-medium'>Cần nhập hàng</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className='border-b border-gray-200 mb-4'>
                                <nav className='flex -mb-px'>
                                    <button
                                        className={`mr-6 py-4 px-1 border-b-2 font-medium text-sm ${
                                            activeTab === 'details'
                                                ? 'border-blue-500 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                        onClick={() => setActiveTab('details')}
                                    >
                                        Chi tiết
                                    </button>
                                    <button
                                        className={`mr-6 py-4 px-1 border-b-2 font-medium text-sm ${
                                            activeTab === 'specs'
                                                ? 'border-blue-500 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                        onClick={() => setActiveTab('specs')}
                                    >
                                        Thông số kỹ thuật
                                    </button>
                                </nav>
                            </div>

                            {/* Tab content */}
                            <div className='mb-6'>
                                {activeTab === 'details' && (
                                    <div>
                                        <div className='grid grid-cols-2 gap-x-6 gap-y-4'>
                                            <div>
                                                <h4 className='text-sm text-gray-500 mb-1'>Danh mục</h4>
                                                <p className='font-medium'>{product.categoryName}</p>
                                            </div>
                                            <div>
                                                <h4 className='text-sm text-gray-500 mb-1'>Nhà cung cấp</h4>
                                                <p className='font-medium'>{product.supplierName}</p>
                                            </div>
                                            <div>
                                                <h4 className='text-sm text-gray-500 mb-1'>Đơn vị</h4>
                                                <p className='font-medium'>{product.unit}</p>
                                            </div>
                                            <div>
                                                <h4 className='text-sm text-gray-500 mb-1'>Bảo hành</h4>
                                                <p className='font-medium'>{product.warrantyPeriod} tháng</p>
                                            </div>
                                        </div>

                                        <div className='mt-6'>
                                            <h4 className='text-sm text-gray-500 mb-2'>Mô tả sản phẩm</h4>
                                            <p className='text-gray-700'>{product.description}</p>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'specs' && (
                                    <div className='border rounded-lg overflow-hidden'>
                                        <table className='min-w-full divide-y divide-gray-200'>
                                            <tbody className='bg-white divide-y divide-gray-200'>
                                                {product.specifications &&
                                                    Object.entries(product.specifications).map(([key, value]) => (
                                                        <tr key={key}>
                                                            <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 bg-gray-50 w-1/3'>
                                                                {key}
                                                            </td>
                                                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                                                                {value}
                                                            </td>
                                                        </tr>
                                                    ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Stats cards */}
                    <div className='px-6 py-6 bg-gray-50 border-t border-gray-200'>
                        <h3 className='text-lg font-medium text-gray-900 mb-4'>Thống kê sản phẩm</h3>
                        <div className='grid grid-cols-4 gap-4'>
                            <div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
                                <div className='flex items-center justify-between mb-2'>
                                    <h4 className='text-sm font-medium text-gray-500'>Đã bán</h4>
                                    <ShoppingCart size={16} className='text-blue-600' />
                                </div>
                                <p className='text-2xl font-bold text-gray-900'>{product.soldCount}</p>
                                <p className='text-xs text-gray-500 mt-1'>Tổng số lượng đã bán</p>
                            </div>

                            <div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
                                <div className='flex items-center justify-between mb-2'>
                                    <h4 className='text-sm font-medium text-gray-500'>Doanh thu</h4>
                                    <DollarSign size={16} className='text-green-600' />
                                </div>
                                <p className='text-2xl font-bold text-gray-900'>
                                    {formatCurrency(product.soldCount * product.discountPrice)}
                                </p>
                                <p className='text-xs text-gray-500 mt-1'>Tổng doanh thu ước tính</p>
                            </div>

                            <div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
                                <div className='flex items-center justify-between mb-2'>
                                    <h4 className='text-sm font-medium text-gray-500'>Đánh giá</h4>
                                    <Star size={16} className='text-yellow-500' />
                                </div>
                                <p className='text-2xl font-bold text-gray-900'>{product.rating}</p>
                                <p className='text-xs text-gray-500 mt-1'>Điểm đánh giá trung bình</p>
                            </div>

                            <div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
                                <div className='flex items-center justify-between mb-2'>
                                    <h4 className='text-sm font-medium text-gray-500'>Tồn kho</h4>
                                    <Package size={16} className='text-blue-600' />
                                </div>
                                <p className='text-2xl font-bold text-gray-900'>{product.stockQuantity}</p>
                                <p className='text-xs text-gray-500 mt-1'>Số lượng trong kho</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default ProductDetail
