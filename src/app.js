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

  componentDidMount() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          helper.setQueryParameter('aroundLatLng', `${latitude}, ${longitude}`);
        },
        error => {
          console.warn(error);
        }
      );
    }
  }

  handleRatingFilterClick = (e: SyntheticInputEvent<>) => {
    const value = e.target.value;
    helper
      .removeNumericRefinement('stars_count')
      .addNumericRefinement('stars_count', '>=', value)
      .search();
  };

  handleFoodTypeFacetClick = (e: SyntheticInputEvent<>) => {
    const value = e.target.value;
    helper.toggleFacetRefinement('food_type', value).search();
  };

  handleSearchInputChange = (e: SyntheticInputEvent<>) => {
    const value = e.target.value;
    this.setState({ inputValue: value });
    helper.setQuery(value).search();
  };

  renderRatingValueCheckbox(value: number) {
    const checked = helper.getNumericRefinement('stars_count', '>=')
      ? helper.getNumericRefinement('stars_count', '>=').indexOf(value) >= 0
      : false;
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

  renderRatingFilters() {
    const { searchResults } = this.state;
    if (searchResults) {
      return (
        <section className="FilterGroup">
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

  renderCuisineFilters() {
    const { searchResults } = this.state;
    if (searchResults) {
      const facetValues = searchResults.getFacetValues('food_type', {
        sortBy: ['count:desc', 'name:asc'],
      });
      return (
        <section className="FilterGroup">
          <h2 className="SectionTitle">Cuisine/Food type</h2>
          <div className="FacetValues">
            {facetValues.map((facetValue: FacetValue) => {
              const isRefinedModifier = facetValue.isRefined
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
                      onChange={this.handleFoodTypeFacetClick}
                      value={facetValue.name}
                      checked={facetValue.isRefined}
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
              autoFocus
              autoComplete="off"
              placeholder="Search for Restaurants by Name, Cuisine, Location"
              value={inputValue}
              onChange={this.handleSearchInputChange}
            />
          </header>
          <div className="Content">
            <section className="FilterBar">
              {this.renderCuisineFilters()}
              {this.renderRatingFilters()}
            </section>
            {this.renderResults()}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
