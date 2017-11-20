import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'underscore';

import './Week.css';

export default class Week extends Component {
  static propTypes = {
    date: PropTypes.shape({
      month: PropTypes.number.isRequired,
      year: PropTypes.number.isRequired,
    }).isRequired,
    week: PropTypes.number.isRequired,
    daysToCheck: PropTypes.objectOf(PropTypes.shape({
      date: PropTypes.string.isRequired,
      fullDay: PropTypes.bool.isRequired,
      morning: PropTypes.bool,
    })).isRequired
  };

  render() {
    return (
      <table className="week-table">
        <tbody>
        {_.range(3).map((row) => {
          const isDaysRow = row === 0;
          const isMorning = row === 1;

          return (
            <tr key={row}>
              {_.range(1, 8).map((day) => (
                <td key={day}>
                  {isDaysRow
                    ? this.renderDay(day)
                    : this.renderCheck(day, isMorning)}
                </td>
              ))}
            </tr>
          );
        })}
        </tbody>
      </table>
    );
  }

  getDate(day) {
    return moment()
      .set('year', this.props.date.year)
      .set('month', this.props.date.month)
      .startOf('month')
      .add(this.props.week, 'weeks')
      .isoWeekday(day);
  }

  renderDay(day) {
    return this.getDate(day).get('date');
  }

  renderCheck(day, isMorning) {
    const date = this.getDate(day).format('DD/MM/YYYY');
    const dayToCheck = this.props.daysToCheck[date];

    if (!dayToCheck) {
      return ' ';
    }

    if (dayToCheck.fullDay) {
      return 'X';
    }

    if (dayToCheck.morning) {
      return isMorning ? 'X' : ' ';
    }

    return isMorning ? ' ' : 'X';
  }
}
