import { configureStore } from '@reduxjs/toolkit'
import { toastSlice } from './slices/toastSlice'
import { sidebarSlice } from './slices/sidebarSlice'
import { supplierApi } from '@/services/SupplierService'
import { CouponApis } from '@/services/CouponService'
import { EmployeeApi } from '@/services/EmployeeService'
import { ProductApis } from '@/services/ProductService'
import { ReviewApis } from '@/services/ReviewService'
import { OrderApis } from '@/services/OrderService'
import { PurchaseOrderApis } from '@/services/PurchaseOrderService'
import { QuotationApis } from '@/services/QuotationService'
import { InventoryApis } from '@/services/InventoryService'
import { PaymentApis } from '@/services/PaymentService'

export const store = configureStore({
    reducer: {
        [toastSlice.name]: toastSlice.reducer,
        [sidebarSlice.name]: sidebarSlice.reducer,
        [supplierApi.reducerPath]: supplierApi.reducer,
        [CouponApis.reducerPath]: CouponApis.reducer,
        [EmployeeApi.reducerPath]: EmployeeApi.reducer,
        [ProductApis.reducerPath]: ProductApis.reducer,
        [ReviewApis.reducerPath]: ReviewApis.reducer,
        [OrderApis.reducerPath]: OrderApis.reducer,
        [PurchaseOrderApis.reducerPath]: PurchaseOrderApis.reducer,
        [QuotationApis.reducerPath]: QuotationApis.reducer,
        [InventoryApis.reducerPath]: InventoryApis.reducer,
        [PaymentApis.reducerPath]: PaymentApis.reducer
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(
            supplierApi.middleware,
            CouponApis.middleware,
            EmployeeApi.middleware,
            ProductApis.middleware,
            ReviewApis.middleware,
            OrderApis.middleware,
            PurchaseOrderApis.middleware,
            QuotationApis.middleware,
            InventoryApis.middleware,
            PaymentApis.middleware
        )
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store
