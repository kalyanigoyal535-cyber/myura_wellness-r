import MainPageLayout from "../views/layout/mainPageLayout/MainPageLayout";
import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainPageLayout/>,
    children: [
      {
        path: "/",
        element: <Home />,
      },

    ],
  },

]);

export default router;
