import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class ShoppingCart extends Component {
  state = {
    cart: [],
  };

  componentDidMount() {
    const shoppingCart = JSON.parse(localStorage.getItem('cart'));
    this.setState({ cart: shoppingCart });
  }

  handleRemoveItem = (id) => {
    const { cart } = this.state;
    const item = cart.filter((C) => C.id !== id);
    this.setState({ cart: item });
    localStorage.setItem('cart', JSON.stringify(item));
  };

  handleQuantity = (event, id) => {
    const { cart } = this.state;
    const { name } = event.target;
    const itemIndex = cart.findIndex((item) => item.id === id);
    const { quantity, availableQuantity } = cart[itemIndex];
    if (name === 'increment' && quantity < availableQuantity) {
      cart[itemIndex].quantity = quantity + 1;
    } else if (quantity > 1 && name === 'decrement') {
      cart[itemIndex].quantity = quantity - 1;
    }
    this.setState({ cart });
    localStorage.setItem('cart', JSON.stringify(cart));
  };

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
            <button
              name="decrement"
              onClick={ (event) => this.handleQuantity(event, id) }
              data-testid="product-decrease-quantity"
              type="button"
            >
              -
            </button>
            <span data-testid="shopping-cart-product-quantity">{quantity}</span>
            <button
              name="increment"
              onClick={ (event) => this.handleQuantity(event, id) }
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
  };

  render() {
    return (
      <div>
        <Link to="/">
          <button type="button">Home</button>
        </Link>
        <Link to="/checkout">
          <button type="button" data-testid="checkout-products">
            Checkout
          </button>
        </Link>
        <h1>Carrinho de Compras</h1>
        <div>{this.buildCart()}</div>
      </div>
    );
  }
}
