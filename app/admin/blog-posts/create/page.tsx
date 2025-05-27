'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { Avatar, Box, Paper, TextField, Typography, FormControlLabel, Switch, Button } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useToast } from '@/hooks/useToast'
import ClearIcon from '@mui/icons-material/Clear'
import { styled } from '@mui/material/styles'
import { SwitchProps } from '@mui/material/Switch'
import { SaveIcon, XIcon } from 'lucide-react'
import dayjs from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { convertToVietnamTime } from '@/common/format'
import { CircleAlert } from 'lucide-react'
import LoadingButton from '@mui/lab/LoadingButton'
import { useRouter } from 'next/navigation'

const TinyMCEEditor = dynamic(() => import('@/components/TinyMCEEditor'), { ssr: false })

const IOSSwitch = styled((props: SwitchProps) => (
    <Switch focusVisibleClassName='.Mui-focusVisible' disableRipple {...props} />
))(({ theme }) => ({
    width: 40,
    height: 24,
    padding: 0,
    '& .MuiSwitch-switchBase': {
        padding: 0,
        margin: 2,
        transitionDuration: '300ms',
        '&.Mui-checked': {
            transform: 'translateX(16px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                backgroundColor: 'var(--primary-color)',
                opacity: 1,
                border: 0,
                ...theme.applyStyles('dark', {
                    backgroundColor: '#2ECA45'
                })
            },
            '&.Mui-disabled + .MuiSwitch-track': {
                opacity: 0.5
            }
        },
        '&.Mui-focusVisible .MuiSwitch-thumb': {
            color: '#33cf4d',
            border: '6px solid #fff'
        },
        '&.Mui-disabled .MuiSwitch-thumb': {
            color: theme.palette.grey[100],
            ...theme.applyStyles('dark', {
                color: theme.palette.grey[600]
            })
        },
        '&.Mui-disabled + .MuiSwitch-track': {
            opacity: 0.7,
            ...theme.applyStyles('dark', {
                opacity: 0.3
            })
        }
    },
    '& .MuiSwitch-thumb': {
        boxSizing: 'border-box',
        width: 20,
        height: 20
    },
    '& .MuiSwitch-track': {
        borderRadius: 26 / 2,
        backgroundColor: 'var(--background-switch)',
        opacity: 1,
        transition: theme.transitions.create(['background-color'], {
            duration: 500
        }),
        ...theme.applyStyles('dark', {
            backgroundColor: '#39393D'
        })
    }
}))

