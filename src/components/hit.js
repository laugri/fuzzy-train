// @flow

import React, { Component } from 'react';
import type { Hit as HitType } from 'types';

type Props = {
  hit: HitType,
};

class Hit extends Component<Props> {
  render() {
    const hit = this.props.hit;
    return (
      <article className="Restaurant">
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
}

export default Hit;
