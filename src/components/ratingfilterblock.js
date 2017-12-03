// @flow

import React, { Component } from 'react';
import type { Response } from 'types';
import { helper } from 'app';

type Props = {
  searchResults: ?Response,
  algoliaSearchHelper: helper,
};

class RatingFilterBlock extends Component<Props> {
  isRatingFilterActive(value: number) {
    const { algoliaSearchHelper } = this.props;
    return algoliaSearchHelper.getNumericRefinement('stars_count', '>=')
      ? algoliaSearchHelper
          .getNumericRefinement('stars_count', '>=')
          .indexOf(value) >= 0
      : false;
  }

  handleRatingFilterClick = (e: SyntheticInputEvent<>) => {
    const { algoliaSearchHelper } = this.props;
    const value = parseInt(e.target.value, 10);
    if (this.isRatingFilterActive(value)) {
      algoliaSearchHelper.removeNumericRefinement('stars_count');
    } else {
      algoliaSearchHelper.removeNumericRefinement('stars_count');
      algoliaSearchHelper.addNumericRefinement('stars_count', '>=', value);
    }
    algoliaSearchHelper.search();
  };

  renderRatingValueCheckbox(value: number) {
    const checked = this.isRatingFilterActive(value);
    return (
      <div>
        <label>
          <input
            type="checkbox"
            value={value}
            onChange={this.handleRatingFilterClick}
            checked={checked}
          />
          {value}+
        </label>
      </div>
    );
  }

  render() {
    const { searchResults } = this.props;
    if (searchResults) {
      return (
        <section className="FilterBlock">
          <h2 className="SectionTitle">Rating</h2>
          <div>
            {this.renderRatingValueCheckbox(4)}
            {this.renderRatingValueCheckbox(3)}
            {this.renderRatingValueCheckbox(2)}
            {this.renderRatingValueCheckbox(1)}
          </div>
        </section>
      );
    } else {
      return null;
    }
  }
}

export default RatingFilterBlock;
