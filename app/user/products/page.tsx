'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Search, ChevronDown, Filter, ChevronUp } from 'lucide-react'
import ProductCard from '../ProductCard'
import { IProductFilter, IProductSearch } from '@/models/Product'
import EmptyItem from '@/components/EmptyItem'
import EnhancedPagination from '@/components/EnhancedPagination'
import { useTranslation } from 'react-i18next'
import { useSearchProductQuery } from '@/services/UserProductService'
import Loading from '@/components/Loading'
import { useSearchCategoryQuery } from '@/services/CategoryService'
import { useSearchBrandQuery } from '@/services/BrandService'
import { useSearchFeatureQuery } from '@/services/FeatureService'
import { IFeature } from '@/models/Feature'
import { IBrand } from '@/models/Brand'
import { ICategory } from '@/models/Category'
import { useSearchParams } from 'next/navigation'

export default function AutomationShop() {
    const { t } = useTranslation('common')
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
    const searchParams = useSearchParams()
    const keyword = searchParams.get('keyword') || ''
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [filterProductSearch, setFilterProductSearch] = useState<IProductFilter>({
        pageSize: 12,
        pageNumber: 1,
        keyword: keyword
    })

    useEffect(() => {
        setFilterProductSearch(prev => ({
            ...prev,
            keyword: keyword || ''
        }))
    }, [keyword])

    const {
        data: dataResponseAll,
        isLoading: isLoadingResponseAll,
        isFetching,
        refetch
    } = useSearchProductQuery(filterProductSearch)

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

    const totalRecords = dataResponseAll?.data.totalRecords || 0

    const categories = Array.isArray(categoryResponse?.data.records)
        ? (categoryResponse?.data.records as ICategory[])
        : []
    const brands = Array.isArray(brandResponse?.data.records) ? (brandResponse?.data.records as IBrand[]) : []
    const features = Array.isArray(featuresResponse?.data.records) ? (featuresResponse?.data.records as IFeature[]) : []
    const products = Array.isArray(dataResponseAll?.data.records)
        ? (dataResponseAll?.data.records as IProductSearch[])
        : []

    const DROPDOWN_OPTIONS = {
        sort: [
            { value: 'popular', label: 'Phổ biến nhất' },
            { value: 'newest', label: 'Mới nhất trước' },
            { value: 'price_asc', label: 'Giá thấp đến cao' },
            { value: 'price_desc', label: 'Giá cao đến thấp' }
        ],
        availability: [
            { value: 'all', label: 'Tất cả sản phẩm' },
            { value: 'in-stock', label: 'Còn hàng' },
            { value: 'out-of-stock', label: 'Hết hàng' },
            { value: 'pre-order', label: 'Đặt trước' }
        ],
        techFeatures: features
            ? features.map(feature => ({
                  value: feature.id,
                  label: feature.featureName
              }))
            : []
    }

    const priceRange = [
        { value: 'under_1m', label: t('COMMON.USER.PRICE_UNDER_1M') },
        { value: '1_5m', label: t('COMMON.USER.PRICE_1M_5M') },
        { value: '5_10m', label: t('COMMON.USER.PRICE_5M_10M') },
        { value: '10_50m', label: t('COMMON.USER.PRICE_10M_50M') },
        { value: 'above_50m', label: t('COMMON.USER.PRICE_ABOVE_50M') }
    ]

    useEffect(() => {
        refetch()
    }, [filterProductSearch])

    const handleBrandChange = (value: string) => {
        if (filterProductSearch.brands && filterProductSearch.brands.includes(value)) {
            setFilterProductSearch({
                ...filterProductSearch,
                pageNumber: 1,
                brands: filterProductSearch.brands.filter(brand => brand !== value)
            })
        } else if (filterProductSearch.brands) {
            setFilterProductSearch({
                ...filterProductSearch,
                pageNumber: 1,
                brands: [...filterProductSearch.brands, value]
            })
        } else {
            setFilterProductSearch({
                ...filterProductSearch,
                pageNumber: 1,
                brands: [value]
            })
        }
    }

    const handlePageChange = (page: number) => {
        setFilterProductSearch({
            ...filterProductSearch,
            pageNumber: page
        })
    }

    const handleResetFilters = () => {
        setFilterProductSearch({
            ...filterProductSearch,
            pageNumber: 1,
            categoryIds: undefined,
            brands: undefined,
            priceRange: '',
            stockStatus: '',
            featureIds: undefined,
            sortBy: undefined
        })
    }

    const toggleFilter = () => {
        setIsFilterOpen(!isFilterOpen)
    }

    if (isLoadingResponseAll || isLoadingCategory || isLoadingBrand || isLoadingFeature) {
        return <Loading />
    }

    return (
        <div className='max-w-7xl mx-auto sm:px-6 space-y-8 lg:px-8'>
            <div>
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
                            <div className='flex items-center h-[65px] -m-6 mb-6 border-b border-blue-100 pl-6 rounded-t-[14px]'>
                                <Filter className='mr-3 text-blue-600' size={19} />
                                <h2 className='text-black font-bold text-lg'>Bộ lọc sản phẩm</h2>
                            </div>

                            {/* Category filter */}
                            <div className='mb-6'>
                                <div className='flex items-center mb-4'>
                                    <div className='w-1 h-6 bg-blue-500 rounded-full mr-2'></div>
                                    <h3 className='font-bold text-gray-800'>Danh mục sản phẩm</h3>
                                </div>
                                <ul className='space-y-1.5 pl-1'>
                                    {categories &&
                                        categories.length > 0 &&
                                        categories.map(cat => {
                                            const isSelected =
                                                filterProductSearch.categoryIds &&
                                                filterProductSearch.categoryIds.includes(cat.id)

                                            return (
                                                <li key={cat.id}>
                                                    <button
                                                        className={`w-full text-left py-2 px-3 rounded-lg transition-all duration-200 flex items-center ${
                                                            isSelected
                                                                ? 'bg-blue-500 hover:bg-blue-600 text-white font-medium shadow-md'
                                                                : 'hover:bg-blue-50 text-gray-700'
                                                        }`}
                                                        onClick={() =>
                                                            setFilterProductSearch({
                                                                ...filterProductSearch,
                                                                pageNumber: 1,
                                                                categoryIds: isSelected
                                                                    ? filterProductSearch.categoryIds.filter(
                                                                          id => id !== cat.id
                                                                      )
                                                                    : filterProductSearch.categoryIds
                                                                    ? [...filterProductSearch.categoryIds, cat.id]
                                                                    : [cat.id]
                                                            })
                                                        }
                                                    >
                                                        {isSelected && (
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
                                                        {cat.categoryName}
                                                    </button>
                                                </li>
                                            )
                                        })}
                                </ul>
                            </div>

                            {/* Price filter */}
                            <div className='mb-6'>
                                <div className='flex items-center mb-4'>
                                    <div className='w-1 h-6 bg-blue-500 rounded-full mr-2'></div>
                                    <h3 className='font-bold text-gray-800'>Khoảng giá</h3>
                                </div>
                                <ul className='space-y-1.5 pl-1'>
                                    {priceRange &&
                                        priceRange.length > 0 &&
                                        priceRange.map((range, index) => (
                                            <li key={index}>
                                                <button
                                                    className={`w-full text-left py-2 px-3 rounded-lg transition-all duration-200 flex items-center ${
                                                        range.value === filterProductSearch.priceRange
                                                            ? 'bg-blue-500 hover:bg-blue-600 text-white font-medium shadow-md'
                                                            : 'hover:bg-blue-50 text-gray-700'
                                                    }`}
                                                    onClick={() =>
                                                        setFilterProductSearch({
                                                            ...filterProductSearch,
                                                            pageNumber: 1,
                                                            priceRange: range.value
                                                        })
                                                    }
                                                >
                                                    {range.value === filterProductSearch.priceRange && (
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
                                                    {range.label}
                                                </button>
                                            </li>
                                        ))}
                                </ul>
                            </div>

                            {/* Brand filter */}
                            <div className='mb-6'>
                                <div className='flex items-center mb-4'>
                                    <div className='w-1 h-6 bg-blue-500 rounded-full mr-2'></div>
                                    <h3 className='font-bold text-gray-800'>Thương hiệu</h3>
                                </div>
                                <div className='space-y-1.5 pl-1'>
                                    {brands &&
                                        brands.map(brand => (
                                            <label
                                                key={brand.id}
                                                className={`w-full text-left py-2 px-3 cursor-pointer hover:bg-blue-50 rounded-lg transition-all duration-200 flex items-center ${
                                                    filterProductSearch.brands &&
                                                    filterProductSearch.brands.includes(brand.brandName)
                                                        ? 'bg-blue-100'
                                                        : ''
                                                }`}
                                            >
                                                <input
                                                    type='checkbox'
                                                    className='w-[17px] h-[17px] rounded text-blue-600 accent-[#3675ff] focus:ring-blue-400 border-gray-300'
                                                    checked={!!filterProductSearch.brands?.includes(brand.brandName)}
                                                    onChange={() => handleBrandChange(brand.brandName)}
                                                />
                                                <span className='ml-3 text-gray-700'>{brand.brandName}</span>
                                            </label>
                                        ))}
                                </div>
                            </div>

                            {/* Clear filters button with gradient hover */}
                            <button
                                className='w-full bg-blue-500 text-white py-3 px-6 rounded-lg font-medium transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-400 shadow-md hover:shadow-lg transform'
                                onClick={handleResetFilters}
                            >
                                Xóa tất cả bộ lọc
                            </button>
                        </div>
                    </div>

                    {/* Product list */}
                    <div className='flex-1'>
                        {/* Sorting and view options */}
                        <div className='mb-6 bg-white rounded-[15px] shadow-[0_4px_16px_rgba(0,0,0,0.1)] border border-blue-100'>
                            <div
                                className={`h-[65px] rounded-t-[14px] pl-6 flex justify-between items-center ${
                                    isFilterOpen ? 'border-b border-blue-100' : 'border-none -mb-[0.5px] -mt-[0.5px]'
                                }`}
                            >
                                <h2 className='text-black font-bold text-lg flex items-center'>
                                    <Search className='mr-3 text-blue-600' size={20} />
                                    Tìm kiếm và Sắp xếp
                                </h2>

                                <button
                                    onClick={toggleFilter}
                                    className={`flex items-center px-4 py-2 mr-6 rounded-lg transition-all duration-200 ${
                                        isFilterOpen
                                            ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    <Filter className='mr-2' size={16} />
                                    <span className='text-sm font-medium mr-2'>
                                        {isFilterOpen ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
                                    </span>
                                    {isFilterOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </button>
                            </div>

                            {
                                <div
                                    className={`transition-all duration-300 ease-in-out ${
                                        isFilterOpen ? 'h-auto opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                                    }`}
                                >
                                    <div className='p-6 grid grid-cols-1 md:grid-cols-3 gap-6'>
                                        <TechFeaturesSelect
                                            label='Tính năng nổi bật:'
                                            selectedValues={filterProductSearch.featureIds || []}
                                            onChange={value => {
                                                setFilterProductSearch({
                                                    ...filterProductSearch,
                                                    pageNumber: 1,
                                                    featureIds:
                                                        filterProductSearch.featureIds &&
                                                        filterProductSearch.featureIds.includes(value)
                                                            ? filterProductSearch.featureIds.filter(id => id !== value)
                                                            : filterProductSearch.featureIds
                                                            ? [...filterProductSearch.featureIds, value]
                                                            : [value]
                                                })
                                            }}
                                            options={DROPDOWN_OPTIONS.techFeatures}
                                        />

                                        <EnhancedSelect
                                            label='Sắp xếp theo:'
                                            value={filterProductSearch.sortBy || ''}
                                            onChange={value =>
                                                setFilterProductSearch({
                                                    ...filterProductSearch,
                                                    pageNumber: 1,
                                                    sortBy: String(value)
                                                })
                                            }
                                            options={DROPDOWN_OPTIONS.sort}
                                        />

                                        <EnhancedSelect
                                            label='Tình trạng hàng:'
                                            value={filterProductSearch.stockStatus || ''}
                                            onChange={value =>
                                                setFilterProductSearch({
                                                    ...filterProductSearch,
                                                    pageNumber: 1,
                                                    stockStatus: String(value)
                                                })
                                            }
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
                                            Hiển thị {products.length} sản phẩm
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
                            }
                        </div>

                        {/* Product grid/list */}
                        {isFetching ? (
                            <div className='flex items-center justify-center p-12'>
                                <div className='rounded-[15px] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.1)] bg-white p-12 max-w-md w-full text-center'>
                                    <div className='relative w-16 h-16 mx-auto mb-6'>
                                        <div className='absolute inset-0 rounded-full border-4 border-blue-100'></div>
                                        <div className='absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin'></div>
                                        <div className='absolute inset-2 rounded-full border-2 border-transparent border-t-blue-400 animate-spin animate-reverse'></div>
                                    </div>
                                    <h2 className='text-xl font-bold text-gray-900 mb-3'>Đang xử lý</h2>
                                    <p className='text-gray-600'>Vui lòng chờ trong giây lát...</p>
                                    <div className='flex justify-center space-x-1 mt-6'>
                                        <div className='w-2 h-2 bg-blue-400 rounded-full animate-bounce'></div>
                                        <div
                                            className='w-2 h-2 bg-blue-400 rounded-full animate-bounce'
                                            style={{ animationDelay: '0.1s' }}
                                        ></div>
                                        <div
                                            className='w-2 h-2 bg-blue-400 rounded-full animate-bounce'
                                            style={{ animationDelay: '0.2s' }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        ) : products.length > 0 ? (
                            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                                {products.map((product, index) => (
                                    <ProductCard product={product} key={index} />
                                ))}
                            </div>
                        ) : (
                            <EmptyItem
                                title='Không tìm thấy sản phẩm'
                                description='Rất tiếc, chúng tôi không tìm thấy sản phẩm nào phù hợp với bộ lọc của bạn.'
                                buttonText='Xóa bộ lọc'
                                icon={<Search className='w-10 h-10 text-blue-600' />}
                                onClick={handleResetFilters}
                            />
                        )}

                        {products.length > 0 && (
                            <div className='mt-8'>
                                <EnhancedPagination
                                    totalItems={totalRecords}
                                    itemsPerPage={12}
                                    currentPage={filterProductSearch.pageNumber}
                                    onPageChange={handlePageChange}
                                    siblingCount={1}
                                    showFirstLast={true}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
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

type EnhancedSelectProps = {
    label: string
    value: string | number
    onChange: (value: string | number) => void
    options: { value: string | number; label: string; icon?: string }[]
    type?: string
}

export const EnhancedSelect = ({ label, value, onChange, options }: EnhancedSelectProps) => {
    const { isOpen, toggleDropdown, closeDropdown, dropdownRef } = useDropdownState()

    // Find the currently selected option
    const selectedOption = options.find(opt => opt.value === value)

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
    selectedValues: number[]
    onChange: (values: number) => void
    options: { value: number; label: string; icon?: string }[]
}

export const TechFeaturesSelect = ({ label, selectedValues = [], onChange, options }: TechFeaturesSelectProps) => {
    const { isOpen, toggleDropdown, dropdownRef } = useDropdownState()

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
                                        onChange={() => onChange(option.value)}
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
