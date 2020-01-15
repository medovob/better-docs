const fs = require("fs");
const Path = require("path");
const _ = require("lodash");


const sourceCache = {};

// eslint-disable-next-line jsdoc/require-jsdoc
function getSource(path,filename,[start,end]) {
  const fullPath = Path.resolve(path,filename);
  if (!sourceCache[fullPath]) {
    sourceCache[fullPath] = fs.readFileSync(fullPath);
  }
  if (sourceCache[fullPath]) {
    return sourceCache[fullPath].toString().substring(start,end);
  }
  return null;
}

exports.handlers = {
  newDoclet: function({doclet}) {
    if (doclet.undocumented || (doclet.kind !== "function" && doclet.kind !== "class")) { return; }
    const meta = doclet.meta || {};
    const {filename,range,path} = meta;
    if (filename && range) {

      const columnno = meta.columnno || 0;
      const indent = _.range(0,columnno).map(()=>" ").join("");
      const src = `${indent}${getSource(path,filename,range)}`;
      
      doclet.implementation = src;
    }
  }
};
