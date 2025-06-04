'use client'

import { useEffect, useState } from 'react'
import { FolderPlus, X, Loader2, ChevronDown } from 'lucide-react'
import { formatCurrency } from '@/common/format'
import { useAddProductIntoProjectMutation, useSearchProjectQuery } from '@/services/UserProjectService'
import { IProjectGetAll } from '@/models/Project'
import { useToast } from '@/hooks/useToast'
import { IFavoriteItem } from '@/models/Favorite'

interface ProjectFormModalProps {
    isOpen: boolean
    onClose: () => void
    productId: number
    productName: string
    currentPrice: number
    selections: IFavoriteItem[]
}

export default function ProjectFormModal({
    isOpen,
    onClose,
    productId,
    productName,
    selections,
    currentPrice
}: ProjectFormModalProps) {
    const [selectedProjects, setSelectedProjects] = useState<any[]>([])
    const [quantity, setQuantity] = useState('1')
    const [searchTerm, setSearchTerm] = useState('')
    const [showDropdown, setShowDropdown] = useState(false)
    const [filteredProjects, setFilteredProjects] = useState<IProjectGetAll[]>([])
    const [addProjectIntoProject, { isLoading: isAddingIntoProject }] = useAddProductIntoProjectMutation()

    const toast = useToast()

    const { data: projectResponse } = useSearchProjectQuery({
        pageSize: 100,
        pageNumber: 1
    })
    const projectData = (projectResponse?.data?.records as IProjectGetAll[]) || []

    useEffect(() => {
        if (projectResponse?.data?.records) {
            setFilteredProjects(projectResponse?.data?.records)
        }
    }, [projectResponse])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement
            const dropdown = document.getElementById('project-dropdown')
            const input = document.getElementById('project-search-input')

            if (dropdown && input && !dropdown.contains(target) && !input.contains(target)) {
                setShowDropdown(false)
            }
        }

        if (showDropdown) {
            document.addEventListener('mousedown', handleClickOutside)
        } else {
            document.removeEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [showDropdown])

    useEffect(() => {
        const filtered = projectData.filter(project =>
            project.projectName.toLowerCase().includes(searchTerm.toLowerCase())
        )
        setFilteredProjects(filtered)
    }, [searchTerm])

    const handleSubmit = async () => {
        if (selectedProjects.length === 0 || !quantity) return

        const projectIds = selectedProjects.map(p => p.id)
        const quantityValue = parseInt(quantity)
        await addProjectIntoProject({
            projectIds,
            productId,
            quantity: quantityValue,
            selections: selections
        })
            .unwrap()
            .then(() => {
                toast('Thêm sản phẩm vào dự án thành công', 'success')
            })
            .catch(() => {
                toast('Thêm sản phẩm vào dự án thất bại', 'error')
            })
        closeModal()
    }

    const closeModal = () => {
        onClose()
        setSelectedProjects([])
        setQuantity('1')
        setSearchTerm('')
        setShowDropdown(false)
    }

    const handleProjectSelect = (project: any) => {
        const isSelected = selectedProjects.some(p => p.id === project.id)

        if (isSelected) {
            setSelectedProjects(selectedProjects.filter(p => p.id !== project.id))
        } else {
            setSelectedProjects([...selectedProjects, project])
        }
    }

    if (!isOpen) return null

    return (
        <div>
            <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                <div className='bg-white rounded-xl shadow-xl w-full max-w-md mx-4'>
                    {/* Header */}
                    <div className='px-6 py-4 border-b flex items-center justify-between'>
                        <h2 className='font-bold text-[18px] text-gray-800 flex items-center'>
                            <FolderPlus size={20} className='w-5 h-5 text-blue-500 mr-3' />
                            Thêm vào dự án
                        </h2>
                        <button
                            onClick={closeModal}
                            disabled={isAddingIntoProject}
                            className='text-gray-500 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className='p-6 space-y-5'>
                        {/* Product Info */}
                        <div className='bg-gray-50 rounded-lg p-4'>
                            <h3 className='font-medium text-gray-900 mb-2'>{productName}</h3>
                            <p className='text-blue-600 font-semibold'>
                                Giá hiện tại: {currentPrice.toLocaleString()} VND
                            </p>
                        </div>

                        {/* Project Selection */}
                        <div className='space-y-3'>
                            <label className='block text-sm font-medium text-gray-700'>Chọn dự án</label>
                            <div className='relative'>
                                <input
                                    id='project-search-input'
                                    type='text'
                                    value={searchTerm}
                                    onChange={e => {
                                        setSearchTerm(e.target.value)
                                        setShowDropdown(true)
                                    }}
                                    onFocus={() => setShowDropdown(true)}
                                    //onBlur={() => setTimeout(() => setShowDropdown(false), 50)}
                                    disabled={isAddingIntoProject}
                                    className='w-full border border-gray-300 rounded-lg pl-4 pr-10 py-3 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50'
                                    placeholder='Tìm kiếm dự án...'
                                />
                                <ChevronDown className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none' />

                                {/* Dropdown */}
                                {showDropdown && (
                                    <div
                                        id='project-dropdown'
                                        className='absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto'
                                    >
                                        {filteredProjects.length > 0 ? (
                                            filteredProjects.map(project => {
                                                const isSelected = selectedProjects.some(p => p.id === project.id)
                                                return (
                                                    <button
                                                        key={project.id}
                                                        onClick={() => handleProjectSelect(project)}
                                                        className={`w-full px-4 py-3 text-left hover:bg-blue-50 border-b border-gray-100 last:border-b-0`}
                                                    >
                                                        <div
                                                            className={`font-medium ${
                                                                isSelected ? 'text-blue-600' : 'text-gray-900'
                                                            }`}
                                                        >
                                                            {project.projectName}
                                                            {isSelected && ' ✓'}
                                                        </div>
                                                        <div className='text-sm text-gray-500 mt-1 line-clamp-1'>
                                                            {project.description}
                                                        </div>
                                                    </button>
                                                )
                                            })
                                        ) : (
                                            <p className='px-4 py-3 italic text-center text-gray-500'>
                                                Không tìm thấy dự án nào
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className='text-sm text-green-600'>
                                {selectedProjects.length > 0
                                    ? `Đã chọn ${selectedProjects.length} dự án:`
                                    : 'Vui lòng chọn dự án để thêm sản phẩm'}
                                <ul>
                                    {selectedProjects.map(project => (
                                        <li key={project.id} className='mt-1.5 flex items-center justify-between'>
                                            <span className='font-medium text-green-600'>{project.projectName}</span>
                                            <button
                                                onClick={() => handleProjectSelect(project)}
                                                className='ml-2 text-red-500 hover:text-red-700'
                                            >
                                                Xóa
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Quantity */}
                        <div className='space-y-3'>
                            <label className='block text-sm font-medium text-gray-700'>Số lượng</label>
                            <div className='relative'>
                                <input
                                    type='number'
                                    min='1'
                                    value={quantity}
                                    onChange={e => {
                                        if (!e.target.value.trim()) return
                                        setQuantity(e.target.value)
                                    }}
                                    disabled={isAddingIntoProject}
                                    className='w-full border border-gray-300 rounded-lg pl-4 pr-4 py-3 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50'
                                    placeholder='Nhập số lượng'
                                />
                            </div>
                            {quantity && parseInt(quantity) > 0 && (
                                <p className='text-blue-600 font-medium'>
                                    Tổng giá trị: {formatCurrency(currentPrice * parseInt(quantity))}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className='px-6 py-4 border-t flex justify-end space-x-4'>
                        <button
                            onClick={closeModal}
                            disabled={isAddingIntoProject}
                            className='px-6 py-2 font-medium border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={
                                isAddingIntoProject ||
                                selectedProjects.length == 0 ||
                                !quantity ||
                                parseInt(quantity) < 1
                            }
                            className='px-6 py-2 font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-500'
                        >
                            {isAddingIntoProject ? (
                                <Loader2 size={16} className='mr-2 animate-spin' />
                            ) : (
                                <FolderPlus size={16} className='mr-2' />
                            )}
                            Thêm vào dự án
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
