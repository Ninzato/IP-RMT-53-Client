import { createSlice } from "@reduxjs/toolkit";
import instance from "../../utils/axios";

const initialState = {
  occupation: [],
};

export const occupationSlice = createSlice({
  name: "occupation",
  initialState,
  reducers: {
    setOccupation: (state, action) => {
      state.occupation = action.payload;
    },
  },
});

export const { setOccupation } = occupationSlice.actions;

export default occupationSlice.reducer;

export function fetchOccupation() {
  return async function fetchOccupationData(dispatch) {
    try {
      const { data } = await instance({
        method: "GET",
        url: "/resource/occupations",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      });
      dispatch(setOccupation(data));
    } catch (err) {
      console.log(err);
    }
  };
}
