// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Auth/authSlice";
import projectReducer from "../redux/Project/projectSlice"; 

export const store = configureStore({
  reducer: {
    auth: authReducer,
    project: projectReducer,
    
  },
});
