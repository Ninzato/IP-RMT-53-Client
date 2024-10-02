# Redux

### Terminology

- state management
  > State management refers to the process of handling and controlling the data (state) within an application. It involves managing the flow of data, ensuring its consistency, and updating it as needed to reflect changes in the application's state.

- state
  > State represents the data that defines the current condition of the application. It can include user input, server responses, or any other dynamic information that the application needs to manage.

- redux
  > JavaScript library used for managing application state. Manage some data (the State) that is stored somewhere (the Store) and provide their users with functionalities to tie them all together (the Workflow).

- redux-toolkit
  > `Redux Toolkit` is a package designed to simplify Redux usage and boilerplate code. It provides utilities like configureStore, createSlice, and more to streamline Redux development and enhance developer productivity.

- store
  > The `store` in Redux is a single source of truth that holds the entire state tree of the application. It allows access to the state, dispatches actions to modify the state, and registers listeners to track state changes.

- Provider
  > The `Provider` is a React component used in Redux applications to make the Redux store available to the entire component tree. It ensures that Redux-connected components can access the Redux store and receive updates when the state changes.

- configureStore
  > `configureStore` is a function provided by Redux Toolkit to create a Redux store with sensible defaults. It simplifies the process of setting up a Redux store by automatically configuring middleware, including thunk middleware, and enabling development tools.

- slices/createSlice
  > Slices, created using the `createSlice` function in Redux Toolkit, are modular units that define a portion of the Redux state, along with its associated `reducers` and `actions`. Slices help organize the Redux state and logic into manageable pieces, enhancing code organization and maintainability.

- reducer/reducers
  > `Reducers` are pure functions in Redux that specify how the application's state changes in response to `actions`. They take the current state and an action as arguments, and return the new state based on the action type. Reducers are combined together to form the complete state tree.

- actions
  > `Actions` are payloads of information that send data from your application to the Redux store. They are plain JavaScript objects that contain a type field indicating the type of action being performed and additional data as needed.

- selector/useSelector
  > `Selectors` are functions used to extract specific pieces of data from the Redux store. They provide a way to access and derive values from the state in a predictable and efficient manner. useSelector is a React Redux hook used to subscribe to the Redux store and retrieve data from it within functional components.

- dispatch/useDispatch
  > `Dispatch` is a function provided by Redux used to dispatch actions to the Redux store. It takes an action object as an argument and triggers the corresponding reducer to update the state accordingly. `useDispatch` is a React Redux hook used to dispatch actions within functional components.

- mutable/immutable state
  > `Mutable` state refers to state that can be changed or modified after it is created, while immutable state refers to state that cannot be changed once it is set. Immutable state is favored in Redux to ensure predictable state changes and prevent unintended side effects.

- immer library
  > `Immer` is a JavaScript library used to simplify the process of immutable updates to complex data structures. It enables developers to write code that looks like mutable updates while ensuring immutability behind the scenes.

- currying
  > `Currying` is a functional programming technique where a function with multiple arguments is transformed into a sequence of nested functions, each taking a single argument. It allows for partial application of functions and enables the creation of more flexible and reusable code.

- thunk
  > The word `"thunk"` is a programming term that means "a piece of code that does some delayed work". In the context of Redux, thunks are middleware functions that enable the dispatch of asynchronous actions, such as fetching data from an API, within Redux action creators.

### SUMMARY

**1. Create a Redux store with `configureStore`**

- `configureStore` accepts a `reducer` function as a named argument
- `configureStore` automatically sets up the store with good default settings

  ```js
  // src/store.js

  import { configureStore } from "@reduxjs/toolkit";

  // create `store` using configureStore
  export const store = configureStore({
    reducer: {},
  });
  ```

**2. Provide the Redux store to the React application components**

- Put a React-Redux `<Provider>` component around your `<App />`
- Pass the Redux store as `<Provider store={store}>`

  ```jsx
  // src/main.jsx

  import React from "react";
  import ReactDOM from "react-dom";
  import App from "./App";
  import { store } from "./store";
  import { Provider } from "react-redux";

  ReactDOM.render(
    //  add React Redux Provider to react app
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById("root")
  );
  ```

