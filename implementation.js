const fs = require("fs");
const Path = require("path");
const _ = require("lodash");


const sourceCache = {};

// eslint-disable-next-line jsdoc/require-jsdoc
function getSource(filename,[start,end]) {
  if (!sourceCache[filename]) {
    sourceCache[filename] = fs.readFileSync(Path.resolve(filename));
  }
  if (sourceCache[filename]) {
    return sourceCache[filename].toString().substring(start,end);
  }
  return null;
}

exports.handlers = {
  newDoclet: function({doclet}) {
    if (doclet.undocumented || (doclet.kind !== "function" && doclet.kind !== "class")) { return; }
    const meta = doclet.meta || {};
    const {filename,range} = meta;
    if (filename && range) {

      const columnno = meta.columnno || 0;
      const indent = _.range(0,columnno).map(()=>" ").join("");
      const src = `${indent}${getSource(filename,range)}`;
      
      doclet.implementation = src;
    }
  }
};
