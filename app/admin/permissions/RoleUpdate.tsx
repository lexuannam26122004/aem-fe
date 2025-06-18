import {
    Box,
    Button,
    Dialog,
    DialogActions,
    Switch,
    DialogContent,
    DialogTitle,
    TextField,
    Typography,
    FormControlLabel
} from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import LoadingButton from '@mui/lab/LoadingButton'
import { SaveIcon, XIcon } from 'lucide-react'
import { useUpdateRolesMutation } from '@/services/AspNetRoleService'
import { useToast } from '@/hooks/useToast'
import { IAspNetRoleUpdate } from '@/models/AspNetRole'
import { styled } from '@mui/material/styles'
import { SwitchProps } from '@mui/material/Switch'

interface Props {
    open: boolean
    name: string
    id: string
    isActive: boolean
    description: string
    handleClose: () => void
}

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

function DialogUpdate({ open, handleClose, name, description, isActive, id }: Props) {
    const { t } = useTranslation('common')
    const [roleName, setRoleName] = useState(name)
    const [roleDescription, setRoleDescription] = useState(description)
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmit, setIsSubmit] = useState(false)
    const [roleIsActive, setIsRoleIsActive] = useState(isActive)
    const [updateRole] = useUpdateRolesMutation()
    const toast = useToast()

    const handleSave = async () => {
        setIsSubmit(true)
        if (roleName.trim() === '' || roleDescription.trim() === '') return

        setIsLoading(true)

        const body = {
            id: id,
            name: roleName,
            description: roleDescription,
            isActive: roleIsActive
        } as IAspNetRoleUpdate

        try {
            await updateRole(body).unwrap()
            setIsSubmit(false)
            toast(t('COMMON.ROLES.SUCCESSFUL_UPDATE'), 'success')
            return true
        } catch (error) {
            toast(error?.data.detail, 'error')
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
                    {t('COMMON.ROLES.CREATE_TITLE')}
                </Typography>
                <Typography sx={{ fontSize: '14px', color: 'var(--label-title-color)', marginTop: '3px' }}>
                    {t('COMMON.ROLES.CREATE_DESCRIPTION')}
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
                        gap: '24px',
                        alignItems: 'end',
                        justifyContent: 'space-between',
                        width: '100%'
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
                                color: isSubmit && roleName.trim() === '' ? 'var(--error-color)' : 'var(--text-color)',
                                fontWeight: 'bold',
                                mb: '10px'
                            }}
                        >
                            {t('COMMON.ROLES.NAME')}
                        </Typography>

                        <TextField
                            fullWidth
                            placeholder={t('COMMON.ROLES.ENTER_NAME')}
                            value={roleName}
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
                                                isSubmit && roleName.trim() === ''
                                                    ? 'var(--error-color)'
                                                    : 'var(--placeholder-color)',
                                            opacity: 1
                                        }
                                    }
                                }
                            }}
                            error={isSubmit && roleName.trim() === ''}
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
                            onChange={e => setRoleName(e.target.value)}
                        />
                    </Box>

                    <FormControlLabel
                        sx={{
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
                                    setIsRoleIsActive(!roleIsActive)
                                }}
                                checked={roleIsActive}
                            />
                        }
                        label={t('COMMON.ACTIVE_BUTTON')}
                    />
                </Box>

                <Box
                    sx={{
                        flex: 1
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: '16px',
                            color:
                                isSubmit && roleDescription.trim() === '' ? 'var(--error-color)' : 'var(--text-color)',
                            fontWeight: 'bold',
                            mb: '10px'
                        }}
                    >
                        {t('COMMON.ROLES.DESCRIPTION')}
                    </Typography>

                    <TextField
                        fullWidth
                        placeholder={t('COMMON.ROLES.ENTER_DESCRIPTION')}
                        value={roleDescription}
                        multiline
                        rows={4}
                        slotProps={{
                            input: {
                                sx: {
                                    fontSize: '15px',
                                    borderRadius: '8px',
                                    color: 'var(--text-color)'
                                }
                            },
                            htmlInput: {
                                sx: {
                                    '&::placeholder': {
                                        color:
                                            isSubmit && roleDescription.trim() === ''
                                                ? 'var(--error-color)'
                                                : 'var(--placeholder-color)',
                                        opacity: 1
                                    }
                                }
                            }
                        }}
                        error={isSubmit && roleDescription.trim() === ''}
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
                        onChange={e => setRoleDescription(e.target.value)}
                    />
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

export default DialogUpdate
