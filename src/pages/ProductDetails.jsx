import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import propTypes from 'prop-types';

class ProductDetails extends Component {
  state= {
    product: {},
  }

  componentDidMount() {
    this.fetchProduct();
  }

  fetchProduct = async () => {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    const URL = `https://api.mercadolibre.com/items/${id}`;
    const response = await fetch(URL);
    const data = await response.json();
    this.setState({ product: data });
  }

  addToCart = async (id, title, thumbnail, price) => {
    const cartItem = { id, title, thumbnail, price, quantity: 1 };
    const actualCart = JSON.parse(localStorage.getItem('cart'));
    let newCart = [];
    if (actualCart) {
      newCart = [cartItem, ...actualCart];
      if (actualCart.some((item) => item.id === cartItem.id)) {
        newCart = actualCart;
        newCart.forEach((item, i) => {
          if (item.id === cartItem.id) newCart[i].quantity += 1;
        });
      }
      localStorage.setItem('cart', JSON.stringify(newCart));
    } else localStorage.setItem('cart', JSON.stringify([cartItem]));
  };

  render() {
    const { product: { thumbnail, title, price, id } } = this.state;
    return (
      <div data-testid="product-detail-link">
        <img
          src={ thumbnail }
          alt={ title }
          data-testid="product-detail-image"
        />
        <p data-testid="product-detail-name">{ title }</p>
        <p data-testid="product-detail-price">{ price }</p>
        <button
          type="button"
          data-testid="product-detail-add-to-cart"
          onClick={ () => this.addToCart(id, title, thumbnail, price) }
        >
          + carrinho
        </button>
        <Link to="/shopping-cart">
          <button type="button" data-testid="shopping-cart-button">carrinho</button>
        </Link>
      </div>
    );
  }
}

ProductDetails.propTypes = {
  match: propTypes.shape({
    params: propTypes.shape({
      id: propTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default ProductDetails;
