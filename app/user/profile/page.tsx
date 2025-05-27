'use client'

import { useEffect, useRef, useState } from 'react'
import {
    User,
    MapPin,
    Lock,
    Settings,
    LogOut,
    ChevronRight,
    Edit,
    Trash2,
    Eye,
    EyeOff,
    Save,
    AlertCircle,
    CheckCircle,
    House,
    User2,
    PhoneCall,
    Mail,
    Building
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import GetStyleCustomer from '@/components/GetStyleCustomer'
import { useToast } from '@/hooks/useToast'

const customerData = {
    id: 'C00123',
    fullName: 'Nguyễn Văn An',
    email: 'vannguyen@gmail.com',
    phone: '0912345678',
    rank: 'new_customer',
    company: 'Công ty TNHH Tự động hóa Việt Nam',
    taxCode: '0123456789',
    avatar: 'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-22.webp',
    addresses: [
        {
            id: 1,
            fullName: 'Nguyễn Văn An',
            phone: '0912345678',
            email: 'nguyenvanan@gmail.com',
            title: 'Văn phòng công ty',
            address: 'Số 123 Đường Lê Lợi, Phường Bến Nghé',
            district: 'Quận 1',
            city: 'TP. Hồ Chí Minh',
            isDefault: true
        },
        {
            id: 2,
            fullName: 'Lê Xuân Nam',
            phone: '0912345678',
            email: 'lexuannam@gmail.com',
            title: 'Kho hàng',
            address: 'Số 45 Đường Nguyễn Thị Minh Khai, Phường 5',
            district: 'Quận 3',
            city: 'TP. Hồ Chí Minh',
            isDefault: false
        }
    ]
}

export default function UserProfileComponent() {
    const { t } = useTranslation('common')
    const toast = useToast()
    const router = useRouter()
    const [confirmDelete, setConfirmDelete] = useState(false)
    const [fileImage, setFileImage] = useState<File | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [userData, setUserData] = useState(customerData)
    const [editingUser, setEditingUser] = useState({
        fullName: userData.fullName,
        avatar: userData.avatar,
        email: userData.email,
        phone: userData.phone,
        taxCode: userData.taxCode,
        company: userData.company
    })
    useEffect(() => {}, [fileImage])

    const handleClickBox = () => {
        if (!fileInputRef?.current) {
            return
        }
        fileInputRef.current.click()
    }

    const handleDeleteImage = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
        setEditingUser({ ...editingUser, avatar: '' })
        setFileImage(null)
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0]

        if (!file) {
            return
        }

        const allowedTypes = ['.jpg', '.jpeg', '.png']
        const fileType = file.name.split('.').pop()?.toLowerCase()

        if (!allowedTypes.includes('.' + fileType)) {
            toast(t('COMMON.INVALID_FILE_TYPE') + { fileType }, 'error')
            return
        }

        const fileSize = file.size / 1024 / 1024
        if (fileSize > 3) {
            toast(t('COMMON.INVALID_FILE_SIZE'), 'error')
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
                setEditingUser({ ...editingUser, avatar: '' })
                setFileImage(null)
            }
            return
        }

        const reader = new FileReader()

        reader.onloadend = () => {
            setEditingUser({ ...editingUser, avatar: reader.result as string })
        }

        reader.readAsDataURL(file)
        setFileImage(file)
    }

    // State cho tab đang được chọn
    const [activeTab, setActiveTab] = useState('profile')

    // State cho chế độ chỉnh sửa
    const [isEditing, setIsEditing] = useState(false)

    // State cho thông tin cá nhân

    // State cho form đổi mật khẩu
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    // State hiển thị mật khẩu
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false
    })

    // State cho thông báo
    const [notification, setNotification] = useState({
        show: false,
        type: '',
        message: ''
    })

    // State cho xác nhận xóa tài khoản
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    // State cho địa chỉ đang chỉnh sửa hoặc thêm mới
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
    const [editingAddress, setEditingAddress] = useState<AddressType | null>(null)
    const [isAddingAddress, setIsAddingAddress] = useState(false)

    const [formErrors, setFormErrors] = useState({
        fullName: '',
        phone: '',
        email: '',
        address: '',
        district: '',
        city: ''
    })

    // Xử lý chuyển tab
    const handleTabChange = (tab: string) => {
        setActiveTab(tab)
        setIsEditing(false)
        setShowDeleteConfirm(false)
        setNotification({ show: false, type: '', message: '' })
    }

    // Xử lý lưu thông tin cá nhân
    const handleSaveProfile = () => {
        setUserData({
            ...userData,
            fullName: editingUser.fullName,
            email: editingUser.email,
            phone: editingUser.phone,
            taxCode: editingUser.taxCode,
            company: editingUser.company,
            avatar: editingUser.avatar
        })
        setIsEditing(false)
        showNotification('success', 'Thông tin cá nhân đã được cập nhật thành công')
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

    // Xử lý đổi mật khẩu
    const handleChangePassword = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        // Kiểm tra mật khẩu mới và xác nhận mật khẩu
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            showNotification('error', 'Mật khẩu mới và xác nhận mật khẩu không khớp')
            return
        }

        // Xử lý API call để đổi mật khẩu
        showNotification('success', 'Mật khẩu đã được thay đổi thành công')
        setPasswordForm({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        })
    }

    // Xử lý xóa tài khoản
    const handleDeleteAccount = () => {
        if (confirmDelete) {
            router.push('/auth/login')
            showNotification('success', 'Tài khoản đã được xóa thành công')
        }
        showNotification('error', 'Vui lòng xác nhận trước khi xóa tài khoản')
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

    // Xử lý đặt địa chỉ mặc định
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

    // Render các tab
    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return renderProfileContent()
            case 'addresses':
                return renderAddressesContent()
            case 'password':
                return renderPasswordContent()
            case 'delete':
                return renderDeleteAccountContent()
            default:
                return renderProfileContent()
        }
    }

    // Render nội dung tab thông tin cá nhân
    const renderProfileContent = () => {
        return (
            <div className='bg-white rounded-[15px] shadow-[0_4px_16px_rgba(0,0,0,0.1)] overflow-hidden'>
                <div className='px-6 border-b flex items-center justify-between border-gray-100 h-[66px]'>
                    <h2 className='font-bold text-[18px] text-gray-800 flex items-center'>
                        <User size={20} className='w-5 h-5 text-blue-600 mr-3' color='#3675ff' />
                        {t('COMMON.USER.PERSONAL_INFORMATION')}
                    </h2>

                    {!isEditing && (
                        <button
                            onClick={() => {
                                setEditingUser({
                                    fullName: userData.fullName,
                                    email: userData.email,
                                    phone: userData.phone,
                                    avatar: userData.avatar,
                                    taxCode: userData.taxCode,
                                    company: userData.company
                                })
                                setIsEditing(true)
                            }}
                            className='text-blue-600 hover:text-blue-800 flex items-center font-medium px-4 py-2 rounded-[8px] hover:bg-blue-50'
                        >
                            <Edit size={16} className='mr-2' />
                            {t('COMMON.USER.EDIT')}
                        </button>
                    )}
                </div>

                <div className='p-6'>
                    <div className='flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6'>
                        <div className='md:w-1/3 flex flex-col items-center overflow-hidden'>
                            <div className='relative'>
                                <div className='relative flex items-center justify-center w-[132px] h-[132px] rounded-full overflow-hidden'>
                                    <span className='absolute inset-0 bg-gradient-to-r from-[#ffc41f] to-[#3675ff] rounded-full animate-spin [animation-duration:5s] z-0' />
                                    <span className='absolute inset-[3px] bg-white rounded-full z-2' />
                                    <img
                                        src={editingUser.avatar || '/images/account.png'}
                                        alt={userData.fullName}
                                        className='w-[121px] h-[121px] rounded-full object-cover relative z-10'
                                    />
                                </div>

                                {isEditing && (
                                    <button
                                        className='absolute bottom-0 z-20 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors'
                                        onClick={handleClickBox}
                                    >
                                        <Edit size={16} />
                                        <input
                                            type='file'
                                            accept='.jpg, .jpeg, .png'
                                            style={{ display: 'none' }}
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                        />
                                    </button>
                                )}
                            </div>

                            <h3 className='font-bold text-lg text-center my-5'>{userData.fullName}</h3>

                            <GetStyleCustomer
                                customerRank={userData.rank}
                                padding='10px 18px'
                                fontSize='15px'
                                iconSize={24}
                            />

                            {isEditing && editingUser.avatar && (
                                <div
                                    onClick={handleDeleteImage}
                                    className='flex items-center gap-2 px-2.5 mt-5 py-1.5 rounded-[8px] border border-[--text-color-button-cancel] hover:cursor-pointer hover:border-[--background-color-button-cancel-hover] hover:bg-[--background-color-button-cancel-hover]'
                                >
                                    <Trash2 size={17} color='var(--text-color-button-cancel)' />
                                    <span className='text-[14px] text-[--text-color-button-cancel] font-bold text-center'>
                                        {t('COMMON.REMOVE_IMAGE')}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className='md:w-2/3 space-y-4'>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                        {t('COMMON.USER.FULL_NAME')}
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type='text'
                                            value={editingUser.fullName}
                                            onChange={e => setEditingUser({ ...editingUser, fullName: e.target.value })}
                                            className='w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500'
                                        />
                                    ) : (
                                        <p className='p-3 bg-gray-50 rounded-lg overflow-hidden'>{userData.fullName}</p>
                                    )}
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                        {t('COMMON.USER.EMAIL')}
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type='email'
                                            value={editingUser.email}
                                            onChange={e => setEditingUser({ ...editingUser, email: e.target.value })}
                                            className='w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500'
                                        />
                                    ) : (
                                        <p className='p-3 bg-gray-50 rounded-lg overflow-hidden'>{userData.email}</p>
                                    )}
                                </div>
                            </div>

                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                        {t('COMMON.USER.PHONE_NUMBER')}
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type='tel'
                                            value={editingUser.phone}
                                            onChange={e => setEditingUser({ ...editingUser, phone: e.target.value })}
                                            className='w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500'
                                        />
                                    ) : (
                                        <p className='p-3 bg-gray-50 rounded-lg overflow-hidden'>{userData.phone}</p>
                                    )}
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                        {t('COMMON.USER.TAX_CODE')}
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type='text'
                                            value={editingUser.taxCode}
                                            onChange={e => setEditingUser({ ...editingUser, taxCode: e.target.value })}
                                            className='w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500'
                                        />
                                    ) : (
                                        <p className='p-3 bg-gray-50 rounded-lg overflow-hidden'>{userData.taxCode}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>
                                    {t('COMMON.USER.COMPANY_NAME')}
                                </label>
                                {isEditing ? (
                                    <input
                                        type='text'
                                        value={editingUser.company}
                                        onChange={e => setEditingUser({ ...editingUser, company: e.target.value })}
                                        className='w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500'
                                    />
                                ) : (
                                    <p className='p-3 bg-gray-50 rounded-lg overflow-hidden'>{userData.company}</p>
                                )}
                            </div>

                            {isEditing && (
                                <div className='flex justify-end space-x-6 pt-2'>
                                    <button
                                        onClick={() => {
                                            setIsEditing(false)
                                            setEditingUser({
                                                ...editingUser,
                                                avatar: userData.avatar
                                            })
                                        }}
                                        className='px-6 py-[11px] font-medium border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition'
                                    >
                                        {t('COMMON.USER.CANCEL')}
                                    </button>
                                    <button
                                        onClick={handleSaveProfile}
                                        className='px-6 py-[11px] font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center'
                                    >
                                        <Save size={16} className='mr-2' />
                                        {t('COMMON.USER.SAVE')}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Render nội dung tab địa chỉ
    const renderAddressesContent = () => {
        return (
            <div className='bg-white rounded-[15px] shadow-[0_4px_16px_rgba(0,0,0,0.1)] overflow-hidden'>
                <div className='px-6 border-b flex items-center justify-between border-gray-100 h-[66px]'>
                    <h2 className='font-bold text-[18px] text-gray-800 flex items-center'>
                        <MapPin size={20} className='w-5 h-5 text-blue-600 mr-3' color='#3675ff' />
                        {t('COMMON.USER.DELIVERY_ADDRESSES')}
                        <span className='ml-3 px-2 py-0.5 bg-blue-100 text-blue-700 text-sm rounded-full'>
                            {userData.addresses.length}
                        </span>
                    </h2>

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
                </div>

                {editingAddress ? (
                    <div className='space-y-4 p-6'>
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
                                        onChange={e => setEditingAddress({ ...editingAddress, phone: e.target.value })}
                                        className={`w-full border ${
                                            formErrors.phone ? 'border-red-500' : 'border-gray-300'
                                        } rounded-lg pl-4 pr-10 py-3 focus:ring-blue-500 focus:border-blue-500 outline-none`}
                                        placeholder={t('COMMON.USER.ENTER_PHONE')}
                                    />
                                    <PhoneCall className='w-5 h-5 text-blue-600 absolute right-3 top-1/2 transform -translate-y-1/2' />
                                </div>
                                {formErrors.phone && <p className='mt-1 text-sm text-red-600'>{formErrors.phone}</p>}
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
                                        onChange={e => setEditingAddress({ ...editingAddress, email: e.target.value })}
                                        className={`w-full border ${
                                            formErrors.email ? 'border-red-500' : 'border-gray-300'
                                        } rounded-lg pl-4 pr-10 py-3 focus:ring-blue-500 focus:border-blue-500 outline-none`}
                                        placeholder={t('COMMON.USER.ENTER_EMAIL')}
                                    />
                                    <Mail className='w-5 h-5 text-blue-600 absolute right-3 top-1/2 transform -translate-y-1/2' />
                                </div>
                                {formErrors.email && <p className='mt-1 text-sm text-red-600'>{formErrors.email}</p>}
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>
                                    {t('COMMON.USER.ADDRESS_TITLE')}
                                </label>
                                <input
                                    type='text'
                                    value={editingAddress.title}
                                    onChange={e => setEditingAddress({ ...editingAddress, title: e.target.value })}
                                    className='w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500'
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
                                    onChange={e => setEditingAddress({ ...editingAddress, district: e.target.value })}
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
                                    onChange={e => setEditingAddress({ ...editingAddress, city: e.target.value })}
                                    className={`w-full border ${
                                        formErrors.city ? 'border-red-500' : 'border-gray-300'
                                    } rounded-lg px-4 py-3 focus:ring-blue-500 focus:border-blue-500 outline-none`}
                                    placeholder={t('COMMON.USER.ENTER_CITY')}
                                />
                                {formErrors.city && <p className='mt-1 text-sm text-red-600'>{formErrors.city}</p>}
                            </div>

                            <div>
                                <label className='flex items-center cursor-pointer md:mt-6 w-fit'>
                                    <input
                                        type='checkbox'
                                        checked={editingAddress.isDefault}
                                        onChange={e =>
                                            setEditingAddress({ ...editingAddress, isDefault: e.target.checked })
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
                                className='px-6 py-[11px] font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center'
                            >
                                <Save size={16} className='mr-2' />
                                {t('COMMON.USER.SAVE')}
                            </button>
                        </div>
                    </div>
                ) : userData.addresses.length > 0 ? (
                    <div className='p-6 space-y-6'>
                        {userData.addresses.map(address => (
                            <div key={address.id} className='bg-gray-50 rounded-[15px] relative'>
                                <div className='p-6 space-y-3.5'>
                                    <div className='flex items-start'>
                                        <div className='min-w-[140px] text-gray-500'>{t('COMMON.USER.RECIPIENT')}</div>
                                        <div className='font-medium text-gray-900 flex items-center'>
                                            <User2 className='w-4 h-4 text-blue-600 mr-3' />
                                            {address.fullName}
                                        </div>
                                    </div>

                                    <div className='flex items-start'>
                                        <div className='min-w-[140px] text-gray-500'>{t('COMMON.USER.PHONE')}</div>
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
                                        <div className='min-w-[140px] text-gray-500'>{t('COMMON.USER.EMAIL')}</div>
                                        <div className='font-medium text-gray-900 flex items-center'>
                                            <Mail className='w-4 h-4 text-blue-600 mr-3' />
                                            {address.email}
                                        </div>
                                    </div>

                                    <div className='flex items-start'>
                                        <div className='min-w-[140px] text-gray-500'>{t('COMMON.USER.ADDRESS')}</div>
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
        )
    }

    const renderPasswordContent = () => {
        return (
            <div className='bg-white rounded-[15px] shadow-[0_4px_16px_rgba(0,0,0,0.1)] overflow-hidden'>
                <div className='px-6 border-b flex items-center border-gray-100 h-[66px]'>
                    <h2 className='font-bold text-[18px] text-gray-800 flex items-center'>
                        <Lock size={20} className='w-5 h-5 text-blue-600 mr-3' color='#3675ff' />
                        {t('COMMON.USER.CHANGE_PASSWORD')}
                    </h2>
                </div>

                <div className='p-6'>
                    <form onSubmit={handleChangePassword}>
                        <div className='space-y-4 max-w-lg'>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>
                                    {t('COMMON.USER.CURRENT_PASSWORD')}
                                </label>
                                <div className='relative'>
                                    <input
                                        type={showPassword.current ? 'text' : 'password'}
                                        value={passwordForm.currentPassword}
                                        onChange={e =>
                                            setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                                        }
                                        className='w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 pr-10'
                                        required
                                    />
                                    <button
                                        type='button'
                                        className='absolute right-3 top-4 text-gray-500'
                                        onClick={() =>
                                            setShowPassword({ ...showPassword, current: !showPassword.current })
                                        }
                                    >
                                        {showPassword.current ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>
                                    {t('COMMON.USER.NEW_PASSWORD')}
                                </label>
                                <div className='relative'>
                                    <input
                                        type={showPassword.new ? 'text' : 'password'}
                                        value={passwordForm.newPassword}
                                        onChange={e =>
                                            setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                                        }
                                        className='w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 pr-10'
                                        required
                                        minLength={8}
                                    />
                                    <button
                                        type='button'
                                        className='absolute right-3 top-4 text-gray-500'
                                        onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                                    >
                                        {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                <p className='text-sm text-gray-500 mt-1'>{t('COMMON.USER.PASSWORD_REQUIREMENTS')}</p>
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>
                                    {t('COMMON.USER.CONFIRM_PASSWORD')}
                                </label>
                                <div className='relative'>
                                    <input
                                        type={showPassword.confirm ? 'text' : 'password'}
                                        value={passwordForm.confirmPassword}
                                        onChange={e =>
                                            setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                                        }
                                        className='w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 pr-10'
                                        required
                                    />
                                    <button
                                        type='button'
                                        className='absolute right-3 top-4 text-gray-500'
                                        onClick={() =>
                                            setShowPassword({ ...showPassword, confirm: !showPassword.confirm })
                                        }
                                    >
                                        {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className='pt-2'>
                                <button
                                    type='submit'
                                    className='px-6 py-3 font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full md:w-auto'
                                >
                                    {t('COMMON.USER.UPDATE_PASSWORD')}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }

    // Render nội dung tab xóa tài khoản
    const renderDeleteAccountContent = () => {
        return (
            <div className='bg-white rounded-[15px] shadow-[0_4px_16px_rgba(0,0,0,0.1)] overflow-hidden'>
                <div className='px-6 border-b flex items-center border-gray-100 h-[66px]'>
                    <h2 className='font-bold text-[18px] text-gray-800 flex items-center'>
                        <Trash2 size={20} className='w-5 h-5 text-red-600 mr-3' color='#DC2626' />
                        {t('COMMON.USER.DELETE_ACCOUNT')}
                    </h2>
                </div>

                <div className='p-6'>
                    {!showDeleteConfirm ? (
                        <div>
                            <div className='bg-red-50 border border-red-100 rounded-[12px] p-6 mb-6'>
                                <h3 className='text-red-600 font-medium text-lg mb-3'>
                                    {t('COMMON.USER.DELETE_ACCOUNT_WARNING')}
                                </h3>
                                <p className='text-gray-700'>{t('COMMON.USER.DELETE_ACCOUNT_DESCRIPTION')}</p>
                                <ul className='list-disc list-inside text-gray-700 mt-3 space-y-1'>
                                    <li>{t('COMMON.USER.DELETE_ACCOUNT_POINT_1')}</li>
                                    <li>{t('COMMON.USER.DELETE_ACCOUNT_POINT_2')}</li>
                                    <li>{t('COMMON.USER.DELETE_ACCOUNT_POINT_3')}</li>
                                </ul>
                            </div>

                            <div className='flex justify-end'>
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className='px-6 py-3 bg-red-600 font-medium text-white rounded-lg hover:bg-red-700 transition-colors'
                                >
                                    {t('COMMON.USER.PROCEED_TO_DELETE')}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className='bg-red-50 border border-red-100 rounded-[12px] p-6 mb-6'>
                                <h3 className='text-red-700 font-medium text-lg mb-3'>
                                    {t('COMMON.USER.CONFIRM_DELETE')}
                                </h3>
                                <p className='text-gray-700'>{t('COMMON.USER.CONFIRM_DELETE_DESCRIPTION')}</p>

                                <div className='mt-4'>
                                    <label className='flex items-center'>
                                        <input
                                            type='checkbox'
                                            checked={confirmDelete}
                                            onChange={e => setConfirmDelete(e.target.checked)}
                                            className='w-4 h-4 rounded-[10px] border-[#d1e0ff] accent-[#3675ff] rounded focus:ring-red-500'
                                        />
                                        <span className='ml-2 text-sm text-gray-700'>
                                            {t('COMMON.USER.CONFIRM_UNDERSTOOD')}
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <div className='flex justify-end space-x-4 mt-6'>
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className='px-4 py-2 bg-white font-medium border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
                                >
                                    {t('COMMON.USER.CANCEL')}
                                </button>

                                <button
                                    onClick={handleDeleteAccount}
                                    className='px-4 py-2 bg-red-600 font-medium text-white rounded-lg hover:bg-red-700 transition-colors'
                                >
                                    {t('COMMON.USER.DELETE_PERMANENTLY')}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    // Render thông báo
    const renderNotification = () => {
        if (!notification.show) return null

        return (
            <div
                className={`fixed bottom-6 right-6 p-4 rounded-lg shadow-lg flex items-center ${
                    notification.type === 'success'
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-red-50 border border-red-200'
                }`}
            >
                {notification.type === 'success' ? (
                    <CheckCircle className='text-green-600 mr-3' size={20} />
                ) : (
                    <AlertCircle className='text-red-600 mr-3' size={20} />
                )}
                <p className={notification.type === 'success' ? 'text-green-700' : 'text-red-700'}>
                    {notification.message}
                </p>
            </div>
        )
    }

    return (
        <div className='max-w-7xl mx-auto sm:px-6 lg:px-8'>
            <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
                {/* Sidebar */}
                <div className='lg:col-span-1'>
                    <div className='bg-white rounded-[15px] shadow-[0_4px_16px_rgba(0,0,0,0.1)] overflow-hidden'>
                        <div className='px-6 border-b flex items-center border-gray-100 h-[66px]'>
                            <h2 className='font-bold text-[18px] text-gray-800 flex items-center'>
                                <Settings size={20} className='w-5 h-5 text-blue-600 mr-3' color='#3675ff' />
                                {t('COMMON.USER.ACCOUNT_SETTINGS')}
                            </h2>
                        </div>

                        <div className='divide-y divide-gray-100'>
                            <button
                                onClick={() => handleTabChange('profile')}
                                className={`w-full flex items-center justify-between px-6 py-4 hover:bg-blue-50/50 transition-colors ${
                                    activeTab === 'profile' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                                }`}
                            >
                                <div className='flex items-center font-medium'>
                                    <User
                                        size={18}
                                        className={`mr-3 ${
                                            activeTab === 'profile' ? 'text-blue-600' : 'text-gray-500'
                                        }`}
                                    />
                                    <span>{t('COMMON.USER.PERSONAL_INFORMATION')}</span>
                                </div>
                                <ChevronRight
                                    size={18}
                                    className={activeTab === 'profile' ? 'text-blue-600' : 'text-gray-400'}
                                />
                            </button>

                            <button
                                onClick={() => handleTabChange('addresses')}
                                className={`w-full flex items-center justify-between px-6 py-4 hover:bg-blue-50/50 transition-colors ${
                                    activeTab === 'addresses' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                                }`}
                            >
                                <div className='flex items-center font-medium'>
                                    <MapPin
                                        size={18}
                                        className={`mr-3 ${
                                            activeTab === 'addresses' ? 'text-blue-600' : 'text-gray-500'
                                        }`}
                                    />
                                    <span>{t('COMMON.USER.DELIVERY_ADDRESSES')}</span>
                                </div>
                                <ChevronRight
                                    size={18}
                                    className={activeTab === 'addresses' ? 'text-blue-600' : 'text-gray-400'}
                                />
                            </button>

                            <button
                                onClick={() => handleTabChange('password')}
                                className={`w-full flex items-center justify-between px-6 py-4 hover:bg-blue-50/50 transition-colors ${
                                    activeTab === 'password' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                                }`}
                            >
                                <div className='flex items-center font-medium'>
                                    <Lock
                                        size={18}
                                        className={`mr-3 ${
                                            activeTab === 'password' ? 'text-blue-600' : 'text-gray-500'
                                        }`}
                                    />
                                    <span>{t('COMMON.USER.CHANGE_PASSWORD')}</span>
                                </div>
                                <ChevronRight
                                    size={18}
                                    className={activeTab === 'password' ? 'text-blue-600' : 'text-gray-400'}
                                />
                            </button>

                            <button
                                onClick={() => handleTabChange('delete')}
                                className={`w-full flex items-center justify-between px-6 py-4 hover:bg-red-50/50 transition-colors ${
                                    activeTab === 'delete' ? 'bg-red-50 text-red-600' : 'text-gray-700'
                                }`}
                            >
                                <div className='flex items-center font-medium'>
                                    <Trash2
                                        size={18}
                                        className={`mr-3 ${activeTab === 'delete' ? 'text-red-600' : 'text-gray-500'}`}
                                    />
                                    <span>{t('COMMON.USER.DELETE_ACCOUNT')}</span>
                                </div>
                                <ChevronRight
                                    size={18}
                                    className={activeTab === 'delete' ? 'text-red-600' : 'text-gray-400'}
                                />
                            </button>

                            <div className='px-6 py-4'>
                                <button
                                    onClick={() => router.push('/auth/logout')}
                                    className='w-full px-4 py-3 font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center'
                                >
                                    <LogOut size={18} className='mr-2' />
                                    {t('COMMON.USER.LOGOUT')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className='lg:col-span-3'>{renderContent()}</div>
            </div>

            {renderNotification()}
        </div>
    )
}
