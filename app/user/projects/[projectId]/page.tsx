'use client'

import React, { useEffect, useRef, useState } from 'react'
import {
    FileText,
    ArrowLeftToLine,
    CheckCircle2,
    Package,
    Building,
    Calendar,
    Send,
    Trash2,
    Plus,
    Minus,
    Briefcase,
    Hourglass,
    Loader,
    LucideActivitySquare,
    CheckCircle,
    RotateCcw,
    Loader2,
    Save
} from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import EmptyItem from '@/components/EmptyItem'
import {
    useDeleteProjectProductMutation,
    useGetByIdProjectQuery,
    useUpdateProjectMutation,
    useUpdateProjectQuantityMutation
} from '@/services/UserProjectService'
import Loading from '@/components/Loading'
import { useSelector } from 'react-redux'
import { userSelector } from '@/redux/slices/userSlice'
import { IProjectGetById, IProjectProduct } from '@/models/Project'
import dayjs from 'dayjs'
import { useToast } from '@/hooks/useToast'
import { debounce } from 'lodash'
import { useCheckQuotedQuery, useCreateQuoteMutation } from '@/services/UserQuoteService'
import { IQuoteCreateVModel } from '@/models/Quote'
import UserAlertDialog from '@/components/UserAlertDialog'
import LoginRequired from '@/components/LoginRequired'
import ForbiddenAccess from '@/components/ForbiddenAccess'

