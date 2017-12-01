// @flow

import React, { Component } from 'react';
import './app.css';
import algoliasearch from 'algoliasearch';
import algoliasearchHelper from 'algoliasearch-helper';
import type { Hit, Response, FacetValue } from 'types';

const applicationID = 'AA6Z3N1QN6';
const apiKey = '606fb361d72620af82ded9d61fd5ce9b';
const indexName = 'restaurants';

const client = algoliasearch(applicationID, apiKey);
const config = {
  facets: ['food_type'],
  hitsPerPage: 10,
};
const helper = algoliasearchHelper(client, indexName, config);

type Props = {};
type State = {
  inputValue: string,
  searchResults: ?Response,
};

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { inputValue: '', searchResults: undefined };

    helper.on('result', (content: Response) => {
      this.setState({ searchResults: content });
    });
  }

  handleFilterClick = e => {
    const value = e.target.value;
    helper.toggleFacetRefinement('food_type', value).search();
  };

  handleInputChange = e => {
    const value = e.target.value;
    this.setState({ inputValue: value });
    helper.setQuery(value).search();
  };

  renderCuisineFilter() {
    const { searchResults } = this.state;
    if (searchResults) {
      const facetValues = searchResults.getFacetValues('food_type', {
        sortBy: ['count:desc', 'name:asc'],
      });
      return (
        <section>
          <h2 className="SectionTitle">Cuisine/Food type</h2>
          <div>
            {facetValues.map((facetValue: FacetValue) => {
              return (
                <div key={facetValue.name}>
                  <label>
                    <input
                      type="checkbox"
                      onChange={this.handleFilterClick}
                      value={facetValue.name}
                      checked={facetValue.isRefined}
                    />
                    {facetValue.name} ({facetValue.count})
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

  renderHit(hit: Hit) {
    return (
      <li key={hit.objectID}>
        <h3>
          {hit.name} ({hit.stars_count} - {hit.reviews_count} reviews)
        </h3>
        <p>
          {hit.food_type} - {hit.neighborhood}
        </p>
      </li>
    );
  }

  renderResults() {
    const { searchResults } = this.state;
    if (searchResults) {
      return (
        <section className="Results">
          <h2 className="SectionTitle">
            {`${searchResults.nbHits} results found in ${
              searchResults.processingTimeMS
            } ms`}
          </h2>
          <ul>{searchResults.hits.map(hit => this.renderHit(hit))}</ul>
        </section>
      );
    } else {
      return (
        <section className="Results">
          <h2 className="SectionTitle">No results</h2>
        </section>
      );
    }
  }

  render() {
    const { inputValue } = this.state;
    return (
      <div className="App">
        <div className="Container">
          <header className="SearchBar">
            <input
              className="SearchBar__Input"
              type="text"
              autoComplete="off"
              placeholder="Search for Restaurants by Name, Cuisine, Location"
              value={inputValue}
              onChange={this.handleInputChange}
            />
          </header>
          <div className="Content">
            <section className="FilterBar">
              {this.renderCuisineFilter()}
            </section>
            {this.renderResults()}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
