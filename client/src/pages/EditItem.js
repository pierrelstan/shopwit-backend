import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import { updateItem } from '../redux/actions/ItemsActions';
class EditItem extends Component {
  state = {
    id: '',
    title: '',
    description: '',
    price: '',
    imageUrl: '',
    quantityProducts: '',
  };

  UNSAFE_componentWillMount() {
    this.getItemDetails();
  }
  //   fix error binding
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  getItemDetails = () => {
    let store = localStorage.getItem('token');

    axios
      .get(`http://localhost:4000/item/${this.props.match.params.id}`, {
        headers: {
          Authorization: `Bearer ${store}`,
        },
      })
      .then((response) => {
        this.setState({
          id: this.props.match.params.id,
          title: response.data.title,
          description: response.data.description,
          price: response.data.price,
          imageUrl: response.data.imageUrl,
          quantityProducts: response.data.quantityProducts,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    let res = this.props.updateItem(this.state.id, this.state);
    if (res) {
      this.props.history.push('/');
    }
  };
  render() {
    console.log(this.props);
    const {
      title,
      description,
      imageUrl,
      price,
      quantityProducts,
    } = this.state;
    return (
      <div className='container'>
        <form onSubmit={this.handleSubmit}>
          <div>
            <label>Title</label>
            <input
              type='text'
              name='title'
              ref='title'
              value={title}
              onChange={this.handleChange}
            />
          </div>
          <div>
            <label>Description</label>
            <input
              type='text'
              name='description'
              ref='description'
              value={description}
              onChange={this.handleChange}
            />
          </div>
          <div>
            <label>Image</label>
            <input
              type='text'
              name='imageUrl'
              ref='imageUrl'
              value={imageUrl}
              onChange={this.handleChange}
            />
          </div>
          <div>
            <label>Quantity</label>
            <input
              type='number'
              name='quantityProducts'
              className='sell_input'
              ref='quantity'
              value={quantityProducts}
              onChange={this.handleChange}
              placeholder='Enter the quantity of the product'
            />
          </div>
          <div>
            <label>Price</label>
            <input
              type='number'
              name='price'
              className='sell_input'
              ref='price'
              value={price}
              onChange={this.handleChange}
            />
          </div>
          <input type='submit' value='Update' />
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});
// export default withRouter(EditItem);
export default withRouter(
  connect(mapStateToProps, {
    updateItem,
  })(withRouter(EditItem)),
);
