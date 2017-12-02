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

  handleFilterClick = (e: any) => {
    const value = e.target.value;
    helper.toggleFacetRefinement('food_type', value).search();
  };

  handleInputChange = (e: any) => {
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
      <article className="Restaurant" key={hit.objectID}>
        <img src={hit.image_url} alt={hit.name} className="Restaurant__Image" />
        <div className="Restaurant__Info">
          <h2 className="Restaurant__Name">{hit.name}</h2>
          <p className="Restaurant__Rating">
            <span className="Restaurant__Rating__StarCount">
              {hit.stars_count}
            </span>{' '}
            <span className="Restaurant__Rating__ReviewCount">
              ({hit.reviews_count} reviews)
            </span>
          </p>
          <p className="Restaurant__Details">
            {hit.food_type} | {hit.neighborhood}
          </p>
        </div>
      </article>
    );
  }

  renderResults() {
    const { searchResults } = this.state;
    if (searchResults) {
      return (
        <section className="Results">
          <h1 className="SectionTitle">
            {searchResults.nbHits} results found
            <span className="Results__ProcessingTime">
              {' '}
              in {searchResults.processingTimeMS / 1000} seconds
            </span>
          </h1>
          <div className="Results__List">
            {searchResults.hits.map(hit => this.renderHit(hit))}
          </div>
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
