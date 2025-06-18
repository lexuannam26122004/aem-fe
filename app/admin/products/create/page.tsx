'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { Plus, X, Upload, Camera, Trash2, Star, ChevronDown, XIcon, SaveIcon } from 'lucide-react'
import { IProductCreate } from '@/models/Product'
import { Button } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import { useTranslation } from 'react-i18next'
import TinyMCEEditor from '@/components/TinyMCEEditor'
import { ICategory } from '@/models/Category'
import { IBrand } from '@/models/Brand'
import { IFeature } from '@/models/Feature'
import { ISupplier } from '@/models/Supplier'
import Loading from '@/components/Loading'
import { useSearchCategoryQuery } from '@/services/CategoryService'
import { useSearchBrandQuery } from '@/services/BrandService'
import { useSearchFeatureQuery } from '@/services/FeatureService'
import { useSearchSupplierQuery } from '@/services/SupplierService'
import { useCreateProductMutation } from '@/services/ProductService'
import { useToast } from '@/hooks/useToast'
import uploadImageToCloudinary from '@/common/uploadImageToCloudinary'
import { useRouter } from 'next/navigation'

type EnhancedSelectProps = {
    label: string
    value: string | number
    onChange: (value: string | number) => void
    options: { id: string | number; name: string; icon?: string }[]
    placeholder: string
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

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
            return () => document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen, closeDropdown])

    return { isOpen, toggleDropdown, closeDropdown, dropdownRef }
}

