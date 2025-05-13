import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Snackbar, Alert, Slide } from '@mui/material'
import { toastSlice, toastSelector } from '@/redux/slices/toastSlice'

const ToastContainer = () => {
    const dispatch = useDispatch()
    const toasts = useSelector(toastSelector)

    const handleClose = (id: string) => (_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') return
        dispatch(toastSlice.actions.removeToast(id))
    }

    const getAlertColor = (typeToast: string) => {
        switch (typeToast) {
            case 'success':
                return { backgroundColor: '#41ed48', color: '#fff' }
            case 'error':
                return { backgroundColor: '#f44336', color: '#fff' }
            case 'info':
                return { backgroundColor: '#00bbff', color: '#fff' }
            case 'warning':
                return { backgroundColor: '#ffdd00', color: '#fff' }
            default:
                return {}
        }
    }

    return (
        <>
            {toasts.slice(0, 5).map((toast, index) => (
                <Snackbar
                    key={toast.id}
                    open={true}
                    autoHideDuration={toast.hideDuration || 4000}
                    onClose={handleClose(toast.id)}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    TransitionComponent={Slide}
                    sx={{
                        mt: `${index * 62}px`,
                        transition: 'margin-top 0.3s ease-in-out'
                    }}
                >
                    <Alert
                        onClose={handleClose(toast.id)}
                        severity={toast.typeToast}
                        sx={{
                            // whiteSpace: 'pre-line',
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%',
                            height: '55px',
                            fontSize: '15px',
                            fontFamily: 'inherit',
                            ...getAlertColor(toast.typeToast),
                            '& .MuiAlert-icon': { color: '#fff', marginRight: '18px', fontSize: '24px' },
                            '& .MuiAlert-action': { marginTop: '-5px' },
                            borderRadius: '8px',
                            boxShadow: '0px 4px 6px rgba(0,0,0,0.1)'
                        }}
                        variant={toast.variant || 'standard'}
                    >
                        {toast.message}
                    </Alert>
                </Snackbar>
            ))}
        </>
    )
}

export default ToastContainer
