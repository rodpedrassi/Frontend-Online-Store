import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  getCategories,
  getProductsFromCategoryAndQuery,
} from '../services/api';

export default class Home extends Component {
  state = {
    categories: [],
    searchInput: '',
    products: [],
    categoryId: '',
    productsInCart: 0,
  };

  componentDidMount() {
    this.fetchCategories();
    this.getShoppingCartSize();
  }

  fetchCategories = async () => {
    const categories = await getCategories();
    this.setState({
      categories,
    });
  };

  handleChange = ({ target }) => {
    const { name, value } = target;
    if (name === 'categoryId') {
      this.setState({ [name]: value }, () => {
        this.searchProducts();
      });
    } else {
      this.setState({ [name]: value });
    }
  };

  getShoppingCartSize = () => {
    const actualCart = JSON.parse(localStorage.getItem('cart'));
    if (actualCart) {
      const cartSize = actualCart.reduce((acc, curr) => acc + curr.quantity, 0);
      this.setState({
        productsInCart: cartSize,
      });
    }
  };

  searchProducts = async (event) => {
    if (event) {
      event.preventDefault();
    }
    const { categoryId, searchInput } = this.state;
    if (categoryId || searchInput) {
      const { results } = await getProductsFromCategoryAndQuery(
        categoryId,
        searchInput,
      );
      this.setState({ products: results });
    }
  };

  addToCart = async (cartObject) => {
    const actualCart = JSON.parse(localStorage.getItem('cart'));
    let newCart = [];
    if (actualCart) {
      newCart = [...actualCart, cartObject];
      if (actualCart.some((item) => item.id === cartObject.id)) {
        newCart = actualCart;
        newCart.forEach((item, i) => {
          if (item.id === cartObject.id) newCart[i].quantity += 1;
        });
      }
      localStorage.setItem('cart', JSON.stringify(newCart));
      this.getShoppingCartSize();
    } else {
      localStorage.setItem('cart', JSON.stringify([cartObject]));
      this.getShoppingCartSize();
    }
  };

  render() {
    const { categories, searchInput, products, productsInCart } = this.state;
    return (
      <div>
        <Link data-testid="shopping-cart-button" to="/shopping-cart">
          <button type="button">ShoppingCart</button>
        </Link>
        <span data-testid="home-initial-message">
          Digite algum termo de pesquisa ou escolha uma categoria.
        </span>
        <form action="#">
          <input
            type="text"
            name="searchInput"
            id=""
            value={ searchInput }
            data-testid="query-input"
            onChange={ this.handleChange }
          />
          <button
            type="submit"
            data-testid="query-button"
            onClick={ this.searchProducts }
          >
            Pesquisar
          </button>
        </form>
        <span data-testid="shopping-cart-size">{productsInCart}</span>
        <div className="categories-radio">
          {categories.map(({ id, name }) => (
            <div key={ id }>
              <label data-testid="category" htmlFor={ id }>
                {name}
                <input
                  type="radio"
                  id={ id }
                  name="categoryId"
                  value={ id }
                  onChange={ this.handleChange }
                />
              </label>
            </div>
          ))}
        </div>
        <div className="products-list">
          {products.length > 0 ? (
            <div>
              {products.map((product) => {
                const {
                  id,
                  title,
                  thumbnail,
                  price,
                  available_quantity: availableQuantity,
                  shipping: { free_shipping: freeShipping },
                } = product;
                return (
                  <div key={ id } data-testid="product">
                    <h1>{title}</h1>
                    <Link to={ `/product-details/${id}` }>
                      <img
                        src={ thumbnail }
                        alt={ title }
                        data-testid="product-detail-link"
                      />
                    </Link>
                    <span>{price}</span>
                    <button
                      type="button"
                      data-testid="product-add-to-cart"
                      onClick={ () => this.addToCart({
                        id,
                        title,
                        thumbnail,
                        price,
                        quantity: 1,
                        availableQuantity,
                        freeShipping,
                      }) }
                    >
                      Adicionar ao Carrinho
                    </button>
                    {freeShipping && (
                      <span data-testid="free-shipping">Frete Grátis</span>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <h1>Nenhum produto foi encontrado</h1>
          )}
        </div>
      </div>
    );
  }
}
