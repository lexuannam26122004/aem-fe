'use client'

import { useEffect, useState } from 'react'
import {
    MapPin,
    Edit,
    User2,
    PhoneCall,
    Mail,
    House,
    Building,
    CheckCircle,
    Trash2,
    X,
    Loader2,
    Save
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
    useChangeDefaultCustomerAddressMutation,
    useCreateCustomerAddressMutation,
    useDeleteCustomerAddressMutation,
    useLazySearchCustomerAddressQuery,
    useUpdateCustomerAddressMutation
} from '@/services/CustomerAddressService'
import { ICustomerAddress, ICustomerAddressCreate, ICustomerAddressUpdate } from '@/models/CustomerAddress'
import { useToast } from '@/hooks/useToast'
import Loading from './Loading'
import { useAuthCheck } from '@/hooks/useAuthCheck'

interface AddressManagerProps {
    isOpen: boolean
    onClose: () => void
}

export default function AddressManager({ isOpen, onClose }: AddressManagerProps) {
    const { t } = useTranslation('common')
    const toast = useToast()
    const [editingAddress, setEditingAddress] = useState<ICustomerAddress | null>(null)
    const [isAddingAddress, setIsAddingAddress] = useState(false)
    const [formErrors, setFormErrors] = useState({
        recipient: '',
        phone: '',
        title: '',
        email: '',
        address: '',
        district: '',
        city: ''
    })
    const [shippingAddress, setShippingAddress] = useState<ICustomerAddress[] | null>(null)
    const { isAuthChecked, isAuthenticated } = useAuthCheck()

    const [createCustomerAddress, { isLoading: isCreateLoading }] = useCreateCustomerAddressMutation()
    const [updateCustomerAddress, { isLoading: isUpdateLoading }] = useUpdateCustomerAddressMutation()
    const [deleteCustomerAddress, { isLoading: isDeleteLoading, originalArgs: originalDeleteArgs }] =
        useDeleteCustomerAddressMutation()
    const [changeDefaultCustomerAddress, { isLoading: isChangeDefaultLoading, originalArgs }] =
        useChangeDefaultCustomerAddressMutation()

    const [trigger, { isFetching, isLoading }] = useLazySearchCustomerAddressQuery()

    useEffect(() => {
        if (isAuthChecked && isAuthenticated) {
            trigger()
                .unwrap()
                .then(data => {
                    setShippingAddress(data.data)
                })
                .catch(() => {
                    setShippingAddress(null)
                })
        }
    }, [isAuthChecked, isAuthenticated])

    const handleCreateAddress = (address: ICustomerAddressCreate) => {
        createCustomerAddress(address)
            .unwrap()
            .then(() => {
                setEditingAddress(null)
                setIsAddingAddress(false)
                toast('Địa chỉ đã được thêm thành công', 'success')
            })
            .catch(error => {
                const errorMessage = error.data?.detail || 'Thêm địa chỉ không thành công'
                toast(errorMessage, 'error')
            })
    }

    const handleUpdateAddress = (id: number, address: ICustomerAddressUpdate) => {
        updateCustomerAddress({ id, body: address })
            .unwrap()
            .then(() => {
                setEditingAddress(null)
                setIsAddingAddress(false)
                toast('Địa chỉ đã được cập nhật thành công', 'success')
            })
            .catch(error => {
                const errorMessage = error.data?.detail || 'Cập nhật địa chỉ không thành công'
                toast(errorMessage, 'error')
            })
    }

    const handleDeleteAddress = (id: number) => {
        deleteCustomerAddress(id)
            .unwrap()
            .then(() => toast('Địa chỉ đã được xóa thành công', 'success'))
            .catch(error => {
                const errorMessage = error.data?.detail || 'Xóa địa chỉ không thành công'
                toast(errorMessage, 'error')
            })
    }

    const handleSetDefaultAddress = (id: number) => {
        changeDefaultCustomerAddress(id)
            .unwrap()
            .then(() => {
                toast('Địa chỉ đã được đặt làm mặc định', 'success')
            })
            .catch(error => {
                const errorMessage = error.data?.detail || 'Đặt địa chỉ mặc định không thành công'
                toast(errorMessage, 'error')
            })
    }

    const closeModal = () => {
        onClose()
        setEditingAddress(null)
        setIsAddingAddress(false)
        setFormErrors({
            recipient: '',
            phone: '',
            email: '',
            title: '',
            address: '',
            district: '',
            city: ''
        })
    }

    if (isLoading) {
        return <Loading />
    }

    return (
        <div>
            {isOpen && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                    <div className='bg-white rounded-xl shadow-xl w-full flex flex-col max-w-[80w] md:max-w-4xl max-h-[90vh] overflow-y-hidden'>
                        <div className='sticky top-0 bg-white z-10 px-6 py-4 border-b flex items-center justify-between'>
                            <h2 className='font-bold text-[18px] text-gray-800 flex items-center'>
                                <MapPin size={20} className='w-5 h-5 text-blue-600 mr-3' color='#3675ff' />
                                {t('COMMON.USER.DELIVERY_ADDRESSES')}
                                <span className='ml-3 px-2 py-0.5 bg-blue-100 text-blue-700 text-sm rounded-full'>
                                    {shippingAddress.length}
                                </span>
                            </h2>

                            <div className='flex space-x-4 items-center'>
                                <button
                                    onClick={() => {
                                        setIsAddingAddress(true)
                                        setEditingAddress({
                                            title: '',
                                            recipient: '',
                                            phone: '',
                                            email: '',
                                            address: '',
                                            district: '',
                                            city: '',
                                            isDefault: false
                                        })
                                    }}
                                    className='text-blue-600 hover:text-blue-800 flex items-center font-medium px-4 py-2 rounded-[8px] hover:bg-blue-50'
                                >
                                    <Edit size={16} className='mr-2' />
                                    {t('COMMON.USER.ADD_ADDRESS')}
                                </button>

                                <button
                                    onClick={closeModal}
                                    className='text-gray-500 hover:text-gray-700 p-1.5 w-fit h-fit rounded-full hover:bg-gray-100'
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        {editingAddress ? (
                            <div className='space-y-4 p-6 '>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                                            {t('COMMON.USER.FULL_NAME')} *
                                        </label>
                                        <div className='relative'>
                                            <input
                                                type='text'
                                                value={editingAddress.recipient}
                                                onChange={e =>
                                                    setEditingAddress({ ...editingAddress, recipient: e.target.value })
                                                }
                                                className={`w-full border ${
                                                    formErrors.recipient ? 'border-red-500' : 'border-gray-300'
                                                } rounded-lg pl-4 pr-10 py-3 focus:ring-blue-500 focus:border-blue-500 outline-none`}
                                                placeholder={t('COMMON.USER.ENTER_FULL_NAME')}
                                            />
                                            <User2 className='w-5 h-5 text-blue-600 absolute right-3 top-1/2 transform -translate-y-1/2' />
                                        </div>
                                        {formErrors.recipient && (
                                            <p className='mt-1 text-sm text-red-600'>{formErrors.recipient}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                                            {t('COMMON.USER.PHONE')} *
                                        </label>
                                        <div className='relative'>
                                            <input
                                                type='tel'
                                                value={editingAddress.phone}
                                                onChange={e =>
                                                    setEditingAddress({ ...editingAddress, phone: e.target.value })
                                                }
                                                className={`w-full border ${
                                                    formErrors.phone ? 'border-red-500' : 'border-gray-300'
                                                } rounded-lg pl-4 pr-10 py-3 focus:ring-blue-500 focus:border-blue-500 outline-none`}
                                                placeholder={t('COMMON.USER.ENTER_PHONE')}
                                            />
                                            <PhoneCall className='w-5 h-5 text-blue-600 absolute right-3 top-1/2 transform -translate-y-1/2' />
                                        </div>
                                        {formErrors.phone && (
                                            <p className='mt-1 text-sm text-red-600'>{formErrors.phone}</p>
                                        )}
                                    </div>
                                </div>

                                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                                            {t('COMMON.USER.EMAIL')} *
                                        </label>
                                        <div className='relative'>
                                            <input
                                                type='email'
                                                value={editingAddress.email}
                                                onChange={e =>
                                                    setEditingAddress({ ...editingAddress, email: e.target.value })
                                                }
                                                className={`w-full border ${
                                                    formErrors.email ? 'border-red-500' : 'border-gray-300'
                                                } rounded-lg pl-4 pr-10 py-3 focus:ring-blue-500 focus:border-blue-500 outline-none`}
                                                placeholder={t('COMMON.USER.ENTER_EMAIL')}
                                            />
                                            <Mail className='w-5 h-5 text-blue-600 absolute right-3 top-1/2 transform -translate-y-1/2' />
                                        </div>
                                        {formErrors.email && (
                                            <p className='mt-1 text-sm text-red-600'>{formErrors.email}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                                            {t('COMMON.USER.ADDRESS_TITLE')}
                                        </label>
                                        <input
                                            type='text'
                                            value={editingAddress.title}
                                            onChange={e =>
                                                setEditingAddress({ ...editingAddress, title: e.target.value })
                                            }
                                            className={`w-full border ${
                                                formErrors.title ? 'border-red-500' : 'border-gray-300'
                                            } rounded-lg pl-4 pr-10 py-3 focus:ring-blue-500 focus:border-blue-500 outline-none`}
                                            placeholder='Văn phòng, Nhà riêng, Kho hàng...'
                                        />
                                    </div>
                                </div>

                                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                                            {t('COMMON.USER.ADDRESS')} *
                                        </label>
                                        <div className='relative'>
                                            <input
                                                type='text'
                                                value={editingAddress.address}
                                                onChange={e =>
                                                    setEditingAddress({ ...editingAddress, address: e.target.value })
                                                }
                                                className={`w-full border ${
                                                    formErrors.address ? 'border-red-500' : 'border-gray-300'
                                                } rounded-lg pl-4 pr-10 py-3 focus:ring-blue-500 focus:border-blue-500 outline-none`}
                                                placeholder={t('COMMON.USER.ENTER_ADDRESS')}
                                            />
                                            <House className='w-5 h-5 text-blue-600 absolute right-3 top-1/2 transform -translate-y-1/2' />
                                        </div>
                                        {formErrors.address && (
                                            <p className='mt-1 text-sm text-red-600'>{formErrors.address}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                                            {t('COMMON.USER.DISTRICT')} *
                                        </label>
                                        <input
                                            type='text'
                                            value={editingAddress.district}
                                            onChange={e =>
                                                setEditingAddress({ ...editingAddress, district: e.target.value })
                                            }
                                            className={`w-full border ${
                                                formErrors.district ? 'border-red-500' : 'border-gray-300'
                                            } rounded-lg px-4 py-3 focus:ring-blue-500 focus:border-blue-500 outline-none`}
                                            placeholder={t('COMMON.USER.ENTER_DISTRICT')}
                                        />
                                        {formErrors.district && (
                                            <p className='mt-1 text-sm text-red-600'>{formErrors.district}</p>
                                        )}
                                    </div>
                                </div>

                                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 md:items-center'>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                                            {t('COMMON.USER.CITY')} *
                                        </label>
                                        <input
                                            type='text'
                                            value={editingAddress.city}
                                            onChange={e =>
                                                setEditingAddress({ ...editingAddress, city: e.target.value })
                                            }
                                            className={`w-full border ${
                                                formErrors.city ? 'border-red-500' : 'border-gray-300'
                                            } rounded-lg px-4 py-3 focus:ring-blue-500 focus:border-blue-500 outline-none`}
                                            placeholder={t('COMMON.USER.ENTER_CITY')}
                                        />
                                        {formErrors.city && (
                                            <p className='mt-1 text-sm text-red-600'>{formErrors.city}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className='flex items-center cursor-pointer md:mt-6 w-fit'>
                                            <input
                                                type='checkbox'
                                                checked={editingAddress.isDefault}
                                                onChange={e =>
                                                    setEditingAddress({
                                                        ...editingAddress,
                                                        isDefault: e.target.checked
                                                    })
                                                }
                                                className='w-4 h-4 rounded-[10px] border-[#d1e0ff] accent-[#3675ff] rounded focus:ring-red-500'
                                            />
                                            <span className='ml-3 font-medium text-md text-gray-900'>
                                                {t('COMMON.USER.SET_AS_DEFAULT')}
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                <div className='flex justify-end space-x-6 pt-2'>
                                    <button
                                        onClick={() => {
                                            setEditingAddress(null)
                                            setFormErrors({
                                                recipient: '',
                                                phone: '',
                                                email: '',
                                                title: '',
                                                address: '',
                                                district: '',
                                                city: ''
                                            })
                                            setIsAddingAddress(false)
                                        }}
                                        className='px-6 py-[11px] font-medium border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition'
                                    >
                                        {t('COMMON.USER.CANCEL')}
                                    </button>
                                    <button
                                        disabled={isCreateLoading || isUpdateLoading || isFetching}
                                        onClick={() => {
                                            if (isAddingAddress) {
                                                handleCreateAddress(editingAddress)
                                            } else {
                                                handleUpdateAddress(editingAddress.id, {
                                                    recipient: editingAddress.recipient,
                                                    phone: editingAddress.phone,
                                                    email: editingAddress.email,
                                                    title: editingAddress.title,
                                                    address: editingAddress.address,
                                                    district: editingAddress.district,
                                                    city: editingAddress.city,
                                                    isDefault: editingAddress.isDefault
                                                })
                                            }
                                        }}
                                        className='px-6 py-[11px] font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center'
                                    >
                                        {isCreateLoading || isUpdateLoading || isFetching ? (
                                            <Loader2 size={16} className='mr-2 animate-spin' />
                                        ) : (
                                            <Save size={16} className='mr-2' />
                                        )}
                                        {t('COMMON.USER.SAVE')}
                                    </button>
                                </div>
                            </div>
                        ) : shippingAddress.length > 0 ? (
                            <div className='p-6 space-y-6 overflow-y-auto'>
                                {shippingAddress.map(address => (
                                    <div key={address.id} className='bg-gray-50 rounded-[15px] relative'>
                                        <div className='p-6 space-y-3.5'>
                                            <div className='flex items-start'>
                                                <div className='min-w-[140px] text-gray-500'>
                                                    {t('COMMON.USER.RECIPIENT')}
                                                </div>
                                                <div className='font-medium text-gray-900 flex items-center'>
                                                    <User2 className='w-4 h-4 text-blue-600 mr-3' />
                                                    {address.recipient}
                                                </div>
                                            </div>

                                            <div className='flex items-start'>
                                                <div className='min-w-[140px] text-gray-500'>
                                                    {t('COMMON.USER.PHONE')}
                                                </div>
                                                <div className='font-medium text-gray-900 flex items-center'>
                                                    <PhoneCall className='w-4 h-4 text-blue-600 mr-3' />
                                                    {address.phone}
                                                </div>
                                            </div>

                                            <div className='flex items-start'>
                                                <div className='min-w-[140px] text-gray-500'>
                                                    {t('COMMON.USER.ADDRESS_TITLE')}
                                                </div>
                                                <div className='font-medium text-gray-900 flex items-center'>
                                                    <Building className='w-4 h-4 text-blue-600 mr-3' />
                                                    {address.title}
                                                </div>
                                            </div>

                                            <div className='flex items-start'>
                                                <div className='min-w-[140px] text-gray-500'>
                                                    {t('COMMON.USER.EMAIL')}
                                                </div>
                                                <div className='font-medium text-gray-900 flex items-center'>
                                                    <Mail className='w-4 h-4 text-blue-600 mr-3' />
                                                    {address.email}
                                                </div>
                                            </div>

                                            <div className='flex items-start'>
                                                <div className='min-w-[140px] text-gray-500'>
                                                    {t('COMMON.USER.ADDRESS')}
                                                </div>
                                                <div className=''>
                                                    <p className='font-medium text-gray-900 flex items-center'>
                                                        <House className='w-4 h-4 text-blue-600 mr-3' />
                                                        {address.address}, {address.district}, {address.city}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='flex space-x-4 absolute right-6 top-6'>
                                            {!address.isDefault ? (
                                                <button
                                                    onClick={() => handleSetDefaultAddress(address.id)}
                                                    disabled={
                                                        isFetching ||
                                                        (isChangeDefaultLoading && address.id === originalArgs)
                                                    }
                                                    className='p-2 bg-green-50 rounded-full text-green-600 hover:bg-green-100 transition-colors'
                                                    title={t('COMMON.USER.SET_AS_DEFAULT')}
                                                >
                                                    {isFetching ||
                                                    (isChangeDefaultLoading && address.id === originalArgs) ? (
                                                        <Loader2 size={18} className='animate-spin' />
                                                    ) : (
                                                        <CheckCircle size={18} />
                                                    )}
                                                </button>
                                            ) : (
                                                <span className='px-3 flex items-center bg-green-50 text-green-600 text-sm font-medium rounded-full'>
                                                    {t('COMMON.USER.DEFAULT')}
                                                </span>
                                            )}

                                            <button
                                                onClick={() => setEditingAddress({ ...address })}
                                                className='p-2 bg-blue-50 rounded-full text-blue-600 hover:bg-blue-100 transition-colors'
                                                title={t('COMMON.USER.EDIT')}
                                            >
                                                <Edit size={18} />
                                            </button>

                                            <button
                                                onClick={() => handleDeleteAddress(address.id)}
                                                className='p-2 bg-red-50 rounded-full text-red-600 hover:bg-red-100 transition-colors'
                                                title={t('COMMON.USER.DELETE')}
                                            >
                                                {isDeleteLoading && address.id === originalDeleteArgs ? (
                                                    <Loader2 size={18} className='animate-spin' />
                                                ) : (
                                                    <Trash2 size={18} />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className='p-6 text-center text-gray-500'>
                                <div className='mb-6 inline-flex mb-4 p-4 bg-blue-50 rounded-full'>
                                    <MapPin className='mx-auto w-10 h-10 text-blue-600' />
                                </div>
                                <p>{t('COMMON.USER.NO_ADDRESSES')}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
