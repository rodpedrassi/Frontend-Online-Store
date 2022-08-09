import React, { Component } from 'react';
import propTypes from 'prop-types';
import { Link } from 'react-router-dom';

class Checkout extends Component {
  state = {
    cartItems: [],
    name: '',
    email: '',
    cpf: '',
    phone: '',
    cep: '',
    address: '',
    payment: '',
    errorForm: false,
  };

  componentDidMount() {
    this.getCartFromLocalStorage();
  }

  getCartFromLocalStorage = () => {
    const cart = JSON.parse(localStorage.getItem('cart'));
    this.setState({ cartItems: cart });
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { name, email, cpf, phone, cep, address, payment } = this.state;
    if (
      name === ''
      || email === ''
      || cpf === ''
      || phone === ''
      || cep === ''
      || address === ''
      || payment === ''
    ) {
      this.setState({ errorForm: true });
    } else {
      this.setState({ errorForm: false });
      localStorage.removeItem('cart');
      this.setState({ cartItems: [] });
      const { history } = this.props;
      history.push('/');
    }
  };

  render() {
    const {
      cartItems,
      name,
      email,
      cpf,
      phone,
      cep,
      address,
      payment,
      errorForm,
    } = this.state;
    return (
      <div>
        <h1>Checkout</h1>
        <Link to="/">Home</Link>
        <Link to="/shopping-cart">Shopping Cart</Link>

        <div>
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div key={ item.id }>
                <h3>{item.title}</h3>
                <img src={ item.thumbnail } alt={ item.title } />
                <p>{item.quantity}</p>
                <p>{item.price * item.quantity}</p>
              </div>
            ))
          ) : (
            <p>No items in cart</p>
          )}
        </div>

        <div>
          <form>
            <label htmlFor="name">
              Nome Completo
              <input
                data-testid="checkout-fullname"
                type="text"
                name="name"
                onChange={ this.handleChange }
                value={ name }
              />
            </label>

            <label htmlFor="email">
              Email
              <input
                data-testid="checkout-email"
                type="text"
                name="email"
                onChange={ this.handleChange }
                value={ email }
              />
            </label>

            <label htmlFor="cpf">
              CPF
              <input
                data-testid="checkout-cpf"
                type="text"
                name="cpf"
                onChange={ this.handleChange }
                value={ cpf }
              />
            </label>

            <label htmlFor="phone">
              Telefone
              <input
                data-testid="checkout-phone"
                type="text"
                name="phone"
                onChange={ this.handleChange }
                value={ phone }
              />
            </label>

            <label htmlFor="cep">
              CEP
              <input
                data-testid="checkout-cep"
                type="text"
                name="cep"
                onChange={ this.handleChange }
                value={ cep }
              />
            </label>

            <label htmlFor="address">
              Endereço
              <input
                data-testid="checkout-address"
                type="text"
                name="address"
                onChange={ this.handleChange }
                value={ address }
              />
            </label>

            <label htmlFor="ticket">
              Boleto
              <input
                data-testid="ticket-payment"
                type="radio"
                name="payment"
                id="ticket"
                value="ticket"
                onChange={ this.handleChange }
                checked={ payment === 'ticket' }
              />
            </label>

            <label htmlFor="visa">
              Visa
              <input
                data-testid="visa-payment"
                type="radio"
                name="payment"
                id="visa"
                value="visa"
                onChange={ this.handleChange }
                checked={ payment === 'visa' }
              />
            </label>

            <label htmlFor="master">
              MasterCard
              <input
                data-testid="master-payment"
                type="radio"
                name="payment"
                id="master"
                value="master"
                onChange={ this.handleChange }
                checked={ payment === 'master' }
              />
            </label>

            <label htmlFor="elo">
              Elo
              <input
                data-testid="elo-payment"
                type="radio"
                name="payment"
                id="elo"
                value="elo"
                onChange={ this.handleChange }
                checked={ payment === 'elo' }
              />
            </label>

            <button
              type="submit"
              data-testid="checkout-btn"
              onClick={ this.handleSubmit }
            >
              Finalizar
            </button>
          </form>
          {errorForm && <p data-testid="error-msg">Campos inválidos</p>}
        </div>
      </div>
    );
  }
}

Checkout.propTypes = {
  history: propTypes.shape({
    push: propTypes.func.isRequired,
  }).isRequired,
};

export default Checkout;
