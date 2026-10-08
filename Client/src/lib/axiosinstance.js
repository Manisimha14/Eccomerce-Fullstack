import axios from "axios"
export const authinstance=axios.create({
    baseURL:"/api/customer",
    timeout:5000,
    withCredentials:true

})
export const productsinstance = axios.create({
  baseURL: "/api",
  timeout: 5000,
});
export const cartInstance = axios.create({
  baseURL: "/api/cart",
  timeout: 5000,
  withCredentials: true,
});
export const ordersInstance = axios.create({
  baseURL: "/api/orders",
  timeout: 15000,
  withCredentials: true,
});
