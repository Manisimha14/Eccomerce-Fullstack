
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import Profile from "./components/Profile";
import { ToastContainer } from "react-toastify";
import CustomerProvider from "./context/CustomerProvider";
import Publicroute from "./routes/Publicroute";
import Protectedroute from "./routes/Protectedroute";
import Products from "./components/Products";
import ProductDetails from "./components/ProductDetails";
import Wishlist from "./components/Wishlist";
import Productadd from "./components/Productadd";
import Cart from "./components/Cart";
import CartProvider from "./context/CartProvider";
import Checkout from "./components/Checkout";
import Orders from "./components/Orders";
import OrderDetails from "./components/OrderDetails";

function App() {
  return (
    <>
      <CustomerProvider>
        <BrowserRouter>
          <CartProvider>
            <Routes>
              <Route path="/" element={<Home></Home>} />
              <Route
                path="/register"
                element={
                  <Publicroute>
                    <Register></Register>
                  </Publicroute>
                }
              ></Route>
              <Route
                path="/login"
                element={
                  <Publicroute>
                    <Login></Login>
                  </Publicroute>
                }
              ></Route>
              <Route
                path="/profile"
                element={
                  <Protectedroute>
                    <Profile></Profile>
                  </Protectedroute>
                }
              ></Route>
              <Route
                path="/wishlist"
                element={
                  <Protectedroute>
                    <Wishlist></Wishlist>
                  </Protectedroute>
                }
              ></Route>
              <Route
                path="/cart"
                element={
                  <Protectedroute>
                    <Cart />
                  </Protectedroute>
                }
              ></Route>
              <Route
                path="/checkout"
                element={
                  <Protectedroute>
                    <Checkout />
                  </Protectedroute>
                }
              ></Route>
              <Route
                path="/orders"
                element={
                  <Protectedroute>
                    <Orders />
                  </Protectedroute>
                }
              ></Route>
              <Route
                path="/orders/:id"
                element={
                  <Protectedroute>
                    <OrderDetails />
                  </Protectedroute>
                }
              ></Route>
              <Route
                path="/order-success/:id"
                element={
                  <Protectedroute>
                    <OrderDetails />
                  </Protectedroute>
                }
              ></Route>
              <Route
                path="/addProduct"
                element={
                  <Protectedroute>
                    <Productadd></Productadd>
                  </Protectedroute>
                }
              ></Route>
              <Route path="/products" element={<Products></Products>}></Route>
              <Route
                path="/products/:id"
                element={<ProductDetails></ProductDetails>}
              ></Route>
            </Routes>
          </CartProvider>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar
            closeOnClick
            pauseOnHover
            theme="dark"
          ></ToastContainer>
        </BrowserRouter>
      </CustomerProvider>
    </>
  );
}

export default App;
