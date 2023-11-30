'use strict';
module.exports = validate10;
module.exports.default = validate10;
const schema11 = {
  type: 'array',
  items: { type: 'string', pattern: '^[0-9]+$' },
};
const pattern0 = new RegExp('^[0-9]+$', 'u');
function validate10(
  data,
  { instancePath = '', parentData, parentDataProperty, rootData = data } = {},
) {
  let vErrors = null;
  let errors = 0;
  if (Array.isArray(data)) {
    const len0 = data.length;
    for (let i0 = 0; i0 < len0; i0++) {
      let data0 = data[i0];
      if (typeof data0 === 'string') {
        if (!pattern0.test(data0)) {
          const err0 = {
            instancePath: instancePath + '/' + i0,
            schemaPath: '#/items/pattern',
            keyword: 'pattern',
            params: { pattern: '^[0-9]+$' },
            message: 'must match pattern "' + '^[0-9]+$' + '"',
          };
          if (vErrors === null) {
            vErrors = [err0];
          } else {
            vErrors.push(err0);
          }
          errors++;
        }
      } else {
        const err1 = {
          instancePath: instancePath + '/' + i0,
          schemaPath: '#/items/type',
          keyword: 'type',
          params: { type: 'string' },
          message: 'must be string',
        };
        if (vErrors === null) {
          vErrors = [err1];
        } else {
          vErrors.push(err1);
        }
        errors++;
      }
    }
  } else {
    const err2 = {
      instancePath,
      schemaPath: '#/type',
      keyword: 'type',
      params: { type: 'array' },
      message: 'must be array',
    };
    if (vErrors === null) {
      vErrors = [err2];
    } else {
      vErrors.push(err2);
    }
    errors++;
  }
  validate10.errors = vErrors;
  return errors === 0;
}
