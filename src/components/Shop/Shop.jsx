import React, { useEffect, useState } from 'react';
import { addToDb, deleteShoppingCart, getShoppingCart } from '../../utilities/fakedb';
import Cart from '../Cart/Cart';
import Product from '../Product/Product';
import './Shop.css';
import { Link, useLoaderData } from 'react-router-dom';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const carts = useLoaderData();
    const [cart, setCart] = useState(carts);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);
   const [count, setCount] = useState(0);
    // const count = 76;
    const numberOfPages = Math.ceil(count/itemsPerPage);
    // const pages = [];
    // for(let i = 0; i < numberOfPages; i++){
    //     pages.push(i+1);
    // }
    const pages = [...Array(numberOfPages).keys()];
    console.log(pages);

    /**
     * done 1; get the total number of products
     * done 2:number of items per page
     * todo 3: get the current page
     */

    useEffect(() => {
        fetch(`http://localhost:5000/products?page=${currentPage}&size=${itemsPerPage} `)
            .then(res => res.json())
            .then(data => setProducts(data))
    }, [currentPage, itemsPerPage]);

    // useEffect(() => {
    //     const storedCart = getShoppingCart();
    //     const savedCart = [];
    //     // step 1: get id of the addedProduct
    //     for (const id in storedCart) {
    //         // step 2: get product from products state by using id
    //         const addedProduct = products.find(product => product._id === id)
    //         if (addedProduct) {
    //             // step 3: add quantity
    //             const quantity = storedCart[id];
    //             addedProduct.quantity = quantity;
    //             // step 4: add the added product to the saved cart
    //             savedCart.push(addedProduct);
    //         }
    //         // console.log('added Product', addedProduct)
    //     }
    //     // step 5: set the cart
    //     setCart(savedCart);
    // }, [products])

    useEffect(()=>{
        fetch('http://localhost:5000/productsCount')
        .then(response => response.json())
        .then(data => setCount(data.count))
    })

    const handleAddToCart = (product) => {
        // cart.push(product); '
        let newCart = [];
        // const newCart = [...cart, product];
        // if product doesn't exist in the cart, then set quantity = 1
        // if exist update quantity by 1
        const exists = cart.find(pd => pd._id === product._id);
        if (!exists) {
            product.quantity = 1;
            newCart = [...cart, product]
        }
        else {
            exists.quantity = exists.quantity + 1;
            const remaining = cart.filter(pd => pd._id !== product._id);
            newCart = [...remaining, exists];
        }

        setCart(newCart);
        addToDb(product._id)
    }

    const handleClearCart = () => {
        setCart([]);
        deleteShoppingCart();
    }

    const handleItemsPerPage = (e) => {
        console.log(e.target.value);
        setItemsPerPage(parseInt(e.target.value));
        setCurrentPage(0);
    }
    const handlePrevPage = (e) => {
        if(currentPage >0){
            setCurrentPage((pre)=> pre - 1);
        }
    }

    const handleNextPage = (e) => {
        if(currentPage < numberOfPages - 1){
            setCurrentPage((pre)=> pre + 1);
        }
    }

    return (
        <div className='shop-container'>
            <div className="products-container">
                {
                    products.map(product => <Product
                        key={product._id}
                        product={product}
                        handleAddToCart={handleAddToCart}
                    ></Product>)
                }
            </div>
            <div className="cart-container">
                <Cart
                    cart={cart}
                    handleClearCart={handleClearCart}
                >
                    <Link className='proceed-link' to="/orders">
                        <button className='btn-proceed'>Review Order</button>
                    </Link>
                </Cart>
            </div>
            <div className='pagination'>
                <p>Current page:{currentPage}</p>
                <button onClick={handlePrevPage}>Prev</button>
               {
                pages.map(page => <button className={currentPage === page ? 'selected' : undefined} key={page} onClick={() => setCurrentPage(page)}>{page}</button>)
               }
               <button onClick={handleNextPage}>Next</button>
               <select value={itemsPerPage} onChange={handleItemsPerPage} name="" id="">
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
               </select>
            </div>
        </div>
    );
};

export default Shop;