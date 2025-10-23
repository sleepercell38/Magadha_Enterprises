import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getEventMetadataApi,
  createProjectEventApi,
  getProjectEventsApi,
  updateEventStatusApi,
  deleteEventApi,
} from "../../api/eventApi";

export const fetchEventMetadata = createAsyncThunk(
  "event/fetchMetadata",
  async (token, { rejectWithValue }) => {
    try {
      const data = await getEventMetadataApi(token);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch metadata");
    }
  }
);

export const createProjectEvent = createAsyncThunk(
  "event/createEvent",
  async ({ token, projectId, eventData }, { rejectWithValue }) => {
    try {
      const data = await createProjectEventApi(token, projectId, eventData);
      return data.event;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create event");
    }
  }
);

export const fetchProjectEvents = createAsyncThunk(
  "event/fetchProjectEvents",
  async ({ token, projectId }, { rejectWithValue }) => {
    try {
      const data = await getProjectEventsApi(token, projectId);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch events");
    }
  }
);

export const updateEventStatus = createAsyncThunk(
  "event/updateStatus",
  async ({ token, eventId, status }, { rejectWithValue }) => {
    try {
      await updateEventStatusApi(token, eventId, status);
      return { eventId, status };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update status");
    }
  }
);

export const deleteEvent = createAsyncThunk(
  "event/deleteEvent",
  async ({ token, eventId }, { rejectWithValue }) => {
    try {
      await deleteEventApi(token, eventId);
      return eventId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete event");
    }
  }
);

const eventSlice = createSlice({
  name: "event",
  initialState: {
    metadata: {},
    events: [],
    loading: false,
    metadataLoading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearEventState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEventMetadata.pending, (state) => {
        state.metadataLoading = true;
      })
      .addCase(fetchEventMetadata.fulfilled, (state, action) => {
        state.metadataLoading = false;
        state.metadata = action.payload;
      })
      .addCase(fetchEventMetadata.rejected, (state, action) => {
        state.metadataLoading = false;
        state.error = action.payload;
      })
      .addCase(createProjectEvent.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProjectEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events.unshift(action.payload);
        state.success = "Event created successfully";
      })
      .addCase(createProjectEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProjectEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProjectEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchProjectEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateEventStatus.fulfilled, (state, action) => {
        const event = state.events.find(e => e._id === action.payload.eventId);
        if (event) {
          event.status = action.payload.status;
        }
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.events = state.events.filter(e => e._id !== action.payload);
      });
  },
});

export const { clearEventState } = eventSlice.actions;
export default eventSlice.reducer;