const RequestQuotePage = () => {
    const { t } = useTranslation('common')
    const router = useRouter()
    const [submissionSuccess, setSubmissionSuccess] = useState(false)
    const [isSubmit, setIsSubmit] = useState(false)
    const [projectInfo, setProjectInfo] = useState({
        projectName: '',
        projectCode: '',
        description: '',
        estimatedBudget: 0,
        doneDate: ''
    })
    const [quoteItems, setQuoteItems] = useState<IProjectProduct[]>([])
    const [deleteId, setDeleteId] = useState<number | null>(null)
    const [isShowAlertDialog, setIsShowAlertDialog] = useState(false)
    const [project, setProject] = useState<IProjectGetById | null>(null)
    const [quote, setQuote] = useState<IQuoteCreateVModel | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isQuoteEmpty, setIsQuoteEmpty] = useState(true)

    const pathName = usePathname()
    const toast = useToast()

    const id = pathName.split('/').pop() // Get the last part of the path as ID

    const { data: projectResponse, refetch, error: errorProject } = useGetByIdProjectQuery(Number(id))
    const [updateProject, { isLoading: isUpdatingProject }] = useUpdateProjectMutation()
    const [deleteProjectProduct, { isLoading: isDeleteLoading }] = useDeleteProjectProductMutation()
    const [updateQuantity] = useUpdateProjectQuantityMutation()
    const { data: checkQuotedResponse, refetch: refetchCheckQuoted } = useCheckQuotedQuery(Number(id))
    const [createQuote, { isLoading: isCreateQuoteLoading }] = useCreateQuoteMutation()

    const userInfo = useSelector(userSelector).userInfo

    const [form, setForm] = useState<IQuoteCreateVModel>({
        projectId: Number(id),
        companyName: userInfo?.companyName || '',
        contactName: userInfo?.fullName || '',
        email: userInfo?.email || '',
        phone: userInfo?.phoneNumber || '',
        desiredDeliveryDate: '',
        additionalInformation: ''
    })

    useEffect(() => {
        if (checkQuotedResponse?.data && quote === null) {
            setQuote(checkQuotedResponse.data)
            setForm({
                projectId: Number(id),
                companyName: checkQuotedResponse.data.companyName || '',
                contactName: checkQuotedResponse.data.contactName || '',
                email: checkQuotedResponse.data.email || '',
                phone: checkQuotedResponse.data.phone || '',
                desiredDeliveryDate: checkQuotedResponse.data.desiredDeliveryDate || '',
                additionalInformation: checkQuotedResponse.data.additionalInformation || ''
            })
        }
    }, [checkQuotedResponse])

    useEffect(() => {
        if (projectResponse?.data && project === null) {
            setProject(projectResponse.data)
        }
    }, [projectResponse])

    useEffect(() => {
        if (!project) return
        setProjectInfo({
            projectName: project.projectName,
            projectCode: project.projectCode || '',
            description: project.description || '',
            estimatedBudget: project.estimatedBudget,
            doneDate: project.doneDate || ''
        })

        setIsLoading(false)
        setQuoteItems(project.products)
        setIsQuoteEmpty(project.products.length === 0)
    }, [project])

    const getError = (field: keyof IQuoteCreateVModel) => {
        if (!isSubmit) return false

        const value = form[field]
        switch (field) {
            case 'companyName':
            case 'contactName':
            case 'email':
            case 'phone':
                return !value || value.toString().trim() === ''
            case 'desiredDeliveryDate':
                return !value || !dayjs(form.desiredDeliveryDate).isValid || dayjs(value).isBefore(dayjs(), 'day')
            default:
                return false
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setForm({
            ...form,
            [name]: value
        })
    }

    const handleCreateQuote = async () => {
        setIsShowAlertDialog(false)
        createQuote(form)
            .unwrap()
            .then(() => {
                refetchCheckQuoted()
                toast('Yêu cầu báo giá đã được gửi thành công', 'success')
            })
            .catch(() => {
                toast('Gửi yêu cầu báo giá thất bại', 'error')
            })
    }

    const handleProjectInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setProjectInfo({
            ...projectInfo,
            [name]: value
        })
    }

    const handleUpdateProject = async () => {
        await updateProject({ id: project.id, body: projectInfo })
            .unwrap()
            .then(() => {
                toast('Cập nhật dự án thành công', 'success')
                refetch()
            })
            .catch(() => {
                toast('Cập nhật dự án thất bại', 'error')
            })
    }

    useEffect(() => {
        if (deleteId === null) return
        const snapshot = quoteItems.map(item => ({ ...item }))
        deleteProjectProduct(deleteId as number)
            .unwrap()
            .then(async () => {
                toast('Xoá sản phẩm thành công', 'success')
                await refetch()
                setQuoteItems(quoteItems.filter(item => item.id !== deleteId))
            })
            .catch(() => {
                toast('Xoá sản phẩm thất bại', 'error')
                setQuoteItems(snapshot)
            })
    }, [deleteId])

    const debouncedChangeQuantity = useRef(
        debounce((fn, id: number, quantity: number, snapshot) => {
            fn({ id, quantity })
                .unwrap()
                .then(() => {
                    refetch()
                })
                .catch(() => {
                    setQuoteItems(snapshot)
                })
        }, 200)
    ).current

    const handleQuantityChange = (id: number, newQuantity: number) => {
        if (newQuantity < 1) return
        const snapshot = quoteItems.map(item => ({ ...item }))

        setQuoteItems(quoteItems.map(item => (item.id === id ? { ...item, quantity: newQuantity } : item)))

        debouncedChangeQuantity(updateQuantity, id, newQuantity, snapshot)
    }

    if (submissionSuccess) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='max-w-xl w-full mx-auto px-4 py-12 text-center'>
                    <div className='bg-white rounded-[15px] shadow-[0_4px_16px_rgba(0,0,0,0.1)] p-8'>
                        <div className='mx-auto flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6'>
                            <CheckCircle2 className='text-green-600 w-8 h-8' />
                        </div>
                        <h1 className='text-2xl font-bold text-gray-900 mb-4'>
                            {t('COMMON.USER.QUOTE_REQUEST_SUBMITTED')}
                        </h1>
                        <p className='text-gray-600 mb-8'>
                            {t('COMMON.USER.QUOTE_REQUEST_CONFIRMATION', { email: form.email })}
                        </p>
                        <button
                            className='bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition'
                            onClick={() => {
                                setSubmissionSuccess(false)
                                router.push('/')
                            }}
                        >
                            {t('COMMON.USER.BACK_TO_HOME')}
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'planning':
                return 'bg-indigo-100 text-indigo-800 border border-indigo-300'
            case 'pending':
                return 'bg-amber-100 text-amber-700 border border-amber-300'
            case 'active':
                return 'bg-sky-100 text-sky-800 border border-sky-300'
            case 'completed':
                return 'bg-emerald-100 text-emerald-600 border border-emerald-300'
            case 'returned':
                return 'bg-rose-100 text-rose-800 border border-rose-300'
            default:
                return 'bg-red-100 text-red-600 border border-red-300'
        }
    }

    const getStatusIcon = (status: string) => {
        const baseClass = 'w-5 h-5 mr-2'
        switch (status) {
            case 'planning':
                return <Hourglass className={baseClass} />
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

    if (errorProject && typeof errorProject === 'object' && 'status' in errorProject && errorProject.status === 401) {
        return <LoginRequired type='quote' />
    }

    if (errorProject && typeof errorProject === 'object' && 'status' in errorProject && errorProject.status === 403) {
        return <ForbiddenAccess type='quote' />
    }

    if (isLoading) {
        return <Loading />
    }

    return (
        <div className='min-h-screen'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='mb-6'>
                    <h1 className='text-2xl font-bold text-gray-900'>{t('COMMON.USER.REQUEST_QUOTE_TITLE')}</h1>
                    <p className='text-gray-600 mt-1'>{t('COMMON.USER.REQUEST_QUOTE_DESCRIPTION')}</p>
                </div>

                {!isQuoteEmpty ? (
                    <div className='flex flex-col lg:flex-row gap-6'>
                        {/* Main quote content */}
                        <div className='w-full lg:w-2/3'>
                            <div className='rounded-[15px] overflow-hidden w-full shadow-[0_4px_16px_rgba(0,0,0,0.1)] bg-[var(--background-color-item)] mb-6'>
                                <div className='px-6 border-b border-gray-100'>
                                    <div className='flex h-[65px] items-center'>
                                        <Briefcase className='w-5 h-5 text-blue-600 mr-3' />
                                        <h2 className='font-bold text-lg text-gray-800'>
                                            {t('COMMON.USER.PROJECT_INFORMATION')}
                                        </h2>
                                    </div>
                                </div>

                                <div className='p-6'>
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                                                {t('COMMON.USER.PROJECT_NAME')}
                                            </label>
                                            <input
                                                type='text'
                                                name='projectName'
                                                value={projectInfo.projectName}
                                                onChange={handleProjectInputChange}
                                                className='w-full border border-gray-300 rounded-lg px-4 py-[11px] focus:ring-blue-500 focus:border-blue-500 out-none'
                                                placeholder={t('COMMON.USER.ENTER_PROJECT_NAME')}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                                                {t('COMMON.USER.PROJECT_CODE')}
                                            </label>
                                            <input
                                                type='text'
                                                name='projectCode'
                                                value={projectInfo.projectCode}
                                                onChange={handleProjectInputChange}
                                                className='w-full border border-gray-300 rounded-lg px-4 py-[11px] focus:ring-blue-500 focus:border-blue-500 out-none'
                                                placeholder={t('COMMON.USER.ENTER_PROJECT_CODE_OPTIONAL')}
                                            />
                                        </div>
                                    </div>
                                    <div className='mt-4'>
                                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                                            {t('COMMON.USER.PROJECT_DESCRIPTION')}
                                        </label>
                                        <textarea
                                            name='description'
                                            value={projectInfo.description}
                                            onChange={handleProjectInputChange}
                                            rows={3}
                                            className='w-full border border-gray-300 rounded-lg px-4 py-3 min-h-[90px] max-h-[200px] focus:ring-blue-500 focus:border-blue-500 out-none'
                                            placeholder={t('COMMON.USER.ENTER_PROJECT_DESCRIPTION')}
                                        />
                                    </div>
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-4'>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                                                {t('COMMON.USER.ESTIMATED_BUDGET')}
                                            </label>
                                            <div className='flex items-center'>
                                                <input
                                                    type='text'
                                                    name='estimatedBudget'
                                                    value={projectInfo.estimatedBudget}
                                                    onChange={handleProjectInputChange}
                                                    className='mr-2 w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-blue-500 focus:border-blue-500 outline-none'
                                                    placeholder='VD: 100.000.000'
                                                />
                                                <span className='text-gray-500'>VND</span>
                                            </div>
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
                                                    name='doneDate'
                                                    value={
                                                        projectInfo.doneDate
                                                            ? dayjs(projectInfo.doneDate).format('YYYY-MM-DD')
                                                            : ''
                                                    }
                                                    onChange={handleProjectInputChange}
                                                    className='pl-10 w-full border border-gray-300 rounded-lg px-4 py-[11px] focus:ring-blue-500 focus:border-blue-500 outline-none'
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className='flex items-center justify-between mt-6'>
                                        <div
                                            className={`${getStatusStyles(
                                                project.status
                                            )} px-4 py-[11px] rounded-lg flex items-center`}
                                        >
                                            {getStatusIcon(project.status)}
                                            <span className='text-sm'>
                                                {t('COMMON.USER.PROJECT_STATUS')}:{' '}
                                                <span className='font-medium ml-1'>
                                                    {getStatusText(project.status)}
                                                </span>
                                            </span>
                                        </div>

                                        {project.status !== 'cancelled' && project.status !== 'completed' && (
                                            <button
                                                onClick={handleUpdateProject}
                                                disabled={isUpdatingProject || !!quote}
                                                className='px-6 py-[11px] font-medium disabled:opacity-80 disabled:cursor-not-allowed bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center'
                                            >
                                                {isUpdatingProject ? (
                                                    <Loader2 size={16} className='mr-2 animate-spin' />
                                                ) : (
                                                    <Save size={16} className='mr-2' />
                                                )}
                                                {t('COMMON.USER.SAVE')}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Quote items */}
                            <div className='rounded-[15px] overflow-hidden w-full shadow-[0_4px_16px_rgba(0,0,0,0.1)] bg-[var(--background-color-item)]'>
                                <div className='px-6 border-b border-gray-100'>
                                    <div className='flex h-[65px] items-center'>
                                        <FileText className='w-5 h-5 text-blue-600 mr-3' />
                                        <h2 className='font-bold text-lg text-gray-800'>
                                            {t('COMMON.USER.PRODUCTS_FOR_QUOTE')}
                                        </h2>
                                        <span className='ml-3 px-2 py-0.5 bg-blue-100 font-bold text-blue-700 text-sm rounded-full'>
                                            {quoteItems.length}
                                        </span>
                                    </div>
                                </div>

                                {/* Quote Items */}
                                <div className='divide-y divide-gray-100'>
                                    {quoteItems.map(item => (
                                        <div key={item.productId} className='p-6'>
                                            <div className='flex'>
                                                {/* Product Image */}
                                                <div className='flex-shrink-0'>
                                                    <img
                                                        src={item.productImage}
                                                        alt={item.productName}
                                                        className='w-[65px] h-[65px] rounded-[10px] border border-gray-200 object-cover'
                                                    />
                                                </div>

                                                {/* Product Details */}
                                                <div className='ml-5 flex-grow'>
                                                    <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center'>
                                                        <div className='space-y-1'>
                                                            <p className='font-medium text-md text-gray-900'>
                                                                {item.productName}
                                                            </p>
                                                            <p className='text-gray-500 text-sm'>SKU: {item.sku}</p>
                                                            <p className='text-black text-sm'>{item.variants}</p>
                                                        </div>

                                                        <div className='flex items-center justify-between mt-3 sm:ml-3 sm:mt-0'>
                                                            {/* Quantity Control */}
                                                            <div className='flex items-center border border-gray-200 rounded-lg shadow-sm overflow-hidden'>
                                                                <button
                                                                    disabled={!!quote}
                                                                    onClick={() =>
                                                                        handleQuantityChange(item.id, item.quantity - 1)
                                                                    }
                                                                    className='px-3 py-3 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-80 disabled:cursor-not-allowed'
                                                                >
                                                                    <Minus className='w-3.5 h-3.5' />
                                                                </button>
                                                                <span className='px-3 py-1.5 text-gray-800 min-w-[40px] text-center font-medium'>
                                                                    {item.quantity}
                                                                </span>
                                                                <button
                                                                    disabled={!!quote}
                                                                    onClick={() =>
                                                                        handleQuantityChange(item.id, item.quantity + 1)
                                                                    }
                                                                    className='px-3 py-3 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-80 disabled:cursor-not-allowed'
                                                                >
                                                                    <Plus className='w-3.5 h-3.5' />
                                                                </button>
                                                            </div>

                                                            {!quote && (
                                                                <button
                                                                    disabled={isDeleteLoading}
                                                                    className='p-2 bg-red-50 ml-4 sm:ml-6 rounded-full text-red-600 hover:bg-red-100 transition-colors'
                                                                    onClick={() => {
                                                                        setDeleteId(item.id)
                                                                    }}
                                                                >
                                                                    {isDeleteLoading ? (
                                                                        <Loader2 size={18} className='animate-spin' />
                                                                    ) : (
                                                                        <Trash2 size={18} />
                                                                    )}
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className='w-full lg:w-1/3'>
                            <div className='rounded-[15px] overflow-hidden w-full shadow-[0_4px_16px_rgba(0,0,0,0.1)] bg-[var(--background-color-item)]'>
                                <div className='px-6 h-[66px] flex items-center border-b border-gray-100'>
                                    <h2 className='font-bold text-[18px] text-gray-800'>
                                        {t('COMMON.USER.CONTACT_INFORMATION')}
                                    </h2>
                                </div>
                                <div className='p-6'>
                                    <form onSubmit={e => e.preventDefault()}>
                                        <div className='space-y-4'>
                                            <div className='space-y-4'>
                                                <div>
                                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                                        {t('COMMON.USER.COMPANY_NAME')}*
                                                    </label>
                                                    <div className='relative'>
                                                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                                            <Building
                                                                className={`h-5 w-5 ${
                                                                    getError('companyName')
                                                                        ? 'text-red-500'
                                                                        : 'text-gray-400'
                                                                }`}
                                                            />
                                                        </div>
                                                        <input
                                                            type='text'
                                                            name='companyName'
                                                            value={form.companyName}
                                                            onChange={handleInputChange}
                                                            className={`pl-10 w-full border rounded-lg px-4 py-[11px] focus:ring-blue-500 focus:border-blue-500 outline-none 
          ${getError('companyName') ? 'border-red-500' : 'border-gray-300'}`}
                                                            placeholder={t('COMMON.USER.ENTER_COMPANY_NAME')}
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                                        {t('COMMON.USER.CONTACT_NAME')}*
                                                    </label>
                                                    <input
                                                        type='text'
                                                        name='contactName'
                                                        value={form.contactName}
                                                        onChange={handleInputChange}
                                                        className={`w-full border rounded-lg px-4 py-[11px] focus:ring-blue-500 focus:border-blue-500 outline-none 
        ${getError('contactName') ? 'border-red-500' : 'border-gray-300'}`}
                                                        placeholder={t('COMMON.USER.ENTER_CONTACT_NAME')}
                                                        required
                                                    />
                                                </div>

                                                <div>
                                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                                        {t('COMMON.USER.EMAIL')}*
                                                    </label>
                                                    <input
                                                        type='email'
                                                        name='email'
                                                        value={form.email}
                                                        onChange={handleInputChange}
                                                        className={`w-full border rounded-lg px-4 py-[11px] focus:ring-blue-500 focus:border-blue-500 outline-none 
        ${getError('email') ? 'border-red-500' : 'border-gray-300'}`}
                                                        placeholder={t('COMMON.USER.ENTER_EMAIL')}
                                                        required
                                                    />
                                                </div>

                                                <div>
                                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                                        {t('COMMON.USER.PHONE')}*
                                                    </label>
                                                    <input
                                                        type='tel'
                                                        name='phone'
                                                        value={form.phone}
                                                        onChange={handleInputChange}
                                                        className={`w-full border rounded-lg px-4 py-[11px] focus:ring-blue-500 focus:border-blue-500 outline-none 
        ${getError('phone') ? 'border-red-500' : 'border-gray-300'}`}
                                                        placeholder={t('COMMON.USER.ENTER_PHONE')}
                                                        required
                                                    />
                                                </div>

                                                <div>
                                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                                        {t('COMMON.USER.DESIRED_DELIVERY_DATE')}*
                                                    </label>
                                                    <div className='relative'>
                                                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                                            <Calendar
                                                                className={`h-5 w-5 ${
                                                                    getError('desiredDeliveryDate')
                                                                        ? 'text-red-500'
                                                                        : 'text-gray-400'
                                                                }`}
                                                            />
                                                        </div>
                                                        <input
                                                            type='date'
                                                            name='desiredDeliveryDate'
                                                            value={
                                                                form.desiredDeliveryDate
                                                                    ? dayjs(form.desiredDeliveryDate).format(
                                                                          'YYYY-MM-DD'
                                                                      )
                                                                    : ''
                                                            }
                                                            onChange={handleInputChange}
                                                            className={`pl-10 w-full border rounded-lg px-4 py-[11px] focus:ring-blue-500 focus:border-blue-500 outline-none 
          ${getError('desiredDeliveryDate') ? 'border-red-500' : 'border-gray-300'}`}
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                                        {t('COMMON.USER.ADDITIONAL_INFO')}
                                                    </label>
                                                    <textarea
                                                        name='additionalInformation'
                                                        value={form.additionalInformation}
                                                        onChange={handleInputChange}
                                                        rows={4}
                                                        className='w-full border border-gray-300 rounded-lg px-4 py-3 min-h-[100px] max-h-[200px] focus:ring-blue-500 focus:border-blue-500 outline-none'
                                                        placeholder={t('COMMON.USER.ENTER_ADDITIONAL_INFO')}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className='mt-6 pb-2'>
                                            <button
                                                disabled={isCreateQuoteLoading || !!quote}
                                                onClick={e => {
                                                    e.preventDefault()
                                                    setIsSubmit(true)
                                                    if (
                                                        form.companyName &&
                                                        form.contactName &&
                                                        form.email &&
                                                        form.phone &&
                                                        dayjs(form.desiredDeliveryDate).isValid()
                                                    )
                                                        setIsShowAlertDialog(true)
                                                }}
                                                className='disabled:cursor-not-allowed disabled:opacity-80 w-full 
                                                    bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium 
                                                    flex items-center justify-center transition'
                                            >
                                                {isCreateQuoteLoading ? (
                                                    <Loader2 size={16} className='mr-2 animate-spin' />
                                                ) : (
                                                    <Send className='w-5 h-5 mr-2' />
                                                )}
                                                {!quote
                                                    ? t('COMMON.USER.SUBMIT_QUOTE_REQUEST')
                                                    : 'Đã gửi yêu cầu báo giá'}
                                            </button>
                                        </div>

                                        <div className='mt-4 text-center'>
                                            <button
                                                type='button'
                                                className='text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center mx-auto'
                                                onClick={() => router.push('/user/projects')}
                                            >
                                                <ArrowLeftToLine className='w-5 h-5 mr-1.5 pt-[2px]' />
                                                {'Quay lại dự án của tôi'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                        <UserAlertDialog
                            open={isShowAlertDialog}
                            setOpen={setIsShowAlertDialog}
                            onConfirm={handleCreateQuote}
                            title='Báo giá dự án của bạn'
                            alertText='Sau khi gửi yêu cầu báo giá, bạn sẽ không thể chỉnh sửa dự án này nữa. Bạn có chắc chắn muốn gửi yêu cầu báo giá không?'
                        />
                    </div>
                ) : (
                    <EmptyItem
                        icon={<Package className='w-10 h-10 text-blue-600' />}
                        title={t('COMMON.USER.NO_QUOTE_ITEMS_TITLE')}
                        description={t('COMMON.USER.NO_QUOTE_ITEMS_DESCRIPTION')}
                        buttonText='Xem thêm sản phẩm'
                        onClick={() => router.push('/user')}
                    />
                )}
            </div>
        </div>
    )
}

export default RequestQuotePage
