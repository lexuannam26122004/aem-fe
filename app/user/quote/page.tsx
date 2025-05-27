'use client'

import React, { useState } from 'react'
import {
    FileText,
    ArrowLeftToLine,
    AlertCircle,
    CheckCircle2,
    Package,
    Building,
    Calendar,
    Send,
    Trash2,
    Plus,
    Minus,
    Briefcase,
    Info
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import EmptyItem from '@/components/EmptyItem'

const RequestQuotePage = () => {
    const { t } = useTranslation('common')
    const router = useRouter()
    const [submissionSuccess, setSubmissionSuccess] = useState(false)
    const [formError, setFormError] = useState('')

    // Form state
    const [form, setForm] = useState({
        companyName: '',
        contactName: '',
        email: '',
        phone: '',
        deliveryDate: '',
        additionalInfo: ''
    })

    const [quoteItems, setQuoteItems] = useState([
        {
            id: 1,
            productName: 'Áo thun đồng phục công ty',
            productImage: 'https://api-prod-minimal-v700.pages.dev/assets/images/cover/cover-9.webp',
            sku: 'AT-BULK-001',
            productVariant: 'Trắng / L',
            quantity: 100,
            specifications: 'Logo thêu mặt trước, in màu ở lưng'
        },
        {
            id: 2,
            productName: 'Túi quà tặng cao cấp',
            productImage: 'https://api-prod-minimal-v700.pages.dev/assets/images/cover/cover-19.webp',
            sku: 'TQ-CUSTOM-052',
            productVariant: 'Xanh đậm / Size lớn',
            quantity: 50,
            specifications: 'Giấy Ivory 250gsm, Dập nổi logo công ty'
        }
    ])

    const isQuoteEmpty = quoteItems.length === 0

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setForm({
            ...form,
            [name]: value
        })
    }

    const [projectInfo, setProjectInfo] = useState({
        projectName: 'Sự kiện kỷ niệm 10 năm thành lập',
        projectCode: 'PRJ-2025-042',
        projectDescription:
            'Dự án cung cấp các sản phẩm quà tặng và đồng phục cho sự kiện kỷ niệm 10 năm thành lập công ty',
        projectDate: '2025-07-15',
        projectStatus: 'Đang chờ báo giá',
        budget: 10000000
    })

    const handleProjectInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setProjectInfo({
            ...projectInfo,
            [name]: value
        })
    }

    const handleQuantityChange = (id: number, newQuantity: number) => {
        if (newQuantity < 1) return

        setQuoteItems(quoteItems.map(item => (item.id === id ? { ...item, quantity: newQuantity } : item)))
    }

    const handleRemoveItem = (id: number) => {
        setQuoteItems(quoteItems.filter(item => item.id !== id))
    }

    const handleSpecificationsChange = (id: number, value: string) => {
        setQuoteItems(quoteItems.map(item => (item.id === id ? { ...item, specifications: value } : item)))
    }

    const handleSubmitQuoteRequest = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!form.companyName || !form.contactName || !form.email || !form.phone) {
            setFormError(t('COMMON.USER.REQUIRED_FIELDS'))
            return
        }

        if (quoteItems.some(item => !item.productName)) {
            setFormError(t('COMMON.USER.PRODUCT_NAME_REQUIRED'))
            return
        }

        // Would normally submit to server here
        console.log('Quote Request:', { form, quoteItems })

        // Show success message
        setFormError('')
        setSubmissionSuccess(true)
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
                                            name='projectDescription'
                                            value={projectInfo.projectDescription}
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
                                                    name='budget'
                                                    value={projectInfo.budget}
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
                                                    name='projectDate'
                                                    value={projectInfo.projectDate}
                                                    onChange={handleProjectInputChange}
                                                    className='pl-10 w-full border border-gray-300 rounded-lg px-4 py-[11px] focus:ring-blue-500 focus:border-blue-500 outline-none'
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className='flex items-center justify-start'>
                                        <div className='bg-blue-50 px-4 py-3 rounded-lg flex items-center mt-6'>
                                            <Info className='w-5 h-5 text-blue-600 mr-2' />
                                            <span className='text-sm text-blue-700'>
                                                {t('COMMON.USER.PROJECT_STATUS')}:{' '}
                                                <span className='font-medium ml-1'>{projectInfo.projectStatus}</span>
                                            </span>
                                        </div>
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
                                        <div key={item.id} className='p-6'>
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
                                                    <div className='flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4'>
                                                        <div className='space-y-2 w-full sm:w-1/2'>
                                                            <p className='font-medium text-md text-gray-900'>
                                                                {item.productName}
                                                            </p>
                                                            <p className='text-gray-500 text-sm'>
                                                                SKU:{' '}
                                                                <span className='text-black font-medium ml-1'>
                                                                    {item.sku}
                                                                </span>
                                                            </p>
                                                            <p className='text-gray-500 text-sm'>
                                                                {t('COMMON.USER.PRODUCT_VARIANT')}:{' '}
                                                                <span className='text-black font-medium ml-1'>
                                                                    {item.productVariant}
                                                                </span>
                                                            </p>

                                                            <div>
                                                                <label className='text-gray-500 text-sm mb-1 block'>
                                                                    {t('COMMON.USER.QUANTITY')}*
                                                                </label>
                                                                <div className='flex items-center'>
                                                                    <div className='flex items-center border border-gray-200 rounded-lg shadow-sm overflow-hidden mr-4 sm:mr-6'>
                                                                        <button
                                                                            onClick={() =>
                                                                                handleQuantityChange(
                                                                                    item.id,
                                                                                    item.quantity - 1
                                                                                )
                                                                            }
                                                                            className='px-3 py-3 text-gray-600 hover:bg-gray-100 transition-colors'
                                                                        >
                                                                            <Minus className='w-3.5 h-3.5' />
                                                                        </button>
                                                                        <span className='px-3 py-1.5 text-gray-800 min-w-[40px] text-center font-medium'>
                                                                            {item.quantity}
                                                                        </span>
                                                                        <button
                                                                            onClick={() =>
                                                                                handleQuantityChange(
                                                                                    item.id,
                                                                                    item.quantity + 1
                                                                                )
                                                                            }
                                                                            className='px-3 py-3 text-gray-600 hover:bg-gray-100 transition-colors'
                                                                        >
                                                                            <Plus className='w-3.5 h-3.5' />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className='w-full sm:w-1/2'>
                                                            <div>
                                                                <label className='text-sm text-gray-600 block mb-1'>
                                                                    {t('COMMON.USER.SPECIFICATIONS')}
                                                                </label>
                                                                <textarea
                                                                    value={item.specifications}
                                                                    onChange={e =>
                                                                        handleSpecificationsChange(
                                                                            item.id,
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                    rows={3}
                                                                    className='w-full border border-gray-300 rounded-lg px-4 py-3 min-h-[90px] max-h-[200px] focus:ring-blue-500 focus:border-blue-500 outline-none'
                                                                    placeholder={t('COMMON.USER.ENTER_SPECIFICATIONS')}
                                                                />
                                                            </div>

                                                            <div className='flex items-center justify-end mt-4'>
                                                                <button
                                                                    className='p-2 bg-red-50 rounded-full text-red-600 hover:bg-red-100 transition-colors'
                                                                    onClick={() => handleRemoveItem(item.id)}
                                                                >
                                                                    <Trash2 size={18} />
                                                                </button>
                                                            </div>
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
                                    <form onSubmit={handleSubmitQuoteRequest}>
                                        <div className='space-y-4'>
                                            <div>
                                                <label className='block text-sm font-medium text-gray-700 mb-1'>
                                                    {t('COMMON.USER.COMPANY_NAME')}
                                                </label>
                                                <div className='relative'>
                                                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                                        <Building className='h-5 w-5 text-gray-400' />
                                                    </div>
                                                    <input
                                                        type='text'
                                                        name='companyName'
                                                        value={form.companyName}
                                                        onChange={handleInputChange}
                                                        className='pl-10 w-full border border-gray-300 rounded-lg px-4 py-[11px] focus:ring-blue-500 focus:border-blue-500 outline-none'
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
                                                    className='w-full border border-gray-300 rounded-lg px-4 py-[11px] focus:ring-blue-500 focus:border-blue-500 outline-none'
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
                                                    className='w-full border border-gray-300 rounded-lg px-4 py-[11px] focus:ring-blue-500 focus:border-blue-500 outline-none'
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
                                                    className='w-full border border-gray-300 rounded-lg px-4 py-[11px] focus:ring-blue-500 focus:border-blue-500 outline-none'
                                                    placeholder={t('COMMON.USER.ENTER_PHONE')}
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className='block text-sm font-medium text-gray-700 mb-1'>
                                                    {t('COMMON.USER.DESIRED_DELIVERY_DATE')}
                                                </label>
                                                <div className='relative'>
                                                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                                        <Calendar className='h-5 w-5 text-gray-400' />
                                                    </div>
                                                    <input
                                                        type='date'
                                                        name='deliveryDate'
                                                        value={form.deliveryDate}
                                                        onChange={handleInputChange}
                                                        className='pl-10 w-full border border-gray-300 rounded-lg px-4 py-[11px] focus:ring-blue-500 focus:border-blue-500 outline-none'
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className='block text-sm font-medium text-gray-700 mb-1'>
                                                    {t('COMMON.USER.ADDITIONAL_INFO')}
                                                </label>
                                                <textarea
                                                    name='additionalInfo'
                                                    value={form.additionalInfo}
                                                    onChange={handleInputChange}
                                                    rows={4}
                                                    className='w-full border border-gray-300 rounded-lg px-4 py-3 min-h-[100px] max-h-[200px] focus:ring-blue-500 focus:border-blue-500 outline-none'
                                                    placeholder={t('COMMON.USER.ENTER_ADDITIONAL_INFO')}
                                                />
                                            </div>
                                        </div>

                                        {formError && (
                                            <div className='mt-4 p-4 bg-red-50 rounded-lg text-red-600 text-sm flex items-start'>
                                                <AlertCircle className='w-4 h-4 mt-0.5 mr-2 flex-shrink-0' />
                                                <span>{formError}</span>
                                            </div>
                                        )}

                                        <div className='mt-6'>
                                            <button
                                                type='submit'
                                                className='w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium flex items-center justify-center transition'
                                            >
                                                <Send className='w-5 h-5 mr-2' />
                                                {t('COMMON.USER.SUBMIT_QUOTE_REQUEST')}
                                            </button>
                                        </div>

                                        <div className='mt-6 text-center'>
                                            <button
                                                type='button'
                                                className='text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center mx-auto'
                                                onClick={() => router.push('/')}
                                            >
                                                <ArrowLeftToLine className='w-5 h-5 mr-1.5 pt-[2px]' />
                                                {t('COMMON.USER.BACK_TO_PRODUCTS')}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <EmptyItem
                        icon={<Package className='w-10 h-10 text-blue-600' />}
                        title={t('COMMON.USER.NO_QUOTE_ITEMS_TITLE')}
                        description={t('COMMON.USER.NO_QUOTE_ITEMS_DESCRIPTION')}
                        buttonText={t('COMMON.USER.BROWSE_PRODUCTS')}
                        onClick={() => router.push('/')}
                    />
                )}
            </div>
        </div>
    )
}

export default RequestQuotePage
