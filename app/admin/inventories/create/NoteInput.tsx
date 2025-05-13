'use client'

import { TextField } from '@mui/material'
import { memo, useEffect, useState } from 'react'

interface NoteInputProps {
    id: number
    value?: string
    onChange: (id: number, value: string) => void
    onBlur: (id: number) => void
}

function NoteInput({ id, value, onChange, onBlur }: NoteInputProps) {
    const [localValue, setLocalValue] = useState(value ?? '')

    useEffect(() => {
        setLocalValue(value ?? '')
    }, [value])

    return (
        <TextField
            value={localValue}
            onChange={e => {
                const newValue = e.target.value
                setLocalValue(newValue)
                onChange(id, newValue)
            }}
            onBlur={() => onBlur(id)}
            slotProps={{
                htmlInput: { maxLength: 80 }
            }}
            sx={{
                color: 'var(--text-color)',
                padding: '0px',
                width: '240px',
                '& fieldset': {
                    borderRadius: '10px',
                    borderColor: 'var(--border-color)'
                },
                '& .MuiInputBase-root': { padding: '10px 12px' },
                '& .MuiInputBase-input': {
                    padding: '0px',
                    color: 'var(--text-color)',
                    fontSize: '15px',
                    '&::placeholder': {
                        color: 'var(--placeholder-color)',
                        opacity: 1
                    }
                },
                '& .MuiOutlinedInput-root:hover fieldset': {
                    borderColor: 'var(--field-color-hover)'
                },
                '& .MuiOutlinedInput-root.Mui-focused fieldset': {
                    borderColor: 'var(--field-color-selected)',
                    borderWidth: '2px'
                }
            }}
        />
    )
}

export default memo(NoteInput)
