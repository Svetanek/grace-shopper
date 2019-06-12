import axios from 'axios'

//Initial State
// const initialState = {
//   allItems: []
// }

// Action Type
const GET_CART = 'GET_CART'
const ADD_TO_CART = 'ADD_TO_CART'

//Action Creators
const getCart = items => ({type: GET_CART, items})
const addToCart = item => ({
  type: ADD_TO_CART,
  item
})

//Thunk Creators
export function addingToCart(userId, itemId, quantity) {
  return async dispatch => {
    try {
      const newCartItem = {
        productId: itemId,
        quantity: quantity,
        userId: userId
      }
      const {data} = await axios.post('/api/cart', newCartItem)
      dispatch(addToCart(data))
    } catch (error) {
      console.error(error)
    }
  }
}

export function getCartThunk() {
  return async dispatch => {
    try {
      //response.data =[]
      const {data} = await axios.get('/api/cart')
      dispatch(getCart(data))
    } catch (err) {
      console.log('error in cart get thunk')
    }
  }
}

//Reducer

export default function(state = [], action) {
  switch (action.type) {
    case GET_CART:
      // console.log("action", action);
      return action.items
    case ADD_TO_CART:
      const newItem = {
        userId: action.userId,
        productId: action.productId,
        quantity: action.quantity
      }
      return [...state, newItem]

    default:
      return state
  }
}
