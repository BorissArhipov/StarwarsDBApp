import React, { Component } from 'react';

import ErrorButton from '../error-button/error-button';

import './item-details.css';

import Spinner from '../spinner/spinner';

const Record = ({ item, field, label }) => {
  return (
    <li className="list-group-item">
      <span className="term">{label}</span>
      <span>{ item[field] }</span>
    </li>
  );
};

export {
  Record
};

export default class ItemDetails extends Component {

  state = {
    item: null,
    image: null,
    loading: false
  };

  componentDidMount() {
    this.updateItem();
  }

  componentDidUpdate(prevProps) {
    if (this.props.itemId !== prevProps.itemId ||
      this.props.getData !== prevProps.getData ||
      this.props.getImageUrl !== prevProps.getImageUrl) {
      this.updateItem();
      this.setState({
        loading: true
      });
    }
  }

  updateItem() {
    const { itemId, getData, getImageUrl } = this.props;
    if (!itemId) {
      return;
    }

    getData(itemId)
      .then((item) => {
        let img = require('../../img/none.jpg').default;
        let getImg = getImageUrl(item);
        getImg.then(res => {
          if(res != 'none') {
            img = res.url;
          };
          console.log(img);
          this.setState({
            item,
            image: img,
            loading: false
          });
        })
      });
  }

  render() {

    const { item, image, loading } = this.state;
    
    if (loading) {
      return <Spinner/>;
    }
    
    if (!item) {
      return <span>Select a item from a list</span>;
    }

    const { name } = item;

    return (
      <div className="item-details card">
        <div style={{backgroundImage: `url(${image})`}} className="item-image"></div>
        <div className="card-body">
          <h4>{name}</h4>
          <ul className="list-group list-group-flush">
            {
              React.Children.map(this.props.children, (child) => {
                return React.cloneElement(child, { item });
              })
            }
          </ul>
          <ErrorButton />
        </div>
      </div>
    );
  }
}
