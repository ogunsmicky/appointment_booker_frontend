import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const getUserId = () => {
  const userData = JSON.parse(localStorage.getItem('userData'));
  return userData ? userData.id : null;
};

const url = 'https://doctors-appointment-3nvy.onrender.com/api/v1/users';
const BaseUrl = 'https://doctors-appointment-3nvy.onrender.com/api/v1';

export const fetchAllReservations = createAsyncThunk(
  'reservations/fetchAll',
  async () => {
    const userId = getUserId();
    if (userId === null) {
      return [];
    }

    try {
      const response = await axios(`${url}/${userId}/reservations`);
      return response.data.data;
    } catch (error) {
      return error;
    }
  },
);

export const deleteReservation = createAsyncThunk(
  'reservations/delete',
  async (id) => {
    const userId = getUserId();
    if (userId === null) {
      return id;
    }

    try {
      await axios.delete(`${url}/${userId}/reservations/${id}`);
      return id;
    } catch (error) {
      return error;
    }
  },
);

export const addReservation = createAsyncThunk(
  'reservations/add',
  async ({ doctorId, date, city }) => {
    const userId = getUserId();

    if (userId === null) {
      throw new Error('User ID not available');
    }

    try {
      const response = await axios.post(`${url}/${userId}/reservations`, {
        user_id: userId,
        doctor_id: doctorId,
        date,
        city,
      });

      return response.data.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Error adding reservation',
      );
    }
  },
);

export const fetchAllDoctors = createAsyncThunk(
  'doctors/fetchAll',
  async () => {
    try {
      const response = await axios(`${BaseUrl}/doctors`);
      return response.data;
    } catch (error) {
      return error;
    }
  },
);

const initialState = {
  reservations: [],
  doctors: [],
  isLoadingDoctors: false,
  isLoading: false,
  error: '',
};
const reservationsSlice = createSlice({
  name: 'reservations',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllReservations.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllReservations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reservations = action.payload;
      })
      .addCase(fetchAllReservations.rejected, (state, action) => {
        state.isLoading = false;
        state.action = [];
        state.error = action.error.message;
      })
      .addCase(deleteReservation.fulfilled, (state, action) => {
        const x = state.reservations.filter(
          (reservation) => reservation.id !== action.payload,
        );
        state.reservations = x;
      })
      .addCase(fetchAllDoctors.pending, (state) => {
        state.isLoadingDoctors = true;
      })
      .addCase(fetchAllDoctors.fulfilled, (state, action) => {
        state.isLoadingDoctors = false;
        state.doctors = action.payload;
      })
      .addCase(fetchAllDoctors.rejected, (state) => {
        state.isLoadingDoctors = false;
      });
  },
});

export default reservationsSlice.reducer;
