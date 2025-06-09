'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

interface AdvancedSearchInputProps {
    products: string[]
    onProductSelect: (productName: string) => void
}

const MAX_SUGGESTIONS = 10

const removeDiacritics = (str: string): string => {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, c => (c === 'đ' ? 'd' : 'D'))
}

// Tính toán độ tương đồng giữa 2 chuỗi (Levenshtein distance)
const calculateSimilarity = (str1: string, str2: string): number => {
    const len1 = str1.length
    const len2 = str2.length
    const matrix = Array(len2 + 1)
        .fill(null)
        .map(() => Array(len1 + 1).fill(null))

    for (let i = 0; i <= len1; i++) matrix[0][i] = i
    for (let j = 0; j <= len2; j++) matrix[j][0] = j

    for (let j = 1; j <= len2; j++) {
        for (let i = 1; i <= len1; i++) {
            const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1
            matrix[j][i] = Math.min(matrix[j][i - 1] + 1, matrix[j - 1][i] + 1, matrix[j - 1][i - 1] + indicator)
        }
    }

    const maxLen = Math.max(len1, len2)
    return maxLen === 0 ? 1 : 1 - matrix[len2][len1] / maxLen
}

// Thuật toán tìm kiếm thông minh
const smartSearch = (products: string[], query: string): string[] => {
    if (!query.trim()) return products.slice(0, MAX_SUGGESTIONS)

    const normalizedQuery = removeDiacritics(query.toLowerCase())
    const queryWords = normalizedQuery.split(/\s+/).filter(Boolean)

    // Tính điểm cho mỗi sản phẩm
    const scored = products.map(product => {
        const normalizedProduct = removeDiacritics(product.toLowerCase())
        const productWords = normalizedProduct.split(/\s+/)

        let score = 0

        // 1. Exact match (điểm cao nhất)
        if (normalizedProduct.includes(normalizedQuery)) {
            score += 100
        }

        // 2. Starts with query (điểm cao)
        if (normalizedProduct.startsWith(normalizedQuery)) {
            score += 80
        }

        // 3. Word-level matching
        queryWords.forEach(queryWord => {
            productWords.forEach(productWord => {
                // Exact word match
                if (productWord === queryWord) {
                    score += 50
                }
                // Word starts with query word
                else if (productWord.startsWith(queryWord)) {
                    score += 30
                }
                // Fuzzy matching với similarity
                else {
                    const similarity = calculateSimilarity(queryWord, productWord)
                    if (similarity > 0.6) {
                        score += similarity * 20
                    }
                }
            })
        })

        // 4. Character-level fuzzy matching cho từ ngắn
        if (normalizedQuery.length >= 2) {
            const similarity = calculateSimilarity(normalizedQuery, normalizedProduct)
            if (similarity > 0.3) {
                score += similarity * 10
            }
        }

        return { product, score }
    })

    // Sắp xếp theo điểm và lọc những sản phẩm có điểm > 0
    return scored
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, MAX_SUGGESTIONS)
        .map(item => item.product)
}

const highlightMatch = (text: string, searchTerm: string): React.ReactNode => {
    if (!searchTerm.trim()) return text

    const normalizedSearch = removeDiacritics(searchTerm.toLowerCase())
    const keywords = normalizedSearch.split(/\s+/).filter(Boolean)

    const parts = text.split(/(\s+)/).map((part, idx) => {
        const normalizedPart = removeDiacritics(part.toLowerCase())
        const match = keywords.some(
            kw =>
                normalizedPart.includes(kw) ||
                normalizedPart.startsWith(kw) ||
                calculateSimilarity(kw, normalizedPart) > 0.7
        )
        return match ? (
            <span key={idx} className='bg-blue-100 text-blue-800 px-1 rounded font-medium'>
                {part}
            </span>
        ) : (
            part
        )
    })

    return <>{parts}</>
}

