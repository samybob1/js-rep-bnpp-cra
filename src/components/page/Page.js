import React, { Component } from 'react';
import _ from 'underscore';
import axios from 'axios';

import Header from '../header/Header';
import Week from '../week/Week';

import './Page.css';

export default class Page extends Component {
  state = {
    ready: false,
    name: null,
    header: {
      supplier: null,
      contract: null,
      customer: null,
    },
    date: {
      month: null,
      year: null,
    },
    daysToCheck: {}
  };

  componentWillMount() {
    axios.get('state.json')
      .then(response => {
        this.setState({
          ...response.data,
          ready: true
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  render() {
    if (!this.state.ready) {
      return null;
    }

    return (
      <div className="page">
        {this.renderHeader()}
        {this.renderTables()}
        {this.renderTotal()}
      </div>
    );
  }

  renderHeader() {
    return (
      <Header
        date={this.state.date}
        name={this.state.name}
        supplier={this.state.header.supplier}
        contract={this.state.header.contract}
        customer={this.state.header.customer}
      />
    );
  }

  renderTables() {
    return (
      <div className="tables">
        {_.range(6).map((week) => (
          <Week
            key={week}
            week={week}
            date={this.state.date}
            daysToCheck={this.state.daysToCheck}
          />
        ))}
      </div>
    );
  }

  renderTotal() {
    return (
      <div id="total">
        {this.getTotal()}
      </div>
    );
  }

  getTotal() {
    return Object.values(this.state.daysToCheck).reduce(
      (total, dayToCheck) => total + (dayToCheck.fullDay ? 1 : 0.5),
      0
    );
  }
}
