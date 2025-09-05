import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {Provider} from "react-redux"
import App from './App.jsx'
import {configureStore} from "@reduxjs/toolkit"
import userReducer from "./redux/userSlice.js";

const store = configureStore({
  reducer: {
    user: userReducer,
  }
})
createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <StrictMode>
      <App />
    </StrictMode>,
  </Provider>
)
