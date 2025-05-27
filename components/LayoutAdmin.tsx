import { Box } from '@mui/material'
import Sidebar, { SidebarItem, TypographyItem } from './sidebar'
import { usePathname } from 'next/navigation'
import {
    BarChart2,
    Home,
    ShoppingBag,
    Truck,
    Lock,
    ShieldCheck,
    History,
    Newspaper,
    FileText,
    Tags,
    Package,
    Users,
    UserCog,
    ShoppingCart,
    Ticket,
    Warehouse,
    Settings,
    BarChart4,
    Boxes
} from 'lucide-react'
import Header from './Header'
import { useTranslation } from 'react-i18next'

const LayoutAdmin: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { t } = useTranslation('common')
    const path = usePathname()

    return (
        <Box
            sx={{
                display: 'flex',
                height: '100vh',
                width: '100vw'
            }}
        >
            <Sidebar>
                {/* Dashboard */}
                <TypographyItem text={t('COMMON.SIDEBAR.DASHBOARD')} />
                <SidebarItem
                    icon={<Home size={24} className='transition-all duration-40' />}
                    text={t('COMMON.SIDEBAR.HOME')}
                    active={path === '/admin'}
                    link='/admin'
                />

                {/* Báo cáo & Thống kê */}
                <TypographyItem text={t('COMMON.SIDEBAR.REPORTS_&_ANALYTICS')} />
                <SidebarItem
                    icon={<BarChart4 size={24} className='transition-all duration-40' />}
                    text={t('COMMON.SIDEBAR.REVENUE')}
                    active={path === '/admin/statistics/revenue'}
                    link='/admin/statistics/revenue'
                />
                <SidebarItem
                    icon={<BarChart2 size={24} className='transition-all duration-40' />}
                    text={t('COMMON.SIDEBAR.ORDER_REPORTS')}
                    active={path === '/admin/statistics/order-reports'}
                    link='/admin/statistics/order-reports'
                />
                <SidebarItem
                    icon={<Boxes size={24} className='transition-all duration-40' />}
                    text={t('COMMON.SIDEBAR.INVENTORY_&_PRODUCTS')}
                    active={path === '/admin/statistics/inventory-products'}
                    link='/admin/statistics/inventory-products'
                />
                <SidebarItem
                    icon={<BarChart2 size={24} className='transition-all duration-40' />}
                    text={t('COMMON.SIDEBAR.CUSTOMER_REPORTS')}
                    active={path === '/admin/statistics/customer-reports'}
                    link='/admin/statistics/customer-reports'
                />
                <SidebarItem
                    icon={<BarChart2 size={24} className='transition-all duration-40' />}
                    text={t('COMMON.SIDEBAR.WARRANTY_REPORTS')}
                    active={path === '/admin/statistics/warranty-reports'}
                    link='/admin/statistics/warranty-reports'
                />

                {/* Sản phẩm & Đơn hàng */}
                <TypographyItem text={t('COMMON.SIDEBAR.PRODUCTS_&_ORDERS')} />
                <SidebarItem
                    icon={<ShoppingBag size={24} className='transition-all duration-40' />}
                    text={t('COMMON.SIDEBAR.PRODUCTS')}
                    active={path === '/admin/products'}
                    link='/admin/products'
                />
                <SidebarItem
                    icon={<Tags size={24} className='transition-all duration-40' />}
                    text={t('COMMON.SIDEBAR.CATEGORIES')}
                    active={path === '/admin/categories'}
                    link='/admin/categories'
                />
                <SidebarItem
                    icon={<Package size={24} className='transition-all duration-40' />}
                    text={t('COMMON.SIDEBAR.ORDERS')}
                    active={path === '/admin/orders'}
                    link='/admin/orders'
                />
                <SidebarItem
                    icon={<ShoppingCart size={24} className='transition-all duration-40' />}
                    text={t('COMMON.SIDEBAR.PURCHASES')}
                    active={path === '/admin/purchases'}
                    link='/admin/purchases'
                />
                <SidebarItem
                    icon={<Warehouse size={24} className='transition-all duration-40' />}
                    text={t('COMMON.SIDEBAR.INVENTORIES')}
                    active={path === '/admin/inventories'}
                    link='/admin/inventories'
                />

                <TypographyItem text={t('COMMON.SIDEBAR.CUSTOMERS_&_PARTNERS')} />
                <SidebarItem
                    icon={<Users size={24} className='transition-all duration-40' />}
                    text={t('COMMON.SIDEBAR.CUSTOMERS')}
                    active={path === '/admin/customers'}
                    link='/admin/customers'
                />
                <SidebarItem
                    icon={<Truck size={24} className='transition-all duration-40' />}
                    text={t('COMMON.SIDEBAR.SUPPLIERS')}
                    active={path === '/admin/suppliers'}
                    link='/admin/suppliers'
                />
                <SidebarItem
                    icon={<Ticket size={24} className='transition-all duration-40' />}
                    text={t('COMMON.SIDEBAR.COUPONS')}
                    active={path === '/admin/coupon-codes'}
                    link='/admin/coupon-codes'
                />

                {/* Báo giá & Nội dung */}
                <TypographyItem text={t('COMMON.SIDEBAR.QUOTATIONS_&_POSTS')} />
                <SidebarItem
                    icon={<FileText size={24} className='transition-all duration-40' />}
                    text={t('COMMON.SIDEBAR.QUOTATIONS')}
                    active={path === '/admin/quotations'}
                    link='/admin/quotations'
                />
                {/* <SidebarItem
                    icon={<File size={24} className='transition-all duration-40' />}
                    text={t('COMMON.SIDEBAR.CONTENTS')}
                    active={path === '/admin/contents'}
                    link='/admin/contents'
                /> */}
                <SidebarItem
                    icon={<Newspaper size={24} className='transition-all duration-40' />}
                    text={t('COMMON.SIDEBAR.POSTS')}
                    active={path === '/admin/blog-posts'}
                    link='/admin/blog-posts'
                />

                {/* Phân quyền */}
                <TypographyItem text={t('COMMON.SIDEBAR.PERSONNEL')} />
                <SidebarItem
                    icon={<UserCog size={24} className='transition-all duration-40' />}
                    text={t('COMMON.SIDEBAR.EMPLOYEES')}
                    active={path === '/admin/employees'}
                    link='/admin/employees'
                />

                <SidebarItem
                    icon={<Lock size={24} className='transition-all duration-40' />}
                    text={t('COMMON.SIDEBAR.PERMISSIONS')}
                    active={path === '/admin/permissions'}
                    link='/admin/permissions'
                />

                {/* Hỗ trợ & Cài đặt */}
                <TypographyItem text={t('COMMON.SIDEBAR.SUPPORT_&_SETTINGS')} />
                <SidebarItem
                    icon={<ShieldCheck size={24} className='transition-all duration-40' />}
                    text={t('COMMON.SIDEBAR.WARRANTIES')}
                    active={path === '/admin/warranty'}
                    link='/admin/warranty'
                />
                <SidebarItem
                    icon={<History size={24} className='transition-all duration-40' />}
                    text={t('COMMON.SIDEBAR.ACTIVITIES')}
                    active={path === '/admin/activity-history'}
                    link='/admin/activity-history'
                />
                <SidebarItem
                    icon={<Settings size={24} className='transition-all duration-40' />}
                    text={t('COMMON.SIDEBAR.SETTINGS')}
                    active={path === '/admin/settings'}
                    link='/admin/settings'
                />
            </Sidebar>

            <Box
                component='main'
                sx={{
                    flex: 1,
                    height: '100%',
                    overflowY: 'auto',
                    position: 'relative',
                    backgroundColor: 'var(--background-color)'
                }}
            >
                <Header />
                <Box
                    sx={{
                        flex: 1,
                        height: '100%',
                        paddingTop: '55px',
                        position: 'relative',
                        scrollbarGutter: 'stable both-edges',
                        '&::-webkit-scrollbar': {
                            width: '7px',
                            height: '7px',
                            backgroundColor: 'var(--background-color)'
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: 'var(--scrollbar-color)',
                            borderRadius: '10px'
                        },
                        backgroundColor: 'var(--background-color)',
                        overflowY: 'auto'
                    }}
                >
                    <Box
                        sx={{
                            width: '100%',
                            padding: '24px 17px',
                            minHeight: '100%'
                        }}
                    >
                        {children}
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default LayoutAdmin