export default function CreatePage() {
    const { t } = useTranslation('common')
    const router = useRouter()
    const [content, setContent] = useState('<p>Nội dung ban đầu của editor</p>')
    const [postTitle, setPostTitle] = useState('')
    const [featuredImage, setFeaturedImage] = useState('')
    const [description, setDescription] = useState('')
    const [isSubmit, setIsSubmit] = useState(false)
    const [isLoading] = useState(false)
    const [isPublished, setIsPublished] = useState(true)
    const [publishDate, setPublishDate] = useState(new Date().toDateString())
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [fileImage, setFileImage] = useState<File | null>(null)
    const [isHovered, setIsHovered] = useState(false)
    useEffect(() => {}, [fileImage])

    const toast = useToast()

    const handleClickBox = () => {
        if (isHovered) {
            return
        }
        if (!fileInputRef?.current) {
            return
        }
        fileInputRef.current.click()
    }

    const handleDeleteImage = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
        setFeaturedImage('')
        setFileImage(null)
        setIsHovered(false)
    }

    const handleSave = () => {
        setIsSubmit(true)
        if (
            postTitle.trim() === '' ||
            description.trim() === '' ||
            featuredImage.trim() === '' ||
            content.trim() === ''
        ) {
            return
        }
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
                setFeaturedImage('')
                setFileImage(null)
            }
            return
        }

        const reader = new FileReader()

        reader.onloadend = () => {
            setFeaturedImage(reader.result as string)
        }

        reader.readAsDataURL(file)
        setFileImage(file)
    }

    const handleSaveAndClose = () => {
        if (fileInputRef.current) {
            // Lấy nội dung từ editor khi người dùng nhấn lưu
            const content = (window as any).tinymce?.activeEditor?.getContent()
            console.log(content) // In ra nội dung
        }
    }

    useEffect(() => {
        console.log(content)
    }, [content])

    return (
        <Paper
            sx={{
                margin: 'auto',
                maxWidth: '800px',
                padding: '24px',
                borderRadius: '15px',
                backgroundColor: 'var(--background-color-item)'
            }}
        >
            <Typography sx={{ fontWeight: 'bold', fontSize: '22px', color: 'var(--text-color)' }}>
                {t('COMMON.POSTS.CREATE_POST')}
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px', mt: '24px' }}>
                <Box
                    sx={{
                        flex: 1
                    }}
                >
                    <TextField
                        variant='outlined'
                        label={t('COMMON.POSTS.POST_TITLE')}
                        error={isSubmit && postTitle.trim() === ''}
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
                        value={postTitle}
                        onChange={e => setPostTitle(e.target.value)}
                    />
                    {isSubmit && postTitle.trim() === '' && (
                        <Typography sx={{ color: 'var(--error-color)', fontSize: '13px', margin: '8px 14px -5px' }}>
                            {t('COMMON.REQUIRED', { field: t('COMMON.POSTS.POST_TITLE') })}
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
                        label={t('COMMON.POSTS.DESCRIPTION')}
                        error={isSubmit && description.trim() === ''}
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
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />
                    {isSubmit && description.trim() === '' && (
                        <Typography sx={{ color: 'var(--error-color)', fontSize: '13px', margin: '8px 14px -5px' }}>
                            {t('COMMON.REQUIRED', { field: t('COMMON.POSTS.DESCRIPTION') })}
                        </Typography>
                    )}
                </Box>

                <Box
                    sx={{
                        flex: 1
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            gap: '50px',
                            mt: '4px',
                            alignItems: 'center',
                            flex: 1
                        }}
                    >
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label={t('COMMON.POSTS.PUBLISH_DATE')}
                                value={dayjs(publishDate)}
                                onAccept={value => setPublishDate(convertToVietnamTime(value?.toDate() || new Date()))}
                                sx={{
                                    width: '30%',
                                    '& .MuiInputBase-root': {
                                        color: 'var(--text-color)'
                                    },
                                    '& .MuiInputBase-input': {
                                        padding: '16.5px 11px'
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

                        <FormControlLabel
                            sx={{
                                mt: '0px',
                                ml: '-8px',
                                '& .MuiFormControlLabel-label': {
                                    color: 'var(--text-color)',
                                    fontSize: '15px',
                                    fontWeight: 'bold'
                                }
                            }}
                            control={
                                <IOSSwitch
                                    sx={{ m: 1, mr: 2 }}
                                    onChange={() => {
                                        setIsPublished(!isPublished)
                                    }}
                                    checked={isPublished}
                                />
                            }
                            label={t('COMMON.POSTS.PUBLISH')}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center', margin: '10px 0px -5px' }}>
                        <CircleAlert size={18} color={'var(--label-title-color)'} />
                        <Typography sx={{ color: 'var(--label-title-color)', fontSize: '13px', mt: '1px' }}>
                            {t('COMMON.POSTS.NOTE_PUBLISH')}
                        </Typography>
                    </Box>
                </Box>

                <Box
                    sx={{
                        flex: 1
                    }}
                >
                    <Typography
                        sx={{ color: 'var(--text-color)', fontSize: '15px', fontWeight: 'bold', marginBottom: '10px' }}
                    >
                        {t('COMMON.POSTS.POST_CONTENT')}
                    </Typography>
                    <TinyMCEEditor
                        apiKey='mlgxg84wttozfctmb9svt074cue9vowla3gl6c8ym0u1q8zd' // Đăng ký API key tại https://www.tiny.cloud/
                        initialValue={content}
                        onChange={(editor: any) => setContent(editor.getContent())}
                    />
                </Box>

                <Box
                    sx={{
                        flex: 1
                    }}
                >
                    <Typography
                        sx={{ color: 'var(--text-color)', fontSize: '15px', fontWeight: 'bold', marginBottom: '10px' }}
                    >
                        {t('COMMON.POSTS.COVER')}
                    </Typography>

                    <Paper
                        elevation={0}
                        sx={{
                            borderRadius: '15px',
                            border: '1px dashed rgba(145, 158, 171, 0.3)',
                            borderColor:
                                isSubmit && featuredImage.trim() === ''
                                    ? 'var(--error-color)'
                                    : 'rgba(145, 158, 171, 0.3)',
                            backgroundColor:
                                isSubmit && featuredImage.trim() === ''
                                    ? 'var(--background-input-error)'
                                    : 'rgba(145, 158, 171, 0.08)',
                            height: '380px',
                            display: 'flex',
                            padding: '10px',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '24px',
                            justifyContent: 'center',
                            transition: 'background-color 0.3s ease, opacity 0.3s ease', // Hiệu ứng mượt mà
                            ...(isHovered
                                ? {}
                                : {
                                      '&:hover': {
                                          backgroundColor:
                                              isSubmit && featuredImage.trim() === ''
                                                  ? 'var(--background-input-error-hover)'
                                                  : 'rgba(145, 158, 171, 0.13)',
                                          cursor: 'pointer'
                                      },
                                      '&:hover .avatar-with-overlay': {
                                          opacity: 0.8,
                                          transition: 'opacity 0.3s ease' // Thêm hiệu ứng mượt mà cho Avatar và Box
                                      },
                                      '&:hover .none-image': {
                                          opacity: 0.8,
                                          transition: 'opacity 0.3s ease' // Thêm hiệu ứng mượt mà cho Avatar và Box
                                      }
                                  })
                        }}
                        onClick={handleClickBox}
                    >
                        {!featuredImage && (
                            <Box
                                className='none-image'
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
                                <Avatar
                                    sx={{ width: '300px', height: '250px', borderRadius: 0, mt: '-35px' }}
                                    src='/images/drop-file.svg'
                                />

                                <Typography
                                    sx={{
                                        mt: '-20px',
                                        fontWeight: 'bold',
                                        fontSize: '18px',
                                        color: 'var(--text-color)'
                                    }}
                                >
                                    {t('COMMON.POSTS.DROP_FILE')}
                                </Typography>

                                <Typography
                                    sx={{
                                        fontWeight: 'bold',
                                        fontSize: '15px',
                                        color: 'var(--label-title-color)'
                                    }}
                                >
                                    {t('COMMON.POSTS.DROP_DESC')}
                                </Typography>
                            </Box>
                        )}
                        {featuredImage && (
                            <Box sx={{ position: 'relative', width: '100%', height: '100%', borderRadius: '12px' }}>
                                <Avatar
                                    className='avatar-with-overlay'
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        borderRadius: '12px'
                                    }}
                                    src={featuredImage}
                                />
                                <ClearIcon
                                    onClick={handleDeleteImage}
                                    sx={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                        width: '30px',
                                        height: '30px',
                                        pointerEvents: 'auto', // Đảm bảo icon nhận sự kiện hover và click
                                        '&:hover': {
                                            cursor: 'pointer',
                                            backgroundColor: '#8e908f'
                                        },
                                        padding: '5px',
                                        zIndex: 10,
                                        borderRadius: '50%',
                                        backgroundColor: '#555a58',
                                        color: '#dddedd',
                                        cursor: 'pointer'
                                    }}
                                    onMouseEnter={() => setIsHovered(true)}
                                    onMouseLeave={() => setIsHovered(false)}
                                />
                            </Box>
                        )}
                        <input
                            type='file'
                            accept='.jpg, .jpeg, .png'
                            style={{ display: 'none' }}
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />
                    </Paper>

                    {isSubmit && featuredImage.trim() === '' && (
                        <Typography sx={{ color: 'var(--error-color)', fontSize: '13px', margin: '8px 14px -5px' }}>
                            {t('COMMON.REQUIRED', { field: t('COMMON.POSTS.COVER') })}
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
    )
}
