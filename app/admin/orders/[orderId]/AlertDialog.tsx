'use client'
import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import LoadingButton from '@mui/lab/LoadingButton'
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { convertToVietnamTime } from '@/common/format'
import { useTranslation } from 'react-i18next'

interface AlertDialogProps {
    title: string
    isLoading: boolean
    content: string
    status: string
    open: boolean
    buttonCancel: string
    buttonConfirm: string
    setOpen: (open: boolean) => void
    onConfirm: (deliveryTime?: string) => void // 👈 tham số tùy chọn
}

export default function AlertDialog({
    title,
    isLoading,
    content,
    buttonCancel,
    buttonConfirm,
    status,
    open,
    setOpen,
    onConfirm
}: AlertDialogProps) {
    const [datetime, setDatetime] = React.useState(dayjs().format('YYYY-MM-DDTHH:mm:ss'))
    const { t } = useTranslation('common')

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
                            mt: '8px',
                            fontSize: '15px',
                            textAlign: 'left',
                            color: 'var(--text-color)'
                        }}
                    >
                        {content}
                    </DialogContentText>

                    {status !== 'processing' && (
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                                label={
                                    status === 'shipping'
                                        ? t('COMMON.ORDER.CARRIER_DELIVERY_TIME')
                                        : t('COMMON.ORDER.DELIVERY_TIME')
                                }
                                value={dayjs(datetime)}
                                onChange={value => {
                                    setDatetime(convertToVietnamTime(value?.toDate() || new Date()))
                                }}
                                sx={{
                                    marginTop: '18px',
                                    width: '240px',
                                    '& .MuiInputBase-root': {
                                        color: 'var(--text-color)'
                                    },
                                    '& .MuiInputBase-input': {
                                        padding: '14px 0 14px 14px !important'
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: 'var(--label-title-color)'
                                    },
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderRadius: '8px',
                                        borderColor: 'var(--border-color)'
                                    },
                                    '& .MuiSvgIcon-root': {
                                        color: 'var(--label-title-color)' // Màu của icon (lịch)
                                    },
                                    '& .MuiOutlinedInput-root': {
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'var(--field-hover-color)' // Màu viền khi hover
                                        },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'var(--field-selected-color) !important' // Màu viền khi focus, thêm !important để ghi đè
                                        }
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: 'var(--field-color-selected)',
                                        fontWeight: 'bold'
                                    }
                                }}
                            />
                        </LocalizationProvider>
                    )}
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
                        onClick={() => {
                            if (status !== 'processing') {
                                onConfirm(datetime)
                            } else {
                                onConfirm()
                            }
                        }}
                        autoFocus
                        sx={{
                            borderRadius: '8px',
                            minWidth: '75px',
                            backgroundColor: 'var(--background-color-confirm-delete)',
                            fontWeight: 'bold',
                            '&:hover': {
                                backgroundColor: 'var(--background-color-confirm-delete-hover)'
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
                                backgroundColor: 'var(--background-color-item-hover)'
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
