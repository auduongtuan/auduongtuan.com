import { configureStore } from '@reduxjs/toolkit'
// import counterReducer from '../features/counter/counterSlice'
import { createSlice } from '@reduxjs/toolkit'

export interface RootState {
  app: {
    headerInView: boolean;
    menuOpened: boolean;
    pauseScrollEvent: boolean
  }

}

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    headerInView: true,
    menuOpened: false,
    pauseScrollEvent: false
  },
  reducers: {
    setHeaderInView: (state, param) => {
      state.headerInView = param.payload;
    },
    setMenuOpened: (state, param) => {
      state.menuOpened = param.payload;
    },
    setPauseScrollEvent: (state, param) => {
      state.pauseScrollEvent = param.payload;
    },
  }
})

// Action creators are generated for each case reducer function
export const { setHeaderInView, setMenuOpened, setPauseScrollEvent } = appSlice.actions
// selector

export default configureStore({
  reducer: {
    app: appSlice.reducer
  }
})