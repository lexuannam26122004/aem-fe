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
import { BrandApis } from '@/services/BrandService'
import { FeatureApis } from '@/services/FeatureService'
import { CategoryApis } from '@/services/CategoryService'
import { FavoriteApis } from '@/services/FavoriteService'

export const store = configureStore({
    reducer: {
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
        [FavoriteApis.reducerPath]: FavoriteApis.reducer
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(
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
            FavoriteApis.middleware
        )
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store
