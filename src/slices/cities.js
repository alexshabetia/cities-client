import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import CityService from "../services/CityService";

const initialState = { cities: [], totalPages: 0 };

export const getAllCitiesByOptionalName = createAsyncThunk(
  "cities/getAllByOptionalName",
  async ({ page, size, name }) => {
    const res = await CityService.getAll(page, size, name);
    return res.data;
  }
);

export const updateCity = createAsyncThunk(
  "cities/update",
  async ({ uuid, data }) => {
    const res = await CityService.update(uuid, data);
    return res.data;
  }
);

const citySlice = createSlice({
  name: "city",
  initialState,
  extraReducers: {
    [getAllCitiesByOptionalName.fulfilled]: (state, action) => {
      state.cities = action.payload.cities;
      state.totalPages = action.payload.totalPages;
    },
    [updateCity.fulfilled]: (state, action) => {
      const index = state.findIndex(
        (city) => city.uuid === action.payload.uuid
      );
      state[index] = {
        ...state[index],
        ...action.payload,
      };
    },
  },
});

const { reducer } = citySlice;
export default reducer;
