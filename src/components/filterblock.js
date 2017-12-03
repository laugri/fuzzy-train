// @flow

import React, { Component } from 'react';
import type { Response, FacetValue } from 'types';
import { helper } from 'app';

type Props = {
  searchResults: ?Response,
  algoliaSearchHelper: helper,
  facet: string,
  blockName: string,
  isDisjunctive: boolean,
};

class FilterBlock extends Component<Props> {
  handleFacetClick = (
    e: SyntheticInputEvent<>,
    facet: string,
    isRefined: boolean,
    isDisjunctive: boolean = false
  ) => {
    const { algoliaSearchHelper } = this.props;
    const value = e.target.value;
    if (isDisjunctive) {
      if (isRefined) {
        algoliaSearchHelper
          .removeDisjunctiveFacetRefinement('food_type', value)
          .search();
      } else {
        algoliaSearchHelper
          .addDisjunctiveFacetRefinement('food_type', value)
          .search();
      }
    } else {
      algoliaSearchHelper.toggleFacetRefinement(facet, value).search();
    }
  };

  render() {
    const { searchResults, facet, blockName, isDisjunctive } = this.props;
    if (searchResults) {
      const facetValues = searchResults.getFacetValues(facet, {
        sortBy: ['count:desc', 'name:asc'],
      });
      return (
        <section className="FilterBlock">
          <h2 className="SectionTitle">{blockName}</h2>
          <div className="FacetValues">
            {facetValues.map((facetValue: FacetValue) => {
              const isRefined = facetValue.isRefined;
              const isRefinedModifier = isRefined
                ? 'FacetValues__Value--selected'
                : '';
              return (
                <div
                  key={facetValue.name}
                  className={`FacetValues__Value ${isRefinedModifier}`}
                >
                  <label>
                    <input
                      type="checkbox"
                      onChange={(e: SyntheticInputEvent<>) =>
                        this.handleFacetClick(
                          e,
                          facet,
                          isRefined,
                          isDisjunctive
                        )
                      }
                      value={facetValue.name}
                      checked={isRefined}
                    />
                    <span className="FacetValues__ValueName">
                      {facetValue.name}
                    </span>
                    <span className="FacetValues__ValueCount">
                      {facetValue.count}
                    </span>
                  </label>
                </div>
              );
            })}
          </div>
        </section>
      );
    } else {
      return null;
    }
  }
}
export default FilterBlock;
