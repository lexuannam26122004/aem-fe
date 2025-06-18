'use client'

import { useEffect, useState } from 'react'
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
import { ICategory, ICategoryCreate, ICategoryUpdate } from '@/models/Category'
import {
    useSearchCategoryQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
    useReorderCategoriesMutation,
    useChangeExpandedMutation
} from '@/services/CategoryService'
import Loading from '@/components/Loading'
import { useToast } from '@/hooks/useToast'
import AlertDialog from '@/components/AlertDialog'

const SortableCategory = ({
    category,
    onEdit,
    onSetSelectedDelete,
    onToggleExpand,
    onAddChild,
    level,
    isDragging
}: {
    category: ICategory
    onEdit: (id: number) => void
    onSetSelectedDelete: (category: ICategory) => void
    onToggleExpand: (id: number) => void
    onAddChild: (parentId: number, level: number) => void
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
                    <h3 className='font-medium text-gray-800'>{category.categoryName}</h3>
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
                    onClick={() => onSetSelectedDelete(category)}
                    className='p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors'
                    title='Xóa'
                >
                    <HiOutlineTrash size={18} />
                </button>
            </div>
        </div>
    )
}

const CategoryForm = ({
    category,
    onSave,
    onCancel,
    parentCategories,
    isLoading
}: {
    category: ICategory
    onSave: (category: ICategory) => void
    onCancel: () => void
    parentCategories?: ICategory[]
    isLoading?: boolean
}) => {
    const [name, setName] = useState(category.categoryName)
    const [description, setDescription] = useState(category.description || '')
    const [parentId, setParentId] = useState(category.parentId || undefined)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        let newLevel = category.level
        if (parentId) {
            const parent = parentCategories?.find(cat => cat.id === parentId)
            if (parent) {
                newLevel = (parent.level + 1) as 1 | 2 | 3
            }
        } else {
            newLevel = 1 as const
        }

        onSave({
            ...category,
            categoryName: name.trim(),
            description: description.trim() === '' ? undefined : description,
            parentId: parentId || undefined,
            level: newLevel
        })
    }

    const eligibleParents = parentCategories?.filter(cat => {
        if (cat.id === category.id) return false

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
                    disabled={isLoading}
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
                        onChange={e => setParentId(Number(e.target.value))}
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                        required
                        disabled={isLoading}
                    >
                        <option value=''>Chọn danh mục cha</option>
                        {eligibleParents?.map(parent => (
                            <option key={parent.id} value={parent.id}>
                                {parent.categoryName} (Cấp {parent.level})
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
                    disabled={isLoading}
                />
            </div>

            <div className='flex justify-end space-x-2'>
                <button
                    type='button'
                    onClick={onCancel}
                    className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500'
                    disabled={isLoading}
                >
                    <span className='flex items-center'>
                        <HiOutlineX size={16} className='mr-1' />
                        Hủy
                    </span>
                </button>
                <button
                    type='submit'
                    className='px-4 py-2 border border-transparent rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50'
                    disabled={isLoading}
                >
                    <span className='flex items-center'>
                        <HiOutlineSave size={16} className='mr-1' />
                        {isLoading ? 'Đang lưu...' : 'Lưu'}
                    </span>
                </button>
            </div>
        </form>
    )
}

const findCategoryById = (categories: ICategory[], id: number): { category: ICategory | null; path: number[] } => {
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
const getAllCategories = (categories: ICategory[]): ICategory[] => {
    let result: ICategory[] = []

    for (const category of categories) {
        result.push(category)

        if (category.children) {
            result = [...result, ...getAllCategories(category.children)]
        }
    }

    return result
}

// Hàm helper để build cây danh mục từ flat list
const buildCategoryTree = (categories: ICategory[]): ICategory[] => {
    const categoryMap = new Map<number, ICategory>()
    const rootCategories: ICategory[] = []

    // Tạo map và khởi tạo children array
    categories.forEach(category => {
        categoryMap.set(category.id, { ...category, children: [], isExpanded: category.isExpanded || false })
    })

    // Xây dựng cây
    categories.forEach(category => {
        const categoryWithChildren = categoryMap.get(category.id)!

        if (category.parentId && categoryMap.has(category.parentId)) {
            const parent = categoryMap.get(category.parentId)!
            parent.children!.push(categoryWithChildren)
        } else {
            rootCategories.push(categoryWithChildren)
        }
    })

    // Sắp xếp theo order
    const sortByOrder = (cats: ICategory[]) => {
        cats.sort((a, b) => (a.order || 0) - (b.order || 0))
        cats.forEach(cat => {
            if (cat.children && cat.children.length > 0) {
                sortByOrder(cat.children)
            }
        })
    }

    sortByOrder(rootCategories)
    return rootCategories
}

// Component chính quản lý danh mục
const CategoryManager = () => {
    const [editingId, setEditingId] = useState<number | null>(null)
    const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null)
    const [activeCategory, setActiveCategory] = useState<ICategory | null>(null)
    const [categories, setCategories] = useState<ICategory[]>([])
    const [isAddingNew, setIsAddingNew] = useState(false)
    const toast = useToast()
    const [selectedDelete, setSelectedDelete] = useState<ICategory | null>(null)

    // API hooks
    const {
        data: categoriesResponse,
        isLoading: isLoadingCategories,
        refetch
    } = useSearchCategoryQuery({
        pageSize: 1000,
        pageNumber: 1,
        isActive: true
    })

    const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation()
    const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation()
    const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation()
    const [reorderCategories] = useReorderCategoriesMutation()
    const [changeExpanded] = useChangeExpandedMutation()

    const categoriesData = (categoriesResponse?.data?.records as ICategory[]) || []

    useEffect(() => {
        const newTree = buildCategoryTree(categoriesData)

        if (JSON.stringify(categories) !== JSON.stringify(newTree)) {
            setCategories(newTree)
        }
    }, [categoriesData])

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

        const result = findCategoryById(categories, Number(id))
        if (result.category) {
            setActiveCategoryId(Number(id))
            setActiveCategory(result.category)
        }
    }

    // Kết thúc kéo thả
    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event
        setActiveCategoryId(null)
        setActiveCategory(null)

        if (over && active.id !== over.id) {
            const activeId = active.id as number
            const overId = over.id as number

            const activeResult = findCategoryById(categories, activeId)
            const overResult = findCategoryById(categories, overId)

            if (!activeResult.category || !overResult.category) return

            // Chỉ cho phép kéo thả trong cùng một cấp và cùng parent
            if (
                activeResult.category.level !== overResult.category.level ||
                activeResult.category.parentId !== overResult.category.parentId
            )
                return

            try {
                // Lấy danh sách categories cùng level và parent
                let siblingCategories: ICategory[] = []

                if (activeResult.category.parentId) {
                    const parentResult = findCategoryById(categories, activeResult.category.parentId)
                    if (parentResult.category && parentResult.category.children) {
                        siblingCategories = parentResult.category.children
                    }
                } else {
                    siblingCategories = categories
                }

                const oldIndex = siblingCategories.findIndex(cat => cat.id === activeId)
                const newIndex = siblingCategories.findIndex(cat => cat.id === overId)

                if (oldIndex !== -1 && newIndex !== -1) {
                    const reorderedIds = arrayMove(siblingCategories, oldIndex, newIndex).map(cat => cat.id)

                    // Gọi API reorder
                    await reorderCategories({
                        parentId: activeResult.category.parentId,
                        categoryIds: reorderedIds
                    }).unwrap()

                    // Refresh data
                    refetch()
                }
            } catch (error) {
                console.error('Error reordering categories:', error)
                alert('Có lỗi xảy ra khi sắp xếp danh mục')
            }
        }
    }

    // Chỉnh sửa danh mục
    const handleEdit = (id: number) => {
        setEditingId(id)
    }

    // Xóa danh mục
    const handleDelete = async (id: number) => {
        const result = findCategoryById(categories, id)
        if (!result.category) return

        try {
            await deleteCategory(id).unwrap()
            toast('Xóa danh mục thành công', 'success')
            refetch()
        } catch {
            toast('Có lỗi xảy ra khi xóa danh mục', 'error')
        } finally {
            setSelectedDelete(null)
        }
    }

    // Lưu danh mục
    const handleSave = async (updatedCategory: ICategory) => {
        try {
            if (updatedCategory.id) {
                // Update existing category
                const updateData: ICategoryUpdate = {
                    id: updatedCategory.id,
                    isExpanded: updatedCategory.isExpanded || false,
                    categoryName: updatedCategory.categoryName,
                    description: updatedCategory.description,
                    parentId: updatedCategory.parentId,
                    level: updatedCategory.level,
                    order: updatedCategory.order
                }
                await updateCategory({ id: updatedCategory.id, body: updateData }).unwrap()
            } else {
                // Create new category
                const createData: ICategoryCreate = {
                    categoryName: updatedCategory.categoryName,
                    description: updatedCategory.description,
                    parentId: updatedCategory.parentId,
                    level: updatedCategory.level,
                    order: updatedCategory.order || 0
                }
                await createCategory(createData).unwrap()
                setIsAddingNew(false)
            }

            setEditingId(null)
            refetch()
        } catch {
            toast('Có lỗi xảy ra khi lưu danh mục', 'error')
        }
    }

    // Hủy chỉnh sửa
    const handleCancel = () => {
        setEditingId(null)
        setIsAddingNew(false)
    }

    // Thêm danh mục mới
    const handleAddNew = (level: number = 1, parentId?: number) => {
        const newCategory: ICategory = {
            id: 0, // Temporary ID for new category
            categoryName: '',
            description: '',
            order: 0,
            level: level as 1 | 2 | 3,
            parentId,
            children: []
        }
        setIsAddingNew(true)
        setEditingId(0)

        if (parentId) {
            setCategories(prevCategories => {
                const addTempCategory = (categories: ICategory[]): ICategory[] => {
                    return categories.map(category => {
                        if (category.id === parentId) {
                            return {
                                ...category,
                                children: category.children ? [...category.children, newCategory] : [newCategory],
                                isExpanded: true
                            }
                        }
                        if (category.children) {
                            return {
                                ...category,
                                children: addTempCategory(category.children)
                            }
                        }
                        return category
                    })
                }
                return addTempCategory(prevCategories)
            })
        } else {
            setCategories(prev => [...prev, newCategory])
        }
    }

    // Thêm danh mục con
    const handleAddChild = (parentId: number, level: number) => {
        handleAddNew(level, parentId)
    }

    // Mở rộng/thu gọn danh mục
    const handleToggleExpand = (id: number) => {
        changeExpanded(id)
        setCategories(prevCategories => {
            const toggleInTree = (categories: ICategory[], id: number): ICategory[] => {
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

    const renderCategoryTree = (category: ICategory, isRoot: boolean = false) => {
        const isEditing = editingId === category.id
        const isNewCategory = category.id === 0

        return (
            <div key={category.id || 'new'} className={isRoot ? '' : 'ml-6'}>
                {isEditing ? (
                    <CategoryForm
                        category={category}
                        onSave={handleSave}
                        onCancel={() => {
                            handleCancel()
                            if (isNewCategory) {
                                // Remove temp category from state
                                setCategories(prev => {
                                    const removeTempCategory = (categories: ICategory[]): ICategory[] => {
                                        return categories
                                            .filter(cat => cat.id !== 0)
                                            .map(cat => ({
                                                ...cat,
                                                children: cat.children ? removeTempCategory(cat.children) : []
                                            }))
                                    }
                                    return removeTempCategory(prev)
                                })
                            }
                        }}
                        parentCategories={allCategories}
                        isLoading={isCreating || isUpdating}
                    />
                ) : (
                    <SortableCategory
                        category={category}
                        onEdit={handleEdit}
                        onSetSelectedDelete={setSelectedDelete}
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

    if (isLoadingCategories) {
        return <Loading />
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
                    className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center disabled:opacity-50'
                    disabled={isCreating || isAddingNew}
                >
                    <HiOutlinePlus size={18} className='mr-1' />
                    {isCreating ? 'Đang thêm...' : 'Thêm danh mục'}
                </button>
            </div>

            {/* Phần hiển thị thống kê */}
            <div className='mt-6 grid grid-cols-1 md:grid-cols-3 gap-4'>
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
                            ? `Đang chỉnh sửa: ${
                                  allCategories.find(c => c.id === editingId)?.categoryName || 'Danh mục mới'
                              }`
                            : 'Không có danh mục nào đang được chỉnh sửa'}
                    </p>
                </div>
            </div>

            <div className='bg-gray-50 mt-6 p-6 rounded-xl border border-gray-200'>
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
                                            <h3 className='font-medium text-gray-800'>{activeCategory.categoryName}</h3>
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

            {selectedDelete && (
                <AlertDialog
                    isLoading={isDeleting}
                    buttonConfirm='Xóa'
                    buttonCancel='Hủy'
                    open={!!selectedDelete}
                    setOpen={() => setSelectedDelete(null)}
                    title='Bạn có chắc chắn muốn xóa danh mục này?'
                    content={`Cảnh báo: Danh mục con của ${selectedDelete.categoryName} cũng sẽ bị xóa.`}
                    type='warning'
                    onConfirm={() => {
                        handleDelete(selectedDelete.id)
                    }}
                />
            )}
        </div>
    )
}

export default CategoryManager
