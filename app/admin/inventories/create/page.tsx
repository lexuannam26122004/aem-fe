'use client'

import { useEffect, useState } from 'react'
import { NumericFormat } from 'react-number-format'
import {
    Avatar,
    Box,
    Paper,
    TextField,
    Typography,
    Button,
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Table,
    Tooltip
} from '@mui/material'
import { AsyncPaginate } from 'react-select-async-paginate'

import { useTranslation } from 'react-i18next'
import { SaveIcon, Trash2, XIcon } from 'lucide-react'
import dayjs from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { convertToVietnamTime } from '@/common/format'
import LoadingButton from '@mui/lab/LoadingButton'
import { useRouter } from 'next/navigation'
import { IInventoryCreate, IInventoryItemList } from '@/models/Inventory'
import NoteInput from './NoteInput'
import { useCreateInventoryMutation, useGetProductsQuery } from '@/services/InventoryService'
import Loading from '@/components/Loading'
import { useToast } from '@/hooks/useToast'

const customSelectStyles = {
    control: (provided: any, state: any) => ({
        ...provided,
        borderRadius: '10px',
        borderColor: state.isFocused ? 'var(--field-color-selected)' : 'var(--border-color)',
        boxShadow: state.isFocused ? '0 0 0 1px var(--field-color-selected)' : 'none',
        borderWidth: '1px',
        '&:hover': {
            borderColor: 'var(--field-color-hover)'
        },
        minHeight: '56px', // gần giống TextField padding
        paddingLeft: '4px',
        backgroundColor: 'transparent'
    }),
    input: (provided: any) => ({
        ...provided,
        color: 'var(--text-color)',
        fontSize: '15px',
        '::placeholder': {
            color: 'var(--placeholder-color)',
            opacity: 1
        }
    }),
    placeholder: (provided: any) => ({
        ...provided,
        color: 'var(--placeholder-color)',
        opacity: 1,
        fontSize: '16px'
    }),
    menu: (provided: any) => ({
        ...provided,
        backgroundImage:
            'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSJ1cmwoI3BhaW50MF9yYWRpYWxfMjc0OV8xNDUxODYpIiBmaWxsLW9wYWNpdHk9IjAuMTIiLz4KPGRlZnM+CjxyYWRpYWxHcmFkaWVudCBpZD0icGFpbnQwX3JhZGlhbF8yNzQ5XzE0NTE4NiIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgxMjAgMS44MTgxMmUtMDUpIHJvdGF0ZSgtNDUpIHNjYWxlKDEyMy4yNSkiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMDBCOEQ5Ii8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzAwQjhEOSIgc3RvcC1vcGFjaXR5PSIwIi8+CjwvcmFkaWFsR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+Cg==), url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSJ1cmwoI3BhaW50MF9yYWRpYWxfMjc0OV8xNDUxODcpIiBmaWxsLW9wYWNpdHk9IjAuMTIiLz4KPGRlZnM+CjxyYWRpYWxHcmFkaWVudCBpZD0icGFpbnQwX3JhZGlhbF8yNzQ5XzE0NTE4NyIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIDEyMCkgcm90YXRlKDEzNSkgc2NhbGUoMTIzLjI1KSI+CjxzdG9wIHN0b3AtY29sb3I9IiNGRjU2MzAiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjRkY1NjMwIiBzdG9wLW9wYWNpdHk9IjAiLz4KPC9yYWRpYWxHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K)',
        backgroundPosition: 'top right, bottom left',
        backgroundSize: '30%, 30%',
        backgroundRepeat: 'no-repeat',
        backdropFilter: 'blur(20px)',
        backgroundColor: 'var(--background-color-item)',
        margin: '2px 0',
        width: '100%',
        zIndex: 9999
    }),
    option: (provided: any, state: any) => ({
        ...provided,
        backgroundColor: state.isFocused ? 'var(--background-color-item-hover)' : 'transparent',
        ':active': {
            backgroundColor: 'var(--background-color-item-selected)' // màu lúc nhấn chuột
        }
    })
}

