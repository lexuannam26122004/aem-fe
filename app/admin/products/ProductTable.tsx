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
import { Edit, EyeIcon, StarIcon, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import AlertDialog from '@/components/AlertDialog'
import { useDeleteProductMutation } from '@/services/ProductService'
import { useToast } from '@/hooks/useToast'
import { IProduct, IProductFilter } from '@/models/Product'

function getStatusBgColor(row: IProduct): string {
    if (row.stockQuantity === 0) {
        return 'var(--background-color-cancel)'
    } else if (row.stockQuantity <= row.minStockThreshold) {
        return 'var(--background-color-pending)'
    } else {
        return 'var(--background-color-success)'
    }
}

function getBorderColor(row: IProduct): string {
    if (row.stockQuantity === 0) {
        return '1px solid var(--border-color-cancel)'
    } else if (row.stockQuantity <= row.minStockThreshold) {
        return '1px solid var(--border-color-pending)'
    } else {
        return '1px solid var(--border-color-success)'
    }
}

function getStatusTextColor(row: IProduct): string {
    if (row.stockQuantity === 0) {
        return 'var(--text-color-cancel)'
    } else if (row.stockQuantity <= row.minStockThreshold) {
        return 'var(--text-color-pending)'
    } else {
        return 'var(--text-color-success)'
    }
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount).replace('₫', 'VNĐ')
}

interface IProps {
    data: IProduct[]
    refetch: () => void
    setFilter: React.Dispatch<React.SetStateAction<IProductFilter>>
}

