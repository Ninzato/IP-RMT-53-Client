import { createSlice } from "@reduxjs/toolkit";
import instance from "../../utils/axios";

const initialState = {
  character: null,
  loading: true,
};

export const characterSlice = createSlice({
  name: "character",
  initialState,
  reducers: {
    setCharacter: (state, action) => {
      state.character = action.payload;
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    removeCharacter: (state) => {
      state.character = null; // Set character to null on deletion
    },
  },
});

export const { setCharacter, setLoading, removeCharacter } =
  characterSlice.actions;

export default characterSlice.reducer;

export function fetchCharacter() {
  return async function fetchCharacterData(dispatch) {
    try {
      dispatch(setLoading(true));
      const { data } = await instance({
        method: "GET",
        url: `/characters/${localStorage.getItem("identifier")}`,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      });
      dispatch(setCharacter(data));
    } catch (err) {
      console.log(err);
    }
  };
}
