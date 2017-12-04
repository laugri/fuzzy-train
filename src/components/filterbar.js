// @flow

import React, { Component } from 'react';
import type { Response } from 'types';
import { helper } from 'app';
import FilterBlock from 'components/filterblock';
import RatingFilterBlock from 'components/ratingfilterblock';
import './filterbar.css';

type Props = {
  searchResults: ?Response,
  algoliaSearchHelper: helper,
};

class FilterBar extends Component<Props> {
  render() {
    const { searchResults, algoliaSearchHelper, classNames } = this.props;
    return (
      <section className={`FilterBar ${classNames}`}>
        <FilterBlock
          searchResults={searchResults}
          algoliaSearchHelper={algoliaSearchHelper}
          facet="food_type"
          blockName="Cuisine/Food Type"
          isDisjunctive={true}
        />
        <RatingFilterBlock
          searchResults={searchResults}
          algoliaSearchHelper={algoliaSearchHelper}
        />
        <FilterBlock
          searchResults={searchResults}
          algoliaSearchHelper={algoliaSearchHelper}
          facet="payment_options"
          blockName="Payment Options"
          isDisjunctive={true}
        />
        <FilterBlock
          searchResults={searchResults}
          algoliaSearchHelper={algoliaSearchHelper}
          facet="dining_style"
          blockName="Dining Style"
          isDisjunctive={true}
        />
        <FilterBlock
          searchResults={searchResults}
          algoliaSearchHelper={algoliaSearchHelper}
          facet="city"
          blockName="City"
          isDisjunctive={true}
        />
      </section>
    );
  }
}

export default FilterBar;
