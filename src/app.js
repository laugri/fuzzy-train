// @flow

import React, { Component } from 'react';
import './app.css';

type Props = {};

class App extends Component<Props> {
  render() {
    return (
      <div className="App">
        <div className="Container">
          <header className="SearchBar">
            <input
              className="SearchBar__Input"
              type="text"
              placeholder="Search for Restaurants by Name, Cuisine, Location"
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
            </section>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
