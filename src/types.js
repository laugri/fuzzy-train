type Highlight = {
  fullyHighlighted: ?boolean,
  matchLevel: string,
  matchedWords: Array<string>,
  value: string,
};

type PaymentOption = 'AMEX' | 'Discover' | 'MasterCard' | 'Visa';

export type Hit = {
  _geoloc: {
    lat: number,
    lng: number,
  },
  _highlightResult: {
    address: Highlight,
    area: Highlight,
    city: Highlight,
    country: Highlight,
    dining_style: Highlight,
    food_type: Highlight,
    image_url: Highlight,
    mobile_reserve_url: Highlight,
    name: Highlight,
    neighborhood: Highlight,
    payment_options: Array<Highlight>,
    phone: Highlight,
    phone_number: Highlight,
    postal_code: Highlight,
    price_range: Highlight,
    reserve_url: Highlight,
    state: Highlight,
  },
  address: string,
  area: string,
  city: string,
  country: string,
  dining_style: string,
  food_type: string,
  image_url: string,
  mobile_reserve_url: string,
  name: string,
  neighborhood: string,
  objectID: string,
  payment_options: Array<PaymentOption>,
  phone: string,
  phone_number: string,
  postal_code: string,
  price: 2,
  price_range: string,
  reserve_url: string,
  reviews_count: 98,
  stars_count: 4.1,
  state: string,
};

export type Response = {
  exhaustiveNbHits: boolean,
  hits: Array<Hit>,
  hitsPerPage: number,
  nbHits: number,
  nbPages: number,
  page: number,
  params: string,
  processingTimeMS: number,
  query: string,
};

