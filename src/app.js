// @flow

import React, { Component } from 'react';
import './app.css';
import algoliasearch from 'algoliasearch';
import type { Hit, Response } from 'types';
const client = algoliasearch('AA6Z3N1QN6', '606fb361d72620af82ded9d61fd5ce9b');
const index = client.initIndex('restaurants');

type Props = {};
type State = {
  inputValue: string,
  searchResults: ?Response,
};

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { inputValue: '', searchResults: undefined };
  }

  handleChange = e => {
    const value = e.target.value;
    this.setState({ inputValue: value });
    index
      .search({ query: value, hitsPerPage: 10 })
      .then((results: Response) => {
        this.setState({ searchResults: results });
      });
  };

  renderHit(hit: Hit) {
    return (
      <li key={hit.objectID}>
        {hit.name} - {hit.area}
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
            }ms`}
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
              onChange={this.handleChange}
            />
          </header>
          <div className="Content">
            <section className="FilterBar">
              <section>
                <h2 className="SectionTitle">Cuisine/Food type</h2>
              </section>
              <section>
                <h2 className="SectionTitle">Rating</h2>
              </section>
              <section>
                <h2 className="SectionTitle">Payment Options</h2>
              </section>
            </section>
            {this.renderResults()}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
