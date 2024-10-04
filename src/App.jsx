import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import router from "./router.jsx";
import "react-toastify/dist/ReactToastify.css";
// import "./customToast.css";

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
}

export default App;
