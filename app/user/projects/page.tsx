'use client'

import React, { useCallback, useEffect, useState } from 'react'
import {
    Briefcase,
    Search,
    Plus,
    Filter,
    Trash2,
    ClipboardList,
    Calendar,
    ArrowRight,
    CheckCircle,
    X,
    Loader2,
    Loader,
    Hourglass,
    RotateCcw,
    LucideActivitySquare
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import EmptyItem from '@/components/EmptyItem'
import { formatCurrency, formatDate } from '@/common/format'
import {
    useCreateProjectMutation,
    useDeleteProjectMutation,
    useSearchProjectQuery
} from '@/services/UserProjectService'
import { IProjectCreate, IProjectGetAll, IUserProjectFilter } from '@/models/Project'
import Loading from '@/components/Loading'
import { useToast } from '@/hooks/useToast'
import EnhancedPagination from '@/components/EnhancedPagination'
import { debounce } from 'lodash'
import UserAlertDialog from '@/components/UserAlertDialog'

const ProjectsPage = () => {
    const { t } = useTranslation('common')
    const router = useRouter()
    const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false)
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [selectedProjectId, setSelectedProjectId] = useState(null)
    const [filter, setFilter] = useState<IUserProjectFilter>({
        pageSize: 10,
        pageNumber: 1,
        status: undefined,
        projectName: ''
    })

    const [createProject, { isLoading: isCreatingProjectLoading }] = useCreateProjectMutation()
    const [deleteProject, { isLoading: isDeletingProjectLoading }] = useDeleteProjectMutation()
    const {
        data: projectResponse,
        isLoading: isProjectLoading,
        refetch,
        isFetching
    } = useSearchProjectQuery(filter, {
        refetchOnMountOrArgChange: true
    })
    const projects = (projectResponse?.data?.records as IProjectGetAll[]) || []
    const totalRecords = projectResponse?.data?.totalRecords || 0
    const toast = useToast()

    // New project form state
    const [newProject, setNewProject] = useState<IProjectCreate>({
        projectName: '',
        projectCode: '',
        description: '',
        doneDate: '',
        estimatedBudget: 0
    })

    const debouncedSetFilter = useCallback(
        debounce(value => {
            setFilter({
                ...filter,
                pageNumber: 1,
                projectName: value
            })
        }, 100),
        []
    )

    const handleSearchKeyword = (value: string) => {
        debouncedSetFilter(value)
    }

    useEffect(() => {
        refetch()
    }, [filter])

    const handleAddProject = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        // setIsAddSubmit(true)

        if (!newProject.projectName || !newProject.projectCode || !newProject.estimatedBudget || !newProject.doneDate) {
            return
        }

        createProject(newProject)
            .unwrap()
            .then(() => {
                setNewProject({
                    projectName: '',
                    projectCode: '',
                    description: '',
                    doneDate: '',
                    estimatedBudget: 0
                })
                toast('Tạo dự án thành công', 'success')
                // setIsAddSubmit(false)
                setIsAddProjectModalOpen(false)
            })
            .catch(() => {
                toast('Tạo dự án thất bại', 'error')
                // setIsAddSubmit(false)
            })
    }

    const handleDeleteProject = () => {
        deleteProject(selectedProjectId)
            .unwrap()
            .then(() => {
                toast('Xoá dự án thành công', 'success')
            })
            .catch(() => {
                toast('Xoá dự án thất bại', 'error')
            })
            .finally(() => {
                setIsDeleteModalOpen(false)
            })
    }

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'planning':
                return 'bg-indigo-100 text-indigo-800 border-indigo-300'
            case 'pending':
                return 'bg-amber-100 text-amber-700 border-amber-300'
            case 'active':
                return 'bg-sky-100 text-sky-800 border-sky-300'
            case 'completed':
                return 'bg-emerald-100 text-emerald-800 border-emerald-300'
            case 'returned':
                return 'bg-rose-100 text-rose-800 border-rose-300'
            default:
                return 'bg-red-100 text-red-600 border border-red-300'
        }
    }

    const getStatusIcon = (status: string) => {
        const baseClass = 'w-3.5 h-3.5 mr-1.5 mt-0.5'
        switch (status) {
            case 'planning':
                return <Hourglass className={baseClass} /> // mới mẻ hơn Clock
            case 'pending':
                return <Loader className={baseClass} />
            case 'active':
                return <LucideActivitySquare className={baseClass} />
            case 'completed':
                return <CheckCircle className={baseClass} />
            default:
                return <RotateCcw className={baseClass} />
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case 'planning':
                return 'Lập kế hoạch'
            case 'pending':
                return t('COMMON.USER.PENDING_QUOTE')
            case 'active':
                return t('COMMON.USER.QUOTED')
            case 'completed':
                return t('COMMON.USER.COMPLETED')
            default:
                return t('COMMON.USER.CANCELLED')
        }
    }

    if (isProjectLoading) {
        return <Loading />
    }

    return (
        <div className='min-h-screen bg-[var(--background-color-element)]'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='mb-6'>
                    <h1 className='text-2xl font-bold text-gray-900'>{t('COMMON.USER.MY_PROJECTS')}</h1>
                    <p className='text-gray-600 mt-1'>{t('COMMON.USER.PROJECTS_MANAGEMENT_DESCRIPTION')}</p>
                </div>

                {/* Actions Bar */}
                <div className='flex flex-col sm:flex-row space-y-4 sm:space-y-0 items-start sm:items-center justify-between mb-6'>
                    <div className='relative w-full sm:w-auto sm:max-w-xs'>
                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                            <Search className='h-5 w-5 text-gray-400' />
                        </div>
                        <input
                            type='text'
                            onChange={e => handleSearchKeyword(e.target.value.trim())}
                            className='pl-10 w-full sm:w-[400px] border border-gray-300 rounded-lg py-3 outline-none focus:ring-blue-500 focus:border-blue-500'
                            placeholder={t('COMMON.USER.SEARCH_PROJECT_PLACEHOLDER')}
                        />
                    </div>

                    <div className='flex space-x-6 w-full sm:w-auto justify-end'>
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className='px-6 py-3 bg-white border border-[#3675ff] font-medium text-[#3675ff] rounded-lg hover:bg-blue-50 transition-colors flex items-center'
                        >
                            <Filter className='h-5 w-5 mr-2' />
                            {t('COMMON.USER.FILTER')}
                        </button>
                        <button
                            onClick={() => setIsAddProjectModalOpen(true)}
                            className='px-6 font-medium py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition-colors'
                        >
                            <Plus className='h-5 w-5 mr-2' />
                            {t('COMMON.USER.CREATE_NEW_PROJECT')}
                        </button>
                    </div>
                </div>

                {/* Filter Options */}
                {isFilterOpen && (
                    <div className='bg-white mb-6 p-5 rounded-xl shadow-sm border border-gray-100'>
                        <div className='flex flex-wrap gap-5'>
                            <button
                                onClick={() => setFilter({ status: undefined, pageSize: 9, pageNumber: 1 })}
                                className={`px-5 py-2.5 text-base font-medium rounded-lg whitespace-nowrap ${
                                    filter.status === undefined
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {t('COMMON.USER.ALL')}
                            </button>
                            <button
                                onClick={() => setFilter({ status: 'planning', pageSize: 9, pageNumber: 1 })}
                                className={`px-5 py-2.5 text-base font-medium rounded-lg whitespace-nowrap ${
                                    filter.status === 'planning'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                Lập kế hoạch
                            </button>
                            <button
                                onClick={() => setFilter({ status: 'pending', pageSize: 9, pageNumber: 1 })}
                                className={`px-5 py-2.5 text-base font-medium rounded-lg whitespace-nowrap ${
                                    filter.status === 'pending'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {t('COMMON.USER.PENDING_QUOTE')}
                            </button>
                            <button
                                onClick={() => setFilter({ status: 'active', pageSize: 9, pageNumber: 1 })}
                                className={`px-5 py-2.5 text-base font-medium rounded-lg whitespace-nowrap ${
                                    filter.status === 'active'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {t('COMMON.USER.QUOTED')}
                            </button>
                            <button
                                onClick={() => setFilter({ status: 'completed', pageSize: 9, pageNumber: 1 })}
                                className={`px-5 py-2.5 text-base font-medium rounded-lg whitespace-nowrap ${
                                    filter.status === 'completed'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {t('COMMON.USER.COMPLETED')}
                            </button>
                            <button
                                onClick={() => setFilter({ status: 'cancelled', pageSize: 9, pageNumber: 1 })}
                                className={`px-5 py-2.5 text-base font-medium rounded-lg whitespace-nowrap ${
                                    filter.status === 'cancelled'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {t('COMMON.USER.CANCELLED')}
                            </button>
                        </div>
                    </div>
                )}

                {/* Projects Grid */}
                {projects.length > 0 ? (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {projects.map(project => (
                            <div
                                key={project.id}
                                className='bg-white flex flex-col rounded-[15px] shadow-[0_4px_16px_rgba(0,0,0,0.1)] overflow-hidden'
                            >
                                <div className='relative'>
                                    <img
                                        src={project.thumbnail}
                                        alt={project.projectName}
                                        className='w-full h-48 object-cover'
                                    />
                                    <div className='absolute top-3 right-3'>
                                        <div className='relative'>
                                            <button
                                                className='p-2 bg-red-50 rounded-full text-red-600 hover:bg-red-100 transition-colors'
                                                onClick={() => {
                                                    setIsDeleteModalOpen(true)
                                                    setSelectedProjectId(project.id)
                                                }}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className='absolute bottom-3 left-3'>
                                        <div
                                            className={`${getStatusStyles(
                                                project.status
                                            )} border px-3.5 py-2 rounded-full flex items-center text-xs font-medium`}
                                        >
                                            {getStatusIcon(project.status)}
                                            {getStatusText(project.status)}
                                        </div>
                                    </div>
                                </div>

                                <div className='p-6 flex-1 flex flex-col justify-between'>
                                    <div className='mb-4'>
                                        <h3 className='text-lg font-bold text-gray-900 mb-3 line-clamp-2'>
                                            {project.projectName}
                                        </h3>
                                        <p className='text-md text-gray-500 mb-3'>
                                            {t('COMMON.USER.ENTER_PROJECT_CODE')}:
                                            <span className='text-black font-medium ml-1'>{project.projectCode}</span>
                                        </p>
                                        <p className='text-sm text-gray-500 line-clamp-2'>{project.description}</p>
                                    </div>

                                    <div>
                                        <div className='flex items-center justify-between mb-3'>
                                            <div className='flex items-center text-md text-gray-500 lowercase'>
                                                <ClipboardList className='h-4 w-4 mr-1.5' />
                                                <span className='mr-1'>{project.totalProducts}</span>
                                                {t('COMMON.USER.PRODUCT')}
                                            </div>
                                            <div className='flex items-center text-md text-gray-500'>
                                                <Calendar className='h-4 w-4 mr-1.5' />
                                                <span>{formatDate(project.doneDate)}</span>
                                            </div>
                                        </div>

                                        <div className='flex items-center justify-between'>
                                            <div className='text-md font-medium text-gray-900'>
                                                {t('COMMON.USER.BUDGET')}:{' '}
                                                <span className='text-blue-600'>
                                                    {formatCurrency(project.estimatedBudget)}
                                                </span>
                                            </div>
                                            <button
                                                className='text-blue-600 hover:text-blue-800 text-md font-medium flex items-center group transition-colors duration-200'
                                                onClick={() => router.push(`/user/projects/${project.id}`)}
                                            >
                                                <p className='group-hover:underline transition-all duration-200'>
                                                    {t('COMMON.USER.DETAILS')}
                                                </p>
                                                <ArrowRight className='w-4 h-4 ml-1 transform transition-transform duration-200 group-hover:translate-x-1' />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {projects.length > 0 && (
                            <div className='mt-8'>
                                <EnhancedPagination
                                    totalItems={totalRecords}
                                    itemsPerPage={9}
                                    currentPage={filter.pageNumber}
                                    onPageChange={(pageNumber: number) =>
                                        setFilter({ ...filter, pageNumber: pageNumber })
                                    }
                                    siblingCount={1}
                                    showFirstLast={true}
                                />
                            </div>
                        )}
                    </div>
                ) : (
                    <EmptyItem
                        icon={<Briefcase className='w-10 h-10 text-blue-600' />}
                        title={t('COMMON.USER.NO_PROJECTS_TITLE')}
                        description={t('COMMON.USER.NO_PROJECTS_DESCRIPTION')}
                        buttonText={t('COMMON.USER.NEW_PROJECT')}
                        onClick={() => setIsAddProjectModalOpen(true)}
                    />
                )}
            </div>

            {/* Add Project Modal */}
            {isAddProjectModalOpen && (
                <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
                    <div
                        className='bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto'
                        onClick={e => e.stopPropagation()}
                    >
                        <div className='p-6 border-b border-gray-100'>
                            <div className='flex items-center justify-between'>
                                <h2 className='text-xl font-bold text-gray-900'>
                                    {t('COMMON.USER.CREATE_NEW_PROJECT')}
                                </h2>
                                <button
                                    className='text-gray-400 hover:text-gray-500'
                                    onClick={() => setIsAddProjectModalOpen(false)}
                                >
                                    <X className='w-5 h-5' />
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleAddProject} className='p-6'>
                            <div className='space-y-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                        {t('COMMON.USER.PROJECT_NAME_REQUIRED')}
                                    </label>
                                    <input
                                        type='text'
                                        value={newProject.projectName}
                                        onChange={e => setNewProject({ ...newProject, projectName: e.target.value })}
                                        className='w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-blue-500 focus:border-blue-500 outline-none'
                                        placeholder={t('COMMON.USER.ENTER_PROJECT_NAME')}
                                        required
                                    />
                                </div>

                                <div className='flex items-center justify-between space-x-6'>
                                    <div className='w-[50%]'>
                                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                                            Mã dự án*
                                        </label>
                                        <input
                                            type='text'
                                            value={newProject.projectCode}
                                            onChange={e =>
                                                setNewProject({ ...newProject, projectCode: e.target.value })
                                            }
                                            className='w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-blue-500 focus:border-blue-500 outline-none'
                                            placeholder='VD: PRJ-2025-001'
                                            required
                                        />
                                    </div>

                                    <div className='w-[50%]'>
                                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                                            {t('COMMON.USER.ESTIMATED_BUDGET')}
                                        </label>

                                        <div className='flex items-center overflow-hidden'>
                                            <input
                                                type='text'
                                                value={newProject.estimatedBudget}
                                                onChange={e =>
                                                    setNewProject({
                                                        ...newProject,
                                                        estimatedBudget: parseInt(e.target.value)
                                                    })
                                                }
                                                className='mr-2 w-[80%] border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-blue-500 focus:border-blue-500 outline-none'
                                                placeholder='VD: 100.000.000'
                                            />
                                            <span className='text-gray-500'>VND</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                        {t('COMMON.USER.PROJECT_DESCRIPTION')}
                                    </label>
                                    <textarea
                                        value={newProject.description}
                                        onChange={e => setNewProject({ ...newProject, description: e.target.value })}
                                        rows={3}
                                        className='w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-blue-500 focus:border-blue-500 outline-none'
                                        placeholder={t('COMMON.USER.ENTER_PROJECT_DESCRIPTION')}
                                    />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                        {t('COMMON.USER.PROJECT_COMPLETION_DATE')}
                                    </label>
                                    <div className='relative'>
                                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                            <Calendar className='h-5 w-5 text-gray-400' />
                                        </div>
                                        <input
                                            type='date'
                                            value={newProject.doneDate}
                                            onChange={e => setNewProject({ ...newProject, doneDate: e.target.value })}
                                            className='pl-10 w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-blue-500 focus:border-blue-500 outline-none'
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className='mt-6 flex space-x-6'>
                                <button
                                    type='button'
                                    className='flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors font-medium'
                                    onClick={() => setIsAddProjectModalOpen(false)}
                                >
                                    {t('COMMON.USER.CANCEL')}
                                </button>
                                <button
                                    disabled={isFetching || isCreatingProjectLoading}
                                    type='submit'
                                    className='flex-1 flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors'
                                >
                                    {(isFetching || isCreatingProjectLoading) && (
                                        <Loader2 className='animate-spin mr-2 w-4 h-4' />
                                    )}
                                    {t('COMMON.USER.CREATE_PROJECT')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isDeleteModalOpen && (
                <UserAlertDialog
                    open={isDeleteModalOpen}
                    setOpen={setIsDeleteModalOpen}
                    type='error'
                    title='Xác nhận xoá dự án?'
                    alertText='Bạn có chắc chắn muốn xoá dự án này? Hành động này không thể hoàn tác.'
                    isLoading={isDeletingProjectLoading}
                    onConfirm={handleDeleteProject}
                />
            )}
        </div>
    )
}

export default ProjectsPage
