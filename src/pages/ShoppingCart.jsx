import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class ShoppingCart extends Component {
  render() {
    return (
      <div>
        <Link to="/">
          <button type="button">Home</button>
        </Link>
        <h1>Carrinho de Compras</h1>
        <span data-testid="shopping-cart-empty-message">Seu carrinho está vazio</span>
      </div>
    );
  }
}