export const EnhancedSelect = ({ label, value, onChange, options, placeholder }: EnhancedSelectProps) => {
    const { isOpen, toggleDropdown, closeDropdown, dropdownRef } = useDropdownState()

    const selectedOption = options.find(opt => opt.id === value)

    const handleChange = (newValue: string | number) => {
        onChange(newValue)
        closeDropdown()
    }

    return (
        <div className='w-full'>
            <label className='text-gray-700 font-medium mb-1 block text-sm'>{label}</label>
            <div className='relative' ref={dropdownRef}>
                <div
                    onClick={toggleDropdown}
                    className={`w-full bg-white border rounded-lg py-3 px-4 flex justify-between items-center cursor-pointer transition-all ${
                        isOpen ? 'border-blue-500 shadow-md' : 'border-gray-300 hover:bg-gray-50'
                    }`}
                >
                    <div className='flex items-center'>
                        {selectedOption?.icon && <span className='mr-2'>{selectedOption.icon}</span>}
                        <span className='text-gray-700'>{selectedOption?.name || placeholder}</span>
                    </div>
                    <ChevronDown
                        className={`text-gray-500 w-5 h-5 transition-transform duration-200 ${
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
                                key={option.id}
                                onClick={() => handleChange(option.id)}
                                className={`px-4 py-2.5 rounded-md flex items-center cursor-pointer transition-colors hover:bg-blue-50 ${
                                    value === option.id ? 'bg-blue-100/60 text-blue-600' : 'text-gray-700'
                                }`}
                            >
                                {option.icon && <span className='mr-3 text-lg'>{option.icon}</span>}
                                <span>{option.name}</span>
                            </div>
                        ))}
                    </div>
                )}

                <select className='sr-only' value={value} onChange={e => onChange(e.target.value)} aria-hidden='true'>
                    {options.map(option => (
                        <option key={option.id} value={option.id}>
                            {option.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    )
}

interface ProductImageChoose {
    url: string
    name: string
    isPrimary: boolean
    file?: File
}

const ProductCreateForm = () => {
    const fileInputRef = useRef(null)
    const variantImageInputRefs = useRef({})
    const { t } = useTranslation('common')
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const [createProduct] = useCreateProductMutation()
    const { data: categoryResponse, isLoading: isLoadingCategory } = useSearchCategoryQuery({
        pageSize: 50,
        pageNumber: 1
    })

    const { data: brandResponse, isLoading: isLoadingBrand } = useSearchBrandQuery({
        pageSize: 50,
        pageNumber: 1
    })

    const { data: featuresResponse, isLoading: isLoadingFeature } = useSearchFeatureQuery({
        pageSize: 50,
        pageNumber: 1
    })

    const { data: supplierResponse, isLoading: isLoadingSupplier } = useSearchSupplierQuery({
        pageSize: 50,
        pageNumber: 1
    })

    const toast = useToast()

    const categories = Array.isArray(categoryResponse?.data.records)
        ? (categoryResponse?.data.records as ICategory[])
        : []
    const brands = Array.isArray(brandResponse?.data.records) ? (brandResponse?.data.records as IBrand[]) : []
    const features = Array.isArray(featuresResponse?.data.records) ? (featuresResponse?.data.records as IFeature[]) : []
    const suppliers = Array.isArray(supplierResponse?.data.records)
        ? (supplierResponse?.data.records as ISupplier[])
        : []
    const [productImages, setProductImages] = useState<ProductImageChoose[]>([])

    // Form state
    const [formData, setFormData] = useState<IProductCreate>({
        productName: '',
        description: '',
        categoryId: 0,
        supplierId: 0,
        price: 0,
        discountPrice: 0,
        unit: '',
        warrantyPeriod: 0,
        stockQuantity: 0,
        serialNumber: '',
        minStockThreshold: 0,
        brand: '',
        sku: '',
        weight: undefined,
        length: undefined,
        width: undefined,
        height: undefined,
        seoTitle: '',
        seoDescription: '',
        seoKeywords: '',
        detailDescription: '',
        features: [],
        images: [],
        variants: []
    })

    const [formErrors, setFormErrors] = useState({})
    const [newFeature, setNewFeature] = useState('')
    const [showAddFeature, setShowAddFeature] = useState(false)

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
        // Clear error when user starts typing
        if (formErrors[field]) {
            setFormErrors(prev => ({
                ...prev,
                [field]: ''
            }))
        }
    }

    const handleFileChange = (e, imageIndex = null, variantIndex = null, optionIndex = null, valueIndex = null) => {
        const file = e.target.files && e.target.files[0]

        if (!file) return

        const allowedTypes = ['.jpg', '.jpeg', '.png']
        const fileType = file.name.split('.').pop()?.toLowerCase()

        if (!allowedTypes.includes('.' + fileType)) {
            alert('Loại file không hợp lệ. Chỉ chấp nhận jpg, jpeg, png')
            return
        }

        const fileSize = file.size / 1024 / 1024
        if (fileSize > 3) {
            alert('Kích thước file quá lớn. Tối đa 3MB')
            return
        }

        const reader = new FileReader()
        reader.onloadend = () => {
            const imageUrl = reader.result

            if (variantIndex !== null && optionIndex !== null && valueIndex !== null) {
                // Variant option image
                setFormData(prev => {
                    const newVariants = [...prev.variants]
                    if (!newVariants[variantIndex].options[optionIndex].values[valueIndex]) {
                        newVariants[variantIndex].options[optionIndex].values[valueIndex] = {
                            value: '',
                            image: ''
                        }
                    }
                    newVariants[variantIndex].options[optionIndex].values[valueIndex].image =
                        typeof imageUrl === 'string' ? imageUrl : ''
                    newVariants[variantIndex].options[optionIndex].values[valueIndex].file = file
                    return { ...prev, variants: newVariants }
                })
            } else {
                // Product image
                if (imageIndex !== null) {
                    setProductImages(prev => {
                        const newImages = [...prev]
                        newImages[imageIndex] = {
                            url: typeof imageUrl === 'string' ? imageUrl : '',
                            name: file.name,
                            isPrimary: newImages[imageIndex]?.isPrimary || false,
                            file
                        }
                        return newImages
                    })
                } else {
                    setProductImages(prev => [
                        ...prev,
                        {
                            url: typeof imageUrl === 'string' ? imageUrl : '',
                            name: file.name,
                            isPrimary: prev.length === 0,
                            file
                        }
                    ])
                }
            }
        }
        reader.readAsDataURL(file)
    }

    const addFeature = feature => {
        if (feature.id && !formData.features.some(f => f.id === feature.id)) {
            setFormData(prev => ({
                ...prev,
                features: [...prev.features, { id: feature.id }]
            }))
        }
    }

    const removeFeature = featureId => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.filter(f => f.id !== featureId)
        }))
    }

    const addNewFeature = () => {
        if (newFeature.trim()) {
            addFeature(newFeature.trim())
            setNewFeature('')
            setShowAddFeature(false)
        }
    }

    const addVariant = () => {
        setFormData(prev => ({
            ...prev,
            variants: [
                ...prev.variants,
                {
                    name: '',
                    options: [],
                    combinations: []
                }
            ]
        }))
    }

    const addVariantOption = variantIndex => {
        setFormData(prev => {
            const newVariants = [...prev.variants]
            newVariants[variantIndex].options.push({
                isHasImage: false,
                optionName: '',
                values: []
            })
            return { ...prev, variants: newVariants }
        })
    }

    const addOptionValue = (variantIndex, optionIndex) => {
        setFormData(prev => {
            const newVariants = [...prev.variants]
            newVariants[variantIndex].options[optionIndex].values.push({
                value: '',
                image: ''
            })
            return { ...prev, variants: newVariants }
        })
    }

    const removeImage = index => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }))
    }

    const setPrimaryImage = index => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.map((img, i) => ({
                ...img,
                isPrimary: i === index
            }))
        }))
    }

    const handleSave = async e => {
        e.preventDefault()

        setIsLoading(true)

        const updatedImages = []

        for (const image of productImages) {
            if (image.file) {
                const uploadedUrl = await uploadImageToCloudinary(image.file)
                if (!uploadedUrl) {
                    toast(t('COMMON.UPLOAD_IMAGE_FAIL'), 'error')
                    setIsLoading(false)
                    return
                }
                updatedImages.push({
                    url: uploadedUrl,
                    name: image.name,
                    isPrimary: image.isPrimary
                })
            } else {
                updatedImages.push(image)
            }
        }

        const updatedVariants = await Promise.all(
            formData.variants.map(async variant => {
                const updatedOptions = await Promise.all(
                    variant.options.map(async option => {
                        const updatedValues = await Promise.all(
                            option.values.map(async value => {
                                if (value.file) {
                                    const uploadedUrl = await uploadImageToCloudinary(value.file)
                                    if (!uploadedUrl) {
                                        toast(t('COMMON.UPLOAD_IMAGE_FAIL'), 'error')
                                        setIsLoading(false)
                                        return value
                                    }
                                    return {
                                        ...value,
                                        image: uploadedUrl,
                                        file: undefined // remove file before sending to backend
                                    }
                                }
                                return value
                            })
                        )
                        return {
                            ...option,
                            values: updatedValues
                        }
                    })
                )
                return {
                    ...variant,
                    options: updatedOptions
                }
            })
        )

        const finalFormData = {
            ...formData,
            images: updatedImages,
            variants: updatedVariants
        }

        await createProduct(finalFormData)
            .unwrap()
            .then(() => {
                toast('Sản phẩm đã được tạo thành công!', 'success')
            })
            .catch(error => {
                console.error('Error creating product:', error)
                toast('Đã xảy ra lỗi khi tạo sản phẩm. Vui lòng thử lại.', 'error')
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    const handleSaveAndClose = () => {}

    const handleClose = e => {
        e.preventDefault()
        router.push('/admin/products')
    }

    if (isLoadingCategory || isLoadingBrand || isLoadingFeature || isLoadingSupplier) {
        return <Loading />
    }

    return (
        <div className='min-h-screen'>
            <div className='max-w-[1200px] mx-auto'>
                <div className='bg-white rounded-lg shadow-lg overflow-hidden'>
                    {/* Header */}
                    <div className='bg-blue-600 text-white px-6 py-4'>
                        <h1 className='text-2xl font-bold'>Tạo sản phẩm mới</h1>
                        <p className='text-blue-100 mt-1'>Điền thông tin chi tiết để tạo sản phẩm</p>
                    </div>

                    <form className='p-6'>
                        {/* Basic Information */}
                        <div className='mb-8'>
                            <h2 className='text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2'>
                                Thông tin cơ bản
                            </h2>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                        Tên sản phẩm *
                                    </label>
                                    <input
                                        type='text'
                                        value={formData.productName}
                                        onChange={e => handleInputChange('productName', e.target.value)}
                                        className='w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-blue-500 focus:border-blue-500 outline-none'
                                        placeholder='Nhập tên sản phẩm'
                                    />
                                </div>

                                <EnhancedSelect
                                    label='Danh mục *'
                                    placeholder='Chọn danh mục'
                                    value={formData.categoryId}
                                    onChange={value => handleInputChange('categoryId', value)}
                                    options={categories.map(category => ({
                                        id: category.id,
                                        name: category.categoryName
                                    }))}
                                />

                                <EnhancedSelect
                                    label='Nhà cung cấp *'
                                    placeholder='Chọn nhà cung cấp'
                                    value={formData.supplierId}
                                    onChange={value => handleInputChange('supplierId', value)}
                                    options={suppliers.map(supplier => ({
                                        id: supplier.id,
                                        name: supplier.supplierName
                                    }))}
                                />

                                <EnhancedSelect
                                    label='Thương hiệu *'
                                    placeholder='Chọn thương hiệu'
                                    value={formData.brand}
                                    onChange={value => handleInputChange('brand', value)}
                                    options={brands.map(brand => ({
                                        id: brand.id,
                                        name: brand.brandName
                                    }))}
                                />

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Giá *</label>
                                    <input
                                        type='number'
                                        value={formData.price}
                                        onChange={e => handleInputChange('price', e.target.value)}
                                        className='w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-blue-500 focus:border-blue-500 outline-none'
                                        placeholder='0'
                                    />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                        Giá khuyến mãi
                                    </label>
                                    <input
                                        type='number'
                                        value={formData.discountPrice}
                                        onChange={e => handleInputChange('discountPrice', e.target.value)}
                                        className='w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-blue-500 focus:border-blue-500 outline-none'
                                        placeholder='0'
                                    />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Đơn vị</label>
                                    <input
                                        type='text'
                                        value={formData.unit}
                                        onChange={e => handleInputChange('unit', e.target.value)}
                                        className='w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-blue-500 focus:border-blue-500 outline-none'
                                        placeholder='Cái, Kg, Lít...'
                                    />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>SKU</label>
                                    <input
                                        type='text'
                                        value={formData.sku}
                                        onChange={e => handleInputChange('sku', e.target.value)}
                                        className='w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-blue-500 focus:border-blue-500 outline-none'
                                        placeholder='Mã SKU'
                                    />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Số serial</label>
                                    <input
                                        type='text'
                                        value={formData.serialNumber}
                                        onChange={e => handleInputChange('serialNumber', e.target.value)}
                                        className='w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-blue-500 focus:border-blue-500 outline-none'
                                        placeholder='Số serial'
                                    />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                        Thời gian bảo hành (tháng)
                                    </label>
                                    <input
                                        type='number'
                                        value={formData.warrantyPeriod ?? ''}
                                        onChange={e =>
                                            setFormData({
                                                ...formData,
                                                warrantyPeriod:
                                                    e.target.value === '' ? undefined : Number(e.target.value)
                                            })
                                        }
                                        className='w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-blue-500 focus:border-blue-500 outline-none'
                                        placeholder='12'
                                    />
                                </div>

                                <div className='md:col-span-2'>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Mô tả ngắn</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={e => handleInputChange('description', e.target.value)}
                                        rows={3}
                                        className='w-full border border-gray-300 max-h-[200px] min-h-[50px] rounded-lg px-4 py-3 focus:ring-blue-500 focus:border-blue-500 outline-none'
                                        placeholder='Mô tả ngắn về sản phẩm'
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Inventory */}
                        <div className='mb-8'>
                            <h2 className='text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2'>
                                Quản lý kho
                            </h2>
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                        Số lượng tồn kho
                                    </label>
                                    <input
                                        type='number'
                                        value={formData.stockQuantity}
                                        onChange={e => handleInputChange('stockQuantity', e.target.value)}
                                        className='w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-blue-500 focus:border-blue-500 outline-none'
                                        placeholder='0'
                                    />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                        Ngưỡng tồn kho tối thiểu
                                    </label>
                                    <input
                                        type='number'
                                        value={formData.minStockThreshold}
                                        onChange={e => handleInputChange('minStockThreshold', e.target.value)}
                                        className='w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-blue-500 focus:border-blue-500 outline-none'
                                        placeholder='0'
                                    />
                                </div>

                                {/* <div className='space-y-4'>
                                    <label className='flex items-center'>
                                        <input
                                            type='checkbox'
                                            checked={formData.trackQuantity}
                                            onChange={e => handleInputChange('trackQuantity', e.target.checked)}
                                            className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                                        />
                                        <span className='ml-2 text-sm text-gray-700'>Theo dõi số lượng</span>
                                    </label>

                                    <label className='flex items-center'>
                                        <input
                                            type='checkbox'
                                            checked={formData.continueSellingWhenOutOfStock}
                                            onChange={e =>
                                                handleInputChange('continueSellingWhenOutOfStock', e.target.checked)
                                            }
                                            className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                                        />
                                        <span className='ml-2 text-sm text-gray-700'>Tiếp tục bán khi hết hàng</span>
                                    </label>

                                    <label className='flex items-center'>
                                        <input
                                            type='checkbox'
                                            checked={formData.requiresShipping}
                                            onChange={e => handleInputChange('requiresShipping', e.target.checked)}
                                            className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                                        />
                                        <span className='ml-2 text-sm text-gray-700'>Yêu cầu vận chuyển</span>
                                    </label>
                                </div> */}
                            </div>
                        </div>

                        {/* Physical Properties */}
                        <div className='mb-8'>
                            <h2 className='text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2'>
                                Thông số vật lý
                            </h2>
                            <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                        Cân nặng (kg)
                                    </label>
                                    <input
                                        type='number'
                                        step='0.01'
                                        value={formData.weight || 0}
                                        onChange={e => handleInputChange('weight', e.target.value)}
                                        className='w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-blue-500 focus:border-blue-500 outline-none'
                                        placeholder='0.00'
                                    />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                        Chiều dài (cm)
                                    </label>
                                    <input
                                        type='number'
                                        step='0.01'
                                        value={formData.length || 0}
                                        onChange={e => handleInputChange('length', e.target.value)}
                                        className='w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-blue-500 focus:border-blue-500 outline-none'
                                        placeholder='0.00'
                                    />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                        Chiều rộng (cm)
                                    </label>
                                    <input
                                        type='number'
                                        step='0.01'
                                        value={formData.width || 0}
                                        onChange={e => handleInputChange('width', e.target.value)}
                                        className='w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-blue-500 focus:border-blue-500 outline-none'
                                        placeholder='0.00'
                                    />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                        Chiều cao (cm)
                                    </label>
                                    <input
                                        type='number'
                                        step='0.01'
                                        value={formData.height || 0}
                                        onChange={e => handleInputChange('height', e.target.value)}
                                        className='w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-blue-500 focus:border-blue-500 outline-none'
                                        placeholder='0.00'
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Features */}
                        <div className='mb-8'>
                            <h2 className='text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2'>
                                Tính năng sản phẩm
                            </h2>
                            <div className='space-y-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        Chọn tính năng có sẵn
                                    </label>
                                    <div className='flex flex-wrap gap-2'>
                                        {features.map(feature => (
                                            <button
                                                key={feature.id}
                                                type='button'
                                                onClick={() => addFeature(feature)}
                                                disabled={formData.features.some(f => f.id === feature.id)}
                                                className={`px-3 py-1 rounded-full text-sm border ${
                                                    formData.features.some(f => f.id === feature.id)
                                                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                        : 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100'
                                                }`}
                                            >
                                                {feature.featureName}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <div className='flex gap-2 mb-2'>
                                        <button
                                            type='button'
                                            onClick={() => setShowAddFeature(!showAddFeature)}
                                            className='flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm'
                                        >
                                            <Plus className='w-4 h-4' />
                                            Thêm tính năng mới
                                        </button>
                                    </div>

                                    {showAddFeature && (
                                        <div className='flex gap-2'>
                                            <input
                                                type='text'
                                                value={newFeature}
                                                onChange={e => setNewFeature(e.target.value)}
                                                className='flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none'
                                                placeholder='Nhập tính năng mới'
                                            />
                                            <button
                                                type='button'
                                                onClick={addNewFeature}
                                                className='px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700'
                                            >
                                                Thêm
                                            </button>
                                            <button
                                                type='button'
                                                onClick={() => {
                                                    setShowAddFeature(false)
                                                    setNewFeature('')
                                                }}
                                                className='px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600'
                                            >
                                                Hủy
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        Tính năng đã chọn ({formData.features.length})
                                    </label>
                                    <div className='flex flex-wrap gap-2'>
                                        {formData.features.map((feature, index) => (
                                            <span
                                                key={index}
                                                className='inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm'
                                            >
                                                {features.filter(f => f.id == feature.id)[0]?.featureName}
                                                <button
                                                    type='button'
                                                    onClick={() => removeFeature(feature.id)}
                                                    className='hover:text-blue-600'
                                                >
                                                    <X className='w-3 h-3' />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Images */}
                        <div className='mb-8'>
                            <h2 className='text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2'>
                                Hình ảnh sản phẩm
                            </h2>
                            <div className='space-y-4'>
                                <div>
                                    <input
                                        ref={fileInputRef}
                                        type='file'
                                        accept='image/*'
                                        onChange={e => handleFileChange(e)}
                                        className='hidden'
                                    />
                                    <button
                                        type='button'
                                        onClick={() => fileInputRef.current?.click()}
                                        className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
                                    >
                                        <Upload className='w-4 h-4' />
                                        Thêm hình ảnh
                                    </button>
                                </div>

                                {productImages.length > 0 && (
                                    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                                        {productImages.map((image, index) => (
                                            <div key={index} className='relative group'>
                                                <div className='aspect-square bg-gray-100 rounded-lg overflow-hidden'>
                                                    <img
                                                        src={image.url}
                                                        alt={image.name}
                                                        className='w-full h-full object-cover'
                                                    />
                                                </div>
                                                <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all rounded-lg flex items-center justify-center gap-2'>
                                                    <button
                                                        type='button'
                                                        onClick={() => setPrimaryImage(index)}
                                                        className={`p-2 rounded-lg text-white hover:bg-white/20 transition-all ${
                                                            image.isPrimary ? 'bg-blue-600' : 'bg-gray-600'
                                                        }`}
                                                        title='Set as primary'
                                                    >
                                                        <Star size={16} fill={image.isPrimary ? 'white' : 'none'} />
                                                    </button>
                                                    <button
                                                        onClick={() => removeImage(index)}
                                                        className='p-2 bg-red-600 rounded-lg text-white hover:bg-red-700 transition-all'
                                                        title='Remove image'
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                                {image.isPrimary && (
                                                    <div className='absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium'>
                                                        Primary
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Variants */}
                        <div className='mb-8'>
                            <h2 className='text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2'>
                                Biến thể sản phẩm
                            </h2>
                            <div className='space-y-6'>
                                <button
                                    type='button'
                                    onClick={addVariant}
                                    className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
                                >
                                    <Plus className='w-4 h-4' />
                                    Thêm biến thể
                                </button>

                                {formData.variants.map((variant, variantIndex) => (
                                    <div key={variantIndex} className='border border-gray-200 rounded-lg p-4'>
                                        <div className='mb-4'>
                                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                                                Tên biến thể
                                            </label>
                                            <input
                                                type='text'
                                                value={variant.name}
                                                onChange={e => {
                                                    const newVariants = [...formData.variants]
                                                    newVariants[variantIndex].name = e.target.value
                                                    setFormData(prev => ({ ...prev, variants: newVariants }))
                                                }}
                                                className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none'
                                                placeholder='VD: Màu sắc, Kích thước...'
                                            />
                                        </div>

                                        <div className='space-y-4'>
                                            <button
                                                type='button'
                                                onClick={() => addVariantOption(variantIndex)}
                                                className='flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm'
                                            >
                                                <Plus className='w-4 h-4' />
                                                Thêm tùy chọn
                                            </button>

                                            {variant.options.map((option, optionIndex) => (
                                                <div key={optionIndex} className='bg-gray-50 p-4 rounded-lg'>
                                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                                                        <div>
                                                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                                                                Tên tùy chọn
                                                            </label>
                                                            <input
                                                                type='text'
                                                                value={option.optionName}
                                                                onChange={e => {
                                                                    const newVariants = [...formData.variants]
                                                                    newVariants[variantIndex].options[
                                                                        optionIndex
                                                                    ].optionName = e.target.value
                                                                    setFormData(prev => ({
                                                                        ...prev,
                                                                        variants: newVariants
                                                                    }))
                                                                }}
                                                                className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none'
                                                                placeholder='VD: Đỏ, Xanh, Size M...'
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className='flex items-center'>
                                                                <input
                                                                    type='checkbox'
                                                                    checked={option.isHasImage}
                                                                    onChange={e => {
                                                                        const newVariants = [...formData.variants]
                                                                        newVariants[variantIndex].options[
                                                                            optionIndex
                                                                        ].isHasImage = e.target.checked
                                                                        setFormData(prev => ({
                                                                            ...prev,
                                                                            Variants: newVariants
                                                                        }))
                                                                    }}
                                                                    className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                                                                />
                                                                <span className='ml-2 text-sm text-gray-700'>
                                                                    Có hình ảnh
                                                                </span>
                                                            </label>
                                                        </div>
                                                    </div>

                                                    <div className='space-y-3'>
                                                        <button
                                                            type='button'
                                                            onClick={() => addOptionValue(variantIndex, optionIndex)}
                                                            className='flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-600 rounded text-sm hover:bg-blue-200'
                                                        >
                                                            <Plus className='w-3 h-3' />
                                                            Thêm giá trị
                                                        </button>

                                                        {option.values.map((value, valueIndex) => (
                                                            <div
                                                                key={valueIndex}
                                                                className='flex items-center gap-3 bg-white p-3 rounded border'
                                                            >
                                                                <div className='flex-1'>
                                                                    <input
                                                                        type='text'
                                                                        value={value.value}
                                                                        onChange={e => {
                                                                            const newVariants = [...formData.variants]
                                                                            newVariants[variantIndex].options[
                                                                                optionIndex
                                                                            ].values[valueIndex].value = e.target.value
                                                                            setFormData(prev => ({
                                                                                ...prev,
                                                                                variants: newVariants
                                                                            }))
                                                                        }}
                                                                        className='w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none'
                                                                        placeholder='Giá trị'
                                                                    />
                                                                </div>

                                                                {option.isHasImage && (
                                                                    <div className='flex items-center gap-2'>
                                                                        {value.image && (
                                                                            <img
                                                                                src={value.image}
                                                                                alt='Variant'
                                                                                className='w-12 h-12 object-cover rounded border'
                                                                            />
                                                                        )}
                                                                        <input
                                                                            type='file'
                                                                            accept='image/*'
                                                                            onChange={e =>
                                                                                handleFileChange(
                                                                                    e,
                                                                                    null,
                                                                                    variantIndex,
                                                                                    optionIndex,
                                                                                    valueIndex
                                                                                )
                                                                            }
                                                                            className='hidden'
                                                                            ref={el => {
                                                                                if (
                                                                                    !variantImageInputRefs.current[
                                                                                        `${variantIndex}-${optionIndex}-${valueIndex}`
                                                                                    ]
                                                                                ) {
                                                                                    variantImageInputRefs.current[
                                                                                        `${variantIndex}-${optionIndex}-${valueIndex}`
                                                                                    ] = el
                                                                                }
                                                                            }}
                                                                        />
                                                                        <button
                                                                            type='button'
                                                                            onClick={() =>
                                                                                variantImageInputRefs.current[
                                                                                    `${variantIndex}-${optionIndex}-${valueIndex}`
                                                                                ]?.click()
                                                                            }
                                                                            className='p-2 bg-gray-200 text-gray-600 rounded hover:bg-gray-300'
                                                                        >
                                                                            <Camera className='w-4 h-4' />
                                                                        </button>
                                                                    </div>
                                                                )}

                                                                <button
                                                                    type='button'
                                                                    onClick={() => {
                                                                        const newVariants = [...formData.variants]
                                                                        newVariants[variantIndex].options[
                                                                            optionIndex
                                                                        ].values.splice(valueIndex, 1)
                                                                        setFormData(prev => ({
                                                                            ...prev,
                                                                            variants: newVariants
                                                                        }))
                                                                    }}
                                                                    className='p-2 text-red-600 hover:bg-red-50 rounded'
                                                                >
                                                                    <X className='w-4 h-4' />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}

                                            <button
                                                type='button'
                                                onClick={() => {
                                                    const newVariants = formData.variants.filter(
                                                        (_, i) => i !== variantIndex
                                                    )
                                                    setFormData(prev => ({ ...prev, Variants: newVariants }))
                                                }}
                                                className='flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm'
                                            >
                                                <Trash2 className='w-4 h-4' />
                                                Xóa biến thể
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* SEO */}
                        {/* <div className='mb-8'>
                            <h2 className='text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2'>
                                Tối ưu SEO
                            </h2>
                            <div className='space-y-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Tiêu đề SEO</label>
                                    <input
                                        type='text'
                                        value={formData.seoTitle}
                                        onChange={e => handleInputChange('seoTitle', e.target.value)}
                                        className='w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-blue-500 focus:border-blue-500 outline-none'
                                        placeholder='Tiêu đề hiển thị trên search engine'
                                    />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Mô tả SEO</label>
                                    <textarea
                                        value={formData.seoDescription}
                                        onChange={e => handleInputChange('seoDescription', e.target.value)}
                                        rows={3}
                                        className='w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-blue-500 focus:border-blue-500 outline-none'
                                        placeholder='Mô tả hiển thị trên search engine'
                                    />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Từ khóa SEO</label>
                                    <input
                                        type='text'
                                        value={formData.seoKeywords}
                                        onChange={e => handleInputChange('seoKeywords', e.target.value)}
                                        className='w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-blue-500 focus:border-blue-500 outline-none'
                                        placeholder='từ khóa 1, từ khóa 2, từ khóa 3...'
                                    />
                                </div>
                            </div>
                        </div> */}

                        {/* Detailed Description */}
                        <div className='mb-6'>
                            <h2 className='text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2'>
                                Mô tả chi tiết
                            </h2>
                            <TinyMCEEditor
                                apiKey='mlgxg84wttozfctmb9svt074cue9vowla3gl6c8ym0u1q8zd'
                                initialValue={''}
                                onChange={content => {
                                    setFormData({ ...formData, detailDescription: content })
                                }}
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className='flex justify-end gap-6'>
                            <LoadingButton
                                variant='contained'
                                {...(isLoading && { loading: true })}
                                loadingPosition='start'
                                startIcon={<SaveIcon />}
                                sx={{
                                    height: '50px',
                                    backgroundColor: 'var(--background-color-button-save)',
                                    width: 'auto',
                                    padding: '0px 30px',
                                    fontSize: '16px',
                                    '&:hover': {
                                        backgroundColor: 'var(--background-color-button-save-hover)'
                                    },
                                    borderRadius: '8px',
                                    color: 'var(--text-color-button-save)',
                                    fontWeight: 'bold',
                                    whiteSpace: 'nowrap',
                                    textTransform: 'none'
                                }}
                                onClick={handleSave}
                            >
                                {t('COMMON.BUTTON.SAVE')}
                            </LoadingButton>

                            <LoadingButton
                                variant='contained'
                                {...(isLoading && { loading: true })}
                                loadingPosition='start'
                                startIcon={<SaveIcon />}
                                sx={{
                                    height: '50px',
                                    backgroundColor: 'var(--background-color-button-save)',
                                    width: 'auto',
                                    padding: '0px 30px',
                                    '&:hover': {
                                        backgroundColor: 'var(--background-color-button-save-hover)'
                                    },
                                    color: 'var(--text-color-button-save)',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    whiteSpace: 'nowrap',
                                    textTransform: 'none'
                                }}
                                onClick={handleSaveAndClose}
                            >
                                {t('COMMON.BUTTON.SAVE_AND_CLOSE')}
                            </LoadingButton>

                            <Button
                                variant='contained'
                                startIcon={<XIcon />}
                                sx={{
                                    height: '50px',
                                    backgroundColor: 'var(--background-color-button-cancel)',
                                    width: 'auto',
                                    fontSize: '16px',
                                    '&:hover': {
                                        backgroundColor: 'var(--background-color-button-cancel-hover)'
                                    },
                                    borderRadius: '8px',
                                    padding: '0px 30px',
                                    fontWeight: 'bold',
                                    whiteSpace: 'nowrap',
                                    color: 'var(--text-color-button-cancel)',
                                    textTransform: 'none'
                                }}
                                onClick={handleClose}
                            >
                                {t('COMMON.BUTTON.CLOSE')}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ProductCreateForm
