const fs = require('fs');
const csv = require('csvtojson');

const args = process.argv.slice(2);
if (args.length !== 2) {
  console.log('You should provide two file paths');
  process.exit(1);
}

const restaurantsListFilePath = args[0];
const infoFilePath = args[1];

console.log(' - Parsing restaurant list');

const restaurantsList = JSON.parse(
  fs.readFileSync(restaurantsListFilePath, 'utf8')
);

csv({
  delimiter: ';',
})
  .fromFile(infoFilePath)
  .on('end_parsed', extractedInfo => {
    outputFile(restaurantsList, extractedInfo);
  })
  .on('done', error => {
    if (error) {
      console.warn(error);
    }
  });

function outputFile(restaurantsList, restaurantsInfo) {
  console.log(' - Saving file');
  const fileName = './algolia-resources/enriched_restaurants_list.json';
  fs.writeFile(
    fileName,
    JSON.stringify(
      buildEnrichedRestaurantList(restaurantsList, restaurantsInfo)
    ),
    err => {
      if (err) throw err;
      console.log(` ==> File saved under "${fileName}"`);
    }
  );
}

function buildEnrichedRestaurantList(restaurantsList, restaurantsInfo) {
  console.log(' - Merging metadata');
  return restaurantsList.map(restaurant => {
    const infos = findInfo(restaurantsInfo, restaurant);
    return { ...restaurant, ...typeInfoProperly(infos) };
  });
}

function typeInfoProperly(info) {
  return {
    ...info,
    objectID: parseInt(info.objectID, 10),
    stars_count: parseFloat(info.stars_count, 10),
    reviews_count: parseInt(info.reviews_count, 10),
  };
}

function findInfo(restaurantsInfo, restaurant) {
  return restaurantsInfo.find(info => {
    return doesRestaurantMatchInfo(restaurant, info);
  });
}

function doesRestaurantMatchInfo(restaurant, info) {
  return restaurant.objectID.toString() === info.objectID;
}
