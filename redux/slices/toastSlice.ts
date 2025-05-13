import { AlertColor, SnackbarOrigin, SxProps, Theme } from '@mui/material'
import { RootState } from '@/redux/store'
import { createSlice } from '@reduxjs/toolkit'
import { ReactNode } from 'react'

export interface IToast {
    id: string
    message: string
    typeToast: AlertColor
    variant?: 'filled' | 'standard' | 'outlined'
    icon?: ReactNode
    iconMapping?: Partial<Record<'success' | 'warning' | 'info' | 'error', ReactNode>>
    sx?: SxProps<Theme> | undefined
    anchorOrigin?: SnackbarOrigin | undefined
    hideDuration?: number
}

export const toastSlice = createSlice({
    name: 'toast',
    initialState: [] as IToast[],
    reducers: {
        addToast: (state, action) => {
            state.push(action.payload)
        },
        removeToast: (state, action) => {
            return state.filter(toast => toast.id !== action.payload)
        }
    }
})

export const toastSelector = (state: RootState) => state.toast
