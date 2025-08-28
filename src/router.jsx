// src/router.jsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./layouts/RootLayout.jsx";
import Home from "./pages/Home.jsx";
import Work from "./pages/Work.jsx";

const router = createBrowserRouter([
  {
    element: <RootLayout />,       // mounts BackgroundFX once
    children: [
      { index: true, element: <Home /> },
      { path: "work", element: <Work /> },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
