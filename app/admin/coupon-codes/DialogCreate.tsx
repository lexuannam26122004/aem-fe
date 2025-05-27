import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Tooltip,
    Typography
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import LoadingButton from '@mui/lab/LoadingButton'
import { MenuItem, FormControl, Select } from '@mui/material'
import { CircleAlert, SaveIcon, XIcon } from 'lucide-react'
import dayjs from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers'
import { convertToVietnamTime, maxValueCurrency, maxValuePercentage } from '@/common/format'
import { NumericFormat } from 'react-number-format'
import { useCreateCouponMutation } from '@/services/CouponService'
import { ICouponCreate } from '@/models/Coupon'
import { useToast } from '@/hooks/useToast'

interface Props {
    open: boolean
    handleClose: () => void
}

function DialogCreate({ open, handleClose }: Props) {
    const { t } = useTranslation('common')
    const [couponCode, setCouponCode] = useState('')
    const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage')
    const [discountValue, setDiscountValue] = useState<number | undefined>(10)
    const [minimumOrderValue, setMinimumOrderValue] = useState<number | undefined>(0)
    const [maximumDiscount, setMaximumDiscount] = useState<number | undefined>(10000)
    const [usageLimit, setUsageLimit] = useState<number | undefined>(undefined)
    const [activationDate, setActivationDate] = useState(new Date().toDateString())
    const [expiryDate, setExpiryDate] = useState(new Date().toDateString())
    const [customerType, setCustomerType] = useState<string>('all_customer')
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmit, setIsSubmit] = useState(false)
    const [createCoupon] = useCreateCouponMutation()
    const toast = useToast()

    useEffect(() => {
        if (discountType === 'fixed') {
            setMaximumDiscount(undefined)
        }
    }, [discountType])

    const handleSave = async () => {
        setIsSubmit(true)
        if (
            couponCode.trim() === '' ||
            discountValue === undefined ||
            discountValue === 0 ||
            minimumOrderValue === undefined
        )
            return

        setIsLoading(true)

        const body = {
            couponCode,
            discountType,
            discountValue,
            minimumOrderValue,
            maximumDiscount,
            usageLimit,
            customerType,
            activationDate: convertToVietnamTime(new Date(activationDate)),
            expiryDate: convertToVietnamTime(new Date(expiryDate))
        } as ICouponCreate

        try {
            await createCoupon(body).unwrap()
            setIsSubmit(false)
            toast(t('COMMON.COUPON.CREATE_SUCCESS'), 'success')
            return true
        } catch {
            toast(t('COMMON.COUPON.CREATE_ERROR'), 'error')
            return false
        } finally {
            setIsLoading(false)
        }
    }

    const handleSaveAndClose = async () => {
        const isSuccess = await handleSave()
        if (isSuccess) {
            handleClose()
        }
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: '12px',
                        width: '55vw',
                        minWidth: '800px'
                    }
                }
            }}
            sx={{
                '& .MuiBackdrop-root': {
                    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Đậm hơn mặc định (0.5)
                    backdropFilter: 'blur(7px)' // Làm mờ mạnh hơn
                }
            }}
        >
            <DialogTitle
                sx={{
                    padding: '20px',
                    borderBottom: '1px solid var(--border-color)',
                    backgroundColor: 'var(--background-color)'
                }}
            >
                <Typography sx={{ fontWeight: 'bold', fontSize: '22px', color: 'var(--text-color)' }}>
                    {t('COMMON.COUPON.CREATE_NEW_COUPON')}
                </Typography>
                <Typography sx={{ fontSize: '14px', color: 'var(--label-title-color)', marginTop: '3px' }}>
                    {t('COMMON.COUPON.CREATE_DESC')}
                </Typography>
            </DialogTitle>

            <DialogContent
                sx={{
                    padding: '20px',
                    paddingTop: '20px !important',
                    backgroundColor: 'var(--background-color-item)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px'
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        gap: '20px',
                        alignItems: 'center'
                    }}
                >
                    <Box
                        sx={{
                            flex: 1
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: '16px',
                                color:
                                    isSubmit && couponCode.trim() === '' ? 'var(--error-color)' : 'var(--text-color)',
                                fontWeight: 'bold',
                                mb: '10px'
                            }}
                        >
                            {t('COMMON.COUPON.COUPON_CODE')}
                        </Typography>

                        <TextField
                            fullWidth
                            placeholder={t('COMMON.COUPON.ENTER_COUPON_CODE')}
                            value={couponCode}
                            slotProps={{
                                input: {
                                    sx: {
                                        fontSize: '15px',
                                        height: '45px',
                                        borderRadius: '8px',
                                        color: 'var(--text-color)'
                                    }
                                },
                                htmlInput: {
                                    sx: {
                                        '&::placeholder': {
                                            color:
                                                isSubmit && couponCode.trim() === ''
                                                    ? 'var(--error-color)'
                                                    : 'var(--placeholder-color)',
                                            opacity: 1
                                        }
                                    }
                                }
                            }}
                            error={isSubmit && couponCode.trim() === ''}
                            sx={{
                                '& fieldset': {
                                    color: 'var(--text-color)',
                                    borderColor: 'var(--border-color)'
                                },
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
                            onChange={e => setCouponCode(e.target.value)}
                        />
                    </Box>

                    <Box
                        sx={{
                            flex: 1
                        }}
                    >
                        <Typography
                            sx={{ fontSize: '16px', color: 'var(--text-color)', fontWeight: 'bold', mb: '10px' }}
                        >
                            {t('COMMON.COUPON.DISCOUNT_TYPE')}
                        </Typography>

                        <FormControl
                            sx={{
                                width: '100%',
                                '& .MuiOutlinedInput-root:hover fieldset': {
                                    borderColor: 'var(--field-color-hover)' // Màu hover khi không lỗi
                                },
                                '& .MuiOutlinedInput-root.Mui-error:hover fieldset': {
                                    borderColor: 'var(--error-color)' // Màu hover khi lỗi
                                },
                                '& .MuiOutlinedInput-root.Mui-error fieldset': {
                                    borderColor: 'var(--error-color)' // Màu viền khi lỗi
                                },
                                '& .MuiOutlinedInput-root.Mui-focused fieldset': {
                                    border: '2px solid var(--field-color-selected)' // Màu viền khi focus
                                },
                                '& .MuiOutlinedInput-root.Mui-error.Mui-focused fieldset': {
                                    borderColor: 'var(--error-color)' // Màu viền khi lỗi và focus
                                }
                            }}
                        >
                            <Select
                                defaultValue='percentage'
                                value={discountType}
                                onChange={e => setDiscountType(e.target.value as 'percentage' | 'fixed')}
                                sx={{
                                    width: '100%',
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'var(--border-color)'
                                    },
                                    '& fieldset': {
                                        borderRadius: '8px',
                                        borderColor: 'var(--border-color)'
                                    },
                                    '& .MuiSelect-icon': {
                                        color: 'var(--text-color)'
                                    },
                                    '& .MuiInputBase-input': {
                                        color: 'var(--text-color)',
                                        padding: '11px 14px'
                                    }
                                }}
                                MenuProps={{
                                    PaperProps: {
                                        elevation: 0,
                                        sx: {
                                            mt: '4px',
                                            borderRadius: '8px',
                                            padding: '0 8px',
                                            backgroundImage:
                                                'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSJ1cmwoI3BhaW50MF9yYWRpYWxfMjc0OV8xNDUxODYpIiBmaWxsLW9wYWNpdHk9IjAuMTIiLz4KPGRlZnM+CjxyYWRpYWxHcmFkaWVudCBpZD0icGFpbnQwX3JhZGlhbF8yNzQ5XzE0NTE4NiIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgxMjAgMS44MTgxMmUtMDUpIHJvdGF0ZSgtNDUpIHNjYWxlKDEyMy4yNSkiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMDBCOEQ5Ii8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzAwQjhEOSIgc3RvcC1vcGFjaXR5PSIwIi8+CjwvcmFkaWFsR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+Cg==), url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSJ1cmwoI3BhaW50MF9yYWRpYWxfMjc0OV8xNDUxODcpIiBmaWxsLW9wYWNpdHk9IjAuMTIiLz4KPGRlZnM+CjxyYWRpYWxHcmFkaWVudCBpZD0icGFpbnQwX3JhZGlhbF8yNzQ5XzE0NTE4NyIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIDEyMCkgcm90YXRlKDEzNSkgc2NhbGUoMTIzLjI1KSI+CjxzdG9wIHN0b3AtY29sb3I9IiNGRjU2MzAiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjRkY1NjMwIiBzdG9wLW9wYWNpdHk9IjAiLz4KPC9yYWRpYWxHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K)',
                                            backgroundPosition: 'top right, bottom left',
                                            backgroundSize: '50%, 50%',
                                            backgroundRepeat: 'no-repeat',
                                            backdropFilter: 'blur(20px)',
                                            backgroundColor: 'var(--background-color-item)',
                                            color: 'var(--text-color)',
                                            border: '1px solid var(--border-color)',
                                            '& .MuiMenuItem-root': {
                                                '&:hover': { backgroundColor: 'var(--background-color-item-hover)' },
                                                '&.Mui-selected': {
                                                    backgroundColor: 'var(--background-color-item-selected)',
                                                    '&:hover': { backgroundColor: 'var(--background-color-item-hover)' }
                                                }
                                            }
                                        }
                                    },
                                    anchorOrigin: {
                                        vertical: 'bottom',
                                        horizontal: 'right' // Căn chỉnh bên phải
                                    },
                                    transformOrigin: {
                                        vertical: 'top',
                                        horizontal: 'right' // Căn chỉnh bên phải
                                    }
                                }}
                            >
                                <MenuItem
                                    value='percentage'
                                    sx={{
                                        borderRadius: '6px'
                                    }}
                                >
                                    {t('COMMON.COUPON.PERCENTAGE')}
                                </MenuItem>

                                <MenuItem
                                    value='fixed'
                                    sx={{
                                        mt: '3px',
                                        borderRadius: '6px'
                                    }}
                                >
                                    {t('COMMON.COUPON.FIXED_AMOUNT')}
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    <Box
                        sx={{
                            flex: 1
                        }}
                    >
                        <Typography
                            sx={{ fontSize: '16px', color: 'var(--text-color)', fontWeight: 'bold', mb: '10px' }}
                        >
                            {t('COMMON.COUPON.CUSTOMER_TYPE')}
                        </Typography>

                        <FormControl
                            sx={{
                                width: '100%',
                                '& .MuiOutlinedInput-root:hover fieldset': {
                                    borderColor: 'var(--field-color-hover)' // Màu hover khi không lỗi
                                },
                                '& .MuiOutlinedInput-root.Mui-error:hover fieldset': {
                                    borderColor: 'var(--error-color)' // Màu hover khi lỗi
                                },
                                '& .MuiOutlinedInput-root.Mui-error fieldset': {
                                    borderColor: 'var(--error-color)' // Màu viền khi lỗi
                                },
                                '& .MuiOutlinedInput-root.Mui-focused fieldset': {
                                    border: '2px solid var(--field-color-selected)' // Màu viền khi focus
                                },
                                '& .MuiOutlinedInput-root.Mui-error.Mui-focused fieldset': {
                                    borderColor: 'var(--error-color)' // Màu viền khi lỗi và focus
                                }
                            }}
                        >
                            <Select
                                defaultValue='all_customer'
                                value={customerType}
                                onChange={e => setCustomerType(e.target.value as string)}
                                sx={{
                                    width: '100%',
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'var(--border-color)'
                                    },
                                    '& fieldset': {
                                        borderRadius: '8px',
                                        borderColor: 'var(--border-color)'
                                    },
                                    '& .MuiSelect-icon': {
                                        color: 'var(--text-color)'
                                    },
                                    '& .MuiInputBase-input': {
                                        color: 'var(--text-color)',
                                        padding: '11px 14px'
                                    }
                                }}
                                MenuProps={{
                                    PaperProps: {
                                        elevation: 0,
                                        sx: {
                                            mt: '4px',
                                            borderRadius: '8px',
                                            padding: '0 8px',
                                            backgroundImage:
                                                'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSJ1cmwoI3BhaW50MF9yYWRpYWxfMjc0OV8xNDUxODYpIiBmaWxsLW9wYWNpdHk9IjAuMTIiLz4KPGRlZnM+CjxyYWRpYWxHcmFkaWVudCBpZD0icGFpbnQwX3JhZGlhbF8yNzQ5XzE0NTE4NiIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgxMjAgMS44MTgxMmUtMDUpIHJvdGF0ZSgtNDUpIHNjYWxlKDEyMy4yNSkiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMDBCOEQ5Ii8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzAwQjhEOSIgc3RvcC1vcGFjaXR5PSIwIi8+CjwvcmFkaWFsR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+Cg==), url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSJ1cmwoI3BhaW50MF9yYWRpYWxfMjc0OV8xNDUxODcpIiBmaWxsLW9wYWNpdHk9IjAuMTIiLz4KPGRlZnM+CjxyYWRpYWxHcmFkaWVudCBpZD0icGFpbnQwX3JhZGlhbF8yNzQ5XzE0NTE4NyIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIDEyMCkgcm90YXRlKDEzNSkgc2NhbGUoMTIzLjI1KSI+CjxzdG9wIHN0b3AtY29sb3I9IiNGRjU2MzAiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjRkY1NjMwIiBzdG9wLW9wYWNpdHk9IjAiLz4KPC9yYWRpYWxHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K)',
                                            backgroundPosition: 'top right, bottom left',
                                            backgroundSize: '50%, 50%',
                                            backgroundRepeat: 'no-repeat',
                                            backdropFilter: 'blur(20px)',
                                            backgroundColor: 'var(--background-color-item)',
                                            color: 'var(--text-color)',
                                            border: '1px solid var(--border-color)',
                                            '& .MuiMenuItem-root': {
                                                '&:hover': { backgroundColor: 'var(--background-color-item-hover)' },
                                                '&.Mui-selected': {
                                                    backgroundColor: 'var(--background-color-item-selected)',
                                                    '&:hover': { backgroundColor: 'var(--background-color-item-hover)' }
                                                }
                                            }
                                        }
                                    },
                                    anchorOrigin: {
                                        vertical: 'bottom',
                                        horizontal: 'right' // Căn chỉnh bên phải
                                    },
                                    transformOrigin: {
                                        vertical: 'top',
                                        horizontal: 'right' // Căn chỉnh bên phải
                                    }
                                }}
                            >
                                <MenuItem
                                    value='all_customer'
                                    sx={{
                                        borderRadius: '6px'
                                    }}
                                >
                                    {t('COMMON.COUPON.ALL_CUSTOMER')}
                                </MenuItem>

                                <MenuItem
                                    value='new_customer'
                                    sx={{
                                        mt: '3px',
                                        borderRadius: '6px'
                                    }}
                                >
                                    {t('COMMON.COUPON.NEW_CUSTOMER')}
                                </MenuItem>

                                <MenuItem
                                    value='silver_customer'
                                    sx={{
                                        mt: '3px',
                                        borderRadius: '6px'
                                    }}
                                >
                                    {t('COMMON.COUPON.SILVER_CUSTOMER')}
                                </MenuItem>

                                <MenuItem
                                    value='gold_customer'
                                    sx={{
                                        mt: '3px',
                                        borderRadius: '6px'
                                    }}
                                >
                                    {t('COMMON.COUPON.GOLD_CUSTOMER')}
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        gap: '20px',
                        alignItems: 'center'
                    }}
                >
                    <Box
                        sx={{
                            flex: 1
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                mb: '10px'
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: '16px',
                                    color:
                                        isSubmit && discountValue === undefined
                                            ? 'var(--error-color)'
                                            : 'var(--text-color)',
                                    fontWeight: 'bold'
                                }}
                            >
                                {t('COMMON.COUPON.DISCOUNT_VALUE')}
                            </Typography>
                            <Tooltip
                                title={
                                    discountType === 'fixed'
                                        ? t('COMMON.COUPON.ALERT_VALUE_CURRENCY')
                                        : t('COMMON.COUPON.ALERT_VALUE_PERCENTAGE')
                                }
                            >
                                <CircleAlert
                                    size={18}
                                    color={
                                        isSubmit && discountValue === undefined
                                            ? 'var(--error-color)'
                                            : 'var(--text-color)'
                                    }
                                />
                            </Tooltip>
                        </Box>

                        <NumericFormat
                            customInput={TextField}
                            fullWidth
                            value={discountValue}
                            thousandSeparator='.'
                            decimalSeparator=','
                            allowNegative={false}
                            suffix={discountType === 'fixed' ? ' VND' : ' %'}
                            valueIsNumericString
                            isAllowed={values => {
                                const { floatValue } = values
                                return (
                                    floatValue === undefined ||
                                    (floatValue >= 0 &&
                                        floatValue <=
                                            (discountType === 'fixed' ? maxValueCurrency : maxValuePercentage))
                                )
                            }}
                            onValueChange={values => {
                                const { floatValue } = values
                                if (floatValue === undefined) {
                                    setDiscountValue(undefined) // Trả về chuỗi rỗng thay vì 0
                                } else {
                                    setDiscountValue(
                                        Math.min(
                                            Math.max(floatValue, 0),
                                            discountType === 'fixed' ? maxValueCurrency : maxValuePercentage
                                        )
                                    )
                                }
                            }}
                            slotProps={{
                                input: {
                                    sx: {
                                        fontSize: '15px',
                                        height: '45px',
                                        borderRadius: '8px',
                                        color: 'var(--text-color)'
                                    }
                                }
                            }}
                            sx={{
                                '& fieldset': {
                                    color: 'var(--text-color)',
                                    borderColor: 'var(--border-color)'
                                },
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
                            error={isSubmit && discountValue === undefined}
                        />
                    </Box>

                    <Box
                        sx={{
                            flex: 1
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                mb: '10px',
                                opacity: discountType === 'fixed' ? 0.4 : 1
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: '16px',
                                    color:
                                        isSubmit && maximumDiscount === undefined && discountType === 'percentage'
                                            ? 'var(--error-color)'
                                            : 'var(--text-color)',
                                    fontWeight: 'bold'
                                }}
                            >
                                {t('COMMON.COUPON.MAXIMUM_DISCOUNT')}
                            </Typography>
                            <Tooltip title={t('COMMON.COUPON.ALERT_VALUE_CURRENCY')}>
                                <CircleAlert
                                    size={18}
                                    color={
                                        isSubmit && maximumDiscount === undefined && discountType === 'percentage'
                                            ? 'var(--error-color)'
                                            : 'var(--text-color)'
                                    }
                                />
                            </Tooltip>
                        </Box>

                        <NumericFormat
                            customInput={TextField}
                            fullWidth
                            disabled={discountType === 'fixed'}
                            value={maximumDiscount ?? ''}
                            thousandSeparator='.'
                            decimalSeparator=','
                            allowNegative={false}
                            valueIsNumericString
                            isAllowed={values => {
                                const { floatValue } = values
                                return floatValue === undefined || (floatValue >= 0 && floatValue <= maxValueCurrency)
                            }}
                            onValueChange={values => {
                                const { floatValue } = values
                                if (floatValue === undefined) {
                                    setMaximumDiscount(undefined)
                                } else {
                                    setMaximumDiscount(Math.min(Math.max(floatValue, 0), maxValueCurrency))
                                }
                            }}
                            slotProps={{
                                input: {
                                    sx: {
                                        fontSize: '15px',
                                        height: '45px',
                                        borderRadius: '8px',
                                        color: 'var(--text-color)'
                                    }
                                }
                            }}
                            sx={{
                                '& fieldset': {
                                    color: 'var(--text-color)',
                                    borderColor: 'var(--border-color)'
                                },
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
                                },
                                '& .MuiOutlinedInput-root.Mui-disabled:hover fieldset': {
                                    borderColor: 'var(--border-color) !important' // Giữ nguyên border mặc định
                                },
                                '& .MuiOutlinedInput-root.Mui-disabled fieldset': {
                                    borderColor: 'var(--border-color) !important',
                                    opacity: 0.5
                                }
                            }}
                            error={isSubmit && maximumDiscount === undefined && discountType === 'percentage'}
                        />
                    </Box>

                    <Box
                        sx={{
                            flex: 1
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                mb: '10px'
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: '16px',
                                    color:
                                        isSubmit && minimumOrderValue === undefined
                                            ? 'var(--error-color)'
                                            : 'var(--text-color)',
                                    fontWeight: 'bold'
                                }}
                            >
                                {t('COMMON.COUPON.MINIMUM_ORDER_VALUE')}
                            </Typography>
                            <Tooltip title={t('COMMON.COUPON.ALERT_VALUE_CURRENCY_BEGIN_ZERO')}>
                                <CircleAlert
                                    size={18}
                                    color={
                                        isSubmit && minimumOrderValue === undefined
                                            ? 'var(--error-color)'
                                            : 'var(--text-color)'
                                    }
                                />
                            </Tooltip>
                        </Box>

                        <NumericFormat
                            customInput={TextField}
                            fullWidth
                            value={minimumOrderValue ?? ''}
                            thousandSeparator='.'
                            decimalSeparator=','
                            allowNegative={false}
                            min={0}
                            valueIsNumericString
                            isAllowed={values => {
                                const { floatValue } = values
                                return floatValue === undefined || (floatValue >= 0 && floatValue <= maxValueCurrency)
                            }}
                            onValueChange={values => {
                                const { floatValue } = values
                                if (floatValue === undefined) {
                                    setMinimumOrderValue(undefined)
                                } else {
                                    setMinimumOrderValue(Math.min(Math.max(floatValue, 0), maxValueCurrency))
                                }
                            }}
                            slotProps={{
                                input: {
                                    sx: {
                                        fontSize: '15px',
                                        height: '45px',
                                        borderRadius: '8px',
                                        color: 'var(--text-color)'
                                    }
                                }
                            }}
                            sx={{
                                '& fieldset': {
                                    color: 'var(--text-color)',
                                    borderColor: 'var(--border-color)'
                                },
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
                            error={isSubmit && minimumOrderValue === undefined}
                        />
                    </Box>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        gap: '20px',
                        alignItems: 'center'
                    }}
                >
                    <Box
                        sx={{
                            flex: 1
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                mb: '10px'
                            }}
                        >
                            <Typography sx={{ fontSize: '16px', color: 'var(--text-color)', fontWeight: 'bold' }}>
                                {t('COMMON.COUPON.USAGE_LIMIT')}
                            </Typography>
                            <Tooltip title={t('COMMON.COUPON.ALERT_VALUE_CURRENCY')}>
                                <CircleAlert size={18} color='var(--text-color)' />
                            </Tooltip>
                        </Box>

                        <NumericFormat
                            customInput={TextField}
                            fullWidth
                            value={usageLimit}
                            thousandSeparator='.'
                            decimalSeparator=','
                            allowNegative={false}
                            placeholder={t('COMMON.COUPON.NOT_REQUIRED')}
                            min={0}
                            valueIsNumericString
                            isAllowed={values => {
                                const { floatValue } = values
                                return floatValue === undefined || (floatValue >= 0 && floatValue <= maxValueCurrency)
                            }}
                            onValueChange={values => {
                                const { floatValue } = values
                                if (floatValue === undefined) {
                                    setUsageLimit(undefined) // Trả về chuỗi rỗng thay vì 0
                                } else {
                                    setUsageLimit(Math.min(Math.max(floatValue, 0), maxValueCurrency))
                                }
                            }}
                            slotProps={{
                                input: {
                                    sx: {
                                        fontSize: '15px',
                                        height: '45px',
                                        borderRadius: '8px',
                                        color: 'var(--text-color)'
                                    }
                                }
                            }}
                            sx={{
                                '& fieldset': {
                                    color: 'var(--text-color)',
                                    borderColor: 'var(--border-color)'
                                },
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
                            error={isSubmit && usageLimit === 0}
                        />
                    </Box>

                    <Box
                        sx={{
                            flex: 1
                        }}
                    >
                        <Typography
                            sx={{ fontSize: '16px', color: 'var(--text-color)', fontWeight: 'bold', mb: '10px' }}
                        >
                            {t('COMMON.COUPON.START_DATE')}
                        </Typography>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                value={dayjs(activationDate)}
                                onAccept={value =>
                                    setActivationDate(convertToVietnamTime(value?.toDate() || new Date()))
                                }
                                sx={{
                                    width: '100%',
                                    '& .MuiInputBase-root': {
                                        color: 'var(--text-color)'
                                    },
                                    '& .MuiInputBase-input': {
                                        padding: '11px'
                                    },
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderRadius: '8px',
                                        borderColor: 'var(--border-color)'
                                        // borderColor: 'var(--border-dialog)'
                                    },
                                    '& .MuiSvgIcon-root': {
                                        color: 'var(--label-title-color)'
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
                                        color: 'var(--field-color-selected)'
                                    }
                                }}
                            />
                        </LocalizationProvider>
                    </Box>

                    <Box
                        sx={{
                            flex: 1
                        }}
                    >
                        <Typography
                            sx={{ fontSize: '16px', color: 'var(--text-color)', fontWeight: 'bold', mb: '10px' }}
                        >
                            {t('COMMON.COUPON.END_DATE')}
                        </Typography>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                value={dayjs(expiryDate)}
                                onAccept={value => setExpiryDate(convertToVietnamTime(value?.toDate() || new Date()))}
                                sx={{
                                    width: '100%',
                                    '& .MuiInputBase-root': {
                                        color: 'var(--text-color)'
                                    },
                                    '& .MuiInputBase-input': {
                                        padding: '11px'
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
                                        color: 'var(--field-color-selected)'
                                    }
                                }}
                            />
                        </LocalizationProvider>
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions
                sx={{
                    padding: '20px',
                    display: 'flex',
                    borderTop: '1px solid var(--border-color)',
                    alignItems: 'center',
                    gap: '20px',
                    justifyContent: 'center',
                    backgroundColor: 'var(--background-color)'
                }}
            >
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
                    onClick={handleSave}
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
                    onClick={handleSaveAndClose}
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
                    onClick={handleClose}
                >
                    {t('COMMON.BUTTON.CLOSE')}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default DialogCreate
