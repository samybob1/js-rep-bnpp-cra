import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import './Header.css';

export default class Header extends Component {
  static propTypes = {
    date: PropTypes.shape({
      month: PropTypes.number.isRequired,
      year: PropTypes.number.isRequired,
    }).isRequired,
    name: PropTypes.string.isRequired,
    supplier: PropTypes.string.isRequired,
    contract: PropTypes.string.isRequired,
    customer: PropTypes.string.isRequired
  };

  render() {
    return (
      <header>
        <table id="header-left">
          <tbody>
          <tr>
            <td>{this.getDate()}</td>
          </tr>
          <tr>
            <td>{this.props.name}</td>
          </tr>
          <tr>
            <td>{this.props.supplier}</td>
          </tr>
          <tr>
            <td>{this.props.contract}</td>
          </tr>
          </tbody>
        </table>
        <div id="header-right">
          {this.props.customer}
        </div>
      </header>
    );
  }

  getDate() {
    return moment()
      .set('year', this.props.date.year)
      .set('month', this.props.date.month)
      .format('MM/YYYY');
  }
}
