'use client'

import { useState, useEffect } from 'react'
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragStartEvent,
    DragOverlay
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {
    HiOutlineMenuAlt2,
    HiOutlinePencil,
    HiOutlineTrash,
    HiOutlineSave,
    HiOutlineX,
    HiOutlinePlus,
    HiOutlineChevronRight,
    HiOutlineChevronDown
} from 'react-icons/hi'

// Định nghĩa kiểu dữ liệu cho danh mục
interface Category {
    id: string
    name: string
    description?: string
    order: number
    parentId?: string
    children?: Category[]
    level: 1 | 2 | 3
    isExpanded?: boolean
}

// Component hiển thị danh mục có thể kéo thả
const SortableCategory = ({
    category,
    onEdit,
    onDelete,
    onToggleExpand,
    onAddChild,
    level,
    isDragging
}: {
    category: Category
    onEdit: (id: string) => void
    onDelete: (id: string) => void
    onToggleExpand: (id: string) => void
    onAddChild: (parentId: string, level: number) => void
    level: number
    isDragging?: boolean
}) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: category.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    }

    const hasChildren = category.children && category.children.length > 0
    const indentClass = `ml-${(level - 1) * 6}`
    const levelColorClass =
        level === 1 ? 'border-l-blue-500' : level === 2 ? 'border-l-green-500' : 'border-l-amber-500'

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`${indentClass} border-l-4 ${levelColorClass} bg-white rounded-lg shadow-md p-4 mb-3 hover:shadow-lg transition-all duration-200 flex items-center ${
                isDragging ? 'opacity-50' : ''
            }`}
        >
            <div {...attributes} {...listeners} className='cursor-grab mr-3 text-gray-400 hover:text-gray-600'>
                <HiOutlineMenuAlt2 size={20} />
            </div>

            {hasChildren && (
                <button
                    onClick={() => onToggleExpand(category.id)}
                    className='mr-2 text-gray-500 hover:bg-gray-100 p-1 rounded-full'
                >
                    {category.isExpanded ? <HiOutlineChevronDown size={18} /> : <HiOutlineChevronRight size={18} />}
                </button>
            )}

            <div className='flex-1'>
                <div className='flex items-center'>
                    <span className='text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-600 mr-2'>
                        Cấp {level}
                    </span>
                    <h3 className='font-medium text-gray-800'>{category.name}</h3>
                </div>
                {category.description && <p className='text-sm text-gray-600 mt-1'>{category.description}</p>}
            </div>

            <div className='flex space-x-1'>
                {level < 3 && (
                    <button
                        onClick={() => onAddChild(category.id, level + 1)}
                        className='p-2 text-green-500 hover:bg-green-50 rounded-full transition-colors'
                        title={`Thêm danh mục cấp ${level + 1}`}
                    >
                        <HiOutlinePlus size={18} />
                    </button>
                )}
                <button
                    onClick={() => onEdit(category.id)}
                    className='p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors'
                    title='Chỉnh sửa'
                >
                    <HiOutlinePencil size={18} />
                </button>
                <button
                    onClick={() => onDelete(category.id)}
                    className='p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors'
                    title='Xóa'
                >
                    <HiOutlineTrash size={18} />
                </button>
            </div>
        </div>
    )
}

