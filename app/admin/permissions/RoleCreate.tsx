import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import LoadingButton from '@mui/lab/LoadingButton'
import { SaveIcon, XIcon } from 'lucide-react'
import { useCreateRolesMutation } from '@/services/AspNetRoleService'
import { useToast } from '@/hooks/useToast'
import { IAspNetRoleCreate } from '@/models/AspNetRole'

interface Props {
    open: boolean
    handleClose: () => void
}

function DialogCreate({ open, handleClose }: Props) {
    const { t } = useTranslation('common')
    const [roleName, setRoleName] = useState('')
    const [description, setDescription] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmit, setIsSubmit] = useState(false)
    const [createRole] = useCreateRolesMutation()
    const toast = useToast()

    const handleSave = async () => {
        setIsSubmit(true)
        if (roleName.trim() === '' || description.trim() === '') return

        setIsLoading(true)

        const body = {
            name: roleName,
            description
        } as IAspNetRoleCreate

        try {
            await createRole(body).unwrap()
            setIsSubmit(false)
            toast(t('COMMON.ROLES.SUCCESSFUL_CREATE'), 'success')
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

                <Box
                    sx={{
                        flex: 1
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: '16px',
                            color: isSubmit && description.trim() === '' ? 'var(--error-color)' : 'var(--text-color)',
                            fontWeight: 'bold',
                            mb: '10px'
                        }}
                    >
                        {t('COMMON.ROLES.DESCRIPTION')}
                    </Typography>

                    <TextField
                        fullWidth
                        placeholder={t('COMMON.ROLES.ENTER_DESCRIPTION')}
                        value={description}
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
                                            isSubmit && description.trim() === ''
                                                ? 'var(--error-color)'
                                                : 'var(--placeholder-color)',
                                        opacity: 1
                                    }
                                }
                            }
                        }}
                        error={isSubmit && description.trim() === ''}
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
                        onChange={e => setDescription(e.target.value)}
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

export default DialogCreate
