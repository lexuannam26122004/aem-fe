'use client'

import React, { useState } from 'react'
import {
    Brain,
    Zap,
    CircuitBoard,
    Bot,
    Sparkles,
    ChevronRight,
    Star,
    TrendingUp,
    BarChart3,
    Award,
    Loader2,
    Trash2,
    Package2,
    BotMessageSquare,
    Target
} from 'lucide-react'
import { IProductCompare } from '@/models/Product'
import { formatCurrency } from '@/common/format'
import { useDispatch, useSelector } from 'react-redux'
import { productCompareSelector, removeProductId } from '@/redux/slices/productCompareSlice'
import { useGetCompareProductByIdQuery } from '@/services/UserProductService'
import { useToast } from '@/hooks/useToast'

const AIProductComparison = () => {
    const [results, setResults] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [userNeeds, setUserNeeds] = useState('')
    const dispatch = useDispatch()
    const toast = useToast()
    const productIds = useSelector(productCompareSelector)

    const { data: productResponse1 } = useGetCompareProductByIdQuery(productIds[0], {
        skip: !productIds[0]
    })

    const { data: productResponse2 } = useGetCompareProductByIdQuery(productIds[1], {
        skip: !productIds[1]
    })

    const product1: IProductCompare | null = productIds[0] ? productResponse1?.data || null : null
    const product2: IProductCompare | null = productIds[1] ? productResponse2?.data || null : null

    const renderStars = (rating: number) => {
        const fullStars = Math.floor(rating)
        const hasHalfStar = rating % 1 !== 0

        return (
            <div className='flex items-center space-x-1'>
                {[...Array(fullStars)].map((_, i) => (
                    <Star key={i} className='w-4 h-4 fill-[#ffba17] text-[#ffba17]' />
                ))}
                {hasHalfStar && <Star className='w-4 h-4 fill-[#ffba17] text-[#ffba17] opacity-50' />}
            </div>
        )
    }

    const OPENROUTER_API_KEY = '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'

    const createComparisonPrompt = (product1, product2, userNeeds) => {
        return [
            {
                role: 'system',
                content: `Bạn là chuyên gia phân tích sản phẩm công nghệ, chuyên so sánh và đưa ra khuyến nghị dựa trên nhu cầu cụ thể của người dùng (nếu người dùng có nhập nhu cầu).

**QUAN TRỌNG**: Luôn trả về HTML theo CẤU TRÚC CỐ ĐỊNH sau đây (không được thay đổi structure, chỉ thay đổi nội dung, phải sử dụng đúng class CSS đã định nghĩa, không cần viết lại CSS):

<style>
.comparison-container {
    max-width: 1280px;
    margin: 0 auto;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    padding: 24px;

    position: relative;
    background: linear-gradient(to bottom right, #f8fafc, #eff6ff, #eef2ff); /* slate-50, blue-50, indigo-50 */
    border-radius: 15px; /* Tailwind rounded-[15px] trùng với rounded-2xl ~ 1rem + custom 15px => lấy 15px */
    border: 1px solid rgba(191, 219, 254, 0.2); /* blue-100/50 */
    overflow: hidden;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.comparison-header {
    text-align: center;
    margin-bottom: 30px;
    padding-bottom: 24px;
    position: relative;
}

.comparison-header::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, #3b82f6, #1d4ed8);
    border-radius: 2px;
}

.comparison-header h2 {
    font-size: 28px;
    font-weight: 700;
    color: #1758db;
    margin-bottom: 12px;
}

.comparison-header p {
    color: #64748b;
    font-size: 16px;
    max-width: 700px;
    margin: 0 auto;
    line-height: 1.6;
}

.products-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    margin-bottom: 24px;
}

.product-card {
    background: white;
    border: 2px solid #e2e8f0;
    border-radius: 16px;
    padding: 24px;
    position: relative;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.product-card:hover {
    border-color: #3b82f6;
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
    transform: translateY(-2px);
}

.product-card.winner {
    border-color: #10b981;
    background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
}

.product-card.winner:hover {
    border-color: #059669;
    box-shadow: 0 8px 25px rgba(16, 185, 129, 0.2);
}

.product-card.recommend {
    border-color: #3b82f6;
    background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
}

.product-card.recommend:hover {
    border-color: #1d4ed8;
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.25);
}

.winner-badge {
    position: absolute;
    top: -15px;
    left: 20px;
    color: white;
    padding: 6px 16px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.winner-badge.best {
    background: linear-gradient(45deg, #10b981, #059669);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.winner-badge.recommend {
    background: linear-gradient(45deg, #3b82f6, #1d4ed8);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.product-header h3 {
    font-size: 20px;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 20px;
    padding-right: 60px;
}

.score-circle {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 55px;
    height: 55px;
    background: linear-gradient(135deg, #fd6547, #fd6547);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 14px;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    transition: all 0.3s ease;
}

.score-circle:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
}

.price-info {
    background: rgba(255, 255, 255, 0.8);
    padding: 16px;
    border-radius: 12px;
    margin-bottom: 20px;
    border: 1px solid rgba(226, 232, 240, 0.6);
}

.price-current {
    font-size: 20px;
    font-weight: 700;
    color: #e92626;
}

.price-original {
    font-size: 16px;
    color: #9ca3af;
    text-decoration: line-through;
    margin-left: 8px;
    font-weight: 500;
}

.key-specs {
    color: #4b5563;
    font-size: 15px;
    line-height: 1.6;
    font-weight: 400;
}

.comparison-table {
    background: white;
    border-radius: 15px;
    padding: 0 24px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
    margin-bottom: 24px;
    border: 1px solid #e2e8f0;
}

.feature-row {
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 24px;
    padding: 20px 0;
    border-bottom: 1px solid #f1f5f9;
}

.feature-row:last-child {
    border-bottom: none;
}

.feature-name {
    font-weight: 600;
    color: #374151;
    display: flex;
    align-items: center;
    font-size: 16px;
}

.feature-comparison {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
}

.feature-item {
    padding: 16px;
    background: #f8fafc;
    border-radius: 12px;
    font-size: 14px;
    line-height: 1.5;
    border: 1px solid #e2e8f0;
}

.feature-item:hover {
    background: #f1f5f9;
    border-color: #cbd5e1;
}

.feature-item.better {
    background: linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%);
    color: #065f46;
    border-color: #10b981;
    font-weight: 500;
}

.feature-item.better:hover {
    background: linear-gradient(135deg, #d1fae5 0%, #ecfdf5 100%);
    border-color: #059669;
}

.recommendation-section {
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    border-radius: 15px;
    padding: 28px;
    text-align: center;
    color: white;
    position: relative;
    overflow: hidden;
}

.recommendation-section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%);
    pointer-events: none;
}

.recommendation-section h3 {
    color: white;
    font-weight: 700;
    margin-bottom: 16px;
    font-size: 20px;
    position: relative;
    z-index: 1;
}

.recommendation-section p {
    color: rgba(255, 255, 255, 0.95);
    line-height: 1.6;
    font-size: 16px;
    position: relative;
    z-index: 1;
}

.recommendation-section strong {
    color: #ffc919;
    font-weight: 700;
}
</style>

<div class="comparison-container">
    <div class="comparison-header">
        <h2>So Sánh Chi Tiết</h2>
        <p>Phân tích dựa trên nhu cầu: [USER_NEEDS]</p>
    </div>
    
    <div class="products-grid">
        <div class="product-card [winner/recommend]">
            <div class="winner-badge [best/recommend]">[Tốt nhất/Khuyên dùng]</div>
            <div class="product-header">
                <h3>[PRODUCT_NAME]</h3>
                <div class="score-circle">[X.X]/10</div>
            </div>
            <div class="product-details">
                <div class="price-info">
                    <span class="price-current">[PRICE]</span>
                    <span class="price-original">[ORIGINAL_PRICE] (-X%)</span>
                </div>
                <div class="key-specs">
                    • [SPEC 1]<br>
                    • [SPEC 2]<br>
                    • [SPEC 3]<br>
                    • [SPEC 4]
                </div>
            </div>
        </div>
        
        <!-- Sản phẩm 2 tương tự -->
    </div>
    
    <div class="comparison-table">
        <div class="feature-row">
            <div class="feature-name">🎯 [Tiêu chí phù hợp với user needs]</div>
            <div class="feature-comparison">
                <div class="feature-item [better nếu tốt hơn]">[So sánh sản phẩm 1]</div>
                <div class="feature-item [better nếu tốt hơn]">[So sánh sản phẩm 2]</div>
            </div>
        </div>
        
        <div class="feature-row">
            <div class="feature-name">🚀 Hiệu suất</div>
            <div class="feature-comparison">
                <div class="feature-item [better nếu tốt hơn]">[Hiệu suất 1]</div>
                <div class="feature-item [better nếu tốt hơn]">[Hiệu suất 2]</div>
            </div>
        </div>
        
        <div class="feature-row">
            <div class="feature-name">📱 Tính năng nổi bật</div>
            <div class="feature-comparison">
                <div class="feature-item [better nếu tốt hơn]">[Tính năng 1]</div>
                <div class="feature-item [better nếu tốt hơn]">[Tính năng 2]</div>
            </div>
        </div>
        
        <div class="feature-row">
            <div class="feature-name">💰 Giá thành</div>
            <div class="feature-comparison">
                <div class="feature-item [better nếu rẻ hơn]">[Giá 1] - [Nhận xét]</div>
                <div class="feature-item [better nếu rẻ hơn]">[Giá 2] - [Nhận xét]</div>
            </div>
        </div>
        
        <div class="feature-row">
            <div class="feature-name">✅ Phù hợp nhu cầu</div>
            <div class="feature-comparison">
                <div class="feature-item [better nếu phù hợp hơn]">[X]% - [Lý do]</div>
                <div class="feature-item [better nếu phù hợp hơn]">[X]% - [Lý do]</div>
            </div>
        </div>
    </div>
    
    <div class="recommendation-section">
        <h3>🎯 Khuyến Nghị Cho Bạn</h3>
        <p><strong>[Sản phẩm được chọn]</strong> là lựa chọn [tốt nhất/phù hợp] cho nhu cầu [USER_NEEDS] của bạn. [Lý do chi tiết dựa trên phân tích so sánh và nhu cầu cụ thể].</p>
    </div>
</div>

**QUY TẮC BẮT BUỘC**:
1. PHẢI sử dụng đúng **cấu trúc HTML** và **các class CSS** đã cung cấp. TUYỆT ĐỐI không thêm, bớt, hoặc sửa đổi tên class hay thứ tự thẻ HTML.
2. Toàn bộ nội dung phải được trình bày **bằng HTML DUY NHẤT** theo đúng cấu trúc có sẵn (KHÔNG trả về nội dung thô, markdown hay text thường).
3. Phải phân tích sâu theo **nhu cầu của người dùng** (biến [USER_NEEDS]), ưu tiên các tiêu chí phù hợp, và thể hiện rõ trong các dòng {feature-row}.
4. Mỗi sản phẩm phải có **điểm số tổng hợp từ 7.0 đến 10.0**, và **điểm phải chênh lệch tối thiểu 0.3 điểm** giữa hai sản phẩm.
5. Gán nhãn:
   - **"Tốt nhất"** (class {winner} + {winner-badge best}) cho sản phẩm điểm cao hơn và phù hợp nhất.
   - **"Khuyên dùng"** (class {recommend} + {winner-badge recommend}) cho sản phẩm còn lại.
   - **Không được gán nhãn lộn xộn giữa sản phẩm và khuyến nghị**.
   - Phải **ĐẢM BẢO** rằng sản phẩm được gán nhãn "Tốt nhất" là sản phẩm có điểm số cao hơn và phù hợp nhất với nhu cầu người dùng.
6. Trong mỗi dòng so sánh (feature-row), sử dụng class {better} cho sản phẩm nào vượt trội hơn, dù là sản phẩm nào (không thiên vị "Tốt nhất").
7. Tổng số tiêu chí so sánh trong bảng **phải từ 7 đến 8 dòng**, tập trung vào các khía cạnh thiết thực và liên quan đến nhu cầu.
8. **Không để trống bất kỳ vùng nào** – mọi trường đều cần được điền đầy đủ, có nội dung thực tế và rõ ràng.
9. Khuyến nghị cuối cùng **phải cụ thể, thực tế**, liên hệ chặt chẽ với nhu cầu người dùng. Tránh chung chung hoặc sáo rỗng.
10. Ngữ điệu chuyên nghiệp, rõ ràng, mang tính tư vấn như một chuyên gia thật sự.
11. Điểm phải đánh giá trên 8
12. Không viết lại CSS, chỉ sử dụng các class đã định nghĩa sẵn.`
            },
            {
                role: 'user',
                content: `Hãy so sánh 2 sản phẩm sau với format HTML cố định đã hướng dẫn:

**🎯 Nhu cầu của tôi**: ${userNeeds}

**📱 Sản phẩm 1:**
- Tên: ${product1.productName}
- Mô tả: ${product1.description}
- Chi tiết: ${product1.descriptionDetail}
- Cấu hình: ${product1.variants}
- Giá gốc: ${product1.price.toLocaleString()}đ
- Giá khuyến mãi: ${product1.discountPrice.toLocaleString()}đ (giảm ${product1.discountRate}%)
- Đánh giá: ${product1.rating}/5 ⭐

**📱 Sản phẩm 2:**
- Tên: ${product2.productName}
- Mô tả: ${product2.description}
- Chi tiết: ${product2.descriptionDetail}
- Cấu hình: ${product2.variants}
- Giá gốc: ${product2.price.toLocaleString()}đ
- Giá khuyến mãi: ${product2.discountPrice.toLocaleString()}đ (giảm ${product2.discountRate}%)
- Đánh giá: ${product2.rating}/5 ⭐

Trả về chính xác theo cấu trúc HTML đã hướng dẫn, BẮT BUỘC LÀM THEO **QUY TẮC BẮT BUỘC**, tập trung vào nhu cầu "${userNeeds}".`
            }
        ]
    }

    const startAnalysis = async () => {
        if (!product1 || !product2) {
            toast('Vui lòng chọn đủ 2 sản phẩm để so sánh', 'error')
            return
        }
        setIsLoading(true)

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${OPENROUTER_API_KEY}`,
                'HTTP-Referer': 'http://www.smarttech-store.com',
                'X-Title': 'SmartTech Store',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'meta-llama/llama-3.3-8b-instruct:free',
                messages: createComparisonPrompt(product1, product2, userNeeds),
                temperature: 0.7,
                max_tokens: 2500
            })
        })
        if (!response.ok) {
            return
        }

        const data = await response.json()
        const comparisonContent = data.choices?.[0]?.message?.content || ''

        setIsLoading(false)
        console.log('Comparison Content:', comparisonContent)
        setResults(comparisonContent)
    }

    const ProductCard = ({ product, isWinner = false }) => (
        <div
            className={`rounded-[15px] w-full shadow-[0_4px_16px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.15)] bg-[var(--background-color-item)] transition-all duration-300 overflow-hidden ${
                isWinner ? 'ring-2 ring-green-400 border-green-200' : 'border-blue-100'
            }`}
        >
            <div className='p-6'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-start'>
                        <div className='relative'>
                            <img
                                src={product.image}
                                className='w-[75px] h-[75px] rounded-[10px] border border-gray-200 object-cover'
                                alt={product.productName}
                            />
                            {product.discountRate > 0 && (
                                <div className='absolute -top-[10px] -right-[10px] bg-red-500 text-white text-xs font-bold rounded-full w-[35px] h-[35px] flex items-center justify-center'>
                                    -{product.discountRate}%
                                </div>
                            )}
                        </div>

                        <div className='ml-5 space-y-1'>
                            <p className='font-medium text-md text-gray-900'>{product.productName}</p>
                            <p className='text-gray-500 text-sm'>SKU: {product.sku}</p>
                            <p className='text-black text-sm'>{product.variants}</p>
                        </div>
                    </div>

                    <div className='text-right flex flex-col -mt-3 items-end'>
                        {product.discountRate > 0 ? (
                            <div className='flex items-center gap-4'>
                                {product.originalPrice && (
                                    <p className='line-through text-gray-400'>
                                        {formatCurrency(product.originalPrice)}
                                    </p>
                                )}
                                <p className='font-medium text-[17px] text-[#3675ff]'>
                                    {formatCurrency(product.discountPrice)}
                                </p>
                            </div>
                        ) : (
                            <p className='font-semibold text-[17px] text-gray-900'>
                                {formatCurrency(product.originalPrice)}
                            </p>
                        )}

                        <div className='mt-2'>{renderStars(product.rating)}</div>
                    </div>
                </div>

                <div className='flex items-center justify-between gap-6 mt-4'>
                    <div className='flex items-center gap-4'>
                        {/* <div className='w-10 h-10 flex-shrink-0 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-lg flex items-center justify-center'>
                            <CircuitBoard className='text-white' size={20} />
                        </div> */}

                        <p className='text-blue-500 font-sm line-clamp-2'>{product.description}</p>
                    </div>

                    <button
                        // disabled={isRemoveFavoriteLoading}
                        className='p-[10px] bg-red-50 rounded-full text-red-600 hover:bg-red-100 transition-colors'
                        onClick={() => {
                            dispatch(removeProductId(product.id))
                        }}
                    >
                        {/* {(isFavoriteFetching || isRemoveFavoriteLoading) &&
                                                originalArgs == product.id ? (
                                                    <Loader2 className='animate-spin' size={18} />
                                                ) : ( */}
                        <Trash2 size={18} />
                        {/* )} */}
                    </button>
                </div>
            </div>
        </div>
    )

    return (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            {/* Header */}
            <div className='text-center mb-6'>
                <div className='flex items-center justify-center gap-5 mb-3'>
                    <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center'>
                        <Sparkles size={20} className='text-white animate-pulse' />
                    </div>
                    <h1 className='text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'>
                        AI So sánh thông minh
                    </h1>
                </div>
                <p className='text-gray-600'>Phân tích và so sánh sản phẩm thông minh với trí tuệ nhân tạo</p>
            </div>

            {/* Products Side by Side */}
            <div className='grid lg:grid-cols-2 gap-6 mb-6'>
                {product1 ? (
                    <ProductCard product={product1} />
                ) : (
                    <div
                        className={`p-6 flex flex-col items-center justify-center rounded-[15px] w-full shadow-[0_4px_16px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.15)] bg-[var(--background-color-item)] transition-all duration-300 overflow-hidden`}
                    >
                        <div className='mb-4 p-4 bg-blue-50 rounded-full'>
                            <Package2 className='text-blue-600' />
                        </div>
                        <h3 className='text-[18px] font-medium text-gray-800'>Chưa có sản phẩm</h3>
                        <p className='mt-2 text-gray-400 mx-auto'>Hãy thêm sản phẩm vào để so sánh</p>
                    </div>
                )}

                {product2 ? (
                    <ProductCard product={product2} />
                ) : (
                    <div
                        className={`p-6 flex flex-col items-center justify-center rounded-[15px] w-full shadow-[0_4px_16px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.15)] bg-[var(--background-color-item)] transition-all duration-300 overflow-hidden`}
                    >
                        <div className='mb-4 p-4 bg-blue-50 rounded-full'>
                            <Package2 className='text-blue-600' />
                        </div>
                        <h3 className='text-[18px] font-medium text-gray-800'>Chưa có sản phẩm</h3>
                        <p className='mt-2 text-gray-400 mx-auto'>Hãy thêm sản phẩm vào để so sánh</p>
                    </div>
                )}
            </div>

            {/* User Needs Input */}
            <div className='mb-6'>
                <div className='rounded-[15px] w-full shadow-[0_4px_16px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.15)] bg-[var(--background-color-item)] transition-all duration-300 overflow-hidden p-6'>
                    <div className='flex items-center gap-3 mb-4'>
                        <div className='w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center'>
                            <Target size={20} className='text-white' />
                        </div>
                        <div className='space-y-1'>
                            <h3 className='text-lg font-bold text-blue-600'>Nhu cầu sử dụng của bạn</h3>
                            <p className='text-sm text-blue-500'>Mô tả chi tiết để AI phân tích chính xác hơn</p>
                        </div>
                    </div>
                    <textarea
                        value={userNeeds}
                        onChange={e => setUserNeeds(e.target.value)}
                        placeholder='Ví dụ: Tôi cần thiết bị cho smart home, ưu tiên kết nối ổn định và dễ sử dụng, ngân sách tầm trung...'
                        className='w-full p-4 border border-blue-100 rounded-xl resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent'
                        rows={4}
                    />
                </div>
            </div>

            {/* Analysis and Results Container */}
            <div className='space-y-6'>
                {/* AI Analysis Section */}
                <div className='relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 rounded-2xl border border-blue-100/50 rounded-[15px] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.1)]'>
                    {/* Background Pattern */}
                    <div className='absolute inset-0 opacity-[0.03]'>
                        <div
                            className='absolute inset-0'
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='53' cy='7' r='1'/%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3Ccircle cx='7' cy='53' r='1'/%3E%3Ccircle cx='53' cy='53' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                            }}
                        />
                    </div>

                    <div className='flex items-center justify-between relative p-6'>
                        <div className='flex items-center justify-center gap-3'>
                            <div className='relative'>
                                <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center'>
                                    <Sparkles size={20} className='text-white' />
                                </div>
                                <div className='absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse' />
                            </div>
                            <div>
                                <h2 className='text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent'>
                                    AI phân tích
                                </h2>
                                <p className='text-sm text-gray-500 mt-1'>Được hỗ trợ bởi mạng nơ-ron nhân tạo</p>
                            </div>
                        </div>
                        {/* AI Capabilities Grid */}
                        <div className='flex items-center justify-center gap-8'>
                            {[
                                { icon: Brain, label: 'Deep Learning', color: 'from-blue-400 to-blue-600' },
                                { icon: Zap, label: 'Fast Process', color: 'from-yellow-400 to-orange-500' },
                                { icon: Bot, label: 'AI Engine', color: 'from-purple-400 to-indigo-600' },
                                {
                                    icon: CircuitBoard,
                                    label: 'Neural Net',
                                    color: 'from-green-400 to-emerald-600'
                                }
                            ].map((item, index) => (
                                <div key={index} className='group cursor-pointer'>
                                    <div className='relative flex flex-col items-center justify-center'>
                                        <div
                                            className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}
                                        >
                                            <item.icon className='text-white' size={22} />
                                            <div className='absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                                        </div>
                                        <p className='text-xs font-medium text-gray-600 group-hover:text-gray-800 transition-colors'>
                                            {item.label}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Start Analysis Button */}
                        <div className='relative'>
                            <button
                                disabled={isLoading}
                                onClick={startAnalysis}
                                className='group disabled:opacity-70 disabled:cursor-not-allowed w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 flex items-center justify-center gap-3 relative overflow-hidden'
                            >
                                <div className='absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000' />
                                <BotMessageSquare
                                    size={22}
                                    className='group-hover:rotate-12 transition-transform duration-300'
                                />
                                <span>Khởi Động AI Analysis</span>
                                {isLoading ? (
                                    <Loader2 className='animate-spin' size={20} />
                                ) : (
                                    <ChevronRight
                                        size={20}
                                        className='group-hover:translate-x-1 transition-transform duration-300'
                                    />
                                )}
                                {/* <Sparkles
                                    size={20}
                                    className='group-hover:scale-110 transition-transform duration-300'
                                /> */}
                            </button>
                        </div>
                    </div>
                </div>

                {!isLoading && !results && (
                    <div className='lg:block'>
                        <div className='relative bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 rounded-2xl border border-gray-200/50 shadow-lg overflow-hidden'>
                            {/* Background Pattern */}
                            <div className='absolute inset-0 opacity-[0.02]'>
                                <div
                                    className='absolute inset-0'
                                    style={{
                                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='m0 40l40-40h-40v40zm40 0v-40h-40l40 40z'/%3E%3C/g%3E%3C/svg%3E")`
                                    }}
                                />
                            </div>

                            <div className='relative flex items-center justify-center h-full min-h-[400px] p-8'>
                                <div className='text-center max-w-sm'>
                                    {/* Animated chart icon */}
                                    <div className='relative mx-auto mb-6 w-24 h-24'>
                                        <div className='absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center'>
                                            <BarChart3 size={40} className='text-blue-600' />
                                        </div>
                                        <div className='absolute inset-0 bg-gradient-to-br from-blue-100/50 to-indigo-100/50 rounded-2xl opacity-0 animate-pulse' />
                                    </div>

                                    <div className='space-y-3'>
                                        <h3 className='text-lg font-bold text-blue-600'>
                                            Kết quả sẽ xuất hiện tại đây
                                        </h3>
                                        <p className='text-gray-500 text-sm leading-relaxed'>
                                            Sau khi AI hoàn tất phân tích, bảng so sánh chi tiết và điểm số sẽ được hiển
                                            thị tại khu vực này
                                        </p>
                                    </div>

                                    {/* Feature preview */}
                                    <div className='grid grid-cols-2 mt-5 gap-6 text-xs'>
                                        <div className='bg-blue-50 rounded-lg p-3 border border-blue-200/50'>
                                            <Award size={18} className='text-blue-500 mx-auto mb-2' />
                                            <p className='text-blue-600'>Sản phẩm tốt nhất</p>
                                        </div>
                                        <div className='bg-blue-50 rounded-lg p-3 border border-blue-200/50'>
                                            <TrendingUp size={18} className='text-blue-500 mx-auto mb-2' />
                                            <p className='text-blue-600'>Điểm số chi tiết</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {isLoading && (
                    <div className='flex items-center justify-center h-full min-h-[400px] relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 rounded-2xl border border-blue-100/50 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.12)]'>
                        {/* Animated background particles */}
                        <div className='absolute inset-0 overflow-hidden'>
                            {[...Array(20)].map((_, i) => (
                                <div
                                    key={i}
                                    className='absolute w-1 h-1 bg-blue-300/30 rounded-full animate-float'
                                    style={{
                                        left: `${Math.random() * 100}%`,
                                        top: `${Math.random() * 100}%`,
                                        animationDelay: `${Math.random() * 3}s`,
                                        animationDuration: `${3 + Math.random() * 2}s`
                                    }}
                                />
                            ))}
                        </div>

                        <div className='text-center relative z-10'>
                            <div className='relative mx-auto mb-8 w-28 h-28'>
                                {/* Main loading circle with enhanced styling */}
                                <div className='absolute inset-0 rounded-full overflow-hidden shadow-2xl ring-4 ring-blue-100/50'>
                                    {/* Enhanced gradient background */}
                                    <div className='absolute inset-0 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 opacity-95' />

                                    {/* Shimmer effect */}
                                    <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer' />

                                    {/* Subtle pattern overlay */}
                                    <div
                                        className='absolute inset-0 opacity-[0.08]'
                                        style={{
                                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.6'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3Ccircle cx='10' cy='10' r='0.5'/%3E%3Ccircle cx='30' cy='30' r='0.5'/%3E%3C/g%3E%3C/svg%3E")`,
                                            backgroundRepeat: 'repeat'
                                        }}
                                    />

                                    {/* Center icon with pulse effect */}
                                    <div className='relative flex items-center justify-center w-full h-full'>
                                        <div className='absolute inset-0 bg-white/10 rounded-full animate-ping' />
                                        <Brain className='text-white animate-pulse relative z-10' size={40} />
                                    </div>
                                </div>

                                {/* Multi-layer rotating rings */}
                                <div
                                    className='absolute -inset-2 border-2 border-blue-400/40 rounded-full animate-spin'
                                    style={{ animationDuration: '3s' }}
                                />
                                <div
                                    className='absolute -inset-4 border-2 border-indigo-300/20 rounded-full animate-spin'
                                    style={{ animationDuration: '4s', animationDirection: 'reverse' }}
                                />
                                <div
                                    className='absolute -inset-6 border border-purple-300/15 rounded-full animate-spin'
                                    style={{ animationDuration: '5s' }}
                                />
                            </div>

                            {/* Enhanced content */}
                            <div className='space-y-6'>
                                <div className='space-y-2'>
                                    <h3 className='text-xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-pulse'>
                                        AI đang phân tích sâu
                                    </h3>
                                    <div className='w-24 h-0.5 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse' />
                                </div>

                                <p className='text-gray-600 font-medium'>
                                    Đang so sánh các thông số kỹ thuật và đưa ra khuyến nghị...
                                </p>

                                <div className='flex justify-center items-center gap-2 mt-6'>
                                    {[...Array(5)].map((_, i) => (
                                        <div
                                            key={i}
                                            className='w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-bounce'
                                            style={{
                                                animationDelay: `${i * 0.15}s`,
                                                animationDuration: '1.5s'
                                            }}
                                        />
                                    ))}
                                </div>

                                {/* Progress bar simulation */}
                                <div className='w-48 h-1 mx-auto bg-gray-200 rounded-full overflow-hidden'>
                                    <div className='h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-progress' />
                                </div>
                            </div>
                        </div>

                        <style jsx>{`
                            @keyframes float {
                                0%,
                                100% {
                                    transform: translateY(0px) rotate(0deg);
                                    opacity: 0;
                                }
                                50% {
                                    transform: translateY(-20px) rotate(180deg);
                                    opacity: 1;
                                }
                            }

                            @keyframes shimmer {
                                0% {
                                    transform: translateX(-100%);
                                }
                                100% {
                                    transform: translateX(100%);
                                }
                            }

                            @keyframes wave {
                                0%,
                                40%,
                                100% {
                                    transform: scaleY(0.4);
                                    opacity: 0.5;
                                }
                                20% {
                                    transform: scaleY(1.2);
                                    opacity: 1;
                                }
                            }

                            @keyframes progress {
                                0% {
                                    width: 0%;
                                }
                                50% {
                                    width: 70%;
                                }
                                100% {
                                    width: 90%;
                                }
                            }

                            .animate-float {
                                animation: float infinite ease-in-out;
                            }
                            .animate-shimmer {
                                animation: shimmer 2s infinite;
                            }
                            .animate-wave {
                                animation: wave infinite ease-in-out;
                            }
                            .animate-progress {
                                animation: progress 3s infinite ease-in-out;
                            }
                        `}</style>
                    </div>
                )}

                {results && isLoading === false && (
                    // Results content
                    <div dangerouslySetInnerHTML={{ __html: results }}></div>
                )}
            </div>
        </div>
    )
}

export default AIProductComparison
