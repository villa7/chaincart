import React, { Component } from 'react'
import { connect } from 'react-redux'
import { money } from '../util'
import { Route } from 'react-router-dom'
import { push } from 'connected-react-router'
import Modal from '../Modal'
import { Checkbox } from '../Input'
import './dashboard.scss'

class Products extends Component {
  constructor () {
    super()
    this.renderProductRow = this.renderProductRow.bind(this)
  }
  renderProductRow (product, i, a) {
    return (
      <tr key={i} onClick={e => this.props.dispatch(push(`/store/${this.props.store.id}/products/${product.id}`))}>
        <td>{product.name}</td>
        <td>{product.description}</td>
        <td>{money.fmt(product.price)}</td>
        <td>{product.infinite ? 'Infinite' : product.available}</td>
        <td>{product.sku}</td>
      </tr>
    )
  }
  render () {
    return (
      <div className='dashboard products'>
        <nav className='flex-container'>
          <h1 className='flex'>Products</h1>
          <input placeholder='Search' />
          <button className='btn'>Add product</button>
        </nav>
        <table cellSpacing='0' cellPadding='0' className='hover'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Available</th>
              <th>SKU</th>
            </tr>
          </thead>
          <tbody>
            {this.props.products.map(this.renderProductRow)}
          </tbody>
        </table>

        <Route path='/store/*/products/:id' children={({ match }) => {
          const product = match ? this.props.products.find(x => x.id === match.params.id) : null
          return (
            <Modal
              active={match !== null}
              onClose={e => this.props.dispatch(push('../products'))}
              onSave={data => console.log(data)}
              data={product ? {
                id: product.id,
                header: {
                  title: product.name,
                  subtitle: product.sku
                },
                footer: {},
                values: [{
                  name: 'Product name',
                  key: 'name',
                  value: product.name,
                  component: {
                    type: 'input',
                    props: {
                      placeholder: 'My product'
                    }
                  }
                }, {
                  name: 'Description',
                  key: 'description',
                  value: product.description,
                  component: {
                    type: 'textarea',
                    props: {
                      placeholder: 'Describe it!'
                    }
                  }
                }, {
                  name: 'Price',
                  key: 'price',
                  value: product.price,
                  convert: {
                    from (x) { return x * 100 },
                    to (x) { return x / 100 }
                  },
                  component: {
                    type: 'input',
                    props: {
                      type: 'number',
                      placeholder: '0.00'
                    }
                  }
                }, {
                  name: 'Stock',
                  key: 'available',
                  value: product.available,
                  component: {
                    type: 'input',
                    props: {
                      type: 'number',
                      placeholder: '0'
                    }
                  }
                }, {
                  name: 'Infinite?',
                  key: 'infinite',
                  value: product.infinite,
                  component: {
                    type: Checkbox,
                    props: {
                      id: 'product-infinite-' + product.id
                    }
                  }
                }]
              } : null} />
          )
        }} />
      </div>
    )
  }
}

const mapStateToProps = ({ storefronts }, props) => {
  return {
    store: storefronts.stores.find(x => x.id === props.id),
    products: storefronts.products[props.id]
  }
}

export default connect(mapStateToProps)(Products)
