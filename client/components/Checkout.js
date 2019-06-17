import React, {Component} from 'react'
import {connect} from 'react-redux'
import {getCartThunk, emptyCart} from '../store/cart'

import {addItemsThunk, updateLastOrder} from '../store/orderHistory'
import Button from '@material-ui/core/Button'

import {Elements, StripeProvider} from 'react-stripe-elements'
import CheckoutForm from './CheckoutForm'

const defaultState = {
  firstName: '',
  lastName: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  zipCode: '',
  email: '',
  orderTotal: 0
}

class Checkout extends Component {
  constructor(props) {
    super(props)
    this.state = defaultState
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount() {
    const user = this.props.cartList[0].user
    let orderTotal = 0
    const items = this.props.cartList
    items.forEach(item => {
      const price = item.product.price * item.quantity
      orderTotal += price
    })
    this.setState({
      firstName: user.firstName,
      lastName: user.lastName,
      address1: user.address1,
      address2: user.address2,
      city: user.city,
      state: user.state,
      zipCode: user.zipCode,
      email: user.email,
      orderTotal: orderTotal
    })
    this.props.getCart()
  }
  //updates this.state
  handleChange(evt) {
    this.setState({
      [evt.target.name]: evt.target.value
    })
  }

  handleSubmit(evt) {
    // evt.preventDefault()

    const items = this.props.cartList
    const orderNumber = this.props.lastOrderNumber + 1
    this.props.updateLastOrder(orderNumber)
    items.map(item => {
      item.product.quantity = item.quantity
      item.product.orderNumber = orderNumber
      item.product.total = this.state.orderTotal
      this.props.addOrder(item.product)
    })
    this.props.emptyCart()
    this.props.history.push('/orderconfirmed')
  }

  render() {
    let item

    if (this.props.cartList[0]) {
      item = this.props.cartList[0].user
    } else {
      item = defaultState
    }

    return (
      <div>
        <form className="checkoutForm">
          <div>First Name: </div>
          <input
            name="firstName"
            type="text"
            value={this.state.firstName}
            onChange={this.handleChange}
            required
          />
          <div>Last Name: </div>
          <input
            name="lastName"
            type="text"
            value={this.state.lastName}
            onChange={this.handleChange}
            required
          />
          <div>Address 1: </div>
          <input
            name="address1"
            type="text"
            value={this.state.address1}
            onChange={this.handleChange}
            required
          />
          {/* <div>Address 2: </div>
        <input
          name="address2"
          type="text"
          value={item.address2}
          onChange={this.handleChange}
          required
        /> */}
          <div>City: </div>
          <input
            name="city"
            type="text"
            value={this.state.city}
            onChange={this.handleChange}
            required
          />
          <div>State: </div>
          <input
            name="state"
            type="text"
            value={this.state.state}
            onChange={this.handleChange}
            required
          />
          <div>Zip Code: </div>
          <input
            name="zipCode"
            type="text"
            value={this.state.zipCode}
            onChange={this.handleChange}
            required
          />
          <div>Email: </div>
          <input
            name="email"
            type="text"
            value={this.state.email}
            onChange={this.handleChange}
            required
          />
        </form>

        <StripeProvider apiKey="pk_test_x3CRlnur814woLKzHiOX9Feq00wXadZoZZ">
          <Elements>
            <CheckoutForm
              customer={this.state}
              handleSubmit={this.handleSubmit}
            />
          </Elements>
        </StripeProvider>
      </div>
    )
  }
}

/**
 * CONTAINER
 */
const mapStatetoProps = state => {
  return {
    cartList: state.cart,
    lastOrderNumber: state.orderHistory.lastOrderNum
  }
}

const mapDispatchToProps = dispatch => ({
  getCart: () => dispatch(getCartThunk()),
  addOrder: item => dispatch(addItemsThunk(item)),
  emptyCart: () => dispatch(emptyCart()),
  updateLastOrder: item => dispatch(updateLastOrder(item))
})

export default connect(mapStatetoProps, mapDispatchToProps)(Checkout)
