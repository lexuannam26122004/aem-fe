import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '@/redux/store'
import { IUser } from '@/models/User'

interface UserState {
    userInfo: IUser | null
    cartCount?: number
    favoriteCount?: number
    isAuthenticated: boolean
}

const initialState: UserState = {
    userInfo: null,
    cartCount: 0,
    favoriteCount: 0,
    isAuthenticated: false
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserInfo(state, action: PayloadAction<IUser>) {
            state.userInfo = action.payload
            state.isAuthenticated = true
        },
        setCartCount(state, action: PayloadAction<number>) {
            state.cartCount = action.payload
        },
        setFavoriteCount(state, action: PayloadAction<number>) {
            state.favoriteCount = action.payload
        },
        clearUserInfo(state) {
            state.userInfo = null
            state.cartCount = 0
            state.favoriteCount = 0
            state.isAuthenticated = false
        }
    }
})

export const { setUserInfo, clearUserInfo, setCartCount, setFavoriteCount } = userSlice.actions

export const userSelector = (state: RootState) => state.user

export default userSlice.reducer
