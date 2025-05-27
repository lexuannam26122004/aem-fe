'use client'

import React, { useState } from 'react'
import {
    Upload,
    X,
    Plus,
    Save,
    Eye,
    Image as ImageIcon,
    Package,
    Tag,
    Palette,
    Settings,
    DollarSign,
    Info,
    Star,
    Trash2,
    ChevronDown,
    ChevronUp
} from 'lucide-react'

type VariantOption = { name: string; values: string[] }
type VariantCombination = {
    id: number
    combination: { option: string; value: string }[]
    price: string
    comparePrice: string
    sku: string
    inventory: number
    weight: string
}
type Variant = {
    id: number
    name: string
    options: VariantOption[]
    combinations: VariantCombination[]
}
type SEO = { title: string; description: string; keywords: string }
type Inventory = {
    trackQuantity: boolean
    continueSellingWhenOutOfStock: boolean
    requiresShipping: boolean
    weight: string
    dimensions: { length: string; width: string; height: string }
}
type ProductFormData = {
    name: string
    description: string
    category: string
    brand: string
    sku: string
    price: string
    comparePrice: string
    costPrice: string
    tags: string[]
    images: {
        id: number
        url: string
        name: string
        isPrimary: boolean
    }[]
    variants: Variant[]
    seo: SEO
    status: string
    inventory: Inventory
}

