'use client'

import {
    Avatar,
    Box,
    Button,
    Checkbox,
    FormControl,
    ListItemText,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { SaveIcon, Trash2, XIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import LoadingButton from '@mui/lab/LoadingButton'
import { useToast } from '@/hooks/useToast'
import AddAPhotoRoundedIcon from '@mui/icons-material/AddAPhotoRounded'
import uploadImageToCloudinary from '@/common/uploadImageToCloudinary'
import { useCreateEmployeeMutation } from '@/services/EmployeeService'
import dayjs from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers'
import { convertToVietnamTime } from '@/common/format'
import { useGetAllRolesQuery } from '@/services/AspNetRoleService'

function Page() {
    const { t } = useTranslation('common')
    const router = useRouter()
    const toast = useToast()
    const [isSubmit, setIsSubmit] = useState(false)
    const [fullName, setFullName] = useState('')
    const [birthday, setBirthday] = useState(dayjs(new Date()).format('YYYY-MM-DD'))
    const [address, setAddress] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [gender, setGender] = useState<boolean>(true)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [roles, setRoles] = useState<string[]>([])
    const [avatarPath, setAvatarPath] = useState<string>('')
    const [fileImage, setFileImage] = useState<File | null>(null)
    const [createEmployee] = useCreateEmployeeMutation()
    const { data: roleResponse } = useGetAllRolesQuery({
        pageNumber: 1,
        pageSize: 100,
        sortBy: 'Name',
        isDescending: false
    })
    const roleData = roleResponse?.data.records || []

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
            fullName === '' ||
            birthday === '' ||
            address === '' ||
            username === '' ||
            phoneNumber === '' ||
            email === '' ||
            password === '' ||
            !gender ||
            roles.length === 0
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
            fullName: fullName,
            birthday: birthday,
            address: address,
            username: username,
            phoneNumber: phoneNumber,
            email: email,
            avatar: avatarPath,
            password: password,
            gender: gender,
            roles: roles
        }

        try {
            await createEmployee(data).unwrap()
            setIsSubmit(false)
            toast(t('COMMON.EMPLOYEES.CREATE_EMPLOYEE_SUCCESS'), 'success')
            return true
        } catch (error) {
            toast(error.data?.detail, 'error')
            return false
        } finally {
            setIsLoading(false)
        }
    }

    const handleSaveAndClose = async () => {
        const isSuccess = await handleSave()
        if (isSuccess) {
            router.push('/admin/employees')
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
                    {t('COMMON.EMPLOYEES.CREATE_EMPLOYEE')}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px', mt: '24px' }}>
                    <Box
                        sx={{
                            flex: 1
                        }}
                    >
                        <TextField
                            variant='outlined'
                            label={t('COMMON.EMPLOYEES.FULL_NAME')}
                            error={isSubmit && fullName.trim() === ''}
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
                            value={fullName}
                            onChange={e => setFullName(e.target.value)}
                        />
                        {isSubmit && fullName.trim() === '' && (
                            <Typography sx={{ color: 'var(--error-color)', fontSize: '13px', margin: '8px 14px -5px' }}>
                                {t('COMMON.REQUIRED', { field: t('COMMON.EMPLOYEES.FULL_NAME') })}
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
                                label={t('COMMON.EMPLOYEES.USERNAME')}
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
                                error={isSubmit && username.trim() === ''}
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                            />
                            {isSubmit && username.trim() === '' && (
                                <Typography
                                    sx={{ color: 'var(--error-color)', fontSize: '13px', margin: '8px 14px -5px' }}
                                >
                                    {t('COMMON.REQUIRED', { field: t('COMMON.EMPLOYEES.USERNAME') })}
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
                                label={t('COMMON.EMPLOYEES.PASSWORD')}
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
                                error={isSubmit && password.trim() === ''}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                            {isSubmit && password.trim() === '' && (
                                <Typography
                                    sx={{ color: 'var(--error-color)', fontSize: '13px', margin: '8px 14px -5px' }}
                                >
                                    {t('COMMON.REQUIRED', { field: t('COMMON.EMPLOYEES.PASSWORD') })}
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
                                label={t('COMMON.EMPLOYEES.PHONE_NUMBER')}
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
                                    {t('COMMON.REQUIRED', { field: t('COMMON.EMPLOYEES.PHONE_NUMBER') })}
                                </Typography>
                            )}
                        </Box>
                    </Box>

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
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '24px',
                            alignItems: 'top',
                            width: '100%'
                        }}
                    >
                        <Box
                            sx={{
                                flex: 1
                            }}
                        >
                            <Typography
                                sx={{ fontSize: '16px', color: 'var(--text-color)', fontWeight: 'bold', mb: '10px' }}
                            >
                                {t('COMMON.EMPLOYEES.BIRTHDAY')}
                            </Typography>

                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    value={dayjs(birthday)}
                                    onAccept={value => setBirthday(convertToVietnamTime(value?.toDate() || new Date()))}
                                    sx={{
                                        width: '100%',
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
                                            borderColor: 'var(--error-color)  !important' // Màu viền khi lỗi và focus
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
                                {t('COMMON.EMPLOYEES.GENDER')}
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
                                    value={gender ? 'male' : 'female'}
                                    onChange={e => setGender(e.target.value === 'male' ? true : false)}
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
                                            padding: '16.5px 14px'
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
                                                backgroundSize: '30%, 30%',
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
                                        value='male'
                                        sx={{
                                            borderRadius: '6px'
                                        }}
                                    >
                                        {t('COMMON.EMPLOYEES.MALE')}
                                    </MenuItem>

                                    <MenuItem
                                        value='female'
                                        sx={{
                                            mt: '3px',
                                            borderRadius: '6px'
                                        }}
                                    >
                                        {t('COMMON.EMPLOYEES.FEMALE')}
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            flex: 1
                        }}
                    >
                        <Typography
                            sx={{ fontSize: '16px', color: 'var(--text-color)', fontWeight: 'bold', mb: '10px' }}
                        >
                            {t('COMMON.EMPLOYEES.ROLES')}
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
                                multiple
                                value={roles}
                                onChange={e => {
                                    const value = e.target.value
                                    setRoles(typeof value === 'string' ? value.split(',') : value)
                                }}
                                renderValue={selected => (selected as string[]).join(', ')}
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
                                        padding: '16.5px 14px'
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
                                            backgroundSize: '30%, 30%',
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
                                {roleData.map((role, index) => (
                                    <MenuItem
                                        key={role.id}
                                        value={role.name}
                                        sx={{
                                            mt: index > 0 ? '3px' : 0,
                                            borderRadius: '6px'
                                        }}
                                    >
                                        <Checkbox checked={roles.includes(role.name)} />
                                        <ListItemText primary={role.name} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
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
