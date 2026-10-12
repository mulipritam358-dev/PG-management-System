import {createSlice} from "@reduxjs/toolkit"

export const CounterSlice = createSlice({
    initialState: 0, 
    name: "Counter", 
    reducers: {
        increament: (state) => state + 1
    }
})

export const {increament} = CounterSlice.actions
export default CounterSlice.reducer