**3. Create a Redux "slice" reducer with `createSlice`**

- Call `createSlice` with a string name, an initial state, and named reducer functions
- Reducer functions may "mutate" the state using Immer
- Export the generated slice reducer and action creators

  ```js
  // src/features/counter/counterSlice.js

  import { createSlice } from "@reduxjs/toolkit";

  const initialState = {
    value: 0,
  };

  export const counterSlice = createSlice({
    name: "counter",
    initialState,
    reducers: {
      increment: (state) => {
        state.value += 1;
      },
      decrement: (state) => {
        state.value -= 1;
      },
      incrementByAmount: (state, action) => {
        state.value += action.payload;
      },
    },
  });

  export const { increment, decrement, incrementByAmount } = counterSlice.actions;

  export default counterSlice.reducer;
  ```

  ```js
  // src/store.js

  // add the reducers to store
  import { configureStore } from "@reduxjs/toolkit";
  import counterReducer from "./features/counter/counterSlice";

  export const store = configureStore({
    reducer: {
      // add reducer here
      counter: counterReducer,
    },
  });
  ```

**4. Use the React-Redux `useSelector/useDispatch` hooks in React components**

- Read data from the store with the `useSelector` hook
- Get the `dispatch` function with the `useDispatch` hook, and dispatch actions as needed

  ```jsx
  // src/App.jsx

  import { useSelector, useDispatch } from "react-redux";

  import {
    increment,
    decrement,
    incrementByAmount,
  } from "./features/counter/counterSlice.js";

  export default function App() {
    const counter = useSelector((store) => store.counter.value);

    const dispatch = useDispatch();

    return (
      <div>
        <h4>Global Counter : {counter} </h4>
        <button onClick={() => dispatch(increment())}>Increment</button>
        <button onClick={() => dispatch(decrement())}>Decrement</button>
        <button onClick={() => dispatch(incrementByAmount(2))}>
          Increment by 2
        </button>
      </div>
    );
  }
  ```

**5. Use `Async function` in Redux**

- You should know about [`currying`](https://medium.com/@jakepintu/part-7-javascript-functions-currying-1f8b47c73a69)
  ```js
  // currying function
  const sum = function (a) {
    return function (b) {
      return function (c) {
        return a + b + c
      }
    }
  }

  // simpler way
  const sum2 = a => b => c => a + b + c
  const sum_x = sum2(7) // sum_x = b => c => 7 + b + c
  const sum_y = sum_x(3) // sum_y = c => 7 + 3 + c
  const sum_z = sum_y2(5) // sum_z = 7 + 3 + 5 // 15

  const sum_xyz = sum2(7)(3)(5) // 15
  ```
- You should know about [`thunk`](https://redux.js.org/usage/writing-logic-thunks)
  ```js
  const thunkFunction = (dispatch, getState) => {
    // logic here that can dispatch actions or read state
  }

  store.dispatch(thunkFunction)
  ```

- Handle async function like a boss with thunk in store
  ```js
  // do some asynchronous logic here
  function asyncIncrement(increment) {
    // use thunk here, thunk will get access to dispatch function through parameter
    return async function thunk(dispatch) {
      const delayedIncrement = new Promise((resolve) => {
        setTimeout(() => increment + 1000, 2000)
      })

      let totalIncrement = await delayedIncrement()
      dispatch(incrementByAmount(totalIncrement))
    }
  }
  ```

- For normal fetch, it'll looks like this
  ```jsx
  // Define a thunk that dispatches those action creators
  const fetchUserById = (id) => async (dispatch) => {
    dispatch(usersLoading()) // loading purpose
    const response = await usersAPI.fetchOne(id)
    dispatch(userReceived(response.data)) // dispatch data
  }

  // src/App.jsx
  import { useEffect } from "react"
  import { useSelector, useDispatch } from "react-redux";

  import {
    fetchUserById
  } from "./features/counter/counterSlice.js";

  export default function App() {
    const user = useSelector((store) => store.user.user);
    const dispatch = useDispatch();

    useEffect(() => {
      dispatch(fetchUserById(1))
    }, [])

    return (
      <div>
        <h4>Name : { user.name } </h4>
      </div>
    );
  }
  ```