// Form chỉnh sửa danh mục
const CategoryForm = ({
    category,
    onSave,
    onCancel,
    parentCategories
}: {
    category: Category
    onSave: (category: Category) => void
    onCancel: () => void
    parentCategories?: Category[]
}) => {
    const [name, setName] = useState(category.name)
    const [description, setDescription] = useState(category.description || '')
    const [parentId, setParentId] = useState(category.parentId || '')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        let newLevel = category.level
        if (parentId) {
            const parent = parentCategories?.find(cat => cat.id === parentId)
            if (parent) {
                newLevel = (parent.level + 1) as 1 | 2 | 3
            }
        } else {
            newLevel = 1 as 1
        }

        onSave({
            ...category,
            name,
            description: description.trim() === '' ? undefined : description,
            parentId: parentId || undefined,
            level: newLevel
        })
    }

    // Lọc danh mục cha phù hợp với cấp hiện tại
    const eligibleParents = parentCategories?.filter(cat => {
        // Không thể chọn chính mình làm cha
        if (cat.id === category.id) return false

        // Chỉ có thể chọn danh mục ở cấp cao hơn làm cha
        return cat.level < category.level
    })

    return (
        <form
            onSubmit={handleSubmit}
            className={`bg-white rounded-lg shadow-md p-4 mb-3 border-l-4 ${
                category.level === 1
                    ? 'border-l-blue-500'
                    : category.level === 2
                    ? 'border-l-green-500'
                    : 'border-l-amber-500'
            } ml-${(category.level - 1) * 6}`}
        >
            <div className='mb-3'>
                <label htmlFor='name' className='block text-sm font-medium text-gray-700 mb-1'>
                    Tên danh mục
                </label>
                <input
                    type='text'
                    id='name'
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    required
                />
            </div>

            {category.level > 1 && parentCategories && (
                <div className='mb-3'>
                    <label htmlFor='parentId' className='block text-sm font-medium text-gray-700 mb-1'>
                        Danh mục cha
                    </label>
                    <select
                        id='parentId'
                        value={parentId}
                        onChange={e => setParentId(e.target.value)}
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                        required
                    >
                        <option value=''>Chọn danh mục cha</option>
                        {eligibleParents?.map(parent => (
                            <option key={parent.id} value={parent.id}>
                                {parent.name} (Cấp {parent.level})
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div className='mb-4'>
                <label htmlFor='description' className='block text-sm font-medium text-gray-700 mb-1'>
                    Mô tả (không bắt buộc)
                </label>
                <textarea
                    id='description'
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    rows={2}
                />
            </div>

            <div className='flex justify-end space-x-2'>
                <button
                    type='button'
                    onClick={onCancel}
                    className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500'
                >
                    <span className='flex items-center'>
                        <HiOutlineX size={16} className='mr-1' />
                        Hủy
                    </span>
                </button>
                <button
                    type='submit'
                    className='px-4 py-2 border border-transparent rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                    <span className='flex items-center'>
                        <HiOutlineSave size={16} className='mr-1' />
                        Lưu
                    </span>
                </button>
            </div>
        </form>
    )
}

// Hàm helper để tìm danh mục theo ID trong cấu trúc phân cấp
const findCategoryById = (categories: Category[], id: string): { category: Category | null; path: string[] } => {
    for (const category of categories) {
        if (category.id === id) {
            return { category, path: [category.id] }
        }

        if (category.children) {
            const result = findCategoryById(category.children, id)
            if (result.category) {
                return { category: result.category, path: [category.id, ...result.path] }
            }
        }
    }

    return { category: null, path: [] }
}

// Hàm helper để lấy danh sách phẳng của tất cả danh mục
const getAllCategories = (categories: Category[]): Category[] => {
    let result: Category[] = []

    for (const category of categories) {
        result.push(category)

        if (category.children) {
            result = [...result, ...getAllCategories(category.children)]
        }
    }

    return result
}

// Component chính quản lý danh mục
const CategoryManager = () => {
    const [categories, setCategories] = useState<Category[]>([
        {
            id: '1',
            name: 'Điện thoại & Máy tính bảng',
            description: 'Các thiết bị di động',
            order: 0,
            level: 1,
            isExpanded: true,
            children: [
                {
                    id: '1-1',
                    name: 'Điện thoại',
                    description: 'Điện thoại di động các loại',
                    order: 0,
                    parentId: '1',
                    level: 2,
                    isExpanded: true,
                    children: [
                        { id: '1-1-1', name: 'iPhone', order: 0, parentId: '1-1', level: 3 },
                        { id: '1-1-2', name: 'Samsung', order: 1, parentId: '1-1', level: 3 },
                        { id: '1-1-3', name: 'Xiaomi', order: 2, parentId: '1-1', level: 3 }
                    ]
                },
                {
                    id: '1-2',
                    name: 'Máy tính bảng',
                    description: 'iPad, Samsung Galaxy Tab, và các sản phẩm tương tự',
                    order: 1,
                    parentId: '1',
                    level: 2,
                    isExpanded: false,
                    children: [
                        { id: '1-2-1', name: 'iPad', order: 0, parentId: '1-2', level: 3 },
                        { id: '1-2-2', name: 'Samsung Galaxy Tab', order: 1, parentId: '1-2', level: 3 }
                    ]
                }
            ]
        },
        {
            id: '2',
            name: 'Máy tính & Laptop',
            description: 'Các thiết bị tính toán',
            order: 1,
            level: 1,
            isExpanded: false,
            children: [
                {
                    id: '2-1',
                    name: 'Laptop',
                    description: 'Máy tính xách tay các loại',
                    order: 0,
                    parentId: '2',
                    level: 2,
                    children: [
                        { id: '2-1-1', name: 'Gaming', order: 0, parentId: '2-1', level: 3 },
                        { id: '2-1-2', name: 'Văn phòng', order: 1, parentId: '2-1', level: 3 }
                    ]
                },
                {
                    id: '2-2',
                    name: 'Máy tính để bàn',
                    order: 1,
                    parentId: '2',
                    level: 2
                }
            ]
        },
        {
            id: '3',
            name: 'Phụ kiện',
            description: 'Các phụ kiện công nghệ',
            order: 2,
            level: 1,
            isExpanded: false,
            children: [
                {
                    id: '3-1',
                    name: 'Tai nghe',
                    order: 0,
                    parentId: '3',
                    level: 2,
                    children: [
                        { id: '3-1-1', name: 'Tai nghe có dây', order: 0, parentId: '3-1', level: 3 },
                        { id: '3-1-2', name: 'Tai nghe không dây', order: 1, parentId: '3-1', level: 3 }
                    ]
                },
                {
                    id: '3-2',
                    name: 'Sạc & Cáp',
                    order: 1,
                    parentId: '3',
                    level: 2,
                    children: [
                        { id: '3-2-1', name: 'Sạc dự phòng', order: 0, parentId: '3-2', level: 3 },
                        { id: '3-2-2', name: 'Cáp USB', order: 1, parentId: '3-2', level: 3 }
                    ]
                }
            ]
        }
    ])

    const [editingId, setEditingId] = useState<string | null>(null)
    const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null)
    const [activeCategory, setActiveCategory] = useState<Category | null>(null)

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8
            }
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    )

    // Lấy danh sách phẳng của tất cả danh mục
    const allCategories = getAllCategories(categories)

    // Bắt đầu kéo thả
    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event
        const { id } = active

        const result = findCategoryById(categories, id as string)
        if (result.category) {
            setActiveCategoryId(id as string)
            setActiveCategory(result.category)
        }
    }

    // Kết thúc kéo thả
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        setActiveCategoryId(null)
        setActiveCategory(null)

        if (over && active.id !== over.id) {
            const activeId = active.id as string
            const overId = over.id as string

            const activeResult = findCategoryById(categories, activeId)
            const overResult = findCategoryById(categories, overId)

            if (!activeResult.category || !overResult.category) return

            // Chỉ cho phép kéo thả trong cùng một cấp
            if (activeResult.category.level !== overResult.category.level) return

            // Nếu activeCategory có parentId, tìm parent
            if (activeResult.category.parentId) {
                // Tìm danh mục cha
                const parentResult = findCategoryById(categories, activeResult.category.parentId)
                if (parentResult.category && parentResult.category.children) {
                    // Sắp xếp lại các danh mục con
                    setCategories(prevCategories => {
                        const newCategories = [...prevCategories]
                        const updatedParentCategory: Category = { ...parentResult.category } as Category

                        if (updatedParentCategory.children) {
                            const oldIndex = updatedParentCategory.children.findIndex(cat => cat.id === activeId)
                            const newIndex = updatedParentCategory.children.findIndex(cat => cat.id === overId)

                            if (oldIndex !== -1 && newIndex !== -1) {
                                updatedParentCategory.children = arrayMove(
                                    updatedParentCategory.children,
                                    oldIndex,
                                    newIndex
                                )
                                // Cập nhật lại thứ tự
                                updatedParentCategory.children = updatedParentCategory.children.map((cat, index) => ({
                                    ...cat,
                                    order: index
                                }))
                            }
                        }

                        // Cập nhật lại cây danh mục
                        const updateCategoryInTree = (
                            categories: Category[],
                            parentId: string,
                            updatedCategory: Category
                        ): Category[] => {
                            return categories.map(category => {
                                if (category.id === parentId) {
                                    return { ...updatedCategory }
                                }
                                if (category.children) {
                                    return {
                                        ...category,
                                        children: updateCategoryInTree(category.children, parentId, updatedCategory)
                                    }
                                }
                                return category
                            })
                        }

                        if (parentResult.category && parentResult.category.id) {
                            return updateCategoryInTree(newCategories, parentResult.category.id, updatedParentCategory)
                        }
                        return newCategories
                    })
                }
            } else {
                // Trường hợp danh mục cấp cao nhất
                setCategories(prevCategories => {
                    const oldIndex = prevCategories.findIndex(cat => cat.id === activeId)
                    const newIndex = prevCategories.findIndex(cat => cat.id === overId)

                    if (oldIndex !== -1 && newIndex !== -1) {
                        const newCategories = arrayMove(prevCategories, oldIndex, newIndex)
                        // Cập nhật lại thứ tự
                        return newCategories.map((cat, index) => ({
                            ...cat,
                            order: index
                        }))
                    }

                    return prevCategories
                })
            }
        }
    }

    // Chỉnh sửa danh mục
    const handleEdit = (id: string) => {
        setEditingId(id)
    }

    // Xóa danh mục
    const handleDelete = (id: string) => {
        const result = findCategoryById(categories, id)
        if (!result.category) return

        let message = `Bạn có chắc chắn muốn xóa danh mục "${result.category.name}"?`

        // Nếu có danh mục con, hiển thị cảnh báo
        if (result.category.children && result.category.children.length > 0) {
            message += `\nCảnh báo: ${result.category.children.length} danh mục con cũng sẽ bị xóa.`
        }

        if (window.confirm(message)) {
            if (result.category.parentId) {
                // Xóa danh mục con
                setCategories(prevCategories => {
                    const deleteFromChildren = (
                        categories: Category[],
                        parentId: string,
                        deleteId: string
                    ): Category[] => {
                        return categories.map(category => {
                            if (category.id === parentId) {
                                return {
                                    ...category,
                                    children: category.children
                                        ? category.children.filter(child => child.id !== deleteId)
                                        : []
                                }
                            }
                            if (category.children) {
                                return {
                                    ...category,
                                    children: deleteFromChildren(category.children, parentId, deleteId)
                                }
                            }
                            return category
                        })
                    }

                    return deleteFromChildren(prevCategories, result.category!.parentId!, id)
                })
            } else {
                // Xóa danh mục cấp cao nhất
                setCategories(prevCategories => prevCategories.filter(cat => cat.id !== id))
            }
        }
    }

    // Lưu danh mục
    const handleSave = (updatedCategory: Category) => {
        if (updatedCategory.parentId) {
            // Cập nhật danh mục con
            setCategories(prevCategories => {
                const updateChildInTree = (
                    categories: Category[],
                    parentId: string,
                    updatedChild: Category
                ): Category[] => {
                    return categories.map(category => {
                        if (category.id === parentId) {
                            return {
                                ...category,
                                children: category.children
                                    ? category.children.map(child =>
                                          child.id === updatedChild.id ? updatedChild : child
                                      )
                                    : [updatedChild]
                            }
                        }
                        if (category.children) {
                            return {
                                ...category,
                                children: updateChildInTree(category.children, parentId, updatedChild)
                            }
                        }
                        return category
                    })
                }

                return updateChildInTree(prevCategories, updatedCategory.parentId ?? '', updatedCategory)
            })
        } else {
            // Cập nhật danh mục cấp cao nhất
            setCategories(prevCategories =>
                prevCategories.map(cat => (cat.id === updatedCategory.id ? updatedCategory : cat))
            )
        }

        setEditingId(null)
    }

    // Hủy chỉnh sửa
    const handleCancel = () => {
        setEditingId(null)
    }

    // Thêm danh mục mới
    const handleAddNew = (level: number = 1, parentId?: string) => {
        const newId = `new-${Date.now()}`
        const newCategory: Category = {
            id: newId,
            name: '',
            description: '',
            order: 0,
            level: level as 1 | 2 | 3,
            parentId
        }

        if (parentId) {
            // Thêm danh mục con
            setCategories(prevCategories => {
                const addChildToTree = (
                    categories: Category[],
                    targetParentId: string,
                    childToAdd: Category
                ): Category[] => {
                    return categories.map(category => {
                        if (category.id === targetParentId) {
                            const updatedChild = {
                                ...childToAdd,
                                order: category.children ? category.children.length : 0
                            }
                            return {
                                ...category,
                                children: category.children ? [...category.children, updatedChild] : [updatedChild],
                                isExpanded: true // Mở rộng danh mục cha khi thêm con
                            }
                        }
                        if (category.children) {
                            return {
                                ...category,
                                children: addChildToTree(category.children, targetParentId, childToAdd)
                            }
                        }
                        return category
                    })
                }

                return addChildToTree(prevCategories, parentId, newCategory)
            })
        } else {
            // Thêm danh mục cấp cao nhất
            newCategory.order = categories.length
            setCategories([...categories, newCategory])
        }

        setEditingId(newId)
    }

    // Thêm danh mục con
    const handleAddChild = (parentId: string, level: number) => {
        handleAddNew(level, parentId)
    }

    // Mở rộng/thu gọn danh mục
    const handleToggleExpand = (id: string) => {
        setCategories(prevCategories => {
            const toggleInTree = (categories: Category[], id: string): Category[] => {
                return categories.map(category => {
                    if (category.id === id) {
                        return {
                            ...category,
                            isExpanded: !category.isExpanded
                        }
                    }
                    if (category.children) {
                        return {
                            ...category,
                            children: toggleInTree(category.children, id)
                        }
                    }
                    return category
                })
            }

            return toggleInTree(prevCategories, id)
        })
    }

    // Render danh mục và các con của nó
    const renderCategoryTree = (category: Category, isRoot: boolean = false) => {
        const isEditing = editingId === category.id

        return (
            <div key={category.id} className={isRoot ? '' : 'ml-6'}>
                {isEditing ? (
                    <CategoryForm
                        category={category}
                        onSave={handleSave}
                        onCancel={handleCancel}
                        parentCategories={allCategories}
                    />
                ) : (
                    <SortableCategory
                        category={category}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onToggleExpand={handleToggleExpand}
                        onAddChild={handleAddChild}
                        level={category.level}
                        isDragging={activeCategoryId === category.id}
                    />
                )}

                {category.children && category.isExpanded && (
                    <div>{category.children.map(child => renderCategoryTree(child))}</div>
                )}
            </div>
        )
    }

    return (
        <div className='max-w-4xl mx-auto py-8 px-4'>
            <div className='flex justify-between items-center mb-6'>
                <div>
                    <h1 className='text-2xl font-bold text-gray-800'>Quản lý danh mục đa cấp</h1>
                    <p className='text-gray-600 mt-1'>Kéo và thả để sắp xếp danh mục, mở rộng để xem cấp con</p>
                </div>
                <button
                    onClick={() => handleAddNew()}
                    className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center'
                >
                    <HiOutlinePlus size={18} className='mr-1' />
                    Thêm danh mục
                </button>
            </div>

            <div className='bg-gray-50 p-6 rounded-xl border border-gray-200'>
                <div className='flex mb-4 gap-4'>
                    <div className='flex items-center px-3 py-2 bg-blue-100 rounded-lg'>
                        <div className='w-4 h-4 bg-blue-500 rounded-full mr-2'></div>
                        <span className='text-blue-700 font-medium'>Danh mục cấp 1</span>
                    </div>
                    <div className='flex items-center px-3 py-2 bg-green-100 rounded-lg'>
                        <div className='w-4 h-4 bg-green-500 rounded-full mr-2'></div>
                        <span className='text-green-700 font-medium'>Danh mục cấp 2</span>
                    </div>
                    <div className='flex items-center px-3 py-2 bg-amber-100 rounded-lg'>
                        <div className='w-4 h-4 bg-amber-500 rounded-full mr-2'></div>
                        <span className='text-amber-700 font-medium'>Danh mục cấp 3</span>
                    </div>
                </div>

                <div className='space-y-1 mb-4'>
                    <p className='text-sm text-gray-600'>
                        <span className='font-medium'>Hướng dẫn: </span>
                        Kéo <HiOutlineMenuAlt2 className='inline-block mx-1' /> để di chuyển danh mục, nhấn{' '}
                        <HiOutlineChevronRight className='inline-block mx-1' /> để mở rộng/thu gọn danh mục con.
                    </p>
                    <p className='text-sm text-gray-600'>
                        Nhấn <HiOutlinePlus className='inline-block mx-1 text-green-500' /> để thêm danh mục con,
                        <HiOutlinePencil className='inline-block mx-1 text-blue-500' /> để chỉnh sửa,
                        <HiOutlineTrash className='inline-block mx-1 text-red-500' /> để xóa.
                    </p>
                </div>

                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    modifiers={[restrictToVerticalAxis]}
                >
                    <div className='space-y-2'>
                        {categories.map(category => (
                            <SortableContext
                                key={category.id}
                                items={[category.id]}
                                strategy={verticalListSortingStrategy}
                            >
                                {renderCategoryTree(category, true)}
                            </SortableContext>
                        ))}
                    </div>

                    <DragOverlay>
                        {activeCategory ? (
                            <div className='opacity-80 bg-white border-2 border-blue-400 rounded-lg shadow-xl p-4'>
                                <div className='flex items-center'>
                                    <HiOutlineMenuAlt2 size={20} className='mr-3 text-gray-400' />
                                    <div className='flex-1'>
                                        <div className='flex items-center'>
                                            <span className='text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-600 mr-2'>
                                                Cấp {activeCategory.level}
                                            </span>
                                            <h3 className='font-medium text-gray-800'>{activeCategory.name}</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </DragOverlay>
                </DndContext>

                {categories.length === 0 && (
                    <div className='text-center py-16 text-gray-500'>
                        <div className='mb-4'>
                            <HiOutlinePlus size={48} className='mx-auto text-gray-400' />
                        </div>
                        <p className='text-lg font-medium'>Chưa có danh mục nào</p>
                        <p className='mt-2'>Hãy thêm danh mục mới để bắt đầu</p>
                        <button
                            onClick={() => handleAddNew()}
                            className='mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors inline-flex items-center'
                        >
                            <HiOutlinePlus size={18} className='mr-1' />
                            Thêm danh mục
                        </button>
                    </div>
                )}
            </div>

            {/* Phần hiển thị thống kê */}
            <div className='mt-8 grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div className='bg-white p-4 rounded-lg shadow border-l-4 border-blue-500'>
                    <h3 className='font-medium text-gray-700'>Tổng số danh mục</h3>
                    <p className='text-2xl font-bold mt-2'>{allCategories.length}</p>
                    <div className='mt-2 flex flex-wrap gap-2'>
                        <span className='px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full'>
                            Cấp 1: {allCategories.filter(c => c.level === 1).length}
                        </span>
                        <span className='px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full'>
                            Cấp 2: {allCategories.filter(c => c.level === 2).length}
                        </span>
                        <span className='px-2 py-1 text-xs bg-amber-100 text-amber-800 rounded-full'>
                            Cấp 3: {allCategories.filter(c => c.level === 3).length}
                        </span>
                    </div>
                </div>

                <div className='bg-white p-4 rounded-lg shadow border-l-4 border-green-500'>
                    <h3 className='font-medium text-gray-700'>Danh mục đã mở rộng</h3>
                    <p className='text-2xl font-bold mt-2'>
                        {allCategories.filter(c => c.isExpanded).length}/
                        {allCategories.filter(c => c.children && c.children.length > 0).length}
                    </p>
                    <div className='mt-2'>
                        <div className='w-full bg-gray-200 rounded-full h-2'>
                            <div
                                className='bg-green-500 h-2 rounded-full'
                                style={{
                                    width: `${
                                        allCategories.filter(c => c.children && c.children.length > 0).length === 0
                                            ? 0
                                            : (allCategories.filter(c => c.isExpanded).length /
                                                  allCategories.filter(c => c.children && c.children.length > 0)
                                                      .length) *
                                              100
                                    }%`
                                }}
                            ></div>
                        </div>
                    </div>
                </div>

                <div className='bg-white p-4 rounded-lg shadow border-l-4 border-purple-500'>
                    <h3 className='font-medium text-gray-700'>Danh mục đang chỉnh sửa</h3>
                    <p className='text-2xl font-bold mt-2'>{editingId ? 1 : 0}</p>
                    <p className='text-sm text-gray-600 mt-2'>
                        {editingId
                            ? `Đang chỉnh sửa: ${allCategories.find(c => c.id === editingId)?.name || 'Danh mục mới'}`
                            : 'Không có danh mục nào đang được chỉnh sửa'}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default CategoryManager
