'use client'

import { useEffect, useState } from 'react'
import { Star, MessageSquare, X, Loader2, Upload, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useToast } from '@/hooks/useToast'
import { useCreateReviewMutation } from '@/services/ReviewService'
import uploadImageToCloudinary from '@/common/uploadImageToCloudinary'

interface ReviewFormModalProps {
    isOpen: boolean
    onClose: () => void
    productId: number
    productName: string
    currentPrice: number
    onChange?: () => void
}

interface Image {
    file?: File // Đây là trường chứa tệp hình ảnh
    url?: string
}

export default function ReviewFormModal({
    isOpen,
    onClose,
    productId,
    productName,
    currentPrice
}: ReviewFormModalProps) {
    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [comment, setComment] = useState('')
    const [images, setImages] = useState<Image[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast()
    const { t } = useTranslation()
    const [createReview] = useCreateReviewMutation()

    const handleSubmit = async () => {
        if (rating === 0) {
            toast('Vui lòng chọn số sao đánh giá', 'error')
            return
        }

        if (comment.trim() === '') {
            toast('Vui lòng nhập nội dung đánh giá', 'error')
            return
        }

        setIsLoading(true)

        const updatedImages = []

        for (const image of images) {
            if (image.file) {
                // Tải lên hình ảnh lên Cloudinary hoặc hệ thống lưu trữ bạn dùng
                const uploadedUrl = await uploadImageToCloudinary(image.file)
                if (!uploadedUrl) {
                    toast(t('COMMON.UPLOAD_IMAGE_FAIL'), 'error')
                    setIsLoading(false)
                    return
                }
                updatedImages.push(uploadedUrl)
            } else {
                updatedImages.push(image)
            }
        }

        const reviewData = {
            reviewDate: new Date().toISOString(),
            productId,
            rating,
            comment: comment.trim(),
            images: updatedImages.length > 0 ? updatedImages : undefined // Chỉ gán nếu có hình ảnh đã được tải lên
        }

        try {
            await createReview(reviewData)
                .unwrap()
                .then(() => {
                    toast('Đánh giá sản phẩm thành công', 'success')
                })
        } catch (error) {
            toast('Đánh giá sản phẩm thất bại', 'error')
        } finally {
            setIsLoading(false)
            onClose()
        }
    }

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
        if (files && files.length > 0) {
            const newImages = Array.from(files).map(file => ({
                file: file,
                url: URL.createObjectURL(file), // Lưu tạm URL ảnh trong bộ nhớ
                name: file.name
            }))
            setImages(prev => [...prev, ...newImages].slice(0, 5)) // Giới hạn không quá 5 ảnh
        }
    }

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index)) // Xóa ảnh đã chọn
    }

    const closeModal = () => {
        onClose()
        setRating(0)
        setHoverRating(0)
        setComment('')
        setImages([])
    }

    if (!isOpen) return null

    return (
        <div>
            <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                <div className='bg-white rounded-xl shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto'>
                    {/* Header */}
                    <div className='px-6 py-4 border-b flex items-center justify-between'>
                        <h2 className='font-bold text-[18px] text-gray-800 flex items-center'>
                            <MessageSquare size={20} className='w-5 h-5 text-blue-500 mr-3' />
                            Đánh giá sản phẩm
                        </h2>
                        <button
                            onClick={closeModal}
                            disabled={isLoading}
                            className='text-gray-500 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className='p-6 space-y-6'>
                        {/* Product Info */}
                        <div className='bg-gray-50 rounded-lg p-4'>
                            <h3 className='font-medium text-gray-900 mb-2'>{productName}</h3>
                            <p className='text-blue-600 font-semibold'>
                                Giá hiện tại: {currentPrice.toLocaleString()} VND
                            </p>
                        </div>

                        {/* Rating */}
                        <div className='space-y-3'>
                            <label className='block text-sm font-medium text-gray-700'>Đánh giá sao *</label>
                            <div className='flex items-center space-x-1'>
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button
                                        key={star}
                                        type='button'
                                        disabled={isLoading}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        onClick={() => setRating(star)}
                                        className='p-1 disabled:opacity-50 disabled:cursor-not-allowed'
                                    >
                                        <Star
                                            size={32}
                                            className={`${
                                                star <= (hoverRating || rating)
                                                    ? 'text-yellow-400 fill-yellow-400'
                                                    : 'text-gray-300'
                                            } cursor-pointer`}
                                        />
                                    </button>
                                ))}
                                <span className='ml-2 text-sm text-gray-600'>{rating > 0 && `${rating}/5 sao`}</span>
                            </div>
                        </div>

                        {/* Comment */}
                        <div className='space-y-3'>
                            <label className='block text-sm font-medium text-gray-700'>Nội dung đánh giá *</label>
                            <textarea
                                value={comment}
                                onChange={e => setComment(e.target.value)}
                                disabled={isLoading}
                                rows={4}
                                className='w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50'
                                placeholder='Chia sẻ trải nghiệm của bạn về sản phẩm này...'
                            />
                            <p className='text-sm text-gray-500'>{comment.length}/500 ký tự</p>
                        </div>

                        {/* Image Upload */}
                        <div className='space-y-3'>
                            <label className='block text-sm font-medium text-gray-700'>Hình ảnh (tùy chọn)</label>

                            {/* Upload Button */}
                            <div className='flex items-center space-x-3'>
                                <label className='flex items-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 disabled:opacity-50'>
                                    <Upload size={16} className='mr-2 text-gray-600' />
                                    <span className='text-sm text-gray-600'>Tải ảnh lên</span>
                                    <input
                                        type='file'
                                        multiple
                                        accept='image/*'
                                        onChange={handleImageUpload}
                                        disabled={isLoading || images.length >= 5}
                                        className='hidden'
                                    />
                                </label>
                                <span className='text-sm text-gray-500'>{images.length}/5 ảnh</span>
                            </div>

                            {/* Image Preview */}
                            {images.length > 0 && (
                                <div className='grid grid-cols-3 gap-2'>
                                    {images.map((image, index) => (
                                        <div key={index} className='relative group'>
                                            <img
                                                src={image.url} // Sử dụng URL tạm thời hoặc URL từ Cloudinary sau khi tải lên
                                                alt={`Preview ${index + 1}`}
                                                className='w-full h-20 object-cover rounded-lg border'
                                            />
                                            <button
                                                type='button'
                                                onClick={() => removeImage(index)}
                                                disabled={isLoading}
                                                className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50'
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className='px-6 py-4 border-t flex justify-end space-x-4'>
                        <button
                            onClick={closeModal}
                            disabled={isLoading}
                            className='px-6 py-2 font-medium border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading || rating === 0 || comment.trim() === ''}
                            className='px-6 py-2 font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-500'
                        >
                            {isLoading ? (
                                <Loader2 size={16} className='mr-2 animate-spin' />
                            ) : (
                                <MessageSquare size={16} className='mr-2' />
                            )}
                            Gửi đánh giá
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
