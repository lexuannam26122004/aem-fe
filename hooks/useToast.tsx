import { useDispatch } from 'react-redux'
import uuid from 'react-uuid'
import { toastSlice } from '@/redux/slices/toastSlice'

export function useToast() {
    const dispatch = useDispatch()

    return (message: string, typeToast: string) => {
        dispatch(
            toastSlice.actions.addToast({
                id: uuid(),
                message,
                typeToast
            })
        )
    }
}
