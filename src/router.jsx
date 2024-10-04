import { createBrowserRouter, redirect } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Homepage from "./pages/Homepage";
import MainLayout from "./layouts/MainLayout";
import CharacterCreation from "./pages/CharacterCreation";
import Battleground from "./pages/Battleground";
import Winpage from "./pages/Winpage";
import Losepage from "./pages/Losepage";
import Detailpage from "./pages/Detailpage";

const isSignedIn = () => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    return redirect("/login");
  } else {
    return null;
  }
};

const hasSigned = () => {
  if (localStorage.getItem("access_token")) {
    return redirect("/");
  } else {
    return null;
  }
};

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/register",
        element: <Register />,
        loader: hasSigned,
      },
      {
        path: "/login",
        element: <Login />,
        loader: hasSigned,
      },
      {
        path: "/",
        element: <Homepage />,
        loader: isSignedIn,
      },

      {
        path: "/create-character",
        element: <CharacterCreation />,
        loader: isSignedIn,
      },
      {
        path: "/battle/:battleId",
        element: <Battleground />,
        loader: isSignedIn,
      },
      {
        path: "/battle/:battleId/win",
        element: <Winpage />,
        loader: isSignedIn,
      },
      {
        path: "/battle/:battleId/lose",
        element: <Losepage />,
        loader: isSignedIn,
      },
    ],
  },
  {
    path: "/detail",
    element: <Detailpage />,
    loader: isSignedIn,
  },
]);

export default router;