export default function CreatePage() {
    const { t } = useTranslation('common')
    const router = useRouter()
    const [isSubmit, setIsSubmit] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [publishDate, setPublishDate] = useState(new Date().toDateString())
    const [notes, setNotes] = useState('')
    const [products, setProducts] = useState<IInventoryItemList[]>([])
    const toast = useToast()
    const { data: productResponse, isLoading: isLoadingProducts } = useGetProductsQuery('')
    const productData = productResponse?.data || []

    const [createInventory] = useCreateInventoryMutation()

    const [inputValue, setInputValue] = useState('')

    useEffect(() => {}, [inputValue, setIsLoading])

    const [localNotes, setLocalNotes] = useState<{ [id: number]: string | undefined }>({})

    const handleLocalChange = (id: number, value: string) => {
        setLocalNotes(prev => ({
            ...prev,
            [id]: value
        }))
    }

    const handleBlur = (id: number) => {
        setProducts(prev =>
            prev.map(product => (product.id === id ? { ...product, notes: localNotes[id] ?? '' } : product))
        )
    }

    const loadOptions = async (inputText: string, loadedOptions: any, { page }: any) => {
        const pageSize = 20

        const filteredProducts = productData.filter(p => p.productName.toLowerCase().includes(inputText.toLowerCase()))

        const start = (page - 1) * pageSize
        const paginatedProducts = filteredProducts.slice(start, start + pageSize)

        const newOptions = paginatedProducts.map((item: any) => ({
            label: (
                <Box
                    sx={{
                        display: 'flex',
                        width: '100%',
                        alignItems: 'center',
                        backgroundColor: 'transparent',
                        gap: '15px'
                    }}
                >
                    <Avatar
                        src={item.image}
                        sx={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '8px'
                        }}
                    />
                    <Box
                        flex={1}
                        display='flex'
                        alignItems='flex-start'
                        flexDirection='column'
                        sx={{ overflow: 'hidden' }}
                    >
                        <Typography
                            sx={{
                                fontSize: '15px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                fontWeight: 'bold',
                                color: 'var(--primary-color)'
                            }}
                        >
                            {item.productName}
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: '13px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                color: 'var(--label-title-color)'
                            }}
                        >
                            {item.sku}
                        </Typography>
                    </Box>
                </Box>
            ),
            value: item.id,
            data: item
        }))

        const hasMore = start + pageSize < filteredProducts.length

        return {
            options: newOptions,
            hasMore,
            additional: {
                page: page + 1
            }
        }
    }

    const handleSubmit = async (isCloseAfter: boolean = false) => {
        setIsSubmit(true)

        if (notes.trim() === '' || products.length === 0) {
            toast('Vui lòng nhập đầy đủ thông tin!', 'error')
            return
        }

        const payload: IInventoryCreate = {
            notes,
            inventoryDate: new Date().toISOString(),
            products: products.map(p => ({
                productId: p.id,
                systemQuantity: p.systemQuantity ?? 0,
                realQuantity: p.realQuantity ?? 0,
                notes: p.notes ?? ''
            }))
        }

        try {
            setIsLoading(true)
            await createInventory(payload).unwrap()
            toast('Tạo phiếu kiểm kho thành công!', 'success')

            if (isCloseAfter) {
                router.push('/inventory')
            } else {
                setProducts([])
                setNotes('')
            }
        } catch (error: any) {
            toast(error?.data?.detail || 'Đã có lỗi xảy ra', 'error')
        } finally {
            setIsLoading(false)
            setIsSubmit(false)
        }
    }

    const handleDeleteClick = (id: number) => {
        const updatedProducts = products.filter(product => product.id !== id)
        setProducts(updatedProducts)
    }

    if (isLoadingProducts) {
        return <Loading />
    }

    return (
        <Paper
            sx={{
                margin: 'auto',
                padding: '24px 0',
                borderRadius: '15px',
                backgroundColor: 'var(--background-color-item)'
            }}
        >
            <Typography sx={{ fontWeight: 'bold', fontSize: '22px', padding: '0 24px', color: 'var(--text-color)' }}>
                {t('COMMON.INVENTORY.CREATE_INVENTORY')}
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px', mt: '24px' }}>
                <Box sx={{ padding: '0 24px', flex: 1 }}>
                    <TextField
                        variant='outlined'
                        label={t('COMMON.INVENTORY.NOTES')}
                        multiline
                        maxRows={4}
                        error={isSubmit && notes.trim() === ''}
                        sx={{
                            width: '100%',
                            '& fieldset': {
                                borderRadius: '8px',
                                color: 'var(--text-color)',
                                borderColor: 'var(--border-color)'
                            },
                            '& .MuiInputBase-root': {
                                paddingRight: '3px'
                            },
                            '& .MuiInputBase-input': {
                                paddingRight: '8px',
                                color: 'var(--text-color)',
                                fontSize: '15px',
                                '&::placeholder': {
                                    color: 'var(--placeholder-color)',
                                    opacity: 1
                                }
                            },
                            '& .MuiOutlinedInput-root:hover fieldset': {
                                borderColor: 'var(--field-color-hover)'
                            },
                            '& .MuiOutlinedInput-root.Mui-error:hover fieldset': {
                                borderColor: 'var(--error-color) !important' // Màu lỗi khi hover
                            },
                            '& .MuiOutlinedInput-root.Mui-error fieldset': {
                                borderColor: 'var(--error-color) !important' // Màu lỗi khi hover
                            },
                            '& .MuiOutlinedInput-root.Mui-focused fieldset': {
                                borderColor: 'var(--field-color-selected)'
                            },
                            '& .MuiInputLabel-root': {
                                color: 'var(--placeholder-color)'
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                                fontWeight: 'bold',
                                color: 'var(--field-color-selected)'
                            },
                            '& .MuiInputLabel-root.Mui-error': {
                                color: 'var(--error-color)'
                            }
                        }}
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                    />
                    {isSubmit && notes.trim() === '' && (
                        <Typography sx={{ color: 'var(--error-color)', fontSize: '13px', margin: '8px 14px -5px' }}>
                            {t('COMMON.REQUIRED', { field: t('COMMON.INVENTORY.NOTES') })}
                        </Typography>
                    )}
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        padding: '0 24px',
                        mt: '4px',
                        alignItems: 'center'
                    }}
                >
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label={t('COMMON.INVENTORY.INVENTORY_DATE')}
                            value={dayjs(publishDate)}
                            onAccept={value => setPublishDate(convertToVietnamTime(value?.toDate() || new Date()))}
                            sx={{
                                width: '200px',
                                '& .MuiInputBase-root': {
                                    color: 'var(--text-color)'
                                },
                                '& .MuiInputBase-input': {
                                    padding: '16.5px 14px'
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderRadius: '8px',
                                    borderColor: 'var(--border-color)'
                                    // borderColor: 'var(--border-dialog)'
                                },
                                '& .MuiSvgIcon-root': {
                                    color: 'var(--label-title-color)' // Màu của icon (lịch)
                                },
                                '& .MuiOutlinedInput-root': {
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'var(--field-color-hover)' // Màu viền khi hover
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'var(--field-color-selected) !important' // Màu viền khi focus, thêm !important để ghi đè
                                    }
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: 'var(--field-color-selected)',
                                    fontWeight: 'bold'
                                },
                                '&:hover .MuiInputLabel-root': {
                                    color: 'var(--field-color-selected)'
                                },
                                '.MuiInputLabel-root': {
                                    color: 'var(--label-title-color)'
                                }
                            }}
                        />
                    </LocalizationProvider>
                </Box>

                <Box sx={{ margin: '0 24px' }}>
                    <AsyncPaginate
                        defaultOptions
                        isMulti
                        value={products.map(p => ({
                            label: p.productName,
                            value: p.id,
                            data: p
                        }))}
                        loadOptions={loadOptions}
                        onInputChange={newValue => {
                            setInputValue(newValue)
                            return newValue
                        }}
                        onChange={(selectedOptions: any) => {
                            const selectedProducts = (selectedOptions ?? [])
                                .map((opt: any) => opt?.data)
                                .filter(Boolean)
                            setProducts(selectedProducts)
                        }}
                        components={{
                            MultiValue: () => null
                        }}
                        additional={{ page: 1 }}
                        styles={customSelectStyles}
                    />
                </Box>

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
                                <TableCell
                                    sx={{
                                        paddingLeft: '24px'
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: '15px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            fontWeight: 'bold',
                                            color: 'var(--text-color)'
                                        }}
                                    >
                                        {t('COMMON.INVENTORY.PRODUCT_NAME')}
                                    </Typography>
                                </TableCell>

                                <TableCell>
                                    <Typography
                                        sx={{
                                            fontSize: '15px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            textAlign: 'center',
                                            whiteSpace: 'nowrap',
                                            fontWeight: 'bold',
                                            color: 'var(--text-color)'
                                        }}
                                    >
                                        {t('COMMON.INVENTORY.SYSTEM_QUANTITY')}
                                    </Typography>
                                </TableCell>

                                <TableCell>
                                    <Typography
                                        sx={{
                                            fontSize: '15px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            fontWeight: 'bold',
                                            color: 'var(--text-color)'
                                        }}
                                    >
                                        {t('COMMON.INVENTORY.REAL_QUANTITY')}
                                    </Typography>
                                </TableCell>

                                <TableCell>
                                    <Typography
                                        sx={{
                                            fontSize: '15px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            textAlign: 'center',
                                            whiteSpace: 'nowrap',
                                            fontWeight: 'bold',
                                            color: 'var(--text-color)'
                                        }}
                                    >
                                        {t('COMMON.INVENTORY.DIFFERENCE')}
                                    </Typography>
                                </TableCell>

                                <TableCell>
                                    <Typography
                                        sx={{
                                            fontSize: '15px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            fontWeight: 'bold',
                                            color: 'var(--text-color)'
                                        }}
                                    >
                                        {t('COMMON.INVENTORY.NOTES')}
                                    </Typography>
                                </TableCell>

                                <TableCell
                                    sx={{
                                        paddingX: '24px'
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: '15px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            textAlign: 'center',
                                            whiteSpace: 'nowrap',
                                            fontWeight: 'bold',
                                            color: 'var(--text-color)'
                                        }}
                                    >
                                        {t('COMMON.PRODUCT.ACTIONS')}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {products.map((row, index) => (
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
                                            maxWidth: '400px',
                                            padding: '14px 24px'
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                width: '100%',
                                                alignItems: 'center',
                                                gap: '15px'
                                            }}
                                        >
                                            <Avatar
                                                src={row.image}
                                                sx={{
                                                    width: '50px',
                                                    height: '50px',
                                                    borderRadius: '10px'
                                                }}
                                            />
                                            <Box
                                                flex={1}
                                                display='flex'
                                                alignItems='left'
                                                sx={{
                                                    gap: '2px',
                                                    overflow: 'hidden',
                                                    flexDirection: 'column'
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        fontSize: '15px',
                                                        overflow: 'hidden',
                                                        maxWidth: '100%',
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
                                                    {row.sku}
                                                </Typography>
                                            </Box>
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
                                            {row.systemQuantity}
                                        </Typography>
                                    </TableCell>

                                    <TableCell sx={{ borderColor: 'var(--border-color)', borderStyle: 'dashed' }}>
                                        <NumericFormat
                                            customInput={TextField}
                                            fullWidth
                                            value={row.realQuantity}
                                            allowNegative={false}
                                            valueIsNumericString
                                            isAllowed={values => {
                                                const { floatValue } = values
                                                return (
                                                    floatValue === undefined || (floatValue >= 0 && floatValue <= 99999)
                                                )
                                            }}
                                            onValueChange={values => {
                                                const { floatValue } = values

                                                setProducts(prev =>
                                                    prev.map((product, idx) =>
                                                        idx === index
                                                            ? {
                                                                  ...product,
                                                                  realQuantity: floatValue ?? 0,
                                                                  stockDifference:
                                                                      (floatValue ?? 0) - product.systemQuantity
                                                              }
                                                            : product
                                                    )
                                                )
                                            }}
                                            slotProps={{
                                                input: {
                                                    sx: {
                                                        maxWidth: '92px',
                                                        fontSize: '15px',
                                                        borderRadius: '8px',
                                                        color: 'var(--text-color)'
                                                    }
                                                }
                                            }}
                                            sx={{
                                                '& fieldset': {
                                                    color: 'var(--text-color)',
                                                    padding: 0,
                                                    borderColor: 'var(--border-color)'
                                                },
                                                '& .MuiInputBase-input': { padding: '10px 12px' },
                                                '& .MuiOutlinedInput-root:hover fieldset': {
                                                    borderColor: 'var(--field-color-hover)'
                                                },
                                                '& .MuiOutlinedInput-root.Mui-error:hover fieldset': {
                                                    borderColor: 'var(--error-color) !important'
                                                },
                                                '& .MuiOutlinedInput-root.Mui-error fieldset': {
                                                    borderColor: 'var(--error-color) !important'
                                                },
                                                '& .MuiOutlinedInput-root.Mui-focused fieldset': {
                                                    borderColor: 'var(--field-color-selected)'
                                                }
                                            }}
                                            error={isSubmit && row.realQuantity === undefined}
                                        />
                                    </TableCell>

                                    <TableCell sx={{ borderColor: 'var(--border-color)', borderStyle: 'dashed' }}>
                                        <Typography
                                            sx={{
                                                color:
                                                    row.stockDifference === undefined || row.stockDifference >= 0
                                                        ? '#0bcf0b'
                                                        : '#ff1919',
                                                fontSize: '15px',
                                                textAlign: 'center',
                                                fontWeight: 'bold',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {row.stockDifference && row.stockDifference > 0 ? '+' : ''}
                                            {row.stockDifference ?? 0}
                                        </Typography>
                                    </TableCell>

                                    <TableCell sx={{ borderColor: 'var(--border-color)', borderStyle: 'dashed' }}>
                                        <NoteInput
                                            id={row.id}
                                            value={localNotes[row.id] ?? row.notes}
                                            onChange={handleLocalChange}
                                            onBlur={handleBlur}
                                        />
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            padding: '0px 25px',
                                            borderColor: 'var(--border-color)',
                                            width: '146px',
                                            borderStyle: 'dashed'
                                        }}
                                    >
                                        <Box display='flex' alignItems='center' justifyContent='center'>
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
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', mt: '24px' }}>
                <LoadingButton
                    variant='contained'
                    {...(isLoading && { loading: true })}
                    loadingPosition='start'
                    startIcon={<SaveIcon />}
                    sx={{
                        height: '50px',
                        backgroundColor: 'var(--background-color-button-save)',
                        width: 'auto',
                        padding: '0px 30px',
                        fontSize: '16px',
                        '&:hover': {
                            backgroundColor: 'var(--background-color-button-save-hover)'
                        },
                        borderRadius: '8px',
                        color: 'var(--text-color-button-save)',
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap',
                        textTransform: 'none'
                    }}
                    onClick={() => handleSubmit(false)}
                >
                    {t('COMMON.BUTTON.SAVE')}
                </LoadingButton>

                <LoadingButton
                    variant='contained'
                    {...(isLoading && { loading: true })}
                    loadingPosition='start'
                    startIcon={<SaveIcon />}
                    sx={{
                        height: '50px',
                        backgroundColor: 'var(--background-color-button-save)',
                        width: 'auto',
                        padding: '0px 30px',
                        '&:hover': {
                            backgroundColor: 'var(--background-color-button-save-hover)'
                        },
                        color: 'var(--text-color-button-save)',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap',
                        textTransform: 'none'
                    }}
                    onClick={() => handleSubmit(true)}
                >
                    {t('COMMON.BUTTON.SAVE_AND_CLOSE')}
                </LoadingButton>

                <Button
                    variant='contained'
                    startIcon={<XIcon />}
                    sx={{
                        height: '50px',
                        backgroundColor: 'var(--background-color-button-cancel)',
                        width: 'auto',
                        fontSize: '16px',
                        '&:hover': {
                            backgroundColor: 'var(--background-color-button-cancel-hover)'
                        },
                        borderRadius: '8px',
                        padding: '0px 30px',
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap',
                        color: 'var(--text-color-button-cancel)',
                        textTransform: 'none'
                    }}
                    onClick={() => {
                        router.push('/admin/suppliers')
                    }}
                >
                    {t('COMMON.BUTTON.CLOSE')}
                </Button>
            </Box>
        </Paper>
    )
}
