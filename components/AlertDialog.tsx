'use client'
import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import LoadingButton from '@mui/lab/LoadingButton'

interface AlertDialogProps {
    title: string
    isLoading: boolean
    content: string
    type: 'info' | 'warning' | 'error'
    open: boolean
    buttonCancel: string
    buttonConfirm: string
    setOpen: (open: boolean) => void
    onConfirm: () => void
}

export default function AlertDialog({
    title,
    isLoading,
    content,
    type,
    buttonCancel,
    buttonConfirm,
    open,
    setOpen,
    onConfirm
}: AlertDialogProps) {
    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'
                slotProps={{
                    paper: {
                        sx: {
                            borderRadius: '16px',
                            minWidth: '400px',
                            maxWidth: '500px',
                            backgroundColor: 'var(--background-color)'
                        }
                    }
                }}
            >
                {/* <DialogTitle
                    id='alert-dialog-title'
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: type === 'error' ? 'red' : type === 'info' ? 'blue' : 'yellow'
                    }}
                >
                    {type === 'error' && <ErrorIcon style={{ color: 'red', width: '50px' }} />}
                    {type === 'warning' && <WarningIcon style={{ color: '#ffd329', width: '40px', height: '40px' }} />}
                    {type === 'info' && <InfoIcon style={{ color: 'blue', width: '50px' }} />}
                </DialogTitle> */}
                <DialogContent
                    sx={{
                        padding: '18px 24px 18px !important'
                    }}
                >
                    <DialogContentText
                        sx={{ fontSize: '19px', fontWeight: 'bold', textAlign: 'left', color: 'var(--text-color)' }}
                    >
                        {title}
                    </DialogContentText>
                    <DialogContentText
                        id='alert-dialog-description'
                        sx={{
                            mt: '6px',
                            fontSize: '15px',
                            textAlign: 'left',
                            color: 'var(--text-color)'
                        }}
                    >
                        {content}
                    </DialogContentText>
                </DialogContent>
                <DialogActions
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'right',
                        paddingTop: '5px',
                        paddingRight: '24px',
                        paddingBottom: '24px',
                        gap: '10px',
                        borderLeft: `0.5px solid var(--border-alert-color)`,
                        borderRight: `0.5px solid var(--border-alert-color)`,
                        borderBottom: `0.5px solid var(--border-alert-color)`
                    }}
                >
                    <LoadingButton
                        variant='contained'
                        {...(isLoading && { loading: true })}
                        loadingPosition='start'
                        onClick={() => onConfirm()}
                        autoFocus
                        sx={{
                            borderRadius: '8px',
                            minWidth: '75px',
                            backgroundColor: 'var(--background-button-delete)',
                            fontWeight: 'bold',
                            '&:hover': {
                                backgroundColor: 'var(--background-button-delete-hover)'
                            },
                            fontSize: '15px',
                            textTransform: 'none'
                        }}
                    >
                        {buttonConfirm}
                    </LoadingButton>

                    <Button
                        variant='outlined'
                        onClick={() => setOpen(false)}
                        sx={{
                            color: 'var(--text-color)',
                            fontWeight: 'bold',
                            borderRadius: '8px',
                            minWidth: '75px',
                            borderColor: 'var(--border-color)',
                            fontSize: '15px',
                            '&:hover': {
                                backgroundColor: 'var(--background-button-confirm-cancel-hover)'
                            },
                            textTransform: 'none'
                        }}
                    >
                        {buttonCancel}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}
