const { parse } = require('uri-js');
const { addressParser } = require('smtp-address-parser');
const schemes = require('schemes');

function validate(address) {
  try {
    addressParser(address);
    return true;
  } catch (err) {
    return false;
  }
}

module.exports = (value) => {
  const iri = parse(value);
  console.log('iri', iri);
  if (iri.scheme === 'mailto' && iri.to.every(validate)) {
    return true;
  }
  if (
    (iri.reference === 'absolute' || iri.reference === 'uri') &&
    schemes.allByName[iri.scheme]
  ) {
    return true;
  }
  return false;
};
