'use client'

import React, { useState } from 'react'
import {
    Briefcase,
    Search,
    Plus,
    MoreHorizontal,
    Filter,
    Trash2,
    ClipboardList,
    Calendar,
    Clock,
    FileText,
    ArrowRight,
    CheckCircle,
    X
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import EmptyItem from '@/components/EmptyItem'
import { formatCurrency } from '@/common/format'

const ProjectsPage = () => {
    const { t } = useTranslation('common')
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState('')
    const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false)
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [selectedProjectId] = useState(null)
    const [filter, setFilter] = useState('all') // all, active, completed, pending

    // Sample project data
    const [projects, setProjects] = useState([
        {
            id: 1,
            name: 'Sự kiện kỷ niệm 10 năm thành lập',
            code: 'PRJ-2025-042',
            description:
                'Dự án cung cấp các sản phẩm quà tặng và đồng phục cho sự kiện kỷ niệm 10 năm thành lập công ty',
            status: 'pending',
            statusText: 'Đang chờ báo giá',
            products: 3,
            date: '2025-07-15',
            createdAt: '2025-05-10',
            updatedAt: '2025-05-12',
            budget: 120000000,
            thumbnail: 'https://api-prod-minimal-v700.pages.dev/assets/images/cover/cover-1.webp'
        },
        {
            id: 2,
            name: 'Chương trình tri ân khách hàng Q2/2025',
            code: 'PRJ-2025-038',
            description:
                'Dự án sản xuất các sản phẩm quà tặng cao cấp cho chương trình tri ân khách hàng quý 2 năm 2025',
            status: 'active',
            statusText: 'Đã báo giá',
            products: 5,
            date: '2025-06-01',
            createdAt: '2025-04-20',
            updatedAt: '2025-05-02',
            budget: 200000000,
            thumbnail: 'https://api-prod-minimal-v700.pages.dev/assets/images/cover/cover-2.webp'
        },
        {
            id: 3,
            name: 'Bộ đồng phục nhân viên 2025',
            code: 'PRJ-2025-029',
            description: 'Dự án thiết kế và sản xuất bộ đồng phục mới cho nhân viên công ty năm 2025',
            status: 'completed',
            statusText: 'Đã hoàn thành',
            products: 4,
            date: '2025-04-30',
            createdAt: '2025-03-15',
            updatedAt: '2025-04-30',
            budget: 80000000,
            thumbnail: 'https://api-prod-minimal-v700.pages.dev/assets/images/cover/cover-3.webp'
        }
    ])

    // New project form state
    const [newProject, setNewProject] = useState({
        name: '',
        description: '',
        date: '',
        budget: 0
    })

    // Filter projects based on search term and filter
    const filteredProjects = projects.filter(project => {
        const matchesSearch =
            project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.code.toLowerCase().includes(searchTerm.toLowerCase())

        if (filter === 'all') return matchesSearch
        return matchesSearch && project.status === filter
    })

    const handleAddProject = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!newProject.name) return

        const newProjectData = {
            id: projects.length + 1,
            name: newProject.name,
            code: `PRJ-2025-${Math.floor(Math.random() * 100)}`,
            description: newProject.description,
            status: 'pending',
            statusText: 'Đang chờ báo giá',
            products: 0,
            date: newProject.date || '2025-12-31',
            createdAt: new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString().split('T')[0],
            budget: newProject.budget || 0,
            thumbnail: `https://api-prod-minimal-v700.pages.dev/assets/images/cover/cover-${
                Math.floor(Math.random() * 20) + 1
            }.webp`
        }

        setProjects([newProjectData, ...projects])
        setNewProject({
            name: '',
            description: '',
            date: '',
            budget: 0
        })
        setIsAddProjectModalOpen(false)
    }

    const handleDeleteProject = () => {
        setProjects(projects.filter(project => project.id !== selectedProjectId))
        setIsDeleteModalOpen(false)
    }

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-50 text-yellow-700 border-yellow-200'
            case 'active':
                return 'bg-blue-50 text-blue-700 border-blue-200'
            case 'completed':
                return 'bg-green-50 text-green-700 border-green-200'
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200'
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return <Clock className='w-3.5 h-3.5 mr-1.5 mt-0.5' />
            case 'active':
                return <FileText className='w-3.5 h-3.5 mr-1.5 mt-0.5' />
            case 'completed':
                return <CheckCircle className='w-3.5 h-3.5 mr-1.5 mt-0.5' />
            default:
                return null
        }
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
                            className='pl-10 w-full sm:w-[400px] border border-gray-300 rounded-lg py-3 outline-none focus:ring-blue-500 focus:border-blue-500'
                            placeholder={t('COMMON.USER.SEARCH_PROJECT_PLACEHOLDER')}
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
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
                                onClick={() => setFilter('all')}
                                className={`px-5 py-2.5 text-base font-medium rounded-lg whitespace-nowrap ${
                                    filter === 'all'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {t('COMMON.USER.ALL')}
                            </button>
                            <button
                                onClick={() => setFilter('pending')}
                                className={`px-5 py-2.5 text-base font-medium rounded-lg whitespace-nowrap ${
                                    filter === 'pending'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {t('COMMON.USER.PENDING_QUOTE')}
                            </button>
                            <button
                                onClick={() => setFilter('active')}
                                className={`px-5 py-2.5 text-base font-medium rounded-lg whitespace-nowrap ${
                                    filter === 'active'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {t('COMMON.USER.QUOTED')}
                            </button>
                            <button
                                onClick={() => setFilter('completed')}
                                className={`px-5 py-2.5 text-base font-medium rounded-lg whitespace-nowrap ${
                                    filter === 'completed'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {t('COMMON.USER.COMPLETED')}
                            </button>
                            <button
                                onClick={() => setFilter('cancelled')}
                                className={`px-5 py-2.5 text-base font-medium rounded-lg whitespace-nowrap ${
                                    filter === 'cancelled'
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
                {filteredProjects.length > 0 ? (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {filteredProjects.map(project => (
                            <div
                                key={project.id}
                                className='bg-white flex flex-col rounded-[15px] shadow-[0_4px_16px_rgba(0,0,0,0.1)] overflow-hidden'
                            >
                                <div className='relative'>
                                    <img
                                        src={project.thumbnail}
                                        alt={project.name}
                                        className='w-full h-48 object-cover'
                                    />
                                    <div className='absolute top-3 right-3'>
                                        <div className='relative'>
                                            <button
                                                className='bg-white/80 backdrop-blur rounded-full p-2 hover:bg-white transition-colors'
                                                onClick={() => {}}
                                            >
                                                <MoreHorizontal className='h-5 w-5 text-gray-700' />
                                            </button>
                                            {/* Dropdown menu could go here */}
                                        </div>
                                    </div>
                                    <div className='absolute bottom-3 left-3'>
                                        <div
                                            className={`${getStatusStyles(
                                                project.status
                                            )} border px-3.5 py-2 rounded-full flex items-center text-xs font-medium`}
                                        >
                                            {getStatusIcon(project.status)}
                                            {project.statusText}
                                        </div>
                                    </div>
                                </div>

                                <div className='p-6 flex-1 flex flex-col justify-between'>
                                    <div className='mb-4'>
                                        <h3 className='text-lg font-bold text-gray-900 mb-3 line-clamp-2'>
                                            {project.name}
                                        </h3>
                                        <p className='text-md text-gray-500 mb-3'>
                                            {t('COMMON.USER.ENTER_PROJECT_CODE')}:
                                            <span className='text-black font-medium ml-1'>{project.code}</span>
                                        </p>
                                        <p className='text-sm text-gray-500 -clamp-2'>{project.description}</p>
                                    </div>

                                    <div>
                                        <div className='flex items-center justify-between mb-4 '>
                                            <div className='flex items-center text-md text-gray-500 lowercase'>
                                                <ClipboardList className='h-4 w-4 mr-1.5' />
                                                <span className='mr-1'>{project.products}</span>
                                                {t('COMMON.USER.PRODUCT')}
                                            </div>
                                            <div className='flex items-center text-md text-gray-500'>
                                                <Calendar className='h-4 w-4 mr-1.5' />
                                                <span>{project.date}</span>
                                            </div>
                                        </div>

                                        <div className='flex items-center justify-between'>
                                            <div className='text-md font-medium text-gray-900'>
                                                {t('COMMON.USER.BUDGET')}:{' '}
                                                <span className='text-blue-600'>{formatCurrency(project.budget)}</span>
                                            </div>
                                            <button
                                                className='text-blue-600 hover:text-blue-800 text-md font-medium flex items-center group transition-colors duration-200'
                                                onClick={() => router.push(`quote`)}
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
                                        value={newProject.name}
                                        onChange={e => setNewProject({ ...newProject, name: e.target.value })}
                                        className='w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-blue-500 focus:border-blue-500 outline-none'
                                        placeholder={t('COMMON.USER.ENTER_PROJECT_NAME')}
                                        required
                                    />
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
                                            value={newProject.date}
                                            onChange={e => setNewProject({ ...newProject, date: e.target.value })}
                                            className='pl-10 w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-blue-500 focus:border-blue-500 outline-none'
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                        {t('COMMON.USER.ESTIMATED_BUDGET')}
                                    </label>

                                    <div className='flex items-center'>
                                        <input
                                            type='text'
                                            value={newProject.budget}
                                            onChange={e =>
                                                setNewProject({ ...newProject, budget: parseInt(e.target.value) })
                                            }
                                            className='w-[50%] mr-2 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-blue-500 focus:border-blue-500 outline-none'
                                            placeholder='VD: 100.000.000'
                                        />
                                        <span className='text-gray-500'>VND</span>
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
                                    type='submit'
                                    className='flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors'
                                >
                                    {t('COMMON.USER.CREATE_PROJECT')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
                    <div className='bg-white rounded-2xl w-full max-w-md' onClick={e => e.stopPropagation()}>
                        <div className='p-6 text-center'>
                            <div className='mx-auto flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-4'>
                                <Trash2 className='text-red-600 w-6 h-6' />
                            </div>
                            <h3 className='text-lg font-bold text-gray-900 mb-2'>Xác nhận xoá dự án?</h3>
                            <p className='text-gray-600 mb-6'>
                                Bạn có chắc chắn muốn xoá dự án này? Hành động này không thể hoàn tác.
                            </p>

                            <div className='flex space-x-4'>
                                <button
                                    className='flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors font-medium'
                                    onClick={() => setIsDeleteModalOpen(false)}
                                >
                                    Huỷ bỏ
                                </button>
                                <button
                                    className='flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors'
                                    onClick={handleDeleteProject}
                                >
                                    Xoá dự án
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProjectsPage
