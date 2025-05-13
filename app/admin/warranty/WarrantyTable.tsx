'use client'

import {
    Box,
    Typography,
    Tooltip,
    TableRow,
    TableBody,
    Table,
    TableCell,
    TableHead,
    TableContainer,
    TableSortLabel,
    Avatar
} from '@mui/material'
import { CheckCircleIcon, Edit, EyeIcon, ShieldPlus, ShieldPlusIcon, Trash2, XCircleIcon } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/useToast'
import { IWarranty, IWarrantyFilter } from '@/models/Warranty'
import DialogDetail from './DialogDetail'

function getStatusBgColor(status: boolean): string {
    if (!status) {
        return 'var(--background-color-cancel)'
    } else {
        return 'var(--background-color-success)'
    }
}

function getBorderColor(status: boolean): string {
    if (!status) {
        return '1px solid var(--border-color-cancel)'
    } else {
        return '1px solid var(--border-color-success)'
    }
}

function getStatusTextColor(status: boolean): string {
    if (!status) {
        return 'var(--text-color-cancel)'
    } else {
        return 'var(--text-color-success)'
    }
}

const avatars = [
    'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-1.webp',
    'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-2.webp',
    'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-3.webp',
    'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-4.webp',
    'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-5.webp',
    'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-6.webp',
    'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-7.webp',
    'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-8.webp',
    'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-9.webp',
    'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-10.webp',
    'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-11.webp',
    'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-12.webp',
    'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-13.webp',
    'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-14.webp',
    'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-15.webp',
    'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-16.webp',
    'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-17.webp',
    'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-18.webp',
    'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-19.webp'
]

interface IProps {
    data: IWarranty[]
    refetch: () => void
    setFilter: React.Dispatch<React.SetStateAction<IWarrantyFilter>>
}

