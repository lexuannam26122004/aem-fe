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
        clearUser(state) {
            state.userInfo = null
            state.favoriteCount = 0
            state.isAuthenticated = false
        },
        clearCartCount(state) {
            state.cartCount = 0
        }
    }
})

export const { setUserInfo, clearUser, clearCartCount, setCartCount, setFavoriteCount } = userSlice.actions

export const userSelector = (state: RootState) => state.user

export default userSlice.reducer
