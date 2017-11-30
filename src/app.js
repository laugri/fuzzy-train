// @flow

import React, { Component } from 'react';
import './app.css';

import algoliasearch from 'algoliasearch';
// import algoliasearchHelper from 'algoliasearch-helper';
const client = algoliasearch('AA6Z3N1QN6', '606fb361d72620af82ded9d61fd5ce9b');
const index = client.initIndex('restaurants');
// const helper = algoliasearchHelper(client, 'restaurants', { hitsPerPage: 5 });

type Props = {};
type State = {
  inputValue: string,
  hits: Array<Object>,
};

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { inputValue: '', hits: [] };
  }

  handleChange = e => {
    const value = e.target.value;
    this.setState({ inputValue: value });
    index.search(value).then(results => {
      this.setState({ hits: results.hits });
      console.log(results.hits);
    });
  };

  render() {
    const { inputValue, hits } = this.state;
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
            <section className="Results">
              <h2 className="SectionTitle">34 Results found</h2>
              <ul>{hits.map(hit => <li>{hit.name}</li>)}</ul>
            </section>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