function DataTable({ data, setFilter, refetch }: IProps) {
    const { t } = useTranslation('common')
    const router = useRouter()
    const toast = useToast()
    const [order, setOrder] = useState<'asc' | 'desc'>('asc')
    const [orderBy, setOrderBy] = useState<string>('')
    const [warranty, setWarranty] = useState<IWarranty | null>(null)

    const handleSort = (property: string) => {
        setFilter(prev => ({
            ...prev,
            sortBy: property,
            isDesc: orderBy === property && order === 'asc' ? true : false
        }))
        if (orderBy === property) {
            setOrder(order === 'asc' ? 'desc' : 'asc')
        } else {
            setOrder('asc')
        }
        setOrderBy(property)
    }

    return (
        <>
            <TableContainer
                sx={{
                    '&::-webkit-scrollbar': {
                        width: '7px',
                        height: '7px'
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: 'var(--scrollbar-color)',
                        borderRadius: '10px'
                    }
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow
                            sx={{
                                backgroundColor: 'var(--background-color-table-header)',
                                '&:last-child td, &:last-child th': {
                                    border: 'none'
                                }
                            }}
                        >
                            <TableCell sx={{ padding: '16px 30px 16px 24px' }}>
                                <TableSortLabel
                                    active={'fullName' === orderBy}
                                    direction={orderBy === 'fullName' ? order : 'asc'}
                                    onClick={() => handleSort('fullName')}
                                    sx={{
                                        '& .MuiTableSortLabel-icon': {
                                            color: 'var(--text-color) !important'
                                        }
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontWeight: 'bold',
                                            color: 'var(--text-color)',
                                            fontSize: '15px',
                                            overflow: 'hidden',
                                            maxWidth: '300px',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {t('COMMON.WARRANTY.CUSTOMER_NAME')}
                                    </Typography>
                                </TableSortLabel>
                            </TableCell>

                            <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                <Typography
                                    sx={{
                                        fontWeight: 'bold',
                                        color: 'var(--text-color)',
                                        fontSize: '15px',
                                        minWidth: '120px',
                                        maxWidth: '280px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {t('COMMON.WARRANTY.PRODUCT_NAME')}
                                </Typography>
                            </TableCell>

                            <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                <Typography
                                    sx={{
                                        fontWeight: 'bold',
                                        color: 'var(--text-color)',
                                        fontSize: '15px',
                                        maxWidth: '280px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {t('COMMON.WARRANTY.SERIAL_NUMBER')}
                                </Typography>
                            </TableCell>

                            <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                <Typography
                                    sx={{
                                        fontWeight: 'bold',
                                        color: 'var(--text-color)',
                                        fontSize: '15px',
                                        maxWidth: '280px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {t('COMMON.WARRANTY.WARRANTY_START')}
                                </Typography>
                            </TableCell>

                            <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                <Typography
                                    sx={{
                                        fontWeight: 'bold',
                                        color: 'var(--text-color)',
                                        fontSize: '15px',
                                        maxWidth: '280px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {t('COMMON.WARRANTY.WARRANTY_END')}
                                </Typography>
                            </TableCell>

                            <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                <Typography
                                    sx={{
                                        fontWeight: 'bold',
                                        color: 'var(--text-color)',
                                        fontSize: '15px',
                                        textAlign: 'center',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {t('COMMON.WARRANTY.STATUS')}
                                </Typography>
                            </TableCell>

                            <TableCell sx={{ padding: '16px 50px' }}>
                                <Typography
                                    sx={{
                                        fontWeight: 'bold',
                                        color: 'var(--text-color)',
                                        fontSize: '15px',
                                        overflow: 'hidden',
                                        textAlign: 'center',
                                        minWidth: '90px',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {t('COMMON.SUPPLIERS.ACTIONS')}
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {data &&
                            data.map((row: IWarranty, index: number) => {
                                const status = new Date(row.warrantyEnd) > new Date() ? false : true
                                return (
                                    <TableRow
                                        key={index}
                                        sx={{
                                            '&:last-child td, &:last-child th': {
                                                border: 'none'
                                            },
                                            transition: 'background-color 60ms ease-in-out',
                                            backgroundColor:
                                                index % 2 === 1 ? 'var(--background-color-table-body)' : 'transparent',
                                            '&:hover': {
                                                backgroundColor: 'var(--hover-color-table-body) !important'
                                            }
                                        }}
                                    >
                                        <TableCell
                                            sx={{
                                                borderColor: 'var(--border-color)',
                                                borderStyle: 'dashed',
                                                padding: '0 24px'
                                            }}
                                        >
                                            <Box display='flex' alignItems='center' gap='10px'>
                                                <Avatar
                                                    sx={{
                                                        width: '40px',
                                                        height: '40px',
                                                        borderRadius: '50%'
                                                    }}
                                                    src={row.avatarPath || avatars[index]}
                                                />
                                                <Box
                                                    display='flex'
                                                    alignItems='left'
                                                    sx={{
                                                        gap: '2px',
                                                        flexDirection: 'column'
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            fontSize: '15px',
                                                            maxWidth: '280px',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap',
                                                            fontWeight: 'bold',
                                                            color: 'var(--primary-color)'
                                                        }}
                                                    >
                                                        {row.fullName}
                                                    </Typography>

                                                    <Typography
                                                        sx={{
                                                            color: 'var(--label-title-color)',
                                                            fontSize: '12px',
                                                            maxWidth: '280px',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap'
                                                        }}
                                                    >
                                                        {row.phoneNumber}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>

                                        <TableCell sx={{ borderColor: 'var(--border-color)', borderStyle: 'dashed' }}>
                                            <Typography
                                                sx={{
                                                    color: 'var(--primary-color)',
                                                    fontSize: '15px',
                                                    maxWidth: '280px',
                                                    overflow: 'hidden',
                                                    fontWeight: 'bold',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {row.productName}
                                            </Typography>
                                        </TableCell>

                                        <TableCell
                                            sx={{
                                                borderColor: 'var(--border-color)',
                                                borderStyle: 'dashed',
                                                maxWidth: '2850px',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                color: 'var(--text-color)',
                                                fontSize: '15px'
                                            }}
                                        >
                                            {row.serialNumber}
                                        </TableCell>

                                        <TableCell sx={{ borderColor: 'var(--border-color)', borderStyle: 'dashed' }}>
                                            <Typography
                                                sx={{
                                                    color: 'var(--text-color)',
                                                    fontSize: '15px',
                                                    maxWidth: '280px',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {new Date(row.warrantyStart).toLocaleDateString('vi-VN', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric'
                                                })}
                                            </Typography>
                                        </TableCell>

                                        <TableCell sx={{ borderColor: 'var(--border-color)', borderStyle: 'dashed' }}>
                                            <Typography
                                                sx={{
                                                    color: 'var(--text-color)',
                                                    fontSize: '15px',
                                                    fontWeight: 'bold',
                                                    maxWidth: '280px',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {new Date(row.warrantyEnd).toLocaleDateString('vi-VN', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric'
                                                })}
                                            </Typography>
                                        </TableCell>

                                        <TableCell
                                            sx={{
                                                borderStyle: 'dashed',
                                                borderColor: 'var(--border-color)'
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    borderRadius: '9999px',
                                                    maxWidth: '165px',
                                                    margin: 'auto',
                                                    padding: '7px 15px',
                                                    border: getBorderColor(status),
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '10px',
                                                    justifyContent: 'left',
                                                    backgroundColor: getStatusBgColor(status)
                                                }}
                                            >
                                                {status ? (
                                                    <CheckCircleIcon
                                                        style={{
                                                            width: 16,
                                                            height: 16,
                                                            marginRight: 1,
                                                            color: getStatusTextColor(status)
                                                        }}
                                                    />
                                                ) : (
                                                    <XCircleIcon
                                                        style={{
                                                            width: 16,
                                                            height: 16,
                                                            marginRight: 1,
                                                            color: getStatusTextColor(status)
                                                        }}
                                                    />
                                                )}
                                                <Typography
                                                    sx={{
                                                        fontSize: '13px',
                                                        overflow: 'hidden',
                                                        color: getStatusTextColor(status),
                                                        width: 'auto',
                                                        fontWeight: 'bold',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    }}
                                                >
                                                    {status
                                                        ? t('COMMON.WARRANTY.IN_WARRANTY')
                                                        : t('COMMON.WARRANTY.OUT_OF_WARRANTY')}
                                                </Typography>
                                            </Box>
                                        </TableCell>

                                        <TableCell
                                            sx={{
                                                padding: '0px 25px 0px',
                                                borderColor: 'var(--border-color)',
                                                width: '146px',
                                                borderStyle: 'dashed'
                                            }}
                                        >
                                            <Box display='flex' alignItems='center' justifyContent='center' gap='10px'>
                                                <Tooltip title={t('COMMON.BUTTON.DETAIL')}>
                                                    <Box
                                                        display='flex'
                                                        alignItems='center'
                                                        justifyContent='center'
                                                        sx={{
                                                            padding: '8px 12px',
                                                            cursor: 'pointer',
                                                            borderRadius: '8px',
                                                            backgroundColor: 'var(--background-color-button-view)',
                                                            border: '1px solid #bfdbfe',
                                                            '&:hover': {
                                                                backgroundColor: 'var(--hover-color-button-view)',
                                                                borderColor: '#96c5ff'
                                                            }
                                                        }}
                                                        onClick={() => setWarranty(row)}
                                                    >
                                                        <EyeIcon size={16} color='#2563eb' />
                                                    </Box>
                                                </Tooltip>

                                                <Tooltip title={t('COMMON.WARRANTY.WARRANTY')}>
                                                    <Box
                                                        display='flex'
                                                        alignItems='center'
                                                        justifyContent='center'
                                                        sx={{
                                                            padding: '8px 12px',
                                                            cursor: 'pointer',
                                                            borderRadius: '8px',
                                                            backgroundColor: '#d4f2e5ed',
                                                            border: '1px solid #abeec2',
                                                            '&:hover': {
                                                                backgroundColor: '#cbffe9',
                                                                borderColor: '#72deaf'
                                                            }
                                                        }}
                                                        onClick={() => {}}
                                                    >
                                                        <ShieldPlus size={16} color='#29b741' />
                                                    </Box>
                                                </Tooltip>

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

                                                <Tooltip title={t('COMMON.BUTTON.DELETE')}>
                                                    <Box
                                                        display='flex'
                                                        alignItems='center'
                                                        justifyContent='center'
                                                        sx={{
                                                            padding: '8px 12px',
                                                            cursor: 'pointer',
                                                            borderRadius: '8px',
                                                            backgroundColor: 'var(--background-color-button-delete)',
                                                            border: '1px solid #fecaca',
                                                            '&:hover': {
                                                                backgroundColor: 'var(--hover-color-button-delete)',
                                                                borderColor: '#fba5a5'
                                                            }
                                                        }}
                                                        onClick={() => {}}
                                                    >
                                                        <Trash2 size={16} color='#dc2626' />
                                                    </Box>
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                    </TableBody>
                </Table>
            </TableContainer>

            {warranty && (
                <DialogDetail isOpen={warranty !== null} onClose={() => setWarranty(null)} warranty={warranty} />
            )}
        </>
    )
}

export default DataTable
