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

  render() {
    const { product } = this.state;
    console.log(product);
    return (
      <div data-testid="product-detail-link">
        <img
          src={ product.thumbnail }
          alt={ product.title }
          data-testid="product-detail-image"
        />
        <p data-testid="product-detail-name">{ product.title }</p>
        <p data-testid="product-detail-price">{ product.price }</p>
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