const AdvancedSearchInput: React.FC<AdvancedSearchInputProps> = ({ products, onProductSelect }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [suggestions, setSuggestions] = useState<string[]>([])
    const [selectedIndex, setSelectedIndex] = useState<number>(-1)
    const containerRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const searchParams = useSearchParams()
    const keyword = searchParams.get('keyword') || ''
    const [searchQuery, setSearchQuery] = useState(keyword)

    useEffect(() => {
        if (!searchQuery.trim()) {
            // Hiển thị 10 sản phẩm đầu tiên khi không có search query
            setSuggestions(products.slice(0, MAX_SUGGESTIONS))
            return
        }

        const matches = smartSearch(products, searchQuery)

        setSuggestions(matches)
        setSelectedIndex(-1)
    }, [searchQuery, products])

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleInputFocus = () => {
        setIsDropdownOpen(true)
        if (!searchQuery.trim()) {
            setSuggestions(products.slice(0, MAX_SUGGESTIONS))
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!isDropdownOpen || !suggestions.length) return

        if (e.key === 'ArrowDown') {
            e.preventDefault()
            setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : 0))
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setSelectedIndex(prev => (prev > 0 ? prev - 1 : suggestions.length - 1))
        } else if (e.key === 'Enter') {
            e.preventDefault()
            onProductSelect(searchQuery)
            setIsDropdownOpen(false)
            inputRef.current?.blur()
        } else if (e.key === 'Escape') {
            setIsDropdownOpen(false)
            inputRef.current?.blur()
        }
    }

    const handleSuggestionClick = (item: string) => {
        setSearchQuery(item)
        onProductSelect(item)
        setIsDropdownOpen(false)
        inputRef.current?.blur()
    }

    const clearSearch = () => {
        setSearchQuery('')
        setSuggestions(products.slice(0, MAX_SUGGESTIONS))
        inputRef.current?.focus()
    }

    return (
        <div ref={containerRef} className='hidden md:flex flex-1 w-[562px] max-w-xl mx-6 relative'>
            <div
                className={`flex w-full items-center overflow-hidden rounded-full border bg-white shadow-md transition-all duration-100 ${
                    isDropdownOpen
                        ? 'border-blue-500 shadow-lg shadow-blue-100/50'
                        : 'border-gray-200 hover:border-gray-300'
                }`}
            >
                <input
                    ref={inputRef}
                    type='text'
                    placeholder='Tìm kiếm sản phẩm...'
                    className='w-full py-3 pl-4 pr-2 focus:outline-none bg-transparent text-gray-800 placeholder-gray-400'
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onFocus={handleInputFocus}
                    onKeyDown={handleKeyDown}
                />
                {searchQuery && (
                    <button
                        className='mr-2 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-100'
                        onClick={clearSearch}
                    >
                        <X size={16} />
                    </button>
                )}
                <button
                    className='mr-4 text-gray-400 hover:text-blue-600 transition-colors duration-150'
                    onClick={() => onProductSelect(searchQuery)}
                >
                    <Search size={20} />
                </button>
            </div>

            {isDropdownOpen && (
                <div className='absolute top-full left-0 right-0 mt-1 bg-white shadow-xl rounded-xl border border-gray-100 z-50 overflow-hidden'>
                    {suggestions.length > 0 ? (
                        <div className='py-2'>
                            {!searchQuery.trim() && (
                                <div className='px-4 py-2 text-xs font-medium text-gray-600 uppercase tracking-wide border-b border-gray-100'>
                                    Sản phẩm gợi ý
                                </div>
                            )}
                            {suggestions.map((item, idx) => (
                                <div
                                    key={idx}
                                    className={`px-4 py-3 cursor-pointer flex items-center ${
                                        idx === selectedIndex
                                            ? 'bg-blue-50 border-l-4 border-blue-500'
                                            : 'hover:bg-gray-50 border-l-4 border-transparent'
                                    }`}
                                    onMouseDown={() => handleSuggestionClick(item)}
                                    onMouseEnter={() => setSelectedIndex(idx)}
                                >
                                    <div className='flex-1 text-gray-800'>{highlightMatch(item, searchQuery)}</div>
                                    {/* {idx === selectedIndex && (
                                        <div className='text-blue-400 text-xs font-medium'>Enter</div>
                                    )} */}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className='py-8 px-4 text-center'>
                            <div className='text-blue-600 mb-3'>
                                <Search size={32} className='mx-auto' />
                            </div>
                            <div className='text-gray-700 font-medium'>Không có sản phẩm phù hợp</div>
                            <div className='text-gray-500 text-sm mt-2'>Thử tìm kiếm với từ khóa khác</div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default AdvancedSearchInput
