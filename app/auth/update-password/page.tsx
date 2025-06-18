'use client'
import React, { useState } from 'react'
import { Box, Button, Typography, Link } from '@mui/material'
import { useToast } from '@/hooks/useToast'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import LanguageMenu from '@/components/LanguageMenu'
import ColorModeIconDropdown from '@/components/ColorModeIconDropdown'
import { ChevronLeft } from 'lucide-react'
import InputAdornment from '@mui/material/InputAdornment'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import IconButton from '@mui/material/IconButton'

const LoginForm: React.FC = () => {
    const [newPassword, setNewPassword] = useState('')
    const [password, setPassword] = useState('')
    const [isSubmit, setIsSubmit] = useState(false)
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast()
    const router = useRouter()
    const { t } = useTranslation('common')
    const [showPassword, setShowPassword] = React.useState(false)
    const [showNewPassword, setShowNewPassword] = React.useState(false)

    const handleClickShowPassword = () => setShowPassword(show => !show)

    const handleClickShowNewPassword = () => setShowNewPassword(show => !show)

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
    }

    const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
    }

    const handleClick = () => {
        router.push('/')
    }

    const token = new URLSearchParams(window.location.search).get('token')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmit(true)
        if (newPassword === '' || password === '' || email === '' || password.length < 8 || password !== newPassword) {
            return
        }

        setIsLoading(true)

        const updatePassword = {
            Email: email,
            Token: token,
            NewPassword: newPassword,
            Password: password
        }

        try {
            const response = await fetch('https://localhost:44381/api/Auth/ResetPassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json-patch+json'
                },
                body: JSON.stringify(updatePassword)
            })

            if (response.status === 204) {
                toast(t('COMMON.UPDATE_PASSWORD.UPDATE_SUCCESS'), 'success')
                router.push('/login')
                return
            } else {
                toast('Đã xảy ra lỗi. Vui lòng thử lại sau!', 'error')
            }
        } catch {
            toast('Đã xảy ra lỗi. Vui lòng thử lại sau!', 'error')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                textAlign: 'center'
            }}
        >
            <img
                onClick={handleClick}
                src='/images/logo.png'
                style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    cursor: 'pointer',
                    height: '50px',
                    transition: 'all 300ms ease-in-out'
                }}
            />

            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'stretch'
                }}
            >
                <Box
                    sx={{
                        width: 'calc(100% / 5 * 1.8)',
                        padding: '90px 24px',
                        minHeight: '100vh',
                        backgroundImage:
                            'linear-gradient(0deg, var(--palette-background-defaultChannel), var(--palette-background-defaultChannel)), url(https://assets.minimals.cc/public/assets/background/background-3-blur.webp)',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: '30px',
                            color: 'var(--text-color)',
                            fontWeight: 'bold'
                        }}
                    >
                        {t('COMMON.LOGIN.HI')}
                    </Typography>
                    <Typography
                        sx={{
                            mt: '15px',
                            fontSize: '17px',
                            color: 'var(--sub-title-color)'
                        }}
                    >
                        {t('COMMON.LOGIN.MORE_EFFECTIVELY')}
                    </Typography>
                    <Box
                        sx={{
                            mt: '50px',
                            width: '432px'
                        }}
                    >
                        <img
                            alt='Dashboard illustration'
                            src='https://assets.minimals.cc/public/assets/illustrations/illustration-dashboard.webp'
                            style={{
                                width: '100%',
                                objectFit: 'cover',
                                aspectRatio: '4/3'
                            }}
                        ></img>
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            gap: '16px',
                            mt: '50px',
                            alignItems: 'center'
                        }}
                    >
                        <Box>
                            <img
                                alt='Jwt'
                                src='https://assets.minimals.cc/public/assets/icons/platforms/ic-jwt.svg'
                                style={{ width: '40px', height: '40px' }} // Tuỳ chỉnh kích thước icon
                            />
                        </Box>
                        <Box>
                            <img
                                alt='Firebase'
                                src='https://assets.minimals.cc/public/assets/icons/platforms/ic-firebase.svg'
                                style={{ width: '40px', height: '40px' }}
                            />
                        </Box>
                        <Box>
                            <img
                                alt='Amplify'
                                src='https://assets.minimals.cc/public/assets/icons/platforms/ic-amplify.svg'
                                style={{ width: '40px', height: '40px' }}
                            />
                        </Box>
                        <Box>
                            <img
                                alt='Auth0'
                                src='https://assets.minimals.cc/public/assets/icons/platforms/ic-auth0.svg'
                                style={{ width: '40px', height: '40px' }}
                            />
                        </Box>
                        <Box>
                            <img
                                alt='Supabase'
                                src='https://assets.minimals.cc/public/assets/icons/platforms/ic-supabase.svg'
                                style={{ width: '40px', height: '40px' }}
                            />
                        </Box>
                    </Box>
                </Box>
                <Box
                    sx={{
                        width: 'calc(100% / 5 * 3.2)',
                        minHeight: '100vh',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'relative'
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '24px',
                            right: '24px',
                            display: 'flex',
                            gap: '16px',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <LanguageMenu />
                        <ColorModeIconDropdown />
                    </Box>
                    <Box
                        sx={{
                            width: '435px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center'
                        }}
                    >
                        <img
                            src='/images/request-sent.svg'
                            style={{
                                width: '96px',
                                height: '96px',
                                margin: '0 auto',
                                marginBottom: '24px'
                            }}
                        />
                        <Typography
                            sx={{
                                mt: '15px',
                                fontSize: '22px',
                                fontWeight: 'bold',
                                color: 'var(--text-color)'
                            }}
                        >
                            {t('COMMON.UPDATE_PASSWORD.TITLE')}
                        </Typography>

                        <Typography
                            sx={{
                                mt: '10px',
                                fontSize: '16px',
                                color: 'var(--sub-title-color)'
                            }}
                        >
                            {t('COMMON.UPDATE_PASSWORD.DESC')}
                        </Typography>

                        <Box
                            sx={{
                                width: '100%',
                                mt: '40px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'left'
                            }}
                        >
                            <form autoComplete='off'>
                                <FormControl sx={{ width: '100%' }} variant='outlined'>
                                    <InputLabel
                                        htmlFor='outlined-adornment-email'
                                        {...(isSubmit && email === '' && { error: true })}
                                        sx={{
                                            color: 'var(--text-label-color)',
                                            '&.Mui-focused': {
                                                color: 'var(--selected-field-color)'
                                            },
                                            '&.Mui-error': {
                                                color: 'var(--error-color) !important' // Màu khi có lỗi
                                            }
                                        }}
                                        shrink
                                    >
                                        {t('COMMON.REQUEST_PASSWORD.EMAIL_ADDRESS')}
                                    </InputLabel>
                                    <OutlinedInput
                                        notched
                                        onKeyDown={e => {
                                            if (e.key === 'Enter') {
                                                handleSubmit(e)
                                            }
                                        }}
                                        id='outlined-adornment-email'
                                        {...(isSubmit && email === '' && { error: true })}
                                        autoComplete='off' // Ngăn tự động điền
                                        placeholder={t('COMMON.REQUEST_PASSWORD.EMAIL_EXAMPLE')} // Thêm placeholder
                                        sx={{
                                            '& .MuiInputBase-input': {
                                                padding: '17px 0 17px 14px',
                                                color: 'var(--text-color)',
                                                borderRadius: '8px',
                                                overflow: 'hidden'
                                            },
                                            '& fieldset': {
                                                borderColor: 'var(--border-color)',
                                                borderWidth: '1px',
                                                borderRadius: '8px',
                                                overflow: 'hidden'
                                            },
                                            '&:hover fieldset': {
                                                borderColor: 'var(--hover-field-color) !important' // Đảm bảo không bị ghi đè
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: 'var(--selected-field-color) !important',
                                                borderWidth: '2px' // Độ dày viền
                                            },
                                            '&.Mui-error:hover fieldset': {
                                                borderColor: 'var(--error-color) !important'
                                            },
                                            '&.Mui-error fieldset': {
                                                borderColor: 'var(--error-color) !important'
                                            }
                                        }}
                                        label={t('COMMON.REQUEST_PASSWORD.EMAIL_ADDRESS')}
                                        onChange={e => setEmail(e.target.value)}
                                    />
                                </FormControl>
                            </form>
                            <Typography
                                sx={{
                                    color: 'var(--error-color)',
                                    margin: '3px auto 0 12px',
                                    width: 'auto',
                                    fontSize: '12px',
                                    visibility: isSubmit && email === '' ? 'visible' : 'hidden'
                                }}
                            >
                                {t('COMMON.TEXTFIELD.REQUIRED')}
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                width: '100%',
                                mt: '15px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'left'
                            }}
                        >
                            <FormControl sx={{ width: '100%' }} variant='outlined'>
                                <InputLabel
                                    {...(isSubmit && (password === '' || password.length < 8) && { error: true })}
                                    htmlFor='outlined-adornment-password'
                                    sx={{
                                        color: 'var(--text-label-color)',
                                        '&.Mui-focused': {
                                            color: 'var(--selected-field-color)'
                                        },
                                        '&.Mui-error': {
                                            color: 'var(--error-color) !important' // Màu khi có lỗi
                                        }
                                    }}
                                    shrink
                                >
                                    {t('COMMON.UPDATE_PASSWORD.PASSWORD')}
                                </InputLabel>
                                <OutlinedInput
                                    onKeyDown={e => {
                                        if (e.key === 'Enter') {
                                            handleSubmit(e)
                                        }
                                    }}
                                    placeholder={t('COMMON.LOGIN.8_CHARACTERS')}
                                    notched
                                    id='outlined-adornment-password'
                                    {...(isSubmit && (password === '' || password.length < 8) && { error: true })}
                                    autoComplete='off' // Ngăn tự động điền
                                    type={showPassword ? 'text' : 'password'}
                                    onChange={e => setPassword(e.target.value)}
                                    sx={{
                                        '& .MuiInputBase-input': {
                                            padding: '15.5px 0 15.5px 14px',
                                            color: 'var(--text-color)',
                                            borderRadius: '8px',
                                            overflow: 'hidden'
                                        },
                                        '& fieldset': {
                                            borderColor: 'var(--border-color)',
                                            borderWidth: '1px',
                                            borderRadius: '8px',
                                            overflow: 'hidden'
                                        },
                                        '&:hover fieldset': {
                                            borderColor: 'var(--hover-field-color) !important' // Đảm bảo không bị ghi đè
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'var(--selected-field-color) !important',
                                            borderWidth: '2px' // Độ dày viền
                                        },
                                        '&.Mui-error:hover fieldset': {
                                            borderColor: 'var(--error-color) !important'
                                        },
                                        '&.Mui-error fieldset': {
                                            borderColor: 'var(--error-color) !important'
                                        }
                                    }}
                                    endAdornment={
                                        <InputAdornment position='end'>
                                            <IconButton
                                                aria-label={showPassword ? 'hide the password' : 'display the password'}
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                onMouseUp={handleMouseUpPassword}
                                                edge='end'
                                                sx={{
                                                    color: 'var(--text-label-color)'
                                                }}
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    label={t('COMMON.UPDATE_PASSWORD.PASSWORD')}
                                />
                            </FormControl>
                            <Typography
                                sx={{
                                    color: 'var(--error-color)',
                                    margin: '3px auto 0 12px',
                                    width: 'auto',
                                    fontSize: '12px',
                                    visibility:
                                        isSubmit && (password === '' || password.length < 8) ? 'visible' : 'hidden'
                                }}
                            >
                                {password === ''
                                    ? t('COMMON.TEXTFIELD.REQUIRED')
                                    : t('COMMON.CHANGE_PASSWORD.LEAST_8_CHARACTERS')}
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                width: '100%',
                                mt: '15px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'left'
                            }}
                        >
                            <FormControl sx={{ width: '100%' }} variant='outlined'>
                                <InputLabel
                                    {...(isSubmit &&
                                        (newPassword === '' || password !== newPassword) && { error: true })}
                                    htmlFor='outlined-adornment-newPassword'
                                    sx={{
                                        color: 'var(--text-label-color)',
                                        '&.Mui-focused': {
                                            color: 'var(--selected-field-color)'
                                        },
                                        '&.Mui-error': {
                                            color: 'var(--error-color) !important' // Màu khi có lỗi
                                        }
                                    }}
                                    shrink
                                >
                                    {t('COMMON.UPDATE_PASSWORD.CONFIRM')}
                                </InputLabel>
                                <OutlinedInput
                                    notched
                                    onKeyDown={e => {
                                        if (e.key === 'Enter') {
                                            handleSubmit(e)
                                        }
                                    }}
                                    id='outlined-adornment-newPassword'
                                    {...(isSubmit &&
                                        (newPassword === '' || password !== newPassword) && { error: true })}
                                    autoComplete='off' // Ngăn tự động điền
                                    type={showNewPassword ? 'text' : 'password'}
                                    onChange={e => setNewPassword(e.target.value)}
                                    sx={{
                                        '& .MuiInputBase-input': {
                                            padding: '15.5px 0 15.5px 14px',
                                            color: 'var(--text-color)',
                                            borderRadius: '8px',
                                            overflow: 'hidden'
                                        },
                                        '& fieldset': {
                                            borderColor: 'var(--border-color)',
                                            borderWidth: '1px',
                                            borderRadius: '8px',
                                            overflow: 'hidden'
                                        },
                                        '&:hover fieldset': {
                                            borderColor: 'var(--hover-field-color) !important' // Đảm bảo không bị ghi đè
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'var(--selected-field-color) !important',
                                            borderWidth: '2px' // Độ dày viền
                                        },
                                        '&.Mui-error:hover fieldset': {
                                            borderColor: 'var(--error-color) !important'
                                        },
                                        '&.Mui-error fieldset': {
                                            borderColor: 'var(--error-color) !important'
                                        }
                                    }}
                                    endAdornment={
                                        <InputAdornment position='end'>
                                            <IconButton
                                                aria-label={
                                                    showNewPassword ? 'hide the password' : 'display the password'
                                                }
                                                onClick={handleClickShowNewPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                onMouseUp={handleMouseUpPassword}
                                                edge='end'
                                                sx={{
                                                    color: 'var(--text-label-color)'
                                                }}
                                            >
                                                {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    label={t('COMMON.UPDATE_PASSWORD.CONFIRM')}
                                />
                            </FormControl>
                            <Typography
                                sx={{
                                    color: 'var(--error-color)',
                                    margin: '3px auto 0 12px',
                                    width: 'auto',
                                    fontSize: '12px',
                                    visibility:
                                        isSubmit && (newPassword === '' || password !== newPassword)
                                            ? 'visible'
                                            : 'hidden'
                                }}
                            >
                                {password !== newPassword
                                    ? t('COMMON.UPDATE_PASSWORD.EQUAL')
                                    : t('COMMON.TEXTFIELD.REQUIRED')}
                            </Typography>
                        </Box>

                        <Button
                            variant='contained'
                            color='primary'
                            sx={{
                                mt: '20px',
                                height: '100%',
                                fontSize: '18px',
                                padding: '9px',
                                fontWeight: 'bold',
                                color: 'var(--text-button-accept)',
                                backgroundColor: 'var(--bg-button-accept)',
                                borderRadius: '8px',
                                '&:hover': {
                                    backgroundColor: 'var(--bg-button-accept-hover)'
                                },
                                pointerEvents: isLoading ? 'none' : 'auto',
                                textTransform: 'none',
                                opacity: isLoading ? 0.7 : 1 // Làm mờ nhẹ khi đang loading
                            }}
                            onClick={handleSubmit}
                        >
                            {t('COMMON.UPDATE_PASSWORD.UPDATE_PASSWORD')}
                        </Button>

                        <Box
                            sx={{
                                mt: '24px',
                                display: 'flex',
                                gap: '6px',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <ChevronLeft size={18} />
                            <Link
                                href='/login'
                                sx={{
                                    fontSize: '15px',
                                    textDecoration: 'none',
                                    fontWeight: 'bold',
                                    color: 'var(--text-color)',
                                    '&:hover': {
                                        textDecoration: 'underline'
                                    }
                                }}
                            >
                                {t('COMMON.REQUEST_PASSWORD.RETURN_LOGIN')}
                            </Link>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default LoginForm
