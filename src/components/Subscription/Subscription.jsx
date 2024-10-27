import { loadStripe } from '@stripe/stripe-js'
import React from 'react'

export default function Subscription() {
    const handleClick = async e => {
        const stripe = await loadStripe("pk_test_51OslC72LvNyg7BqIEX3L73IkI1M9q66jxwtbHyXJrCZo12k3HdIrpbxdN0Bmyc0cBmZqWsibK5jBZ3PKc1kfnTaV00RDnn21cC")
        const { error } = stripe.redirectToCheckout({
            lineItems: [
                {
                    price: "price_1OtAwe2LvNyg7BqIuwxpSKSj",
                    quantity: 1,
                }
            ],
            mode: "subscription",
            successUrl: "http://localhost:3000/successfulPayment",
            cancelUrl: "http://localhost:3000/paymentError"
        })
    }
  return (
    <button onClick={handleClick}>Get subscription</button>
  )
}
