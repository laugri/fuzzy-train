// @flow

import React, { Component } from 'react';
import './stars.css';
import filledStar from 'assets/star-filled.png';
import emptyStar from 'assets/star-empty.png';

type Props = { rating: number };

class Stars extends Component<Props> {
  static defaultProps = {
    rating: 0,
  };

  renderStar(key: number, filled: boolean = false) {
    return (
      <img
        className="Star"
        src={filled ? filledStar : emptyStar}
        alt="star"
        key={key}
      />
    );
  }

  render() {
    const { rating } = this.props;
    const list = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        list.push(this.renderStar(i, true));
      } else {
        list.push(this.renderStar(i, false));
      }
    }
    return <span className="Stars">{list}</span>;
  }
}

export default Stars;
