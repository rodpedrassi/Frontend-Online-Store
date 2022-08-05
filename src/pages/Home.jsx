import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getCategories } from '../services/api';

export default class Home extends Component {
  state = {
    categories: [],
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

  render() {
    const { categories } = this.state;
    return (
      <div>
        <Link data-testid="shopping-cart-button" to="/shopping-cart">
          <button type="button">ShoppingCart</button>
        </Link>
        <span data-testid="home-initial-message">
          Digite algum termo de pesquisa ou escolha uma categoria.
        </span>
        {
          categories.map(({ id, name }) => (
            <label data-testid="category" htmlFor={ id } key={ id }>
              { name }
              <input
                type="radio"
                id={ id }
                name="category"
              />
            </label>
          ))
        }
      </div>
    );
  }
}
