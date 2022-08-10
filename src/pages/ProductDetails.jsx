import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import propTypes from 'prop-types';

class ProductDetails extends Component {
  state = {
    product: {},
    reviews: [],
    emailInput: '',
    reviewInput: '',
    rating: '',
    productId: '',
    reviewFormError: false,
    productsInCart: 0,
    freeShipping: false,
  };

  async componentDidMount() {
    this.getShoppingCartSize();
    await this.fetchProduct();
    this.getReviewsFromLocalStorage();
  }

  getShoppingCartSize = () => {
    const actualCart = JSON.parse(localStorage.getItem('cart'));
    if (actualCart) {
      const cartSize = actualCart.reduce((acc, curr) => acc + curr.quantity, 0);
      this.setState({
        productsInCart: cartSize,
      });
    }
  };

  getReviewsFromLocalStorage = () => {
    const { productId } = this.state;
    const reviews = JSON.parse(localStorage.getItem(productId));
    if (reviews) {
      this.setState({ reviews });
    }
  };

  fetchProduct = async () => {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    const URL = `https://api.mercadolibre.com/items/${id}`;
    const response = await fetch(URL);
    const data = await response.json();
    const {
      shipping: { free_shipping: freeShipping },
    } = data;
    this.setState({ product: data, productId: id, freeShipping });
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { emailInput, reviewInput, rating, productId } = this.state;
    const emailRegex = /\b[\w\\.-]+@[\w\\.-]+\.\w{2,4}\b/gi;
    const review = {
      email: emailInput,
      review: reviewInput,
      rating,
    };
    if (emailRegex.test(emailInput) && rating) {
      this.setState(
        (prevState) => ({
          reviews: [...prevState.reviews, review],
          emailInput: '',
          reviewInput: '',
          rating: '',
          reviewFormError: false,
        }),
        () => {
          const { reviews } = this.state;
          localStorage.setItem(productId, JSON.stringify(reviews));
        },
      );
    } else {
      this.setState({ reviewFormError: true });
    }
  };

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
      this.getShoppingCartSize();
    } else {
      localStorage.setItem('cart', JSON.stringify([cartItem]));
      this.getShoppingCartSize();
    }
  };

  render() {
    const {
      product: { thumbnail, title, price, id },
      emailInput,
      reviewInput,
      reviewFormError,
      rating,
      reviews,
      productsInCart,
      freeShipping,
    } = this.state;
    const inputs = ['1', '2', '3', '4', '5'];
    return (
      <div data-testid="product-detail-link">
        <img src={ thumbnail } alt={ title } data-testid="product-detail-image" />
        <p data-testid="product-detail-name">{title}</p>
        <p data-testid="product-detail-price">{price}</p>
        {freeShipping && <span data-testid="free-shipping">Frete Grátis</span>}
        <button
          type="button"
          data-testid="product-detail-add-to-cart"
          onClick={ () => this.addToCart(id, title, thumbnail, price) }
        >
          + carrinho
        </button>
        <Link to="/shopping-cart">
          <button type="button" data-testid="shopping-cart-button">
            carrinho
          </button>
        </Link>
        <span data-testid="shopping-cart-size">{productsInCart}</span>

        <div className="reviews">
          <h2>Reviews</h2>
          <div className="review-form">
            <form>
              <input
                data-testid="product-detail-email"
                type="email"
                name="emailInput"
                placeholder="email"
                onChange={ this.handleChange }
                value={ emailInput }
              />
              {inputs.map((input, index) => (
                <input
                  data-testid={ `${input}-rating` }
                  key={ index }
                  type="radio"
                  name="rating"
                  value={ input }
                  checked={ rating === input }
                  onChange={ this.handleChange }
                />
              ))}
              <textarea
                data-testid="product-detail-evaluation"
                name="reviewInput"
                placeholder="review"
                onChange={ this.handleChange }
                value={ reviewInput }
              />
              <button
                type="submit"
                data-testid="submit-review-btn"
                onClick={ this.handleSubmit }
              >
                submit
              </button>
              {reviewFormError && (
                <p data-testid="error-msg">Campos inválidos</p>
              )}
            </form>
          </div>
        </div>

        <div className="reviews">
          {reviews.map((review, index) => (
            <div key={ index } className="review">
              <p data-testid="review-card-email">{review.email}</p>
              <p data-testid="review-card-evaluation">{review.review}</p>
              <p data-testid="review-card-rating">{review.rating}</p>
            </div>
          ))}
        </div>
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
