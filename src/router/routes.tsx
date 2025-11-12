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
import BlogPost from "../blogPost/BlogPost";
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
        path: "/product",
        element: <Product/>,
      },
      {
        path: "/blog",
        element: <Blog />,
      },
      { path: "/blog/:slug",
       element: <BlogPost /> },
      {
        path: "/contact",
        element: <Contact/>,
      },
      {
        path: "/my-account",
        element: <MyAccount/>,
      },
      {
        path: "/cart",
        element: <Cart/>,
      },
    ],
  },
]);

export default router;
