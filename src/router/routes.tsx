import MainPageLayout from "../views/layout/mainPageLayout/MainPageLayout";
import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import Product from "../pages/Product";
import ProductDetail from "../pages/ProductDetail";
import Blog from "../pages/Blog";
import Contact from "../pages/Contact";
import MyAccount from "../pages/MyAccount";
import Cart from "../pages/Cart";
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainPageLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/about",
        element: <About/>,
      },
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/",
        element: <Home />,
      },
    ],
  },
]);

export default router;
