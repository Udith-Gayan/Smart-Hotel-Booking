

import { createSlice } from '@reduxjs/toolkit'

const registerCustomerinitialState = {
    generatedSecretVisibility: false,
    registerCustomerVisibility: false
}

export const registerCustomerSlice = createSlice({
    name: 'registerCustomer',
    initialState: registerCustomerinitialState,
    reducers: {
        active: (state) => {
            state.registerCustomerVisibility = true
        },
        inactive: (state) => {
            state.registerCustomerVisibility = false
        },
        show: (state) => {
            state.generatedSecretVisibility = true
        },
        hide: (state) => {
            state.generatedSecretVisibility = false
        },
    },
})

export const { active, inactive, show, hide } = registerCustomerSlice.actions

export default registerCustomerSlice.reducer