function DataTable({ data, setFilter, refetch }: IProps) {
    const { t } = useTranslation('common')
    const router = useRouter()
    const toast = useToast()
    const [order, setOrder] = useState<'asc' | 'desc'>('asc')
    const [orderBy, setOrderBy] = useState<string>('')
    const [openDialog, setOpenDialog] = useState(false)
    const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null)
    const [selectedChangeId] = useState<number | null>(null)
    const [typeAlert, setTypeAlert] = useState<number | null>(null)

    const [changeStatusProduct, { isLoading: isLoadingDelete }] = useDeleteProductMutation()

    useEffect(() => {}, [selectedChangeId, changeStatusProduct])

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
                // await changeS(selectedDeleteId).unwrap()
                refetch()
                toast(t('COMMON.SUPPLIERS.DELETE_SUPPLIER_SUCCESS'), 'success')
            } catch {
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
                            <TableCell sx={{ borderColor: 'var(--border-color)', padding: '16px 30px 16px 24px' }}>
                                <TableSortLabel
                                    active={'ProductName' === orderBy}
                                    direction={orderBy === 'ProductName' ? order : 'asc'}
                                    onClick={() => handleSort('ProductName')}
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
                                        {t('COMMON.PRODUCT.PRODUCT_NAME')}
                                    </Typography>
                                </TableSortLabel>
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
                                    {t('COMMON.PRODUCT.CATEGORY')}
                                </Typography>
                            </TableCell>

                            <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                <Typography
                                    sx={{
                                        fontWeight: 'bold',
                                        color: 'var(--text-color)',
                                        fontSize: '15px',
                                        maxWidth: '280px',
                                        minWidth: '120px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {t('COMMON.PRODUCT.SUPPLIER')}
                                </Typography>
                            </TableCell>

                            <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                <TableSortLabel
                                    active={'Price' === orderBy}
                                    direction={orderBy === 'Price' ? order : 'asc'}
                                    onClick={() => handleSort('Price')}
                                    sx={{
                                        '& .MuiTableSortLabel-icon': {
                                            color: 'var(--text-color) !important'
                                        },
                                        display: 'flex',
                                        justifyContent: 'left',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontWeight: 'bold',
                                            color: 'var(--text-color)',
                                            fontSize: '15px',
                                            textAlign: 'center',
                                            maxWidth: '280px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {t('COMMON.PRODUCT.ORIGINAL_PRICE')}
                                    </Typography>
                                </TableSortLabel>
                            </TableCell>

                            <TableCell sx={{ borderColor: 'var(--border-color)', padding: '16px 30px 16px 16px' }}>
                                <TableSortLabel
                                    active={'DiscountRate' === orderBy}
                                    direction={orderBy === 'DiscountRate' ? order : 'asc'}
                                    onClick={() => handleSort('DiscountRate')}
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
                                            maxWidth: '400px',
                                            fontSize: '15px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {t('COMMON.PRODUCT.DISCOUNT_RATE')}
                                    </Typography>
                                </TableSortLabel>
                            </TableCell>

                            <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                <TableSortLabel
                                    active={'DiscountPrice' === orderBy}
                                    direction={orderBy === 'DiscountPrice' ? order : 'asc'}
                                    onClick={() => handleSort('DiscountPrice')}
                                    sx={{
                                        '& .MuiTableSortLabel-icon': {
                                            color: 'var(--text-color) !important'
                                        },
                                        display: 'flex',
                                        justifyContent: 'left',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontWeight: 'bold',
                                            color: 'var(--text-color)',
                                            fontSize: '15px',
                                            textAlign: 'center',
                                            maxWidth: '280px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {t('COMMON.PRODUCT.DISCOUNT_PRICE')}
                                    </Typography>
                                </TableSortLabel>
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
                                    {t('COMMON.PRODUCT.UNIT')}
                                </Typography>
                            </TableCell>

                            <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                <Typography
                                    sx={{
                                        fontWeight: 'bold',
                                        color: 'var(--text-color)',
                                        fontSize: '15px',
                                        textAlign: 'center',
                                        maxWidth: '280px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {t('COMMON.PRODUCT.COUNT')}
                                </Typography>
                            </TableCell>

                            <TableCell sx={{ borderColor: 'var(--border-color)' }}>
                                <TableSortLabel
                                    active={'Rating' === orderBy}
                                    direction={orderBy === 'Rating' ? order : 'asc'}
                                    onClick={() => handleSort('Rating')}
                                    sx={{
                                        '& .MuiTableSortLabel-icon': {
                                            color: 'var(--text-color) !important'
                                        },
                                        display: 'flex',
                                        justifyContent: 'left',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontWeight: 'bold',
                                            color: 'var(--text-color)',
                                            fontSize: '15px',
                                            textAlign: 'center',
                                            maxWidth: '280px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {t('COMMON.PRODUCT.RATING')}
                                    </Typography>
                                </TableSortLabel>
                            </TableCell>

                            <TableCell sx={{ borderColor: 'var(--border-color)', padding: '16px 50px' }}>
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
                                    {t('COMMON.PRODUCT.STATUS')}
                                </Typography>
                            </TableCell>

                            <TableCell sx={{ borderColor: 'var(--border-color)', padding: '16px 50px' }}>
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
                            data.map((row: IProduct, index: number) => (
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
                                            padding: '14px 24px'
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '16px'
                                            }}
                                        >
                                            <Avatar
                                                src={row.image}
                                                sx={{
                                                    width: '60px',
                                                    height: '60px',
                                                    borderRadius: '8px'
                                                }}
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
                                                    {row.productName}
                                                </Typography>

                                                <Typography
                                                    sx={{
                                                        color: 'var(--label-title-color)',
                                                        fontSize: '13px',
                                                        maxWidth: '280px',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    }}
                                                >
                                                    {t('COMMON.PRODUCT.SERIAL_NUMBER')}
                                                    {': '}
                                                    {row.serialNumber}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            borderColor: 'var(--border-color)',
                                            borderStyle: 'dashed',
                                            padding: '14px 16px'
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                color: 'var(--text-color)',
                                                fontSize: '15px',
                                                maxWidth: '280px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {row.categoryName}
                                        </Box>
                                    </TableCell>

                                    <TableCell sx={{ borderColor: 'var(--border-color)', borderStyle: 'dashed' }}>
                                        <Box
                                            sx={{
                                                color: 'var(--text-color)',
                                                fontSize: '15px',
                                                maxWidth: '280px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {row.supplierName}
                                        </Box>
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
                                            {formatCurrency(row.price)}
                                        </Typography>
                                    </TableCell>

                                    <TableCell sx={{ borderColor: 'var(--border-color)', borderStyle: 'dashed' }}>
                                        <Typography
                                            sx={{
                                                color: 'var(--text-color)',
                                                fontWeight: 'bold',
                                                fontSize: '15px',
                                                textAlign: 'center',
                                                ml: '-20px',
                                                maxWidth: '180px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {row.discountRate}%
                                        </Typography>
                                    </TableCell>

                                    <TableCell sx={{ borderColor: 'var(--border-color)', borderStyle: 'dashed' }}>
                                        <Typography
                                            sx={{
                                                fontSize: '15px',
                                                color: 'var(--primary-color)',
                                                fontWeight: 'bold',
                                                maxWidth: '280px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {formatCurrency(row.discountPrice)}
                                        </Typography>
                                    </TableCell>

                                    <TableCell sx={{ borderColor: 'var(--border-color)', borderStyle: 'dashed' }}>
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
                                            {row.unit}
                                        </Typography>
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            borderColor: 'var(--border-color)',
                                            borderStyle: 'dashed',
                                            padding: '16px 30px'
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                color: 'var(--label-title-color)',
                                                fontSize: '13px',
                                                maxWidth: '200px',
                                                overflow: 'hidden',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '10px',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {t('COMMON.PRODUCT.STOCK') + ': '}
                                            <Typography
                                                sx={{
                                                    fontWeight: 'bold',
                                                    color: 'var(--text-color)',
                                                    fontSize: '15px'
                                                }}
                                            >
                                                {row.stockQuantity}
                                            </Typography>
                                        </Box>

                                        <Box
                                            sx={{
                                                mt: '3px',
                                                color: 'var(--label-title-color)',
                                                fontSize: '13px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                maxWidth: '200px',
                                                gap: '10px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {t('COMMON.PRODUCT.SOLD') + ': '}
                                            <Typography
                                                sx={{
                                                    fontWeight: 'bold',
                                                    color: 'var(--text-color)',
                                                    fontSize: '15px'
                                                }}
                                            >
                                                {row.soldCount}
                                            </Typography>
                                        </Box>
                                    </TableCell>

                                    <TableCell sx={{ borderColor: 'var(--border-color)', borderStyle: 'dashed' }}>
                                        <Typography
                                            sx={{
                                                color: '#ffb81e',
                                                fontSize: '15px',
                                                fontWeight: 'bold',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                ml: '-20px',
                                                maxWidth: '200px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {row.rating}
                                            <StarIcon
                                                size={16}
                                                color='#ffb81e'
                                                style={{ marginLeft: '5px' }}
                                                fill='#ffb81e'
                                            />
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
                                                padding: '7px 15px',
                                                border: getBorderColor(row),
                                                display: 'flex',
                                                maxWidth: '130px',
                                                minWidth: '120px',
                                                justifyContent: 'center',
                                                backgroundColor: getStatusBgColor(row)
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    fontSize: '13px',
                                                    overflow: 'hidden',
                                                    color: getStatusTextColor(row),
                                                    width: 'auto',
                                                    fontWeight: 'bold',
                                                    display: 'inline-block',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {row.minStockThreshold < row.stockQuantity
                                                    ? t('COMMON.PRODUCT.IN_STOCK')
                                                    : row.stockQuantity === 0
                                                    ? t('COMMON.PRODUCT.OUT_OF_STOCK')
                                                    : t('COMMON.PRODUCT.LOW_STOCK')}
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
                                                    onClick={() => router.push(`/admin/products/${row.id}`)}
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
                                                    onClick={() => handleButtonUpdateClick(row.id)}
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
                                                    onClick={() => handleDeleteClick(row.id)}
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

            {typeAlert === 0 && (
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
            )}
        </>
    )
}

export default DataTable
