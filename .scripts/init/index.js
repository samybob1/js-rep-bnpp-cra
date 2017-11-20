const { argv } = require('yargs');

const generateState = require('./state.js');

if (!argv.input) {
  console.error('Path to csv file required!');
  console.error('--------------------------');
  console.info('Usage: npm run pdf -- --input ../path/to/your/cra.csv');
  process.exit(1);
}

generateState();
