import { configureStore } from "@reduxjs/toolkit";
import visibleReducer from "../features/visibility/visibleSlice";
import registerCustomerReducer from "../features/registerCustomer/registerCustomerSlice";

export const store = configureStore({
  reducer: {
    visibility: visibleReducer,
    registerCustomer: registerCustomerReducer,
  },
});
