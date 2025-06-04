'use client'

import { useEffect, useState } from 'react'
import { MapPin, Edit, User2, PhoneCall, Mail, House, Building, CheckCircle, Trash2, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface AddressManagerProps {
    isOpen: boolean
    onClose: () => void
}

export default function AddressManager({ isOpen, onClose }: AddressManagerProps) {
    const { t } = useTranslation('common')

    const [userData, setUserData] = useState({
        addresses: [
            {
                id: 1,
                title: 'Nhà riêng',
                fullName: 'Nguyễn Văn A',
                phone: '0987654321',
                email: 'nguyenvana@example.com',
                address: '123 Đường ABC',
                district: 'Quận 1',
                city: 'TP. Hồ Chí Minh',
                isDefault: true
            },
            {
                id: 2,
                title: 'Văn phòng',
                fullName: 'Nguyễn Văn A',
                phone: '0987654322',
                email: 'nguyenvana@example.com',
                address: '456 Đường XYZ',
                district: 'Quận 7',
                city: 'TP. Hồ Chí Minh',
                isDefault: false
            }
        ]
    })

    const [editingAddress, setEditingAddress] = useState<AddressType | null>(null)
    const [isAddingAddress, setIsAddingAddress] = useState(false)
    const [formErrors, setFormErrors] = useState({
        fullName: '',
        phone: '',
        title: '',
        email: '',
        address: '',
        district: '',
        city: ''
    })

    const [notification, setNotification] = useState({
        show: false,
        type: '',
        message: ''
    })
    useEffect(() => {}, [notification])

    type AddressType = {
        id?: number
        fullName: string
        phone: string
        email: string
        title: string
        address: string
        district: string
        city: string
        isDefault: boolean
    }

    // Hiển thị thông báo
    const showNotification = (type: string, message: string) => {
        setNotification({
            show: true,
            type,
            message
        })

        // Ẩn thông báo sau 3 giây
        setTimeout(() => {
            setNotification({ show: false, type: '', message: '' })
        }, 3000)
    }

    // Xử lý lưu địa chỉ
    const handleSaveAddress = (address: AddressType) => {
        if (isAddingAddress) {
            const newAddress = {
                ...address,
                id: userData.addresses.length + 1
            }

            const addresses = [...userData.addresses, newAddress]

            setUserData({
                ...userData,
                addresses: [...userData.addresses, newAddress]
            })

            if (newAddress.isDefault) {
                setUserData({
                    ...userData,
                    addresses: addresses.map(addr => ({
                        ...addr,
                        isDefault: addr.id === newAddress.id
                    }))
                })
            } else {
                setUserData({
                    ...userData,
                    addresses: addresses
                })
            }

            showNotification('success', 'Địa chỉ đã được thêm thành công')
        } else {
            if (!address.id) return

            const addresses = userData.addresses.map(addr =>
                addr.id === address.id ? { ...address, id: address.id ?? addr.id } : addr
            )

            if (address.isDefault) {
                setUserData({
                    ...userData,
                    addresses: addresses.map(addr => ({
                        ...addr,
                        isDefault: addr.id === address.id
                    }))
                })
            } else {
                setUserData({
                    ...userData,
                    addresses: addresses
                })
            }

            showNotification('success', 'Địa chỉ đã được cập nhật thành công')
        }

        setEditingAddress(null)
        setIsAddingAddress(false)
    }

    // Xử lý xóa địa chỉ
    const handleDeleteAddress = (id: number) => {
        setUserData({
            ...userData,
            addresses: userData.addresses.filter(addr => addr.id !== id)
        })

        showNotification('success', 'Địa chỉ đã được xóa thành công')
    }

    const handleSetDefaultAddress = (id: number) => {
        setUserData({
            ...userData,
            addresses: userData.addresses.map(addr => ({
                ...addr,
                isDefault: addr.id === id
            }))
        })

        showNotification('success', 'Đã đặt địa chỉ mặc định')
    }

    const closeModal = () => {
        onClose()
        setEditingAddress(null)
        setIsAddingAddress(false)
        setFormErrors({
            fullName: '',
            phone: '',
            email: '',
            title: '',
            address: '',
            district: '',
            city: ''
        })
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
                                    {userData.addresses.length}
                                </span>
                            </h2>

                            <div className='flex space-x-4 items-center'>
                                <button
                                    onClick={() => {
                                        setIsAddingAddress(true)
                                        setEditingAddress({
                                            title: '',
                                            fullName: '',
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
                                                value={editingAddress.fullName}
                                                onChange={e =>
                                                    setEditingAddress({ ...editingAddress, fullName: e.target.value })
                                                }
                                                className={`w-full border ${
                                                    formErrors.fullName ? 'border-red-500' : 'border-gray-300'
                                                } rounded-lg pl-4 pr-10 py-3 focus:ring-blue-500 focus:border-blue-500 outline-none`}
                                                placeholder={t('COMMON.USER.ENTER_FULL_NAME')}
                                            />
                                            <User2 className='w-5 h-5 text-blue-600 absolute right-3 top-1/2 transform -translate-y-1/2' />
                                        </div>
                                        {formErrors.fullName && (
                                            <p className='mt-1 text-sm text-red-600'>{formErrors.fullName}</p>
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
                                                fullName: '',
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
                                        onClick={() => handleSaveAddress(editingAddress)}
                                        className='px-6 py-[11px] font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition'
                                    >
                                        {t('COMMON.USER.SAVE')}
                                    </button>
                                </div>
                            </div>
                        ) : userData.addresses.length > 0 ? (
                            <div className='p-6 space-y-6 overflow-y-auto '>
                                {userData.addresses.map(address => (
                                    <div key={address.id} className='bg-gray-50 rounded-[15px] relative'>
                                        <div className='p-6 space-y-3.5'>
                                            <div className='flex items-start'>
                                                <div className='min-w-[140px] text-gray-500'>
                                                    {t('COMMON.USER.RECIPIENT')}
                                                </div>
                                                <div className='font-medium text-gray-900 flex items-center'>
                                                    <User2 className='w-4 h-4 text-blue-600 mr-3' />
                                                    {address.fullName}
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
                                                    className='p-2 bg-green-50 rounded-full text-green-600 hover:bg-green-100 transition-colors'
                                                    title={t('COMMON.USER.SET_AS_DEFAULT')}
                                                >
                                                    <CheckCircle size={18} />
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
                                                <Trash2 size={18} />
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
