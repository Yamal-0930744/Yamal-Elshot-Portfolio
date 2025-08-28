import { Outlet } from "react-router-dom";
import BackgroundFX from "../components/BackgroundFX";

export default function RootLayout() {
  return (
    <>
      {/* fixed, behind everything once for the whole app */}
      <BackgroundFX />
      {/* page content renders here (Home, Work, etc.) */}
      <Outlet />
    </>
  );
}
