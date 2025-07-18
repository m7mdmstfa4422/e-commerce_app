import { useState } from 'react'


import './App.css'
import '@fortawesome/fontawesome-free/css/all.min.css';

import {  createHashRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout/Layout';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import CounterContextProvider from './components/Context/CounterContext';
import Home from './components/Home/Home';
import UserContextProvider, { UserContext } from './components/Context/UserContext';
import Products from './components/Products/Products';
import ProdectRoute from './components/ProdectRoute/ProdectRoute';
import Cart from './components/Cart/Cart';
import ProductDitals from './components/ProductDitals/ProductDitals';
import { CartContextProvider } from './components/Context/CartContext';
import { Toaster } from 'react-hot-toast';
import CheckOut from './components/CheckOut/CheckOut';
import Brands from './components/Brands/Brands';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Categories from './components/Categories/Categories';

import { WishContextProvider } from './components/Context/WishListContext';
import VerifyResetCode from './components/VerifyResetCode/VerifyResetCode';
import ResetPassword from './components/ResetPassword/ResetPassword';
import Notheink from './components/Notheink/Notheink';
import ForgetPassword from './components/Forgetpassword/Forgetpassword';
import WishList from './components/WishList/WishList';

let queryClient = new QueryClient()

let router = createHashRouter([
  {
    path: '/', element: <Layout />, children: [{
      index: 'true', element: <ProdectRoute><Home /> </ProdectRoute>
    },
    { path: 'Products', element: <ProdectRoute><Products /></ProdectRoute> },
    { path: 'Categories', element: <ProdectRoute><Categories /></ProdectRoute> },
    { path: 'checkout', element: <ProdectRoute><CheckOut /></ProdectRoute> },
    { path: 'Cart', element: <ProdectRoute><Cart /></ProdectRoute> },
    { path: 'wishList', element: <ProdectRoute><WishList /></ProdectRoute> },
    { path: 'Brands', element: <ProdectRoute><Brands /></ProdectRoute> },
    { path: 'ProdactDitalis/:id/:category', element: <ProdectRoute><ProductDitals /></ProdectRoute> },
    { path: 'Register', element: <Register /> },
    { path: 'forgotpassword', element: <ForgetPassword /> },
    { path: 'verify-reset-code', element: <VerifyResetCode /> },
    { path: 'reset-password', element: <ResetPassword /> },
    { path: 'login', element: <Login /> },
    { path: '*', element: <Notheink /> }
    ]
  }
])
function App() {

  return <>
    {/* <RouterProvider router={router}></RouterProvider> */}

    <QueryClientProvider client={queryClient}>

      <UserContextProvider>
        <WishContextProvider>
          <CartContextProvider>
            <CounterContextProvider>
              <RouterProvider router={router} ></RouterProvider>
              <Toaster />
            </CounterContextProvider>
          </CartContextProvider>
        </WishContextProvider>

      </UserContextProvider>

    </QueryClientProvider>

  </>
}

export default App
