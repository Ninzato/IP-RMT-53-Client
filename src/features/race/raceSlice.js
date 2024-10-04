import { createSlice } from "@reduxjs/toolkit";
import instance from "../../utils/axios";

const initialState = {
  race: [],
};

export const raceSlice = createSlice({
  name: "race",
  initialState,
  reducers: {
    setRace: (state, action) => {
      state.race = action.payload;
    },
  },
});

export const { setRace } = raceSlice.actions;

export default raceSlice.reducer;

export function fetchRace() {
  return async function fetchRaceData(dispatch) {
    try {
      const { data } = await instance({
        method: "GET",
        url: "/resource/races",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      });

      dispatch(setRace(data));
    } catch (err) {
      console.log(err);
    }
  };
}
