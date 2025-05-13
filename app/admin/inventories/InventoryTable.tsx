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
import { BadgeCheckIcon, CheckCircleIcon, Edit, EyeIcon, StarIcon, Trash2, XCircleIcon } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import AlertDialog from '@/components/AlertDialog'
import { useToast } from '@/hooks/useToast'
import { IInventory, IInventoryFilter } from '@/models/Inventory'

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
    data: IInventory[]
    refetch: () => void
    setFilter: React.Dispatch<React.SetStateAction<IInventoryFilter>>
}

function DataTable({ data, setFilter, refetch }: IProps) {
    const { t } = useTranslation('common')
    const router = useRouter()
    const toast = useToast()
    const [order, setOrder] = useState<'asc' | 'desc'>('asc')
    const [orderBy, setOrderBy] = useState<string>('')
    const [openDialog, setOpenDialog] = useState(false)
    const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null)
    const [typeAlert, setTypeAlert] = useState<number | null>(null)

    const handleButtonUpdateClick = (id: number) => {
        router.push(`/admin/suppliers/update?id=${id}`)
    }

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

    const handleDeleteClick = async (id: number) => {
        setTypeAlert(0)
        setSelectedDeleteId(id)
        setOpenDialog(true)
    }

    const handleDeleteSupplier = async () => {
        if (selectedDeleteId) {
            try {
                // await changeStatusSupplierMutation(selectedDeleteId).unwrap()
                refetch()
                toast(t('COMMON.SUPPLIERS.DELETE_SUPPLIER_SUCCESS'), 'success')
            } catch (error) {
                toast(t('COMMON.SUPPLIERS.DELETE_SUPPLIER_FAIL'), 'error')
            }
        }
        setOpenDialog(false)
        setSelectedDeleteId(null)
        setTypeAlert(null)
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
                            <TableCell sx={{ borderColor: 'var(--border-color)', paddingLeft: '24px' }}>
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
                                    {t('COMMON.INVENTORY.ASSIGNEE')}
                                </Typography>
                            </TableCell>

                            <TableCell sx={{ padding: '16px 30px 16px 16px' }}>
                                <TableSortLabel
                                    active={'OrderDate' === orderBy}
                                    direction={orderBy === 'OrderDate' ? order : 'asc'}
                                    onClick={() => handleSort('OrderDate')}
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
                                        {t('COMMON.INVENTORY.INVENTORY_DATE')}
                                    </Typography>
                                </TableSortLabel>
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
                                    {t('COMMON.ORDER.ITEMS')}
                                </Typography>
                            </TableCell>

                            <TableCell sx={{ borderColor: 'var(--border-color)', paddingX: '24px' }}>
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
                                    {t('COMMON.INVENTORY.NOTES')}
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
                                        maxWidth: '280px',
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
                            data.map((row: IInventory, index: number) => (
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
                                            paddingX: '24px',
                                            borderStyle: 'dashed'
                                        }}
                                    >
                                        <Box display='flex' alignItems='center' gap='15px'>
                                            <Avatar
                                                sx={{
                                                    width: '40px',
                                                    height: '40px',
                                                    borderRadius: '50%'
                                                }}
                                                src={row.assigneeAvatarPath || avatars[index]}
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
                                                    {row.assigneeName}
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
                                                    {row.assigneeId}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            borderColor: 'var(--border-color)',
                                            borderStyle: 'dashed'
                                        }}
                                    >
                                        <Box>
                                            <Typography
                                                sx={{
                                                    color: 'var(--text-color)',
                                                    fontSize: '15px'
                                                }}
                                            >
                                                {new Date(row.lastStockUpdate).toLocaleDateString('vi-VN', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric'
                                                })}
                                            </Typography>

                                            <Typography
                                                sx={{
                                                    color: 'var(--label-title-color)',
                                                    fontSize: '12px'
                                                }}
                                            >
                                                {new Date(row.lastStockUpdate).toLocaleString('vi-VN', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    hour12: false
                                                })}
                                            </Typography>
                                        </Box>
                                    </TableCell>

                                    <TableCell sx={{ borderColor: 'var(--border-color)', borderStyle: 'dashed' }}>
                                        <Typography
                                            sx={{
                                                color: 'var(--text-color)',
                                                fontSize: '15px',
                                                textAlign: 'center',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {row.itemCount}
                                        </Typography>
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            borderColor: 'var(--border-color)',
                                            borderStyle: 'dashed',
                                            paddingX: '24px'
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                color: 'var(--text-color)',
                                                fontSize: '15px',
                                                maxWidth: '200px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {row.notes}
                                        </Typography>
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
                                                    onClick={() => {
                                                        router.push(`/admin/inventories/detail?id=${row.id}`)
                                                    }}
                                                >
                                                    <EyeIcon size={16} color='#2563eb' />
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
                                                    // onClick={() => handleButtonUpdateClick(row.id)}
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
                                                    // onClick={() => handleDeleteClick(row.id)}
                                                >
                                                    <Trash2 size={16} color='#dc2626' />
                                                </Box>
                                            </Tooltip>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* {typeAlert === 0 && (
                <AlertDialog
                    title={t('COMMON.ALERT_DIALOG.CONFIRM')}
                    isLoading={isLoadingDelete}
                    content={t('COMMON.ALERT_DIALOG.CONFIRM_DELETE')}
                    type='warning'
                    open={openDialog}
                    setOpen={setOpenDialog}
                    buttonCancel={t('COMMON.ALERT_DIALOG.CANCEL')}
                    buttonConfirm={t('COMMON.ALERT_DIALOG.DELETE')}
                    onConfirm={() => handleDeleteSupplier()}
                />
            )} */}
        </>
    )
}

export default DataTable
