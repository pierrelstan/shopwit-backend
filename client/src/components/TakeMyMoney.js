import React from 'react';
import StripeCheckout from 'react-stripe-checkout';

export default function TakeMyMoney(props) {
  return (
    <div className='checkout'>
      <StripeCheckout
        amount={props.subTotal}
        name='WIT'
        description={`Order of ${props.quantity} items!`}
        stripeKey='pk_test_dxcReE3fa16rOEUusnoX7EXY00bRxrmqpf'
        currency='USD'
        image={props.cartImage && props.cartImage}
        email={props.user.email}
        // token={console.log}
      >
        <button type='submit'>checkout</button>
      </StripeCheckout>
    </div>
  );
}
