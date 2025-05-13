'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
    Calendar,
    Mail,
    Phone,
    MapPin,
    ShieldCheck,
    UserCircle,
    CheckCircleIcon,
    XCircleIcon,
    UserCircleIcon,
    MailIcon,
    BellIcon,
    PackageIcon,
    CalendarIcon,
    BriefcaseBusinessIcon,
    MailMinus,
    PhoneIcon,
    FileUser,
    History,
    Star,
    SquareChartGantt,
    Edit
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { IEmployee } from '@/models/Employee'
import {
    Avatar,
    Box,
    Button,
    Checkbox,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid2,
    Paper,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Tabs,
    Tooltip,
    Typography
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { formatDate } from '@/common/format'
import { IWarranty } from '@/models/Warranty'
import { Clock, Settings, ArrowRight, FileText, RefreshCw, Shield, Tag, Wrench } from 'lucide-react'
import EmptyState from '@/components/EmptyState'
import { IHistoryWarranty } from '@/models/HistoryWarranty'

interface Props {
    warranty: IWarranty
    isOpen: boolean
    onClose: () => void
}

const repairs = [
    {
        repairDate: '2025-03-01',
        repairProductName: 'iPhone 13 Pro',
        newProductName: 'iPhone 13 Pro (Refurbished)',
        repairSerialNumber: 'SN78901234',
        newSerialNumber: 'SN78901235',
        warrantyDuration: 6,
        status: 'in_progress',
        repairDescription:
            'Thay thế màn hình bị vỡ và pin bị chai. Thay thế màn hình bị vỡ và pin bị chai. Thay thế màn hình bị vỡ và pin bị chai',
        type: 'replacement'
    },
    {
        repairDate: '2025-02-01',
        repairProductName: 'iPhone 13 Pro',
        newProductName: null,
        repairSerialNumber: 'SN78901234',
        newSerialNumber: null,
        warrantyDuration: 0,
        status: 'completed',
        repairDescription: 'Sửa chữa lỗi camera không lấy nét',
        type: 'repair'
    },
    {
        repairDate: '2025-02-01',
        repairProductName: 'iPhone 13 Pro',
        newProductName: 'iPhone 13 Pro',
        repairSerialNumber: 'SN78901234',
        newSerialNumber: 'SN78901234',
        warrantyDuration: 3,
        status: 'completed',
        repairDescription: 'Sửa chữa lỗi camera không lấy nét',
        type: 'maintenance'
    },
    {
        repairDate: '2025-02-01',
        repairProductName: 'iPhone 13 Pro',
        newProductName: 'iPhone 13 Pro',
        repairSerialNumber: 'SN78901234',
        newSerialNumber: 'SN78901234',
        warrantyDuration: 3,
        status: 'cancelled',
        repairDescription: 'Sửa chữa lỗi camera không lấy nét',
        type: 'repairx'
    },
    {
        repairDate: '2024-03-01',
        repairProductName: 'iPhone 13 Pro',
        newProductName: 'iPhone 13 Pro',
        repairSerialNumber: 'SN78901234',
        newSerialNumber: 'SN78901234',
        status: 'completed',
        warrantyDuration: 1,
        repairDescription: 'Kiểm tra và cập nhật phần mềm',
        type: 'upgrade'
    }
] as IHistoryWarranty[]

const getTypeColors = (type: string) => {
    switch (type) {
        case 'replacement':
            return {
                icon: <RefreshCw size={20} color='#e11d48' />,
                bg: 'linear-gradient(to bottom right, #fff1f2, #ffe4e6)',
                border: '#fecdd3',
                text: '#e11d48',
                gradient: '#fda4af'
            }
        case 'repair':
            return {
                icon: <Wrench size={20} color='#2563eb' />,
                bg: 'linear-gradient(to bottom right, #eff6ff, #dbeafe)',
                border: '#bfdbfe',
                text: '#2563eb',
                gradient: '#93c5fd'
            }
        case 'maintenance':
            return {
                icon: <Shield size={20} color='#16a34a' />,
                bg: 'linear-gradient(to bottom right, #f0fdf4, #dcfce7)',
                border: '#bbf7d0',
                text: '#16a34a',
                gradient: '#86efac'
            }
        case 'upgrade':
            return {
                icon: <Star size={20} color='#f59e0b' />,
                bg: 'linear-gradient(to bottom right, #fffbeb, #fef3c7)',
                border: '#fde68a',
                text: '#f59e0b',
                gradient: '#fcd34d'
            }
        default:
            return {
                icon: <Settings size={20} color='#8b5cf6' />,
                bg: 'linear-gradient(to bottom right, #f5f3ff, #ede9fe)',
                border: '#ddd6fe',
                text: '#8b5cf6',
                gradient: '#a78bfa'
            }
    }
}

const DialogDetail: React.FC<Props> = ({ warranty, isOpen, onClose }) => {
    const { t } = useTranslation('common')
    const [tab, setTab] = useState('info')

    const getTooltipTitle = (type: string) => {
        switch (type) {
            case 'replacement':
                return t('COMMON.WARRANTY.REPLACE')
            case 'repair':
                return t('COMMON.WARRANTY.REPAIR')
            case 'maintenance':
                return t('COMMON.WARRANTY.MAINTENANCE')
            case 'upgrade':
                return t('COMMON.WARRANTY.UPGRADE')
            default:
                return t('COMMON.WARRANTY.OTHER')
        }
    }

    if (!isOpen) return null

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            maxWidth='md'
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: '12px'
                    }
                }
            }}
            sx={{
                '& .MuiDialog-paper': {
                    width: '60vw !important'
                },
                '& .MuiBackdrop-root': {
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(7px)'
                }
            }}
        >
            <DialogTitle
                sx={{
                    backgroundColor: 'var(--background-color)',
                    padding: '0'
                }}
            >
                <Box
                    sx={{
                        background: 'linear-gradient(to right, #2563eb, #60a4fa)',
                        p: '24px',
                        borderRadius: '12px 12px 0 0',
                        color: 'white'
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            height: '100%'
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                            <Box sx={{ position: 'relative' }}>
                                <Box
                                    sx={{
                                        bgcolor: 'rgba(255, 255, 255, 0.3)',
                                        backdropFilter: 'blur(4px)',
                                        borderRadius: '50%',
                                        p: 0.75
                                    }}
                                >
                                    {warranty.avatarPath ? (
                                        <Avatar
                                            src={warranty.avatarPath}
                                            alt={warranty.fullName}
                                            sx={{
                                                height: 96,
                                                width: 96,
                                                border: '4px solid white',
                                                boxShadow: 3
                                            }}
                                        />
                                    ) : (
                                        <Avatar
                                            sx={{
                                                height: 96,
                                                width: 96,
                                                bgcolor: 'linear-gradient(to bottom right, #bbdefb, #90caf9)',
                                                color: '#1565c0',
                                                fontSize: '1.875rem',
                                                fontWeight: 'bold',
                                                border: '4px solid white',
                                                boxShadow: 3
                                            }}
                                        >
                                            {warranty.fullName.charAt(0)}
                                        </Avatar>
                                    )}
                                </Box>
                            </Box>

                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: '3px',
                                    flexDirection: 'column'
                                }}
                            >
                                <Typography variant='h4' fontWeight='bold'>
                                    {warranty.fullName}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1 }}>
                                    {new Date(warranty.warrantyEnd) <= new Date() ? (
                                        <Chip
                                            icon={
                                                <CheckCircleIcon
                                                    style={{ width: 16, height: 16, marginRight: 1, color: 'white' }}
                                                />
                                            }
                                            label={t('COMMON.WARRANTY.IN_WARRANTY')}
                                            size='small'
                                            sx={{
                                                bgcolor: '#00ff28a6',
                                                borderRadius: '9999px',
                                                color: 'white',
                                                fontWeight: 'bold',
                                                height: 'auto',
                                                padding: '5px 7px'
                                            }}
                                        />
                                    ) : (
                                        <Chip
                                            icon={
                                                <XCircleIcon
                                                    style={{ width: 16, height: 16, marginRight: 1, color: 'white' }}
                                                />
                                            }
                                            label={t('COMMON.WARRANTY.OUT_OF_WARRANTY')}
                                            size='small'
                                            sx={{
                                                bgcolor: '#e15f5a',
                                                borderRadius: '9999px',
                                                color: 'white',
                                                fontWeight: 'bold',
                                                height: 'auto',
                                                padding: '5px 7px'
                                            }}
                                        />
                                    )}
                                </Box>
                                {/* <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        mt: 1,
                                        gap: '5px',
                                        color: 'rgba(255, 255, 255, 0.8)'
                                    }}
                                >
                                    <UserCircleIcon style={{ width: 16, height: 16, marginRight: 0.5 }} />
                                    <Typography variant='body2'> {activity.username}</Typography>
                                </Box> */}
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </DialogTitle>

            <DialogContent
                sx={{
                    pt: '0 !important',
                    pb: '0',
                    px: '0px',
                    overflowY: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: 'var(--background-color)'
                }}
            >
                <Tabs
                    value={tab}
                    onChange={(e, newValue) => setTab(newValue)}
                    sx={{
                        flexShrink: 0,
                        margin: '12px 24px',
                        width: 'fit-content',
                        backgroundColor: 'var(--background-color-component)',
                        height: '42px',
                        minHeight: '42px',
                        borderRadius: '10px',
                        '& .MuiTabs-indicator': { display: 'none' }
                    }}
                >
                    <Tab
                        label={t('COMMON.INFORMATION')}
                        value='info'
                        icon={<FileUser size={17} />}
                        iconPosition='start'
                        sx={{
                            display: 'flex',
                            height: '42px',
                            minHeight: '42px',
                            color: 'var(--text-color)',
                            padding: '0px 20px',
                            fontWeight: 'bold',
                            borderRadius: '10px',
                            textTransform: 'none',
                            border: '2px solid transparent',
                            '&.Mui-selected': {
                                backgroundColor: 'var(--background-color)',
                                color: 'var(--text-color)',
                                border: '2px solid var(--border-color)'
                            }
                        }}
                    />

                    <Tab
                        label={t('COMMON.WARRANTY.HISTORY_WARRANTY')}
                        value='history'
                        icon={<History size={17} />}
                        iconPosition='start'
                        sx={{
                            display: 'flex',
                            height: '42px',
                            minHeight: '42px',
                            borderRadius: '10px',
                            color: 'var(--text-color)',
                            fontWeight: 'bold',
                            padding: '0px 20px',
                            textTransform: 'none',
                            border: '2px solid transparent',
                            '&.Mui-selected': {
                                backgroundColor: 'var(--background-color)',
                                color: 'var(--text-color)',
                                border: '2px solid var(--border-color)'
                            }
                        }}
                    />
                </Tabs>

                <Divider
                    sx={{
                        width: 'full-width',
                        borderColor: 'var(--border-color)'
                    }}
                />

                {tab === 'info' && (
                    <TableContainer
                        sx={{
                            padding: '10px 9px 10px 24px',
                            height: '100%', // Thêm chiều cao 100%
                            flexGrow: 1,
                            scrollbarGutter: 'stable',
                            overflow: 'auto'
                        }}
                    >
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell
                                        sx={{
                                            paddingLeft: '0px',
                                            borderColor: 'var(--border-color)',
                                            fontSize: '15px',
                                            minWidth: '195px',
                                            color: 'var(--text-color)',
                                            fontWeight: 'bold',
                                            whiteSpace: 'nowrap',
                                            borderStyle: 'dashed'
                                        }}
                                    >
                                        {t('COMMON.ACTIVITY_LOG.INFO')}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            borderColor: 'var(--border-color)',
                                            borderStyle: 'dashed'
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                fontSize: '15px',
                                                color: 'var(--text-color)'
                                            }}
                                        >
                                            <UserCircleIcon
                                                style={{
                                                    width: '20px',
                                                    height: '20px',
                                                    marginRight: '10px'
                                                }}
                                            />
                                            {warranty.fullName}
                                        </Typography>

                                        <Typography
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                mt: '10px',
                                                fontSize: '15px',
                                                color: 'var(--text-color)'
                                            }}
                                        >
                                            <PhoneIcon
                                                style={{
                                                    width: '20px',
                                                    height: '20px',
                                                    marginRight: '10px'
                                                }}
                                            />
                                            {warranty.phoneNumber}
                                        </Typography>
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell
                                        sx={{
                                            paddingLeft: '0px',
                                            borderColor: 'var(--border-color)',
                                            fontSize: '15px',
                                            minWidth: '195px',
                                            color: 'var(--text-color)',
                                            fontWeight: 'bold',
                                            whiteSpace: 'nowrap',
                                            borderStyle: 'dashed'
                                        }}
                                    >
                                        {t('COMMON.WARRANTY.PRODUCT_NAME')}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            borderColor: 'var(--border-color)',
                                            borderStyle: 'dashed'
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                fontSize: '15px',
                                                fontWeight: 'bold',
                                                color: 'var(--primary-color)'
                                            }}
                                        >
                                            {warranty.productName}
                                        </Typography>
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell
                                        sx={{
                                            paddingLeft: '0px',
                                            borderColor: 'var(--border-color)',
                                            fontSize: '15px',
                                            minWidth: '195px',
                                            color: 'var(--text-color)',
                                            fontWeight: 'bold',
                                            whiteSpace: 'nowrap',
                                            borderStyle: 'dashed'
                                        }}
                                    >
                                        {t('COMMON.WARRANTY.SERIAL_NUMBER')}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            borderColor: 'var(--border-color)',
                                            borderStyle: 'dashed'
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                color: 'var(--text-color)',
                                                fontSize: '15px'
                                            }}
                                        >
                                            {warranty.serialNumber}
                                        </Typography>
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell
                                        sx={{
                                            paddingLeft: '0px',
                                            borderColor: 'var(--border-color)',
                                            fontSize: '15px',
                                            minWidth: '195px',
                                            color: 'var(--text-color)',
                                            fontWeight: 'bold',
                                            whiteSpace: 'nowrap',
                                            borderStyle: 'dashed'
                                        }}
                                    >
                                        {t('COMMON.WARRANTY.WARRANTY_PERIOD')}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            borderColor: 'var(--border-color)',
                                            borderStyle: 'dashed'
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                fontSize: '15px',
                                                color: 'var(--text-color)'
                                            }}
                                        >
                                            <CalendarIcon
                                                style={{
                                                    width: '20px',
                                                    height: '20px',
                                                    marginRight: '10px'
                                                }}
                                            />
                                            {new Date(warranty.warrantyStart).toLocaleDateString('vi-VN', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric'
                                            }) +
                                                ' - ' +
                                                new Date(warranty.warrantyStart).toLocaleDateString('vi-VN', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric'
                                                })}
                                        </Typography>
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell
                                        sx={{
                                            paddingLeft: '0px',
                                            border: 'none',
                                            fontSize: '15px',
                                            minWidth: '195px',
                                            color: 'var(--text-color)',
                                            fontWeight: 'bold',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {t('COMMON.SUPPLIERS.DESCRIPTION')}
                                    </TableCell>
                                    <TableCell sx={{ border: 'none' }}>
                                        <Typography
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                fontSize: '15px',
                                                color: 'var(--text-color)'
                                            }}
                                        >
                                            {warranty.description}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                {tab === 'history' && (
                    <Box
                        sx={{
                            flexGrow: 1,
                            padding: '24px',
                            overflow: 'auto',
                            width: '100%'
                        }}
                    >
                        {repairs.length > 0 ? (
                            repairs.map((repair, index) => {
                                const { icon, bg, border, text, gradient } = getTypeColors(repair.type)
                                return (
                                    <Box
                                        key={index}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'top',
                                            ':not(:last-child)': { mb: '28px' },
                                            position: 'relative'
                                        }}
                                    >
                                        {index < repairs.length - 1 && (
                                            <Box
                                                sx={{
                                                    width: '5px',
                                                    height: '100%',
                                                    position: 'absolute',
                                                    zIndex: 1,
                                                    top: '37px',
                                                    left: '21.5px',
                                                    background: `linear-gradient(to bottom, ${
                                                        getTypeColors(repair.type).gradient
                                                    }, ${getTypeColors(repairs[index + 1].type).gradient})`
                                                }}
                                            />
                                        )}

                                        <Tooltip title={getTooltipTitle(repair.type)} placement='top'>
                                            <Box
                                                sx={{
                                                    width: 48,
                                                    flexShrink: 0,
                                                    height: 48,
                                                    '&:hover': {
                                                        transform: 'scale(1.1)',
                                                        transition: 'transform 0.2s ease-in-out'
                                                    },
                                                    display: 'flex',
                                                    zIndex: 2,
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    background: bg,
                                                    borderRadius: '50%',
                                                    padding: '10px'
                                                }}
                                            >
                                                {icon}
                                            </Box>
                                        </Tooltip>

                                        <Box sx={{ ml: 2, flexGrow: 1 }}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    mb: '8px',
                                                    justifyContent: 'space-between'
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '10px'
                                                    }}
                                                >
                                                    <Clock size={18} color={text} />
                                                    <Typography
                                                        sx={{ fontSize: '15px', color: text, fontWeight: 'bold' }}
                                                    >
                                                        {new Date(repair.repairDate).toLocaleDateString('vi-VN', {
                                                            day: '2-digit',
                                                            month: '2-digit',
                                                            year: 'numeric'
                                                        })}
                                                    </Typography>
                                                </Box>

                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '10px'
                                                    }}
                                                >
                                                    <Tooltip title={t('COMMON.BUTTON.UPDATE')}>
                                                        <Box
                                                            display='flex'
                                                            alignItems='center'
                                                            justifyContent='center'
                                                            sx={{
                                                                padding: '8px 12px',
                                                                cursor: 'pointer',
                                                                borderRadius: '8px',
                                                                backgroundColor: 'var(--background-color-button-edit)',
                                                                border: '1px solid #fde68a',
                                                                '&:hover': {
                                                                    backgroundColor: 'var(--hover-color-button-edit)',
                                                                    borderColor: '#fadc5e'
                                                                }
                                                            }}
                                                            onClick={() => {}}
                                                        >
                                                            <Edit size={16} color='#d97706' />
                                                        </Box>
                                                    </Tooltip>
                                                    <Typography
                                                        sx={{
                                                            fontSize: '15px',
                                                            mr: '5px',
                                                            color: 'var(--text-color)',
                                                            fontWeight: 'bold'
                                                        }}
                                                    >
                                                        {repair.status === 'completed'
                                                            ? t('COMMON.WARRANTY.COMPLETED')
                                                            : repair.status === 'in_progress'
                                                            ? t('COMMON.WARRANTY.IN_PROGRESS')
                                                            : t('COMMON.WARRANTY.CANCELLED')}
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            <TableContainer
                                                sx={{
                                                    flexGrow: 1,
                                                    border: '1px solid var(--border-color)',
                                                    borderRadius: '10px',
                                                    width: '100%',
                                                    background: bg,
                                                    borderColor: border
                                                }}
                                            >
                                                <Table>
                                                    <TableBody>
                                                        <TableRow>
                                                            <TableCell
                                                                sx={{
                                                                    border: 'none',
                                                                    paddingBottom: '0',
                                                                    minWidth: '195px',
                                                                    width: '195px',
                                                                    maxWidth: '195px'
                                                                }}
                                                            >
                                                                <Box
                                                                    sx={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: '10px'
                                                                    }}
                                                                >
                                                                    <Tag size={18} color={text} />
                                                                    <Typography
                                                                        sx={{
                                                                            fontSize: '15px',
                                                                            color: 'var(--text-color)'
                                                                        }}
                                                                    >
                                                                        {t('COMMON.WARRANTY.PRODUCT_NAME')}
                                                                    </Typography>
                                                                </Box>
                                                            </TableCell>

                                                            <TableCell
                                                                sx={{
                                                                    border: 'none',
                                                                    paddingBottom: '0'
                                                                }}
                                                            >
                                                                <Box
                                                                    sx={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: '10px'
                                                                    }}
                                                                >
                                                                    <Typography
                                                                        sx={{
                                                                            fontSize: '15px',
                                                                            whiteSpace: 'nowrap',
                                                                            fontWeight: 'bold',
                                                                            color: 'var(--text-color)'
                                                                        }}
                                                                    >
                                                                        {repair.repairProductName}
                                                                    </Typography>
                                                                    {repair.newProductName && (
                                                                        <Box
                                                                            sx={{
                                                                                display: 'flex',
                                                                                alignItems: 'center',
                                                                                gap: '10px'
                                                                            }}
                                                                        >
                                                                            <ArrowRight size={18} color={text} />
                                                                            <Typography
                                                                                sx={{
                                                                                    fontSize: '15px',
                                                                                    fontWeight: 'bold',
                                                                                    whiteSpace: 'nowrap',
                                                                                    color: text
                                                                                }}
                                                                            >
                                                                                {repair.repairProductName}
                                                                            </Typography>
                                                                        </Box>
                                                                    )}
                                                                </Box>
                                                            </TableCell>
                                                        </TableRow>

                                                        <TableRow>
                                                            <TableCell
                                                                sx={{
                                                                    border: 'none',
                                                                    paddingBottom: '0',
                                                                    minWidth: '195px',
                                                                    width: '195px',
                                                                    maxWidth: '195px'
                                                                }}
                                                            >
                                                                <Box
                                                                    sx={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: '10px'
                                                                    }}
                                                                >
                                                                    <PackageIcon size={18} color={text} />
                                                                    <Typography
                                                                        sx={{
                                                                            fontSize: '15px',
                                                                            color: 'var(--text-color)'
                                                                        }}
                                                                    >
                                                                        {t('COMMON.WARRANTY.SERIAL_NUMBER')}
                                                                    </Typography>
                                                                </Box>
                                                            </TableCell>

                                                            <TableCell sx={{ border: 'none', paddingBottom: '0' }}>
                                                                <Box
                                                                    sx={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: '10px'
                                                                    }}
                                                                >
                                                                    <Typography
                                                                        sx={{
                                                                            fontSize: '15px',
                                                                            fontWeight: 'bold',
                                                                            color: 'var(--text-color)'
                                                                        }}
                                                                    >
                                                                        {repair.repairSerialNumber}
                                                                    </Typography>
                                                                    {repair.newSerialNumber && (
                                                                        <Box
                                                                            sx={{
                                                                                display: 'flex',
                                                                                alignItems: 'center',
                                                                                gap: '10px'
                                                                            }}
                                                                        >
                                                                            <ArrowRight size={18} color={text} />
                                                                            <Typography
                                                                                sx={{
                                                                                    fontSize: '15px',
                                                                                    fontWeight: 'bold',
                                                                                    color: text
                                                                                }}
                                                                            >
                                                                                {repair.newSerialNumber}
                                                                            </Typography>
                                                                        </Box>
                                                                    )}
                                                                </Box>
                                                            </TableCell>
                                                        </TableRow>

                                                        <TableRow>
                                                            <TableCell
                                                                sx={{
                                                                    border: 'none',
                                                                    paddingBottom: '0',
                                                                    minWidth: '195px',
                                                                    width: '195px',
                                                                    maxWidth: '195px'
                                                                }}
                                                            >
                                                                <Box
                                                                    sx={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: '10px'
                                                                    }}
                                                                >
                                                                    <ShieldCheck size={18} color={text} />
                                                                    <Typography
                                                                        sx={{
                                                                            fontSize: '15px',
                                                                            color: 'var(--text-color)'
                                                                        }}
                                                                    >
                                                                        {t('COMMON.WARRANTY.WARRANTY_PERIOD')}
                                                                    </Typography>
                                                                </Box>
                                                            </TableCell>
                                                            <TableCell sx={{ border: 'none', paddingBottom: '0' }}>
                                                                <Typography
                                                                    sx={{
                                                                        fontSize: '15px',
                                                                        fontWeight: 'bold',
                                                                        color: 'var(--text-color)'
                                                                    }}
                                                                >
                                                                    {repair.warrantyDuration > 0
                                                                        ? repair.warrantyDuration +
                                                                          ' ' +
                                                                          t('COMMON.WARRANTY.MONTHS')
                                                                        : t('COMMON.NO')}
                                                                </Typography>
                                                            </TableCell>
                                                        </TableRow>

                                                        <TableRow>
                                                            <TableCell
                                                                sx={{
                                                                    border: 'none',
                                                                    minWidth: '195px',
                                                                    width: '195px',
                                                                    maxWidth: '195px'
                                                                }}
                                                            >
                                                                <Box
                                                                    sx={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: '10px'
                                                                    }}
                                                                >
                                                                    <SquareChartGantt size={18} color={text} />
                                                                    <Typography
                                                                        sx={{
                                                                            fontSize: '15px',
                                                                            color: 'var(--text-color)'
                                                                        }}
                                                                    >
                                                                        {t('COMMON.WARRANTY.DESCRIPTION')}
                                                                    </Typography>
                                                                </Box>
                                                            </TableCell>

                                                            <TableCell sx={{ border: 'none' }}>
                                                                <Typography
                                                                    sx={{
                                                                        fontSize: '15px',
                                                                        color: 'black'
                                                                    }}
                                                                >
                                                                    {repair.repairDescription}
                                                                </Typography>
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Box>
                                    </Box>
                                )
                            })
                        ) : (
                            <EmptyState />
                        )}
                    </Box>
                )}
            </DialogContent>

            <DialogActions
                sx={{
                    padding: '18px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    borderTop: '1px solid var(--border-color)',
                    backgroundColor: 'var(--background-color)',
                    justifyContent: 'space-between'
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        gap: '10px',
                        ml: '4px',
                        alignItems: 'center'
                    }}
                >
                    <Box
                        sx={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor:
                                new Date(warranty.warrantyEnd) > new Date() ? '#e82323' : 'var(--active-color)'
                        }}
                    />
                    <Typography
                        sx={{
                            fontSize: '15px',
                            color: new Date(warranty.warrantyEnd) > new Date() ? '#e82323' : 'var(--active-color)'
                        }}
                    >
                        {new Date(warranty.warrantyEnd) > new Date()
                            ? t('COMMON.WARRANTY.OUT_OF_WARRANTY_DESC')
                            : t('COMMON.WARRANTY.IN_WARRANTY_DESC')}
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        gap: '20px'
                    }}
                >
                    <Button
                        variant='contained'
                        sx={{
                            backgroundColor: 'var(--background-color-button-cancel)',
                            width: 'auto',
                            fontSize: '16px',
                            '&:hover': {
                                backgroundColor: 'var(--background-color-button-cancel-hover)'
                            },
                            borderRadius: '8px',
                            padding: '6px 30px',
                            fontWeight: 'bold',
                            whiteSpace: 'nowrap',
                            color: 'var(--text-color-button-cancel)',
                            textTransform: 'none'
                        }}
                        onClick={onClose}
                    >
                        {t('COMMON.BUTTON.CLOSE')}
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    )
}

export default DialogDetail
