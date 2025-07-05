// backend/utils/dataUri.js
const DatauriParser = require('datauri/parser');
const path = require('path');
const parser = new DatauriParser();

exports.dataUri = (file) => {
  return parser.format(
    path.extname(file.originalname).toString(),
    file.buffer
  );
};