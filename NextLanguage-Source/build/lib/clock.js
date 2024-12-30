const date = require('date-and-time');

const now = new Date();
const pattern = date.compile('YYYY-MM-DD');
const currenttime = date.format(now, pattern);

module.exports = currenttime