const AddProductPage = () => {
    const [formData, setFormData] = useState<ProductFormData>({
        name: '',
        description: '',
        category: '',
        brand: '',
        sku: '',
        price: '',
        comparePrice: '',
        costPrice: '',
        tags: [],
        images: [],
        variants: [
            {
                id: 1,
                name: 'Default',
                options: [
                    { name: 'Color', values: ['Black', 'White'] },
                    { name: 'Size', values: ['S', 'M', 'L'] }
                ],
                combinations: []
            }
        ],
        seo: {
            title: '',
            description: '',
            keywords: ''
        },
        status: 'draft',
        inventory: {
            trackQuantity: true,
            continueSellingWhenOutOfStock: false,
            requiresShipping: true,
            weight: '',
            dimensions: { length: '', width: '', height: '' }
        }
    })

    const [activeSection, setActiveSection] = useState('basic')
    const [expandedVariant, setExpandedVariant] = useState<number | null>(1)
    const [newTag, setNewTag] = useState('')
    const [previewMode, setPreviewMode] = useState(false)

    const categories = [
        'Electronics',
        'Clothing',
        'Home & Garden',
        'Sports',
        'Books',
        'Beauty',
        'Automotive',
        'Health',
        'Toys',
        'Food & Beverage'
    ]

    type NestedKeys = 'seo' | 'inventory'
    const handleInputChange = (field: string, value: any, nested: NestedKeys | null = null) => {
        if (nested) {
            setFormData(prev => ({
                ...prev,
                [nested]: {
                    ...prev[nested],
                    [field]: value
                }
            }))
        } else {
            setFormData(prev => ({
                ...prev,
                [field]: value
            }))
        }
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? [])
        files.forEach(file => {
            const typedFile = file as File
            const reader = new FileReader()
            reader.onload = event => {
                const target = event.target
                if (target && typeof target.result === 'string') {
                    setFormData(prev => ({
                        ...prev,
                        images: [
                            ...prev.images,
                            {
                                id: Date.now() + Math.random(),
                                url: target.result as string,
                                name: typedFile.name,
                                isPrimary: prev.images.length === 0
                            }
                        ]
                    }))
                }
            }
            reader.readAsDataURL(typedFile)
        })
    }

    const removeImage = (id: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter(img => img.id !== id)
        }))
    }

    const setPrimaryImage = (id: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.map(img => ({
                ...img,
                isPrimary: img.id === id
            }))
        }))
    }

    const addTag = () => {
        if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, newTag.trim()]
            }))
            setNewTag('')
        }
    }

    const removeTag = (tagToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }))
    }

    const addVariant = () => {
        const newVariant = {
            id: Date.now(),
            name: `Variant ${formData.variants.length + 1}`,
            options: [{ name: 'Option 1', values: ['Value 1'] }],
            combinations: []
        }
        setFormData(prev => ({
            ...prev,
            variants: [...prev.variants, newVariant]
        }))
    }

    const removeVariant = (variantId: number) => {
        if (formData.variants.length > 1) {
            setFormData(prev => ({
                ...prev,
                variants: prev.variants.filter(v => v.id !== variantId)
            }))
        }
    }

    const addVariantOption = (variantId: number) => {
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.map(variant =>
                variant.id === variantId
                    ? {
                          ...variant,
                          options: [
                              ...variant.options,
                              { name: `Option ${variant.options.length + 1}`, values: ['Value 1'] }
                          ]
                      }
                    : variant
            )
        }))
    }

    const updateVariantOption = (variantId: number, optionIndex: number, field: keyof VariantOption, value: any) => {
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.map(variant =>
                variant.id === variantId
                    ? {
                          ...variant,
                          options: variant.options.map((option, index) =>
                              index === optionIndex ? { ...option, [field]: value } : option
                          )
                      }
                    : variant
            )
        }))
    }

    const addOptionValue = (variantId: number, optionIndex: number) => {
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.map(variant =>
                variant.id === variantId
                    ? {
                          ...variant,
                          options: variant.options.map((option, index) =>
                              index === optionIndex
                                  ? { ...option, values: [...option.values, `Value ${option.values.length + 1}`] }
                                  : option
                          )
                      }
                    : variant
            )
        }))
    }

    const removeOptionValue = (variantId: number, optionIndex: number, valueIndex: number) => {
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.map(variant =>
                variant.id === variantId
                    ? {
                          ...variant,
                          options: variant.options.map((option, index) =>
                              index === optionIndex
                                  ? { ...option, values: option.values.filter((_, i) => i !== valueIndex) }
                                  : option
                          )
                      }
                    : variant
            )
        }))
    }

    const updateOptionValue = (variantId: number, optionIndex: number, valueIndex: number, newValue: string) => {
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.map(variant =>
                variant.id === variantId
                    ? {
                          ...variant,
                          options: variant.options.map((option, index) =>
                              index === optionIndex
                                  ? {
                                        ...option,
                                        values: option.values.map((value, i) => (i === valueIndex ? newValue : value))
                                    }
                                  : option
                          )
                      }
                    : variant
            )
        }))
    }

    const generateVariantCombinations = (variantId: number) => {
        const variant = formData.variants.find(v => v.id === variantId)
        if (!variant || variant.options.length === 0) return

        const combinations: VariantCombination[] = []
        const generateCombos = (optionIndex: number, currentCombo: { option: string; value: string }[]) => {
            if (optionIndex === variant.options.length) {
                combinations.push({
                    id: Date.now() + Math.random(),
                    combination: [...currentCombo],
                    price: formData.price,
                    comparePrice: formData.comparePrice,
                    sku: '',
                    inventory: 0,
                    weight: formData.inventory.weight
                })
                return
            }

            variant.options[optionIndex].values.forEach(value => {
                generateCombos(optionIndex + 1, [
                    ...currentCombo,
                    {
                        option: variant.options[optionIndex].name,
                        value: value
                    }
                ])
            })
        }

        generateCombos(0, [])

        setFormData(prev => ({
            ...prev,
            variants: prev.variants.map(v => (v.id === variantId ? { ...v, combinations } : v))
        }))
    }

    const updateCombination = (
        variantId: number,
        combinationId: number,
        field: keyof VariantCombination,
        value: any
    ) => {
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.map(variant =>
                variant.id === variantId
                    ? {
                          ...variant,
                          combinations: variant.combinations.map(combo =>
                              combo.id === combinationId ? { ...combo, [field]: value } : combo
                          )
                      }
                    : variant
            )
        }))
    }

    const handleSave = (status = 'draft') => {
        const productData = {
            ...formData,
            status,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }

        console.log('Saving product:', productData)
        // Here you would typically send the data to your API
        alert(`Product ${status === 'published' ? 'published' : 'saved as draft'} successfully!`)
    }

    type SectionButtonProps = {
        id: string
        icon: React.ElementType
        title: string
        active: boolean
        onClick: (id: string) => void
    }

    const SectionButton: React.FC<SectionButtonProps> = ({ id, icon: Icon, title, active, onClick }) => (
        <button
            onClick={() => onClick(id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                active ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
            }`}
        >
            <Icon size={20} />
            <span className='font-medium'>{title}</span>
        </button>
    )

    return (
        <div className='min-h-screen bg-gray-50'>
            {/* Header */}
            <div className='bg-white border-b border-gray-200 px-6 py-4'>
                <div className='max-w-7xl mx-auto flex items-center justify-between'>
                    <div>
                        <h1 className='text-2xl font-bold text-gray-900'>Add New Product</h1>
                        <p className='text-gray-600 mt-1'>
                            Create a new product with variants and detailed information
                        </p>
                    </div>
                    <div className='flex items-center gap-4'>
                        <button
                            onClick={() => setPreviewMode(!previewMode)}
                            className='flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-600 border border-gray-300 rounded-lg hover:border-blue-500 transition-all'
                        >
                            <Eye size={18} />
                            Preview
                        </button>
                        <button
                            onClick={() => handleSave('draft')}
                            className='flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all'
                        >
                            <Save size={18} />
                            Save Draft
                        </button>
                        <button
                            onClick={() => handleSave('published')}
                            className='flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all shadow-md'
                        >
                            <Package size={18} />
                            Publish Product
                        </button>
                    </div>
                </div>
            </div>

            <div className='max-w-7xl mx-auto px-6 py-8'>
                <div className='flex gap-8'>
                    {/* Sidebar Navigation */}
                    <div className='w-64 space-y-2'>
                        <div className='bg-white rounded-lg p-4 shadow-sm'>
                            <SectionButton
                                id='basic'
                                icon={Info}
                                title='Basic Information'
                                active={activeSection === 'basic'}
                                onClick={setActiveSection}
                            />
                            <SectionButton
                                id='media'
                                icon={ImageIcon}
                                title='Media & Images'
                                active={activeSection === 'media'}
                                onClick={setActiveSection}
                            />
                            <SectionButton
                                id='pricing'
                                icon={DollarSign}
                                title='Pricing'
                                active={activeSection === 'pricing'}
                                onClick={setActiveSection}
                            />
                            <SectionButton
                                id='variants'
                                icon={Palette}
                                title='Variants'
                                active={activeSection === 'variants'}
                                onClick={setActiveSection}
                            />
                            <SectionButton
                                id='inventory'
                                icon={Package}
                                title='Inventory & Shipping'
                                active={activeSection === 'inventory'}
                                onClick={setActiveSection}
                            />
                            <SectionButton
                                id='seo'
                                icon={Star}
                                title='SEO & Visibility'
                                active={activeSection === 'seo'}
                                onClick={setActiveSection}
                            />
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className='flex-1'>
                        <div className='bg-white rounded-lg shadow-sm'>
                            {/* Basic Information */}
                            {activeSection === 'basic' && (
                                <div className='p-6 space-y-6'>
                                    <div className='border-b border-gray-200 pb-4'>
                                        <h2 className='text-xl font-semibold text-gray-900'>Basic Information</h2>
                                        <p className='text-gray-600 mt-1'>Essential product details and description</p>
                                    </div>

                                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                                        <div className='space-y-4'>
                                            <div>
                                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                                    Product Name *
                                                </label>
                                                <input
                                                    type='text'
                                                    value={formData.name}
                                                    onChange={e => handleInputChange('name', e.target.value)}
                                                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'
                                                    placeholder='Enter product name'
                                                />
                                            </div>

                                            <div>
                                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                                    Category *
                                                </label>
                                                <select
                                                    value={formData.category}
                                                    onChange={e => handleInputChange('category', e.target.value)}
                                                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'
                                                >
                                                    <option value=''>Select a category</option>
                                                    {categories.map(cat => (
                                                        <option key={cat} value={cat}>
                                                            {cat}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                                    Brand
                                                </label>
                                                <input
                                                    type='text'
                                                    value={formData.brand}
                                                    onChange={e => handleInputChange('brand', e.target.value)}
                                                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'
                                                    placeholder='Enter brand name'
                                                />
                                            </div>

                                            <div>
                                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                                    SKU
                                                </label>
                                                <input
                                                    type='text'
                                                    value={formData.sku}
                                                    onChange={e => handleInputChange('sku', e.target.value)}
                                                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'
                                                    placeholder='Enter SKU'
                                                />
                                            </div>
                                        </div>

                                        <div className='space-y-4'>
                                            <div>
                                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                                    Product Description
                                                </label>
                                                <textarea
                                                    value={formData.description}
                                                    onChange={e => handleInputChange('description', e.target.value)}
                                                    rows={8}
                                                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none'
                                                    placeholder='Describe your product in detail...'
                                                />
                                            </div>

                                            <div>
                                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                                    Tags
                                                </label>
                                                <div className='flex gap-2 mb-3'>
                                                    <input
                                                        type='text'
                                                        value={newTag}
                                                        onChange={e => setNewTag(e.target.value)}
                                                        onKeyPress={e => e.key === 'Enter' && addTag()}
                                                        className='flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'
                                                        placeholder='Add a tag'
                                                    />
                                                    <button
                                                        onClick={addTag}
                                                        className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all'
                                                    >
                                                        <Plus size={18} />
                                                    </button>
                                                </div>
                                                <div className='flex flex-wrap gap-2'>
                                                    {formData.tags.map((tag, index) => (
                                                        <span
                                                            key={index}
                                                            className='inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm'
                                                        >
                                                            {tag}
                                                            <button
                                                                onClick={() => removeTag(tag)}
                                                                className='hover:text-blue-900'
                                                            >
                                                                <X size={14} />
                                                            </button>
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Media & Images */}
                            {activeSection === 'media' && (
                                <div className='p-6 space-y-6'>
                                    <div className='border-b border-gray-200 pb-4'>
                                        <h2 className='text-xl font-semibold text-gray-900'>Media & Images</h2>
                                        <p className='text-gray-600 mt-1'>Upload product images and media files</p>
                                    </div>

                                    <div className='space-y-6'>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-4'>
                                                Product Images
                                            </label>

                                            <div className='border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-all'>
                                                <input
                                                    type='file'
                                                    multiple
                                                    accept='image/*'
                                                    onChange={handleImageUpload}
                                                    className='hidden'
                                                    id='imageUpload'
                                                />
                                                <label htmlFor='imageUpload' className='cursor-pointer'>
                                                    <Upload className='mx-auto h-12 w-12 text-gray-400 mb-4' />
                                                    <p className='text-lg font-medium text-gray-900 mb-2'>
                                                        Upload images
                                                    </p>
                                                    <p className='text-gray-600'>Drag and drop or click to browse</p>
                                                    <p className='text-sm text-gray-500 mt-2'>
                                                        Supports JPG, PNG, WebP (max 10MB each)
                                                    </p>
                                                </label>
                                            </div>
                                        </div>

                                        {formData.images.length > 0 && (
                                            <div>
                                                <h3 className='text-lg font-medium text-gray-900 mb-4'>
                                                    Uploaded Images
                                                </h3>
                                                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                                                    {formData.images.map(image => (
                                                        <div key={image.id} className='relative group'>
                                                            <div className='aspect-square bg-gray-100 rounded-lg overflow-hidden'>
                                                                <img
                                                                    src={image.url}
                                                                    alt={image.name}
                                                                    className='w-full h-full object-cover'
                                                                />
                                                            </div>
                                                            <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all rounded-lg flex items-center justify-center gap-2'>
                                                                <button
                                                                    onClick={() => setPrimaryImage(image.id)}
                                                                    className={`p-2 rounded-lg text-white hover:bg-white/20 transition-all ${
                                                                        image.isPrimary ? 'bg-blue-600' : 'bg-gray-600'
                                                                    }`}
                                                                    title='Set as primary'
                                                                >
                                                                    <Star
                                                                        size={16}
                                                                        fill={image.isPrimary ? 'white' : 'none'}
                                                                    />
                                                                </button>
                                                                <button
                                                                    onClick={() => removeImage(image.id)}
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
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Pricing */}
                            {activeSection === 'pricing' && (
                                <div className='p-6 space-y-6'>
                                    <div className='border-b border-gray-200 pb-4'>
                                        <h2 className='text-xl font-semibold text-gray-900'>Pricing</h2>
                                        <p className='text-gray-600 mt-1'>Set pricing information for your product</p>
                                    </div>

                                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                                Price *
                                            </label>
                                            <div className='relative'>
                                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                                    <span className='text-gray-500'>$</span>
                                                </div>
                                                <input
                                                    type='number'
                                                    value={formData.price}
                                                    onChange={e => handleInputChange('price', e.target.value)}
                                                    className='w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'
                                                    placeholder='0.00'
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                                Compare at Price
                                            </label>
                                            <div className='relative'>
                                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                                    <span className='text-gray-500'>$</span>
                                                </div>
                                                <input
                                                    type='number'
                                                    value={formData.comparePrice}
                                                    onChange={e => handleInputChange('comparePrice', e.target.value)}
                                                    className='w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'
                                                    placeholder='0.00'
                                                />
                                            </div>
                                            <p className='text-sm text-gray-500 mt-1'>
                                                Show customers they are getting a deal
                                            </p>
                                        </div>

                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                                Cost per Item
                                            </label>
                                            <div className='relative'>
                                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                                    <span className='text-gray-500'>$</span>
                                                </div>
                                                <input
                                                    type='number'
                                                    value={formData.costPrice}
                                                    onChange={e => handleInputChange('costPrice', e.target.value)}
                                                    className='w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'
                                                    placeholder='0.00'
                                                />
                                            </div>
                                            <p className='text-sm text-gray-500 mt-1'>
                                                For profit calculations (not shown to customers)
                                            </p>
                                        </div>
                                    </div>

                                    {formData.price &&
                                        formData.comparePrice &&
                                        parseFloat(formData.comparePrice) > parseFloat(formData.price) && (
                                            <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
                                                <div className='flex items-center gap-2 text-green-700'>
                                                    <Tag size={18} />
                                                    <span className='font-medium'>Discount Preview</span>
                                                </div>
                                                <p className='text-green-600 mt-1'>
                                                    Customers will see a{' '}
                                                    {Math.round(
                                                        ((parseFloat(formData.comparePrice) -
                                                            parseFloat(formData.price)) /
                                                            parseFloat(formData.comparePrice)) *
                                                            100
                                                    )}
                                                    % discount (Save $
                                                    {(
                                                        parseFloat(formData.comparePrice) - parseFloat(formData.price)
                                                    ).toFixed(2)}
                                                    )
                                                </p>
                                            </div>
                                        )}
                                </div>
                            )}

                            {/* Variants */}
                            {activeSection === 'variants' && (
                                <div className='p-6 space-y-6'>
                                    <div className='border-b border-gray-200 pb-4 flex items-center justify-between'>
                                        <div>
                                            <h2 className='text-xl font-semibold text-gray-900'>Product Variants</h2>
                                            <p className='text-gray-600 mt-1'>
                                                Create variants like size, color, material, etc.
                                            </p>
                                        </div>
                                        <button
                                            onClick={addVariant}
                                            className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all'
                                        >
                                            <Plus size={18} />
                                            Add Variant
                                        </button>
                                    </div>

                                    <div className='space-y-6'>
                                        {formData.variants.map(variant => (
                                            <div key={variant.id} className='border border-gray-200 rounded-lg'>
                                                <div
                                                    className='flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50'
                                                    onClick={() =>
                                                        setExpandedVariant(
                                                            expandedVariant === variant.id ? null : variant.id
                                                        )
                                                    }
                                                >
                                                    <div className='flex items-center gap-3'>
                                                        <Palette className='text-blue-600' size={20} />
                                                        <div>
                                                            <h3 className='font-medium text-gray-900'>
                                                                {variant.name}
                                                            </h3>
                                                            <p className='text-sm text-gray-500'>
                                                                {variant.options.length} option
                                                                {variant.options.length !== 1 ? 's' : ''},
                                                                {variant.combinations.length} combination
                                                                {variant.combinations.length !== 1 ? 's' : ''}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className='flex items-center gap-2'>
                                                        {formData.variants.length > 1 && (
                                                            <button
                                                                onClick={e => {
                                                                    e.stopPropagation()
                                                                    removeVariant(variant.id)
                                                                }}
                                                                className='p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all'
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        )}
                                                        {expandedVariant === variant.id ? (
                                                            <ChevronUp size={20} />
                                                        ) : (
                                                            <ChevronDown size={20} />
                                                        )}
                                                    </div>
                                                </div>

                                                {expandedVariant === variant.id && (
                                                    <div className='border-t border-gray-200 p-4 space-y-4'>
                                                        {/* Variant Name */}
                                                        <div>
                                                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                                                Variant Name
                                                            </label>
                                                            <input
                                                                type='text'
                                                                value={variant.name}
                                                                onChange={e => {
                                                                    setFormData(prev => ({
                                                                        ...prev,
                                                                        variants: prev.variants.map(v =>
                                                                            v.id === variant.id
                                                                                ? { ...v, name: e.target.value }
                                                                                : v
                                                                        )
                                                                    }))
                                                                }}
                                                                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'
                                                            />
                                                        </div>

                                                        {/* Options */}
                                                        <div>
                                                            <div className='flex items-center justify-between mb-3'>
                                                                <label className='block text-sm font-medium text-gray-700'>
                                                                    Options
                                                                </label>
                                                                <button
                                                                    onClick={() => addVariantOption(variant.id)}
                                                                    className='flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700'
                                                                >
                                                                    <Plus size={16} />
                                                                    Add Option
                                                                </button>
                                                            </div>

                                                            {variant.options.map((option, optionIndex) => (
                                                                <div
                                                                    key={optionIndex}
                                                                    className='bg-gray-50 rounded-lg p-4 mb-4'
                                                                >
                                                                    <div className='flex items-center gap-4 mb-3'>
                                                                        <input
                                                                            type='text'
                                                                            value={option.name}
                                                                            onChange={e =>
                                                                                updateVariantOption(
                                                                                    variant.id,
                                                                                    optionIndex,
                                                                                    'name',
                                                                                    e.target.value
                                                                                )
                                                                            }
                                                                            className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                                                            placeholder='Option name (e.g., Color, Size)'
                                                                        />
                                                                        {variant.options.length > 1 && (
                                                                            <button
                                                                                onClick={() => {
                                                                                    setFormData(prev => ({
                                                                                        ...prev,
                                                                                        variants: prev.variants.map(v =>
                                                                                            v.id === variant.id
                                                                                                ? {
                                                                                                      ...v,
                                                                                                      options:
                                                                                                          v.options.filter(
                                                                                                              (_, i) =>
                                                                                                                  i !==
                                                                                                                  optionIndex
                                                                                                          )
                                                                                                  }
                                                                                                : v
                                                                                        )
                                                                                    }))
                                                                                }}
                                                                                className='p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all'
                                                                            >
                                                                                <Trash2 size={16} />
                                                                            </button>
                                                                        )}
                                                                    </div>

                                                                    <div className='space-y-2'>
                                                                        <label className='block text-xs font-medium text-gray-600 uppercase tracking-wide'>
                                                                            Values
                                                                        </label>
                                                                        <div className='flex flex-wrap gap-2'>
                                                                            {option.values.map((value, valueIndex) => (
                                                                                <div
                                                                                    key={valueIndex}
                                                                                    className='flex items-center gap-1 bg-white border border-gray-200 rounded-lg px-3 py-2'
                                                                                >
                                                                                    <input
                                                                                        type='text'
                                                                                        value={value}
                                                                                        onChange={e =>
                                                                                            updateOptionValue(
                                                                                                variant.id,
                                                                                                optionIndex,
                                                                                                valueIndex,
                                                                                                e.target.value
                                                                                            )
                                                                                        }
                                                                                        className='border-none outline-none text-sm min-w-0 flex-1'
                                                                                        placeholder='Value'
                                                                                    />
                                                                                    {option.values.length > 1 && (
                                                                                        <button
                                                                                            onClick={() =>
                                                                                                removeOptionValue(
                                                                                                    variant.id,
                                                                                                    optionIndex,
                                                                                                    valueIndex
                                                                                                )
                                                                                            }
                                                                                            className='text-red-500 hover:text-red-700 transition-colors'
                                                                                        >
                                                                                            <X size={14} />
                                                                                        </button>
                                                                                    )}
                                                                                </div>
                                                                            ))}
                                                                            <button
                                                                                onClick={() =>
                                                                                    addOptionValue(
                                                                                        variant.id,
                                                                                        optionIndex
                                                                                    )
                                                                                }
                                                                                className='flex items-center gap-1 px-3 py-2 border-2 border-dashed border-gray-300 text-gray-500 hover:border-blue-500 hover:text-blue-600 rounded-lg transition-all'
                                                                            >
                                                                                <Plus size={14} />
                                                                                Add Value
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        {/* Generate Combinations */}
                                                        <div className='flex items-center justify-between'>
                                                            <div>
                                                                <p className='text-sm font-medium text-gray-700'>
                                                                    Variant Combinations
                                                                </p>
                                                                <p className='text-xs text-gray-500'>
                                                                    Generate all possible combinations from your options
                                                                </p>
                                                            </div>
                                                            <button
                                                                onClick={() => generateVariantCombinations(variant.id)}
                                                                className='flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all'
                                                            >
                                                                <Settings size={16} />
                                                                Generate
                                                            </button>
                                                        </div>

                                                        {/* Combinations Table */}
                                                        {variant.combinations.length > 0 && (
                                                            <div className='mt-4'>
                                                                <div className='overflow-x-auto'>
                                                                    <table className='w-full border border-gray-200 rounded-lg'>
                                                                        <thead className='bg-gray-50'>
                                                                            <tr>
                                                                                <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                                                                    Combination
                                                                                </th>
                                                                                <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                                                                    Price
                                                                                </th>
                                                                                <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                                                                    Compare Price
                                                                                </th>
                                                                                <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                                                                    SKU
                                                                                </th>
                                                                                <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                                                                    Inventory
                                                                                </th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody className='bg-white divide-y divide-gray-200'>
                                                                            {variant.combinations.map(combo => (
                                                                                <tr
                                                                                    key={combo.id}
                                                                                    className='hover:bg-gray-50'
                                                                                >
                                                                                    <td className='px-4 py-3'>
                                                                                        <div className='flex flex-wrap gap-1'>
                                                                                            {combo.combination.map(
                                                                                                (item, index) => (
                                                                                                    <span
                                                                                                        key={index}
                                                                                                        className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800'
                                                                                                    >
                                                                                                        {item.option}:{' '}
                                                                                                        {item.value}
                                                                                                    </span>
                                                                                                )
                                                                                            )}
                                                                                        </div>
                                                                                    </td>
                                                                                    <td className='px-4 py-3'>
                                                                                        <div className='relative'>
                                                                                            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                                                                                <span className='text-gray-500 text-sm'>
                                                                                                    $
                                                                                                </span>
                                                                                            </div>
                                                                                            <input
                                                                                                type='number'
                                                                                                value={combo.price}
                                                                                                onChange={e =>
                                                                                                    updateCombination(
                                                                                                        variant.id,
                                                                                                        combo.id,
                                                                                                        'price',
                                                                                                        e.target.value
                                                                                                    )
                                                                                                }
                                                                                                className='w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm'
                                                                                            />
                                                                                        </div>
                                                                                    </td>
                                                                                    <td className='px-4 py-3'>
                                                                                        <div className='relative'>
                                                                                            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                                                                                <span className='text-gray-500 text-sm'>
                                                                                                    $
                                                                                                </span>
                                                                                            </div>
                                                                                            <input
                                                                                                type='number'
                                                                                                value={
                                                                                                    combo.comparePrice
                                                                                                }
                                                                                                onChange={e =>
                                                                                                    updateCombination(
                                                                                                        variant.id,
                                                                                                        combo.id,
                                                                                                        'comparePrice',
                                                                                                        e.target.value
                                                                                                    )
                                                                                                }
                                                                                                className='w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm'
                                                                                            />
                                                                                        </div>
                                                                                    </td>
                                                                                    <td className='px-4 py-3'>
                                                                                        <input
                                                                                            type='text'
                                                                                            value={combo.sku}
                                                                                            onChange={e =>
                                                                                                updateCombination(
                                                                                                    variant.id,
                                                                                                    combo.id,
                                                                                                    'sku',
                                                                                                    e.target.value
                                                                                                )
                                                                                            }
                                                                                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm'
                                                                                            placeholder='SKU'
                                                                                        />
                                                                                    </td>
                                                                                    <td className='px-4 py-3'>
                                                                                        <input
                                                                                            type='number'
                                                                                            value={combo.inventory}
                                                                                            onChange={e =>
                                                                                                updateCombination(
                                                                                                    variant.id,
                                                                                                    combo.id,
                                                                                                    'inventory',
                                                                                                    parseInt(
                                                                                                        e.target.value
                                                                                                    ) || 0
                                                                                                )
                                                                                            }
                                                                                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm'
                                                                                            placeholder='0'
                                                                                        />
                                                                                    </td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Inventory & Shipping */}
                            {activeSection === 'inventory' && (
                                <div className='p-6 space-y-6'>
                                    <div className='border-b border-gray-200 pb-4'>
                                        <h2 className='text-xl font-semibold text-gray-900'>Inventory & Shipping</h2>
                                        <p className='text-gray-600 mt-1'>
                                            Manage stock levels and shipping information
                                        </p>
                                    </div>

                                    <div className='space-y-6'>
                                        {/* Inventory Tracking */}
                                        <div className='bg-gray-50 rounded-lg p-4'>
                                            <h3 className='font-medium text-gray-900 mb-4'>Inventory Tracking</h3>
                                            <div className='space-y-4'>
                                                <label className='flex items-center gap-3'>
                                                    <input
                                                        type='checkbox'
                                                        checked={formData.inventory.trackQuantity}
                                                        onChange={e =>
                                                            handleInputChange(
                                                                'trackQuantity',
                                                                e.target.checked,
                                                                'inventory'
                                                            )
                                                        }
                                                        className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                                                    />
                                                    <span className='text-sm font-medium text-gray-700'>
                                                        Track quantity
                                                    </span>
                                                </label>
                                                <label className='flex items-center gap-3'>
                                                    <input
                                                        type='checkbox'
                                                        checked={formData.inventory.continueSellingWhenOutOfStock}
                                                        onChange={e =>
                                                            handleInputChange(
                                                                'continueSellingWhenOutOfStock',
                                                                e.target.checked,
                                                                'inventory'
                                                            )
                                                        }
                                                        className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                                                    />
                                                    <span className='text-sm font-medium text-gray-700'>
                                                        Continue selling when out of stock
                                                    </span>
                                                </label>
                                            </div>
                                        </div>

                                        {/* Shipping */}
                                        <div className='bg-gray-50 rounded-lg p-4'>
                                            <h3 className='font-medium text-gray-900 mb-4'>Shipping</h3>
                                            <div className='space-y-4'>
                                                <label className='flex items-center gap-3'>
                                                    <input
                                                        type='checkbox'
                                                        checked={formData.inventory.requiresShipping}
                                                        onChange={e =>
                                                            handleInputChange(
                                                                'requiresShipping',
                                                                e.target.checked,
                                                                'inventory'
                                                            )
                                                        }
                                                        className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                                                    />
                                                    <span className='text-sm font-medium text-gray-700'>
                                                        This is a physical product
                                                    </span>
                                                </label>

                                                {formData.inventory.requiresShipping && (
                                                    <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mt-4'>
                                                        <div>
                                                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                                                Weight (kg)
                                                            </label>
                                                            <input
                                                                type='number'
                                                                value={formData.inventory.weight}
                                                                onChange={e =>
                                                                    handleInputChange(
                                                                        'weight',
                                                                        e.target.value,
                                                                        'inventory'
                                                                    )
                                                                }
                                                                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                                                placeholder='0.0'
                                                                step='0.1'
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                                                Length (cm)
                                                            </label>
                                                            <input
                                                                type='number'
                                                                value={formData.inventory.dimensions.length}
                                                                onChange={e => {
                                                                    setFormData(prev => ({
                                                                        ...prev,
                                                                        inventory: {
                                                                            ...prev.inventory,
                                                                            dimensions: {
                                                                                ...prev.inventory.dimensions,
                                                                                length: e.target.value
                                                                            }
                                                                        }
                                                                    }))
                                                                }}
                                                                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                                                placeholder='0'
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                                                Width (cm)
                                                            </label>
                                                            <input
                                                                type='number'
                                                                value={formData.inventory.dimensions.width}
                                                                onChange={e => {
                                                                    setFormData(prev => ({
                                                                        ...prev,
                                                                        inventory: {
                                                                            ...prev.inventory,
                                                                            dimensions: {
                                                                                ...prev.inventory.dimensions,
                                                                                width: e.target.value
                                                                            }
                                                                        }
                                                                    }))
                                                                }}
                                                                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                                                placeholder='0'
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                                                Height (cm)
                                                            </label>
                                                            <input
                                                                type='number'
                                                                value={formData.inventory.dimensions.height}
                                                                onChange={e => {
                                                                    setFormData(prev => ({
                                                                        ...prev,
                                                                        inventory: {
                                                                            ...prev.inventory,
                                                                            dimensions: {
                                                                                ...prev.inventory.dimensions,
                                                                                height: e.target.value
                                                                            }
                                                                        }
                                                                    }))
                                                                }}
                                                                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                                                placeholder='0'
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* SEO & Visibility */}
                            {activeSection === 'seo' && (
                                <div className='p-6 space-y-6'>
                                    <div className='border-b border-gray-200 pb-4'>
                                        <h2 className='text-xl font-semibold text-gray-900'>SEO & Visibility</h2>
                                        <p className='text-gray-600 mt-1'>Optimize your product for search engines</p>
                                    </div>

                                    <div className='space-y-6'>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                                Page Title
                                            </label>
                                            <input
                                                type='text'
                                                value={formData.seo.title}
                                                onChange={e => handleInputChange('title', e.target.value, 'seo')}
                                                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                                placeholder='Enter SEO title'
                                            />
                                            <p className='text-sm text-gray-500 mt-1'>
                                                {formData.seo.title.length}/60 characters
                                            </p>
                                        </div>

                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                                Meta Description
                                            </label>
                                            <textarea
                                                value={formData.seo.description}
                                                onChange={e => handleInputChange('description', e.target.value, 'seo')}
                                                rows={3}
                                                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none'
                                                placeholder='Enter meta description'
                                            />
                                            <p className='text-sm text-gray-500 mt-1'>
                                                {formData.seo.description.length}/160 characters
                                            </p>
                                        </div>

                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                                Keywords
                                            </label>
                                            <input
                                                type='text'
                                                value={formData.seo.keywords}
                                                onChange={e => handleInputChange('keywords', e.target.value, 'seo')}
                                                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                                placeholder='Enter keywords separated by commas'
                                            />
                                        </div>

                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                                Product Status
                                            </label>
                                            <select
                                                value={formData.status}
                                                onChange={e => handleInputChange('status', e.target.value)}
                                                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                            >
                                                <option value='draft'>Draft</option>
                                                <option value='published'>Published</option>
                                                <option value='archived'>Archived</option>
                                            </select>
                                        </div>

                                        {/* SEO Preview */}
                                        <div className='bg-gray-50 rounded-lg p-4'>
                                            <h3 className='font-medium text-gray-900 mb-3'>Search Engine Preview</h3>
                                            <div className='bg-white border border-gray-200 rounded-lg p-4'>
                                                <div className='text-blue-600 text-lg font-medium line-clamp-1'>
                                                    {formData.seo.title || formData.name || 'Product Title'}
                                                </div>
                                                <div className='text-green-600 text-sm mt-1'>
                                                    yourstore.com/products/
                                                    {formData.name.toLowerCase().replace(/\s+/g, '-') || 'product-name'}
                                                </div>
                                                <div className='text-gray-600 text-sm mt-2 line-clamp-2'>
                                                    {formData.seo.description ||
                                                        formData.description ||
                                                        'Product description will appear here...'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Preview Modal */}
            {previewMode && (
                <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4'>
                    <div className='bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto'>
                        <div className='sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between'>
                            <h3 className='text-lg font-semibold text-gray-900'>Product Preview</h3>
                            <button
                                onClick={() => setPreviewMode(false)}
                                className='p-2 hover:bg-gray-100 rounded-lg transition-all'
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className='p-6'>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                                <div>
                                    {formData.images.length > 0 ? (
                                        <div className='aspect-square bg-gray-100 rounded-lg overflow-hidden'>
                                            <img
                                                src={
                                                    formData.images.find(img => img.isPrimary)?.url ||
                                                    formData.images[0]?.url
                                                }
                                                alt={formData.name}
                                                className='w-full h-full object-cover'
                                            />
                                        </div>
                                    ) : (
                                        <div className='aspect-square bg-gray-100 rounded-lg flex items-center justify-center'>
                                            <ImageIcon size={48} className='text-gray-400' />
                                        </div>
                                    )}
                                </div>
                                <div className='space-y-4'>
                                    <h1 className='text-2xl font-bold text-gray-900'>
                                        {formData.name || 'Product Name'}
                                    </h1>
                                    <div className='flex items-center gap-4'>
                                        {formData.price && (
                                            <span className='text-2xl font-bold text-blue-600'>${formData.price}</span>
                                        )}
                                        {formData.comparePrice &&
                                            parseFloat(formData.comparePrice) > parseFloat(formData.price) && (
                                                <span className='text-lg text-gray-500 line-through'>
                                                    ${formData.comparePrice}
                                                </span>
                                            )}
                                    </div>
                                    <p className='text-gray-600'>
                                        {formData.description || 'Product description will appear here...'}
                                    </p>
                                    {formData.tags.length > 0 && (
                                        <div className='flex flex-wrap gap-2'>
                                            {formData.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className='px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm'
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AddProductPage
