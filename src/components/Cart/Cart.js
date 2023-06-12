import React from 'react'
import { useContext, useState } from 'react'

import classes from './Cart.module.css'
import Modal from '../UI/Modal'
import CartContext from '../../store/cart-context'
import CartItem from './CartItem'
import Checkout from './Checkout'

const Cart = props => {
    const [isCheckout, setIsCheckout] = useState(false)
    const [isSmubmitting, setIsSubmitting] = useState(false)
    const [didSubmit, setDidSubmit] = useState(false)


    const cartCtx = useContext(CartContext)

    const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`
    const hasItems = cartCtx.items.length > 0

    const cartItemRemoveHandler = id => {
        cartCtx.removeItem(id)

    }

    const cartItemAddHandler = item => {
        cartCtx.addItem({ ...item, amount: 1 })
    }

    const orderHandler = () => {
        setIsCheckout(true)

    }

    const submitOrderHandler = async (userData) => {
        setIsSubmitting(true)
        await fetch(`https://react-foodapp-http-21f37-default-rtdb.europe-west1.firebasedatabase.app/Orders.json`, {
            method: 'POST',
            body: JSON.stringify({
                user: userData,
                orderedItems: cartCtx.items,
            })
        });
        setIsSubmitting(false)
        setDidSubmit(true)
        cartCtx.clearCart();
    }

    const modalAction = <div className={classes.actions}>
        <button className={classes['button--alt']} onClick={props.onClose}>Close</button>
        {hasItems && <button className={classes.button} onClick={orderHandler}>Order</button>}
    </div>

    const cartItems = <ul className={classes['cart-items']}>{cartCtx.items.map(item => <CartItem key={item.id} name={item.name} amount={item.amount} price={item.price} onRemove={cartItemRemoveHandler.bind(null, item.id)} onAdd={cartItemAddHandler.bind(null, item)} />)}</ul>

    const cartModalContent = (
        <React.Fragment>
            {cartItems}
            < div className={classes.total} >
                <span>Total Amount</span>
                <span>{totalAmount}</span>
            </div >
            {isCheckout && <Checkout onConfrim={submitOrderHandler} onCancel={props.onClose} />}
            {!isCheckout && modalAction}
        </React.Fragment>
    )

    const isSmubmittingModalContent = <p>Sending order data...</p>


    const didSubmitModalContent = (
        <React.Fragment>
            <p>Successfully sent the order!</p>
            <div className={classes.actions}>
                <button className={classes.button} onClick={props.onClose}>Close</button>
            </div>
        </React.Fragment>
    )

    return <Modal onClose={props.onClose}>
        {!isSmubmitting && !didSubmit && cartModalContent}
        {isSmubmitting && isSmubmittingModalContent}
        {!isSmubmitting && didSubmit && didSubmitModalContent}

    </Modal>
}

export default Cart;