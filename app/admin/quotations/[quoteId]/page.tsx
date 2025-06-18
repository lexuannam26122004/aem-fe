'use client'

import React from 'react'
import { Printer } from 'lucide-react'
import { IQuotationDetail } from '@/models/Quotation'
import {
    Avatar,
    Box,
    Button,
    Divider,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Typography
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { usePathname } from 'next/navigation'
import { useGetByIdQuotationQuery, useUpdateResponsibleEmployeeMutation } from '@/services/QuotationService'
import Loading from '@/components/Loading'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import SaveAsIcon from '@mui/icons-material/SaveAs'
import { useSearchEmployeeQuery } from '@/services/EmployeeService'
import { IEmployee } from '@/models/Employee'
import { useToast } from '@/hooks/useToast'
import AlertDialog from './AlertDialog'

function getStatusBgColor(status: string): string {
    if (status === 'cancelled') {
        return 'var(--background-color-cancel)'
    } else if (status === 'completed') {
        return 'var(--background-color-success)'
    } else if (status === 'pending') {
        return 'var(--background-color-pending)'
    } else {
        return 'var(--background-color-pink)'
    }
}

function getBorderColor(status: string): string {
    if (status === 'cancelled') {
        return 'var(--border-color-cancel)'
    } else if (status === 'completed') {
        return 'var(--border-color-success)'
    } else if (status === 'pending') {
        return 'var(--border-color-pending)'
    } else {
        return 'var(--border-color-pink)'
    }
}

function getStatusTextColor(status: string): string {
    if (status === 'cancelled') {
        return 'var(--text-color-cancel)'
    } else if (status === 'completed') {
        return 'var(--text-color-success)'
    } else if (status === 'pending') {
        return 'var(--text-color-pending)'
    } else {
        return 'var(--text-color-pink)'
    }
}

export default function QuotationDetailPage() {
    const { t } = useTranslation('common')
    const [responsibleEmployee, setResponsibleEmployee] = React.useState<IEmployee>(null)

    const [isEdit, setIsEdit] = React.useState(false)
    const pathname = usePathname()
    const quotationCode = pathname.split('/').pop() || ''
    const [tempStatus, setTempStatus] = React.useState('')
    const [openDialog, setOpenDialog] = React.useState(false)
    const { data: quotationResponse, isLoading } = useGetByIdQuotationQuery(quotationCode)
    const [updateResponsibleEmployee] = useUpdateResponsibleEmployeeMutation()
    const { data: employeeResponse } = useSearchEmployeeQuery({ pageSize: 20, pageNumber: 1 })
    const employees = employeeResponse?.data.records as IEmployee[]
    const toast = useToast()

    const quotationDetail = quotationResponse?.data as IQuotationDetail

    const handleUpdateResponsible = async () => {
        if (responsibleEmployee) {
            await updateResponsibleEmployee({
                quoteCode: quotationDetail?.quotationCode,
                responsibleAvatar: responsibleEmployee.avatar,
                responsibleName: responsibleEmployee.fullName,
                responsibleEmail: responsibleEmployee.email,
                responsiblePhone: responsibleEmployee.phoneNumber
            })
                .unwrap()
                .then(() => {
                    setIsEdit(false)
                    toast('Cập nhật nhân viên phụ trách thành công', 'success')
                })
                .catch(error => {
                    toast(error?.data?.detail || 'Cập nhật nhân viên phụ trách thất bại', 'error')
                })
        } else {
            setIsEdit(false)
        }
    }

    if (isLoading) {
        return <Loading />
    }

    return (
        <>
            <Box
                sx={{
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        mb: '24px',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            gap: '25px',
                            alignItems: 'center'
                        }}
                    >
                        <Box>
                            <Typography
                                sx={{
                                    color: 'var(--text-color)',
                                    fontWeight: 'bold',
                                    fontSize: '20px',
                                    marginLeft: '5px'
                                }}
                            >
                                {t('COMMON.QUOTATION.QUOTATION')} #{quotationDetail.quotationCode}
                            </Typography>
                            <Typography
                                sx={{
                                    color: 'var(--label-title-color)',
                                    fontSize: '15px',
                                    marginLeft: '5px'
                                }}
                            >
                                {new Date(quotationDetail.createdAt).toLocaleDateString('vi-VN', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                borderRadius: '9999px',
                                padding: '7px 15px',
                                border: getBorderColor(quotationDetail.status),
                                display: 'flex',
                                margin: '0 auto',
                                width: '105px',
                                alignItems: 'center',
                                gap: '10px',
                                justifyContent: 'center',
                                backgroundColor: getStatusBgColor(quotationDetail.status)
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: '13px',
                                    overflow: 'hidden',
                                    color: getStatusTextColor(quotationDetail.status),
                                    fontWeight: 'bold',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {quotationDetail.status === 'pending' && t('COMMON.ORDER.PENDING')}
                                {quotationDetail.status === 'completed' && t('COMMON.QUOTATION.COMPLETED')}
                                {quotationDetail.status === 'cancelled' && t('COMMON.ORDER.CANCELLED')}
                            </Typography>
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            gap: '20px',
                            alignItems: 'center'
                        }}
                    >
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
                                value={quotationDetail.status}
                                onChange={e => {
                                    setOpenDialog(true)
                                    setTempStatus(e.target.value)
                                }}
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
                                        minWidth: '100px',
                                        color: 'var(--text-color)',
                                        padding: '9px 14px'
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
                                                '&:hover': {
                                                    backgroundColor: 'var(--background-color-item-hover)'
                                                },
                                                '&.Mui-selected': {
                                                    backgroundColor: 'var(--background-color-item-selected)',
                                                    '&:hover': {
                                                        backgroundColor: 'var(--background-color-item-hover)'
                                                    }
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
                                    value='pending'
                                    sx={{
                                        mt: '3px',
                                        borderRadius: '6px'
                                    }}
                                >
                                    {t('COMMON.ORDER.PENDING')}
                                </MenuItem>

                                <MenuItem
                                    value='completed'
                                    sx={{
                                        mt: '3px',
                                        borderRadius: '6px'
                                    }}
                                >
                                    {t('COMMON.QUOTATION.COMPLETED')}
                                </MenuItem>

                                <MenuItem
                                    value='cancelled'
                                    sx={{
                                        mt: '3px',
                                        borderRadius: '6px'
                                    }}
                                >
                                    {t('COMMON.ORDER.CANCELLED')}
                                </MenuItem>
                            </Select>
                        </FormControl>

                        <Button
                            startIcon={<Printer size={20} color='var(--text-color-button-save)' />}
                            sx={{
                                textTransform: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px',
                                padding: '7px 20px',
                                whiteSpace: 'nowrap',
                                borderRadius: '10px',
                                fontSize: '15px',
                                fontWeight: 'bold',
                                backgroundColor: 'var(--background-color-button-save)',
                                '&:hover': {
                                    backgroundColor: 'var(--background-color-button-save-hover)'
                                },
                                color: 'var(--text-color-button-save)'
                            }}
                        >
                            {t('COMMON.BUTTON.PRINT')}
                        </Button>
                    </Box>
                </Box>

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: '2fr 1fr',
                        gap: '24px'
                    }}
                >
                    <Box>
                        <Paper
                            sx={{
                                borderRadius: '15px',
                                padding: '24px',
                                backgroundColor: 'var(--background-color-item)'
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    mt: '-7px'
                                }}
                            >
                                <Typography
                                    sx={{
                                        color: 'var(--text-color)',
                                        fontWeight: 'bold',
                                        fontSize: '18px',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                                >
                                    {t('COMMON.ORDER.DETAIL')}
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    width: '100%',
                                    mt: '18px'
                                }}
                            >
                                {quotationDetail.items.map((item, index) => {
                                    return (
                                        <Box
                                            key={index}
                                            sx={{
                                                display: 'flex',
                                                width: '100%',
                                                alignItems: 'center',
                                                mt: index !== 0 ? '20px' : 0
                                            }}
                                        >
                                            <Avatar
                                                src={item.image}
                                                sx={{
                                                    width: '60px',
                                                    height: '60px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    borderRadius: '10px',
                                                    mr: '20px'
                                                }}
                                            />

                                            <Box
                                                sx={{
                                                    width: '60%'
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        color: 'var(--text-color)',
                                                        maxWidth: '100%',
                                                        fontSize: '15px'
                                                    }}
                                                >
                                                    {item.productName}
                                                </Typography>

                                                <Typography
                                                    sx={{
                                                        color: 'var(--label-title-color)',
                                                        mt: '4px',
                                                        fontSize: '13px'
                                                    }}
                                                >
                                                    {item.sku}
                                                </Typography>

                                                <Typography
                                                    sx={{
                                                        color: 'var(--label-title-color)',
                                                        mt: '4px',
                                                        fontSize: '13px'
                                                    }}
                                                >
                                                    {item.variants}
                                                </Typography>
                                            </Box>

                                            <Typography
                                                sx={{
                                                    fontSize: '15px',
                                                    mr: '5px',
                                                    width: '5%',
                                                    textAlign: 'right',
                                                    color: 'var(--text-color)'
                                                }}
                                            >
                                                x{item.quantity}
                                            </Typography>
                                        </Box>
                                    )
                                })}
                            </Box>

                            {quotationDetail.additionalInformation && (
                                <Box
                                    sx={{
                                        mt: '24px',
                                        backgroundColor: 'var(--background-color-secondary)',
                                        borderRadius: '6px',
                                        padding: '12px 15px',
                                        borderLeft: '4px solid var(--primary-color)',
                                        display: 'flex',
                                        gap: '10px'
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: '14px',
                                            fontWeight: 'bold',
                                            color: 'var(--text-color)'
                                        }}
                                    >
                                        {t('COMMON.QUOTATION.ADDITIONAL_INFORMATION')}:
                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontSize: '14px',
                                            color: 'var(--text-color)'
                                        }}
                                    >
                                        {quotationDetail.additionalInformation}
                                    </Typography>
                                </Box>
                            )}
                        </Paper>
                    </Box>

                    <Paper
                        sx={{
                            borderRadius: '15px',
                            height: 'fit-content',
                            padding: '24px',
                            backgroundColor: 'var(--background-color-item)'
                        }}
                    >
                        <Box>
                            <Typography
                                sx={{
                                    color: 'var(--text-color)',
                                    fontWeight: 'bold',
                                    fontSize: '18px',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                {t('COMMON.ORDER.CUSTOMER_INFO')}
                            </Typography>

                            <Box
                                sx={{
                                    mt: '24px',
                                    display: 'flex',
                                    gap: '20px'
                                }}
                            >
                                <Avatar
                                    src={quotationDetail.customerAvatar}
                                    sx={{
                                        width: '50px',
                                        height: '50px'
                                    }}
                                />

                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '4px'
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            color: 'var(--text-color)',
                                            fontSize: '15px',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        {quotationDetail.customerFullName}
                                    </Typography>

                                    <Typography
                                        sx={{
                                            color: 'var(--label-title-color)',
                                            fontSize: '15px'
                                        }}
                                    >
                                        {quotationDetail.customerEmail}
                                    </Typography>

                                    <Typography
                                        sx={{
                                            color: 'var(--label-title-color)',
                                            fontSize: '15px'
                                        }}
                                    >
                                        {quotationDetail.customerPhone}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>

                        <Divider
                            sx={{
                                borderColor: 'var(--border-color)',
                                mt: '24px',
                                mx: '-24px',
                                borderStyle: 'dashed'
                            }}
                        />

                        <Box sx={{ mt: '24px' }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    mt: '-7px'
                                }}
                            >
                                <Typography
                                    sx={{
                                        color: 'var(--text-color)',
                                        fontWeight: 'bold',
                                        fontSize: '18px',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                                >
                                    {t('COMMON.QUOTATION.ASSIGNEE_INFO')}
                                </Typography>

                                {isEdit ? (
                                    <SaveAsIcon
                                        sx={{
                                            color: 'var(--label-title-color)',
                                            padding: '8px',
                                            mt: '-3px',
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            cursor: 'pointer',
                                            '&:hover': {
                                                backgroundColor: 'var(--background-color-item-hover)'
                                            }
                                        }}
                                        onClick={() => {
                                            handleUpdateResponsible()
                                        }}
                                    />
                                ) : (
                                    <EditRoundedIcon
                                        sx={{
                                            color: 'var(--label-title-color)',
                                            padding: '8px',
                                            mt: '-3px',
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            cursor: 'pointer',
                                            '&:hover': {
                                                backgroundColor: 'var(--background-color-item-hover)'
                                            }
                                        }}
                                        onClick={() => setIsEdit(true)}
                                    />
                                )}
                            </Box>

                            <Box>
                                {isEdit ? (
                                    <FormControl
                                        sx={{
                                            mt: '15px',
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
                                            },
                                            '& .MuiInputLabel-root': {
                                                color: 'var(--label-title-color)' // Label mặc định
                                            },
                                            '&:hover .MuiInputLabel-root': {
                                                color: 'var(--field-color-selected)' // Thay đổi màu label khi hover vào input
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                fontWeight: 'bold',
                                                color: 'var(--field-color-selected)' // Label khi focus
                                            }
                                        }}
                                    >
                                        <InputLabel id='select-label'>
                                            {t('COMMON.QUOTATION.RESPONSIBLE_EMPLOYEE')}
                                        </InputLabel>
                                        <Select
                                            label={t('COMMON.QUOTATION.RESPONSIBLE_EMPLOYEE')}
                                            value={responsibleEmployee?.id || ''}
                                            onChange={e =>
                                                setResponsibleEmployee(
                                                    employees.find(emp => emp.id === e.target.value) || null
                                                )
                                            }
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
                                                    padding: '14px 14px'
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
                                                            '&:hover': {
                                                                backgroundColor: 'var(--background-color-item-hover)'
                                                            },
                                                            '&.Mui-selected': {
                                                                backgroundColor:
                                                                    'var(--background-color-item-selected)',
                                                                '&:hover': {
                                                                    backgroundColor:
                                                                        'var(--background-color-item-hover)'
                                                                }
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
                                            {employees &&
                                                employees.map((item, index) => (
                                                    <MenuItem
                                                        key={index}
                                                        value={String(item.id)}
                                                        sx={{
                                                            mt: '4px',
                                                            borderRadius: '6px'
                                                        }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                width: '100%'
                                                            }}
                                                        >
                                                            <Avatar
                                                                src={item.avatar}
                                                                sx={{
                                                                    width: '42px',
                                                                    height: '42px',
                                                                    marginRight: '15px'
                                                                }}
                                                            />
                                                            <Box>
                                                                <Typography
                                                                    sx={{
                                                                        color: 'var(--text-color)',
                                                                        fontSize: '15px',
                                                                        fontWeight: 'bold'
                                                                    }}
                                                                >
                                                                    {item.fullName}
                                                                </Typography>

                                                                <Typography
                                                                    sx={{
                                                                        color: 'var(--label-title-color)',
                                                                        fontSize: '14px'
                                                                    }}
                                                                >
                                                                    {item.phoneNumber}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </MenuItem>
                                                ))}
                                        </Select>
                                    </FormControl>
                                ) : quotationDetail.responsibleName ? (
                                    <Box
                                        sx={{
                                            mt: '15px',
                                            display: 'flex',
                                            gap: '20px'
                                        }}
                                    >
                                        <Avatar
                                            src={quotationDetail.responsibleAvatar}
                                            sx={{
                                                width: '50px',
                                                height: '50px'
                                            }}
                                        />

                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '4px'
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    color: 'var(--text-color)',
                                                    fontSize: '15px',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                {quotationDetail.responsibleName}
                                            </Typography>

                                            <Typography
                                                sx={{
                                                    color: 'var(--label-title-color)',
                                                    fontSize: '15px'
                                                }}
                                            >
                                                {quotationDetail.responsiblePhone}
                                            </Typography>
                                        </Box>
                                    </Box>
                                ) : (
                                    <Typography
                                        sx={{
                                            color: 'var(--primary-color)',
                                            fontSize: '16px',
                                            fontWeight: 'bold',
                                            mt: '10px'
                                        }}
                                    >
                                        Chưa có người phụ trách
                                    </Typography>
                                )}

                                {quotationDetail.quotationDate && quotationDetail.quotationExpiryDate && (
                                    <Box>
                                        <TableContainer>
                                            <Table sx={{ tableLayout: 'fixed', width: '100%' }}>
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell
                                                            sx={{
                                                                width: '130px',
                                                                border: 'none',
                                                                verticalAlign: 'top',
                                                                padding: '20px 0 10px'
                                                            }}
                                                        >
                                                            <Typography
                                                                sx={{
                                                                    fontSize: '15px',
                                                                    mb: 'auto',
                                                                    color: 'var(--label-title-color)'
                                                                }}
                                                            >
                                                                {t('COMMON.QUOTATION.ISSUED_DATE')}
                                                            </Typography>
                                                        </TableCell>

                                                        <TableCell
                                                            sx={{
                                                                border: 'none',
                                                                padding: '20px 0 10px'
                                                            }}
                                                        >
                                                            <Typography
                                                                sx={{
                                                                    fontSize: '15px',
                                                                    color: 'var(--text-color)',
                                                                    textAlign: 'left'
                                                                }}
                                                            >
                                                                {new Date(
                                                                    quotationDetail.quotationDate
                                                                ).toLocaleDateString('vi-VN', {
                                                                    year: 'numeric',
                                                                    month: '2-digit',
                                                                    day: '2-digit',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                            </Typography>
                                                        </TableCell>
                                                    </TableRow>

                                                    <TableRow>
                                                        <TableCell
                                                            sx={{
                                                                width: '130px',
                                                                border: 'none',
                                                                verticalAlign: 'top',
                                                                padding: '10px 0 10px'
                                                            }}
                                                        >
                                                            <Typography
                                                                sx={{
                                                                    fontSize: '15px',
                                                                    mb: 'auto',
                                                                    color: 'var(--label-title-color)'
                                                                }}
                                                            >
                                                                {t('COMMON.QUOTATION.QUOTATION_VALIDITY')}
                                                            </Typography>
                                                        </TableCell>

                                                        <TableCell
                                                            sx={{
                                                                border: 'none',
                                                                padding: '10px 0 10px'
                                                            }}
                                                        >
                                                            <Typography
                                                                sx={{
                                                                    fontSize: '15px',
                                                                    color: 'var(--text-color)',
                                                                    textAlign: 'left'
                                                                }}
                                                            >
                                                                {new Date(
                                                                    quotationDetail.quotationExpiryDate
                                                                ).toLocaleDateString('vi-VN', {
                                                                    year: 'numeric',
                                                                    month: '2-digit',
                                                                    day: '2-digit',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                            </Typography>
                                                        </TableCell>
                                                    </TableRow>

                                                    <TableRow>
                                                        <TableCell
                                                            sx={{
                                                                width: '130px',
                                                                border: 'none',
                                                                padding: '10px 0 0',
                                                                textAlign: 'left'
                                                            }}
                                                        >
                                                            <Typography
                                                                sx={{
                                                                    fontSize: '15px',
                                                                    color: 'var(--label-title-color)'
                                                                }}
                                                            >
                                                                {t('COMMON.PURCHASE_ORDER.EMAIL')}
                                                            </Typography>
                                                        </TableCell>

                                                        <TableCell
                                                            sx={{
                                                                border: 'none',
                                                                padding: '10px 0 0'
                                                            }}
                                                        >
                                                            <Typography
                                                                sx={{
                                                                    fontSize: '15px',
                                                                    color: 'var(--text-color)',
                                                                    textAlign: 'left'
                                                                }}
                                                            >
                                                                {quotationDetail.responsibleEmail}
                                                            </Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    </Paper>
                </Box>
            </Box>
            {openDialog && (
                <AlertDialog
                    title={'Xác nhận cập nhật đơn hàng'}
                    quoteCode={quotationDetail.quotationCode}
                    isLoading={false}
                    content={'Bạn có chắc chắn muốn cập nhật trạng thái báo giá này?'}
                    status={tempStatus}
                    open={openDialog}
                    setOpen={() => setOpenDialog(false)}
                    buttonCancel={t('COMMON.ALERT_DIALOG.CANCEL')}
                    buttonConfirm={'Xác nhận'}
                />
            )}
        </>
    )
}
