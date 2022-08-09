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
  };

  async componentDidMount() {
    await this.fetchProduct();
    this.getReviewsFromLocalStorage();
  }

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
    this.setState({ product: data, productId: id });
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

  render() {
    const {
      product,
      productId,
      emailInput,
      reviewInput,
      reviewFormError,
      rating,
      reviews,
    } = this.state;
    console.log(productId);
    console.log(rating);
    const inputs = ['1', '2', '3', '4', '5'];
    return (
      <div data-testid="product-detail-link">
        <img
          src={ product.thumbnail }
          alt={ product.title }
          data-testid="product-detail-image"
        />
        <p data-testid="product-detail-name">{product.title}</p>
        <p data-testid="product-detail-price">{product.price}</p>
        <Link to="/shopping-cart">
          <button type="button" data-testid="shopping-cart-button">
            carrinho
          </button>
        </Link>

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
