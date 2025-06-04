import { configureStore } from '@reduxjs/toolkit'
import { toastSlice } from './slices/toastSlice'
import { sidebarSlice } from './slices/sidebarSlice'
import { supplierApis } from '@/services/SupplierService'
import { CouponApis } from '@/services/CouponService'
import { EmployeeApis } from '@/services/EmployeeService'
import { ProductApis } from '@/services/ProductService'
import { ReviewApis } from '@/services/ReviewService'
import { OrderApis } from '@/services/OrderService'
import { PurchaseOrderApis } from '@/services/PurchaseOrderService'
import { QuotationApis } from '@/services/QuotationService'
import { InventoryApis } from '@/services/InventoryService'
import { PaymentApis } from '@/services/PaymentService'
import { combineReducers } from 'redux'
import { BrandApis } from '@/services/BrandService'
import { FeatureApis } from '@/services/FeatureService'
import { CategoryApis } from '@/services/CategoryService'
import { FavoriteApis } from '@/services/FavoriteService'
import { InteractiveReviewApis } from '@/services/InteractiveReviewService'
import { CartApis } from '@/services/CartService'
import { UserAuthApis } from '@/services/UserAuthService'
import { userSlice } from './slices/userSlice'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // sử dụng localStorage
import { UserApis } from '@/services/UserService'
import { CustomerAddressApis } from '@/services/CustomerAddressService'
import { UserOrderApis } from '@/services/UserOrderService'
import { UserProjectApis } from '@/services/UserProjectService'
import { UserQuoteApis } from '@/services/UserQuoteService'

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['user'] // chỉ persist state 'user'
}
const rootReducer = combineReducers({
    [userSlice.name]: userSlice.reducer,
    [toastSlice.name]: toastSlice.reducer,
    [sidebarSlice.name]: sidebarSlice.reducer,
    [supplierApis.reducerPath]: supplierApis.reducer,
    [CouponApis.reducerPath]: CouponApis.reducer,
    [EmployeeApis.reducerPath]: EmployeeApis.reducer,
    [ProductApis.reducerPath]: ProductApis.reducer,
    [ReviewApis.reducerPath]: ReviewApis.reducer,
    [OrderApis.reducerPath]: OrderApis.reducer,
    [PurchaseOrderApis.reducerPath]: PurchaseOrderApis.reducer,
    [QuotationApis.reducerPath]: QuotationApis.reducer,
    [InventoryApis.reducerPath]: InventoryApis.reducer,
    [PaymentApis.reducerPath]: PaymentApis.reducer,
    [BrandApis.reducerPath]: BrandApis.reducer,
    [CategoryApis.reducerPath]: CategoryApis.reducer,
    [FeatureApis.reducerPath]: FeatureApis.reducer,
    [FavoriteApis.reducerPath]: FavoriteApis.reducer,
    [InteractiveReviewApis.reducerPath]: InteractiveReviewApis.reducer,
    [CartApis.reducerPath]: CartApis.reducer,
    [UserAuthApis.reducerPath]: UserAuthApis.reducer,
    [UserApis.reducerPath]: UserApis.reducer,
    [CustomerAddressApis.reducerPath]: CustomerAddressApis.reducer,
    [UserOrderApis.reducerPath]: UserOrderApis.reducer,
    [UserProjectApis.reducerPath]: UserProjectApis.reducer,
    [UserQuoteApis.reducerPath]: UserQuoteApis.reducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false
        }).concat(
            supplierApis.middleware,
            CouponApis.middleware,
            EmployeeApis.middleware,
            ProductApis.middleware,
            ReviewApis.middleware,
            OrderApis.middleware,
            PurchaseOrderApis.middleware,
            QuotationApis.middleware,
            InventoryApis.middleware,
            PaymentApis.middleware,
            BrandApis.middleware,
            CategoryApis.middleware,
            FeatureApis.middleware,
            FavoriteApis.middleware,
            InteractiveReviewApis.middleware,
            CartApis.middleware,
            UserAuthApis.middleware,
            UserApis.middleware,
            CustomerAddressApis.middleware,
            UserOrderApis.middleware,
            UserProjectApis.middleware,
            UserQuoteApis.middleware
        ) as any
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
