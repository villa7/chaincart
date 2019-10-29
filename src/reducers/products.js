import actions from '../actions'

const defaultState = {}

const reducer = (state = defaultState, { type, data }) => {
  let index

  switch (type) {
    case actions.set_products:
      return {
        ...state,
        [data.key]: data.value
      }
    case actions.add_product:
      return {
        ...state,
        [data.key]: state[data.key].concat(data.value)
      }
    case actions.remove_product:
      return {
        ...state,
        [data.key]: state[data.key].filter(x => x.hash !== data.value)
      }
    case actions.edit_product:
      const products = [...state[data.key]]
      index = products.findIndex(x => x.hash === data.key2)
      const item = products[index]
      products[index] = {
        ...item,
        ...data.value
      }
      return {
        ...state,
        [data.key]: products
      }
    default: return state
  }
}

export default reducer
