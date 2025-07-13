import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { data } from "react-router-dom";

export let CartContext = createContext(0)



export function CartContextProvider(props) {
    const [CardId, setCardId] = useState(null)
    const [TotalPrice, setTotalPrice] = useState(0)
    const [NumOfCartItem, setNumOfCartItem] = useState(0)
    const [Products, setProducts] = useState(null)


    let token = localStorage.getItem('usreToken')
    let headers = {
        token: localStorage.getItem('usreToken')
    };

    function resetCart() {
        setCardId(null)
        setNumOfCartItem(0)
        setProducts(null)
        setTotalPrice(0)
    }

    function addToCart(prodId) {
        return axios.post(`https://ecommerce.routemisr.com/api/v1/cart`, {
            productId: prodId
        }, {
            headers
        })
            .then((response) => {
                console.log(response);

                getUserCartItem()
                return response?.data
            })
            .catch((error) => {
                return error
                // console.log(error);

            })
    }

    function getUserCartItem() {
        axios.get(`https://ecommerce.routemisr.com/api/v1/cart`, {
            headers
        })
            .then((response) => {
                // console.log(response);
                setNumOfCartItem(response?.data?.numOfCartItems);
                setCardId(response?.data?.cartId);
                setProducts(response?.data?.data?.products);
                setTotalPrice(response?.data?.data?.totalCartPrice);

            })
            .catch((error) => {
                console.log(error);

            })
    }

    function updateCart(prodId, count) {
        return axios.put(`https://ecommerce.routemisr.com/api/v1/cart/${prodId}`, {
            count: count
        }, {
            headers
        }).then((response) => {
            setNumOfCartItem(response?.data?.numOfCartItems);
            setCardId(response?.data?.cartId);
            setProducts(response?.data?.data?.products);
            setTotalPrice(response?.data?.data?.totalCartPrice);
            return response
        }).catch((erroe) => {
            return erroe
        })
    }


    function deleteCartItem(prodId) {
        return axios.delete(`https://ecommerce.routemisr.com/api/v1/cart/${prodId}`, {
            headers
        }).then((response) => {
            setNumOfCartItem(response?.data?.numOfCartItems);
            setCardId(response?.data?.cartId);
            setProducts(response?.data?.data?.products);
            setTotalPrice(response?.data?.data?.totalCartPrice);
            return response
        }).catch((erroe) => {
            return erroe
        })
    }


    function deleteAllCartItem() {
        return axios.delete(`https://ecommerce.routemisr.com/api/v1/cart/`, {
            headers
        }).then((response) => {
            setNumOfCartItem(response?.data?.numOfCartItems);
            setCardId(response?.data?.cartId);
            setProducts(response?.data?.data?.products);
            setTotalPrice(response?.data?.data?.totalCartPrice);
            return response
        }).catch((erroe) => {
            return erroe
        })
    }

    useEffect(() => {
        if (token) {
            getUserCartItem()
        }
    }, [token])


    return <CartContext.Provider value={{ addToCart, updateCart, deleteCartItem, deleteAllCartItem, resetCart, Products, NumOfCartItem, TotalPrice, CardId }} >
        {props.children}
    </CartContext.Provider>
}