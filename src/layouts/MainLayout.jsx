import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="flex justify-center items-center relative h-screen p-10 ">
      <Outlet />
    </div>
  );
}
