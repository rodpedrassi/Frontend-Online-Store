import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class ShoppingCart extends Component {
  state = {
    cart: [],
  }

  componentDidMount() {
    const shoppingCart = JSON.parse(localStorage.getItem('cart'));
    this.setState({ cart: shoppingCart });
  }

  handleRemoveItem = async (id) => {
    const actualCart = JSON.parse(localStorage.getItem('cart'));
    const item = actualCart.filter((C) => C.id !== id);
    localStorage.setItem('cart', JSON.stringify(item));
    this.setState({ cart: item });
  };

  handleQuantity = (quantity, id) => {
    const { cart } = this.state;
    const NewQuantity = cart.map((C) => C.id === id);
    console.log(quantity, id);
    console.log(NewQuantity);
  }

   buildCart = () => {
     const { cart } = this.state;
     if (cart && cart.length > 0) {
       return cart.map((actual) => {
         const { id, title, thumbnail, price, quantity } = actual;
         return (
           <div key={ id }>
             <h3 data-testid="shopping-cart-product-name">{title}</h3>
             <button
               onClick={ () => this.handleRemoveItem(id) }
               data-testid="remove-product"
               type="button"
             >
               X
             </button>
             <img src={ thumbnail } alt={ id } />
             <p>{price}</p>
             <button data-testid="product-decrease-quantity" type="button">-</button>
             <span data-testid="shopping-cart-product-quantity">{quantity}</span>
             <button
               onClick={ () => this.handleQuantity(quantity, id) }
               data-testid="product-increase-quantity"
               type="button"
             >
               +
             </button>
           </div>
         );
       });
     }
     return (
       <span data-testid="shopping-cart-empty-message">
         Seu carrinho está vazio
       </span>
     );
   }

   render() {
     return (
       <div>
         <Link to="/">
           <button type="button">Home</button>
         </Link>
         <h1>Carrinho de Compras</h1>
         <div>
           { this.buildCart() }
         </div>
       </div>
     );
   }
}
