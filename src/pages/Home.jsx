import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getCategories, getProductsFromCategoryAndQuery } from '../services/api';

export default class Home extends Component {
  state = {
    categories: [],
    searchInput: '',
    products: [],
    categoryId: '',
  };

  componentDidMount() {
    this.fetchCategories();
  }

  fetchCategories = async () => {
    const categories = await getCategories();
    this.setState({
      categories,
    });
  }

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

  searchProducts = async (event) => {
    if (event) {
      event.preventDefault();
    }
    const { categoryId, searchInput } = this.state;
    if (categoryId || searchInput) {
      const { results } = await getProductsFromCategoryAndQuery(categoryId, searchInput);
      this.setState({ products: results });
    }
  }

  render() {
    const { categories, searchInput, products } = this.state;
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
        <div className="categories-radio">
          {
            categories.map(({ id, name }) => (
              <div key={ id }>
                <label data-testid="category" htmlFor={ id }>
                  { name }
                  <input
                    type="radio"
                    id={ id }
                    name="categoryId"
                    value={ id }
                    onChange={ this.handleChange }
                  />
                </label>
              </div>
            ))
          }
        </div>
        <div className="products-list">
          { products.length > 0 ? (
            <div>
              {
                products.map((product) => {
                  const { id, title, thumbnail, price } = product;
                  return (
                    <div key={ id } data-testid="product">
                      <h1>{ title }</h1>
                      <Link to={ `/product-details/${id}` }>
                        <img
                          src={ thumbnail }
                          alt={ title }
                          data-testid="product-detail-link"
                        />
                      </Link>
                      <span>{ price }</span>
                    </div>
                  );
                })
              }
            </div>
          ) : (
            <h1>Nenhum produto foi encontrado</h1>
          )}
        </div>

      </div>
    );
  }
}
