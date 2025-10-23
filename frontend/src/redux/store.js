import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Auth/authSlice";
import projectReducer from "./Project/projectSlice";
import eventReducer from "./Project/eventSlice"; // Add this

export const store = configureStore({
  reducer: {
    auth: authReducer,
    project: projectReducer,
    event: eventReducer, // Add this
  },
});