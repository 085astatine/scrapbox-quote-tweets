'use strict';
module.exports = validate10;
module.exports.default = validate10;
const schema11 = {
  type: 'object',
  properties: {
    key: { type: 'string', enum: ['created_time', 'saved_time', 'username'] },
    order: { type: 'string', enum: ['asc', 'desc'] },
  },
  required: ['key', 'order'],
  additionalProperties: false,
};
function validate10(
  data,
  { instancePath = '', parentData, parentDataProperty, rootData = data } = {},
) {
  let vErrors = null;
  let errors = 0;
  if (data && typeof data == 'object' && !Array.isArray(data)) {
    if (data.key === undefined) {
      const err0 = {
        instancePath,
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'key' },
        message: "must have required property '" + 'key' + "'",
      };
      if (vErrors === null) {
        vErrors = [err0];
      } else {
        vErrors.push(err0);
      }
      errors++;
    }
    if (data.order === undefined) {
      const err1 = {
        instancePath,
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'order' },
        message: "must have required property '" + 'order' + "'",
      };
      if (vErrors === null) {
        vErrors = [err1];
      } else {
        vErrors.push(err1);
      }
      errors++;
    }
    for (const key0 in data) {
      if (!(key0 === 'key' || key0 === 'order')) {
        const err2 = {
          instancePath,
          schemaPath: '#/additionalProperties',
          keyword: 'additionalProperties',
          params: { additionalProperty: key0 },
          message: 'must NOT have additional properties',
        };
        if (vErrors === null) {
          vErrors = [err2];
        } else {
          vErrors.push(err2);
        }
        errors++;
      }
    }
    if (data.key !== undefined) {
      let data0 = data.key;
      if (typeof data0 !== 'string') {
        const err3 = {
          instancePath: instancePath + '/key',
          schemaPath: '#/properties/key/type',
          keyword: 'type',
          params: { type: 'string' },
          message: 'must be string',
        };
        if (vErrors === null) {
          vErrors = [err3];
        } else {
          vErrors.push(err3);
        }
        errors++;
      }
      if (
        !(
          data0 === 'created_time' ||
          data0 === 'saved_time' ||
          data0 === 'username'
        )
      ) {
        const err4 = {
          instancePath: instancePath + '/key',
          schemaPath: '#/properties/key/enum',
          keyword: 'enum',
          params: { allowedValues: schema11.properties.key.enum },
          message: 'must be equal to one of the allowed values',
        };
        if (vErrors === null) {
          vErrors = [err4];
        } else {
          vErrors.push(err4);
        }
        errors++;
      }
    }
    if (data.order !== undefined) {
      let data1 = data.order;
      if (typeof data1 !== 'string') {
        const err5 = {
          instancePath: instancePath + '/order',
          schemaPath: '#/properties/order/type',
          keyword: 'type',
          params: { type: 'string' },
          message: 'must be string',
        };
        if (vErrors === null) {
          vErrors = [err5];
        } else {
          vErrors.push(err5);
        }
        errors++;
      }
      if (!(data1 === 'asc' || data1 === 'desc')) {
        const err6 = {
          instancePath: instancePath + '/order',
          schemaPath: '#/properties/order/enum',
          keyword: 'enum',
          params: { allowedValues: schema11.properties.order.enum },
          message: 'must be equal to one of the allowed values',
        };
        if (vErrors === null) {
          vErrors = [err6];
        } else {
          vErrors.push(err6);
        }
        errors++;
      }
    }
  } else {
    const err7 = {
      instancePath,
      schemaPath: '#/type',
      keyword: 'type',
      params: { type: 'object' },
      message: 'must be object',
    };
    if (vErrors === null) {
      vErrors = [err7];
    } else {
      vErrors.push(err7);
    }
    errors++;
  }
  validate10.errors = vErrors;
  return errors === 0;
}
