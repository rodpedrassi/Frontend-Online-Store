import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class ShoppingCart extends Component {
  render() {
    const cart = JSON.parse(localStorage.getItem('cart'));
    function buildCart() {
      if (cart && cart.length > 0) {
        return cart.map((actual) => {
          const { id, title, thumbnail, price, quantity } = actual;
          return (
            <div key={ id }>
              <h3 data-testid="shopping-cart-product-name">{title}</h3>
              <img src={ thumbnail } alt={ id } />
              <p>{price}</p>
              <p data-testid="shopping-cart-product-quantity">{quantity}</p>
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
    return (
      <div>
        <Link to="/">
          <button type="button">Home</button>
        </Link>
        <h1>Carrinho de Compras</h1>
        <div>
          { buildCart() }
        </div>
      </div>
    );
  }
}
