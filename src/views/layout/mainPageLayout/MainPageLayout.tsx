import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../../../components/Header";
import { CartProvider } from "../../../context/CartContext";
type Props = {};

const MainPageLayout = (props: Props) => {
  return (
    <div>
      <CartProvider>
        <Header />
        <div className="h-[88vh]">
          <Outlet />
        </div>
      </CartProvider>
    </div>
  );
};

export default MainPageLayout;
