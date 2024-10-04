import { configureStore } from "@reduxjs/toolkit";
import characterReducer from "./features/character/characterSlice";
import raceReducer from "./features/race/raceSlice";
import occupationReducer from "./features/occupation/occupationSlice";

export default configureStore({
  reducer: {
    character: characterReducer,
    race: raceReducer,
    occupation: occupationReducer,
  },
});
