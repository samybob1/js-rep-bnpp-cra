const fs = require('fs');
const path = require('path');
const moment = require('moment');
const { argv } = require('yargs');
const readlineSync = require('readline-sync');

const settings = require('../../settings.json');

module.exports = generateState;

function generateState() {
  // Read CSV file
  const csvPath = argv.input.startsWith('/') || argv.input.startsWith('~')
    ? argv.input
    : path.join(process.env.PWD, argv.input);

  const csv = fs.readFileSync(csvPath, 'utf-8');

  // Extract data
  const { date, name } = getMetadata(csv);
  const daysToCheck = getDaysToCheck(csv);

  // Display extracted data
  const total = Object.values(daysToCheck).reduce(
    (total, dayToCheck) => total + (dayToCheck.fullDay ? 1 : 0.5),
    0
  );

  console.info(`Date: ${date.format('MM/YYYY')}`);
  console.info(`Name: ${name}`);
  console.info(`Supplier: ${settings.supplier}`);
  console.info(`Contract: ${settings.contract}`);
  console.info(`Customer: ${settings.customer}`);
  console.info(`Total: ${total} days\n`);

  // Write state
  const state = {
    name,
    date: {
      month: date.get('month'),
      year: date.get('year')
    },
    header: settings,
    daysToCheck
  };

  const STATE_FILE_NAME = 'state.json';
  const DIST_PATH = path.join(process.env.PWD, 'dist');
  const data = JSON.stringify(state);
  const statePaths = [
    path.join(process.env.PWD, 'public', STATE_FILE_NAME)
  ];

  if (fs.existsSync(DIST_PATH)) {
    statePaths.push(path.join(DIST_PATH, STATE_FILE_NAME));
  }

  statePaths.forEach(statePath => {
    fs.writeFileSync(statePath, data);
  });

  console.info('State generated.');
}

function getMetadata(csv) {
  const regex = /([A-zÀ-ÿ ]+),,,(\d{1,2}),(\d{4})/;
  const [, name, month, year] = csv.match(regex);
  const date = moment(`${month} ${year}`, 'MM YYYY');

  return {
    name,
    date
  };
}

function getDaysToCheck(csv) {
  const regex = /(\d{2}\/\d{2}\/\d{4}).+(1,0|0,5)/g;
  const daysToCheck = {};
  let match;

  while (match = regex.exec(csv)) {
    const [, date, duration] = match;
    const fullDay = parseFloat(duration.replace(',', '.')) === 1;

    daysToCheck[date] = {
      date,
      fullDay,
      morning: null
    };
  }

  const halfDays = Object.values(daysToCheck)
    .filter(dayToCheck => !dayToCheck.fullDay);

  if (halfDays.length) {
    console.info(`${halfDays.length} half day(s) detected:`);

    halfDays.forEach(dayToCheck => {
      const query = `${dayToCheck.date}: did you work in the morning?`;
      daysToCheck[dayToCheck.date].morning = readlineSync.keyInYN(query);
    });

    console.info();
  }

  return daysToCheck;
}
