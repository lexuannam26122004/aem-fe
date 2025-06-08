import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '@/redux/store'
import { ICartItem, ICart } from '@/models/Cart'

interface CartState {
    carts: ICart[] | null
}

const initialState: CartState = {
    carts: null
}

export const generateLocalCartId = (productId: number, selections: ICartItem[]): number => {
    const selectionKey = selections
        .sort((a, b) => a.optionId - b.optionId)
        .map(sel => `${sel.optionId}-${sel.optionValueId}`)
        .join('_')
    console.log('generateLocalCartId', productId, selectionKey)
    const hash = `${productId}_${selectionKey}`
    return hashCode(hash)
}

const hashCode = (str: string): number => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        const chr = str.charCodeAt(i)
        hash = (hash << 5) - hash + chr
        hash |= 0
    }
    return Math.abs(hash)
}

export const cartSlice = createSlice({
    name: 'carts',
    initialState,
    reducers: {
        setCart(state, action: PayloadAction<ICart[]>) {
            state.carts = action.payload
        },
        addToCart(state, action: PayloadAction<ICart>) {
            if (!state.carts) {
                state.carts = [action.payload]
                return
            }

            const isSameSelection = (a: ICartItem[], b: ICartItem[]) => {
                if (a.length !== b.length) return false
                return a.every(itemA =>
                    b.some(itemB => itemA.optionId === itemB.optionId && itemA.optionValueId === itemB.optionValueId)
                )
            }

            const existingProduct = state.carts.find(
                product =>
                    product.productId === action.payload.productId &&
                    isSameSelection(product.selections, action.payload.selections)
            )

            if (existingProduct) {
                existingProduct.quantity += action.payload.quantity
            } else {
                state.carts.push(action.payload)
            }
        },
        removeFromCart(state, action: PayloadAction<{ id: number }>) {
            if (!state.carts) return

            state.carts = state.carts.filter(cart => cart.id !== action.payload.id)
        }
    }
})

export const { setCart, addToCart, removeFromCart } = cartSlice.actions

export const cartSelector = (state: RootState) => state.carts

export default cartSlice.reducer
