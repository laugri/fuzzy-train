// @flow

import React, { Component } from 'react';
import './app.css';
import FilterBar from 'components/filterbar';
import Restaurant from 'components/restaurant';
import algoliasearch from 'algoliasearch';
import algoliasearchHelper from 'algoliasearch-helper';
import type { Response } from 'types';

const applicationID = 'AA6Z3N1QN6';
const apiKey = '606fb361d72620af82ded9d61fd5ce9b';
const indexName = 'restaurants_custom_payment';
const baseHitsPerPage = 3;
const client = algoliasearch(applicationID, apiKey);
const config = {
  disjunctiveFacets: ['food_type'],
  facets: ['payment_options', 'dining_style', 'city'],
  hitsPerPage: baseHitsPerPage,
};
export const helper = algoliasearchHelper(client, indexName, config);

type Props = {};
type State = {
  inputValue: string,
  searchResults: ?Response,
  hitsPerPage: number,
  isFilterBarMobileLayoutOn: boolean,
};

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      inputValue: '',
      searchResults: undefined,
      hitsPerPage: baseHitsPerPage,
      isFilterBarMobileLayoutOn: false,
    };

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
    helper.search();
  }

  isRatingFilterActive(value: number) {
    return helper.getNumericRefinement('stars_count', '>=')
      ? helper.getNumericRefinement('stars_count', '>=').indexOf(value) >= 0
      : false;
  }

  handleShowMoreButtonClick = (e: SyntheticEvent<>) => {
    const { hitsPerPage } = this.state;
    const newHitsPerPage = hitsPerPage + baseHitsPerPage;
    this.setState({ hitsPerPage: newHitsPerPage });
    helper.setQueryParameter('hitsPerPage', newHitsPerPage).search();
  };

  handleSearchInputChange = (e: SyntheticInputEvent<>) => {
    const value = e.target.value;
    this.setState({ inputValue: value });
    helper.setQuery(value).search();
  };

  renderResults() {
    const { searchResults, hitsPerPage } = this.state;
    if (searchResults) {
      const showButton = hitsPerPage < searchResults.nbHits;
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
            {searchResults.hits.map(hit => (
              <Restaurant hit={hit} key={hit.objectID} />
            ))}
          </div>
          <div className="Results__Footer">
            {showButton && (
              <button
                onClick={this.handleShowMoreButtonClick}
                className="ShowMoreButton"
              >
                Show more
              </button>
            )}
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
    const { inputValue, searchResults, isFilterBarMobileLayoutOn } = this.state;
    return (
      <div className="App">
        <div className="Card">
          <header className="SearchBar">
            <input
              className="SearchBar__Input"
              type="text"
              autoFocus
              autoComplete="off"
              placeholder="Search for Restaurants by Name, Cuisine, Location"
              value={inputValue}
              onChange={this.handleSearchInputChange}
              onFocus={e => e.target.select()}
            />
            <button
              className="MobileFilterToggle"
              onClick={() => {
                this.setState({
                  isFilterBarMobileLayoutOn: !this.state
                    .isFilterBarMobileLayoutOn,
                });
              }}
            >
              Toggle filters
            </button>
          </header>
          <div className="Container">
            <div className="Content">
              <FilterBar
                searchResults={searchResults}
                algoliaSearchHelper={helper}
                classNames={
                  isFilterBarMobileLayoutOn ? 'FilterBar--mobile' : ''
                }
              />
              {this.renderResults()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
