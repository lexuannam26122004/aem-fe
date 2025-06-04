import { Typography } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { clearUserInfo, userSelector } from '@/redux/slices/userSlice'
import { User, ShoppingBag, FolderOpen, LogOut } from 'lucide-react'

const UserAvatarMenu = () => {
    const router = useRouter()
    const dropdownRef = useRef<HTMLDivElement | null>(null)
    const [isOpen, setIsOpen] = useState(false)
    const dispatch = useDispatch()

    const user = useSelector(userSelector)

    const avatarPath = user.userInfo.avatar || '/images/account.png'
    const fullName = user.userInfo.fullName

    const toggleDropdown = () => {
        setIsOpen(prev => !prev)
    }

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    // Close dropdown on Escape key
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false)
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [])

    const handleAccount = () => {
        setIsOpen(false)
        router.push('/user/profile')
    }

    const handleOrders = () => {
        setIsOpen(false)
        router.push('/user/orders')
    }

    const handleProjects = () => {
        setIsOpen(false)
        router.push('/user/projects')
    }

    const handleLogout = () => {
        router.push('/login')
        sessionStorage.removeItem('auth_token')
        dispatch(clearUserInfo())
    }

    const menuItems = [
        {
            id: 'account',
            label: 'Tài khoản',
            icon: <User className='w-5 h-5' />,
            onClick: handleAccount,
            isDivider: false
        },
        {
            id: 'orders',
            label: 'Đơn hàng',
            icon: <ShoppingBag className='w-5 h-5' />,
            onClick: handleOrders,
            isDivider: false
        },
        {
            id: 'projects',
            label: 'Dự án cá nhân',
            icon: <FolderOpen className='w-5 h-5' />,
            onClick: handleProjects,
            isDivider: true
        },
        {
            id: 'logout',
            label: 'Đăng xuất',
            icon: <LogOut className='w-5 h-5' />,
            onClick: handleLogout,
            isDivider: false,
            isLogout: true
        }
    ]

    return (
        <div className='w-full'>
            <div className='relative' ref={dropdownRef}>
                <div
                    onClick={toggleDropdown}
                    className={`cursor-pointer flex items-center justify-center select-none gap-3.5 px-2 py-1.5 rounded-[10px] transition-all duration-200 ${
                        isOpen ? 'bg-blue-50' : 'hover:bg-blue-50'
                    }`}
                >
                    <div className='relative flex items-center justify-center w-[42px] h-[42px] rounded-full overflow-hidden'>
                        <span className='absolute inset-0 bg-gradient-to-r from-[#ffc41f] to-[#3675ff] rounded-full animate-spin [animation-duration:5s] z-0' />
                        <span className='absolute inset-[1.5px] bg-white rounded-full z-2' />
                        <img
                            src={avatarPath || '/images/account.png'}
                            alt={fullName}
                            className='w-[37px] h-[37px] rounded-full object-cover relative z-10'
                        />
                    </div>

                    {/* User name */}
                    <div className='flex-1'>
                        <Typography
                            variant='subtitle2'
                            sx={{
                                fontWeight: 600,
                                fontSize: '14px',
                                color: 'var(--text-color)'
                            }}
                        >
                            {fullName}
                        </Typography>
                    </div>

                    {/* Chevron icon */}
                    <div className='w-5 h-5 flex items-center justify-center border border-blue-200 rounded-full p-0.5 text-blue-600'>
                        <ChevronDown
                            className={`w-3 h-3 transition-transform duration-200 ${
                                isOpen ? 'transform rotate-180' : ''
                            }`}
                        />
                    </div>
                </div>

                {/* Dropdown menu */}
                {isOpen && (
                    <div
                        className='absolute top-full right-0 mt-2 min-w-48 bg-white border border-blue-100 rounded-xl shadow-lg z-50 overflow-hidden'
                        style={{
                            animation: 'fadeIn 100ms ease-out'
                        }}
                    >
                        <div className='p-2'>
                            {menuItems.map((item, index) => (
                                <div key={item.id}>
                                    <div
                                        onClick={item.onClick}
                                        className={`px-3 py-3 rounded-lg flex items-center cursor-pointer transition-all duration-200 group ${
                                            item.isLogout
                                                ? 'text-red-500 hover:bg-red-50 hover:text-red-600'
                                                : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                                        }`}
                                    >
                                        <span
                                            className={`mr-3 transition-colors duration-200 ${
                                                item.isLogout
                                                    ? 'text-red-500 group-hover:text-red-600'
                                                    : 'text-blue-500 group-hover:text-blue-600'
                                            }`}
                                        >
                                            {item.icon}
                                        </span>
                                        <span className='font-medium text-sm'>{item.label}</span>
                                    </div>
                                    {item.isDivider && index < menuItems.length - 1 && (
                                        <hr className='my-2 border-gray-100' />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Add fadeIn animation */}
            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-8px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    )
}

export default UserAvatarMenu
