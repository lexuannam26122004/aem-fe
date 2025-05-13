'use client'

import { Avatar, Box, Button, InputLabel, Paper, TextField, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { SaveIcon, Trash2, XIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCreateSupplierMutation, useGetCountPartnerQuery } from '@/services/SupplierService'
import { useRef, useState } from 'react'
import LoadingButton from '@mui/lab/LoadingButton'
import { useToast } from '@/hooks/useToast'
import AddAPhotoRoundedIcon from '@mui/icons-material/AddAPhotoRounded'
import uploadImageToCloudinary from '@/common/uploadImageToCloudinary'

function Page() {
    const { t } = useTranslation('common')
    const router = useRouter()
    const toast = useToast()
    const [isSubmit, setIsSubmit] = useState(false)
    const [supplierName, setSupplierName] = useState('')
    const [contactName, setContactName] = useState('')
    const [address, setAddress] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [email, setEmail] = useState('')
    const [taxID, setTaxID] = useState('')
    const [description, setDescription] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [url, setUrl] = useState<string>('')
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [avatarPath, setAvatarPath] = useState<string>('')
    const [fileImage, setFileImage] = useState<File | null>(null)
    const [createSupplier] = useCreateSupplierMutation()
    const { refetch: countRefetch } = useGetCountPartnerQuery()

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
        setAvatarPath('')
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
                setAvatarPath('')
                setFileImage(null)
            }
            return
        }

        const reader = new FileReader()

        reader.onloadend = () => {
            setAvatarPath(reader.result as string)
        }

        reader.readAsDataURL(file)
        setFileImage(file)
    }

    const handleSave = async () => {
        setIsSubmit(true)

        if (
            supplierName === '' ||
            contactName === '' ||
            address === '' ||
            description === '' ||
            phoneNumber === '' ||
            email === '' ||
            taxID === ''
        ) {
            return
        }

        setIsLoading(true)

        let avatarPath: string | undefined = undefined
        if (fileImage) {
            avatarPath = await uploadImageToCloudinary(fileImage)
            if (!avatarPath) {
                toast(t('COMMON.UPLOAD_IMAGE_FAIL'), 'error')
            }
        }

        const data = {
            supplierName: supplierName,
            contactName: contactName,
            address: address,
            taxID: taxID,
            phoneNumber: phoneNumber,
            email: email,
            description: description,
            url: url,
            avatarPath: avatarPath
        }

        try {
            await createSupplier(data).unwrap()
            setIsSubmit(false)
            toast(t('COMMON.SUPPLIERS.CREATE_SUPPLIER_SUCCESS'), 'success')
            countRefetch()
            return true
        } catch (error) {
            toast(t('COMMON.SUPPLIERS.CREATE_SUPPLIER_FAIL'), 'error')
            return false
        } finally {
            setIsLoading(false)
        }
    }

    const handleSaveAndClose = async () => {
        const isSuccess = await handleSave()
        if (isSuccess) {
            router.push('/admin/suppliers')
        }
    }

    return (
        <Box sx={{ width: '100%', maxWidth: '1100px', margin: '0 auto', display: 'flex', gap: '24px' }}>
            <Paper
                sx={{
                    width: '400px',
                    maxWidth: '32%',
                    borderRadius: '15px',
                    backgroundColor: 'var(--background-color-item)',
                    height: '400px',
                    backgroundImage:
                        'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSJ1cmwoI3BhaW50MF9yYWRpYWxfMjc0OV8xNDUxODYpIiBmaWxsLW9wYWNpdHk9IjAuMTIiLz4KPGRlZnM+CjxyYWRpYWxHcmFkaWVudCBpZD0icGFpbnQwX3JhZGlhbF8yNzQ5XzE0NTE4NiIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgxMjAgMS44MTgxMmUtMDUpIHJvdGF0ZSgtNDUpIHNjYWxlKDEyMy4yNSkiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMDBCOEQ5Ii8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzAwQjhEOSIgc3RvcC1vcGFjaXR5PSIwIi8+CjwvcmFkaWFsR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+Cg==), url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSJ1cmwoI3BhaW50MF9yYWRpYWxfMjc0OV8xNDUxODcpIiBmaWxsLW9wYWNpdHk9IjAuMTIiLz4KPGRlZnM+CjxyYWRpYWxHcmFkaWVudCBpZD0icGFpbnQwX3JhZGlhbF8yNzQ5XzE0NTE4NyIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIDEyMCkgcm90YXRlKDEzNSkgc2NhbGUoMTIzLjI1KSI+CjxzdG9wIHN0b3AtY29sb3I9IiNGRjU2MzAiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjRkY1NjMwIiBzdG9wLW9wYWNpdHk9IjAiLz4KPC9yYWRpYWxHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K)',
                    backgroundPosition: 'top right, bottom left',
                    backgroundSize: '60%, 60%',
                    backgroundRepeat: 'no-repeat',
                    backdropFilter: 'blur(20px)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '24px',
                    justifyContent: 'center'
                }}
            >
                <Box
                    sx={{
                        width: '150px',
                        height: '150px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px dashed rgba(145, 158, 171, 0.3)'
                    }}
                >
                    <Box
                        sx={{
                            backgroundColor: 'rgba(145, 158, 171, 0.08)',
                            borderRadius: '50%',
                            width: '132px',
                            height: '132px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '8px',
                            justifyContent: 'center',
                            '&:hover': {
                                backgroundColor: 'rgba(145, 158, 171, 0.11)',
                                cursor: 'pointer'
                            },
                            '&:hover .avatar-with-overlay': {
                                opacity: 0.5
                            },
                            '&:hover .icon-upload-image, &:hover .text-upload-image': {
                                color: avatarPath ? '#fff' : 'rgba(145, 158, 171, 0.8)',
                                display: 'block',
                                zIndex: 2
                            }
                        }}
                        onClick={handleClickBox}
                    >
                        <AddAPhotoRoundedIcon
                            className='icon-upload-image'
                            sx={{
                                fontSize: '30px',
                                color: 'var(--label-title-color)',
                                display: avatarPath ? 'none' : 'block'
                            }}
                        />
                        <Typography
                            className='text-upload-image'
                            sx={{
                                fontSize: '13px',
                                color: 'var(--label-title-color)',
                                display: avatarPath ? 'none' : 'block'
                            }}
                        >
                            {t('COMMON.UPLOAD_IMAGE')}
                        </Typography>
                        <Avatar
                            className='avatar-with-overlay'
                            sx={{
                                width: '132px',
                                height: '132px',
                                opacity: 1,
                                transition: 'opacity 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                                position: 'absolute',
                                display: avatarPath ? 'block' : 'none'
                            }}
                            src={avatarPath}
                        />
                        <input
                            type='file'
                            accept='.jpg, .jpeg, .png'
                            style={{ display: 'none' }}
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />
                    </Box>
                </Box>
                <Typography
                    sx={{
                        whiteSpace: 'pre-line',
                        fontSize: '13px',
                        color: 'var(--placeholder-color)',
                        width: '60%',
                        textAlign: 'center'
                    }}
                >
                    {t('COMMON.MAX_SIZE_IMAGE')}
                </Typography>

                {avatarPath && (
                    <Box
                        sx={{
                            gap: '10px',
                            padding: '6px 10px',
                            borderRadius: '8px',
                            border: '1px solid var(--text-color-button-cancel)',
                            '&:hover': {
                                cursor: 'pointer',
                                border: '1px solid var(--background-color-button-cancel-hover)',
                                backgroundColor: 'var(--background-color-button-cancel-hover)'
                            },
                            display: 'flex',
                            alignItems: 'bottom'
                        }}
                        onClick={handleDeleteImage}
                    >
                        <Trash2
                            size={17}
                            color='var(--text-color-button-cancel)'
                            style={{
                                marginTop: '1px'
                            }}
                        />
                        <Typography
                            sx={{
                                fontSize: '14px',
                                color: 'var(--text-color-button-cancel)',
                                fontWeight: 'bold',
                                textAlign: 'center'
                            }}
                        >
                            {t('COMMON.REMOVE_IMAGE')}
                        </Typography>
                    </Box>
                )}
            </Paper>
            <Paper
                sx={{
                    flex: 1,
                    overflow: 'hidden',
                    borderRadius: '15px',
                    backgroundColor: 'var(--background-color-item)',
                    padding: '24px'
                }}
            >
                <Typography sx={{ fontWeight: 'bold', fontSize: '22px', color: 'var(--text-color)' }}>
                    {t('COMMON.SUPPLIERS.CREATE_SUPPLIER')}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px', mt: '24px' }}>
                    <Box
                        sx={{
                            flex: 1
                        }}
                    >
                        <TextField
                            variant='outlined'
                            label={t('COMMON.SUPPLIERS.SUPPLIER_NAME')}
                            error={isSubmit && supplierName.trim() === ''}
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
                                    fontSize: '16px',
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
                            value={supplierName}
                            onChange={e => setSupplierName(e.target.value)}
                        />
                        {isSubmit && supplierName.trim() === '' && (
                            <Typography sx={{ color: 'var(--error-color)', fontSize: '13px', margin: '8px 14px -5px' }}>
                                {t('COMMON.REQUIRED', { field: t('COMMON.SUPPLIERS.SUPPLIER_NAME') })}
                            </Typography>
                        )}
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '24px',
                            alignItems: 'top',
                            width: '100%'
                        }}
                    >
                        <Box
                            sx={{
                                width: '50%'
                            }}
                        >
                            <TextField
                                variant='outlined'
                                label={t('COMMON.SUPPLIERS.CONTACT_NAME')}
                                sx={{
                                    width: '100%',
                                    '& fieldset': {
                                        borderRadius: '8px',
                                        color: 'var(--text-color)',
                                        borderColor: 'var(--border-color)'
                                    },
                                    '& .MuiInputBase-root': {
                                        paddingRight: '8px'
                                    },
                                    '& .MuiInputBase-input': {
                                        scrollbarGutter: 'stable',
                                        '&::-webkit-scrollbar': {
                                            width: '7px',
                                            height: '7px'
                                        },
                                        '&::-webkit-scrollbar-thumb': {
                                            backgroundColor: 'var(--scrollbar-color)',
                                            borderRadius: '10px'
                                        },
                                        paddingRight: '4px',
                                        color: 'var(--text-color)',
                                        fontSize: '16px',
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
                                error={isSubmit && contactName.trim() === ''}
                                value={contactName}
                                onChange={e => setContactName(e.target.value)}
                            />
                            {isSubmit && contactName.trim() === '' && (
                                <Typography
                                    sx={{ color: 'var(--error-color)', fontSize: '13px', margin: '8px 14px -5px' }}
                                >
                                    {t('COMMON.REQUIRED', { field: t('COMMON.SUPPLIERS.CONTACT_NAME') })}
                                </Typography>
                            )}
                        </Box>

                        <Box
                            sx={{
                                width: '50%'
                            }}
                        >
                            <TextField
                                variant='outlined'
                                label={t('COMMON.SUPPLIERS.PHONE')}
                                sx={{
                                    width: '100%',
                                    '& fieldset': {
                                        borderRadius: '8px',
                                        color: 'var(--text-color)',
                                        borderColor: 'var(--border-color)'
                                    },
                                    '& .MuiInputBase-root': {
                                        paddingRight: '8px'
                                    },
                                    '& .MuiInputBase-input': {
                                        scrollbarGutter: 'stable',
                                        '&::-webkit-scrollbar': {
                                            width: '7px',
                                            height: '7px'
                                        },
                                        '&::-webkit-scrollbar-thumb': {
                                            backgroundColor: 'var(--scrollbar-color)',
                                            borderRadius: '10px'
                                        },
                                        paddingRight: '4px',
                                        color: 'var(--text-color)',
                                        fontSize: '16px',
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
                                error={isSubmit && phoneNumber.trim() === ''}
                                value={phoneNumber}
                                onChange={e => setPhoneNumber(e.target.value)}
                            />
                            {isSubmit && phoneNumber.trim() === '' && (
                                <Typography
                                    sx={{ color: 'var(--error-color)', fontSize: '13px', margin: '8px 14px -5px' }}
                                >
                                    {t('COMMON.REQUIRED', { field: t('COMMON.SUPPLIERS.PHONE') })}
                                </Typography>
                            )}
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '24px',
                            alignItems: 'top',
                            width: '100%'
                        }}
                    >
                        <Box
                            sx={{
                                width: '50%'
                            }}
                        >
                            <TextField
                                variant='outlined'
                                type='email'
                                label={t('COMMON.SUPPLIERS.EMAIL')}
                                sx={{
                                    width: '100%',
                                    '& fieldset': {
                                        borderRadius: '8px',
                                        color: 'var(--text-color)',
                                        borderColor: 'var(--border-color)'
                                    },
                                    '& .MuiInputBase-root': {
                                        paddingRight: '8px'
                                    },
                                    '& .MuiInputBase-input': {
                                        scrollbarGutter: 'stable',
                                        '&::-webkit-scrollbar': {
                                            width: '7px',
                                            height: '7px'
                                        },
                                        '&::-webkit-scrollbar-thumb': {
                                            backgroundColor: 'var(--scrollbar-color)',
                                            borderRadius: '10px'
                                        },
                                        paddingRight: '4px',
                                        color: 'var(--text-color)',
                                        fontSize: '16px',
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
                                error={isSubmit && email.trim() === ''}
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                            {isSubmit && email.trim() === '' && (
                                <Typography
                                    sx={{ color: 'var(--error-color)', fontSize: '13px', margin: '8px 14px -5px' }}
                                >
                                    {t('COMMON.REQUIRED', { field: t('COMMON.SUPPLIERS.EMAIL') })}
                                </Typography>
                            )}
                        </Box>

                        <Box
                            sx={{
                                width: '50%'
                            }}
                        >
                            <TextField
                                variant='outlined'
                                label={t('COMMON.SUPPLIERS.TAX_CODE')}
                                sx={{
                                    width: '100%',
                                    '& fieldset': {
                                        borderRadius: '8px',
                                        color: 'var(--text-color)',
                                        borderColor: 'var(--border-color)'
                                    },
                                    '& .MuiInputBase-root': {
                                        paddingRight: '8px'
                                    },
                                    '& .MuiInputBase-input': {
                                        scrollbarGutter: 'stable',
                                        '&::-webkit-scrollbar': {
                                            width: '7px',
                                            height: '7px'
                                        },
                                        '&::-webkit-scrollbar-thumb': {
                                            backgroundColor: 'var(--scrollbar-color)',
                                            borderRadius: '10px'
                                        },
                                        paddingRight: '4px',
                                        color: 'var(--text-color)',
                                        fontSize: '16px',
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
                                error={isSubmit && taxID.trim() === ''}
                                value={taxID}
                                onChange={e => setTaxID(e.target.value)}
                            />
                            {isSubmit && taxID.trim() === '' && (
                                <Typography
                                    sx={{ color: 'var(--error-color)', fontSize: '13px', margin: '8px 14px -5px' }}
                                >
                                    {t('COMMON.REQUIRED', { field: t('COMMON.SUPPLIERS.TAX_CODE') })}
                                </Typography>
                            )}
                        </Box>
                    </Box>

                    <TextField
                        variant='outlined'
                        label={t('COMMON.SUPPLIERS.URL')}
                        sx={{
                            width: '100%',
                            '& fieldset': {
                                borderRadius: '8px',
                                color: 'var(--text-color)',
                                borderColor: 'var(--border-color)'
                            },
                            '& .MuiInputBase-root': {
                                paddingRight: '8px'
                            },
                            '& .MuiInputBase-input': {
                                scrollbarGutter: 'stable',
                                '&::-webkit-scrollbar': {
                                    width: '7px',
                                    height: '7px'
                                },
                                '&::-webkit-scrollbar-thumb': {
                                    backgroundColor: 'var(--scrollbar-color)',
                                    borderRadius: '10px'
                                },
                                paddingRight: '4px',
                                color: 'var(--text-color)',
                                fontSize: '16px',
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
                        value={url}
                        onChange={e => setUrl(e.target.value)}
                    />

                    <Box
                        sx={{
                            flex: 1
                        }}
                    >
                        <TextField
                            variant='outlined'
                            label={t('COMMON.SUPPLIERS.ADDRESS')}
                            sx={{
                                width: '100%',
                                '& fieldset': {
                                    borderRadius: '8px',
                                    color: 'var(--text-color)',
                                    borderColor: 'var(--border-color)'
                                },
                                '& .MuiInputBase-root': {
                                    paddingRight: '8px'
                                },
                                '& .MuiInputBase-input': {
                                    paddingRight: '8px',
                                    color: 'var(--text-color)',
                                    fontSize: '16px',
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
                            error={isSubmit && address.trim() === ''}
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                        />
                        {isSubmit && address.trim() === '' && (
                            <Typography sx={{ color: 'var(--error-color)', fontSize: '13px', margin: '8px 14px -5px' }}>
                                {t('COMMON.REQUIRED', { field: t('COMMON.SUPPLIERS.ADDRESS') })}
                            </Typography>
                        )}
                    </Box>

                    <Box
                        sx={{
                            flex: 1
                        }}
                    >
                        <TextField
                            variant='outlined'
                            label={t('COMMON.SUPPLIERS.DESCRIPTION')}
                            id='fullWidth'
                            fullWidth
                            multiline
                            minRows={4}
                            maxRows={8}
                            sx={{
                                '& fieldset': {
                                    borderRadius: '8px',
                                    color: 'var(--text-color)',
                                    borderColor: 'var(--border-color)'
                                },
                                '& .MuiInputBase-root': {
                                    paddingRight: '3px'
                                },
                                '& .MuiInputBase-input': {
                                    scrollbarGutter: 'stable',
                                    '&::-webkit-scrollbar': {
                                        width: '7px',
                                        height: '7px'
                                    },
                                    '&::-webkit-scrollbar-thumb': {
                                        backgroundColor: 'var(--scrollbar-color)',
                                        borderRadius: '10px'
                                    },
                                    paddingRight: '4px',
                                    color: 'var(--text-color)',
                                    fontSize: '16px',
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
                            error={isSubmit && description.trim() === ''}
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                        {isSubmit && description.trim() === '' && (
                            <Typography sx={{ color: 'var(--error-color)', fontSize: '13px', margin: '8px 14px -5px' }}>
                                {t('COMMON.REQUIRED', { field: t('COMMON.SUPPLIERS.DESCRIPTION') })}
                            </Typography>
                        )}
                    </Box>
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
                        onClick={() => {
                            router.push('/admin/suppliers')
                        }}
                    >
                        {t('COMMON.BUTTON.CLOSE')}
                    </Button>
                </Box>
            </Paper>
        </Box>
    )
}

export default Page
